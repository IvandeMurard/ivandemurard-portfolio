import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { z } from "npm:zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BodySchema = z.object({
  intent: z.enum(["product", "technical", "culture", "exploring"]).nullable()
    .optional(),
  reason: z.string().max(300).optional(),
  transcript: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        text: z.string().max(2000),
      }),
    )
    .max(20),
  session_id: z.string().max(64).nullable().optional(),
  page: z.string().max(512).nullable().optional(),
  referrer: z.string().max(2048).nullable().optional(),
});

const NOTIFY_TO = "ivandemurard@hotmail.fr";
const NOTIFY_FROM = "Rose <onboarding@resend.dev>";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: parsed.error.flatten() }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  const data = parsed.data;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    console.error("[rose-notify] missing supabase env");
    return new Response(JSON.stringify({ error: "server misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: insertError } = await supabase.from("rose_sessions").insert({
    intent: data.intent ?? null,
    transcript: data.transcript,
    booking_clicked: true,
    session_id: data.session_id ?? null,
    page: data.page ?? null,
    referrer: data.referrer ?? null,
  });
  if (insertError) {
    console.error("[rose-notify] insert failed", insertError.message);
  }

  // Fire Resend email via gateway. Non-blocking on failure: the DB row is the source of truth.
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");

  if (lovableKey && resendKey) {
    const transcriptHtml = data.transcript
      .map(
        (m) =>
          `<p style="margin:0 0 8px 0;"><strong>${
            escapeHtml(m.role)
          }:</strong> ${escapeHtml(m.text)}</p>`,
      )
      .join("");

    const html = `
      <div style="font-family:system-ui,sans-serif;color:#111;line-height:1.5;">
        <h2 style="margin:0 0 12px 0;">Rose: new booking intent</h2>
        <p style="margin:0 0 6px 0;"><strong>Intent:</strong> ${escapeHtml(data.intent ?? "unknown")}</p>
        ${data.reason ? `<p style="margin:0 0 6px 0;"><strong>Reason:</strong> ${escapeHtml(data.reason)}</p>` : ""}
        <p style="margin:0 0 6px 0;"><strong>Page:</strong> ${escapeHtml(data.page ?? "")}</p>
        <p style="margin:0 0 6px 0;"><strong>Referrer:</strong> ${escapeHtml(data.referrer ?? "")}</p>
        <p style="margin:0 0 6px 0;"><strong>Session:</strong> ${escapeHtml(data.session_id ?? "")}</p>
        <hr style="margin:16px 0;border:none;border-top:1px solid #ddd;" />
        <h3 style="margin:0 0 8px 0;">Transcript</h3>
        ${transcriptHtml}
      </div>
    `;

    try {
      const emailRes = await fetch(
        "https://connector-gateway.lovable.dev/resend/emails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": resendKey,
          },
          body: JSON.stringify({
            from: NOTIFY_FROM,
            to: [NOTIFY_TO],
            subject: `Rose: new booking intent (${data.intent ?? "unknown"})`,
            html,
          }),
        },
      );
      if (!emailRes.ok) {
        const text = await emailRes.text();
        console.error(`[rose-notify] resend ${emailRes.status}: ${text}`);
      } else {
        // Consume body to release the connection.
        await emailRes.text();
      }
    } catch (err) {
      console.error("[rose-notify] resend fetch failed", err);
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
