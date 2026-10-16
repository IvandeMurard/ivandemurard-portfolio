import { useRef } from "react";
import { JournalToc } from "@/components/reading/JournalToc";
import { useHeadingToc } from "@/components/reading/useHeadingToc";
import { ReadingProgress } from "@/components/reading/ReadingProgress";
import { AETHERIX_ANCHORS } from "@/content/systems";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CaseAnchors } from "@/components/case/CaseAnchors";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { SectionDivider } from "@/components/SectionDivider";
import { SOCIAL_LINKS } from "@/content/site";
import { Term } from "@/components/Term";
import { EntryActions } from "@/components/journal/EntryActions";
import { AetherixArchitectureDiagram } from "@/components/atherix/AetherixArchitectureDiagram";
import { AetherixDailyReceipt } from "@/components/atherix/AetherixDailyReceipt";
import { AetherixDisclosure } from "@/components/atherix/AetherixDisclosure";
import { AetherixLoopCards } from "@/components/atherix/AetherixLoopCards";
import { AetherixMeshDiagram } from "@/components/atherix/AetherixMeshDiagram";
import { AetherixPhaseTimeline } from "@/components/atherix/AetherixPhaseTimeline";
import { AetherixRelationshipFigure } from "@/components/atherix/AetherixRelationshipFigure";
import { AetherixStackChips } from "@/components/atherix/AetherixStackChips";
import { AetherixWhatRemainsPrivate } from "@/components/atherix/AetherixWhatRemainsPrivate";

const DESCRIPTION = "Aetherix is an F&B agent for boutique hotels: one WhatsApp message a day, the manager's reply, and the outcome recorded next to it. Built and tested on sandbox and public data. No hotel connected yet.";

const ALREADY_DOES = [
  "States its drivers the evening before, then reports its own miss the next morning, in plain language.",
  "Rejected an implausible POS figure (850 covers, injected as a test) instead of learning from it.",
  "When recent data diverges sharply from history, says so in the message and asks the manager to double-check, instead of sending a confident number.",
  "After a simulated 25% jump in demand, weekly recalibration cut the forecast error from 15.9% to 12.3%.",
  "Stores every recommendation next to what actually happened, with the manager's override recorded beside it.",
  "Blocks its own merges on evaluation exit codes; every guardrail trip carries a machine-readable reason.",
];

const HOW_BUILT = [
  ["Spec before code, with the BMAD method.", "Every feature follows the path of a real product team: product requirements, architecture, epics, then one written story per change. Each step is run by a dedicated AI role: analyst, product manager, architect, scrum master, developer, QA. Code comes last."],
  ["I direct the agents; I own the result.", "AI agents build from those stories, inside the decisions I set for them (34 so far). I review what they deliver and decide what ships."],
  ["Nothing merges without passing its tests.", "A fixed set of real-world scenarios checks every change. If quality drops, the change is blocked automatically."],
  ["A weekly self-audit.", "Every Monday, an agent checks that what the project claims still matches what it does, and proposes corrections for me to approve."],
  ["Honest about what is unfinished.", "Every component is labelled Built, Synthetic PoC, Design or Research. No demo dressed up as a product."],
];

const PROBLEM_PAINS = [
  "Persistent over or under-staffing",
  "Avoidable food waste",
  "Reactive decision-making instead of anticipation",
  "Slow onboarding and inconsistent execution across properties",
];

const DECISIONS = [
  ["1", "Distribution before design", "A hotel floor has no time for a new tool. So the product plugs into the PMS and is built to be listed where hotels already pick their integrations"],
  ["2", "F&B first", "A covers forecast has a result the next morning. It can be checked"],
  ["3", "WhatsApp as the only surface", "It shows the recommendation, keeps a human line to the manager, and records the reply the agent learns from"],
  ["4", "Three parties, not one customer", "The F&B manager uses it. Hotel management pays. The PMS distributes"],
  ["5", "Pricing on results, to start", "With no track record, the builder carries the adoption risk. The later model is undecided"],
];

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
    body: "hotel_id scoped at every layer (RLS, Python guards, MCP token binding), resolved server-side, never a tool input. Read-only PMS access. GDPR: Supabase EU, HiveMemory is anonymized aggregates only.",
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
    a: "Five specialized MCP-native agents, each with a strict bounded context: Aetherix (F&B execution), Tacet (environmental signal), Anima (guest memory, synthetic PoC), Peritia (house knowledge, Design), Orchestrator (supervisory routing, Design, proto-stub). No shared code, no monolith to displace. Aetherix executes, it does not orchestrate.",
  },
  {
    q: "How is multi-tenant security handled?",
    a: "hotel_id is scoped at every layer (Postgres RLS, Python guards, MCP token binding), resolved server-side, never accepted as a tool input. PMS access is read-only. Data residency: Supabase EU. HiveMemory holds anonymized aggregates only, no cross-tenant raw data.",
  },
  {
    q: "How do I pilot Aetherix?",
    a: "Book a call. No pilot partner is signed and no go-live date is set. The first pilot is meant for a hotel running Apaleo. Pricing on results is the entry model; what follows is undecided.",
  },
];

const SECTIONS = [
  { id: "in-one-minute", label: "In one minute" },
  { id: "the-problem", label: "The problem" },
  { id: "product-strategy", label: "Product strategy" },
  { id: "how-it-works", label: "How it works" },
  { id: "what-it-does-today", label: "What it does today" },
  { id: "where-it-stands", label: "Where it stands" },
  { id: "how-its-built", label: "How it's built" },
  { id: "under-the-hood", label: "Under the hood" },
  { id: "talk-about-a-pilot", label: "Talk about a pilot" },
];

const linkCls = "text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity";
const sectionCls = "px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24";
const titleCls = "font-headline italic text-3xl md:text-4xl text-primary leading-tight mb-6";
const leadCls = "font-body font-semibold text-primary text-lg md:text-xl leading-relaxed max-w-3xl mb-8";
const subheadCls = "font-headline italic text-2xl md:text-3xl text-primary leading-tight mb-5";
const tableWrapCls = "max-w-5xl overflow-x-auto rounded-sm border border-outline-variant bg-surface-container-lowest";
const thCls = "px-4 py-3 font-label uppercase tracking-[0.16em] text-[10px] text-secondary text-left";
const tdCls = "px-4 py-4 text-sm text-on-surface-variant leading-relaxed align-top";

const SectionHeading = ({ id, title }: { id: string; title: string }) => (
  <h2 id={id} className={titleCls}>{title}</h2>
);

const Atherix = () => {
  const articleRef = useRef<HTMLElement>(null);
  const toc = useHeadingToc(articleRef);
  return (
  <SiteLayout title="Aetherix, the F&B agent for boutique hotels">
    <ReadingProgress targetRef={articleRef} />
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
          dateModified: "2026-10-07",
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
    <div className="pt-32">
      <Reveal as="header" className="px-6 md:px-12 mb-12 md:mb-16">
        <div className="max-w-screen-2xl mx-auto">
          <div data-reveal-child className="mb-10 md:mb-12">
            <span className="text-secondary font-label uppercase tracking-[0.2em] text-[10px] mb-5 block">Case study · Hospitality Multi-Agent Architecture</span>
            <h1 className="headline-ink font-headline text-4xl md:text-6xl lg:text-7xl text-primary italic leading-[0.98] mb-5">Aetherix</h1>
            <p className="font-headline italic text-primary text-2xl md:text-3xl max-w-3xl leading-tight">The F&amp;B agent for boutique hotels.</p>
          </div>
          <p data-reveal-child className="text-on-surface-variant font-body text-lg max-w-2xl leading-relaxed mb-10 md:mb-12">One message a day in WhatsApp. The manager replies. The outcome is recorded next to it.</p>
          <dl data-reveal-child className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 max-w-3xl font-body text-sm leading-relaxed text-on-surface-variant">
            <dt className="text-secondary">Type</dt><dd>AI agent · Boutique hotel operations · 2026</dd>
            <dt className="text-secondary">Role</dt><dd>Product Builder and AI Agent Designer, solo</dd>
            <dt className="text-secondary">Status</dt><dd>Built. Running on sandbox and public data. No hotel connected yet.</dd>
          </dl>
          <div data-reveal-child className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link to="/architecture" className={linkCls}>The architecture</Link>
            <a href="https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture" target="_blank" rel="noopener noreferrer" className={linkCls}>GitHub</a>
            <a href={SOCIAL_LINKS.schedule} target="_blank" rel="noopener noreferrer" className={linkCls}>Book a call</a>
          </div>
          <div data-reveal-child className="mt-12 md:mt-14"><EntryActions title="Aetherix" markdownPath="/aetherix.md" variant="case" /></div>
        </div>
      </Reveal>
      <div className="px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_14rem] gap-12">
      <article ref={articleRef} className="min-w-0 -mx-6 md:-mx-12">
      <SectionDivider label="In one minute" index="01" />
      <Reveal as="section" id="in-one-minute" className={sectionCls}>
        <div className="max-w-screen-2xl mx-auto">
          <SectionHeading id="in-one-minute-heading" title="In one minute" />
          <div className={tableWrapCls}>
            <table className="w-full border-collapse"><tbody>
              {[
                ["For", "F&B managers in independent boutique hotels"],
                ["Does", <>Sends tomorrow's <Term id="covers">covers</Term> and staffing the evening before, then records what happened</>],
                ["Where", "WhatsApp. No dashboard, no training"],
                ["Plugs into", <>The <Term id="pms">PMS</Term>, through Apaleo's open API</>],
                ["Next", "A first pilot hotel running Apaleo"],
              ].map(([label, value]) => <tr key={String(label)} className="border-b border-outline-variant last:border-b-0"><th scope="row" className={`${thCls} w-32`}>{label}</th><td className={tdCls}>{value}</td></tr>)}
            </tbody></table>
          </div>
        </div>
      </Reveal>

      <SectionDivider label="The problem" index="02" />
      <Reveal as="section" id="the-problem" className={sectionCls}>
        <div className="max-w-screen-2xl mx-auto">
          <SectionHeading id="the-problem-heading" title="The problem" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-6">
          <p className={leadCls}>What a hotel knows about its own service lives in a manager's head, and leaves with them.</p>
          <p className="max-w-3xl text-on-surface-variant leading-relaxed">The bottleneck is not data, it is synthesis: combining occupancy and sales history with weather and local events into one recommendation for this property.</p>
          </div>
          <div className="min-w-0 lg:col-span-6">
          <p className="mb-4 text-on-surface-variant">The result, day to day:</p>
          <ul className="max-w-3xl list-disc space-y-3 pl-5 text-on-surface-variant marker:text-secondary">{PROBLEM_PAINS.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          </div>
        </div>
      </Reveal>

      <SectionDivider label="Product strategy" index="03" />
      <Reveal as="section" id="product-strategy" className={sectionCls}>
        <div className="max-w-screen-2xl mx-auto">
          <SectionHeading id="product-strategy-heading" title="Product strategy" />
          <p className={leadCls}>Understand a property the way its manager does, and measure every recommendation against what happened.</p>
          <p className="mb-6 max-w-3xl text-on-surface-variant">Five decisions follow from that.</p>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7"><div className={tableWrapCls}><table className="w-full border-collapse"><thead><tr className="border-b border-outline"><th className={thCls}>#</th><th className={thCls}>Decision</th><th className={thCls}>Why</th></tr></thead><tbody>{DECISIONS.map(([n, decision, why]) => <tr key={n} className="border-b border-outline-variant last:border-b-0"><td className={tdCls}>{n}</td><th scope="row" className={`${tdCls} font-semibold text-primary text-left`}>{decision}</th><td className={tdCls}>{why}</td></tr>)}</tbody></table></div></div>
          <div className="min-w-0 lg:col-span-5"><AetherixRelationshipFigure /></div>
          </div>
          <h3 className={`${subheadCls} mt-10`}>Unproven</h3>
          <ul className="max-w-3xl list-disc space-y-3 pl-5 text-on-surface-variant marker:text-secondary">
            <li>No hotel or PMS has validated this route yet.</li>
            <li>The platform could build the same thing.</li>
            <li>Pricing on labor cost needs payroll data the PMS does not hold.</li>
          </ul>
        </div>
      </Reveal>

      <SectionDivider label="How it works" index="04" />
      <Reveal as="section" id="how-it-works" className={sectionCls}>
        <div className="max-w-screen-2xl mx-auto">
          <SectionHeading id="how-it-works-heading" title="How it works" />
          <p className={leadCls}>Every day adds one record: what was recommended, what the manager said, what happened.</p>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
          <h3 className={subheadCls}>The daily loop</h3>
          <AetherixLoopCards />
          <p className="mt-8 max-w-3xl text-sm text-on-surface-variant">Free-text replies are not used yet. Whether the agent gets sharper over time is what a pilot would test.</p>
          </div>
          <div className="min-w-0 lg:col-span-5">
          <h3 className={subheadCls}>What the manager receives</h3>
          <AetherixDailyReceipt />
          </div>
          </div>
        </div>
      </Reveal>

      <SectionDivider label="What it does today" index="05" />
      <Reveal as="section" id="what-it-does-today" className={sectionCls}>
        <div className="max-w-screen-2xl mx-auto">
          <SectionHeading id="what-it-does-today-heading" title="What it does today" />
          <p className={leadCls}>One output runs daily. Two are hypotheses a pilot would test.</p>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
          <h3 className={subheadCls}>Already working</h3>
          <ul className="max-w-3xl list-disc space-y-3 pl-5 text-on-surface-variant marker:text-secondary">{ALREADY_DOES.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="mt-8 font-label text-[10px] uppercase tracking-[0.18em] text-secondary">Sandbox data, real mechanics, deterministic reruns.</p>
          </div>
          <div className="min-w-0">
          <h3 className={subheadCls}>Three outputs</h3>
          <div className={tableWrapCls}><table className="w-full border-collapse"><thead><tr className="border-b border-outline"><th className={thCls}>Output</th><th className={thCls}>State</th></tr></thead><tbody>{[
            ["Tomorrow's covers, with confidence and reasons", "Running daily on sandbox data"],
            ["Staffing that fits, approved or overridden by the manager", "Pilot hypothesis"],
            ["Less waste, by flagging over-ordering before purchase", "Target outcome"],
          ].map(([output, state]) => <tr key={output} className="border-b border-outline-variant last:border-b-0"><th scope="row" className={`${tdCls} font-semibold text-primary text-left`}>{output}</th><td className={tdCls}>{state}</td></tr>)}</tbody></table></div>
          </div>
          </div>
        </div>
      </Reveal>

      <SectionDivider label="Where it stands" index="06" />
      <Reveal as="section" id="where-it-stands" className={sectionCls}>
        <div className="max-w-screen-2xl mx-auto">
          <SectionHeading id="where-it-stands-heading" title="Where it stands" />
          <p className={leadCls}>The loop is built and testable. The forecast is not yet proven on hotels.</p>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
          <div className={`${tableWrapCls} mb-8`}><table className="w-full border-collapse"><tbody>{[
            ["Hotels connected", "None. No pilot partner signed, no go-live date"],
            ["Forecast test", "Public data, 30 restaurants. Beats a simple \"same weekday last week\" guess on average. Matches it on a typical day. Slightly behind it for next-day forecasts, the horizon the product uses"],
            ["Limit of that test", "Restaurants, not hotels. No occupancy data, the signal the product relies on"],
            ["What is solid today", "The loop: recommendation, reply, outcome, and the checks that guard them"],
          ].map(([label, value]) => <tr key={label} className="border-b border-outline-variant last:border-b-0"><th scope="row" className={`${thCls} w-40`}>{label}</th><td className={tdCls}>{value}</td></tr>)}</tbody></table></div>
          <AetherixDisclosure title="The numbers"><p className="max-w-3xl text-sm leading-relaxed text-on-surface-variant">Kaggle Recruit, 30 Japanese restaurants out of 829, 1,193 scored points, deterministic rerun. Prophet against a naive same-weekday baseline: mean MAPE 49.71% vs 55.86%, passing the pre-set 5-point rule. MdAPE 27.0% vs 27.6%. At J+1, 28.5% vs 27.9%. A gradient-boosted model reaches 25.6% on the median. The protocol was not pre-registered for this run.</p></AetherixDisclosure>
          </div>
          <div className="min-w-0">
          <h3 className={subheadCls}>Product vision</h3>
          <p className="max-w-3xl text-on-surface-variant leading-relaxed">Today each hotel learns from its own history. The longer-term idea is that independent hotels learn from each other through HiveMemory, a layer of shared anonymised patterns, and get the reach of a group without joining one.</p>
          <span className="mt-5 inline-block rounded-sm border border-outline bg-surface-container-low px-4 py-2 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Research, not built</span>
          </div>
          </div>
          <h3 className={`${subheadCls} mt-12`}>Roadmap</h3>
          <AetherixPhaseTimeline />
        </div>
      </Reveal>

      <SectionDivider label="How it's built" index="07" />
      <Reveal as="section" id="how-its-built" className={sectionCls}>
        <div className="max-w-screen-2xl mx-auto">
          <SectionHeading id="how-its-built-heading" title="How it's built" />
          <p className={leadCls}>Not vibe-coded. Specified, reviewed and tested before anything ships.</p>
          <ul className="max-w-3xl list-disc space-y-4 pl-5 text-on-surface-variant leading-relaxed marker:text-secondary">{HOW_BUILT.map(([label, body]) => <li key={label}><strong className="font-semibold text-primary">{label}</strong> {body}</li>)}</ul>
        </div>
      </Reveal>

      <SectionDivider label="Under the hood" index="08" />
      <Reveal as="section" id="under-the-hood" className={sectionCls}>
        <div className="max-w-screen-2xl mx-auto">
          <SectionHeading id="under-the-hood-heading" title="Under the hood" />
          <p className={leadCls}>For the technical reader: how it is built, and how it is kept honest.</p>
          <h3 className={subheadCls}>Architecture</h3>
          <p className="mb-8 max-w-3xl text-on-surface-variant leading-relaxed">Aetherix is one of five agents. Each owns one job and talks to the others only through <Term id="mcp">MCP</Term>. Aetherix executes F&amp;B. It does not orchestrate.</p>
          <AetherixMeshDiagram />
          <p className="my-8 text-sm text-on-surface-variant"><Link to="/anima" className={linkCls}>Anima, the guest memory node, has its own case study</Link>.</p>
          <AetherixDisclosure title="Pipeline and stack">
            <p className="mb-6 max-w-3xl text-sm leading-relaxed text-on-surface-variant">Apaleo (OAuth2 and MCP read) + Open-Meteo + PredictHQ → Prophet forecast and staffing → pgvector memory recall (OperationalMemory + HiveMemory cold-start, research) → Claude Sonnet reasoning → WhatsApp or Email.</p>
            <div className="mb-8 overflow-hidden rounded-sm border border-outline-variant bg-surface"><AetherixArchitectureDiagram /></div>
            <AetherixStackChips />
          </AetherixDisclosure>
          <h3 className={`${subheadCls} mt-10`}>Built to be trusted</h3>
          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">{TRUST.map((item) => <div key={item.title} className="flex flex-col gap-4 rounded-sm border border-outline-variant bg-surface-container-low p-6 md:p-8"><Icon name={item.icon} className="text-3xl text-secondary" /><h4 className="font-headline text-2xl italic leading-tight text-primary">{item.title}</h4><p className="text-sm leading-relaxed text-on-surface-variant">{item.body}</p></div>)}</div>
          <AetherixDisclosure title="More">
            <AetherixWhatRemainsPrivate />
            <div className="mt-8 max-w-3xl text-sm leading-relaxed text-on-surface-variant">
              <p><Link to="/lore" className={linkCls}>Lore</Link>, in aviation maintenance, shares this architecture and cannot close the same loop. Nothing there tells the system whether an observation was right, and the moment a technician escalates the counterfactual disappears. Aetherix has an outcome to compare against; that difference decides how much each product is allowed to learn on its own.</p>
              <p className="mt-5">The evaluation vocabulary behind these gates, harnesses, graders, acceptance tiers and closed loops is in <Link to="/journal/harnesses-graders-closed-loops" className={linkCls}>Evaluating LLM agents: how would you know it had stopped working?</Link></p>
            </div>
          </AetherixDisclosure>
        </div>
      </Reveal>

      <CaseAnchors current="atherix" entries={AETHERIX_ANCHORS} columns={4} more={{ to: "/architecture", text: "How these systems fit together: the architecture note" }} />

      <SectionDivider label="Talk about a pilot" index="09" />
      <Reveal as="section" id="talk-about-a-pilot" className="px-6 md:px-12 mb-24 md:mb-32 scroll-mt-24">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading id="talk-about-a-pilot-heading" title="Talk about a pilot" />
          <p className="text-on-surface-variant leading-relaxed">Solo builder. Open to a first pilot hotel running Apaleo, and to product conversations.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild><a href={SOCIAL_LINKS.schedule} target="_blank" rel="noopener noreferrer"><Icon name="event" />Book a call</a></Button>
            <Button asChild variant="outline"><a href="https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture" target="_blank" rel="noopener noreferrer"><Icon name="hub" />Architecture repo</a></Button>
            <Button asChild variant="outline"><Link to="/tacet"><Icon name="arrow_forward" />Read Tacet</Link></Button>
          </div>
        </div>
      </Reveal>
      </article>
      <div className="hidden lg:block"><JournalToc items={toc} /></div>
      </div>
      </div>
    </div>
  </SiteLayout>
  );
};

export default Atherix;