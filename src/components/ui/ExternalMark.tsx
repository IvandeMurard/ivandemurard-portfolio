/**
 * The one sign for leaving the site: "↗", drawn after the link text, with the spoken part added to the link's
 * accessible name (", opens in a new tab"). Only for links that leave the site; an internal link carries no sign.
 */
export const ExternalMark = ({ className = "" }: { className?: string }) => (
  <>
    <span aria-hidden="true" className={className}>↗</span>
    <span className="sr-only">, opens in a new tab</span>
  </>
);

export default ExternalMark;
