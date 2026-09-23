// Source of truth for facts (statuses, boundaries, links).
// If you change facts here, also update public/architecture.md.
import { useRef, type ReactNode } from "react";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { JournalToc } from "@/components/reading/JournalToc";
import { ReadingProgress } from "@/components/reading/ReadingProgress";
import { HeadingAnchor } from "@/components/reading/HeadingAnchor";
import { useHeadingToc } from "@/components/reading/useHeadingToc";
import { SectionKey } from "@/components/journal/SectionKey";
import { AskRose } from "@/components/journal/AskRose";
import { ShareRow } from "@/components/journal/ShareRow";
import { EntryActions } from "@/components/journal/EntryActions";
import { McpEndpoint } from "@/components/McpEndpoint";

import { MeshBlueprint } from "@/components/architecture/MeshBlueprint";
import { MeshRail } from "@/components/architecture/MeshRail";

const REPO = "https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture";

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



const LEARNING_ROWS: { node: string; feedback: string; consequence: string }[] = [
  {
    node: "Aetherix",
    feedback: "Manager replies, plus forecast compared against the actual figure",
    consequence: "Can measure itself and gate on the result",
  },
  {
    node: "Tacet",
    feedback: "Rejections of its alerts, per coordinate",
    consequence: "Learns local shielding without ground truth on the outcome",
  },
  {
    node: "Anima",
    feedback: "Guest signals, sparse and regulated",
    consequence: "Learns slowly by design, and must forget on request",
  },
  {
    node: "Orchestrator",
    feedback: "None of its own",
    consequence: "Judged only by whether the nodes it routed to were right",
  },
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

const ROSE_PROMPTS = [
  "On the architecture note: which nodes are actually built today?",
  "On the architecture note: why split this into separate agents instead of one model?",
  "On the architecture note: how is tenancy kept from leaking between properties?",
  "On the architecture note: what does the orchestrator do, and why does it hold no memory?",
];

const Architecture = () => {
  const articleRef = useRef<HTMLElement>(null);
  const toc = useHeadingToc(articleRef);

  return (
    <SiteLayout title="Hospitality Multi-Agent Architecture">
      <Seo
        title="Hospitality Multi-Agent Architecture, an Architecture Note"
        description="Five specialised agents, each owning one bounded context, talking only through MCP. Two are Built, one is a Synthetic PoC, two are Design. This note says which is which, using one shared status vocabulary."
        path="/architecture"
        type="article"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "Hospitality Multi-Agent Architecture",
            description:
              "Architecture note on five specialised hospitality agents: Aetherix, Tacet, Anima, Peritia and an orchestrator, each with one bounded context, communicating only through MCP.",
            url: "https://ivandemurard.com/architecture",
            inLanguage: "en",
            author: { "@type": "Person", name: "Ivan de Murard", url: "https://ivandemurard.com" },
            codeRepository: REPO,
            about: ["Agentic AI", "Model Context Protocol", "Hospitality Operations", "Software Architecture"],
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
              Architecture note
            </span>
            <h1
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "120ms" }}
              className="headline-ink font-headline text-4xl md:text-6xl lg:text-7xl text-primary italic leading-[0.98] tracking-tight mb-6"
            >
              Hospitality Multi-Agent Architecture
            </h1>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "200ms" }}
              className="font-headline italic text-primary text-2xl md:text-3xl max-w-3xl leading-tight mb-6"
            >
              Five specialised agents, each owning one bounded context, talking only through MCP.
            </p>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "280ms" }}
              className="text-on-surface-variant font-body text-lg max-w-2xl leading-relaxed"
            >
              Two are Built, one is a Synthetic PoC, two are Design. This page says which is which,
              using one shared status vocabulary:{" "}
              <a
                href="https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture/blob/main/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                the canonical status enum
              </a>
              .
            </p>
            <div data-reveal-child style={{ ["--reveal-delay" as string]: "360ms" }} className="mt-8">
              <EntryActions
                title="Hospitality Multi-Agent Architecture"
                markdownPath="/architecture.md"
                variant="note"
                ask="explain how the five agents divide responsibility, what talks to what over MCP, and which parts are built versus designed."
              />
            </div>
            <div data-reveal-child style={{ ["--reveal-delay" as string]: "420ms" }} className="mt-8">
              <McpEndpoint
                label="Inspect the work from your own agent"
                note="Five public, read-only tools expose the architecture, its case studies and the Field Notes behind it as structured source material."
              />
            </div>

          </div>
        </Reveal>

        <MeshRail />

        <div className="px-6 md:px-12">
          <div className="max-w-screen-2xl mx-auto">
            <JournalToc items={toc} variant="mobile" />
          </div>
        </div>

        <div className="px-6 md:px-12">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_14rem] gap-12">
            <article ref={articleRef} className="min-w-0 -mx-6 md:-mx-12">
              <Section
                id="why-one-agent-is-not-enough"
                number="01"
                title="Why several agents and not one"
                keyLine="One model that predicts, decides and acts fails in two different ways at once, so the capabilities are split into nodes."
                concrete="A wrong forecast is absorbed by a buffer. A wrong action reaches a guest, a shift roster, or an aircraft."
              >
                <P>
                  The tempting shape is one large model that predicts, decides and acts. It looks
                  elegant on a slide.
                </P>
                <P>
                  It collapses in practice, because forecasting and acting have{" "}
                  <Link to="/journal/agent-boundaries-aetherix" className={linkCls}>
                    different failure modes
                  </Link>
                  , different feedback loops and different audit requirements. A wrong forecast is
                  absorbed by a buffer. A wrong action reaches a guest, a shift roster, or an aircraft.
                  Splitting them is not a technical decision dressed as a product one; it is a product
                  decision that happens to need a specific architecture.
                </P>
                <P>
                  So each capability became a node with a strict boundary, and the boundaries are
                  enforced by the protocol rather than by discipline.
                </P>
              </Section>

              <Section
                id="one-scene-four-signals"
                number="02"
                title="One scene, four signals"
                keyLine="Guest experience is not an agent of its own, because the same twenty minutes belong to four domains at once."
                concrete="Check-in: occupancy, a transit strike outside, a returning guest's last request, and who is on the desk."
              >
                <div className="rounded-sm border border-outline bg-surface-container-low p-5 mb-8 max-w-3xl">
                  <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary block mb-2">
                    Illustration, not a capability
                  </span>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    Nothing in this system performs check-in today. The scene is here because it is the
                    shortest way to show why the boundaries are drawn where they are.
                  </p>
                </div>
                <P>
                  Check-in looks like a process, and optimising it as one gives you the metric a
                  process offers: time to key. A fast, cold arrival is an excellent process and a bad
                  welcome.
                </P>
                <ul className="max-w-3xl mb-6 border-t border-outline-variant">
                  {[
                    ["Tacet", "What is happening outside: a transit strike lands every arrival in the same twenty minutes."],
                    ["Aetherix", "How full the house is tonight, and what that does to the service that follows."],
                    ["Anima", "Whether this guest has stayed before and what they asked for last time. For a first stay: nothing to recall, and it says so."],
                    ["Peritia", "Who is on the desk, how loaded they are, how far into the shift."],
                  ].map(([name, line]) => (
                    <li
                      key={name}
                      className="flex flex-col sm:flex-row sm:gap-6 border-b border-outline-variant py-3"
                    >
                      <span className="font-headline italic text-primary text-lg sm:w-32 shrink-0">
                        {name}
                      </span>
                      <span className="font-body text-sm text-on-surface-variant leading-relaxed">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
                <Pull>
                  This is why guest experience is not an agent of its own. An agent that owned it
                  would have to own all four domains, and an agent that owns everything is not a
                  bounded context.
                </Pull>
                <P>
                  Time to key can be predicted. Whether someone felt welcomed cannot. That gap is a
                  property of the problem, not of the data, and it holds harder at check-out, which
                  carries the payment and weighs most in memory.
                </P>
              </Section>

              <Section
                id="the-nodes"
                number="03"
                title="The five agents"
                keyLine="Four domain agents around one supervisory router, which holds no memory of its own."
                concrete="Select a mark on the figure to read what that agent owns, and what it is not allowed to own."
              >
                <MeshBlueprint />

                <p className="font-headline italic text-primary text-xl md:text-2xl max-w-3xl">
                  Aetherix executes. It does not orchestrate.
                </p>
              </Section>

              <Section
                id="five-rules"
                number="04"
                title="Five rules that hold it together"
                keyLine="The boundaries are enforced by the protocol and by the server, not by anyone remembering to respect them."
                concrete="The property identifier is never a tool argument, so a model has no way to name another property, let alone read it."
              >
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="font-headline italic text-primary text-xl mb-2">
                      One bounded context per node
                    </h3>
                    <p className="font-body text-on-surface-variant leading-relaxed">
                      A node that owns two domains starts arbitrating between them privately, and the
                      arbitration stops being reviewable. Splitting is what keeps a decision attributable
                      to a component. Concretely: Tacet can say a strike will push arrivals into one
                      window, and Aetherix can decide to move two covers of prep forward, but neither can
                      quietly do both and present the result as a single judgement.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-headline italic text-primary text-xl mb-2">
                      MCP is the only doorway
                    </h3>
                    <p className="font-body text-on-surface-variant leading-relaxed">
                      Nodes do not import each other. Every exchange is a tool call, which means every
                      exchange is loggable, auditable and priceable. It also means a node can be replaced
                      without its neighbours knowing. Tacet's rules reach Aetherix as a tool response
                      with a timestamp and a source, not as a shared table.
                    </p>
                    <p className="mt-3 border-l-2 border-outline-variant pl-4 font-body text-sm text-on-surface-variant leading-relaxed">
                      Until the orchestrator is built (Design), Tacet's output reaches Aetherix
                      directly: the one documented exception, non-personal, read-only, logged. Target:
                      every exchange goes through the orchestrator.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-headline italic text-primary text-xl mb-2">
                      Tenancy is resolved server-side, never passed as an argument
                    </h3>
                    <p className="font-body text-on-surface-variant leading-relaxed">
                      The property identifier is established at every layer by the server and is never a
                      tool input. What a model cannot name, it cannot cross. This is the difference
                      between a boundary and a hope: a prompt asking for last week's covers "for the
                      other property" has no argument to fill.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-headline italic text-primary text-xl mb-2">
                      Memory is local first, federated second, and never raw
                    </h3>
                    <p className="font-body text-on-surface-variant leading-relaxed">
                      Each property learns from its own history. Cross-property learning moves only as
                      anonymised aggregates. A thirty-room independent gets the benefit of a network,
                      such as how a rainy Tuesday in the same district moves breakfast covers, without
                      its own covers, guests or prices leaving the building.
                    </p>
                    <p className="mt-3 flex flex-wrap items-baseline gap-2">
                      <span className="inline-flex items-center rounded-sm border border-dashed border-outline px-2 py-0.5 font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
                        Research
                      </span>
                      <span className="font-body text-sm text-on-surface-variant leading-relaxed">
                        Federation: Research, no substrate yet. Local memory is as described.
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-headline italic text-primary text-xl mb-2">
                      A fifth agent is an addition, not a redesign
                    </h3>
                    <p className="font-body text-on-surface-variant leading-relaxed">
                      The contract that governs exchanges between agents was designed to admit staff
                      knowledge: what the people who work in a property know, which nothing captures
                      today. That agent is named Peritia, the trade agent: a house's know-how, held by
                      the house rather than by whoever is on shift. Not started, and no code.
                    </p>
                  </div>


                </div>
              </Section>

              <Section
                id="what-each-node-learns"
                number="05"
                title="What each node is allowed to learn"
                keyLine="Autonomy is earned by feedback: a node that can be measured may adjust itself, one that cannot must be gated."
                concrete="Aetherix compares yesterday's forecast against the actual figure. The orchestrator has no outcome of its own to check."
              >
                <P>
                  The architecture is identical across nodes. What differs is whether reality answers
                  back, and that decides how much autonomy each one earns.
                </P>
                <Table
                  caption="Feedback available to each node, and the autonomy that follows from it"
                  head={["Node", "Feedback available", "Consequence"]}
                  rows={LEARNING_ROWS.map((r) => [r.node, r.feedback, r.consequence])}
                />
                <Pull>
                  A node with an outcome loop can be allowed to adjust itself. A node without one has to
                  be{" "}
                  <Link to="/journal/harnesses-graders-closed-loops" className={linkCls}>
                    gated before it ships
                  </Link>
                  , because nothing downstream will catch it.
                </Pull>
              </Section>

              <Section
                id="where-twins-stop"
                number="06"
                title="Where the sector's twins stop"
                keyLine="Hospitality digital twins model the building. None found models an operational decision before it is taken."
                concrete="Predictive maintenance and energy optimisation are mature. A staffing change simulated in advance is not."
              >
                <P>
                  Digital twins are mature and named elsewhere. Banks run market scenarios on them,
                  Google models its data centres, Amazon its warehouses, and aerospace and automotive
                  have used them for years to retire risk before touching hardware.
                </P>
                <P>
                  In hospitality they exist too, and they model the building: predictive maintenance,
                  refurbishment simulated before the work starts, energy optimisation. Useful, and about
                  walls.
                </P>
                <P>
                  Searching for one that simulates the impact of an <em>operational</em> decision before
                  it is taken, a staffing change, an F&amp;B order, a service adjustment, returns
                  nothing. The sector models its assets and not its arbitrations.
                </P>
                <P>
                  This architecture is not marketed as a twin and does not simulate scenarios today. But cohort
                  matching and the learning engine both point at that gap, and they arrived there from
                  the operational side rather than from the vocabulary. Nothing was found, which is a
                  finding, not a trophy.
                </P>
                <P>Anima included: a guest memory, not a twin.</P>
              </Section>

              <Section
                id="where-it-stands"
                number="07"
                title="Verification and pointers"
                keyLine="The statuses above are the claim. Here is where to check them."
                concrete="The meta-repository holds the contracts; the field note explains how a node earns the right to ship."
              >
                <P>
                  Public meta-repository:{" "}
                  <a href={REPO} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    github.com/IvandeMurard/Hospitality-Multi-agent-Architecture
                  </a>
                  .
                </P>
                <P>
                  The field note{" "}
                  <Link to="/journal/harnesses-graders-closed-loops" className={linkCls}>
                    Evaluating LLM agents: how would you know it had stopped working?
                  </Link>{" "}
                  explains how a system earns the right to ship. This page explains what the systems
                  are. Read that one next if the statuses raised the question of how they are checked.
                </P>
                <div className="max-w-3xl mt-10">
                  <AskRose
                    prompts={ROSE_PROMPTS}
                    label="Ask Rose about this page"
                    note="Rose reads this note in full. She will not claim a node is further along than it is."
                  />
                </div>
                <div className="max-w-3xl">
                  <ShareRow
                    title="Hospitality Multi-Agent Architecture"
                    excerpt="Specialised agents, each owning one bounded context, talking only through MCP. Two are Built, one is a Synthetic PoC, two are Design."
                    mirror="/architecture.md"
                  />
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

export default Architecture;
