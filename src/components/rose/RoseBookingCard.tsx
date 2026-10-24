import { Icon } from "@/components/ui/Icon";
import { useHaptic } from "@/hooks/useHaptic";
import { useTrackClick } from "@/hooks/useTrackClick";
import { CAL_URL } from "./roseConfig";
import { logRoseEvent } from "./roseEvents";
import { normalizeRoseText } from "./roseAnswer";

interface RoseBookingCardProps {
  intent: "product" | "technical" | "culture" | "exploring" | null;
  reason: string;
  sessionId: string;
}

/**
 * Contextual booking invitation. A click logs one minimal booking_clicked event
 * (route, session id, intent category) and opens Cal.com. No conversation text,
 * summary or transcript leaves the page.
 */
export const RoseBookingCard = ({ intent, reason, sessionId }: RoseBookingCardProps) => {
  const haptic = useHaptic();
  const track = useTrackClick();

  const onClick = () => {
    haptic("tap");
    track({ label: "rose_booking", href: CAL_URL, kind: "contact" });
    logRoseEvent({
      session_id: sessionId,
      path: typeof window !== "undefined" ? window.location.pathname : "/",
      kind: "booking_clicked",
      booking_source: "card",
      label_or_question: intent ? `Booking card · ${intent}` : "Booking card",
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
          <span className="mt-1 text-sm text-on-surface-variant">{normalizeRoseText(reason)}</span>
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
