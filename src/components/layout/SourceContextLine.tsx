import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { clearJump, JUMP_EVENT, jumpMatches, readJump, type Jump } from "@/lib/sourceJump";
import { restoreOrigin, headingOf, headingText } from "@/lib/sourceArrival";
import { currentPageTitle, sectionLabelFor } from "@/lib/sourceLinks";

/**
 * After a source link from Rose to another page: where the reader is, and a way back to the exact place
 * they left. Gone on any other navigation. Never shown for a jump within the same page.
 */
export const SourceContextLine = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [jump, setJump] = useState<Jump | null>(readJump);
  const [top, setTop] = useState(72);
  // Sits right under the fixed header, whatever its height at this width.
  useLayoutEffect(() => {
    const nav = document.querySelector("nav.fixed");
    if (nav) setTop(Math.round(nav.getBoundingClientRect().height) || 72);
  }, [pathname]);

  useEffect(() => {
    const sync = () => setJump(readJump());
    window.addEventListener(JUMP_EVENT, sync);
    return () => window.removeEventListener(JUMP_EVENT, sync);
  }, []);

  // Any navigation that is not the jump itself ends it.
  useEffect(() => {
    const current = readJump();
    if (current && !jumpMatches(current, pathname, hash)) clearJump();
  }, [pathname, hash]);

  const back = useCallback(() => {
    const current = readJump();
    if (!current) return;
    clearJump();
    navigate(current.origin.path);
    restoreOrigin(current.origin.scrollY, current.origin.sectionId);
  }, [navigate]);

  if (!jump || jump.samePage || !jumpMatches(jump, pathname, hash)) return null;

  // The context line gives the page's whole title; a link label uses the short one.
  const title = currentPageTitle(pathname, document, true);
  const target = jump.target.hash ? document.getElementById(jump.target.hash) : null;
  const section = sectionLabelFor(pathname, jump.target.hash) ?? (target ? headingText(headingOf(target)) : null) ?? null;
  const origin = jump.origin.section ? `${jump.origin.title}, ${jump.origin.section}` : jump.origin.title;

  // Below md the line is two lines: the way back first, always whole (it wraps), then where the reader is, cut
  // short if need be. From md up it is one line, as before: where the reader is, then the way back.
  return (
    <nav
      aria-label="Return to where you were"
      data-source-context
      style={{ top }}
      className="fixed inset-x-0 z-40 flex items-start gap-3 border-b border-outline-variant bg-surface-container px-4 md:px-10 py-2 text-[12.5px] text-on-surface md:items-center"
    >
      <p className="flex min-w-0 flex-1 flex-col gap-0.5 md:block md:truncate">
        <span data-context-where className="order-2 block truncate font-mono md:order-none md:inline md:overflow-visible">{section ? `${title} \u00b7 ${section}` : title}</span>
        <button
          type="button"
          onClick={back}
          className="order-1 block whitespace-normal text-left text-secondary underline decoration-secondary/40 underline-offset-2 hover:decoration-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary md:order-none md:ml-4 md:inline md:whitespace-nowrap"
        >
          {`\u2190 Back to ${origin}`}
        </button>
      </p>
      <button
        type="button"
        aria-label="Close this line"
        onClick={clearJump}
        className="shrink-0 rounded p-1 text-on-surface-variant hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
};
