import { Icon } from "@/components/ui/Icon";

/**
 * Standing head for a section: sigil, icon, the claim in one line, and one
 * concrete instance. Lets a reader landing mid-article take a section on its
 * own, without the ones before it.
 *
 * As a standfirst (the harness note), the claim comes first, directly under the heading, in the display serif and
 * larger; the sigil and the minutes follow it, small, and the card around it goes.
 */
export const SectionKey = ({
  sigil,
  icon,
  minutes,
  oneLine,
  concrete,
  standfirst = false,
}: {
  sigil: string;
  icon: string;
  minutes?: number;
  oneLine: string;
  concrete?: string;
  standfirst?: boolean;
}) => {
  const meta = (
    <div className={standfirst ? "mt-3 flex items-center gap-3" : "flex items-center gap-3 mb-4"}>
      <Icon name={icon} className="text-secondary text-[20px] leading-none" />
      <span className="font-label uppercase tracking-[0.2em] text-kicker text-secondary">{sigil}</span>
      {minutes ? (
        <span className={standfirst ? "font-label uppercase tracking-[0.16em] text-kicker text-on-surface-variant" : "ml-auto font-label uppercase tracking-[0.16em] text-kicker text-on-surface-variant"}>
          {minutes} min
        </span>
      ) : null}
    </div>
  );
  const practice = concrete && (
    <p className="mt-3 font-body font-normal text-sm text-on-surface-variant">
      <span className="font-label uppercase tracking-[0.16em] text-kicker text-secondary mr-2">
        In practice
      </span>
      {concrete}
    </p>
  );
  if (standfirst) {
    return (
      <div data-standfirst className="not-italic">
        <p className="font-headline text-[22px] font-normal leading-[1.25] text-heading md:text-[26px]">{oneLine}</p>
        {meta}
        {practice}
      </div>
    );
  }
  return (
    <div className="rounded-sm border border-outline-variant bg-surface-container-lowest p-5 md:p-6 not-italic">
      {meta}
      <p className="font-headline italic text-lg md:text-xl text-heading leading-snug">{oneLine}</p>
      {practice}
    </div>
  );
};

export default SectionKey;
