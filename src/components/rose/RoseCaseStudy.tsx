import { Fragment, memo, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { registerRail } from "@/lib/railRegistry";
import { CompassRose } from "@/components/rose/CompassRose";
import { RoseCue, RoseMark } from "@/components/rose/RoseKinetic";
import { SOCIAL_LINKS } from "@/content/site";
import { ContactBlock } from "@/components/case/ContactBlock";
import { AnswerFormats, HeroDock, TestLoop } from "@/components/rose/RoseDemos";
import { HowRoseWorks } from "@/components/rose/HowRoseWorks";

/**
 * Rose case study, single page (docs/rose-case-study.md §6). Only §6.0
 * Page-wide is built here: continuous background, copper reading thread,
 * table of contents, honesty legend and chapter transitions. Chapter bodies
 * are slots (kicker + heading + transition) until their own section is built.
 * All copy is verbatim from docs/rose-case-study-copy-v2.md.
 */

type Chapter = { id: string; toc: string; kicker: string; heading: string };

export const ROSE_CHAPTERS: Chapter[] = [
  { id: "ch-00", toc: "00 The idea", kicker: "00 · The idea", heading: "A portfolio that can answer questions" },
  { id: "ch-01", toc: "01 Qualify", kicker: "01 · 21 Jul 2026", heading: "Qualify" },
  { id: "ch-02", toc: "02 Listen to the page", kicker: "02 · 7 Aug 2026", heading: "Listen to the page" },
  { id: "ch-03", toc: "03 Know where you are", kicker: "03 · 10 Aug 2026", heading: "Know where you are" },
  { id: "ch-04", toc: "04 One dock", kicker: "04 · 14 Oct 2026", heading: "One dock" },
  { id: "ch-05", toc: "05 Earn trust", kicker: "05 · 24 Oct 2026", heading: "Earn trust" },
  { id: "ch-06", toc: "06 Answer formats", kicker: "06 · Answer formats", heading: "Answers that point into the page" },
  { id: "ch-07", toc: "07 Trust", kicker: "07 · Trust", heading: "Trust has two separate contracts." },
  { id: "ch-08", toc: "08 What she got wrong", kicker: "08 · What she got wrong", heading: "Caught in testing" },
  { id: "ch-09", toc: "09 Next steps", kicker: "09 · Next steps", heading: "Next: help readers move across the whole site" },
  { id: "ch-10", toc: "10 Open questions", kicker: "10 · Open questions", heading: "Four questions that have yet to be answered. Have an answer to one of them? Tell me." },
];

/** The marker printed after a chapter kicker. */
export const CHAPTER_MARK: Record<string, "Built" | "Validation" | "Design"> = {
  "ch-01": "Built", "ch-02": "Built", "ch-03": "Built", "ch-04": "Built", "ch-05": "Built",
  "ch-06": "Design", "ch-07": "Built", "ch-08": "Validation", "ch-09": "Design",
};
const MARK_GLYPH = { Built: "●", Validation: "◐", Design: "○" } as const;

/** Rose's notes come from co-existence.ai's AI cursor. Printed above chapter 01. */
export const NOTES_INTRO = "Rose's notes come from co-existence.ai's AI cursor, an agent that comments on the page it lives on.";

const LEGEND_TONE: Record<string, string> = { Built: "text-secondary", Validation: "text-primary", Design: "text-on-surface-variant" };

export const LEGEND = [
  ["●", "Built", "Implemented behaviour that can be inspected in the product or repository."],
  ["◐", "Validation", "A bounded test, audit or measurement. It does not prove every visitor outcome."],
  ["○", "Design", "A proposed direction or a prototype."],
] as const;

/* §6.1 Hero. Copy verbatim from docs/rose-case-study-copy-v2.md. The demo is in RoseDemos.tsx. */
export const HERO = { label: "Case study · Rose", status: "Live, text only", headline: ["A portfolio ", "you can question."] } as const;
/** The sentence under the legend; the repository is linked. */
export const LEGEND_NOTE = { before: "Milestones come from ", link: "the repository", after: ": commit dates, archived plans, the original prompt. Readings of the design are mine." } as const;
export const HERO_LEAD = "Rose answers visitors' questions from the site's own pages. This is how I designed her, the five decisions that changed her, and what I still need to learn.";
export const TLDR = [
  ["The problem", "A case study shows the work, but it cannot answer a visitor's own question."],
  ["Five decisions", "Between July and October 2026, I made Rose qualify visitors, then listen to the page, know the section in view, live in one dock and earn trust."],
  ["Today", "Rose is live and text only. She knows the page and section in view, answers from the site’s own text and sends nothing when you book."],
  ["Still open", "Whether an answer that stays faithful to the sources helps each reader understand the work from their own angle."],
] as const;

/* §6.3 Chapters 01 to 05. Copy from docs/rose-case-study-copy-v2.md; vignette and source data from docs/rose-case-study-copy.md (unchanged in v2). */
type VItem =
  | { t: "note"; text: string }
  | { t: "chips"; chips: string[] }
  | { t: "card"; text: string }
  | { t: "q"; text: string }
  | { t: "a"; text: string };
type Vignette = { caption: string; b: string; a: string; mb: string; ma: string; before: VItem[]; after: VItem[] };
type Milestone = { brief: string; tension: string; decision: string; result: string; tradeoff?: string; source: string; note: string; vignette: Vignette };

const FOUR_INTENTS = ["Product expertise", "Technical profile", "Culture fit", "Just exploring"];

export const MILESTONES: Record<string, Milestone> = {
  "ch-01": {
    brief: "Help the visitor decide, in two or three exchanges, whether to book 30 minutes with me.",
    tension: "Four intent chips asked visitors who they were before showing them anything.",
    decision: "Ship a small dock with four intents and a booking card.",
    result: "Rose worked as a qualification funnel with one destination.",
    tradeoff: "A funnel makes bookings easy to count, but it treats every visitor as a lead. On a portfolio, that costs more trust than the bookings are worth.",
    source: "original prompt and config, commit 51245fc",
    note: "My first job was to sort you into four boxes: his idea, and he admits it.",
    vignette: {
      caption: "The site before Rose, and her first dock", b: "Before", a: "July", mb: "every page · before 21 Jul", ma: "every page · 21 Jul",
      before: [{ t: "note", text: "No dock. The case studies are the only way in." }],
      after: [{ t: "chips", chips: FOUR_INTENTS }, { t: "card", text: "the one destination" }],
    },
  },
  "ch-02": {
    brief: "Keep booking reachable.",
    tension: "The same four intents appeared on every page, whatever the visitor was reading.",
    decision: "Replace the fixed intents with three questions written for each page, and keep Book a call as a constant exit.",
    result: "Questions now start from the work the visitor is reading.",
    source: "archived plan, contextual starters, 7 Aug",
    note: "He stopped me asking who you are and had me ask what you were reading.",
    vignette: {
      caption: "Dock starters on /aetherix", b: "July", a: "August", mb: "/aetherix · 21 Jul", ma: "/aetherix · after 7 Aug",
      before: [{ t: "chips", chips: FOUR_INTENTS }],
      after: [{ t: "chips", chips: ["What has actually been built?", "What happens when it’s wrong?", "Book a call"] }],
    },
  },
  "ch-03": {
    brief: "Answer generally about Ivan.",
    tension: "A question about one page deserves an answer about that page.",
    decision: "Pass the current page and intent into Rose’s context.",
    result: "Answers refer to the case study being read.",
    source: "commit b236ff3, page context and intent",
    note: "I know which page you’re on, not who you are: he drew that line.",
    vignette: {
      caption: "What Rose receives with a question", b: "Before", a: "After", mb: "context: none", ma: "context: /aetherix · section in view",
      before: [{ t: "q", text: "What does he measure?" }, { t: "a", text: "An answer about Ivan in general." }],
      after: [{ t: "q", text: "What does he measure?" }, { t: "a", text: "An answer about the case study being read." }],
    },
  },
  "ch-04": {
    brief: "Several entry points to Rose.",
    tension: "A dock competing with the page reads as a sales widget.",
    decision: "Keep one dock, discreet at rest and full contrast in use, with questions written for each page.",
    result: "Rose stays out of the way until asked.",
    source: "commit 7752dbb, unified dock and chips",
    note: "I used to sit in the nav bar, where nobody found me, so he moved me.",
    vignette: {
      caption: "Where Rose lives", b: "Before", a: "After", mb: "nav bar + dock", ma: "bottom of every page",
      before: [{ t: "note", text: "\"Ask Rose\" in the nav bar, plus a dock competing with the page." }],
      after: [{ t: "note", text: "One dock. Discreet at rest, full contrast in use." }],
    },
  },
  "ch-05": {
    brief: "Send the conversation with each booking request.",
    tension: "A transcript is more than a visitor agreed to share.",
    decision: "Booking opens the calendar and nothing else.",
    result: "Contact is an optional outcome, not the goal of every answer.",
    source: "privacy, memory and evaluation work, 24 Oct",
    note: "When you book, I send nothing, not even this conversation: his call.",
    vignette: {
      caption: "What a booking carries", b: "Planned", a: "Shipped", mb: "booking request", ma: "booking request",
      before: [{ t: "card", text: "conversation attached" }],
      after: [{ t: "card", text: "opens the calendar, nothing else" }],
    },
  },
};

/* §6.2 Chapter 00. Copy verbatim from docs/rose-case-study-copy-v2.md. */
export const IDEA = {
  p1: "A case study shows the work but cannot anticipate every question a reader brings. I built Rose to test another way in, a conversation next to the evidence.",
  p2: "The first version shipped on 21 July 2026. Its brief was narrower: help a visitor decide whether to book a conversation with me.",
  p3: {
    before: "The dock is modelled on ",
    anchor: { text: "userose.ai's website agent", href: "https://userose.ai" },
    middle: ", and the idea of an agent that comments on the page it lives on comes from ",
    second: { text: "co-existence.ai", href: "https://co-existence.ai" },
    after: ". I changed her goal. Rose explains, rephrases and puts the work in context; she does not sell.",
  },
  note: "He gave me a name before he gave me a job.",
};

const QUIET_LINK = "underline decoration-on-surface-variant/50 underline-offset-4 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";

const ExternalLink = ({ href, children }: { href: string; children: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={QUIET_LINK}>{children}<span className="sr-only"> (opens in a new tab)</span></a>
);

/* Uppercase mono is for the one kicker of a section. Every other label is sentence case. */
const LABEL = "font-label text-xs";
const KICKER = "font-label text-[10px] uppercase tracking-[0.18em] text-secondary";

const IdeaBody = ({ reduced }: { reduced: boolean }) => {
  const { p1, p2, p3, note } = IDEA;
  return (
    <div className="mt-8 space-y-5 font-body text-base text-on-surface">
      <p>{p1}</p>
      <p><span className="mr-2 font-label text-xs text-secondary"><span aria-hidden="true">● </span>Built</span>{p2}</p>
      <div className="relative">
        <p>
          {p3.before}
          <RoseMark cue="ch-00" reduced={reduced} skipWhenReduced tip><ExternalLink href={p3.anchor.href}>{p3.anchor.text}</ExternalLink></RoseMark>
          {p3.middle}
          <ExternalLink href={p3.second.href}>{p3.second.text}</ExternalLink>
          {p3.after}
        </p>
        <RoseCue id="ch-00" note={note} className="mt-3" />
      </div>
    </div>
  );
};

/* The dock surface: navy in Day, the real dock's surface and border in Night. */
const DOCK_PANEL = "border border-transparent bg-primary text-on-primary [[data-mood=dusk]_&]:border-outline-variant [[data-mood=dusk]_&]:bg-surface-container-high [[data-mood=dusk]_&]:text-on-surface";
const DOCK_OUTLINE = "border-on-primary/40 [[data-mood=dusk]_&]:border-outline-variant";
const DOCK_GOLD = "border-secondary-fixed-dim [[data-mood=dusk]_&]:border-secondary";

const VignetteItem = ({ item }: { item: VItem }) => {
  switch (item.t) {
    case "note": return <p className="font-body text-sm">{item.text}</p>;
    case "chips": return (
      <ul className="flex list-none flex-wrap gap-2 p-0">
        {item.chips.map((c) => <li key={c} className={cn("rounded-full border px-3 py-1 font-body text-xs", DOCK_OUTLINE)}>{c}</li>)}
      </ul>
    );
    case "card": return <p className={cn("rounded-lg border px-3 py-2 font-body text-xs", DOCK_GOLD)}><strong className="font-semibold">Book 30 minutes</strong> · {item.text}</p>;
    case "q": return <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-on-primary/10 px-4 py-2 font-body text-sm [[data-mood=dusk]_&]:bg-on-surface/10">{item.text}</p>;
    case "a": return <p className="font-body text-sm leading-relaxed">{item.text}</p>;
  }
};

/** Before / after dock mock-up. A two-state toggle: real buttons with aria-pressed, state announced politely. */
const MilestoneVignette = ({ v }: { v: Vignette }) => {
  const [after, setAfter] = useState(true);
  const label = after ? v.a : v.b;
  const meta = after ? v.ma : v.mb;
  const pill = (on: boolean) => cn(
    "rounded-full px-3 py-1 font-label text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary",
    on ? "bg-primary text-on-primary [[data-mood=dusk]_&]:bg-on-surface [[data-mood=dusk]_&]:text-surface" : "text-on-surface-variant hover:text-on-surface",
  );
  return (
    <figure className="mt-10 rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <figcaption className="font-label text-xs text-on-surface-variant">{v.caption}</figcaption>
        <div role="group" aria-label={`${v.caption}: choose a state`} className="flex rounded-full border border-outline-variant p-0.5">
          <button type="button" aria-pressed={!after} onClick={() => setAfter(false)} className={pill(!after)}>{v.b}</button>
          <button type="button" aria-pressed={after} onClick={() => setAfter(true)} className={pill(after)}>{v.a}</button>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">Showing {label}: {meta}</p>
      <div className={cn("mt-4 flex min-h-[9rem] max-w-md flex-col gap-3 rounded-2xl p-4", DOCK_PANEL)}>
        <p className="font-label text-[10px] opacity-80">{meta}</p>
        {(after ? v.after : v.before).map((it, i) => <VignetteItem key={`${label}-${i}`} item={it} />)}
      </div>
    </figure>
  );
};

const MilestoneBody = ({ id, m, reduced }: { id: string; m: Milestone; reduced: boolean }) => (
  <div className="mt-8">
    <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-12">
      <div><p className={cn(LABEL, "text-on-surface-variant")}>The brief</p><p className="mt-1 font-body text-base text-on-surface"><RoseMark kind="strike" cue={id} reduced={reduced} skipWhenReduced>{m.brief}</RoseMark></p></div>
      <div><p className={cn(LABEL, "text-on-surface-variant")}>The tension</p><p className="mt-1 font-body text-base text-on-surface">{m.tension}</p></div>
    </div>
    <div className="relative mt-8">
      <p className={cn(LABEL, "text-secondary")}>What I decided</p>
      <p id={`${id}-decision`} className="mt-1 scroll-mt-40 font-headline text-2xl leading-snug text-on-surface">
        <RoseMark cue={id} reduced={reduced} skipWhenReduced tip>{m.decision}</RoseMark>
      </p>
      <RoseCue id={id} note={m.note} className="mt-3" />
    </div>
    <p className="mt-4 font-body text-base text-on-surface">{m.result}</p>
    {m.tradeoff && (
      <div className="mt-6">
        <p className={cn(LABEL, "text-secondary")}>The trade-off</p>
        <p className="mt-1 font-body text-base text-on-surface">{m.tradeoff}</p>
      </div>
    )}
    <MilestoneVignette v={m.vignette} />
    <p className="mt-4 font-label text-xs text-on-surface-variant">Source: {m.source}</p>
  </div>
);

const RoseHero = memo(({ reduced }: { reduced: boolean }) => (
  <header aria-labelledby="rose-hero-h">
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
      <div>
        <p className={cn("flex flex-wrap items-center gap-3", KICKER)}>
          {HERO.label}
          <span className="rounded-full border border-outline-variant px-2 py-0.5 font-body text-xs normal-case tracking-normal text-on-surface">● {HERO.status}</span>
        </p>
        <h1 id="rose-hero-h" className="mt-5 font-headline text-5xl leading-[1.05] text-primary [[data-mood=dusk]_&]:text-on-surface md:text-7xl">
          {HERO.headline[0]}<em className="text-secondary">{HERO.headline[1]}</em>
        </h1>
        <p className="mt-6 max-w-xl font-body text-lg text-on-surface">{HERO_LEAD}</p>
      </div>
      <HeroDock reduced={reduced} />
    </div>
    <section aria-labelledby="rose-tldr" className="mt-14 border-t border-outline-variant pt-4">
      <h2 id="rose-tldr" className={cn(LABEL, "text-on-surface-variant")}>TL;DR</h2>
      <dl className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {TLDR.map(([t, d]) => (
          <div key={t} className="border-b border-outline-variant pb-4">
            <dt className={cn(LABEL, "text-secondary")}>{t}</dt>
            <dd className="mt-2 font-body text-sm text-on-surface">{d}</dd>
          </div>
        ))}
      </dl>
    </section>
  </header>
));

/* §6.5 Chapter 07. Copy verbatim from docs/rose-case-study-copy-v2.md. */
type TrustItem = { mark: "Built" | "Validation"; parts: string[] };
export const TRUST = {
  intro: "One contract covers data: what is kept and what is sent. The other covers knowledge: what Rose may assert or infer. I keep them apart so that a privacy promise is never read as proof of accuracy.",
  contracts: [
    {
      kicker: "Data",
      title: "What is kept and sent",
      items: [
        { mark: "Built", parts: ["Your conversation stays in this tab for 60 minutes, or until you reload the page."] },
        { mark: "Built", parts: ["Questions are stored, then purged after 90 days. Emails, phone numbers, addresses, card and bank numbers are masked before storage."] },
        { mark: "Built", parts: ["Booking opens the calendar and nothing else. No transcript travels with it."] },
      ] as TrustItem[],
      sourcesLead: "Retention and masking: ",
      sources: [
        { label: "mask-pii.ts", path: "supabase/functions/_shared/mask-pii.ts" },
        { label: "the purge migration", path: "drizzle/migrations/0004_rose_retention_cron.sql" },
      ],
    },
    {
      kicker: "Knowledge",
      title: "What Rose may assert or infer",
      items: [
        { mark: "Built", parts: ["Rose answers from the same Markdown pages the MCP server reads, with one or two links to them."] },
        { mark: "Built", parts: ["Rose keeps each project's delivery status: she never turns planned into done, or sandbox into production."] },
        // The middle part is the linked word: docs/rose-eval-2026-10-29.md.
        { mark: "Validation", parts: ["Released on 24 Oct after 15 synthetic cases. Since 29 Oct, each change is ", "tested", " with 5 samples per case and 20 per high-risk case."] },
      ] as TrustItem[],
    },
  ],
  rule: {
    heading: "A true answer can still be useless",
    intro: "She answers the decision first, states the limit of the evidence, and gives implementation detail only when asked.",
    question: "Is Aetherix in production?",
    // Printed inside quotation marks.
    answers: [
      { label: "Source-correct answer", text: "Aetherix is staged on Fly.io and connected to the Apaleo sandbox.", note: "It is true and cited, but the reader still has to work out what it means." },
      { label: "Useful answer", text: "No. It was built and evaluated on historical data, staged against a sandbox, and is ready for a 30-day pilot.", note: "It uses the same sources and answers the decision behind the question." },
    ],
    caption: "From Rose’s answer contract: “A verifiable fact unrelated to the question is still a poor answer.”",
  },
  evalDoc: "docs/rose-eval-2026-10-29.md",
};

const TrustMark = ({ mark }: { mark: TrustItem["mark"] }) => (
  <span className={cn("mr-2 font-label text-xs", LEGEND_TONE[mark])}>
    <span aria-hidden="true">{mark === "Built" ? "●" : "◐"}</span>
    <span className="sr-only">{mark}: </span>
  </span>
);

const TrustBody = () => {
  const t = TRUST;
  return (
    <div className="mt-8">
      <p className="max-w-2xl font-body text-base text-on-surface">{t.intro}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {t.contracts.map((c, ci) => (
          <section key={c.kicker} aria-labelledby={`trust-contract-${ci}`} className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
            <p className={cn(LABEL, "text-secondary")}>{c.kicker}</p>
            <h3 id={`trust-contract-${ci}`} className="mt-2 font-headline text-2xl leading-snug text-primary [[data-mood=dusk]_&]:text-on-surface">{c.title}</h3>
            <ul className="mt-4 list-none space-y-3 p-0 font-body text-base text-on-surface">
              {c.items.map((it) => (
                <li key={it.parts.join("")} className="flex">
                  <TrustMark mark={it.mark} />
                  <span>
                    {it.parts.length === 3
                      ? <>{it.parts[0]}<ExternalLink href={REPO_FILE(t.evalDoc)}>{it.parts[1]}</ExternalLink>{it.parts[2]}</>
                      : it.parts[0]}
                  </span>
                </li>
              ))}
            </ul>
            {"sources" in c && c.sources && (
              <p className="mt-auto pt-5 font-label text-xs text-on-surface-variant">
                {c.sourcesLead}
                {c.sources.map((s, i) => (
                  <span key={s.path}>{i > 0 && " and "}<ExternalLink href={REPO_FILE(s.path)}>{s.label}</ExternalLink></span>
                ))}
              </p>
            )}
          </section>
        ))}
      </div>

      <section aria-labelledby="trust-rule" className="mt-14">
        <h3 id="trust-rule" className="font-headline text-3xl leading-tight text-primary [[data-mood=dusk]_&]:text-on-surface md:text-4xl">
          {t.rule.heading}
        </h3>
        <p className="mt-4 max-w-2xl font-body text-base text-on-surface">{t.rule.intro}</p>
        <p className="mt-6 inline-block rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2 font-body text-sm text-on-surface">{t.rule.question}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {t.rule.answers.map((a, i) => (
            <figure key={a.label} className={cn("rounded-xl border p-5", i === 0 ? "border-dashed border-outline-variant" : "border-secondary bg-surface-container-lowest")}>
              <figcaption className={cn(LABEL, i === 0 ? "text-on-surface-variant" : "text-secondary")}>{a.label}</figcaption>
              <blockquote className="mt-2 font-body text-base text-on-surface">“{a.text}”</blockquote>
              <p className="mt-3 font-label text-xs text-on-surface-variant">{a.note}</p>
            </figure>
          ))}
        </div>
        <p className="mt-3 font-label text-xs text-on-surface-variant">{t.rule.caption}</p>
      </section>
    </div>
  );
};

/* §6.6 Chapter 08. Copy verbatim from docs/rose-case-study-copy-v2.md. */
export const REPO_URL = "https://github.com/IvandeMurard/ivandemurard-portfolio";
export const REPO_FILE = (path: string) => `${REPO_URL}/blob/main/${path}`;

export const GOT_WRONG = {
  intro: "Many of Rose's rules started as a mistake caught in testing, before any visitor saw it. Here are three, from synthetic test runs in October.",
  labels: ["She said", "What I changed", "Result"],
  cases: [
    {
      meta: "24 Oct · release gate, 15 cases",
      said: "Named a Sonor team member who does not exist.",
      changed: "She may name only Ivan and names written in the sources.",
      result: ["No invented names in the final run."],
    },
    {
      meta: "25 to 29 Oct · self-knowledge tests",
      said: "Asked about herself, she answered with Aetherix figures.",
      changed: "She loads only what the question needs.",
      // The middle part is the linked figure: docs/rose-eval-2026-10-29.md.
      result: ["The 29 Oct rerun passed ", "9 of 10", "."],
    },
    {
      meta: "26 to 29 Oct · self-knowledge tests",
      said: "Invented precise error rates for Aetherix.",
      changed: "Two checked answers for high-precision questions; every other figure carries its model, metric and scope.",
      // The middle part is the linked figure: docs/rose-eval-2026-10-29.md.
      result: ["On 29 Oct, ", "15 open-ended answers", " kept every figure with its model and scope."],
    },
  ],
  note: "Asked about myself on my own page, I talked about Aetherix, so he gave me less to read.",
  cost: {
    figure: "0.015 Lovable credits",
    text: "Loading only what the question needs also made answers cheaper: a typical answer costs about 0.015 Lovable credits, less than half the cost of one that loads a full Field Note. Nearly all of the cost comes from what Rose reads.",
    sourceLead: "Source: ",
    source: "Lovable AI gateway logs, the 20 most recent calls, 2 Nov 2026; costs stated in credits, because the Lite plan's price per credit is not published.",
  },
  judgedLabel: "How a case is judged",
  loop: ["Write cases before the run", "Run 5 or 20 samples", "Automatic checks: tests, unsourced figures", "Grade every answer against the sources", "Pass? If not, back to 2", "Deploy with my approval", "Live check on the site"],
  loopCaption: "A failed grade goes back to step 2 with one bounded change. A new failure in the live check becomes a new case.",
  judged: "Each synthetic question is written before the run, with the behaviour it requires and the failure that would block release. Answers are graded with AI assistance against the published sources, then reviewed by me.",
  campaign: "29 Oct campaign · 105 answers · 10 cases · 2 high-risk cases, 0 critical failures in 20 samples each",
  campaignLink: "Read the full evaluation",
  dimensions: ["Accuracy", "Context", "Directness", "Evidence", "Visitor value", "Judgment", "Booking discipline", "Trust and privacy"],
  rules: [
    ["Verdict", "Pass, fail or unclear, with the quoted answer as evidence."],
    ["Critical", "An invented fact or a privacy slip fails the case. It is never averaged away."],
    ["Limit", "Ordinary cases: 5 samples, pass at 4. High-risk cases: 20 samples, no critical failure allowed. Usage logs are not proof of correctness."],
  ],
  sourcesLead: "Sources: ",
  sourcesTail: ", in the site repository.",
  // Label as printed, and the file it links to on main.
  sources: [
    { label: "docs/rose-p4-evaluation.md", path: "docs/rose-p4-evaluation.md" },
    { label: "rose-p5-verification.md", path: "docs/rose-p5-verification.md" },
    { label: "rose-stage-b-remediation.md", path: "docs/rose-stage-b-remediation.md" },
    { label: "rose-eval-2026-10-29.md", path: "docs/rose-eval-2026-10-29.md" },
    { label: "supabase/functions/_shared/rose-curated-answers.ts", path: "supabase/functions/_shared/rose-curated-answers.ts" },
  ],
  evalDoc: "docs/rose-eval-2026-10-29.md",
};

const ValidationBody = ({ reduced }: { reduced: boolean }) => {
  const g = GOT_WRONG;
  return (
    <div className="mt-8">
      <p className="max-w-xl font-body text-base text-on-surface">{g.intro}</p>

      <div role="region" aria-label="Three cases caught in testing" tabIndex={0} className="mt-8 overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
        <table className="w-full min-w-[40rem] border-collapse text-left font-body text-base text-on-surface">
          <thead>
            <tr>
              {g.labels.map((l, i) => (
                <th key={l} scope="col" className={cn("w-1/3 border-b border-on-surface-variant/60 pb-3 pr-8 font-label text-xs font-normal", i === 1 ? "text-secondary" : "text-on-surface-variant")}>{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {g.cases.map((c, i) => (
              <tr key={c.meta} className="align-top">
                <td className="border-b border-outline-variant py-5 pr-8">
                  <span className="block font-label text-xs text-on-surface-variant">{c.meta}</span>
                  <span className="mt-1 block">{c.said}</span>
                </td>
                <td className="border-b border-outline-variant py-5 pr-8">{c.changed}</td>
                <td className="border-b border-outline-variant py-5">
                  {c.result.length === 3
                    ? <>{c.result[0]}<ExternalLink href={REPO_FILE(g.evalDoc)}>{c.result[1]}</ExternalLink>{c.result[2]}</>
                    : c.result[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 max-w-2xl">
        <p className="font-body text-base text-on-surface">
          {g.cost.text.split(g.cost.figure)[0]}
          <RoseMark kind="circle" cue="ch-08" reduced={reduced} skipWhenReduced tip>{g.cost.figure}</RoseMark>
          {g.cost.text.split(g.cost.figure)[1]}
        </p>
        <p className="mt-2 font-label text-xs text-on-surface-variant">{g.cost.sourceLead}{g.cost.source}</p>
        <RoseCue id="ch-08" note={g.note} className="mt-4" />
      </div>

      <div className="mt-12 border-t border-on-surface-variant/60 pt-8">
        <h3 className="font-headline text-3xl leading-tight text-primary [[data-mood=dusk]_&]:text-on-surface md:text-4xl">{g.judgedLabel}</h3>
        <p className="mt-3 max-w-2xl font-body text-base text-on-surface">{g.judged}</p>
        <TestLoop steps={g.loop} caption={g.loopCaption} />
        <p className="mt-6 max-w-2xl font-body text-base text-on-surface">Eight dimensions: {g.dimensions.map((d) => d.toLowerCase()).join(", ")}.</p>
        <dl className="mt-4 max-w-2xl space-y-3 font-body text-base text-on-surface">
          {g.rules.map(([t, d]) => (
            <div key={t}><dt className={cn(LABEL, "inline text-on-surface-variant")}>{t}</dt><dd className="inline"> · {d}</dd></div>
          ))}
        </dl>
        <p className="mt-6 font-label text-xs text-on-surface-variant">{g.campaign}</p>
        <p className="mt-1 font-body text-sm text-on-surface"><ExternalLink href={REPO_FILE(g.evalDoc)}>{g.campaignLink}</ExternalLink></p>
      </div>

      <p className="mt-6 font-label text-xs text-on-surface-variant">
        {g.sourcesLead}
        {g.sources.map((s, i) => (
          <span key={s.path}>{i > 0 && ", "}<ExternalLink href={REPO_FILE(s.path)}>{s.label}</ExternalLink></span>
        ))}
        {g.sourcesTail}
      </p>
    </div>
  );
};

/* §6.4 Chapter 06. The demo and the passage questions are in RoseDemos.tsx. The "How Rose works" loop (HowRoseWorks.tsx) follows the demo; the relations map comes in a later branch. */
export const SIX = {
  intro: "Rose knows the page, the section in view and the passages I marked. She answers in the dock, in the format the question needs: a passage to jump to, plainer words, a link to other work or a diagram.",
  influence: "The passage questions extend co-existence.ai's idea of an agent that comments on the page it lives on.",
};

const SixBody = ({ reduced }: { reduced: boolean }) => (
  <div className="mt-8">
    <div className="space-y-4 font-body text-base text-on-surface">
      <p>{SIX.intro}</p>
      <p>{SIX.influence}</p>
    </div>
    <AnswerFormats reduced={reduced} />
    <HowRoseWorks />
  </div>
);

/* §6.7 Chapter 09. Copy verbatim from docs/rose-case-study-copy-v2.md. */
export const NEXT = {
  intro: "The direction is a contextual assistant for the whole site. Rose would locate passages, rephrase them and show how pages relate, while keeping the original sources and their limits. Today she answers in text only.",
  items: [
    ["An automatic map of the whole site.", "Today I write the map by hand, and it grows only when I can state the reason for each link."],
    ["Diagrams for the complex parts.", "A visual rewording of a dense passage, drawn from a fixed set of diagrams I checked."],
    ["Answers read aloud.", "A spoken version of a written answer, for readers who prefer to listen; the written answer stays the reference."],
    ["Context for any passage.", "Relating what you read to the rest of the page and the site, beyond the passages I marked."],
  ],
  transfers: "The same pattern fits any site where readers bring their own questions to dense pages, such as product documentation, onboarding guides and B2B offer pages.",
};

const NextBody = () => (
  <div className="mt-8">
    <p className="max-w-2xl font-body text-base text-on-surface">{NEXT.intro}</p>
    <ol className="mt-8 max-w-2xl list-none space-y-5 p-0 font-body text-base text-on-surface">
      {NEXT.items.map(([title, text]) => (
        <li key={title}><span className="font-semibold">{title}</span> {text}</li>
      ))}
    </ol>
    <p className="mt-8 max-w-2xl font-body text-base text-on-surface">{NEXT.transfers}</p>
  </div>
);

/* §6.8 Chapter 10. The four questions are Ivan's validated text (docs/rose-case-study.md §6.8), with the v2 changes of docs/rose-case-study-copy-v2.md. */
export const QUESTIONS = [
  {
    n: "01", title: "Value",
    question: "Does a source-faithful answer help each reader understand the work from their own angle?",
    hypothesis: "One page every reader can question beats separate versions per audience, which failed in my previous portfolio.",
    signal: "The same question asked twice in one session, and what readers write in an optional feedback form.",
    decision: "If it holds, Rose gets more context and scope. If not, I narrow her to navigation.",
    cost: "Rose adds noise to the content she was built to serve, and costs me credibility.",
  },
  {
    n: "02", title: "Measure",
    question: "What should count as Rose helping, if booking is an outcome rather than the goal?",
    hypothesis: "Booking stays possible, but value comes first: Rose helps when readers use her and go to the sources.",
    signal: "Share of visits that open Rose, then answers whose source link is followed, page by page.",
    decision: "If few readers open her, I rethink how the dock invites a first question before adding any capability.",
    cost: "The numbers would flatter Rose and hide how narrow her real use is.",
  },
  {
    n: "03", title: "Role",
    question: "Should Rose remain an index of the site, or become a critical discussion partner?",
    hypothesis: "Rose is more useful when she connects content and questions my choices, never the reader's, from trade-offs I documented.",
    signal: "Whether questions ask \"where\" or \"why\", and whether answers link beyond the current page.",
    decision: "If it holds, she questions my choices from documented limits. If not, she returns to a stricter index.",
    cost: "An invented critique costs more credibility than no critique at all.",
  },
  {
    n: "04", title: "Modality",
    question: "When would voice reduce navigation work rather than add spectacle?",
    hypothesis: "Voice helps on long pages: a spoken summary while Rose shows the passage she is talking about.",
    signal: "Requests to summarise in the logs, then use of a simple Listen button before any custom voice.",
    decision: "If Listen gets used, I invest in a voice matching the site. If not, voice leaves the roadmap.",
    cost: "I would maintain a feature that nobody uses.",
  },
];

export const replyHref = (n: string) => `${SOCIAL_LINKS.email}?subject=${encodeURIComponent(`Open question ${n}`)}`;

const QuestionsBody = () => (
  <ol className="mt-10 list-none space-y-12 p-0">
    {QUESTIONS.map((q) => (
      <li key={q.n} className="border-t border-outline-variant pt-6">
        <p className={cn(LABEL, "text-secondary")}>{q.n} · {q.title}</p>
        <h3 className="mt-2 font-headline text-2xl leading-snug text-primary [[data-mood=dusk]_&]:text-on-surface">{q.question}</h3>
        <dl className="mt-5 space-y-3 font-body text-base text-on-surface">
          {([["Hypothesis", q.hypothesis], ["Signal", q.signal], ["Decision", q.decision], ["Cost of being wrong", q.cost]] as const).map(([t, d]) => (
            <div key={t}><dt className={cn(LABEL, "text-on-surface-variant")}>{t}</dt><dd className="mt-0.5">{d}</dd></div>
          ))}
        </dl>
        <p className="mt-5 font-body text-base">
          <a href={replyHref(q.n)} className={QUIET_LINK}>Reply by email<span className="sr-only"> about open question {q.n}</span></a>
        </p>
      </li>
    ))}
  </ol>
);

/* §6.9 Close. Copy verbatim from docs/rose-case-study-copy-v2.md. The Contact block is shared (src/components/case/ContactBlock.tsx). */
export const CLOSE = {
  askLabel: "Ask Rose",
  askQuestion: "What has Ivan actually built?",
  line: "Start with the evidence. A human conversation is available when it adds context Rose cannot.",
};

const CLOSE_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";

/* The Ask Rose block and the Contact block share the section-inverse background, so Day and Night have no seam. */
const RoseClose = () => (
  <>
    {/* The gradient fades from the page into the section-inverse colour, which this band supplies underneath. */}
    <div aria-hidden="true" className="section-inverse relative h-32 md:h-40">
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, hsl(var(--rose-cool)), hsl(var(--rose-cool) / 0))" }} />
    </div>
    <section aria-label={CLOSE.askLabel} className="section-inverse px-8 pb-10 pt-4 text-center md:px-12">
      <p className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
        <span className="border-b border-primary/30 pb-0.5 font-label text-[11px] uppercase tracking-[0.12em] text-secondary">{CLOSE.askLabel}</span>
        <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("rose:ask", { detail: { text: CLOSE.askQuestion } }))}
          className={cn("font-headline text-xl text-primary underline underline-offset-4 hover:opacity-80", CLOSE_RING)}>{CLOSE.askQuestion}</button>
      </p>
      <p className="mt-6 font-body text-[15px] text-on-surface-variant">{CLOSE.line}</p>
    </section>
    <ContactBlock />
  </>
);

/** Runs `work` at most once per frame on scroll and resize. */
const useFrameScroll = (work: () => void) => {
  useEffect(() => {
    let raf = 0;
    const on = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; work(); }); };
    work();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [work]);
};

/** Copper reading thread, left margin. Owns its scroll state so the page does not re-render with it. */
const ReadingThread = ({ rootRef, reduced }: { rootRef: RefObject<HTMLElement>; reduced: boolean }) => {
  const [progress, setProgress] = useState(0);
  const measure = useCallback(() => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return;
    const total = r.height - window.innerHeight;
    setProgress(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1);
  }, [rootRef]);
  useFrameScroll(measure);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-0 left-2 top-0 z-20 w-px bg-outline-variant md:left-4">
      <div className="h-full w-px origin-top bg-rose-copper" style={{ transform: `scaleY(${progress})`, transition: reduced ? "none" : "transform 120ms linear" }} />
    </div>
  );
};

/** Chapter bodies never depend on scroll state, so they are memoised against the active-chapter updates. */
const Chapters = memo(({ reduced }: { reduced: boolean }) => (
  <>
    {ROSE_CHAPTERS.map((c, i) => {
      const mark = CHAPTER_MARK[c.id];
      return (
        <Fragment key={c.id}>
          {c.id === "ch-01" && <p className="max-w-2xl pt-20 font-body text-base text-on-surface md:pt-24 xl:max-w-[40rem]">{NOTES_INTRO}</p>}
          <section id={c.id} data-ch={i} aria-labelledby={`${c.id}-h`} className={cn("scroll-mt-32 pt-24 md:pt-32", MILESTONES[c.id] || c.id === "ch-00" ? "max-w-2xl xl:max-w-[40rem]" : c.id === "ch-07" || c.id === "ch-08" ? "max-w-none" : "max-w-3xl")}>
            <p className={KICKER}>{c.kicker}{mark && <span className="ml-3"><span aria-hidden="true">{MARK_GLYPH[mark]} </span>{mark}</span>}</p>
            <h2 id={`${c.id}-h`} className="mt-3 font-headline text-4xl leading-tight text-primary [[data-mood=dusk]_&]:text-on-surface md:text-5xl">{c.heading}</h2>
            {c.id === "ch-00" && <IdeaBody reduced={reduced} />}
            {MILESTONES[c.id] && <MilestoneBody id={c.id} m={MILESTONES[c.id]} reduced={reduced} />}
            {c.id === "ch-06" && <SixBody reduced={reduced} />}
            {c.id === "ch-07" && <TrustBody />}
            {c.id === "ch-08" && <ValidationBody reduced={reduced} />}
            {c.id === "ch-09" && <NextBody />}
            {c.id === "ch-10" && <QuestionsBody />}
          </section>
        </Fragment>
      );
    })}
  </>
));

export const RoseCaseStudy = ({ reduced }: { reduced: boolean }) => {
  const [active, setActive] = useState(-1);
  // The chapter list is this page's rail: its active chapter is what a source link calls "where the reader is".
  const activeRef = useRef(-1);
  activeRef.current = active;
  useEffect(() => registerRail(() => { const c = ROSE_CHAPTERS[activeRef.current]; return c ? { id: c.id, label: c.toc } : null; }), []);
  const root = useRef<HTMLDivElement>(null);
  const details = useRef<HTMLDetailsElement>(null);

  // Active chapter: the last one whose top crossed 40% of the viewport; none before chapter 00.
  const measureActive = useCallback(() => {
    let next = -1;
    root.current?.querySelectorAll<HTMLElement>("[data-ch]").forEach((c) => { if (c.getBoundingClientRect().top <= window.innerHeight * 0.4) next = Number(c.dataset.ch); });
    setActive(next);
  }, []);
  useFrameScroll(measureActive);

  const current = ROSE_CHAPTERS[active];
  const needleTurn = Math.max(0, active) * (300 / (ROSE_CHAPTERS.length - 1));
  const toc = (onPick?: () => void) => (
    <ol className="list-none space-y-1 p-0">
      {ROSE_CHAPTERS.map((c, i) => (
        <li key={c.id}>
          <a href={`#${c.id}`} onClick={onPick} aria-current={i === active ? "location" : undefined}
            className={cn("block border-l-2 py-1 pl-3 font-label text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary",
              i === active ? "border-secondary text-primary" : "border-transparent text-on-surface-variant hover:text-primary")}>
            {c.toc}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div ref={root} className="rose-case-bg relative">
      <ReadingThread rootRef={root} reduced={reduced} />

      {/* Mobile: one-line sticky bar. */}
      <details ref={details} className="sticky top-[76px] z-30 border-b border-outline-variant bg-surface/95 px-6 py-3 backdrop-blur-sm lg:hidden">
        <summary className="cursor-pointer list-none font-label text-xs text-primary [&::-webkit-details-marker]:hidden">
          {current ? `${current.toc} · ` : ""}On this page <span aria-hidden="true">▾</span>
        </summary>
        <nav aria-label="On this page" className="mt-3">{toc(() => details.current?.removeAttribute("open"))}</nav>
      </details>

      <div className="mx-auto max-w-7xl px-8 pt-16 md:px-12">
        <RoseHero reduced={reduced} />
        <section aria-labelledby="rose-legend" className="mt-16 max-w-3xl">
          <h2 id="rose-legend" className={cn(LABEL, "text-on-surface-variant")}>How to read this case study</h2>
          <dl className="mt-3 space-y-1 font-body text-sm text-on-surface">
            {LEGEND.map(([mark, term, def]) => (
              <div key={term} className="flex gap-2"><dt className={cn("w-28 shrink-0 font-label text-xs", LEGEND_TONE[term])}><span aria-hidden="true">{mark} </span>{term}</dt><dd>{def}</dd></div>
            ))}
          </dl>
          <p className="mt-3 font-body text-xs text-on-surface-variant">{LEGEND_NOTE.before}<ExternalLink href={REPO_URL}>{LEGEND_NOTE.link}</ExternalLink>{LEGEND_NOTE.after}</p>
        </section>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-8 pb-16 md:px-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="hidden self-start lg:sticky lg:top-28 lg:block">
          <CompassRose heading={needleTurn} reduced={reduced} className="h-16 w-16 text-secondary" />
          <p className={cn("mt-4", LABEL, "text-on-surface-variant")}>On this page</p>
          <nav aria-label="On this page" className="mt-3">{toc()}</nav>
        </aside>

        <div className="min-w-0">
          <Chapters reduced={reduced} />
        </div>
      </div>

      <RoseClose />
    </div>
  );
};
