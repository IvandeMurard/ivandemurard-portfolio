import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Design-lab chapters 04 to 06 and the closing of Rose Prototype C.
 * Facts come from the P0 to P5 records (docs/rose-p4-*, docs/rose-p5-verification.md).
 * Nothing here calls Rose except the explicit Ask links passed in by the page.
 */

type Ask = (text: string) => ReactNode;
type Compass = (heading: number, className?: string) => ReactNode;

const Kicker = ({ children }: { children: ReactNode }) => (
  <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">{children}</p>
);

/** Accessible two-or-more option tab control shared by the chapter instruments. */
const Tabs = ({ label, options, value, onChange, id }: {
  label: string; options: { title: string; sub: string }[]; value: number; onChange: (i: number) => void; id: string;
}) => {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const go = (i: number) => { onChange(i); refs.current[i]?.focus(); };
  return (
    <div role="tablist" aria-label={label} className="grid border-b border-outline-variant" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o, i) => (
        <Button key={o.title} ref={(el) => { refs.current[i] = el; }} type="button" variant="ghost" role="tab"
          id={`${id}-tab-${i}`} aria-selected={value === i} aria-controls={`${id}-panel`} tabIndex={value === i ? 0 : -1}
          onClick={() => onChange(i)}
          onKeyDown={(e) => {
            const n = options.length;
            const map: Record<string, number> = { ArrowRight: (value + 1) % n, ArrowLeft: (value - 1 + n) % n, Home: 0, End: n - 1 };
            if (e.key in map) { e.preventDefault(); go(map[e.key]); }
          }}
          className={cn("h-auto min-h-14 flex-col whitespace-normal rounded-none border-b-2 px-2 py-3 hover:bg-surface-container-low hover:text-primary",
            value === i ? "border-secondary text-primary" : "border-transparent text-on-surface-variant")}>
          <span className="font-label text-sm">{o.title}</span>
          <span className="font-body text-xs font-normal">{o.sub}</span>
        </Button>
      ))}
    </div>
  );
};

/* ---------------- 04 · Designing for trust ---------------- */
const TRUST = [
  {
    title: "Before 24 October", sub: "Booking with context",
    leaves: ["The booking request", "Up to 20 messages of the conversation", "A notification email to Ivan"],
    stays: ["Nothing else was promised"],
    note: "Found in a read-only audit: the booking card sent recent messages with the request, without a notice saying so.",
  },
  {
    title: "After 24 October", sub: "Booking opens the calendar",
    leaves: ["One content-free click event"],
    stays: ["The conversation, in this tab only, for up to 60 minutes", "Your details, entered on the calendar page you chose"],
    note: "The notification endpoint now refuses requests. Questions are logged for up to 90 days, with email and phone patterns masked, and no IP address.",
  },
];

const ChapterTrust = ({ ask, compass, reduced }: { ask: Ask; compass: Compass; reduced: boolean }) => {
  const [v, setV] = useState(0);
  const s = TRUST[v];
  return (
    <section aria-labelledby="ch-trust" className="border-y border-outline-variant bg-surface-container-low">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_200px] lg:items-end">
          <div className="max-w-2xl">
            <Kicker>04 · Designing for trust</Kicker>
            <h2 id="ch-trust" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">What should an assistant keep, claim and send?</h2>
            <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">
              Once Rose answered about the work, the harder questions were about restraint. What she may claim about projects, what she remembers between pages, and what leaves the browser when someone books a call.
            </p>
          </div>
          <div className="mx-auto w-28 text-secondary lg:w-40">{compass(215)}</div>
        </div>

        <figure aria-label="What leaves the tab when a visitor books" className="mt-14 rounded-sm border border-outline-variant bg-surface p-5 md:p-8">
          <Tabs id="trust" label="Booking behaviour" options={TRUST} value={v} onChange={setV} />
          <div id="trust-panel" role="tabpanel" aria-labelledby={`trust-tab-${v}`} aria-live="polite" className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <p className="font-label text-xs uppercase tracking-[0.2em] text-secondary">Leaves the tab</p>
              <ul className="mt-4 space-y-3">
                {s.leaves.map((t) => <li key={t} className={cn("border-l-2 border-secondary pl-3 font-body text-base text-on-surface", !reduced && "animate-in fade-in duration-500")}>{t}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">Stays with the visitor</p>
              <ul className="mt-4 space-y-3">
                {s.stays.map((t) => <li key={t} className={cn("border-l-2 border-outline-variant pl-3 font-body text-base text-on-surface", !reduced && "animate-in fade-in duration-500")}>{t}</li>)}
              </ul>
            </div>
            <p className="md:col-span-2 border-t border-outline-variant pt-4 font-body text-sm leading-relaxed text-on-surface-variant">{s.note}</p>
          </div>
          <figcaption className="mt-6 font-body text-xs text-on-surface-variant">Sources: Rose audit and P0 privacy fix, 24 October 2026. Layout is illustrative; the listed behaviours are recorded.</figcaption>
        </figure>

        <div className="mt-14 grid max-w-4xl gap-8 md:grid-cols-2">
          <p className="font-body text-base leading-relaxed text-on-surface">
            <span className="font-headline text-xl italic text-secondary">Claims.</span> Rose may only state what the published pages state. Aetherix is described as running on sandbox and public benchmark data, never with real hotel outcomes.
          </p>
          <p className="font-body text-base leading-relaxed text-on-surface">
            <span className="font-headline text-xl italic text-secondary">Memory.</span> A conversation follows the visitor across pages within one tab, then expires after 60 minutes of inactivity. There is no server transcript of it.
          </p>
        </div>
        <div className="mt-10">{ask("What does Rose keep from my conversation?")}</div>
      </div>
    </section>
  );
};

/* ---------------- 05 · Does Rose actually help? ---------------- */
const LEVELS = [
  {
    title: "Tested", sub: "Does it behave?",
    shows: "Automated tests cover answer rendering, booking deduplication, session expiry and page integrity. The final run of 15 synthetic conversations had no invented names, no wrong DomusVi or Sonor facts and one booking card.",
    limits: "One sample per question. Four answers exceeded 110 words. Synthetic visitors only ask what I thought to ask.",
    status: "Verified",
  },
  {
    title: "Reliable", sub: "Does it hold up?",
    shows: "Content-free events count conversations, failures and booking clicks, deduplicated per tab, in a private dashboard.",
    limits: "Live volume is still small, so rates are not yet stable. Logs are purged after 90 days.",
    status: "Measurable, early",
  },
  {
    title: "Valuable", sub: "Does it help?",
    shows: "Nothing yet. A follow-up question is not a failure: it can be productive curiosity rather than unresolved confusion, and no event tells the two apart.",
    limits: "This is the question Rose exists to answer, and the one current data cannot.",
    status: "Not measured",
  },
];

const FEEDBACK = [
  { a: "Yes", q: "What helped most?" },
  { a: "Partly", q: "What would make this more useful?" },
  { a: "Not yet", q: "What was missing?" },
];

const FeedbackPrototype = () => {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <figure aria-label="Conceptual feedback prototype" className="mt-12 max-w-xl rounded-sm border border-dashed border-outline-variant bg-surface p-5 md:p-6">
      <p className="w-fit rounded-full border border-outline-variant px-3 py-1 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Concept · no data is stored or transmitted</p>
      <p className="mt-5 font-headline text-xl text-primary">Did Rose help you move your thinking forward?</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {FEEDBACK.map((f, i) => (
          <Button key={f.a} type="button" variant="outline" size="sm" aria-pressed={pick === i} onClick={() => setPick(i)}
            className={cn("rounded-full", pick === i && "border-secondary text-primary")}>{f.a}</Button>
        ))}
      </div>
      <p aria-live="polite" className="mt-4 min-h-6 font-body text-sm italic text-on-surface-variant">
        {pick !== null ? `${FEEDBACK[pick].q} (optional, nothing is sent)` : ""}
      </p>
      <figcaption className="mt-2 font-body text-xs text-on-surface-variant">Would appear only after two completed answers, once per session, dismissible.</figcaption>
    </figure>
  );
};

const ChapterLearning = ({ ask, reduced }: { ask: Ask; reduced: boolean }) => {
  const [v, setV] = useState(0);
  const l = LEVELS[v];
  return (
    <section aria-labelledby="ch-learn">
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <Kicker>05 · Learning from reality</Kicker>
          <h2 id="ch-learn" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">Does Rose actually help?</h2>
          <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">
            In October I wrote fake conversations and checked Rose against them, then released on a risk-based decision rather than a perfect score. That proves she behaves. It does not prove anyone is better off for asking.
          </p>
        </div>

        <figure aria-label="Three kinds of evidence" className="mt-14">
          <Tabs id="learn" label="Level of evidence" options={LEVELS} value={v} onChange={setV} />
          <div id="learn-panel" role="tabpanel" aria-labelledby={`learn-tab-${v}`} aria-live="polite" className={cn("mt-8 grid gap-8 md:grid-cols-[160px_minmax(0,1fr)]", !reduced && "animate-in fade-in duration-500")} key={v}>
            <p className={cn("font-headline text-3xl italic", v === 2 ? "text-on-surface-variant" : "text-secondary")}>{l.status}</p>
            <div className="max-w-prose space-y-4">
              <p className="font-body text-base leading-relaxed text-on-surface"><span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">What it shows · </span>{l.shows}</p>
              <p className="font-body text-base leading-relaxed text-on-surface"><span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">What it cannot · </span>{l.limits}</p>
            </div>
          </div>
          <figcaption className="mt-8 font-body text-xs text-on-surface-variant">Sources: P4 measurement definitions and P5 verification, October 2026. No production outcome figures are shown because none are established.</figcaption>
        </figure>
        <p className="mt-12 max-w-xl font-headline text-2xl italic leading-snug text-secondary">A useful answer doesn't always end the conversation. Sometimes it improves the next question.</p>
        <FeedbackPrototype />
        <div className="mt-10">{ask("How do you know an agent is working?")}</div>
      </div>
    </section>
  );
};

/* ---------------- 06 · Adaptive reading ---------------- */
const BASE = "Breakfast forecast: 84 covers. Staff: 4 front of house.";
const MODES = [
  { title: "Point to evidence", sub: "Where does it come from?", hi: "84 covers", note: "72 rooms booked plus 12 typical Tuesday walk-ins. Figures in the case study mock-up are illustrative." },
  { title: "Explain differently", sub: "In plain words", hi: "4 front of house", note: "For a manager: one more person than last Tuesday, because more guests are expected." },
  { title: "Show connections", sub: "What else relates?", hi: "forecast", note: "The same forecast feeds the Field Note on whose truth an agent should learn from." },
  { title: "Another modality", sub: "Voice, one option", hi: "", note: "Hypothesis: the same passage, read aloud while walking, with the answer pointing back to the text. No voice feature exists." },
];

const Highlighted = ({ text, hi }: { text: string; hi: string }) => {
  if (!hi || !text.includes(hi)) return <>{text}</>;
  const [a, b] = text.split(hi);
  return <>{a}<mark className="rounded-sm bg-secondary/20 px-0.5 text-primary">{hi}</mark>{b}</>;
};

const ChapterNext = ({ compass }: { compass: Compass }) => {
  const [v, setV] = useState(0);
  const m = MODES[v];
  return (
    <section aria-labelledby="ch-next" className="border-y border-outline-variant bg-surface-container-low">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_160px] lg:items-end">
          <div className="max-w-2xl">
            <Kicker>06 · Adaptive reading</Kicker>
            <h2 id="ch-next" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">What if the content could respond, too?</h2>
            <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">
              Rose is less a chatbot than an experiment in AI-mediated content: dense proof, made queryable in context. The next step is the page itself adapting to the question, with voice as one modality among several.
            </p>
          </div>
          <div className="mx-auto w-24 text-secondary lg:w-32">{compass(300)}</div>
        </div>
        <figure aria-label="Conceptual adaptive reading demo, not a working feature" className="mt-14 rounded-sm border border-dashed border-outline-variant bg-surface p-5 md:p-8">
          <p className="w-fit rounded-full border border-outline-variant px-3 py-1 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Concept · not a working feature</p>
          <div className="mt-6"><Tabs id="next" label="Adaptation" options={MODES} value={v} onChange={setV} /></div>
          <div id="next-panel" role="tabpanel" aria-labelledby={`next-tab-${v}`} aria-live="polite" className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <p className="font-mono text-sm leading-relaxed text-on-surface"><Highlighted text={BASE} hi={m.hi} /></p>
            <p className="border-l-2 border-secondary pl-4 font-body text-sm italic leading-relaxed text-on-surface-variant">{m.note}</p>
          </div>
          <figcaption className="mt-6 font-body text-xs text-on-surface-variant">Example based on the Aetherix message mock-up. Nothing on this page records or plays audio.</figcaption>
        </figure>
      </div>
    </section>
  );
};

/* ---------------- Closing ---------------- */
const PATHS = [
  { t: "Answer", d: "Rose replies from the published pages, with links to the evidence." },
  { t: "Explore", d: "A better next question is often the value created." },
  { t: "Connect", d: "When context matters, a human conversation adds what Rose cannot." },
];

const Closing = ({ ask, compass }: { ask: Ask; compass: Compass }) => (
  <section aria-labelledby="ch-close">
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center md:py-36">
      <div className="w-20 text-secondary">{compass(0)}</div>
      <h2 id="ch-close" className="mt-10 font-headline text-3xl leading-tight text-primary md:text-5xl">
        Can a conversational portfolio help us explore the work more deeply, <span className="italic text-secondary">and ask better questions along the way?</span>
      </h2>
      <ol className="mt-12 grid w-full gap-6 text-left md:grid-cols-3">
        {PATHS.map((p, i) => (
          <li key={p.t} className="border-t border-outline-variant pt-4">
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">{String(i + 1).padStart(2, "0")} · {p.t}</p>
            <p className="mt-2 font-body text-base leading-relaxed text-on-surface">{p.d}</p>
          </li>
        ))}
      </ol>
      <div className="mt-12">{ask("What has Ivan actually built?")}</div>
      <p className="mt-10 font-body text-sm text-on-surface-variant">
        Some questions deserve a conversation. <Link to="/contact" className="underline underline-offset-4 hover:text-primary">Talk to Ivan</Link>
      </p>
    </div>
  </section>
);

export const RoseLaterChapters = ({ ask, compass, reduced }: { ask: Ask; compass: Compass; reduced: boolean }) => (
  <>
    <ChapterTrust ask={ask} compass={compass} reduced={reduced} />
    <ChapterLearning ask={ask} reduced={reduced} />
    <ChapterNext compass={compass} />
    <Closing ask={ask} compass={compass} />
  </>
);
