import { Icon } from "@/components/ui/Icon";
import { useHaptic } from "@/hooks/useHaptic";
import { useTrackClick } from "@/hooks/useTrackClick";
import { supabase } from "@/integrations/supabase/client";
import { CAL_URL } from "./roseConfig";
import type { UIMessage } from "ai";

interface RoseBookingCardProps {
  intent: "product" | "technical" | "culture" | "exploring" | null;
  reason: string;
  messages: UIMessage[];
  sessionId: string;
}

const extractText = (m: UIMessage): string => {
  if (!Array.isArray(m.parts)) return "";
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .filter(Boolean)
    .join(" ")
    .slice(0, 2000);
};

const notifyBooking = async ({
  intent,
  reason,
  messages,
  sessionId,
}: RoseBookingCardProps) => {
  try {
    const transcript = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-20)
      .map((m) => ({ role: m.role, text: extractText(m) }))
      .filter((m) => m.text.length > 0);

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rose-booking-notify`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        intent,
        reason,
        transcript,
        session_id: sessionId,
        page: typeof window !== "undefined" ? window.location.pathname : null,
        referrer:
          typeof document !== "undefined" && document.referrer
            ? document.referrer
            : null,
      }),
      keepalive: true,
    });
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[rose] notify failed", err);
    }
  }
};

export const RoseBookingCard = (props: RoseBookingCardProps) => {
  const haptic = useHaptic();
  const track = useTrackClick();
  const { reason } = props;

  const onClick = () => {
    haptic("tap");
    track({ label: "rose_booking", href: CAL_URL, kind: "contact" });
    void notifyBooking(props);
    // Best-effort insert of the row is done inside notifyBooking.
    // Also log the click into link_clicks via useTrackClick above.
    void supabase.from("rose_sessions").insert({
      intent: props.intent,
      transcript: props.messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-20)
        .map((m) => ({ role: m.role, text: extractText(m) })),
      booking_clicked: true,
      session_id: props.sessionId,
      page: typeof window !== "undefined" ? window.location.pathname : null,
      referrer:
        typeof document !== "undefined" && document.referrer
          ? document.referrer
          : null,
    });
  };

  return (
    <a
      href={CAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="group my-3 flex items-center justify-between gap-4 rounded-2xl border border-secondary bg-secondary/5 px-5 py-4 transition-colors hover:border-secondary hover:bg-secondary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
      aria-label="Book a 30 minute call with Ivan on cal.com (opens in a new tab)"
    >
      <div className="flex flex-col">
        <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">
          Book a call
        </span>
        <span className="mt-1 font-headline italic text-lg text-primary">
          30 minutes with Ivan
        </span>
        {reason ? (
          <span className="mt-1 text-sm text-on-surface-variant">{reason}</span>
        ) : null}
      </div>
      <Icon
        name="arrow_outward"
        className="text-secondary transition-transform group-hover:translate-x-1"
      />
    </a>
  );
};

export default RoseBookingCard;
