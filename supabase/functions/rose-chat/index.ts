import "https://deno.land/std@0.224.0/dotenv/load.ts";
import {
  convertToModelMessages,
  streamText,
  stepCountIs,
  tool,
  type UIMessage,
} from "npm:ai@5.0.217";
import { z } from "npm:zod@3.23.8";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";
import { getRoseSystemPrompt } from "../_shared/rose-context.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

  let body: { messages?: UIMessage[]; page?: { path?: string; title?: string } | null; suggested?: { label?: string; intent?: string | null } | null };
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
        parts: z
          .array(
            z.object({
              type: z.literal("text"),
              text: z.string().max(4000),
            }),
          )
          .max(20),
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
    const system = await getRoseSystemPrompt({ page: body?.page, suggested: body?.suggested });
    const result = streamText({
      model,
      system,
      messages: convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      tools: {
        propose_booking: tool({
          description:
            "Render a booking CTA card in the chat when the visitor's intent is clear enough to warrant a 30-minute call with Ivan. No execute: the human clicks the rendered card.",
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
      },
    });

    return result.toUIMessageStreamResponse({ headers: corsHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[rose-chat] error", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
