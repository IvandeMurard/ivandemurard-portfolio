import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { Reveal } from "@/components/Reveal";
import { CONTACT, SOCIAL_LINKS } from "@/content/site";
import { useTrackClick } from "@/hooks/useTrackClick";

const PERPLEXITY_HREF = `https://www.perplexity.ai/search?q=${encodeURIComponent(CONTACT.aiPrompt)}`;

const CopyPrompt = () => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.aiPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable: leave the label unchanged */ }
  };
  return (
    <button type="button" onClick={copy}
      className="inline-flex items-center gap-1.5 text-primary border-b border-primary/40 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">
      {copied ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
      {copied ? "Copied!" : CONTACT.copyPrompt}
      <span className="sr-only" aria-live="polite">{copied ? "Prompt copied to clipboard" : ""}</span>
    </button>
  );
};

/** The one Contact block, used on the homepage ("04 · Contact") and on /rose-design-lab ("Contact"). Copy lives in src/content/site.ts. */
export const ContactBlock = ({ number }: { number?: string }) => {
  const track = useTrackClick();
  return (
    <section id="contact" aria-labelledby="contact-h" className="section-inverse">
      <Reveal className="py-16 md:py-28 px-6 md:px-10 max-w-[980px] mx-auto">
        <p className="font-mono uppercase tracking-[0.12em] text-[11px] text-secondary mb-8" data-reveal-child>{number ? `${number} · ${CONTACT.kicker}` : CONTACT.kicker}</p>
        <h2 id="contact-h" className="font-headline font-normal text-primary text-[clamp(32px,4.2vw,60px)] leading-[1.06] tracking-[-0.02em]" data-reveal-child>
          {CONTACT.heading}
        </h2>
        <p className="mt-6 text-[19px] md:text-[21px] leading-relaxed text-on-surface max-w-2xl" data-reveal-child>
          {CONTACT.subline}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-8" data-reveal-child>
          <a href={SOCIAL_LINKS.schedule} target="_blank" rel="noopener noreferrer"
            onClick={() => track({ label: "Book a call", href: SOCIAL_LINKS.schedule, kind: "contact" })}
            className="bg-primary text-on-primary px-8 py-4 rounded-xl font-medium tracking-wide hover:bg-secondary hover:text-on-secondary transition-colors">
            {CONTACT.buttons.book}<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={SOCIAL_LINKS.email} className="font-headline text-[22px] text-primary border-b border-primary/40 pb-0.5 hover:border-primary transition-colors">
            {CONTACT.buttons.email}
          </a>
          <a href={PERPLEXITY_HREF} target="_blank" rel="noopener noreferrer"
            onClick={() => track({ label: "Ask Perplexity", href: PERPLEXITY_HREF, kind: "contact" })}
            className="text-primary border-b border-primary/40 pb-0.5 hover:border-primary transition-colors">
            {CONTACT.buttons.askAi} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <p className="mt-10 font-mono text-[12px] text-on-surface-variant flex flex-wrap items-center gap-x-3 gap-y-2" data-reveal-child>
          <CopyPrompt />
          <span aria-hidden>·</span>
          <Link to="/contact" className="text-primary border-b border-primary/40 hover:border-primary">{CONTACT.allWays} →</Link>
        </p>
      </Reveal>
    </section>
  );
};
