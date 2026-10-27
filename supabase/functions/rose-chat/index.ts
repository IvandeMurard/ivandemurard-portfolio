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
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";
import { getRoseSystemPrompt } from "../_shared/rose-context.ts";
import { getRoseCuratedAnswer } from "../_shared/rose-curated-answers.ts";
import { isRoseFollowupAllowed, ROSE_BOOKING_TOOL_DESCRIPTION, ROSE_FOLLOWUPS_TOOL_DESCRIPTION, roseFollowupPolicyDescription, shouldSuppressRoseFollowups } from "../_shared/rose-tool-contract.ts";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) {
    return new Response(
      JSON.stringify({ error: "LOVABLE_API_KEY missing" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  let body: { messages?: UIMessage[]; page?: { path?: string; title?: string; section_id?: string; section_heading?: string } | null; suggested?: { label?: string; intent?: string | null } | null };
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


  const gateway = createLovableAiGatewayProvider(key);
  const model = gateway("google/gemini-3-flash-preview");

  try {
    const last = safeMessages[safeMessages.length - 1] as unknown as { parts: { text: string }[] };
    const question = last.parts.map((p) => p.text).join(" ");
    const curatedAnswer = getRoseCuratedAnswer({ question, pagePath: body?.page?.path });
    if (curatedAnswer) return curatedRoseResponse(curatedAnswer);
    const previousQuestions = safeMessages.slice(-20, -1)
      .filter(message => message.role === "user")
      .map(message => message.parts.filter(part => part.type === "text").map(part => part.type === "text" ? part.text : "").join(" "));
    const system = await getRoseSystemPrompt({ page: body?.page, suggested: body?.suggested, question, previousQuestions });
    const followupContext = { question, pagePath: body?.page?.path };
    const result = streamText({
      model,
      system,
      messages: convertToModelMessages(safeMessages),
      // One step: tools are UI-only, so the model never continues after a tool call.
      stopWhen: stepCountIs(1),
      tools: shouldSuppressRoseFollowups(followupContext) ? {
        propose_booking: tool({
          description: ROSE_BOOKING_TOOL_DESCRIPTION,
          inputSchema: z.object({
            intent: z.enum(["product", "technical", "culture", "exploring"])
              .describe("Detected intent bucket."),
            reason: z
              .string()
              .max(200)
              .describe(
                "One short sentence, plain English, shown on the card as the call framing.",
              ),
          }),
        }),
      } : {
        propose_booking: tool({
          description: ROSE_BOOKING_TOOL_DESCRIPTION,
          inputSchema: z.object({
            intent: z.enum(["product", "technical", "culture", "exploring"])
              .describe("Detected intent bucket."),
            reason: z
              .string()
              .max(200)
              .describe(
                "One short sentence, plain English, shown on the card as the call framing.",
              ),
          }),
        }),
        suggest_followups: tool({
          description: ROSE_FOLLOWUPS_TOOL_DESCRIPTION,
          inputSchema: z.object({
            items: z.array(z.string().min(3).max(80).describe(roseFollowupPolicyDescription(followupContext))).min(1).max(2),
          }).superRefine(({ items }, ctx) => {
            items.forEach((item, index) => {
              if (!isRoseFollowupAllowed(item, followupContext)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["items", index], message: "This follow-up does not advance the current question safely." });
              }
            });
          }),
        }),
      },
    });

    const streamResponse = result.toUIMessageStreamResponse();
    const streamHeaders = new Headers(streamResponse.headers);
    for (const [key, value] of Object.entries(corsHeaders)) {
      streamHeaders.set(key, value);
    }
    return new Response(streamResponse.body, { status: streamResponse.status, headers: streamHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[rose-chat] error", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
