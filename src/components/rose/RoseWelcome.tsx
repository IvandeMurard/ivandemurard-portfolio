import { useCallback, useEffect, useState, type RefObject } from "react";
import { useMoodOptional } from "@/components/MoodProvider";
import { useAmbienceOptional } from "@/components/AmbienceProvider";
import { useRoseNotes } from "@/lib/roseNotes";
import { ROSE_WELCOME } from "@/content/roseWelcome";

/**
 * Rose's welcome (homepage v2, part B). Scripted UI, not a chat message: no model call, nothing added to the conversation
 * history, no event, nothing sent to the server. It offers two things the page can do by itself, dimming the lights and
 * putting on the record, and each button does it.
 *
 * It shows once, on the first page view of a browser session, on any page, and never when Page notes are off. After a
 * button, Escape or the opening of the dock it is gone for the rest of the session. It sits in the dock, above the bar.
 * When it would cover the hero's call to action (a phone), it waits for the first scroll.
 */
export const WELCOME_KEY = "rose_welcome";

// The first page view of this page load. A later route change in the same load is not a new session, and a reload finds
// the flag in sessionStorage.
let taken = false;

const claimWelcome = (): boolean => {
  if (taken) return false;
  taken = true;
  try {
    if (window.sessionStorage.getItem(WELCOME_KEY)) return false;
    window.sessionStorage.setItem(WELCOME_KEY, "seen");
  } catch { /* storage blocked: once per page load is the best that can be kept */ }
  return true;
};

/** Test helper: a new page load. */
export const resetRoseWelcome = () => { taken = false; };

const markSeen = () => { try { window.sessionStorage.setItem(WELCOME_KEY, "seen"); } catch { /* ignore */ } };

const overlaps = (a: DOMRect, b: { left: number; right: number; top: number; bottom: number }) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

type Args = { dockOpen: boolean; dockRef: RefObject<HTMLElement> };

export const useRoseWelcome = ({ dockOpen, dockRef }: Args) => {
  const mood = useMoodOptional();
  const ambience = useAmbienceOptional();
  const notesOn = useRoseNotes();
  const [claimed, setClaimed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [waitForScroll, setWaitForScroll] = useState(false);
  const hasProviders = !!mood;

  useEffect(() => {
    if (hasProviders && claimWelcome()) setClaimed(true);
  }, [hasProviders]);

  // The dock opening, from anywhere (the bar, Ask Rose, Ctrl+K, a chip), ends the welcome.
  useEffect(() => { if (dockOpen) { setDismissed(true); markSeen(); } }, [dockOpen]);

  const candidate = claimed && !dismissed && notesOn && !dockOpen;

  // Escape closes it. It never takes focus, so it listens on the window.
  useEffect(() => {
    if (!candidate) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setDismissed(true); markSeen(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [candidate]);

  // Would the welcome, with the bar under it, cover the hero's primary call to action? Then it waits for the first scroll,
  // and shows once the scroll has moved the call to action clear of it (a first scroll of a few pixels is not enough).
  useEffect(() => {
    if (!candidate) return;
    const cta = document.querySelector<HTMLElement>('[data-cta="primary"]');
    const dock = dockRef.current;
    if (!cta || !dock || window.scrollY > 0) return;
    const covers = () => {
      const bottomGap = parseFloat(getComputedStyle(dock).bottom) || 0;
      const d = dock.getBoundingClientRect();
      return overlaps(cta.getBoundingClientRect(), { left: d.left, right: d.right, top: window.innerHeight - bottomGap - dock.offsetHeight - 8, bottom: window.innerHeight });
    };
    if (!covers()) return;
    setWaitForScroll(true);
    const onScroll = () => { if (window.scrollY > 0 && !covers()) { setWaitForScroll(false); window.removeEventListener("scroll", onScroll); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [candidate, dockRef]);

  const dismiss = useCallback(() => { setDismissed(true); markSeen(); }, []);

  const isDusk = mood?.mood === "dusk";
  const canPlay = !!ambience && ambience.available && ambience.muted;

  return {
    /** Rendered inside the dock (so it can be measured); `visible` is when the visitor can see it. */
    candidate,
    visible: candidate && !waitForScroll,
    isDusk,
    canPlay,
    dismiss,
    dim: () => { mood?.setMood(isDusk ? "day" : "dusk"); dismiss(); },
    record: () => { if (ambience?.muted) ambience.toggleMute(); dismiss(); },
  };
};

type WelcomeProps = { welcome: ReturnType<typeof useRoseWelcome> };

const button = "inline-flex min-h-[44px] items-center rounded-full border border-outline-variant px-4 text-[14px] text-on-surface transition-colors hover:border-secondary hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";

export const RoseWelcome = ({ welcome }: WelcomeProps) => (
  <div
    role="status"
    aria-live="polite"
    data-rose-welcome
    {...(welcome.visible ? {} : { "aria-hidden": true, style: { visibility: "hidden" as const } })}
    className="mb-2 rounded-2xl border border-outline-variant bg-surface-container-lowest px-[18px] py-4 shadow-xl shadow-primary/10"
  >
    <p className="font-mono text-[12.5px] leading-normal text-secondary">Rose</p>
    <p className="mt-1.5 font-headline text-[20px] leading-[1.3] text-on-surface">{ROSE_WELCOME.text}</p>
    <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
      <button type="button" onClick={welcome.dim} className={button} tabIndex={welcome.visible ? undefined : -1}>
        {welcome.isDusk ? ROSE_WELCOME.up : ROSE_WELCOME.dim}
      </button>
      {welcome.canPlay ? (
        <button type="button" onClick={welcome.record} className={button} tabIndex={welcome.visible ? undefined : -1}>{ROSE_WELCOME.record}</button>
      ) : null}
      <button type="button" onClick={welcome.dismiss} tabIndex={welcome.visible ? undefined : -1}
        className="ml-auto inline-flex min-h-[44px] items-center border-b border-outline-variant px-1 text-[14px] text-on-surface transition-colors hover:border-secondary hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
        {ROSE_WELCOME.decline}
      </button>
    </div>
  </div>
);
