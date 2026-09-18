// Source of truth for facts (dates, stack, metrics, status).
// If you change facts here, also update public/aetherix.md and public/llms-full.txt.
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CaseAnchors } from "@/components/case/CaseAnchors";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";
import { SectionDivider } from "@/components/SectionDivider";
import { SOCIAL_LINKS } from "@/content/site";
import { AetherixArchitectureDiagram } from "@/components/atherix/AetherixArchitectureDiagram";
import { AetherixHeroBadges } from "@/components/atherix/AetherixHeroBadges";
import { AetherixMeshDiagram } from "@/components/atherix/AetherixMeshDiagram";
import { AetherixMetricCards } from "@/components/atherix/AetherixMetricCards";
import { AetherixDailyReceipt } from "@/components/atherix/AetherixDailyReceipt";
import { AetherixPhaseTimeline } from "@/components/atherix/AetherixPhaseTimeline";
import { AetherixStackChips } from "@/components/atherix/AetherixStackChips";
import { AetherixLoopCards } from "@/components/atherix/AetherixLoopCards";
import { AetherixTrustFrames } from "@/components/atherix/AetherixTrustFrames";
import { AetherixWhatRemainsPrivate } from "@/components/atherix/AetherixWhatRemainsPrivate";
import { AetherixVideoPlaceholder } from "@/components/atherix/AetherixVideoPlaceholder";
import { AetherixAnimaSpotlight } from "@/components/atherix/AetherixAnimaSpotlight";
import { Term } from "@/components/Term";

const PROJECT_INFO: {
  label: string;
  value: string;
  href?: string;
  wide?: boolean;
  hint?: string;
}[] = [
  { label: "Role", value: "Product Builder & AI Agent Designer (solo)" },
  { label: "Duration", value: "2026, ongoing (validation phase)" },
  { label: "Team", value: "Solo architect & builder" },
  {
    label: "Repository",
    value: "GitHub Repository",
    href: "https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture",
    hint: "Public meta-repo for the Hospitality Agentic Mesh",
  },
  {
    label: "Status",
    value: "Phase 3 · Pilot design partner in recruitment. Go-live targeted end of September. · Staging live on Fly.io (Paris) · Apaleo OAuth + MCP read operational",
    wide: true,
  },
];

const ALREADY_DOES = [
  "States its drivers the evening before, then reports its own miss the next morning, in plain language.",
  "Flagged a corrupted POS export rather than training on it.",
  "Named its own drift after three consecutive misses, and recovered from a 25% regime shift through weekly recalibration.",
  "Stores every recommendation next to what actually happened, with the manager's override recorded beside it.",
  "Blocks its own merges on evaluation exit codes; every guardrail trip carries a machine-readable reason.",
];

const PROBLEM_PAINS = [
  "Persistent over or under-staffing",
  "Avoidable food waste",
  "Reactive decision-making instead of anticipation",
  "Slow onboarding and inconsistent execution across properties",
];

const PROMISES = [
  {
    icon: "restaurant",
    title: "Tomorrow's covers",
    tag: "Running daily",
    body: "Running daily against real data. Operator delivery begins with the pilot. Anticipates how many breakfasts, lunches, dinners to expect, with a confidence score and the drivers behind it.",
  },
  {
    icon: "group_add",
    title: "Staffing that fits",
    tag: "Pilot hypothesis",
    body: "Proposes a shift grid based on occupancy, capture rate history and local context. The manager approves, adjusts or overrides.",
  },
  {
    icon: "eco",
    title: "Less waste",
    tag: "Target outcome",
    body: "Spots over-ordering risk before purchase, with the historical signals that triggered the flag.",
  },
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
    a: "The F&B execution agent for boutique hotels: tomorrow's covers, a staffing grid that fits and less waste, in one WhatsApp message a day with the reasoning attached, as one node of the Hospitality Agentic Mesh.",
  },
  {
    q: "Why memory, not just forecasting?",
    a: "Forecasting is commoditized. The moat is compounding local experience: which Tuesdays spike here, how a conference reshapes breakfast here, how to staff a rainy Sunday here. Aetherix captures that context, learns from every reply, and makes it available at the exact moment a decision is due.",
  },
  {
    q: "How does the closed loop work?",
    a: "Memory recalls what worked here. Prediction proposes tomorrow's covers, staffing and waste risk. Action lands as one WhatsApp message with one-tap accept, modify, or reject. Learning turns that reply into a fresh grain of memory. The day-90 receipt is sharper than the day-7 one.",
  },
  {
    q: "How is Aetherix part of a Mesh?",
    a: "Five specialized MCP-native agents, each with a strict bounded context: Aetherix (F&B execution), Tacet (environmental signal), Anima (guest cognition, synthetic PoC), Peritia (house knowledge, Design), Orchestrator (supervisory routing, Design). No shared code, no monolith to displace. Aetherix executes, it does not orchestrate.",
  },
  {
    q: "How is multi-tenant security handled?",
    a: "hotel_id is scoped at every layer (Postgres RLS, Python guards, MCP token binding), resolved server-side, never accepted as a tool input. PMS access is read-only. Data residency: Supabase EU. HiveMemory holds anonymized aggregates only, no cross-tenant raw data.",
  },
  {
    q: "How do I pilot Aetherix?",
    a: "Book a call. Phase 3 is open to a first design partner running Apaleo. Pilot design partner in recruitment. Go-live targeted end of September. Pricing is outcome-based, we win when you win. Real-world measurement begins with the pilot.",
  },
];

const THESIS = [
  {
    icon: "psychology",
    title: "Understand, like a human",
    body: "Contextual reasoning grounded in each property's history.",
  },
  {
    icon: "monitoring",
    title: "Measure, like a machine",
    body: "Every recommendation is stored next to its real outcome, so the system knows what it said and what happened.",
  },
  {
    icon: "hive",
    title: "Learn, like a network",
    body: "Per-property memory today, federated priors next, to give independents the power of a hive.",
  },
];

const VISION_NODES = [
  { name: "Aetherix", role: "The F&B agent: forecast, staffing, memory.", status: "Built" },
  { name: "Tacet", role: "The environmental-signal agent.", status: "Built" },
  { name: "Anima", role: "The Guest Cognition agent.", status: "Synthetic PoC" },
  { name: "Peritia", role: "The trade agent: house knowledge, what the people who work here know.", status: "Design" },
  { name: "Orchestrator", role: "The supervisory agent.", status: "Design" },
];

const ATHERIX_SECTIONS = [
  { id: "what-it-does", label: "What it does" },
  { id: "thesis", label: "Thesis" },
  { id: "vision", label: "The vision" },
  { id: "problem", label: "Problem" },
  { id: "memory", label: "Memory" },
  { id: "receipt", label: "Daily Receipt" },
  { id: "how", label: "How it works" },
  { id: "trust", label: "Trust" },
  { id: "performance", label: "Performance" },
  { id: "roadmap", label: "Roadmap" },
  { id: "contact", label: "Contact" },
];


const Atherix = () => (
  <SiteLayout title="Aetherix: the F&B execution agent for boutique hotels" sections={ATHERIX_SECTIONS}>
    <Seo
      title="Aetherix, the F&B execution agent for boutique hotels"
      description="Aetherix is the F&B execution agent for boutique hotels: tomorrow's covers, a staffing grid that fits, and less waste, in one WhatsApp message a day with the reasoning attached."
      path="/aetherix"
      type="article"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "Aetherix",
          headline: "Aetherix, the F&B execution agent for boutique hotels",
          description:
            "Aetherix is the F&B execution agent for boutique hotels. It forecasts tomorrow's covers, proposes a staffing grid that fits and flags waste risk, in one WhatsApp message a day with the reasoning attached. Operational memory is the mechanism that makes the forecast specific to one property, not the offer. Aetherix is the F&B node of the Hospitality Agentic Mesh.",
          url: "https://ivandemurard.com/aetherix",
          about: ["Operational Memory", "Organizational Intelligence", "Agentic AI", "Hospitality Operations", "F&B Forecasting", "MCP"],
          keywords:
            "Operational memory, Organizational intelligence, Manager turnover, Hospitality cognition, Agentic AI, MCP, Model Context Protocol, Apaleo, F&B forecasting, Prophet, pgvector, Claude Sonnet, Boutique Hotels",
          creator: { "@type": "Person", name: "Ivan de Murard", url: "https://ivandemurard.com" },
          dateCreated: "2026-01-01",
          dateModified: "2026-06-22",
          codeRepository: "https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture",
          relatedLink: ["https://ivandemurard.com/tacet"],
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ]}
    />
    <div className="pt-32">
      {/* Hero */}
      <Reveal as="header" className="px-6 md:px-12 mb-12 md:mb-16">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-end gap-12 lg:gap-16">
          <div className="flex-1">
            <span
              data-reveal-child
              className="text-secondary font-label uppercase tracking-[0.2em] text-[10px] mb-6 block"
            >
              Case Study / Operations AI
            </span>
            <h1
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "120ms" }}
              className="headline-ink font-headline text-5xl md:text-7xl lg:text-8xl text-primary italic leading-[0.95] tracking-tight mb-6"
            >
              Aetherix
            </h1>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "200ms" }}
              className="font-headline italic text-primary text-2xl md:text-3xl max-w-3xl leading-tight mb-6"
            >
              The F&amp;B execution agent for boutique hotels.
            </p>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "280ms" }}
              className="text-on-surface-variant font-body text-lg max-w-2xl leading-relaxed"
            >
              Tomorrow's covers, a staffing grid that fits, and less waste. One message a day, in WhatsApp, with the
              reasoning attached.
            </p>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "340ms" }}
              className="text-on-surface-variant font-body text-base max-w-2xl leading-relaxed mt-4"
            >
              Aetherix is the food and beverage agent of a five-agent mesh.{" "}
              <Link
                to="/architecture"
                className="text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
              >
                The architecture
              </Link>
            </p>

            <div data-reveal-child style={{ ["--reveal-delay" as string]: "420ms" }} className="mt-8">
              <EntryActions title="Aetherix" markdownPath="/aetherix.md" variant="case" />
            </div>


            <div data-reveal-child style={{ ["--reveal-delay" as string]: "580ms" }}>
              <AetherixHeroBadges />
            </div>
          </div>
          <div className="hidden lg:flex flex-none items-center gap-4 text-secondary italic font-headline text-2xl pb-4">
            <span>Scroll to Explore</span>
            <Icon name="expand_more" className="animate-bounce" />
          </div>
        </div>
      </Reveal>

      <SectionDivider label="What it does" index="01" />

      {/* WHAT IT DOES */}
      <Reveal as="section" id="what-it-does" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-12 md:mb-16">
            <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight">
              What it already does.
            </h2>
            <ul
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "160ms" }}
              className="mt-6 max-w-3xl space-y-3"
            >
              {ALREADY_DOES.map((line) => (
                <li key={line} className="flex gap-3 text-on-surface-variant leading-relaxed">
                  <span aria-hidden="true" className="text-secondary select-none">
                    —
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "280ms" }}
              className="mt-5 font-label uppercase tracking-[0.18em] text-[10px] text-secondary"
            >
              Sandbox data, real mechanics, deterministic reruns.
            </p>
          </div>
          <div className="max-w-2xl mb-10">

            <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight">
              Three promises, one message a day.
            </h2>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "160ms" }}
              className="mt-5 text-on-surface-variant leading-relaxed"
            >
              Two of the three are pilot hypotheses, not measured results. They are the outcomes the live pilot is set
              up to test.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROMISES.map((p, i) => (
              <div
                key={p.title}
                data-reveal-child
                style={{ ["--reveal-delay" as string]: `${200 + i * 120}ms` }}
                className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <Icon name={p.icon} className="text-secondary text-3xl" />
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-outline-variant font-label uppercase tracking-[0.18em] text-[10px] text-secondary">
                    {p.tag}
                  </span>
                </div>
                <h3 className="font-headline italic text-2xl text-primary leading-tight">{p.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <SectionDivider label="Thesis" index="02" />

      {/* THESIS */}
      <Reveal as="section" id="thesis" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-2xl mb-10">
            <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight">
              Understand, measure, learn.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {THESIS.map((t, i) => (
              <div
                key={t.title}
                data-reveal-child
                style={{ ["--reveal-delay" as string]: `${200 + i * 120}ms` }}
                className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col gap-4"
              >
                <Icon name={t.icon} className="text-secondary text-3xl" />
                <h3 className="font-headline italic text-2xl text-primary leading-tight">{t.title}.</h3>
                <p className="text-on-surface-variant leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <SectionDivider label="The vision" index="03" />

      {/* VISION — five agents */}
      <Reveal as="section" id="vision" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <span data-reveal-child className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
            The Hospitality Agentic Mesh
          </span>
          <h2
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "120ms" }}
            className="font-headline italic text-3xl md:text-5xl text-primary mt-4 leading-tight"
          >
            Five agents, honest status.
          </h2>
          <ul data-reveal-child style={{ ["--reveal-delay" as string]: "240ms" }} className="mt-8 space-y-4">
            {VISION_NODES.map((n) => (
              <li
                key={n.name}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-2 border-b border-outline-variant pb-4 last:border-b-0"
              >
                <span className="font-headline italic text-primary text-xl">{n.name}</span>
                <span className="text-on-surface-variant flex-1 min-w-[12rem]">{n.role}</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-label uppercase tracking-[0.18em] text-[10px]">
                  {n.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <CaseAnchors current="atherix" more={{ to: "/architecture", text: "How these systems fit together: the architecture note" }} />

      {/* Project Info */}
      <section className="px-6 md:px-12 mb-12 md:mb-16">
        <div className="max-w-screen-2xl mx-auto border-t border-b border-outline-variant py-10">
          <h3 className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-8">Project Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {PROJECT_INFO.map((info) => (
              <div key={info.label} className={info.wide ? "lg:col-span-2" : ""}>
                <h4 className="text-xs text-on-surface-variant mb-2">{info.label}</h4>
                {info.href ? (
                  <a
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={info.hint}
                    aria-label={info.hint ? `${info.value}, ${info.hint}` : undefined}
                    className="text-sm font-medium text-primary inline-flex items-center gap-1.5 border-b border-secondary hover:border-secondary transition-colors"
                  >
                    {info.value}
                    {info.hint && <Icon name="lock" className="text-xs text-secondary" />}
                    <Icon name="open_in_new" className="text-xs" />
                  </a>
                ) : (
                  <p className="text-sm font-medium text-primary">{info.value}</p>
                )}
                {info.hint && (
                  <p className="mt-1 text-[10px] text-on-surface-variant italic">{info.hint}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSED-LOOP DEMO VIDEO PLACEHOLDER */}
      <Reveal as="section" className="px-6 md:px-12 mb-12 md:mb-16">
        <div className="max-w-5xl mx-auto" data-reveal-child>
          <AetherixVideoPlaceholder />
        </div>
      </Reveal>

      <SectionDivider label="Problem" index="04" />

      {/* PROBLEM — V2 turnover */}
      <Reveal as="section" id="problem" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <span data-reveal-child className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
            Why it exists
          </span>
          <h2
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "120ms" }}
            className="font-headline italic text-3xl md:text-5xl text-primary mt-4 leading-tight"
          >
            Your greatest operational asset walks out the door.
          </h2>
          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "240ms" }}
            className="mt-6 space-y-5 text-on-surface-variant leading-relaxed"
          >
            <p>
              In hospitality, the people who know how the property really runs (which Tuesdays spike, how a local
              conference reshapes breakfast, how to staff a rainy Sunday) carry that knowledge in their heads. When a
              manager leaves, the property starts again from scratch.
            </p>
            <p>
              Combined with the inherent complexity of <Term id="fnb">F&amp;B</Term> operations (multiple outlets, mixed
              guest segments, volatile demand, labor shortages), this creates chronic inefficiencies:
            </p>
            <ul className="space-y-2 pl-5 list-disc marker:text-secondary">
              {PROBLEM_PAINS.map((pain) => (
                <li key={pain} className="text-on-surface">
                  {pain}
                </li>
              ))}
            </ul>
            <p>
              Traditional systems store data. Very few build living operational memory that learns from real outcomes
              and makes that knowledge available at the exact moment it is needed.
            </p>
            <p className="font-headline italic text-primary text-lg leading-snug">
              This is the gap Aetherix was created to close.
            </p>
            <p className="text-sm text-on-surface-variant">
              The underlying bottleneck is not data, it is synthesis: combining internal context (occupancy, capture
              rates, POS history) with external signals (weather, local events) into a recommendation calibrated to
              this property.
            </p>
          </div>
        </div>
      </Reveal>

      <SectionDivider label="How the memory compounds" index="05" />

      {/* MEMORY COMPOUNDS */}
      <Reveal as="section" id="memory" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-3xl mb-10 md:mb-12">
            <span data-reveal-child className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
              The cycle
            </span>
            <h2
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "120ms" }}
              className="font-headline italic text-3xl md:text-5xl text-primary mt-4 leading-tight"
            >
              Memory, Prediction, Action, Learning.
            </h2>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "240ms" }}
              className="mt-6 text-on-surface-variant leading-relaxed"
            >
              Memory is not the offer, it is the mechanism that makes the forecast specific to one property rather
              than generic. Every day, Aetherix runs the same loop. Each turn deposits one more grain of calibrated
              experience into the property's operational memory, which is why the day-90 recommendation is sharper
              than the day-7 one.
            </p>
          </div>
          <AetherixLoopCards />
          <p
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "720ms" }}
            className="mt-8 text-xs text-on-surface-variant max-w-3xl"
          >
            Caveat: what is recallable today is local history plus generic cross-property context patterns. A true
            federated cohort prior (HiveMemory) is research, targeted for Phase 4 and beyond, and would remain
            anonymized aggregates only. No cross-tenant raw data, ever. Measured gains begin with the live pilot, not
            the synthetic baseline.
          </p>
        </div>
      </Reveal>

      <SectionDivider label="What you see" index="06" />

      {/* DAILY RECEIPT */}
      <Reveal as="section" id="receipt" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
              Daily Receipt
            </span>
            <h2 className="font-headline italic text-3xl md:text-5xl text-primary mt-4 leading-tight">
              What a manager actually sees.
            </h2>
          </div>
          <div data-reveal-child>
            <AetherixDailyReceipt />
          </div>
        </div>
      </Reveal>

      <SectionDivider label="How it works" index="07" />

      {/* HOW IT WORKS — Mesh + Pipeline + Stack */}
      <Reveal as="section" id="how" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-3xl mb-10">
            <span data-reveal-child className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
              The Mesh, bounded context by design
            </span>
            <h2
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "120ms" }}
              className="font-headline italic text-3xl md:text-5xl text-primary mt-4 leading-tight"
            >
              Aetherix executes. It does not orchestrate.
            </h2>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "240ms" }}
              className="mt-6 text-on-surface-variant leading-relaxed"
            >
              Aetherix is one node in a network of specialized, <Term id="mcp">MCP</Term>-native agents. Each node owns
              a strict bounded context and communicates only through MCP, no shared code, no monolith to displace. An
              Orchestrator decides when to call it.
            </p>
          </div>
          <div data-reveal-child style={{ ["--reveal-delay" as string]: "360ms" }} className="mb-14">
            <AetherixMeshDiagram />
          </div>

          <div className="max-w-3xl mb-10">
            <span data-reveal-child className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
              Architecture
            </span>
            <h3
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "120ms" }}
              className="font-headline italic text-2xl md:text-4xl text-primary mt-4 leading-tight"
            >
              Push-first pipeline.
            </h3>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "240ms" }}
              className="mt-6 text-on-surface-variant leading-relaxed"
            >
              Apaleo (OAuth2 and MCP read) + Open-Meteo + PredictHQ → Prophet forecast and staffing → pgvector memory
              recall (OperationalMemory + HiveMemory cold-start, research) → Claude Sonnet reasoning → WhatsApp or Email.
            </p>
          </div>
          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "360ms" }}
            className="rounded-2xl overflow-hidden border border-outline-variant bg-surface mb-10"
          >
            <div className="min-h-[520px]">
              <AetherixArchitectureDiagram />
            </div>
          </div>
          <div data-reveal-child>
            <h3 className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary mb-4">Stack</h3>
            <AetherixStackChips />
          </div>
        </div>
      </Reveal>

      <SectionDivider label="Built to be trusted" index="08" />

      {/* TRUST */}
      <Reveal as="section" id="trust" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-2xl mb-10">
            <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight">
              Trust is engineered, not promised.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRUST.map((t, i) => (
              <div
                key={t.title}
                data-reveal-child
                style={{ ["--reveal-delay" as string]: `${200 + i * 120}ms` }}
                className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col gap-4"
              >
                <Icon name={t.icon} className="text-secondary text-3xl" />
                <h3 className="font-headline italic text-2xl text-primary leading-tight">{t.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>

          {/* Trust engineering, visible */}
          <div className="mt-14 md:mt-16">
            <div className="max-w-2xl mb-8">
              <span
                data-reveal-child
                className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary"
              >
                Trust engineering, visible
              </span>
              <h3
                data-reveal-child
                style={{ ["--reveal-delay" as string]: "120ms" }}
                className="font-headline italic text-2xl md:text-3xl text-primary mt-3 leading-tight"
              >
                Three artifacts, three proofs.
              </h3>
            </div>
            <AetherixTrustFrames />
          </div>

          <div className="mt-14 md:mt-16" data-reveal-child>
            <AetherixWhatRemainsPrivate />
          </div>

          <div data-reveal-child className="mt-14 md:mt-16 max-w-3xl">
            <h3 className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
              Why Lore cannot close the same loop
            </h3>
            <p className="mt-4 text-on-surface-variant leading-relaxed">
              <Link
                to="/lore"
                className="text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
              >
                Lore
              </Link>
              , in aviation maintenance, shares this architecture and cannot close the same loop. Nothing there tells
              the system whether an observation was right, and the moment a technician escalates the counterfactual
              disappears. Aetherix has an outcome to compare against; that difference decides how much each product is
              allowed to learn on its own.
            </p>
          </div>

          <p data-reveal-child className="mt-10 text-sm text-on-surface-variant max-w-3xl">
            The evaluation vocabulary behind these gates, harnesses, graders, acceptance tiers and closed loops, is
            written up in a field note:{" "}
            <Link
              to="/journal/harnesses-graders-closed-loops"
              className="text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
            >
              Harnais, graders, boucles fermées
            </Link>{" "}
            <span className="text-on-surface-variant">(in French)</span>.
          </p>
        </div>
      </Reveal>

      <SectionDivider label="Performance" index="09" />

      {/* PERFORMANCE */}
      <Reveal as="section" id="performance" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-2xl mb-10">
            <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight">
              Where we are, honestly.
            </h2>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "180ms" }}
              className="mt-6 text-on-surface-variant leading-relaxed"
            >
              No live forecasting accuracy claim, yet. Phase status, target outcomes, and the security gate baseline.
              Every claim carries its caveat: synthetic, target, or measured.
            </p>
          </div>
          <div data-reveal-child style={{ ["--reveal-delay" as string]: "320ms" }}>
            <AetherixMetricCards />
          </div>
          <p
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "440ms" }}
            className="mt-6 text-xs text-on-surface-variant max-w-3xl"
          >
            Calibration baseline (synthetic backtest, not published as a headline): <Term id="mape">MAPE</Term> 15.09%
            on J+1 covers, 22% gate PASS. Real-world measurement begins with the pilot. Labor and waste targets are
            projections to be validated then.
          </p>
        </div>
      </Reveal>

      <SectionDivider label="Roadmap" index="10" />

      {/* ROADMAP */}
      <Reveal as="section" id="roadmap" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-2xl mb-10">
            <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight">
              Where we are, where we're going.
            </h2>
          </div>
          <div data-reveal-child style={{ ["--reveal-delay" as string]: "200ms" }}>
            <AetherixPhaseTimeline />
          </div>
        </div>
      </Reveal>

      <SectionDivider label="Anima, sister node" index="11" />

      {/* ANIMA SPOTLIGHT */}
      <Reveal as="section" className="px-6 md:px-12 mb-12 md:mb-16">
        <div className="max-w-screen-2xl mx-auto" data-reveal-child>
          <AetherixAnimaSpotlight />
        </div>
      </Reveal>

      <SectionDivider label="Role & model" index="12" />

      {/* ROLE & CTA */}
      <Reveal as="section" id="contact" className="px-6 md:px-12 mb-24 md:mb-32 scroll-mt-24">
        <div className="max-w-3xl mx-auto text-center">
          <span data-reveal-child className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
            Role &amp; pricing
          </span>
          <h2
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "120ms" }}
            className="font-headline italic text-3xl md:text-5xl text-primary mt-4 leading-tight"
          >
            Solo architect &amp; builder. Results-as-a-Service.
          </h2>
          <p
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "240ms" }}
            className="mt-6 text-on-surface-variant leading-relaxed"
          >
            Product Builder &amp; AI Agent Designer, 2026, ongoing (validation phase). Pricing follows outcomes, not
            seats: we win when you win. Pilots and product conversations open.
          </p>
          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "360ms" }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <a
              href="https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-opacity"
            >
              <Icon name="hub" className="text-base" />
              Explore the Mesh
            </a>
            <a
              href={SOCIAL_LINKS.schedule}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant text-primary font-label uppercase tracking-[0.2em] text-xs hover:bg-surface-container-low transition-colors"
            >
              <Icon name="event" className="text-base" />
              Book a call
            </a>
            <a
              href="https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture"
              target="_blank"
              rel="noopener noreferrer"
              title="Public meta-repo for the Hospitality Agentic Mesh"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant text-primary font-label uppercase tracking-[0.2em] text-xs hover:bg-surface-container-low transition-colors"
            >
              <Icon name="hub" className="text-base" />
              Mesh repo
            </a>
            <Link
              to="/tacet"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant text-primary font-label uppercase tracking-[0.2em] text-xs hover:bg-surface-container-low transition-colors"
            >
              <Icon name="arrow_forward" className="text-base" />
              Read Tacet
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  </SiteLayout>
);

export default Atherix;
