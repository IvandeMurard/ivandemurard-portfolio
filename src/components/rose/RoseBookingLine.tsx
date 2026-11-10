import { CompassMark } from "./CompassMark";

/**
 * The booking line under an answer to a profile question. A copper rule, then on one line the compass mark and the
 * sentence; the words "book a call with Ivan" are the link. No card, no button styling, no arrow: the page stays
 * where it is, and the click does what the "Book a call" chip does (RoseDock.openBooking).
 */
export const BOOKING_LINE_BEFORE = "If this fits a role you are hiring for, ";
export const BOOKING_LINE_LINK = "book a call with Ivan";
export const BOOKING_LINE_AFTER = ".";

export const RoseBookingLine = ({ onBook }: { onBook: () => void }) => (
  <div data-booking-line className="mt-3 pt-2" style={{ borderTop: "1px solid hsl(var(--rose-copper) / 0.75)" }}>
    <p className="flex items-start gap-2 text-sm text-on-surface">
      <CompassMark className="mt-0.5 h-4 w-4 shrink-0 text-rose-copper" />
      <span>
        {BOOKING_LINE_BEFORE}
        <button
          type="button"
          onClick={onBook}
          aria-label="Book a call with Ivan (opens cal.com in a new tab)"
          className="rounded-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
        >
          {BOOKING_LINE_LINK}
        </button>
        {BOOKING_LINE_AFTER}
      </span>
    </p>
  </div>
);
