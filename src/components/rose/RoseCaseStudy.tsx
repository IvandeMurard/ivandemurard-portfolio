import { memo, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { CompassRose } from "@/components/rose/CompassRose";
import { RoseCue, RoseMark } from "@/components/rose/RoseKinetic";
import { SOCIAL_LINKS } from "@/content/site";

/**
 * Rose case study, single page (docs/rose-case-study.md §6). Only §6.0
 * Page-wide is built here: continuous background, copper reading thread,
 * table of contents, honesty legend and chapter transitions. Chapter bodies
 * are slots (kicker + heading + transition) until their own section is built.
 * All copy is verbatim from docs/rose-case-study-copy.md.
 */

type Chapter = { id: string; toc: string; kicker: string; heading: string; transition?: string };

export const ROSE_CHAPTERS: Chapter[] = [
  { id: "ch-00", toc: "00 The idea", kicker: "00 · The idea", heading: "What if the portfolio could answer back?", transition: "So the first version did one thing: qualify." },
  { id: "ch-01", toc: "01 Qualify", kicker: "01 · 21 Jul 2026", heading: "Qualify", transition: "One destination, and the same four boxes whatever page you were on. That was the next problem." },
  { id: "ch-02", toc: "02 Listen to the page", kicker: "02 · 7 Aug 2026", heading: "Listen to the page", transition: "The questions now started from the page. The answers did not, yet." },
  { id: "ch-03", toc: "03 Know where you are", kicker: "03 · 10 Aug 2026", heading: "Know where you are", transition: "Rose knew where you were. Where she should live was the next question." },
  { id: "ch-04", toc: "04 One quiet dock", kicker: "04 · 14 Oct 2026", heading: "One quiet dock", transition: "Quiet until asked. Then: what happens to what you tell her?" },
  { id: "ch-05", toc: "05 Earn trust", kicker: "05 · 24 Oct 2026", heading: "Earn trust", transition: "Five decisions later, here is what she does today." },
  { id: "ch-06", toc: "06 What Rose can do now", kicker: "06 · What Rose can do now", heading: "Ask about what you're reading.", transition: "What she does is narrow on purpose. What she may keep, and say, is narrower still." },
  { id: "ch-07", toc: "07 Trust", kicker: "07 · Trust", heading: "Trust has two separate contracts.", transition: "Contracts are only as good as the checks behind them." },
  { id: "ch-08", toc: "08 What she got wrong", kicker: "08 · What she got wrong", heading: "What she got wrong, and how I check her.", transition: "The checks cover what she does today. Here is what comes next, and why it waits." },
  { id: "ch-09", toc: "09 Next steps", kicker: "09 · Next steps", heading: "Make the whole site easier to navigate, not just one reply.", transition: "Some things I have not settled. I would rather say so." },
  { id: "ch-10", toc: "10 Open questions", kicker: "10 · Open questions", heading: "Questions I am leaving open, rather than calling them features." },
];

const LEGEND_TONE: Record<string, string> = { Built: "text-secondary", Validation: "text-primary", Design: "text-on-surface-variant" };

const LEGEND = [
  ["●", "Built", "Implemented behaviour that can be inspected in the product or repository."],
  ["◐", "Validation", "A bounded test, audit or measurement. It does not prove every visitor outcome."],
  ["○", "Design", "A proposed direction or prototype, not a deployed behaviour."],
] as const;

/* §6.1 Hero. Copy verbatim from docs/rose-case-study-copy.md. */
const HERO_Q = "Why was Rose first built around booking?";
const HERO_A = "Ivan's first brief was narrow: help you decide, in two or three exchanges, whether to book 30 minutes with him. He changed it in August.";
const TLDR = [
  ["The problem", "A case study shows the work. It cannot answer the question a visitor brings."],
  ["Five decisions", "July to October 2026: qualify, listen to the page, know where you are, one quiet dock, earn trust."],
  ["Today", "Live, text only. Rose knows the page and section in view, answers from the site’s own text, and sends nothing when you book."],
  ["Still open", "Whether a source-faithful answer helps each reader understand the work from their own angle."],
] as const;

/* §6.3 Chapters 01 to 05. Copy and vignette data verbatim from docs/rose-case-study-copy.md. */
type VItem =
  | { t: "note"; text: string }
  | { t: "chips"; chips: string[] }
  | { t: "card"; text: string }
  | { t: "q"; text: string }
  | { t: "a"; text: string };
type Vignette = { caption: string; b: string; a: string; mb: string; ma: string; before: VItem[]; after: VItem[] };
type Milestone = { brief: string; tension: string; decision: string; result: string; source: string; note: string; vignette: Vignette };

const FOUR_INTENTS = ["Product expertise", "Technical profile", "Culture fit", "Just exploring"];

export const MILESTONES: Record<string, Milestone> = {
  "ch-01": {
    brief: "Help the visitor decide, in two or three exchanges, whether to book 30 minutes with me.",
    tension: "Four intent chips asked visitors who they were before showing them anything.",
    decision: "Ship a small dock with four intents and a booking card.",
    result: "A qualification funnel with one destination.",
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
    decision: "Replace fixed intents with three questions written for each page, and keep Book a call as a constant exit.",
    result: "Questions start from the work, not from the visitor’s profile.",
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
    tension: "A page-specific question deserves a page-specific answer.",
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
    decision: "Unify the dock: discreet at rest, full contrast in use, questions by page.",
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

/* §6.2 Chapter 00. Copy verbatim from docs/rose-case-study-copy.md. */
export const IDEA = {
  p1: "A case study shows the work. It cannot anticipate every question someone brings to it. I built Rose to explore another way in: a conversation alongside the evidence.",
  p2: "The first version shipped on 21 July 2026. Its brief was narrower than that possibility: help a visitor decide whether to book a conversation with me.",
  p3: {
    before: "The dock is modelled on ",
    anchor: { text: "userose.ai's website agent", href: "https://userose.ai" },
    middle: "; the idea of an agent commenting the page it lives on came from ",
    second: { text: "co-existence.ai", href: "https://co-existence.ai" },
    after: ". What I changed: her goal. Not selling. Explaining, reformulating, contextualising.",
  },
  note: "He gave me a name before he gave me a job.",
};

const QUIET_LINK = "underline decoration-on-surface-variant/50 underline-offset-4 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";

const ExternalLink = ({ href, children }: { href: string; children: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={QUIET_LINK}>{children}<span className="sr-only"> (opens in a new tab)</span></a>
);

const IdeaBody = ({ reduced }: { reduced: boolean }) => {
  const { p1, p2, p3, note } = IDEA;
  return (
    <div className="mt-8 space-y-5 font-body text-base text-on-surface">
      <p>{p1}</p>
      <p><span className="mr-2 font-label text-[10px] uppercase tracking-[0.18em] text-secondary"><span aria-hidden="true">● </span>Built</span>{p2}</p>
      <div className="relative">
        <p>
          {p3.before}
          <RoseMark cue="ch-00" reduced={reduced}><ExternalLink href={p3.anchor.href}>{p3.anchor.text}</ExternalLink></RoseMark>
          {p3.middle}
          <ExternalLink href={p3.second.href}>{p3.second.text}</ExternalLink>
          {p3.after}
        </p>
        {/* Margin note on wide screens, inline under the passage elsewhere. */}
        <RoseCue id="ch-00" note={note} className="mt-3 xl:absolute xl:left-full xl:top-0 xl:ml-4 xl:mt-0 xl:w-64" />
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
    case "note": return <p className="font-body text-sm italic">{item.text}</p>;
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

const MilestoneBody = ({ id, m, reduced }: { id: string; m: Milestone; reduced: boolean }) => {
  const label = "font-label text-[10px] uppercase tracking-[0.18em]";
  return (
    <div className="mt-8">
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-12">
        <div><p className={cn(label, "text-on-surface-variant")}>The brief</p><p className="mt-1 font-body text-base text-on-surface">{m.brief}</p></div>
        <div><p className={cn(label, "text-on-surface-variant")}>The tension</p><p className="mt-1 font-body text-base text-on-surface">{m.tension}</p></div>
      </div>
      <div className="relative mt-8">
        <p className={cn(label, "text-secondary")}>What I decided</p>
        <p id={`${id}-decision`} className="mt-1 scroll-mt-40 font-headline text-2xl leading-snug text-on-surface">
          <RoseMark cue={id} reduced={reduced}>{m.decision}</RoseMark>
        </p>
        {/* Margin note on wide screens, inline under the passage elsewhere. */}
        <RoseCue id={id} note={m.note} className="mt-3 xl:absolute xl:left-full xl:top-5 xl:ml-4 xl:mt-0 xl:w-64" />
      </div>
      <p className="mt-4 font-body text-base text-on-surface">{m.result}</p>
      <MilestoneVignette v={m.vignette} />
      <p className="mt-4 font-label text-xs text-on-surface-variant">Source: {m.source}</p>
    </div>
  );
};

/** Scripted replay styled as the dock: question, reading status, answer, Locate, source. */
const HeroDock = ({ reduced }: { reduced: boolean }) => {
  const [step, setStep] = useState(reduced ? 3 : 0);
  useEffect(() => {
    if (reduced) { setStep(3); return; }
    const ts = [400, 1600, 3000].map((d, i) => window.setTimeout(() => setStep(i + 1), d));
    return () => ts.forEach(window.clearTimeout);
  }, [reduced]);
  const locate = () => {
    // Centre the decision in the reading zone so Rose's gesture plays on arrival.
    document.getElementById("ch-01-decision")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  };
  const fade = (on: boolean) => ({ opacity: on ? 1 : 0, transition: reduced ? "none" : "opacity 500ms ease" });
  return (
    <div data-rose-hero aria-label="Rose, one example exchange" className={cn("flex min-h-[20rem] flex-col rounded-2xl p-5 shadow-xl shadow-primary/10", DOCK_PANEL)}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-headline text-base italic"><CompassRose heading={0} reduced className="h-5 w-5" />Rose</span>
        <span className="font-label text-[10px] opacity-80">reading: /rose · hero</span>
      </div>
      <div className="mt-6 flex flex-1 flex-col gap-3" aria-live="polite">
        <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-on-primary/10 [[data-mood=dusk]_&]:bg-on-surface/10 px-4 py-2 font-body text-sm" style={fade(step >= 1)}>{HERO_Q}</p>
        {step === 2 && <p className="font-label text-xs opacity-80">Rose is reading the page…</p>}
        {step >= 3 && (
          <div style={fade(true)}>
            <p className="font-body text-sm leading-relaxed">{HERO_A}</p>
            <button type="button" onClick={locate} className="mt-3 rounded-md border border-secondary-fixed-dim [[data-mood=dusk]_&]:border-secondary px-3 py-1 font-label text-xs hover:bg-on-primary/10 [[data-mood=dusk]_&]:hover:bg-on-surface/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary [[data-mood=dusk]_&]:focus-visible:outline-secondary">Locate · where he changed it ↓</button>
            <p className="mt-2 font-label text-[10px] opacity-80">Source: original prompt, commit 51245fc</p>
          </div>
        )}
      </div>
      <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("rose:open"))}
        className="mt-4 rounded-lg border border-on-primary/30 [[data-mood=dusk]_&]:border-outline-variant px-3 py-2 text-left font-body text-xs opacity-90 hover:border-on-primary/60 [[data-mood=dusk]_&]:hover:border-on-surface/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-on-primary [[data-mood=dusk]_&]:focus-visible:outline-secondary">Ask Rose anything</button>
    </div>
  );
};

const RoseHero = memo(({ reduced }: { reduced: boolean }) => (
  <header aria-labelledby="rose-hero-h">
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
      <div>
        <p className="flex flex-wrap items-center gap-3 font-label text-[10px] uppercase tracking-[0.18em] text-secondary">
          Case study · AI service design · Rose
          <span className="rounded-full border border-outline-variant px-2 py-0.5 text-on-surface">● Live · text only</span>
        </p>
        <h1 id="rose-hero-h" className="mt-5 font-headline text-5xl leading-[1.05] text-primary [[data-mood=dusk]_&]:text-on-surface md:text-7xl">
          A portfolio <em className="text-secondary">you can question.</em>
        </h1>
        <p className="mt-6 max-w-xl font-body text-lg text-on-surface">The story behind Rose: why I built her, the five decisions that reshaped her, and the questions I am leaving open.</p>
        <p className="mt-4 font-label text-xs text-on-surface-variant">July to October 2026 · five decisions · sources from the repository</p>
      </div>
      <HeroDock reduced={reduced} />
    </div>
    <section aria-labelledby="rose-tldr" className="mt-14 border-t border-outline-variant pt-4">
      <h2 id="rose-tldr" className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">TL;DR</h2>
      <dl className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {TLDR.map(([t, d]) => (
          <div key={t} className="border-b border-outline-variant pb-4">
            <dt className="font-label text-[10px] uppercase tracking-[0.16em] text-secondary">{t}</dt>
            <dd className="mt-2 font-body text-sm text-on-surface">{d}</dd>
          </div>
        ))}
      </dl>
    </section>
  </header>
));

/* §6.9 Close. Copy verbatim from docs/rose-case-study-copy.md. Destinations come from SOCIAL_LINKS. */
export const CLOSE = {
  askLabel: "Ask Rose",
  askQuestion: "What has Ivan actually built?",
  line: "Start with the evidence. A human conversation is available when it adds context Rose cannot.",
  kicker: "Contact",
  headingLead: "Hiring for AI product? ",
  headingEm: "I design the whole loop: the people on the ground, the software, and the outcome it's judged on.",
  subline: "Operations, product, business and tech, in one service. I ship, I evaluate, and I say what isn't proven yet. I am looking for an AI Product Manager or Product Builder role.",
  buttons: ["Book 30 minutes", "Email", "CV"],
};

// Navy in Day; in Night the navy is the inverse of the light-blue primary.
const NAVY = "bg-primary text-on-primary [[data-mood=dusk]_&]:bg-inverse-primary [[data-mood=dusk]_&]:text-on-surface";
const CLOSE_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed-dim";

const RoseClose = () => {
  const [book, email, cv] = CLOSE.buttons;
  const ghost = cn("rounded-full border border-on-primary/60 px-5 py-2.5 font-body text-sm hover:bg-on-primary/10 [[data-mood=dusk]_&]:border-on-surface/60 [[data-mood=dusk]_&]:hover:bg-on-surface/10", CLOSE_RING);
  return (
    <>
      {/* The gradient is its own band, so every word of the ask block sits on solid navy. */}
      <div aria-hidden="true" className="h-32 bg-gradient-to-b from-[hsl(var(--rose-cool))] to-primary [[data-mood=dusk]_&]:to-inverse-primary md:h-40" />
      <section aria-label={CLOSE.askLabel} className={cn("px-8 pb-10 pt-4 text-center md:px-12", NAVY)}>
        <p className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
          <span className="border-b border-on-primary/30 pb-0.5 font-label text-[11px] uppercase tracking-[0.12em] text-primary-fixed-dim [[data-mood=dusk]_&]:border-on-surface/30 [[data-mood=dusk]_&]:text-primary">{CLOSE.askLabel}</span>
          <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("rose:ask", { detail: { text: CLOSE.askQuestion } }))}
            className={cn("font-headline text-xl italic underline underline-offset-4 hover:opacity-80", CLOSE_RING)}>{CLOSE.askQuestion}</button>
        </p>
        <p className="mt-6 font-body text-[15px] text-on-primary/80 [[data-mood=dusk]_&]:text-on-surface/80">{CLOSE.line}</p>
      </section>
      <section id="contact" aria-labelledby="rose-contact-h" className={NAVY}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-end gap-x-[4.5rem] gap-y-8 px-8 pb-28 pt-16 md:px-12">
          <div className="min-w-0 flex-1 basis-[28rem]">
            <p className="font-label text-[10px] uppercase tracking-[0.18em] text-rose-copper-on-navy">{CLOSE.kicker}</p>
            <h2 id="rose-contact-h" className="mt-4 max-w-4xl font-headline text-4xl leading-[1.1] md:text-6xl">
              {CLOSE.headingLead}
              <em className="text-rose-copper-on-navy">{CLOSE.headingEm}</em>
            </h2>
            <p className="mt-6 max-w-xl font-body text-base text-on-primary/80 [[data-mood=dusk]_&]:text-on-surface/80">{CLOSE.subline}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:max-w-[12rem]">
            <a href={SOCIAL_LINKS.schedule} target="_blank" rel="noopener noreferrer"
              className={cn("rounded-full bg-surface px-5 py-2.5 font-body text-sm font-medium text-primary hover:opacity-90 [[data-mood=dusk]_&]:bg-on-surface [[data-mood=dusk]_&]:text-surface", CLOSE_RING)}>
              {book}<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={SOCIAL_LINKS.email} className={ghost}>{email}</a>
            <a href={SOCIAL_LINKS.cv} target="_blank" rel="noopener noreferrer" className={ghost}>{cv}<span className="sr-only"> (PDF, opens in a new tab)</span></a>
          </div>
        </div>
      </section>
    </>
  );
};

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
    {ROSE_CHAPTERS.map((c, i) => (
      <section key={c.id} id={c.id} data-ch={i} aria-labelledby={`${c.id}-h`} className={cn("scroll-mt-32 pt-24 md:pt-32", MILESTONES[c.id] || c.id === "ch-00" ? "max-w-2xl xl:max-w-[40rem]" : "max-w-3xl")}>
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-secondary">{c.kicker}{MILESTONES[c.id] && <span className="ml-3"><span aria-hidden="true">● </span>Built</span>}</p>
        <h2 id={`${c.id}-h`} className="mt-3 font-headline text-4xl leading-tight text-primary [[data-mood=dusk]_&]:text-on-surface md:text-5xl">{c.heading}</h2>
        {c.id === "ch-00" && <IdeaBody reduced={reduced} />}
        {MILESTONES[c.id] && <MilestoneBody id={c.id} m={MILESTONES[c.id]} reduced={reduced} />}
        {c.transition && <p className="mt-16 font-headline text-xl italic text-on-surface">{c.transition}</p>}
      </section>
    ))}
  </>
));

export const RoseCaseStudy = ({ reduced }: { reduced: boolean }) => {
  const [active, setActive] = useState(-1);
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
          <h2 id="rose-legend" className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">How to read this case study</h2>
          <dl className="mt-3 space-y-1 font-body text-sm text-on-surface">
            {LEGEND.map(([mark, term, def]) => (
              <div key={term} className="flex gap-2"><dt className={cn("w-28 shrink-0 font-label text-xs", LEGEND_TONE[term])}><span aria-hidden="true">{mark} </span>{term}</dt><dd>{def}</dd></div>
            ))}
          </dl>
          <p className="mt-3 font-body text-xs text-on-surface-variant">Milestones come from the repository: commit dates, archived plans, the original prompt. Readings of the design are mine.</p>
        </section>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-8 pb-16 md:px-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="hidden self-start lg:sticky lg:top-28 lg:block">
          <CompassRose heading={needleTurn} reduced={reduced} className="h-16 w-16 text-secondary" />
          <p className="mt-4 font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">On this page</p>
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
