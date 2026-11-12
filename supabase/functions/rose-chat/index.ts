import "https://deno.land/std@0.224.0/dotenv/load.ts";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  stepCountIs,
  tool,
  type UIMessage,
} from "npm:ai@5.0.217";
import { z } from "npm:zod@^3.25.76";
import { createGoogleAiProvider, createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";
import { chooseRoseProvider, isQuotaRefusal, ROSE_MAX_RETRIES, ROSE_UNAVAILABLE, roseStreamErrorText } from "../_shared/rose-provider.ts";
import { createRoseTools, roseHistoryQuestions } from "../_shared/rose-tools.ts";
import { getRoseSystemPrompt, shouldShowRoseBookingLine } from "../_shared/rose-context.ts";
import { withRoseBookingLine } from "../_shared/rose-booking-line.ts";
import { retryIfEmpty, type RoseRetryInfo } from "../_shared/rose-empty-retry.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getRoseCuratedAnswer } from "../_shared/rose-curated-answers.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/** Send a narrow source-backed answer through the same UI-message protocol as streamText. */
const curatedRoseResponse = (text: string): Response => {
  const id = `rose-curated-${crypto.randomUUID()}`;
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: "start", messageId: id });
      writer.write({ type: "start-step" });
      writer.write({ type: "text-start", id });
      writer.write({ type: "text-delta", id, delta: text });
      writer.write({ type: "text-end", id });
      writer.write({ type: "finish-step" });
      writer.write({ type: "finish", finishReason: "stop" });
    },
  });
  const response = createUIMessageStreamResponse({ stream });
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, headers });
};

/** Same origins as rose-event: only the real site is measured, never a local or preview run. */
const MEASURED_ORIGINS = ["https://ivandemurard.com", "https://www.ivandemurard.com", "https://ivandemurard.lovable.app"];

/**
 * Records one empty-answer retry in rose_events: kind "empty_retry", outcome "recovered" or "still_empty", with the
 * page path and the session. Content-free: no question, no answer. Never delays or breaks the answer.
 */
const logEmptyRetry = (req: Request, body: { session_id?: unknown; page?: { path?: string } | null }, info: RoseRetryInfo) => {
  const origin = req.headers.get("origin");
  const sessionId = typeof body.session_id === "string" ? body.session_id : "";
  const path = body.page?.path;
  if (!origin || !MEASURED_ORIGINS.includes(origin) || sessionId.length < 1 || sessionId.length > 64 || !path || path.length > 200) return;
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return;
  const write = createClient(url, key)
    .from("rose_events")
    .insert({ session_id: sessionId, path, kind: "empty_retry", outcome: info.outcome })
    .then(({ error }) => { if (error) console.error("[rose-chat] empty_retry not recorded", error.code); })
    .catch(() => {});
  // Keep the write alive after the response has been sent.
  (globalThis as unknown as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }).EdgeRuntime?.waitUntil?.(write);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Google directly when GOOGLE_GENERATIVE_AI_API_KEY is set, the Lovable gateway otherwise.
  const choice = chooseRoseProvider(Deno.env);
  if (!choice) {
    return new Response(
      JSON.stringify({ error: "AI provider key missing" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  let body: { session_id?: string; messages?: UIMessage[]; page?: { path?: string; title?: string; section_id?: string; section_heading?: string } | null; suggested?: { label?: string; intent?: string | null } | null };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (messages.length > 40) {
    return new Response(JSON.stringify({ error: "too many messages" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // The caller may only supply user and assistant turns, made of plain text parts.
  // System instructions and tool results stay server-owned.
  const MessagesSchema = z
    .array(
      z.object({
        id: z.string().max(128).optional(),
        role: z.enum(["user", "assistant"]),
        // Earlier assistant turns also carry tool and step parts (suggest_followups,
        // propose_booking, step-start). Drop them and keep only text, so tool output
        // stays server-owned and multi-turn history validates.
        parts: z.preprocess(
          (v) =>
            Array.isArray(v)
              ? v.filter((p) => p && typeof p === "object" && (p as { type?: unknown }).type === "text")
              : v,
          z
            .array(
              z.object({
                type: z.literal("text"),
                text: z.string().max(4000),
              }),
            )
            .max(20),
        ),
      }),
    )
    .min(1)
    .max(40);

  const parsedMessages = MessagesSchema.safeParse(messages);
  if (!parsedMessages.success) {
    return new Response(JSON.stringify({ error: "invalid messages" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const safeMessages = parsedMessages.data as unknown as UIMessage[];
  if (safeMessages[safeMessages.length - 1].role !== "user") {
    return new Response(JSON.stringify({ error: "last message must be from the user" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }


  const provider = choice.kind === "google"
    ? createGoogleAiProvider(choice.apiKey)
    : createLovableAiGatewayProvider(choice.apiKey);
  const model = provider(choice.modelId);

  try {
    const last = safeMessages[safeMessages.length - 1] as unknown as { parts: { text: string }[] };
    const question = last.parts.map((p) => p.text).join(" ");
    const curatedAnswer = getRoseCuratedAnswer({ question, pagePath: body?.page?.path });
    if (curatedAnswer) return curatedRoseResponse(curatedAnswer);
    const previousQuestions = roseHistoryQuestions(safeMessages);
    const system = await getRoseSystemPrompt({ page: body?.page, suggested: body?.suggested, question, previousQuestions });
    const followupContext = { question, pagePath: body?.page?.path };
    // One model call. It is made again, once, if the first finishes with no text (retryIfEmpty).
    const callModel = () => streamText({
      model,
      system,
      messages: convertToModelMessages(safeMessages),
      // One step: tools are UI-only, so the model never continues after a tool call.
      stopWhen: stepCountIs(1),
      tools: createRoseTools({ tool, z }, followupContext),
      maxRetries: ROSE_MAX_RETRIES,
    });

    // A quota or credit refusal (402 or 429) reaches the dock as "rose_unavailable", not as a generic error.
    // On a profile question the interface adds a booking line under the answer: one data part after the text,
    // nothing else changes. Other turns stream exactly as before.
    // A model call that ends with no text is made once more before anything is streamed (retryIfEmpty).
    const uiStream = retryIfEmpty(
      () => callModel().toUIMessageStream({ onError: roseStreamErrorText }),
      { onRetry: (info) => logEmptyRetry(req, body, info) },
    );
    const streamResponse = createUIMessageStreamResponse({
      stream: shouldShowRoseBookingLine(question) ? withRoseBookingLine(uiStream) : uiStream,
    });
    const streamHeaders = new Headers(streamResponse.headers);
    for (const [key, value] of Object.entries(corsHeaders)) {
      streamHeaders.set(key, value);
    }
    return new Response(streamResponse.body, { status: streamResponse.status, headers: streamHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[rose-chat] error", message);
    if (isQuotaRefusal(err)) {
      return new Response(JSON.stringify({ error: ROSE_UNAVAILABLE }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
