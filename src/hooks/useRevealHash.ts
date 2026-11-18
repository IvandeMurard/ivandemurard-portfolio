import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { revealAnchor } from "@/lib/revealAnchor";
import { arriveAtSource, prefersReduced } from "@/lib/sourceArrival";
import { jumpMatches, readJump } from "@/lib/sourceJump";

/**
 * Site-wide: when the URL hash names an element, open any collapsed section around it, then scroll to it.
 * Runs on arrival and on every hash change (links within the page, links from Rose). A page that renders
 * the target late is retried for a moment. A link followed from Rose arrives with the heading and the first
 * block in view, the cited block highlighted and the heading focused (see sourceArrival).
 */
export const useRevealHash = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const fromRose = jumpMatches(readJump(), pathname, hash);
    if (!hash || hash.length < 2) {
      // A source link to a whole page: it opens at the top, and focus goes to the page's main heading.
      if (fromRose) {
        const h1 = document.querySelector<HTMLElement>("main h1");
        if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); }
      }
      return;
    }
    let id = hash.slice(1);
    try { id = decodeURIComponent(id); } catch { /* keep the raw id */ }
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let tries = 0;
    let timer = 0;
    const settleTimers: number[] = [];
    // A page opened on a hash lays out again after the first scroll (the pre-rendered body, then the page itself), and
    // that scroll can land short or not at all. Twice, shortly after, put the target back at the top, unless the
    // reader has already moved the page themselves.
    let moved = false;
    const stop = () => { moved = true; };
    const settle = () => {
      for (const ev of ["wheel", "touchstart", "keydown", "mousedown"]) window.addEventListener(ev, stop, { once: true, passive: true });
      for (const ms of [600, 1600]) {
        settleTimers.push(window.setTimeout(() => {
          if (moved) return;
          const el = document.getElementById(id);
          if (!el) return;
          const top = el.getBoundingClientRect().top;
          if (top < -4 || top > window.innerHeight * 0.5) el.scrollIntoView({ behavior: "auto", block: "start" });
        }, ms));
      }
    };
    const attempt = () => {
      const found = fromRose ? !!arriveAtSource(id, reduced || prefersReduced()) : revealAnchor(id, reduced);
      if (found && !fromRose) settle();
      if (found || ++tries > 10) return;
      timer = window.setTimeout(attempt, 100);
    };
    attempt();
    return () => {
      window.clearTimeout(timer);
      settleTimers.forEach((t) => window.clearTimeout(t));
      for (const ev of ["wheel", "touchstart", "keydown", "mousedown"]) window.removeEventListener(ev, stop);
    };
  }, [pathname, hash]);
};
