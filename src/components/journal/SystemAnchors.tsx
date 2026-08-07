import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { Icon } from "@/components/ui/Icon";

type Anchor = {
  project: string;
  to: string;
  what: string;
  who: string;
  feedback: string;
};

const ROWS: { key: keyof Pick<Anchor, "what" | "who" | "feedback">; label: string; icon: string }[] = [
  { key: "what", label: "What it does", icon: "bolt" },
  { key: "who", label: "Who uses it", icon: "person" },
  { key: "feedback", label: "What reality returns", icon: "sync" },
];

/**
 * Defines the two products the piece uses as evidence, so the sections after
 * it can name them freely.
 */
export const SystemAnchors = ({
  items,
  label = "The two systems referenced here",
}: {
  items: Anchor[];
  label?: string;
}) => (
  <section aria-label={label} className="not-italic">
    <div className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-4">{label}</div>
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.project}
          className="rounded-sm border border-outline-variant bg-surface-container-lowest p-5"
        >
          <Link
            to={item.to}
            className="font-headline italic text-xl text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
          >
            {item.project}
          </Link>
          <dl className="mt-4 space-y-3">
            {ROWS.map((row) => (
              <div key={row.key} className="flex gap-3">
                <Icon name={row.icon} className="text-secondary text-[16px] leading-6 shrink-0" />
                <div>
                  <dt className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
                    {row.label}
                  </dt>
                  <dd className="font-body font-light text-sm text-on-surface-variant">{item[row.key]}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  </section>
);

export default SystemAnchors;
