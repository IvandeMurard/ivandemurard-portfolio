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
import { Term } from "@/components/Term";

const PROJECT_INFO: { label: string; value: string; href?: string; wide?: boolean }[] = [
  { label: "Role", value: "Product Builder & AI Agent Designer (solo)" },
  { label: "Duration", value: "2026, ongoing (validation phase)" },
  { label: "Team", value: "Solo architect & builder" },
  {
    label: "Repository",
    value: "GitHub Repository",
    href: "https://github.com/IvandeMurard/aetherix-hospitality-ai",
  },
  {
    label: "Status",
    value: "Phase 3 · Pilot · Staging live on Fly.io (Paris) · Apaleo OAuth + MCP read operational · Design partner pilot starting",
    wide: true,
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
    q: "What stage is Aetherix currently at?",
    a: "Phase 3, pilot. MCP Server v0 is shipped, staging is live on Fly.io (Paris), the backtest harness is built (15.09% MAPE, 22% gate PASS on synthetic data). The first real-world MAPE measurement begins with the Phase 3 design partner.",
  },
  {
    q: "Is this already deployed in production hotels?",
    a: "Not yet. We are in technical validation and onboarding the first design partner on Apaleo prod (Phase 3, current).",
  },
  {
    q: "How is multi-tenant security handled?",
    a: "hotel_id is scoped at every layer (Postgres RLS, Python guards, MCP token binding), resolved server-side, never accepted as a tool input. PMS access is read-only. Data residency: Supabase EU. HiveMemory holds anonymized aggregates only.",
  },
  {
    q: "What is the Hospitality Agentic Mesh?",
    a: "A network of specialized AI agents communicating exclusively via MCP. Each node owns a strict bounded context: Aetherix (F&B execution), Tacet (sensory), Orchestrator (supervisory routing), Anima (guest cognition, PoC). No shared code, no monolith to displace. Glue, not replacement.",
  },
  {
    q: "How does it integrate with existing hotel systems?",
    a: "Apaleo PMS through OAuth2 and MCP read access today, Mews next. Delivery in WhatsApp. Inbound calls via MCP. No new dashboard to learn.",
  },
  {
    q: "What does the 15.09% MAPE mean?",
    a: "Mean Absolute Percentage Error on J+1 covers forecasts, measured on a synthetic backtest with a 22% gate that passes. It is a calibration baseline, not a live result. Real-world measurement starts with the Phase 3 design partner.",
  },
  {
    q: "What is Anima?",
    a: "A Guest Cognition Layer PoC, shipped at the Anthropic hackathon in June 2026. A four-layer temporal memory (working, episodic, semantic, segment) with confidence-weighted claims. Production is Phase 4, DPIA-gated.",
  },
];

const ATHERIX_SECTIONS = [
  { id: "problem", label: "Problem" },
  { id: "mesh", label: "Mesh" },
  { id: "what-it-does", label: "What it does" },
  { id: "receipt", label: "Daily Receipt" },
  { id: "how", label: "How it works" },
  { id: "trust", label: "Trust" },
  { id: "performance", label: "Performance" },
  { id: "roadmap", label: "Roadmap" },
  { id: "contact", label: "Contact" },
];

const Atherix = () => (
  <SiteLayout title="Aetherix: F&B Execution Node of the Hospitality Agentic Mesh" sections={ATHERIX_SECTIONS}>
    <Seo
      title="Aetherix, F&B Execution Node of the Hospitality Agentic Mesh"
      description="Tells boutique hotel managers how many covers to expect, how to staff, how to cut food waste. MCP-native, delivered via WhatsApp. Phase 3 pilot."
      path="/aetherix"
      type="article"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "Aetherix",
          headline: "Aetherix, F&B Execution Node of the Hospitality Agentic Mesh",
          description:
            "Aetherix is the F&B execution node of the Hospitality Agentic Mesh. It tells a hotel manager how many covers to expect tomorrow, how to staff for them, and how to cut food waste, delivered where they already work.",
          url: "https://ivandemurard.com/aetherix",
          about: ["Agentic AI", "Hospitality Operations", "F&B Forecasting", "MCP"],
          keywords:
            "Agentic AI, MCP, Model Context Protocol, Apaleo, Hospitality, F&B forecasting, Prophet, pgvector, Claude Sonnet, Boutique Hotels",
          creator: { "@type": "Person", name: "Ivan de Murard", url: "https://ivandemurard.com" },
          dateCreated: "2026-01-01",
          dateModified: "2026-06-18",
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
              className="headline-ink font-headline text-5xl md:text-7xl lg:text-8xl text-primary italic leading-[0.95] tracking-tight mb-8"
            >
              Aetherix
            </h1>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "240ms" }}
              className="text-on-surface-variant font-body text-xl max-w-2xl leading-relaxed"
            >
              The F&amp;B execution node of the Hospitality <Term id="agenticAi">Agentic</Term> Mesh. It tells a hotel
              manager how many covers to expect tomorrow, how to staff for them, and how to cut food waste, delivered
              where they already work.
            </p>
            <div data-reveal-child style={{ ["--reveal-delay" as string]: "360ms" }}>
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

      {/* PROBLEM */}
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
            The bottleneck isn't data. It's synthesis.
          </h2>
          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "240ms" }}
            className="mt-6 space-y-5 text-on-surface-variant leading-relaxed"
          >
            <p>
              F&amp;B demand anticipation is still a daily, manual, error-prone task. Hotels rely on limited data,
              disconnected tools, and spreadsheets. Labor is 25 to 35% of F&amp;B operating cost; a significant share
              of purchased food is wasted; over and understaffing hits both staff and guests.
            </p>
            <p>
              The bottleneck isn't data, it's synthesis: combining internal context (occupancy, capture rates, POS
              history) with external signals (weather, local events) into a recommendation calibrated to <em>this</em>
              {" "}property. Aetherix builds that synthesis automatically, learns from manager feedback, and delivers it
              where managers already are. Glue, not replacement.
            </p>
          </div>
        </div>
      </Reveal>

      <SectionDivider label="The Mesh" index="02" />

      {/* THE MESH */}
      <Reveal as="section" id="mesh" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-3xl mb-10 md:mb-12">
            <span data-reveal-child className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
              Bounded context by design
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
          <div data-reveal-child style={{ ["--reveal-delay" as string]: "360ms" }}>
            <AetherixMeshDiagram />
          </div>
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

      {/* HOW IT WORKS */}
      <Reveal as="section" id="how" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-3xl mb-10">
            <span data-reveal-child className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
              Architecture
            </span>
            <h2
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "120ms" }}
              className="font-headline italic text-3xl md:text-5xl text-primary mt-4 leading-tight"
            >
              Push-first pipeline.
            </h2>
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
