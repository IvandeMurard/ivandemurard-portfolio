import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RECEIPT } from "@/components/atherix/AetherixDailyReceipt";

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
    title: "Does it work?", sub: "Intended behaviour",
    shows: "Automated tests cover answer rendering, booking deduplication, session expiry and page integrity. The final run of 15 synthetic conversations had no invented names, no wrong DomusVi or Sonor facts and one booking card.",
    limits: "One sample per question. Four answers exceeded 110 words. Synthetic visitors only ask what I thought to ask.",
    status: "Verified through defined tests",
  },
  {
    title: "Does it hold up?", sub: "In practice",
    shows: "Content-free events count conversations, failures and booking clicks, deduplicated per tab, in a private dashboard.",
    limits: "Live volume is still small, so rates are not yet stable. Logs are purged after 90 days.",
    status: "Measured, with limitations",
  },
  {
    title: "Does it create value?", sub: "For the visitor",
    shows: "Visitor value is not yet established. A follow-up question might signal curiosity, or confusion. Understanding the difference requires feedback from the person asking.",
    limits: "This is the question Rose exists to answer, and the one current data cannot.",
    status: "Not yet established",
  },
];

export const ChapterLearning = () => (
  <section aria-labelledby="ch-learn">
    <div className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
      <div className="max-w-3xl">
        <Kicker>05 · Learning from reality</Kicker>
        <h2 id="ch-learn" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-6xl">Does Rose actually help?</h2>
        <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-xl">
          There are three questions behind that one. Tests can answer the first. Operational measurements can inform the second. The third needs something neither can supply: visitors.
        </p>
      </div>
    </div>
    <div className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
      <div className="mt-16 grid gap-12 xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-20">
        <ol aria-label="Three questions about Rose" className="border-t border-outline-variant">
          {LEVELS.map((l, i) => (
            <li key={l.title} className="grid gap-4 border-b border-outline-variant py-10 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8">
              <span aria-hidden className="font-headline text-4xl italic leading-none text-outline-variant md:text-5xl">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-headline text-2xl text-primary md:text-3xl">{l.title}</h3>
                <p className={cn("mt-2 font-headline text-lg italic", i === 2 ? "text-on-surface-variant" : "text-secondary")}>{l.status}</p>
                <p className="mt-5 max-w-prose font-body text-base leading-relaxed text-on-surface">{l.shows}</p>
                <p className="mt-3 max-w-prose font-body text-sm leading-relaxed text-on-surface-variant"><span className="font-label text-xs uppercase tracking-[0.2em]">Limits · </span>{l.limits}</p>
              </div>
            </li>
          ))}
          <li className="pt-6 font-body text-xs text-on-surface-variant">Sources: P4 measurement definitions and P5 verification, October 2026. No outcome figures are shown because none are established.</li>
        </ol>

        <aside aria-labelledby="ch-learn-invite" className="self-start xl:[@media(min-height:840px)]:sticky xl:[@media(min-height:840px)]:top-28">
          <div className="border-l-2 border-secondary pl-5">
            <p className="font-label text-xs uppercase tracking-[0.2em] text-secondary">Where the evidence runs out</p>
            <h3 id="ch-learn-invite" className="mt-4 font-headline text-3xl leading-snug text-primary">
              There's one question I can't answer alone.
            </h3>
            <p className="mt-4 font-body text-base leading-relaxed text-on-surface">
              Does Rose help you understand the work, discover a useful connection or ask a better question? Try her on something you're genuinely curious about.
            </p>
            <p className="mt-4 font-headline text-xl italic leading-snug text-secondary">A useful answer doesn't always end the conversation. Sometimes it improves the next question.</p>
            <Button type="button" variant="link" onClick={() => window.dispatchEvent(new Event("rose:open"))}
              className="mt-5 h-auto max-w-full justify-start whitespace-normal rounded-sm p-0 text-left font-label text-sm text-primary underline underline-offset-4 hover:bg-transparent hover:text-secondary">
              Ask Rose your question <span aria-hidden="true">↗</span>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  </section>
);


/* ---------------- Quality assurance · correctness and reader value ---------------- */
/**
 * A review framework, not a live visitor study or a claim that the draft PR
 * is deployed. Does not call the model.
 */
export const ChapterQualityAssurance = () => (
  <section aria-labelledby="ch-qa" className="border-t border-outline-variant bg-surface-container-low">
    <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="max-w-3xl">
        <Kicker>Quality assurance · Answer quality</Kicker>
        <h2 id="ch-qa" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">
          A correct answer can still miss the question.
        </h2>
        <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">
          Chapter 05 asks whether Rose creates value across real visitors. This section is narrower: before an answer
          contributes to that picture, is it correct, and does it respond to the question asked? The second does not
          follow from the first.
        </p>
      </div>

      <figure aria-labelledby="qa-matrix-title" className="mt-12">
        <figcaption id="qa-matrix-title" className="max-w-3xl">
          <p className="font-label text-xs uppercase tracking-[0.18em] text-secondary">QA decision matrix</p>
          <h3 className="mt-3 font-headline text-3xl text-primary">Two gates before an answer can earn trust.</h3>
          <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">
            Correctness and question relevance are independent. The four outcomes tell a reviewer what to do next;
            they do not claim that a visitor found an answer valuable.
          </p>
        </figcaption>
        <div className="mt-7 hidden overflow-x-auto border-y border-outline-variant md:block">
          <table aria-label="Answer quality decision matrix" className="min-w-[42rem] w-full border-collapse text-left">
            <thead className="bg-surface-container">
              <tr>
                <th scope="col" className="w-[24%] border-b border-outline-variant p-4 font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Question relevance</th>
                <th scope="col" className="w-[38%] border-b border-l border-outline-variant p-4 font-label text-[10px] uppercase tracking-[0.18em] text-secondary">Correct · pass</th>
                <th scope="col" className="w-[38%] border-b border-l border-outline-variant p-4 font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Incorrect · fail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="align-top border-b border-outline-variant p-4 font-label text-xs uppercase tracking-[0.16em] text-secondary">Answers the question · pass</th>
                <td className="align-top border-b border-l border-outline-variant p-4">
                  <p className="font-headline text-xl text-primary">Keep and link</p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-on-surface">State the comparison, its limit and where the visitor can inspect the evidence.</p>
                </td>
                <td className="align-top border-b border-l border-outline-variant p-4">
                  <p className="font-headline text-xl text-primary">Block and trace</p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-on-surface">A useful-sounding claim still fails when its model, metric, scope or source cannot be checked.</p>
                </td>
              </tr>
              <tr>
                <th scope="row" className="align-top p-4 font-label text-xs uppercase tracking-[0.16em] text-on-surface-variant">Misses the reader's question · fail</th>
                <td className="align-top border-l border-outline-variant p-4">
                  <p className="font-headline text-xl text-primary">Rewrite</p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-on-surface">A true implementation detail can still avoid the visitor's actual question.</p>
                </td>
                <td className="align-top border-l border-outline-variant p-4">
                  <p className="font-headline text-xl text-primary">Block and investigate</p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-on-surface">Fix the evidence boundary first, then rewrite the answer around the reader's need.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-7 divide-y divide-outline-variant border-y border-outline-variant md:hidden">
          {[
            {
              readerValue: "Answers the question · pass",
              outcomes: [
                {
                  correctness: "Correct · pass",
                  title: "Keep and link",
                  body: "State the comparison, its limit and where the visitor can inspect the evidence.",
                },
                {
                  correctness: "Incorrect · fail",
                  title: "Block and trace",
                  body: "A useful-sounding claim still fails when its model, metric, scope or source cannot be checked.",
                },
              ],
            },
            {
              readerValue: "Misses the reader's question · fail",
              outcomes: [
                {
                  correctness: "Correct · pass",
                  title: "Rewrite",
                  body: "A true implementation detail can still avoid the visitor's actual question.",
                },
                {
                  correctness: "Incorrect · fail",
                  title: "Block and investigate",
                  body: "Fix the evidence boundary first, then rewrite the answer around the reader's need.",
                },
              ],
            },
          ].map((row) => (
            <section className="p-5" key={row.readerValue}>
              <p className="font-label text-[10px] uppercase tracking-[0.18em] text-secondary">{row.readerValue}</p>
              <div className="mt-5 grid gap-5">
                {row.outcomes.map((outcome) => (
                  <div className="border-l border-outline-variant pl-4" key={outcome.title}>
                    <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">{outcome.correctness}</p>
                    <p className="mt-2 font-headline text-xl text-primary">{outcome.title}</p>
                    <p className="mt-2 font-body text-sm leading-relaxed text-on-surface">{outcome.body}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </figure>
      <p className="mt-10 max-w-3xl font-body text-sm leading-relaxed text-on-surface-variant">
        This matrix helps a reviewer judge one answer. It does not establish whether Rose creates value for visitors:
        that remains the product-level question in Chapter 05.
      </p>
    </div>
  </section>
);

/* ---------------- 06 · Adaptive reading ---------------- */
const RECEIPT_LINES = RECEIPT.split("\n");
const STEPS = [
  { title: "01 · Original", sub: "As published", hi: [] as number[], note: "" },
  { title: "02 · Locate", sub: "Find the evidence", hi: [2, 3], note: "" },
  { title: "03 · Explain", sub: "In plain words", hi: [2, 3],
    note: "More guests are expected than last Tuesday: rooms are well booked and a local conference brings check-ins. So the suggestion is one more person front of house. The manager still accepts, corrects or rejects it." },
];

const ChapterNext = ({ compass, reduced }: { compass: Compass; reduced: boolean }) => {
  const [v, setV] = useState(0);
  const s = STEPS[v];
  return (
    <section aria-labelledby="ch-next" className="border-y border-outline-variant bg-surface-container-low">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_160px] lg:items-end">
          <div className="max-w-2xl">
            <Kicker>06 · Adaptive reading</Kicker>
            <h2 id="ch-next" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">What if the content could respond, too?</h2>
            <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">
              Rose is less a chatbot than an experiment in AI-mediated content: dense proof, made queryable in context. The next step is the page itself responding to the question: locating, explaining, connecting. Voice is one possible modality among several, not the point.
            </p>
          </div>
          <div className="mx-auto w-24 text-secondary lg:w-32">{compass(300)}</div>
        </div>
        <figure aria-label="Conceptual adaptive reading demo, not a working feature" className="mt-14 rounded-sm border border-dashed border-outline-variant bg-surface p-5 md:p-8">
          <p className="w-fit rounded-full border border-outline-variant px-3 py-1 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Concept · not a working feature</p>
          <p className="mt-6 font-body text-sm italic text-on-surface-variant">A visitor asks: “Why does Aetherix recommend 4 staff instead of 3?”</p>
          <div className="mt-4"><Tabs id="next" label="Adaptation step" options={STEPS} value={v} onChange={setV} /></div>
          <div id="next-panel" role="tabpanel" aria-labelledby={`next-tab-${v}`} aria-live="polite" className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-high">
              <p className="border-b border-outline-variant bg-surface-container px-5 py-3 font-label text-[10px] uppercase tracking-[0.18em] text-secondary">Aetherix · Daily Receipt</p>
              <pre className="overflow-x-auto px-5 py-5 font-mono text-xs leading-relaxed text-on-surface">
                {RECEIPT_LINES.map((line, i) => {
                  const on = s.hi.includes(i);
                  return (
                    <span key={i} className={cn("block rounded-sm px-1 transition-colors", !reduced && "duration-500",
                      on ? "bg-secondary/20 text-primary" : s.hi.length ? "opacity-50" : "")}>{line}</span>
                  );
                })}
              </pre>
            </div>
            <div className="flex flex-col justify-between gap-6">
              <p className={cn("border-l-2 pl-4 font-body text-sm leading-relaxed", s.note ? "border-secondary text-on-surface" : "border-outline-variant italic text-on-surface-variant", !reduced && "animate-in fade-in duration-500")} key={v}>
                {s.note || (v === 0 ? "The message as the manager receives it." : "The two lines that answer the question, nothing added.")}
              </p>
              <Link to="/aetherix?focus=daily-receipt#how-it-works" className="w-fit font-label text-sm text-primary underline underline-offset-4 hover:text-secondary">Explore this in Aetherix →</Link>
            </div>
          </div>
          <figcaption className="mt-6 font-body text-xs text-on-surface-variant">Based on the Aetherix message mock-up, whose figures are illustrative. Nothing on this page records or plays audio.</figcaption>
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
    <ChapterLearning />
    <ChapterQualityAssurance />
    <ChapterNext compass={compass} reduced={reduced} />
    <Closing ask={ask} compass={compass} />
  </>
);
