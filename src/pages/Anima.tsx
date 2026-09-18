// Source of truth for facts (status, layers, gating). If you change facts here,
// also update public/anima.md.
import { useRef, type ReactNode } from "react";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { CaseAnchors } from "@/components/case/CaseAnchors";
import { JournalToc } from "@/components/reading/JournalToc";
import { ReadingProgress } from "@/components/reading/ReadingProgress";
import { HeadingAnchor } from "@/components/reading/HeadingAnchor";
import { useHeadingToc } from "@/components/reading/useHeadingToc";
import { SectionKey } from "@/components/journal/SectionKey";
import { AskRose } from "@/components/journal/AskRose";
import { ShareRow } from "@/components/journal/ShareRow";
import { EntryActions } from "@/components/journal/EntryActions";

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
  "On the Anima case study: why is production gated behind a data-protection assessment?",
  "On the Anima case study: what stops a consumer from asking for everything known about a guest?",
  "On the Anima case study: how is this different from a personalisation engine?",
];

const Anima = () => {
  const articleRef = useRef<HTMLElement>(null);
  const toc = useHeadingToc(articleRef);

  return (
    <SiteLayout title="Anima">
      <Seo
        title="Anima, the Guest Node of the Hospitality Agentic Mesh"
        description="Memory that makes every guest a regular. A guest memory node that anticipates needs, learns from every stay, and improves operations without watching."
        path="/anima"
        type="article"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: "Anima",
            headline: "Anima: memory that makes every guest a regular",
            url: "https://ivandemurard.com/anima",
            inLanguage: "en",
            about: [
              "Guest Cognition",
              "Digital Twin",
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
              Memory that makes every guest a regular.
            </p>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "280ms" }}
              className="text-on-surface-variant font-body text-lg max-w-2xl leading-relaxed mb-8"
            >
              A guest memory node that anticipates needs, learns from every stay, and improves
              operations without watching.
            </p>
            <span
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "360ms" }}
              className="inline-block rounded-sm border border-outline bg-surface-container-low px-4 py-2 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant"
            >
              Synthetic proof of concept · production gated behind a data-protection assessment
            </span>
            <div data-reveal-child style={{ ["--reveal-delay" as string]: "420ms" }} className="mt-8">
              <EntryActions title="Anima" markdownPath="/anima.md" variant="case" />
            </div>
          </div>
        </Reveal>

        <CaseAnchors current="anima" more={{ to: "/architecture", text: "How the nodes fit together: the architecture note" }} />

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
                <P>
                  This node did not start from a feature list. It started from four questions that a
                  general manager can ask out loud and nobody in the building can answer.
                </P>
                <ul className="space-y-4 max-w-3xl list-none p-0 m-0 mb-8">
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
                  The fourth is the one that separates this from a customer database. A property that
                  cannot tell what a guest said from what a system inferred about them has already lost
                  the argument it will eventually have to win, with the guest or with a regulator.
                </P>
              </Section>

              <Section
                id="lineage"
                number="02"
                title="The lineage: from modelling buildings to modelling relationships"
                keyLine="Digital twins model assets. The interesting extension is toward people, and the guest case is the hard half of it."
                concrete="The concierge retires, and every regular becomes a stranger again on the same Monday."
              >
                <P>
                  Digital twins started with assets. A building, a chiller, an engine: model the thing,
                  simulate it, act before it fails. Hospitality adopted that version and largely stopped
                  there, with predictive maintenance, refurbishment run in software before the work
                  starts, and energy optimisation.
                </P>
                <P>
                  The interesting extension is toward people. Research on{" "}
                  <a
                    href="https://pmc.ncbi.nlm.nih.gov/articles/PMC13078991/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkCls}
                  >
                    human-centered digital twins in hospitality
                  </a>{" "}
                  models the <em>employee</em>, their behaviour, performance and context, and its central
                  design rule is worth borrowing exactly: such a system exists to support human
                  judgement, not to replace it. Read it for what it is, a study of adoption intent across
                  141 hotel employees, not a deployed system.
                </P>
                <P>
                  Anima applies that same shift on the other side of the desk, to the guest relationship.
                  The vocabulary is tempting, since calling it a guest cognition twin makes the
                  positioning write itself, but the two are not symmetrical, and the asymmetry is the
                  whole design problem.
                </P>
                <Pull>
                  An employee can be told they are being modelled. A guest cannot meaningfully consent
                  to being modelled during a two-night stay.
                </Pull>
                <P>
                  An employee can be consulted, they can refuse, and their representation is part of
                  their working conditions and is negotiated as such. A guest came to sleep somewhere.
                  Whatever is built about them has to be defensible without their participation, which
                  is a far harder constraint than the employee case and one the research does not have
                  to solve.
                </P>
                <P>
                  There is an older version of this. The concierge who knew that Mr Fontaine takes the
                  corner table and never asks twice was a human-centered twin running on one person's
                  memory, and it had a bus factor of one. It left when they left. That is the same loss{" "}
                  <Link to="/lore" className={linkCls}>
                    Lore
                  </Link>{" "}
                  addresses for technical expertise, one industry over. Anima is the attempt to make
                  being a regular a property of the house rather than of one employee's recall, without
                  the house turning into an apparatus that watches.
                </P>
              </Section>

              <Section
                id="memory-layers"
                number="03"
                title="What it is: four memory layers with different lifetimes"
                keyLine="Not one database with a timestamp column. Four layers, each with its own lifetime, because permanence is the default failure."
                concrete="A guest orders a decaf at 11pm before an early flight. Tonight, that matters. Forever, it is a false belief."
              >
                <Table
                  caption="The four memory layers of Anima, what each holds and how long it lives"
                  head={["Layer", "Holds", "Lifetime"]}
                  rows={LAYER_ROWS}
                />
                <Pull>
                  Temporal separation is the whole design. Most guest-AI failures come from treating
                  everything as permanent: a one-off request during a difficult stay becomes a permanent
                  label, and nobody can say why the system believes it.
                </Pull>
                <P>
                  The decaf is the shortest example. A guest orders one at 11pm because they have an
                  early flight. Working memory should use it tonight, so the bar does not ask twice.
                  Semantic memory should never conclude they drink decaf. One database with a timestamp
                  column collapses those two into a single fact, and the fact outlives the reason for it.
                </P>
              </Section>

              <Section
                id="confidence"
                number="04"
                title="Claims carry confidence, and confidence decays"
                keyLine="Nothing is stored as a fact. Everything is a claim with a weight, a source and an age."
                concrete="A preference from 2019 that nobody confirmed since does not outvote something said last week."
              >
                <P>
                  Nothing in Anima is stored as a fact. Everything is a claim with a weight, a source and
                  an age. "Prefers a high floor" told to a receptionist once is not the same object as
                  the same preference confirmed across four stays, and neither is the same as one
                  inferred from behaviour.
                </P>
                <P>
                  Weights fall over time unless something renews them. A preference from 2019 that nobody
                  has confirmed since should not outvote something said last week, and a system that
                  cannot express that difference will assert both with the same face.
                </P>
                <P>
                  This is where the honesty rule from the rest of this work applies:{" "}
                  <Link to="/journal/harnesses-graders-closed-loops#confidence" className={linkCls}>
                    a system that reports a confidence it did not measure is worse than one that reports
                    none
                  </Link>
                  . Inferred weights are marked as inferred, and corroboration is counted rather than
                  claimed.
                </P>
              </Section>

              <Section
                id="remembering"
                number="05"
                title="Remembering is not neutral"
                keyLine="The stay no longer ends at check-out. Whether to remember is an act of care or an exercise of power."
                concrete="The guest leaves the building and their record stays, in infrastructure that never forgets and never forgives."
              >
                <P>
                  Edmondo Grassi, writing in the Hotel Yearbook, puts it directly: the stay no longer
                  ends at check-out, it merely changes form. The guest leaves the building and their
                  record migrates into infrastructure that remembers with perfect precision.
                </P>
                <P>
                  This was always a craft of memory. The concierge who anticipates, the maître d'hôtel who
                  recalls a wine. But human memory came with forgetting and forgiveness built in. What
                  replaces it knows neither. The asymmetry is new: the system remembers the guest better
                  than the guest remembers themselves.
                </P>
                <Pull>
                  His question is the right one, and it is not rhetorical: whether to remember is an act
                  of care or an exercise of power.
                </Pull>
                <P>
                  The answer cannot be a values statement. It has to be in the data model, or it is
                  decoration. Decay on every claim, layers that expire by design, inference marked as
                  inference, and a scope gate that makes "give me everything about this guest" an
                  impossible request rather than a discouraged one.
                </P>
                <p className="font-body font-light text-sm text-on-surface-variant max-w-3xl border-t border-outline-variant pt-4">
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
                <P>
                  Any consumer must declare which layer it is querying. There is no call that returns
                  everything known about a person, which is a structural choice rather than a policy one:
                  a boundary that depends on people asking politely is not a boundary.
                </P>
                <P>
                  And Anima answers one question only, which is who this guest is right now. What to do
                  about it belongs to the orchestrator, with a human validating. Same separation between
                  perception and decision the{" "}
                  <Link to="/aetherix" className={linkCls}>
                    F&amp;B node
                  </Link>{" "}
                  enforces, for the same reason: a component that both perceives and acts arbitrates
                  privately, and the arbitration stops being reviewable.
                </P>
                <P>
                  Concretely, the orchestrator asks for semantic-layer preferences relevant to a room
                  assignment. It does not, and cannot, ask for the guest's full history.
                </P>
              </Section>

              <Section
                id="where-it-stands"
                number="07"
                title="Where it stands, honestly"
                keyLine="Built, evaluated on synthetic data, and deliberately not switched on."
                concrete="It has never run on a real guest, and it will not until a formal data-protection assessment is complete."
              >
                <P>
                  Synthetic proof of concept. Four-layer memory implemented, working MCP server,
                  evaluated on a synthetic cohort. It has never run on a real guest and it will not until
                  a formal data-protection assessment is complete.
                </P>
                <P>
                  That gate is not compliance theatre or a schedule risk. Inferred state about a person is
                  sensitive personal data, and a guest cognition system a hotel cannot lawfully deploy is
                  worth nothing however good the architecture is. Built first, cleared later is the wrong
                  order here, and it is the order that produces systems nobody can switch on.
                </P>
                <P>
                  Shipped as a prototype at an Anthropic hackathon in June 2026. Production is phase 4.
                </P>
              </Section>

              <Section
                id="in-the-mesh"
                number="08"
                title="Where it sits in the mesh"
                keyLine="One node among four. It owns the guest relationship and nothing else."
                concrete="Guest experience is not a node: guest.* lives in the shared contract, not behind this one service."
              >
                <P>
                  Anima is one node among four. It owns the guest relationship and nothing else, so no
                  pricing, no orchestration, no action. Guest experience itself is not a node: it is a
                  signal that crosses every part of the mesh, which is why{" "}
                  <code className="font-mono text-sm text-primary">guest.*</code> lives in the shared
                  contract rather than behind this one service.
                </P>
                <P>
                  Part of the Hospitality Agentic Mesh:{" "}
                  <Link to="/architecture" className={linkCls}>
                    the architecture note
                  </Link>{" "}
                  explains how the five agents divide the work.
                </P>
                <P>
                  <Link to="/architecture" className={linkCls}>
                    The architecture note
                  </Link>{" "}
                  has the whole picture, including what the other nodes own and what they refuse.{" "}
                  <Link to="/aetherix" className={linkCls}>
                    Aetherix
                  </Link>{" "}
                  is the node that consumes what Anima knows.
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
                    title="Anima, the guest node"
                    excerpt="Memory that makes every guest a regular. A guest memory node that anticipates needs, learns from every stay, and improves operations without watching."
                    mirror="/anima.md"
                  />
                  <p className="mt-5 font-body font-light text-sm text-on-surface-variant">
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
    </SiteLayout>
  );
};

export default Anima;
