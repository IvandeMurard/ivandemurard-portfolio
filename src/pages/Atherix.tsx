// Source of truth for facts (dates, stack, metrics, status).
// If you change facts here, also update public/aetherix.md and public/llms-full.txt.
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
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
    href: "https://github.com/IvandeMurard/aetherix-hospitality-ai",
    hint: "Private repository, access upon request",
  },
  {
    label: "Status",
    value: "Phase 3 · Pilot · Staging live on Fly.io (Paris) · Apaleo OAuth + MCP read operational · Design partner pilot starting",
    wide: true,
  },
];

const PROBLEM_PAINS = [
  "Persistent over or under-staffing",
  "Avoidable food waste",
  "Reactive decision-making instead of anticipation",
  "Slow onboarding and inconsistent execution across properties",
];

const MEMORY_CYCLE = [
  {
    icon: "psychology",
    title: "Memory",
    body: "Recall what worked here, on similar days, in similar contexts. Local history first, anonymized peer patterns as cold-start.",
  },
  {
    icon: "insights",
    title: "Prediction",
    body: "A calibrated forecast for tomorrow: covers, staffing, waste risk, with the drivers behind it.",
  },
  {
    icon: "send",
    title: "Action",
    body: "One message on WhatsApp. Accept, modify, or reject in one tap. No new dashboard to learn.",
  },
  {
    icon: "autorenew",
    title: "Learning",
    body: "Every reply is a signal. The day-90 receipt is sharper than the day-7 one.",
  },
];

const PROMISES = [
  {
    icon: "restaurant",
    title: "Tomorrow's covers",
    body: "Anticipates how many breakfasts, lunches, dinners to expect, with a confidence score and the drivers behind it.",
  },
  {
    icon: "group_add",
    title: "Staffing that fits",
    body: "Proposes a shift grid based on occupancy, capture rate history and local context. The manager approves, adjusts or overrides.",
  },
  {
    icon: "eco",
    title: "Less waste",
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
    a: "Persistent operational cognition for hospitality: a living memory that survives manager turnover and executes F&B forecasting, staffing and waste reduction on WhatsApp, as one node of the Hospitality Agentic Mesh.",
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
    a: "A network of specialized MCP-native agents, each with a strict bounded context: Aetherix (F&B execution), Tacet (sensory), Orchestrator (supervisory routing, Phase 3 stub), Anima (guest cognition, shipped as PoC). No shared code, no monolith to displace. Aetherix executes, it does not orchestrate.",
  },
  {
    q: "How is multi-tenant security handled?",
    a: "hotel_id is scoped at every layer (Postgres RLS, Python guards, MCP token binding), resolved server-side, never accepted as a tool input. PMS access is read-only. Data residency: Supabase EU. HiveMemory holds anonymized aggregates only, no cross-tenant raw data.",
  },
  {
    q: "How do I pilot Aetherix?",
    a: "Book a call. Phase 3 is open to one design partner running Apaleo. Pricing is outcome-based, we win when you win. First real-world measurements start with the pilot.",
  },
];

const ATHERIX_SECTIONS = [
  { id: "problem", label: "Problem" },
  { id: "memory", label: "Memory" },
  { id: "what-it-does", label: "What it does" },
  { id: "receipt", label: "Daily Receipt" },
  { id: "how", label: "How it works" },
  { id: "trust", label: "Trust" },
  { id: "performance", label: "Performance" },
  { id: "roadmap", label: "Roadmap" },
  { id: "contact", label: "Contact" },
];

const Atherix = () => (
  <SiteLayout title="Aetherix: Persistent Operational Cognition for Hospitality" sections={ATHERIX_SECTIONS}>
    <Seo
      title="Aetherix, Persistent Operational Cognition for Hospitality"
      description="Hotels lose critical knowledge every time a manager leaves. Aetherix builds persistent operational memory that survives turnover, anticipates F&B demand, and delivers one-tap decisions on WhatsApp."
      path="/aetherix"
      type="article"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "Aetherix",
          headline: "Aetherix, Persistent Operational Cognition for Hospitality",
          description:
            "Aetherix turns scattered local experience into durable organizational intelligence. It builds persistent operational memory that survives manager turnover and grows stronger over time, while executing F&B forecasting, staffing and waste reduction as the F&B node of the Hospitality Agentic Mesh.",
          url: "https://ivandemurard.com/aetherix",
          about: ["Operational Memory", "Organizational Intelligence", "Agentic AI", "Hospitality Operations", "F&B Forecasting", "MCP"],
          keywords:
            "Operational memory, Organizational intelligence, Manager turnover, Hospitality cognition, Agentic AI, MCP, Model Context Protocol, Apaleo, F&B forecasting, Prophet, pgvector, Claude Sonnet, Boutique Hotels",
          creator: { "@type": "Person", name: "Ivan de Murard", url: "https://ivandemurard.com" },
          dateCreated: "2026-01-01",
          dateModified: "2026-06-22",
          codeRepository: "https://github.com/IvandeMurard/aetherix-hospitality-ai",
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
              Persistent Operational Cognition for Hospitality.
            </p>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "280ms" }}
              className="text-on-surface-variant font-body text-lg max-w-2xl leading-relaxed mb-4"
            >
              Turning scattered local experience into durable organizational intelligence.
            </p>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "340ms" }}
              className="text-on-surface-variant font-body text-base max-w-2xl leading-relaxed"
            >
              Most hotels lose critical knowledge every time a manager leaves. Aetherix builds persistent operational
              memory that survives turnover and grows stronger over time.
            </p>

            {/* Cycle 4 lignes */}
            <ul
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "420ms" }}
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 max-w-2xl"
              aria-label="Aetherix cycle"
            >
              {MEMORY_CYCLE.map((step, i) => (
                <li key={step.title} className="flex items-baseline gap-3 text-sm text-on-surface">
                  <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary tabular-nums">
                    0{i + 1}
                  </span>
                  <span>
                    <span className="font-headline italic text-primary">{step.title}.</span>{" "}
                    <span className="text-on-surface-variant">
                      {step.title === "Memory" && "Recall what worked here."}
                      {step.title === "Prediction" && "Calibrated for tomorrow."}
                      {step.title === "Action" && "One tap on WhatsApp."}
                      {step.title === "Learning" && "Every reply sharpens the next."}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Triptyque */}
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "500ms" }}
              className="mt-8 font-headline italic text-primary text-lg md:text-xl leading-snug max-w-2xl"
            >
              Understands like a human. Measures like a machine. Remembers like an institution.
            </p>

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

      {/* Project Info */}
      <section className="px-6 md:px-12 mb-12 md:mb-16">
        <div className="max-w-screen-2xl mx-auto border-t border-b border-outline-variant/30 py-10">
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
                    className="text-sm font-medium text-primary inline-flex items-center gap-1.5 border-b border-secondary/30 hover:border-secondary transition-colors"
                  >
                    {info.value}
                    <Icon name="open_in_new" className="text-xs" />
                  </a>
                ) : (
                  <p className="text-sm font-medium text-primary">{info.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider label="Problem" index="01" />

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

      <SectionDivider label="How the memory compounds" index="02" />

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
              Every day, Aetherix runs the same loop. Each turn deposits one more grain of calibrated experience into
              the property's operational memory.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MEMORY_CYCLE.map((step, i) => (
              <div
                key={step.title}
                data-reveal-child
                style={{ ["--reveal-delay" as string]: `${200 + i * 100}ms` }}
                className="bg-surface-container-low border border-outline-variant/25 rounded-2xl p-6 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary tabular-nums">
                    0{i + 1}
                  </span>
                  <Icon name={step.icon} className="text-secondary text-xl" />
                </div>
                <h3 className="font-headline italic text-xl text-primary leading-tight">{step.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          {/* Day-7 vs Day-90 */}
          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "640ms" }}
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl"
          >
            <div className="border border-outline-variant/25 rounded-2xl p-6 bg-surface-container-lowest">
              <span className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">
                Day 7
              </span>
              <p className="mt-3 text-on-surface leading-relaxed text-sm">
                Cold-start. Confidence is honest about what it does not yet know. Recommendations lean on anonymized
                patterns from peer properties (opt-in) and on the first week of local signals.
              </p>
            </div>
            <div className="border border-secondary/40 rounded-2xl p-6 bg-surface-container-high">
              <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">Day 90</span>
              <p className="mt-3 text-on-surface leading-relaxed text-sm">
                The receipt is sharper. Drivers are property-specific. The system has seen enough Tuesdays, enough
                events, enough overrides to calibrate to this exact place.
              </p>
            </div>
          </div>
          <p
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "720ms" }}
            className="mt-6 text-xs text-on-surface-variant max-w-3xl"
          >
            Caveat: HiveMemory is anonymized aggregates only, used as cold-start across peer properties. No
            cross-tenant raw data, ever. Measured gains begin with the live pilot, not the synthetic baseline.
          </p>
        </div>
      </Reveal>

      <SectionDivider label="What it does" index="03" />

      {/* WHAT IT DOES */}
      <Reveal as="section" id="what-it-does" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-2xl mb-10">
            <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight">
              Three promises, one message a day.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROMISES.map((p, i) => (
              <div
                key={p.title}
                data-reveal-child
                style={{ ["--reveal-delay" as string]: `${200 + i * 120}ms` }}
                className="bg-surface-container-low border border-outline-variant/25 rounded-2xl p-6 md:p-8 flex flex-col gap-4"
              >
                <Icon name={p.icon} className="text-secondary text-3xl" />
                <h3 className="font-headline italic text-2xl text-primary leading-tight">{p.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <SectionDivider label="What you see" index="04" />

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

      <SectionDivider label="How it works" index="05" />

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
              recall (OperationalMemory + HiveMemory cold-start) → Claude Sonnet reasoning → WhatsApp or Email.
            </p>
          </div>
          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "360ms" }}
            className="rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface mb-10"
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

      <SectionDivider label="Built to be trusted" index="06" />

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
                className="bg-surface-container-low border border-outline-variant/25 rounded-2xl p-6 md:p-8 flex flex-col gap-4"
              >
                <Icon name={t.icon} className="text-secondary text-3xl" />
                <h3 className="font-headline italic text-2xl text-primary leading-tight">{t.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <SectionDivider label="Performance" index="07" />

      {/* PERFORMANCE */}
      <Reveal as="section" id="performance" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-2xl mb-10">
            <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight">
              Forecast accuracy and target outcomes.
            </h2>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "180ms" }}
              className="mt-6 text-on-surface-variant leading-relaxed"
            >
              <Term id="mape">MAPE</Term> on J+1 covers, target labor cost variance, and the security gate baseline.
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
            The MAPE figure above comes from a synthetic backtest, not a live property. Real-world measurement begins
            with the Phase 3 design partner. Labor and waste targets are projections to be validated in the pilot.
          </p>
        </div>
      </Reveal>

      <SectionDivider label="Roadmap" index="08" />

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

      <SectionDivider label="Recent milestone" index="09" />

      {/* ANIMA MILESTONE */}
      <Reveal as="section" className="px-6 md:px-12 mb-12 md:mb-16">
        <div className="max-w-3xl mx-auto bg-surface-container-low border border-outline-variant/25 rounded-2xl p-8 md:p-10">
          <span data-reveal-child className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
            Anima PoC
          </span>
          <h2
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "120ms" }}
            className="font-headline italic text-2xl md:text-3xl text-primary mt-4 leading-tight"
          >
            Guest Cognition Layer prototype shipped at the Anthropic hackathon.
          </h2>
          <p
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "240ms" }}
            className="mt-5 text-on-surface-variant leading-relaxed"
          >
            A 4-layer temporal memory (working, episodic, semantic, segment) with confidence-weighted claims.
            Production is Phase 4, DPIA-gated.
          </p>
        </div>
      </Reveal>

      <SectionDivider label="Role & model" index="10" />

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
              href={SOCIAL_LINKS.schedule}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-opacity"
            >
              <Icon name="event" className="text-base" />
              Book a call
            </a>
            <a
              href="https://github.com/IvandeMurard/aetherix-hospitality-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant/40 text-primary font-label uppercase tracking-[0.2em] text-xs hover:bg-surface-container-low transition-colors"
            >
              <Icon name="code" className="text-base" />
              GitHub repo
            </a>
            <Link
              to="/tacet"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant/40 text-primary font-label uppercase tracking-[0.2em] text-xs hover:bg-surface-container-low transition-colors"
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
