export type RoseEventKind =
  | "opened"
  | "chip"
  | "question"
  | "followup"
  | "booking_proposed"
  | "booking_clicked";

/** Fire-and-forget anonymous event. Stored server-side without IP or user agent. */
export const logRoseEvent = (e: {
  session_id: string;
  path: string;
  section_id?: string | null;
  kind: RoseEventKind;
  label_or_question?: string | null;
  used_chip?: boolean;
}) => {
  if (!e.session_id) return;
  try {
    void fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rose-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify(e),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // never block the conversation on logging
  }
};
