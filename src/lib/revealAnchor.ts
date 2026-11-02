/**
 * A link that targets an element inside a collapsed section must open the section first, then scroll.
 * Covers native <details> and the site's Radix disclosures (root marked data-disclosure, its button
 * marked data-disclosure-trigger). Nested sections open from the inside out.
 */
export const DISCLOSURE = "data-disclosure";
export const DISCLOSURE_TRIGGER = "data-disclosure-trigger";

/** Opens every collapsed ancestor of the element, the element included. Returns true if anything opened. */
export function openCollapsedAncestors(el: HTMLElement): boolean {
  let opened = false;
  for (let node: HTMLElement | null = el; node; node = node.parentElement) {
    if (node instanceof HTMLDetailsElement && !node.open) {
      node.open = true;
      opened = true;
    } else if (node.hasAttribute(DISCLOSURE) && node.getAttribute("data-state") === "closed") {
      const trigger = Array.from(node.children).find((c) => c.hasAttribute(DISCLOSURE_TRIGGER)) as HTMLElement | undefined;
      if (trigger) {
        trigger.click();
        opened = true;
      }
    }
  }
  return opened;
}

/** Opens what hides the element with this id, then scrolls to it. False when no element has the id. */
export function revealAnchor(id: string, reducedMotion: boolean, doc: Document = document): boolean {
  const el = doc.getElementById(id);
  if (!el) return false;
  const opened = openCollapsedAncestors(el);
  const scroll = () => el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  // A section that just opened needs a frame to lay out before the target has its final position.
  if (opened) requestAnimationFrame(scroll);
  else scroll();
  return true;
}
