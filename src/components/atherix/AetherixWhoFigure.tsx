import { STRATEGY } from "@/content/aetherixCase";

const Arrow = ({ d, className = "", viewBox = "0 0 64 20", w = "w-16" }: { d: string; className?: string; viewBox?: string; w?: string }) => (
  <svg viewBox={viewBox} aria-hidden="true" className={`${w} text-secondary ${className}`}>
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Party = ({ role, name, text }: { role: string; name: string; text: string }) => (
  <div className="rounded-xl border-[1.5px] border-primary bg-surface-container-lowest px-4 py-3">
    <p className="font-label text-xs text-secondary">{role}</p>
    <p className="mt-1 font-headline text-[22px] leading-tight text-primary">{name}</p>
    <p className="mt-0.5 text-[13.5px] text-on-surface-variant">{text}</p>
  </div>
);

/**
 * Who uses, who pays, who distributes. Redrawn for the v2 case study. From md up: Aetherix in the middle, the PMS on
 * its left, the manager on its right, hotel management below. Below md the three parties stack in a column with
 * short arrows, so nothing scrolls sideways at 390 px.
 */
export const AetherixWhoFigure = () => {
  const [pms, manager, payer] = STRATEGY.who;
  return (
    <figure className="mt-10" aria-label={STRATEGY.whoCaption}>
      <div className="flex max-w-3xl flex-col items-stretch gap-2 md:grid md:grid-cols-[1fr_4rem_1fr_4rem_1fr] md:items-center md:gap-0">
        <Party {...pms} />
        <Arrow d="M2 10h56M52 5l6 5-6 5" className="self-center rotate-90 md:rotate-0" />
        <div className="rounded-xl border-[1.5px] border-secondary bg-surface-container-low px-4 py-4 text-center">
          <p className="font-headline text-[26px] leading-tight text-primary">Aetherix</p>
        </div>
        <Arrow d="M2 8h56M52 3l6 5-6 5M62 20H6M12 15l-6 5 6 5" viewBox="0 0 64 28" className="self-center rotate-90 md:rotate-0" />
        <Party {...manager} />
        <div className="hidden md:block" /><div className="hidden md:block" />
        <div className="hidden justify-center md:flex"><Arrow d="M10 42V4M5 10l5-6 5 6" viewBox="0 0 20 44" w="h-11 w-5" /></div>
        <div className="hidden md:block" /><div className="hidden md:block" />
        <div className="hidden md:block" /><div className="hidden md:block" />
        <Party {...payer} />
        <div className="hidden md:block" /><div className="hidden md:block" />
      </div>
      <figcaption className="mt-3 font-label text-xs text-on-surface-variant">{STRATEGY.whoCaption}</figcaption>
    </figure>
  );
};

export default AetherixWhoFigure;
