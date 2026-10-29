import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EvidenceStatus, type EvidenceState } from "@/components/EvidenceStatus";
import { RoseCue } from "@/components/rose/RoseKinetic";

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

/* Rose speaks through the ambient reader, not an expandable widget. */
const RoseIntervention = ({ id, note }: { id: string; note: string }) => <RoseCue id={id} note={note} />;

const ChapterBridge = ({ from, to }: { from: string; to: string }) => (
  <div aria-hidden="true" className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-12 text-on-surface-variant md:py-16">
    <span className="h-px flex-1 bg-outline-variant" />
    <span className="font-label text-[10px] uppercase tracking-[0.18em]">{from} <span className="mx-2 text-secondary">→</span> {to}</span>
    <span className="h-px flex-1 bg-outline-variant" />
  </div>
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

/* ---------------- 03 · Trust and answer quality ---------------- */
const TRUST = [
  {
    title: "Before 24 October", sub: "Booking with context",
    leaves: ["The booking request", "Up to 20 messages of the conversation", "A notification email to Ivan"],
    stays: ["No documented browser-only conversation boundary"],
    note: "Found in a read-only audit: the booking card sent recent messages with the request, without a notice saying so.",
  },
  {
    title: "After 24 October", sub: "Booking opens the calendar",
    leaves: ["One content-free click event"],
    stays: ["The conversation, in this tab only, for up to 60 minutes", "Calendar details are entered on the calendar page, not passed by Rose"],
    note: "The notification endpoint now refuses requests. Questions are logged for up to 90 days, with email and phone patterns masked, and no IP address.",
  },
];

const ChapterTrust = ({ ask, compass, reduced, trustRef, trustIndex }: { ask: Ask; compass: Compass; reduced: boolean; trustRef?: (element: HTMLElement | null) => void; trustIndex?: number }) => {
  const [v, setV] = useState(0);
  const s = TRUST[v];
  return (
    <section ref={trustRef} data-idx={trustIndex} aria-labelledby="ch-trust" className="border-y border-outline-variant bg-surface-container-low">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_200px] lg:items-end">
          <div className="max-w-2xl">
            <Kicker>03 · Trust and answer quality</Kicker>
            <div className="mt-5"><EvidenceStatus state="built" /></div>
            <h2 id="ch-trust" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">Trust has two separate contracts.</h2>
            <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">
              One concerns data: what is retained and transmitted. The other concerns knowledge: what Rose may assert or infer. Mixing them would make privacy sound like proof, or proof sound like privacy.
            </p>
          </div>
          <div className="mx-auto w-28 text-secondary lg:w-40">{compass(300)}</div>
        </div>

        <dl aria-label="Trust implementation at a glance" className="mt-12 grid border-y border-outline-variant sm:grid-cols-3">
          {[
            ["0", "conversation or summary sent with a booking link"],
            ["60 min", "tab-local conversation continuity after inactivity"],
            ["90 days", "interaction-record retention in the private admin view"],
          ].map(([value, label]) => (
            <div key={value} className="border-b border-outline-variant p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
              <dt className="font-headline text-3xl text-primary">{value}</dt>
              <dd className="mt-2 font-body text-sm leading-relaxed text-on-surface-variant">{label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 max-w-4xl">
          <p className="font-label text-xs uppercase tracking-[0.2em] text-secondary">Data integrity · retain and transmit</p>
          <p className="mt-3 font-body text-base leading-relaxed text-on-surface">The tab keeps a bounded conversation for continuity. Interaction records are retained for product measurement with email and phone patterns masked. A booking sends no conversation or summary.</p>
        </div>
        <figure aria-label="What leaves the tab when a visitor books" className="mt-8 rounded-sm border border-outline-variant bg-surface p-5 md:p-8">
          <Tabs id="trust" label="Booking behaviour" options={TRUST} value={v} onChange={setV} />
          <div id="trust-panel" role="tabpanel" aria-labelledby={`trust-tab-${v}`} aria-live="polite" className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <p className="font-label text-xs uppercase tracking-[0.2em] text-secondary">Leaves the tab</p>
              <ul className="mt-4 space-y-3">
                {s.leaves.map((t) => <li key={t} className={cn("border-l-2 border-secondary pl-3 font-body text-base text-on-surface", !reduced && "animate-in fade-in duration-500")}>{t}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">Browser boundary</p>
              <ul className="mt-4 space-y-3">
                {s.stays.map((t) => <li key={t} className={cn("border-l-2 border-outline-variant pl-3 font-body text-base text-on-surface", !reduced && "animate-in fade-in duration-500")}>{t}</li>)}
              </ul>
            </div>
            <p className="md:col-span-2 border-t border-outline-variant pt-4 font-body text-sm leading-relaxed text-on-surface-variant">{s.note}</p>
          </div>
          <figcaption className="mt-6 font-body text-xs text-on-surface-variant">Sources: Rose audit and P0 privacy fix, 24 October 2026. Layout is illustrative; the listed behaviours are recorded.</figcaption>
        </figure>

        <div className="mt-14 max-w-4xl">
          <p className="font-label text-xs uppercase tracking-[0.2em] text-secondary">Epistemic integrity · assert and infer</p>
          <p className="mt-3 font-body text-base leading-relaxed text-on-surface">Rose can ground an answer in published pages, the page address and an optional selected starter. She cannot turn hidden browser state into knowledge, or turn a plausible paraphrase into an established fact.</p>
        </div>
        <div className="mt-8 grid max-w-5xl gap-8 lg:grid-cols-3">
          <p className="font-body text-base leading-relaxed text-on-surface">
            <span className="font-headline text-xl italic text-secondary">Claims.</span> Rose may only state what the published pages state. Aetherix is described as running on sandbox and public benchmark data, never with real hotel outcomes.
          </p>
          <p className="font-body text-base leading-relaxed text-on-surface">
            <span className="font-headline text-xl italic text-secondary">Retain.</span> A conversation follows the visitor across pages within one tab, then expires after 60 minutes of inactivity. The application does not keep a server transcript; bounded interaction records are retained separately for up to 90 days.
          </p>
          <p className="font-body text-base leading-relaxed text-on-surface">
            <span className="font-headline text-xl italic text-secondary">Inference.</span> Rose receives the page address and a selected starter’s intent, not a full screen, cursor position or private browser state. Context is supplied, not guessed.
          </p>
        </div>
        <div className="mt-10 grid max-w-4xl gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <RoseIntervention id="trust" note="When you book, I send nothing. Not even this conversation." />
          <div className="border-l border-outline-variant pl-4">
            <EvidenceStatus state="validation" />
            <p className="mt-3 font-body text-sm leading-relaxed text-on-surface">The release decision used 15 synthetic conversations. That checks defined risks, not whether a visitor felt understood.</p>
          </div>
        </div>
        <div className="mt-10">{ask("What does Rose keep from my conversation?")}</div>
      </div>
    </section>
  );
};

/* ---------------- 05 · Open questions ---------------- */
const LEVELS = [
  {
    title: "Does it work?", sub: "Intended behaviour",
    shows: "Automated tests cover answer rendering, booking deduplication, session expiry and page integrity. The final run of 15 synthetic conversations had no invented names, no wrong DomusVi or Sonor facts and one booking card.",
    limits: "One sample per question. Four answers exceeded 110 words. Synthetic visitors only ask what I thought to ask.",
    status: "Verified through defined tests",
    evidence: "validation" as EvidenceState,
  },
  {
    title: "Does it hold up?", sub: "In practice",
    shows: "Content-free events count conversations, failures and booking clicks, deduplicated per tab, in a private dashboard.",
    limits: "Live volume is still small, so rates are not yet stable. Logs are purged after 90 days.",
    status: "Measured, with limitations",
    evidence: "built" as EvidenceState,
  },
  {
    title: "Does it create value?", sub: "For the visitor",
    shows: "Visitor value is not yet established. A follow-up question might signal curiosity, or confusion. Understanding the difference requires feedback from the person asking.",
    limits: "This is the question Rose exists to answer, and the one current data cannot.",
    status: "Not yet established",
  },
];

export const ChapterLearning = ({ learningRef, learningIndex, compass, reduced }: { learningRef?: (element: HTMLElement | null) => void; learningIndex?: number; compass?: Compass; reduced?: boolean }) => (
  <section ref={learningRef} data-idx={learningIndex} aria-labelledby="ch-learn">
    <div className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
      <div className="max-w-3xl">
        <Kicker>05 · Open questions</Kicker>
        <h2 id="ch-learn" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-6xl">What has Rose not earned the right to claim?</h2>
        <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-xl">
          The product can demonstrate defined behaviour and observe bounded signals. It cannot yet claim that a source-correct answer helps someone decide, that a contextual assistant is the right role, or that voice makes navigation easier.
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
                {l.evidence ? <div className="mt-3"><EvidenceStatus state={l.evidence} /></div> : <p className="mt-3 font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Open question</p>}
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
            <div className="flex items-center gap-3">
              {compass && <span aria-hidden="true" className={cn("w-10 text-secondary", !reduced && "motion-safe:animate-pulse")}>{compass(300, "h-10 w-10")}</span>}
              <p className="font-label text-xs uppercase tracking-[0.2em] text-secondary">Where the evidence runs out</p>
            </div>
            <h3 id="ch-learn-invite" className="mt-4 font-headline text-3xl leading-snug text-primary">
              There's one question I can't answer alone.
            </h3>
            <p className="mt-4 font-body text-base leading-relaxed text-on-surface">
              Does Rose help you understand the work, discover a useful connection or ask a better question? The product has not earned that conclusion yet. Try her on something you are genuinely curious about.
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
          A correct answer can still be the wrong answer.
        </h2>
        <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">
          The final chapter asks whether Rose creates value across real visitors. This section is narrower: a source check can
          pass while an answer still fails the reader’s question. Correctness is necessary; usefulness in context is separate.
        </p>
      </div>

      <figure aria-labelledby="qa-matrix-title" className="mt-12 max-w-5xl">
        <figcaption id="qa-matrix-title" className="max-w-3xl">
          <p className="font-label text-xs uppercase tracking-[0.18em] text-secondary">Answer review</p>
          <h3 className="mt-3 font-headline text-3xl text-primary">Source check, then reader check.</h3>
          <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">
            “Useful to this reader” means that the answer addresses this question in this context. It is not a claim of measured visitor value.
          </p>
        </figcaption>
        <div className="mt-7 overflow-x-auto border-y border-outline-variant">
          <table aria-label="Correctness and reader usefulness review" className="min-w-[42rem] w-full border-collapse text-left">
            <thead className="bg-surface-container">
              <tr>
                <th scope="col" className="w-[42%] border-b border-outline-variant p-4 font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Answer under review</th>
                <th scope="col" className="w-[18%] border-b border-l border-outline-variant p-4 font-label text-[10px] uppercase tracking-[0.18em] text-secondary">Factually correct</th>
                <th scope="col" className="w-[22%] border-b border-l border-outline-variant p-4 font-label text-[10px] uppercase tracking-[0.18em] text-secondary">Useful to this reader</th>
                <th scope="col" className="w-[18%] border-b border-l border-outline-variant p-4 font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Reviewer action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="align-top border-b border-outline-variant p-4 font-body text-sm font-normal leading-relaxed text-on-surface">An exact internal release-process detail, offered when the reader asked what Ivan measures.</th>
                <td className="align-top border-b border-l border-outline-variant p-4 font-label text-xs uppercase tracking-[0.16em] text-secondary">Pass</td>
                <td className="align-top border-b border-l border-outline-variant p-4 font-label text-xs uppercase tracking-[0.16em] text-on-surface-variant">Fail</td>
                <td className="align-top border-b border-l border-outline-variant p-4 font-headline text-xl text-primary">Rewrite</td>
              </tr>
              <tr>
                <th scope="row" className="align-top p-4 font-body text-sm font-normal leading-relaxed text-on-surface">A source-backed forecast comparison, its scope and its limit, offered to that same reader.</th>
                <td className="align-top border-l border-outline-variant p-4 font-label text-xs uppercase tracking-[0.16em] text-secondary">Pass</td>
                <td className="align-top border-l border-outline-variant p-4 font-label text-xs uppercase tracking-[0.16em] text-secondary">Pass</td>
                <td className="align-top border-l border-outline-variant p-4 font-headline text-xl text-primary">Keep and link</td>
              </tr>
            </tbody>
          </table>
        </div>
      </figure>
      <p className="mt-10 max-w-3xl font-body text-sm leading-relaxed text-on-surface-variant">
        This review checks one answer at a time. It does not establish whether Rose creates value for visitors; that remains the product-level question in the final chapter.
      </p>
    </div>
  </section>
);

/* ---------------- 04 · Contextual assistant, a work in progress ---------------- */
const ChapterNext = ({ compass, reduced, nextRef, nextIndex, lab }: { compass: Compass; reduced: boolean; lab?: ReactNode; nextRef?: (element: HTMLElement | null) => void; nextIndex?: number }) => {
  return (
    <section ref={nextRef} data-idx={nextIndex} aria-labelledby="ch-next" className="border-y border-outline-variant bg-surface-container-low">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_160px] lg:items-end">
          <div className="max-w-2xl">
            <Kicker>04 · Contextual assistant · Work in progress</Kicker>
            <div className="mt-5"><EvidenceStatus state="design" /></div>
            <h2 id="ch-next" className="mt-4 font-headline text-4xl leading-tight text-primary md:text-5xl">Make the whole site easier to navigate, not just one reply.</h2>
            <p className="mt-6 font-body text-base leading-relaxed text-on-surface md:text-lg">
              Contextual assistant is the direction; adaptive reading is one possible behaviour inside it. Rose could locate, reformulate and visualise the relationships between pages while preserving the original sources and their limits. Rose remains text-based today.
            </p>
          </div>
          <div className="mx-auto w-24 text-secondary lg:w-32">{compass(300)}</div>
        </div>
        {lab}
        <div className="mt-12 grid gap-px border border-outline-variant bg-outline-variant md:grid-cols-3">
          {[
            ["Read", "Rose points to the source and its boundary."],
            ["Diagram", "Rose maps a relationship already documented across pages."],
            ["Voice", "A hands-free request or answer only when it removes a real navigation task."],
          ].map(([modeTitle, copy]) => (
            <div key={modeTitle} className="bg-surface p-5">
              <p className="font-label text-[10px] uppercase tracking-[0.18em] text-secondary">{modeTitle}</p>
              {modeTitle === "Voice" && <div aria-hidden="true" className="mt-4 flex h-8 items-center gap-1 text-secondary">{[35, 70, 45, 100, 55, 75, 30].map((height, index) => <span key={index} className={cn("w-1 rounded-full bg-current", !reduced && "motion-safe:animate-pulse")} style={{ height: `${height}%`, animationDelay: `${index * 90}ms` }} />)}</div>}
              <p className={cn("font-body text-sm leading-relaxed text-on-surface", modeTitle === "Voice" ? "mt-3" : "mt-4")}>{copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-3xl border-l-2 border-secondary pl-5">
          <p className="font-headline text-2xl text-primary">Voice, only if it removes work.</p>
          <p className="mt-3 font-body text-base leading-relaxed text-on-surface">This is work in progress, not an announced capability. Voice would need an explicit start, a readable text alternative and the same inspectable evidence. It is a modality inside the contextual-assistant direction, not an ambient narrator.</p>
        </div>
      </div>
    </section>
  );
};

/* ---------------- Closing ---------------- */
const PATHS = [
  { t: "Value", d: "Does a source-correct answer actually help someone decide about the work?" },
  { t: "Role", d: "Should Rose remain an index of the site, or become a critical discussion partner?" },
  { t: "Modality", d: "When would voice reduce navigation work rather than add spectacle?" },
];

const Closing = ({ ask, compass }: { ask: Ask; compass: Compass }) => (
  <section aria-labelledby="ch-close">
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center md:py-36">
      <div className="w-20 text-secondary">{compass(0)}</div>
      <h2 id="ch-close" className="mt-10 font-headline text-3xl leading-tight text-primary md:text-5xl">
        Questions I am leaving open, <span className="italic text-secondary">rather than calling them features.</span>
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
      <p className="mt-10 font-body text-sm text-on-surface-variant">Start with the evidence. A human conversation is available when it adds context Rose cannot.</p>
    </div>
  </section>
);

export const RoseLaterChapters = ({ ask, compass, reduced, nextLab, trustRef, trustIndex, nextRef, nextIndex, learningRef, learningIndex }: { ask: Ask; compass: Compass; reduced: boolean; nextLab?: ReactNode; trustRef?: (element: HTMLElement | null) => void; trustIndex?: number; nextRef?: (element: HTMLElement | null) => void; nextIndex?: number; learningRef?: (element: HTMLElement | null) => void; learningIndex?: number }) => (
  <>
    <ChapterTrust ask={ask} compass={compass} reduced={reduced} trustRef={trustRef} trustIndex={trustIndex} />
    <ChapterQualityAssurance />
    <ChapterBridge from="Answer quality" to="Contextual assistance" />
    <ChapterNext compass={compass} reduced={reduced} nextRef={nextRef} nextIndex={nextIndex} lab={nextLab} />
    <ChapterBridge from="Design direction" to="Open questions" />
    <ChapterLearning learningRef={learningRef} learningIndex={learningIndex} compass={compass} reduced={reduced} />
    <Closing ask={ask} compass={compass} />
  </>
);
