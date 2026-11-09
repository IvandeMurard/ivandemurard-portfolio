import { DISCLOSURE, DISCLOSURE_TRIGGER, openCollapsedAncestors } from "./revealAnchor";
import { headerOffset, headingText, JUMP_EVENT } from "./sourceJump";

/**
 * Arrival of a source link: the section heading and the first block after it are in view under the sticky
 * header, the heading takes focus, and the block carries the "passage cited" highlight (the colour of
 * RoseMark kind="highlight", one meaning only). The highlight fades after about 4 s; with reduced motion it
 * simply appears, then goes at the next scroll.
 */
export const CITED_ATTR = "data-passage-cited";
export const CITED_MS = 4000;

const HEADING = "h1,h2,h3,h4,h5,h6";

/**
 * The heading of the target: the target itself, the heading an alias id sits in, the first heading inside it, or,
 * for a collapsible panel, its trigger (the panel's own summary text is its heading).
 */
export const headingOf = (el: HTMLElement): HTMLElement => {
  if (el.hasAttribute(DISCLOSURE)) {
    const trigger = Array.from(el.children).find((c) => c.hasAttribute(DISCLOSURE_TRIGGER)) as HTMLElement | undefined;
    if (trigger) return trigger;
  }
  return el.closest<HTMLElement>(HEADING) ?? el.querySelector<HTMLElement>(HEADING) ?? el;
};

export { headingText };

/** The first block after the heading, climbing out of a heading wrapper that has nothing after it. */
export const firstBlockAfter = (heading: HTMLElement, within: HTMLElement): HTMLElement | null => {
  let node: HTMLElement | null = heading;
  while (node && node !== within && !node.nextElementSibling) node = node.parentElement;
  const next = node && node !== within ? node.nextElementSibling : null;
  return (next as HTMLElement | null) ?? null;
};

export const prefersReduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

let clearCited: (() => void) | null = null;

const markCited = (block: HTMLElement, reduced: boolean) => {
  clearCited?.();
  block.setAttribute(CITED_ATTR, "on");
  let timer = 0;
  const off = () => {
    window.clearTimeout(timer);
    window.removeEventListener("scroll", off);
    // Fade out (no transition with reduced motion), then drop the attribute.
    block.setAttribute(CITED_ATTR, "off");
    window.setTimeout(() => { if (block.getAttribute(CITED_ATTR) === "off") block.removeAttribute(CITED_ATTR); }, 600);
    if (clearCited === off) clearCited = null;
  };
  clearCited = off;
  if (reduced) {
    // Appears, then goes on the next scroll. The scroll that brought the reader here has to be over first.
    timer = window.setTimeout(() => window.addEventListener("scroll", off, { passive: true, once: true }), 400);
  } else {
    timer = window.setTimeout(off, CITED_MS);
  }
};

/** Opens what hides the target, places it, highlights the cited block, moves focus. False when the id is absent. */
export function arriveAtSource(id: string, reduced: boolean, doc: Document = document): HTMLElement | null {
  const target = doc.getElementById(id);
  if (!target) return null;
  const opened = openCollapsedAncestors(target);
  const heading = headingOf(target);
  const place = () => {
    const top = heading.getBoundingClientRect().top + window.scrollY - headerOffset(doc);
    window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: reduced ? "auto" : "smooth" });
    const block = firstBlockAfter(heading, target.contains(heading) ? target : doc.body);
    if (block) markCited(block, reduced);
    if (!heading.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT)$/.test(heading.tagName)) heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
    window.dispatchEvent(new Event(JUMP_EVENT));
  };
  // A section that just opened needs a frame to lay out before the heading has its final position.
  if (opened) requestAnimationFrame(place);
  else place();
  return heading;
}

/** Back on the origin page: the exact scroll position, and focus on the section the reader left. */
export function restoreOrigin(scrollY: number, sectionId: string | null, doc: Document = document) {
  let tries = 0;
  const attempt = () => {
    const room = doc.documentElement.scrollHeight - window.innerHeight;
    if (room < scrollY && ++tries < 30) { window.setTimeout(attempt, 50); return; }
    window.scrollTo({ top: scrollY, behavior: "auto" });
    const el = (sectionId ? doc.getElementById(sectionId) : null) ?? doc.getElementById("main-content");
    if (el) {
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    }
  };
  window.setTimeout(attempt, 0);
}
