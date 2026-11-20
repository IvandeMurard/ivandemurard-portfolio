import type { ReactNode } from "react";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { Reveal } from "@/components/Reveal";
import { CONTACT, SOCIAL_LINKS } from "@/content/site";
import { useTrackClick } from "@/hooks/useTrackClick";
import { ExternalMark } from "@/components/ui/ExternalMark";
import { AskAiMenu } from "@/components/AskAiMenu";
import { Blend } from "@/components/layout/Blend";

/** The one Contact block, used on the homepage ("04 · Contact") and on /rose ("Contact"). Copy lives in src/content/site.ts. */
/** blendFrom: the ground above, faded into the navy (null when the page draws its own passage). */
export const ContactBlock = ({ number, after, blendFrom = "surface" }: { number?: string; after?: ReactNode; blendFrom?: string | null }) => {
  const track = useTrackClick();
  return (
    <>
    {blendFrom && <Blend from={blendFrom} to="inverse-ground" />}
    <section id="contact" aria-labelledby="contact-h" className="section-inverse">
      <Reveal className="py-16 md:py-28 px-6 md:px-10 max-w-[980px] mx-auto">
        <p className="font-mono uppercase tracking-[0.12em] text-kicker text-secondary mb-8" data-reveal-child>{number ? `${number} · ${CONTACT.kicker}` : CONTACT.kicker}</p>
        <h2 id="contact-h" className="font-headline font-normal text-heading text-[clamp(32px,4.2vw,60px)] leading-[1.06] tracking-[-0.02em]" data-reveal-child>
          {CONTACT.heading}
        </h2>
        <p className="mt-6 text-[19px] md:text-[21px] leading-relaxed text-on-surface max-w-2xl" data-reveal-child>
          {CONTACT.subline}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-8" data-reveal-child>
          <a href={SOCIAL_LINKS.schedule} target="_blank" rel="noopener noreferrer"
            onClick={() => track({ label: "Book a call", href: SOCIAL_LINKS.schedule, kind: "contact" })}
            className="bg-primary text-on-primary px-8 py-4 rounded-xl font-medium tracking-wide hover:bg-secondary hover:text-on-secondary transition-colors">
            <ExternalMark>{CONTACT.buttons.book}</ExternalMark>
          </a>
          <a href={SOCIAL_LINKS.email} className="font-headline text-[22px] text-primary border-b border-primary/40 pb-0.5 hover:border-primary transition-colors">
            {CONTACT.buttons.email}
          </a>
          <AskAiMenu prompt={CONTACT.aiPrompt} label={CONTACT.buttons.askAi}
            triggerClassName="text-primary border-b border-primary/40 pb-0.5 hover:border-primary transition-colors" />
        </div>
        <p className="mt-10 font-mono text-meta text-on-surface-variant flex flex-wrap items-center gap-x-3 gap-y-2" data-reveal-child>
          <Link to="/contact" className="text-primary border-b border-primary/40 hover:border-primary">{CONTACT.allWays} →</Link>
        </p>
        {/* A line only some pages add under the shared block (the Field Notes index). */}
        {after && <p className="mt-7 text-[15px] text-on-surface-variant" data-reveal-child>{after}</p>}
      </Reveal>
    </section>
    </>
  );
};
