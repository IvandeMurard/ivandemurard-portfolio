import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SYSTEM_ANCHORS, type SystemAnchor } from "@/content/systems";
import { cn } from "@/lib/utils";

type Props = {
  /** Slug of the case study being read. Its card is marked, not linked. Omit on a page that is the map itself. */
  current?: SystemAnchor["slug"];
  label?: string;
  /** Override the set of systems shown. Defaults to the four case studies. */
  entries?: SystemAnchor[];
  /** Grid columns at the large breakpoint. */
  columns?: 3 | 4 | 5;
  /** Trailing pointer to the architecture note. */
  more?: { to: string; text: string };
};

/**
 * Orientation block for case studies. A visitor often lands directly on one
 * page without knowing what the other systems are, so each is defined in one
 * line here, with the current one marked. Attestation register: static, no
 * playable diagram, no open licence.
 */
export const CaseAnchors = ({
  current,
  label = "Where this sits",
  entries = SYSTEM_ANCHORS,
  columns,
  more,
}: Props) => (
  <section aria-label={label} className="px-6 md:px-12 mb-12 md:mb-16">
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-6">{label}</h2>
      <ul
        className={cn(
          "grid gap-4 md:grid-cols-2",
          columns === 3
            ? "lg:grid-cols-3"
            : (columns ?? (entries.length >= 5 ? 5 : 4)) === 5
              ? "lg:grid-cols-5"
              : "lg:grid-cols-4",
        )}
      >
        {entries.map((item) => {
          const isCurrent = current !== undefined && item.slug === current;
          return (
            <li
              key={item.slug}
              className={cn(
                "rounded-sm border p-5",
                isCurrent
                  ? "border-secondary bg-surface-container-low"
                  : "border-outline-variant bg-surface-container-lowest",
              )}
            >
              <div className="flex items-baseline justify-between gap-3 mb-3">
                {isCurrent || !item.to ? (
                  <span
                    className="font-headline italic text-xl text-primary"
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.to}
                    className="font-headline italic text-xl text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
                  >
                    {item.name}
                  </Link>
                )}
                {isCurrent && (
                  <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary shrink-0">
                    You are here
                  </span>
                )}
              </div>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-3">{item.what}</p>
              <dl className="space-y-1.5">
                <div>
                  <dt className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">For</dt>
                  <dd className="font-body text-sm text-on-surface-variant">{item.who}</dd>
                </div>
                <div>
                  <dt className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">Status</dt>
                  <dd className="font-body text-sm text-on-surface-variant">{item.status}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
      {more && (
        <p className="font-body text-sm text-on-surface-variant mt-6">
          <Link
            to={more.to}
            className="text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
          >
            {more.text}
          </Link>
        </p>
      )}
    </div>
  </section>
);

export default CaseAnchors;
