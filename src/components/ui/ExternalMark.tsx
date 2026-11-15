import type { ReactNode } from "react";

/**
 * The one sign for leaving the site: "↗" after the link text, and ", opens in a new tab" at the end of its accessible
 * name. Every link that opens a new tab wraps its label in ExternalMark, and only those links.
 *
 * Why it wraps the label. The words are spoken, not shown, so they are text of zero size, in the same inline run as the
 * label. A visually-hidden element (position: absolute, "sr-only") is not in that run: a browser puts a space before it
 * when it builds the name, which gave "Book a call , opens in a new tab" (measured in Chrome and Edge). Inside the
 * wrapper the name reads "Book a call, opens in a new tab", also when the link is a flex container. The gap before "↗"
 * is a CSS margin, not a text space.
 *
 * A link with no visible text (an icon) names itself with `externalName` in its aria-label; a link whose aria-label
 * already says the words may draw the arrow alone with `ExternalSign`.
 */
export const EXTERNAL_SUFFIX = ", opens in a new tab";

/** The accessible name of an external link whose name is set by hand (aria-label). */
export const externalName = (label: string): string => `${label}${EXTERNAL_SUFFIX}`;

const SPOKEN_ONLY = { fontSize: 0, lineHeight: 0, userSelect: "none" } as const;

export const ExternalMark = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <span data-external-mark>
    {children}
    <span style={SPOKEN_ONLY}>{EXTERNAL_SUFFIX}</span>
    <span aria-hidden="true" className={`ml-[0.25em] ${className}`.trim()}>↗</span>
  </span>
);

/** The arrow alone, for a link whose aria-label already carries ", opens in a new tab". */
export const ExternalSign = ({ className = "" }: { className?: string }) => (
  <span aria-hidden="true" className={className}>↗</span>
);

export default ExternalMark;
