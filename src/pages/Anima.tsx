import { ClosingContact } from "@/components/case/ClosingContact";
// Source of truth for facts (status, layers, gating). If you change facts here,
// also update public/anima.md.
import { useRef, type ReactNode } from "react";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { CaseAnchors } from "@/components/case/CaseAnchors";
import { AETHERIX_ANCHORS } from "@/content/systems";
import { JournalToc } from "@/components/reading/JournalToc";
import { ReadingProgress } from "@/components/reading/ReadingProgress";
import { HeadingAnchor } from "@/components/reading/HeadingAnchor";
import { useHeadingToc } from "@/components/reading/useHeadingToc";
import { SectionKey } from "@/components/journal/SectionKey";
import { AskRose } from "@/components/journal/AskRose";
import { ShareRow } from "@/components/journal/ShareRow";
import { EntryActions } from "@/components/journal/EntryActions";
import { AnimaRoadmapStrip } from "@/components/anima/AnimaRoadmapStrip";
import { AnimaStayTimeline } from "@/components/anima/AnimaStayTimeline";
import { AnimaClaimCard } from "@/components/anima/AnimaClaimCard";
import { AnimaGateDiagram } from "@/components/anima/AnimaGateDiagram";

const linkCls =
  "text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity";

const P = ({ children }: { children: ReactNode }) => (
  <p className="font-body text-on-surface-variant leading-relaxed text-base md:text-lg mb-5 max-w-3xl">
    {children}
  </p>
);

const Pull = ({ children }: { children: ReactNode }) => (
  <p className="font-headline italic text-primary text-xl md:text-2xl leading-snug my-8 max-w-3xl border-l border-secondary pl-6">
    {children}
  </p>
);

const Section = ({
  id,
  number,
  title,
  keyLine,
  concrete,
  children,
}: {
  id: string;
  number: string;
  title: string;
  keyLine: string;
  concrete: string;
  children: ReactNode;
}) => (
  <Reveal as="section" aria-labelledby={id} className="px-6 md:px-12 mb-14 md:mb-20">
    <div className="max-w-screen-2xl mx-auto">
      <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary block mb-3">
        Sec. {number}
      </span>
      <h2
        id={id}
        tabIndex={-1}
        className="group font-headline italic text-primary text-3xl md:text-4xl leading-tight mb-6 scroll-mt-32"
      >
        {title}
        <HeadingAnchor id={id} text={title} />
      </h2>
      <div className="mb-8 max-w-3xl">
        <SectionKey sigil={`Section ${number}`} icon="key" oneLine={keyLine} concrete={concrete} />
      </div>
      {children}
    </div>
  </Reveal>
);

const LAYER_ROWS: string[][] = [
  ["Working", "The current stay, in progress", "Expires at check-out"],
  ["Episodic", "This stay and a short tail after it", "Weeks"],
  ["Semantic", "Durable preferences, stated or repeatedly confirmed", "Long, with decay"],
  [
    "Segment",
    "Anonymised patterns, what guests like this tend to need",
    "Aggregate, never individual",
  ],
];

const Table = ({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: string[][];
}) => (
  <div
    role="region"
    aria-label={caption}
    tabIndex={0}
    className="overflow-x-auto rounded-sm border border-outline-variant bg-surface-container-lowest mb-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
  >
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="border-b border-outline">
          {head.map((h) => (
            <th
              key={h}
              scope="col"
              className="px-4 py-3 font-label uppercase tracking-[0.16em] text-[10px] text-secondary whitespace-nowrap"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[0]} className="border-b border-outline-variant last:border-b-0 align-top">
            <th
              scope="row"
              className="px-4 py-4 font-headline italic text-primary text-base whitespace-nowrap"
            >
              {row[0]}
            </th>
            {row.slice(1).map((cell, i) => (
              <td key={i} className="px-4 py-4 font-body text-sm text-on-surface-variant leading-relaxed">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const OPENING_QUESTIONS = [
  "What does this property know about a guest that nobody ever wrote down?",
  "What did we learn last stay that we will fail to use during this one?",
  "What does a guest have to repeat every single time, and what does that cost us?",
  "Which of the things we believe about them did they tell us, and which did we infer?",
];

const ROSE_PROMPTS = [
  "On the Anima case study: what are the four memory layers, and why do they expire differently?",
  "On the Anima case study: why is deployment frozen until the data-protection impact assessment (DPIA) clears?",
  "On the Anima case study: what stops a consumer from asking for everything known about a guest?",
  "On the Anima case study: how is this different from a personalisation engine?",
];

const Anima = () => {
  const articleRef = useRef<HTMLElement>(null);
  const toc = useHeadingToc(articleRef);

  return (
    <SiteLayout title="Anima">
      <Seo
        title="Anima, the Guest Memory Node of the Hospitality Multi-Agent Architecture"
        description="Memory that means no guest has to ask twice. A guest memory node that keeps what a guest said and what happened, so nobody asks twice, without watching."
        path="/anima"
        type="article"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: "Anima",
            headline: "Anima: memory that means no guest has to ask twice",
            url: "https://ivandemurard.com/anima",
            inLanguage: "en",
            about: [
              "Guest Memory",
              "Data Protection",
              "Agentic AI",
              "Hospitality Operations",
            ],
            creator: { "@type": "Person", name: "Ivan de Murard", url: "https://ivandemurard.com" },
            dateCreated: "2026-06-01",
            relatedLink: [
              "https://ivandemurard.com/architecture",
              "https://ivandemurard.com/aetherix",
            ],
          },
        ]}
      />
      <ReadingProgress targetRef={articleRef} />

      <div className="pt-32">
        {/* Hero */}
        <Reveal as="header" className="px-6 md:px-12 mb-12 md:mb-16">
          <div className="max-w-screen-2xl mx-auto">
            <span
              data-reveal-child
              className="text-secondary font-label uppercase tracking-[0.2em] text-[10px] mb-6 block"
            >
              Case study
            </span>
            <h1
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "120ms" }}
              className="headline-ink font-headline text-4xl md:text-6xl lg:text-7xl text-primary italic leading-[0.98] tracking-tight mb-6"
            >
              Anima
            </h1>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "200ms" }}
              className="font-headline italic text-primary text-2xl md:text-3xl max-w-3xl leading-tight mb-6"
            >
              Memory that means no guest has to ask twice.
            </p>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "280ms" }}
              className="text-on-surface-variant font-body text-lg max-w-2xl leading-relaxed mb-8"
            >
              Keeps what a guest said and what happened, so nobody asks twice, without watching.
            </p>
            <span
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "360ms" }}
              className="inline-block rounded-sm border border-outline bg-surface-container-low px-4 py-2 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant"
            >
              Synthetic proof of concept · deployment frozen until the data-protection impact assessment (DPIA) clears
            </span>
            <div data-reveal-child style={{ ["--reveal-delay" as string]: "420ms" }} className="mt-8">
              <EntryActions title="Anima" markdownPath="/anima.md" variant="case" />
            </div>
          </div>
        </Reveal>

        <CaseAnchors current="anima" entries={AETHERIX_ANCHORS} columns={4} more={{ to: "/architecture", text: "How the nodes fit together: the architecture note" }} />

        <div className="px-6 md:px-12">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_14rem] gap-12">
            <article ref={articleRef} className="min-w-0 -mx-6 md:-mx-12">
              <Section
                id="the-questions"
                number="01"
                title="The questions it exists to answer"
                keyLine="Four questions a general manager cannot answer today, and every one of them is a memory question."
                concrete="A guest asked for a quiet room on three consecutive stays, and had to ask again on the fourth."
              >
                <ul className="space-y-4 max-w-3xl list-none p-0 m-0 mb-6">
                  {OPENING_QUESTIONS.map((q) => (
                    <li
                      key={q}
                      className="font-headline italic text-primary text-lg md:text-xl leading-snug border-l border-secondary pl-6"
                    >
                      {q}
                    </li>
                  ))}
                </ul>
                <P>
                  The fourth one separates this from a customer database. A property that cannot tell
                  what a guest said from what a system inferred has already lost the argument it will
                  eventually have with the guest, or with a regulator.
                </P>
              </Section>

              <Section
                id="lineage"
                number="02"
                title="Where it stands, and what the gate is for"
                keyLine="A synthetic proof of concept today, with the data-protection assessment placed before the first real guest datum."
                concrete="It has never run on a real guest, and it will not until that assessment is complete."
              >
                <AnimaRoadmapStrip />
                <Pull>
                  An employee can be told they are being modelled. A guest cannot meaningfully consent
                  to being modelled during a two-night stay.
                </Pull>
                <P>
                  The older version of this was the concierge who never had to ask twice: a guest memory
                  running on one person's recall, with a bus factor of one. So Anima is a guest memory,
                  not a twin.
                </P>
              </Section>

              <Section
                id="memory-layers"
                number="03"
                title="One stay, four memory layers"
                keyLine="Four layers with different lifetimes, because permanence is the default failure."
                concrete="A guest orders a decaf at 11pm before an early flight. Tonight, that matters. Forever, it is a false belief."
              >
                <AnimaStayTimeline />
                <Table
                  caption="The four memory layers of Anima, what each holds and how long it lives"
                  head={["Layer", "Holds", "Lifetime"]}
                  rows={LAYER_ROWS}
                />
                <P>
                  Working memory should use the decaf tonight, so the bar does not ask twice. Semantic
                  memory should never conclude the guest drinks decaf.
                </P>
              </Section>

              <Section
                id="confidence"
                number="04"
                title="Claims carry confidence, and confidence decays"
                keyLine="Nothing is stored as a fact. Everything is a claim with a source, a weight and an age."
                concrete="A preference from 2019 that nobody confirmed since does not outvote something said last week."
              >
                <AnimaClaimCard />
                <P>
                  Weights fall over time unless something renews them.{" "}
                  <Link to="/journal/harnesses-graders-closed-loops#confidence" className={linkCls}>
                    A system that reports a confidence it did not measure is worse than one that reports
                    none
                  </Link>
                  .
                </P>
              </Section>

              <Section
                id="remembering"
                number="05"
                title="Remembering is not neutral"
                keyLine="The stay no longer ends at check-out. Whether to remember is an act of care or an exercise of power."
                concrete="The guest leaves the building and their record stays, in infrastructure that never forgets and never forgives."
              >
                <Pull>
                  Whether to remember is an act of care or an exercise of power.
                </Pull>
                <p className="font-body font-normal text-sm text-on-surface-variant max-w-3xl border-t border-outline-variant pt-4">
                  Edmondo Grassi, <em>The Remains of the Stay: Memory, Identity, and the Afterlife of the
                  Guest</em>, Hotel Yearbook 2026 Technology Edition.
                </p>
              </Section>

              <Section
                id="scope-gated"
                number="06"
                title="Scope-gated, and it never decides"
                keyLine="Every consumer declares which layer it is querying, and no call returns a whole person."
                concrete="The orchestrator asks for semantic-layer preferences relevant to a room assignment, and nothing else."
              >
                <AnimaGateDiagram />
                <P>
                  Anima answers one question, which is who this guest is right now. What to do about it
                  belongs to the orchestrator, with a human validating, the same separation between
                  perception and decision the{" "}
                  <Link to="/aetherix" className={linkCls}>
                    F&amp;B node
                  </Link>{" "}
                  enforces.
                </P>
              </Section>

              <Section
                id="in-the-architecture"
                number="07"
                title="Where it sits in the architecture"
                keyLine="One of four domain nodes, five agents with the orchestrator."
                concrete="Guest experience is not a node: guest.* lives in the shared contract, not behind this one service."
              >
                <P>
                  What Anima knows reaches other nodes only through the orchestrator, one layer at a
                  time. Guest experience itself is not a node, which is why{" "}
                  <code className="font-mono text-sm text-primary">guest.*</code> lives in the shared
                  contract rather than behind this one service.
                </P>
                <P>
                  <Link to="/architecture" className={linkCls}>
                    The architecture note
                  </Link>{" "}
                  has the whole picture, including what the other nodes own and what they refuse.
                </P>
                <div className="max-w-3xl mt-10">
                  <AskRose
                    prompts={ROSE_PROMPTS}
                    label="Ask Rose about this page"
                    note="Rose reads this case study in full. She will not claim this node has run on a real guest."
                  />
                </div>
                <div className="max-w-3xl">
                  <ShareRow
                    title="Anima, the guest memory node"
                    excerpt="Memory that means no guest has to ask twice. A guest memory node that keeps what a guest said and what happened, without watching."
                    mirror="/anima.md"
                  />
                  <p className="mt-5 font-body font-normal text-sm text-on-surface-variant">
                    © Ivan de Murard. All rights reserved.
                  </p>
                </div>
              </Section>

            </article>

            <div className="hidden lg:block">
              <JournalToc items={toc} />
            </div>
          </div>
        </div>
      </div>
      <ClosingContact room="anima" />
    </SiteLayout>
  );
};

export default Anima;
