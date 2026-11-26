import { Fragment, useEffect, useRef, useState } from "react";
import { Blend } from "@/components/layout/Blend";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS } from "@/content/site";
import { STATUSES } from "@/content/statuses";
import { cn } from "@/lib/utils";
import { registerRail } from "@/lib/railRegistry";
import {
  AETHERIX_CHAPTERS, CLOSE, HERO, HOW, LEGEND, PROBLEM, PROVEN, STRATEGY, TECH_LABEL, TLDR, type AetherixChapter, type Mark,
} from "@/content/aetherixCase";
import { ChapterBar, ChapterRail, KICKER, LABEL, LEGEND_TONE, MARK_GLYPH, ReadingThread, useActiveChapter } from "@/components/case/reading";
import { Term } from "@/components/Term";
import { AetherixArchitectureDiagram } from "@/components/atherix/AetherixArchitectureDiagram";
import { AetherixDisclosure } from "@/components/atherix/AetherixDisclosure";
import { AetherixHomepageLoop } from "@/components/atherix/AetherixHomepageLoop";
import { AetherixStackChips } from "@/components/atherix/AetherixStackChips";
import { AetherixWhatRemainsPrivate } from "@/components/atherix/AetherixWhatRemainsPrivate";
import { AetherixWhoFigure } from "@/components/atherix/AetherixWhoFigure";
import { ExternalMark } from "@/components/ui/ExternalMark";
import { AetherixLedger } from "@/components/atherix/AetherixLedger";
import { AetherixAgentAccordion } from "@/components/atherix/AetherixAgentAccordion";
import { AetherixArchitectureFigure } from "@/components/atherix/AetherixArchitectureFigure";
import { ARCH, INSIDE, LEDGER, METHOD, NEXT } from "@/content/aetherixInside";

const DESCRIPTION = `Aetherix is an F&B agent for boutique hotels: one WhatsApp message a day, the manager's reply, and the outcome recorded next to it. ${STATUSES.aetherix.note}`;

const TRUST = [
  {
    icon: "verified",
    title: "Evaluation as a contract",
    body: "Qonto-inspired. Versioned golden datasets. Any change to forecasting, providers, memory or prompts needs a green eval pipeline to merge. A hard CI gate, not a habit.",
  },
  {
    icon: "monitoring",
    title: "Observability & metering",
    body: "Every MCP tool call is one structured event. Auditable, queryable, priceable. The product is operable, not opaque.",
  },
  {
    icon: "lock",
    title: "Multi-tenant security",
    body: "hotel_id scoped at every layer (RLS, Python guards, MCP token binding), resolved server-side, never a tool input. Read-only PMS access. GDPR: Supabase EU, Hive Memory is anonymized aggregates only.",
  },
];

const FAQ = [
  {
    q: "What is Aetherix in one sentence?",
    a: "An F&B agent for boutique hotels: one WhatsApp message a day with tomorrow's covers and staffing, the manager's reply, and the outcome recorded next to it. It is one of five agents in the Hospitality Multi-Agent Architecture.",
  },
  {
    q: "Why a loop, not just a forecast?",
    a: "On public data the forecast only matches a simple baseline at the next-day horizon, so the forecast is not the claim: simple rules hold on ordinary days, and the value sits in the outliers (weather swings, sudden drops), where staffing and food waste cost most. What is built and testable is the loop: each recommendation is stored with the manager's reply and the real outcome, which is what lets the system be measured and corrected.",
  },
  {
    q: "How does the loop work?",
    a: "Evening: a recommendation with its reasons. Reply: accept, reject, or the right figure. Next morning: the real outcome is stored next to it. Then the agent recalibrates. Free-text replies are not used yet. Whether the agent gets sharper over time is what a pilot would test.",
  },
  {
    q: "How is Aetherix part of a multi-agent architecture?",
    a: "Five specialized MCP-native agents, each with a strict bounded context: Aetherix (F&B execution), Tacet (environmental signal), Anima (guest memory, synthetic PoC), Peritia (house knowledge, Design), Orchestrator (supervisory routing, Synthetic PoC, in shadow; becoming the only way to the manager is Design). No shared code, no monolith to displace. Aetherix executes, it does not orchestrate.",
  },
  {
    q: "How is multi-tenant security handled?",
    a: "hotel_id is scoped at every layer (Postgres RLS, Python guards, MCP token binding), resolved server-side, never accepted as a tool input. PMS access is read-only. Data residency: Supabase EU. Hive Memory holds anonymized aggregates only, no cross-tenant raw data.",
  },
  {
    q: "How do I pilot Aetherix?",
    a: "Book a call. No pilot partner is signed and no go-live date is set. The first pilot is meant for a hotel running Apaleo. Pricing on results is the entry model; what follows is undecided.",
  },
];

const linkCls = "text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";
const subheadCls = "font-headline text-2xl md:text-3xl text-heading leading-tight";
const h2Cls = "mt-3 font-headline text-4xl leading-tight text-heading md:text-5xl";
const bodyCls = "font-body text-base text-on-surface md:text-[17px]";
const noteBoxCls = "rounded-lg border border-dashed border-on-surface-variant px-4 py-3 font-body text-[15px] text-on-surface-variant";
/** One circled comparison. A drawn ring, not a pill: it marks the two figures that are compared. */
const Circled = ({ children }: { children: string }) => <span className="whitespace-nowrap rounded-full border-[1.5px] border-secondary px-1.5">{children}</span>;

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const m = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!m) return;
    const on = () => setReduced(m.matches);
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);
  return reduced;
};

const MarkLabel = ({ mark, note }: { mark: Mark; note?: string }) => (
  <span className="ml-3"><span aria-hidden="true">{MARK_GLYPH[mark]} </span>{note ?? mark}</span>
);

/** One chapter: kicker with its status marks, then the h2 in roman. The id is the anchor Rose's source links use. */
const Chapter = ({ c, i, children }: { c: AetherixChapter; i: number; children?: React.ReactNode }) => (
  <section id={c.id} data-ch={i} aria-labelledby={`${c.id}-heading`} className="scroll-mt-32 pt-24 first:pt-0 md:pt-32 md:first:pt-0">
    <p className={KICKER}>{c.kicker}{c.marks?.map((m) => <MarkLabel key={m} mark={m} note={c.markNote?.[m]} />)}</p>
    <h2 id={`${c.id}-heading`} className={h2Cls}>{c.heading}</h2>
    {children}
  </section>
);

const Hero = () => (
  <header aria-labelledby="aetherix-hero-h" className="px-8 pb-12 pt-32 md:px-12">
    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-start lg:gap-16">
      <div className="flex min-w-0 flex-col gap-5">
        <p className={cn("flex flex-wrap items-center gap-3", KICKER)}>
          {HERO.label}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary px-2.5 py-0.5 font-body text-xs normal-case tracking-normal text-primary">
            <span aria-hidden="true" className="block h-[7px] w-[7px] rounded-full bg-signal-warn" />{STATUSES.aetherix.word}
          </span>
        </p>
        <h1 id="aetherix-hero-h" className="font-headline text-5xl leading-[1.02] tracking-tight text-heading md:text-6xl lg:text-[64px]">
          {HERO.headline[0]}<em className="text-secondary">{HERO.headline[1]}</em>
        </h1>
        <p className="max-w-xl font-body text-lg leading-relaxed text-on-surface-variant md:text-[19px]">{HERO.lead}</p>
        <dl className="mt-2 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-1.5 font-body text-sm text-on-surface-variant">
          <dt className="text-secondary">Role</dt><dd>{HERO.role}</dd>
          <dt className="text-secondary">Status</dt><dd>{HERO.status}</dd>
        </dl>
        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button asChild variant="outline" className="min-h-12"><a href={`#${INSIDE.anchor}`}>{HERO.primary}</a></Button>
          <a href={SOCIAL_LINKS.schedule} target="_blank" rel="noopener noreferrer" className={linkCls}><ExternalMark>Book a call</ExternalMark></a>
          <a href="https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture" target="_blank" rel="noopener noreferrer" className={linkCls}><ExternalMark>GitHub</ExternalMark></a>
        </div>
      </div>
      <div className="min-w-0 max-w-[30rem]"><AetherixHomepageLoop /></div>
    </div>
    <section aria-labelledby="aetherix-tldr" className="mx-auto mt-14 max-w-7xl border-t border-primary pt-4">
      <h2 id="aetherix-tldr" className={cn(LABEL, "text-on-surface-variant")}>TL;DR</h2>
      <dl className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {TLDR.map(([t, d]) => (
          <div key={t} className="border-b border-primary pb-4">
            <dt className="font-body text-[13px] text-secondary">{t}</dt>
            <dd className="mt-1.5 font-body text-[15px] text-on-surface">{d}</dd>
          </div>
        ))}
      </dl>
      <dl className="mt-7 max-w-3xl space-y-1 font-body text-sm text-on-surface">
        {LEGEND.map(([term, def]) => (
          <div key={term} className="flex gap-2"><dt className={cn("w-28 shrink-0 font-label text-xs", LEGEND_TONE[term])}><span aria-hidden="true">{MARK_GLYPH[term]} </span>{term}</dt><dd>{def}</dd></div>
        ))}
      </dl>
    </section>
  </header>
);

const Problem = () => (
  <div className="mt-5 max-w-2xl space-y-4">
    <p className={bodyCls}>{PROBLEM.p1}</p>
    <p className={bodyCls}>{PROBLEM.p2}</p>
    <p className={cn(noteBoxCls, "mt-5")}><strong className="font-semibold text-primary">{PROBLEM.originLabel}</strong> {PROBLEM.origin}</p>
  </div>
);

const How = () => (
  <>
    <p className={cn(bodyCls, "mt-5 max-w-2xl")}>{HOW.intro}</p>
    <ol className="mt-10 max-w-3xl list-none p-0 md:mt-12">
      {HOW.steps.map(([label, text], i) => (
        <li key={label} className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 pb-9 last:pb-0 md:grid-cols-[2.5rem_10rem_minmax(0,1fr)] md:gap-x-6 md:pb-10">
          <div aria-hidden="true" className="relative row-span-2 flex justify-center md:row-span-1">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-secondary font-label text-sm text-secondary">{i + 1}</span>
            {i < HOW.steps.length - 1 && (
              <div className="absolute bottom-2 left-1/2 top-10 flex -translate-x-1/2 flex-col items-center text-secondary">
                <span className="min-h-0 w-px flex-1 bg-outline-variant" />
                <Icon name="arrow_downward" className="text-base" />
              </div>
            )}
          </div>
          <h3 className="pt-0.5 font-body text-lg font-semibold leading-snug text-heading">{label.slice(label.indexOf("·") + 1).trim()}</h3>
          <p className="col-start-2 mt-2 font-body text-base text-on-surface md:col-start-3 md:mt-0">{text}</p>
        </li>
      ))}
    </ol>
    <p className="mt-8 max-w-2xl border-l-2 border-outline-variant pl-5 font-body text-base text-on-surface-variant">{HOW.note}</p>
  </>
);

const Strategy = () => (
  <>
    <p className={cn(bodyCls, "mt-5 max-w-2xl")}>{STRATEGY.intro}</p>
    <div className="mt-10 max-w-2xl md:mt-12">
      <h3 className={subheadCls}>{STRATEGY.decisions[0][1]}</h3>
      <p className={cn(bodyCls, "mt-3")}>{STRATEGY.decisions[0][2]}</p>
    </div>
    <AetherixWhoFigure />
    <div className="mt-10 max-w-2xl border-l-2 border-outline-variant pl-5">
      <h3 className="font-body text-base font-semibold text-heading">{STRATEGY.unprovenLabel}</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 font-body text-base text-on-surface-variant marker:text-secondary">{STRATEGY.unproven.map((u) => <li key={u}>{u}</li>)}</ul>
    </div>
    <div className="mt-8">
      <AetherixDisclosure id="product-decisions" title="Product decisions">
        <ol start={2} className="max-w-2xl list-decimal space-y-6 pl-5 marker:text-secondary">
          {STRATEGY.decisions.slice(1).map(([n, title, why]) => (
            <li key={n} className="pl-2">
              <h3 className="font-body text-base font-semibold text-heading">{title}</h3>
              <p className="mt-2 font-body text-base text-on-surface">{why}</p>
            </li>
          ))}
        </ol>
      </AetherixDisclosure>
    </div>
  </>
);

const Proven = () => (
  <>
    <div className="mt-10 flex max-w-3xl flex-col gap-14">
      <div className="order-2 min-w-0">
        <h3 className={subheadCls}>{PROVEN.workingLabel}</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 font-body text-[15px] text-on-surface marker:text-secondary">
          {PROVEN.working.map((w) => (
            <li key={typeof w === "string" ? w : w.join("")}>{typeof w === "string" ? w : <>{w[0]}<Circled>{w[1]}</Circled>{w[2]}</>}</li>
          ))}
        </ul>
        <p className="mt-3 font-label text-xs text-on-surface-variant">{PROVEN.workingNote}</p>
      </div>
      <div className="order-1 min-w-0">
        <h3 className={subheadCls}>{PROVEN.testLabel}</h3>
        <p className="mt-4 font-headline text-2xl leading-snug text-heading md:text-[28px]">{PROVEN.test[0]}<Circled>{PROVEN.test[1]}</Circled>{PROVEN.test[2]}<Circled>{PROVEN.test[3]}</Circled>{PROVEN.test[4]}</p>
        <p className="mt-4 border-l-2 border-outline-variant pl-5 font-body text-base text-on-surface-variant">{PROVEN.testLimit}</p>
        <div className="mt-4">
          <AetherixDisclosure id="the-numbers" title="The numbers"><p className="max-w-3xl text-sm leading-relaxed text-on-surface-variant">Kaggle Recruit, 30 Japanese restaurants out of 829, 1,193 scored points, deterministic rerun. Prophet against a naive same-weekday baseline (the mean of the last four same weekdays): mean MAPE 49.71% vs 55.86%, passing the pre-set 5-point rule. MdAPE 27.0% vs 27.6%. At J+1, 28.5% vs 27.9%. A gradient-boosted model reaches 25.6% on the median. The protocol was not pre-registered for this run.</p><p className="mt-3 max-w-3xl text-sm leading-relaxed text-on-surface-variant"><strong className="font-semibold text-on-surface">MAPE.</strong> Mean absolute percentage error. The average gap between a forecast and what actually happened, expressed as a percentage, which makes errors comparable across covers, revenue, or volumes.</p></AetherixDisclosure>
        </div>
      </div>
    </div>
    <ol className="mt-9 grid list-none grid-cols-2 border-t border-primary p-0 lg:grid-cols-4">
      {PROVEN.phases.map(([glyph, label, text], i) => (
        <li key={label} className={cn("p-3 first:pl-0", i === 1 && "bg-surface-container-low")}>
          <p className={cn(LABEL, i < 2 ? "text-secondary" : "text-on-surface-variant")}><span aria-hidden="true">{glyph} </span>{label}</p>
          <p className="mt-1 font-body text-sm text-on-surface">{text}</p>
        </li>
      ))}
    </ol>
  </>
);

/** The page's existing technical content, collapsed, at the end of chapter 06. */
const Technical = () => (
  <div className="mt-10">
    <AetherixDisclosure id="technical-reader" title={TECH_LABEL}>
      <h3 className={subheadCls}>Pipeline and stack</h3>
      <p className="mb-6 mt-3 max-w-3xl text-sm leading-relaxed text-on-surface-variant">Apaleo (OAuth2 and MCP read) + Open-Meteo + PredictHQ → Prophet forecast and staffing → pgvector memory recall (Operational Memory + Cold-start prior, research) → Claude Sonnet reasoning → WhatsApp or Email.</p>
      <div className="mb-8 min-w-0 overflow-hidden"><AetherixArchitectureDiagram /></div>
      <AetherixStackChips />
      <h3 className={cn(subheadCls, "mt-12")}>Built to be trusted</h3>
      <dl className="mt-6 max-w-3xl space-y-7">{TRUST.map((item) => <div key={item.title} className="grid gap-2 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-6"><dt className="font-body text-base font-semibold text-heading">{item.title}</dt><dd className="font-body text-base text-on-surface-variant">{item.body}</dd></div>)}</dl>
      <h3 className={cn(subheadCls, "mt-12")}>More</h3>
      <div className="mt-5"><AetherixWhatRemainsPrivate /></div>
      <div className="mt-8 max-w-3xl text-sm leading-relaxed text-on-surface-variant">
        <p><Link to="/lore" className={linkCls}>Lore</Link>, in aviation maintenance, shares this architecture and cannot close the same loop. Nothing there tells the system whether an observation was right, and the moment a technician escalates the counterfactual disappears. Aetherix has an outcome to compare against; that difference decides how much each product is allowed to learn on its own.</p>
        <p className="mt-5">The evaluation vocabulary behind these gates, harnesses, graders, acceptance tiers and closed loops is in <Link to="/journal/harnesses-graders-closed-loops" className={linkCls}>What is an LLM evaluation harness? Graders, protocols and closed loops for AI agents</Link></p>
        <p className="mt-5">Aetherix is one of five agents that talk to each other only through <Term id="mcp">MCP</Term>. <Link to="/architecture" className={linkCls}>The architecture note</Link> says which are built and which are design. <Link to="/anima" className={linkCls}>Anima, the guest memory node, has its own case study</Link>.</p>
      </div>
    </AetherixDisclosure>
  </div>
);

const Ledger = () => (
  <>
    <p className={cn(bodyCls, "mt-5 max-w-2xl")}>{LEDGER.intro} <span className="border-b-[1.5px] border-secondary">{LEDGER.bet}</span></p>
    <AetherixLedger />
    <div className="mt-12 max-w-2xl">
      <h3 className={subheadCls}>{LEDGER.whyLabel}</h3>
      <p className={cn(bodyCls, "mt-3")}>{LEDGER.why}</p>
      <p className="mt-4 border-l-2 border-outline-variant pl-5 font-body text-base text-on-surface-variant">{LEDGER.whyNote}</p>
    </div>
    <div className="mt-8 max-w-2xl">
      <AetherixDisclosure id="shared-layer-limits" title={LEDGER.sharedLabel}>
        <ul className="list-disc space-y-2 pl-5 font-body text-base text-on-surface-variant marker:text-secondary">{LEDGER.shared.map((u) => <li key={u}>{u}</li>)}</ul>
      </AetherixDisclosure>
    </div>
  </>
);

const Built = () => (
  <>
    <dl className="mt-8 max-w-3xl space-y-6 md:mt-10">
      {METHOD.map(([lead, rest]) => <div key={lead} className="grid gap-2 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8"><dt className="font-body text-base font-semibold text-heading">{lead}</dt><dd className="font-body text-base text-on-surface">{rest}</dd></div>)}
    </dl>
    <h3 id={INSIDE.anchor} className={cn(subheadCls, "mt-12 scroll-mt-28")}>{INSIDE.heading}</h3>
    <p className="mt-2 max-w-2xl font-body text-[15.5px] text-on-surface-variant">{INSIDE.intro}</p>
    <AetherixAgentAccordion />
    <div className="mt-12">
      <AetherixDisclosure id={ARCH.anchor} title={ARCH.heading}>
        <p className="max-w-2xl font-body text-base text-on-surface-variant">{ARCH.intro[0]}<Link to="/architecture" className={linkCls}>{ARCH.intro[1]}</Link>{ARCH.intro[2]}</p>
        <AetherixArchitectureFigure />
      </AetherixDisclosure>
    </div>
    <Technical />
  </>
);

const BODIES: Record<string, () => JSX.Element> = {
  "the-problem": Problem,
  "how-it-works": How,
  "product-strategy": Strategy,
  "where-it-stands": Proven,
  "decision-ledger": Ledger,
  "how-its-built": Built,
};

/** The way on: the architecture page, as a dark card before the close. */
const Next = () => (
  <section aria-label={NEXT.label} className="mx-auto max-w-7xl px-8 pb-16 md:px-12 md:pb-24">
    <div className="aetherix-dark rounded-[22px] px-7 pb-8 pt-12 md:px-16 md:pb-10 md:pt-14">
      <div aria-hidden="true" className="aetherix-dark-glow" />
      <div className="relative">
        <p className="font-label text-kicker uppercase tracking-[0.12em] text-on-surface-variant">{NEXT.kicker}</p>
        <p className="mt-3.5 font-headline text-4xl leading-[1.05] text-heading md:text-5xl">{NEXT.title}</p>
        <p className="mt-4 max-w-3xl font-body text-lg leading-snug text-on-surface md:text-[21px]">{NEXT.text}</p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant pt-5">
          <p className="font-body text-sm text-on-surface-variant">{NEXT.agents}</p>
          <Link to="/architecture" className="inline-flex min-h-11 items-center rounded-full border border-primary px-5 font-body text-[14.5px] text-primary hover:bg-[hsl(var(--primary)/0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">{NEXT.cta}</Link>
        </div>
      </div>
    </div>
  </section>
);

const Close = () => (
  <>
    <Blend from="aetherix-warm" to="inverse-ground" />
    <section id="talk" aria-labelledby="talk-heading" className="section-inverse scroll-mt-24 px-8 pb-24 pt-4 text-center md:px-12 md:pb-28">
      <p className={KICKER}>{CLOSE.kicker}</p>
      <h2 id="talk-heading" className="mt-3.5 font-headline text-4xl text-heading md:text-[44px]">{CLOSE.heading}</h2>
      <p className="mx-auto mt-3.5 max-w-xl font-body text-lg text-on-surface">{CLOSE.text}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-4">
        <Button asChild><a href={SOCIAL_LINKS.schedule} target="_blank" rel="noopener noreferrer"><Icon name="event" /><ExternalMark>Book a call</ExternalMark></a></Button>
        <Button asChild variant="outline"><a href="https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture" target="_blank" rel="noopener noreferrer"><Icon name="hub" /><ExternalMark>Architecture repo</ExternalMark></a></Button>
      </div>
    </section>
  </>
);

const Atherix = () => {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const active = useActiveChapter(root);
  // The chapter list is this page's rail: its active chapter is what a source link calls "where the reader is".
  const activeRef = useRef(-1);
  activeRef.current = active;
  useEffect(() => registerRail(() => { const c = AETHERIX_CHAPTERS[activeRef.current]; return c ? { id: c.id, label: c.toc } : null; }), []);
  return (
  <SiteLayout title="Aetherix, the F&B agent for boutique hotels">
    <Seo
      title="Aetherix, the F&B agent for boutique hotels"
      description={DESCRIPTION}
      path="/aetherix"
      type="article"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "Aetherix",
          headline: "Aetherix, the F&B agent for boutique hotels",
          description: DESCRIPTION,
          url: "https://ivandemurard.com/aetherix",
          creator: { "@type": "Person", name: "Ivan de Murard", url: "https://ivandemurard.com" },
          dateCreated: "2026-01-01",
          dateModified: "2026-11-16",
          codeRepository: "https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture",
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
      ]}
    />
    <div ref={root} className="case-bg relative" data-case="aetherix">
      <ReadingThread rootRef={root} reduced={reduced} tone="bg-secondary" />
      <ChapterBar chapters={AETHERIX_CHAPTERS} active={active} />
      <Hero />
      <div className="mx-auto grid max-w-7xl gap-12 px-8 pb-24 pt-8 md:px-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <ChapterRail chapters={AETHERIX_CHAPTERS} active={active} reduced={reduced} />
        <div className="min-w-0 max-w-[56rem]">
          {AETHERIX_CHAPTERS.map((c, i) => {
            const Body = BODIES[c.id];
            return (
              <Fragment key={c.id}>
                <Chapter c={c} i={i}>
                  {Body && <Body />}
                </Chapter>
              </Fragment>
            );
          })}
        </div>
      </div>
      <Next />
      <Close />
    </div>
  </SiteLayout>
  );
};

export default Atherix;
