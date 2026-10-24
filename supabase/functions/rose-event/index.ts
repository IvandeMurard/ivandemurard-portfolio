// Records one anonymous Rose interaction. No IP, no user agent is stored.
// Emails and phone numbers are masked before insert. Writes use the service role;
// the table has no public insert or read policy.
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const EventSchema = z.object({
  session_id: z.string().min(1).max(64),
  path: z.string().min(1).max(200),
  section_id: z.string().max(120).nullable().optional(),
  kind: z.enum(["opened", "chip", "question", "followup", "booking_proposed", "booking_clicked", "rose_request_started", "rose_answer_completed", "rose_answer_failed", "rose_link_clicked", "rose_conversation_cleared"]),
  label_or_question: z.string().max(2000).nullable().optional(),
  used_chip: z.boolean().optional(),
  request_id: z.string().min(1).max(128).optional(),
  target_path: z.enum(["/", "/aetherix", "/tacet", "/anima", "/compass", "/sonor", "/lore", "/architecture", "/cv", "/atrium", "/journal", "/contact", "/agents", "/journal/harnesses-graders-closed-loops", "/journal/agent-boundaries-aetherix", "/journal/whose-truth-is-the-ground-truth"]).optional(),
  booking_source: z.enum(["card", "chip"]).optional(),
});

export const maskPii = (text: string): string =>
  text
    .replace(/[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/gi, "[email masked]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[phone masked]");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const origin = req.headers.get("origin");
  if (!origin || !["https://ivandemurard.com", "https://www.ivandemurard.com", "https://ivandemurard.lovable.app"].includes(origin)) return json({ error: "Measurement disabled for this origin" }, 403);
  if (Number(req.headers.get("content-length") ?? 0) > 6000) return json({ error: "Payload too large" }, 413);
  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > 6000) return json({ error: "Payload too large" }, 413);
    raw = JSON.parse(text);
  } catch { return json({ error: "Invalid JSON" }, 400); }
  const parsed = EventSchema.safeParse(raw);
  if (!parsed.success) return json({ error: "invalid event" }, 400);
  const e = parsed.data;

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return json({ error: "Unavailable" }, 503);
  if (e.kind.startsWith("rose_") && (e.label_or_question || e.section_id || e.used_chip)) return json({ error: "Measurement must be content-free" }, 400);
  if (["rose_request_started", "rose_answer_completed", "rose_answer_failed"].includes(e.kind) && !e.request_id) return json({ error: "request_id required" }, 400);
  if (e.kind === "rose_link_clicked" && !e.target_path) return json({ error: "target_path required" }, 400);
  const supabase = createClient(url, key);
  const { error } = await supabase.from("rose_events").insert({
    session_id: e.session_id,
    path: e.path,
    section_id: e.section_id ?? null,
    kind: e.kind,
    label_or_question: e.label_or_question ? maskPii(e.label_or_question) : null,
    used_chip: e.used_chip ?? false,
    request_id: e.request_id ?? null,
    target_path: e.target_path ?? null,
    booking_source: e.booking_source ?? null,
  });
  if (error) {
    if (error.code === "23505") return json({ ok: true });
    if (error.code === "P0001") return json({ error: "Event limit reached" }, 429);
    console.error("[rose-event] insert failed", error.message);
    return json({ error: "insert failed" }, 500);
  }
  return json({ ok: true });
});
