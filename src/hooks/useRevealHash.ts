import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { revealAnchor } from "@/lib/revealAnchor";

/**
 * Site-wide: when the URL hash names an element, open any collapsed section around it, then scroll to it.
 * Runs on arrival and on every hash change (links within the page, links from Rose). A page that renders
 * the target late is retried for a moment.
 */
export const useRevealHash = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash || hash.length < 2) return;
    let id = hash.slice(1);
    try { id = decodeURIComponent(id); } catch { /* keep the raw id */ }
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let tries = 0;
    let timer = 0;
    const attempt = () => {
      if (revealAnchor(id, reduced) || ++tries > 10) return;
      timer = window.setTimeout(attempt, 100);
    };
    attempt();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
};
