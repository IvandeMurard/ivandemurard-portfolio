import { Icon } from "@/components/ui/Icon";

/**
 * Standing head for a section: sigil, icon, the claim in one line, and one
 * concrete instance. Lets a reader landing mid-article take a section on its
 * own, without the ones before it.
 */
export const SectionKey = ({
  sigil,
  icon,
  minutes,
  oneLine,
  concrete,
}: {
  sigil: string;
  icon: string;
  minutes?: number;
  oneLine: string;
  concrete?: string;
}) => (
  <div className="rounded-sm border border-outline-variant bg-surface-container-lowest p-5 md:p-6 not-italic">
    <div className="flex items-center gap-3 mb-4">
      <Icon name={icon} className="text-secondary text-[20px] leading-none" />
      <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">{sigil}</span>
      {minutes ? (
        <span className="ml-auto font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
          {minutes} min
        </span>
      ) : null}
    </div>
    <p className="font-headline italic text-lg md:text-xl text-primary leading-snug">{oneLine}</p>
    {concrete && (
      <p className="mt-3 font-body font-normal text-sm text-on-surface-variant">
        <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary mr-2">
          In practice
        </span>
        {concrete}
      </p>
    )}
  </div>
);

export default SectionKey;
