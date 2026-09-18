import { createTermTaker } from "./TermText";
import { Icon } from "@/components/ui/Icon";

type Card = { icon: string; title: string; body: string };

/**
 * Idea cards in the register of the home page approach section: one icon,
 * one title, one idea.
 */
export const CardGrid = ({ items, label }: { items: Card[]; label?: string }) => (
  <section aria-label={label} className="not-italic">
    {label && (
      <div className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-4">{label}</div>
    )}
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((card) => (
        <div
          key={card.title}
          className="rounded-sm border border-outline-variant bg-surface-container-lowest p-5 transition-colors duration-300 hover:border-secondary"
        >
          <Icon name={card.icon} className="text-secondary text-[22px] leading-none" />
          <h4 className="font-headline italic text-lg text-primary mt-3 mb-2">{card.title}</h4>
          <p className="font-body font-normal text-sm text-on-surface-variant">{createTermTaker([])(card.body)}</p>
        </div>
      ))}
    </div>
  </section>
);

export default CardGrid;
