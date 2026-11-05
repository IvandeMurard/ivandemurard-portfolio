/** Rose's compass mark: the dock bar, the open panel header and the homepage card show this same drawing. */
export const CompassMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" className={className} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="20" r="17" />
    <circle cx="20" cy="20" r="5.5" strokeWidth="0.8" />
    <path d="M20 3l4 13 13 4-13 4-4 13-4-13-13-4 13-4z" />
    <path d="M8 8l6 6M32 8l-6 6M8 32l6-6M32 32l-6-6" strokeWidth="0.6" />
  </svg>
);
