// Records one anonymous Rose interaction. No IP, no user agent is stored.
// Emails and phone numbers are masked before insert. Writes use the service role;
// the table has no public insert or read policy.
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EventSchema = z.object({
  session_id: z.string().min(1).max(64),
  path: z.string().min(1).max(200),
  section_id: z.string().max(120).nullable().optional(),
  kind: z.enum(["opened", "chip", "question", "followup", "booking_proposed", "booking_clicked"]),
  label_or_question: z.string().max(2000).nullable().optional(),
  used_chip: z.boolean().optional(),
});

export const maskPii = (text: string): string =>
  text
    .replace(/[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/gi, "[email masked]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[phone masked]");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  let raw: unknown;
  try { raw = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const parsed = EventSchema.safeParse(raw);
  if (!parsed.success) return json({ error: "invalid event" }, 400);
  const e = parsed.data;

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await supabase.from("rose_events").insert({
    session_id: e.session_id,
    path: e.path,
    section_id: e.section_id ?? null,
    kind: e.kind,
    label_or_question: e.label_or_question ? maskPii(e.label_or_question) : null,
    used_chip: e.used_chip ?? false,
  });
  if (error) {
    console.error("[rose-event] insert failed", error.message);
    return json({ error: "insert failed" }, 500);
  }
  return json({ ok: true });
});
