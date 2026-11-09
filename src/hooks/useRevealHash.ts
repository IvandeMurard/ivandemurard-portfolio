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
    const attempt = () => {
      if ((fromRose ? !!arriveAtSource(id, reduced || prefersReduced()) : revealAnchor(id, reduced)) || ++tries > 10) return;
      timer = window.setTimeout(attempt, 100);
    };
    attempt();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
};
