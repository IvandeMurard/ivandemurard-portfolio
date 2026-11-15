/**
 * The one sign for leaving the site: "↗", drawn after the link text, with the spoken part added to the link's
 * accessible name (", opens in a new tab"). Every link that opens a new tab carries it, and only those links.
 * A link with no visible text (an icon) takes the same words through `externalName` in its aria-label.
 */
export const EXTERNAL_SUFFIX = ", opens in a new tab";

/** The accessible name of an external link whose name is set by hand (aria-label). */
export const externalName = (label: string): string => `${label}${EXTERNAL_SUFFIX}`;

export const ExternalMark = ({ className = "" }: { className?: string }) => (
  <>
    <span aria-hidden="true" className={className}>{" "}↗</span>
    <span className="sr-only">{EXTERNAL_SUFFIX}</span>
  </>
);

export default ExternalMark;
