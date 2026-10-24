export type RoseEventKind =
  | "opened"
  | "chip"
  | "question"
  | "followup"
  | "booking_proposed"
  | "booking_clicked"
  | "rose_request_started"
  | "rose_answer_completed"
  | "rose_answer_failed"
  | "rose_link_clicked"
  | "rose_conversation_cleared";

export const measurementAllowed = (dev: boolean, hostname: string) =>
  !dev && ["ivandemurard.com", "www.ivandemurard.com", "ivandemurard.lovable.app"].includes(hostname);

export type RoseEventPayload = {
  session_id: string;
  path: string;
  section_id?: string | null;
  kind: RoseEventKind;
  label_or_question?: string | null;
  used_chip?: boolean;
  request_id?: string;
  target_path?: string;
  booking_source?: "card" | "chip";
};

export const measurementPayload = (e: RoseEventPayload): RoseEventPayload => {
  if (!e.kind.startsWith("rose_")) return e;
  return {
    session_id: e.session_id, path: e.path, kind: e.kind,
    ...(e.request_id ? { request_id: e.request_id } : {}),
    ...(e.target_path ? { target_path: e.target_path } : {}),
  };
};

/** Fire-and-forget anonymous event. Stored server-side without IP or user agent. */
export const logRoseEvent = (e: RoseEventPayload) => {
  if (!e.session_id || typeof window === "undefined" || !measurementAllowed(import.meta.env.DEV, window.location.hostname)) return;
  try {
    void fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rose-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify(measurementPayload(e)),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // never block the conversation on logging
  }
};
