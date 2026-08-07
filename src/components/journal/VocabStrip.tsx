import { Term } from "@/components/Term";

type Chip = { id: string; label: string; type?: string };

/**
 * Compact recap of the piece's core vocabulary. Each chip opens the same
 * glossary definition used inline in the prose, and names the kind of
 * deliverable the term stands for.
 */
export const VocabStrip = ({ items, label = "Vocabulary" }: { items: Chip[]; label?: string }) => (
  <div className="rounded-sm border border-outline-variant bg-surface-container-lowest px-5 py-4 not-italic">
    <div className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-3">{label}</div>
    <ul className="flex flex-wrap gap-x-3 gap-y-2 list-none p-0 m-0">
      {items.map((item) => (
        <li key={item.id}>
          <span className="inline-flex items-center gap-2 rounded-sm border border-outline-variant bg-surface-container-low px-3 py-1 text-sm font-body text-on-surface-variant">
            <Term id={item.id}>{item.label}</Term>
            {item.type && (
              <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
                {item.type}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default VocabStrip;
