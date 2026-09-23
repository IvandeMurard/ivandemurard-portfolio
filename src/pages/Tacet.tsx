// Source of truth for facts (dates, stack, metrics, status).
// If you change facts here, also update public/tacet.md and public/llms-full.txt.
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CaseAnchors } from "@/components/case/CaseAnchors";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";
import { TacetPipelineDiagram } from "@/components/tacet/TacetPipelineDiagram";
import { SectionDivider } from "@/components/SectionDivider";
import acousticTwinImg from "@/assets/tacet-acoustic-twin.jpg";
import { Term } from "@/components/Term";
import { EntryActions } from "@/components/journal/EntryActions";

const PROJECT_INFO = [
  { label: "Rôle", value: "Product Builder, Architect of an environmental intelligence layer" },
  { label: "Durée", value: "2026, ongoing (V3, MCP server and Dual Memory)" },
  { label: "Équipe", value: "Solo (with AI collaboration)" },
  {
    label: "Contexte",
    value: "Headless Environmental Twin for hospitality, exposed via MCP, complement to Aetherix",
  },
  {
    label: "Stack",
    value:
      "Python 3.12, FastAPI, Anthropic MCP SDK, OSMnx and Shapely ray-tracing, SQLAlchemy dual-memory store, Mews and Apaleo connectors",
  },
  {
    label: "Repository",
    value: "GitHub Repository",
    href: "https://github.com/IvandeMurard/tacet-app",
  },
];

const HOW = [
  {
    n: "01",
    icon: "sensors",
    title: "Sense",
    body: "The engine continuously ingests proxy APIs: construction permits, traffic flow, weather conditions, local events and mobility disruptions.",
  },
  {
    n: "02",
    icon: "polyline",
    title: "Reason",
    body: "A 3D ray-tracing physics engine, paired with a dual-memory store, turns raw signals into a calibrated impact score for each room of each property.",
  },
  {
    n: "03",
    icon: "hub",
    title: "Expose",
    body: "Yield rules and a mathematical Chain of Thought are published on an MCP server, ready for the RMS, the PMS, or the orchestrator (Design).",
  },
];

const PILLARS = [
  {
    letter: "A",
    icon: "view_in_ar",
    title: "Spatial Physics Engine",
    body: "Tacet does not just measure distance, it measures physics. Using shapely and osmnx, it draws 3D lines of sight between a disruptive event and the property, then applies a shielding penalty when urban buildings block the path. False positives drop, alert fatigue disappears.",
  },
  {
    letter: "B",
    icon: "memory",
    title: "Dual Memory",
    body: "Idiosyncratic memory learns each property's quirks: a hotel that rejects \"traffic noise\" alerts probably has triple-glazed windows, so Tacet applies a persistent shielding bonus at that GPS point. Hive Mind (Research: no network to aggregate yet) would recalibrate baseline sensitivity across the network.",
  },
  {
    letter: "C",
    icon: "verified_user",
    title: "Human-in-the-Loop Guardrail",
    body: "Tacet never executes destructive actions on its own. It formulates a precise Price Modifier Rule (for example, minus 15% on street-facing suites between June 12 and 14) and pushes it to the RMS for a Revenue Manager to approve. Accountability stays with the team.",
  },
  {
    letter: "D",
    icon: "forum",
    title: "Conversational Explainability",
    body: "Every JSON payload carries a mathematical Chain of Thought: base noise, distance attenuation, ray-tracing penalty, final impact. An orchestration agent parses it and explains the decision to the Revenue Manager in natural language, without a GUI.",
  },
];

const IMPACT = [
  {
    icon: "shield",
    title: "Yield protection",
    body: "Pricing noisy inventory ahead of time prevents costly post-stay refunds and protects average daily rate on the rest of the building.",
  },
  {
    icon: "restaurant",
    title: "Operational excellence",
    body: "When a heatwave overlaps with a transport strike, the orchestration layer adjusts F&B prep and staffing buffers before the day starts.",
  },
  {
    icon: "eco",
    title: "Sustainability",
    body: "Less energy waste through proactive HVAC optimisation, less urban noise pollution carried into rooms, measured against a stable baseline.",
  },
];

const FAQ = [
  {
    q: "Why headless and exposed via MCP?",
    a: "MCP is becoming the standard contract between agents and tools. Tacet ships as an MCP server so any RMS, PMS or orchestration agent can read its rules and reasoning without a bespoke integration.",
  },
  {
    q: "How accurate is a software-only model versus rooftop sensors?",
    a: "Tacet ray-traces 3D building geometry from OpenStreetMap and calibrates against public acoustic baselines like Bruitparif. No capex, no hardware to maintain, and the model gets sharper as the dual-memory store learns each property.",
  },
  {
    q: "Does Tacet change prices on its own?",
    a: "No. Tacet formulates a Price Modifier Rule with an explicit window and inventory scope, then sends it to the RMS for a human Revenue Manager to approve. Accountability and brand control stay with the team.",
  },
  {
    q: "How does Tacet relate to Aetherix?",
    a: "Aetherix reads the internal context (occupancy, F&B, staffing). Tacet reads the external context (street, weather, events) and exposes it through MCP. Until the orchestrator is built (Design), this exchange is direct: the one documented exception, non-personal, read-only, logged.",
  },
];

const TACET_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "architecture", label: "Architecture" },
  { id: "pillars", label: "Pillars" },
  { id: "impact", label: "Impact" },
  { id: "synergy", label: "Synergy" },
  { id: "horizon", label: "Horizon" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

const Tacet = () => (
  <SiteLayout title="Tacet: The Environmental Twin" sections={TACET_SECTIONS}>
    <Seo
      title="Tacet, Environmental Twin for Hospitality"
      description="Headless MCP server that turns street, weather and crowd signals into yield rules and Chain of Thought payloads for RMS, PMS and orchestration agents."
      path="/tacet"
      type="article"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Tacet",
          applicationCategory: "BusinessApplication",
          applicationSubCategory: "MCP server",
          operatingSystem: "Web, API",
          url: "https://ivandemurard.com/tacet",
          featureList: [
            "3D ray-tracing physics engine",
            "Dual memory (idiosyncratic and hive mind)",
            "Human-in-the-loop price modifier rules",
            "Chain of Thought JSON payloads",
            "MCP server for RMS, PMS and orchestration agents",
          ],
          creator: { "@type": "Person", name: "Ivan de Murard", url: "https://ivandemurard.com" },
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
      <Reveal as="section" className="relative min-h-[80vh] md:min-h-[800px] flex flex-col justify-center px-6 md:px-12 max-w-screen-2xl mx-auto mb-16 overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <p data-reveal-child className="font-label text-secondary uppercase tracking-[0.3em] text-xs mb-8">
            Selected Work / 2026, Hospitality
          </p>
          <h1 data-reveal-child style={{ ["--reveal-delay" as string]: "120ms" }} className="headline-ink font-headline text-5xl md:text-9xl italic leading-tight text-primary mb-12">
            Tacet: The <br />
            Environmental <br />
            Twin.
          </h1>
          <p data-reveal-child style={{ ["--reveal-delay" as string]: "380ms" }} className="font-headline text-2xl md:text-3xl text-on-surface-variant max-w-2xl italic leading-relaxed">
            A <Term id="headless">headless</Term> <Term id="environmentalTwin">environmental twin</Term> that turns street, weather and crowd signals into yield rules your RMS can act on, exposed via <Term id="mcp">MCP</Term>.
          </p>
          <div data-reveal-child style={{ ["--reveal-delay" as string]: "460ms" }} className="mt-10">
            <EntryActions title="Tacet" markdownPath="/tacet.md" variant="case" />
          </div>
        </div>
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-full md:w-3/4 h-[600px] md:h-[800px] opacity-80 pointer-events-none">
          <div className="halo-drift w-full h-full bg-gradient-to-tr from-primary/20 via-primary-container/10 to-transparent rounded-full blur-3xl" />
        </div>
      </Reveal>

      <CaseAnchors current="tacet" more={{ to: "/architecture", text: "How these systems fit together: the architecture note" }} />

      {/* Project Info */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-12 md:mb-16">
        <div className="grid md:grid-cols-5 gap-8 py-12 border-y border-outline-variant">
          <div className="md:col-span-1">
            <h4 className="font-label text-xs uppercase tracking-[0.2em] text-secondary mb-2">Project Info</h4>
          </div>
          <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECT_INFO.map((info) => (
              <div key={info.label}>
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {info.label}
                </p>
                {info.href ? (
                  <a
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-on-surface inline-flex items-center gap-1.5 border-b border-secondary hover:border-secondary hover:text-primary transition-colors"
                  >
                    {info.value}
                    <Icon name="open_in_new" className="text-xs" />
                  </a>
                ) : (
                  <p className="font-body text-sm text-on-surface">{info.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider index="01" label="Overview" />

      {/* 1. Overview */}
      <section id="overview" className="px-6 md:px-12 max-w-screen-2xl mx-auto py-8 md:py-12 mb-12 md:mb-16 grid md:grid-cols-12 gap-12 scroll-mt-24">
        <div className="md:col-start-2 md:col-span-4 self-start">
          <h2 className="font-headline text-3xl md:text-4xl italic text-primary mb-8 leading-snug">
            From dashboard <br />
            to anticipation
          </h2>
        </div>
        <div className="md:col-span-6">
          <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed max-w-lg">
            <p>
              Tacet began as an exploration of urban noise pollution, a Bruitparif-powered Score Sérénité dashboard for Parisians.
            </p>
            <p>
              The true value of data, however, lies not in visualisation but in anticipation. Tacet became a <Term id="environmentalTwin">headless environmental twin</Term>: a physics-based model of the property and its surroundings, exposed via an <Term id="mcp">MCP</Term> server that any RMS, PMS or orchestration agent can consume.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider index="02" label="The Problem" spacing="tight" />

      {/* 2. The Problem */}
      <section id="problem" className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-8 md:mb-10 scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-headline text-3xl md:text-5xl italic text-primary mb-8 leading-snug">
            RMS and PMS run on history.
          </h2>
          <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
            A transport strike, an unannounced street excavation, a sudden heatwave: the street, the sky and the crowd are not in the booking data. That blindness shows up as mispriced inventory, operational friction and avoidable refunds.
          </p>
        </div>
      </section>

      <SectionDivider spacing="tight" />

      {/* 3. Solution illustration */}
      <Reveal as="section" id="solution" className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-12 md:mb-16 scroll-mt-24">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-outline-variant" style={{ viewTransitionName: "case-hero-tacet" }}>
          <img
            src={acousticTwinImg}
            alt="Isometric environmental twin visualisation, concentric waves over a wireframe city"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
            <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-primary mb-2">
              Environmental twin, isometric view
            </p>
            <p className="font-headline italic text-on-primary text-xl md:text-2xl max-w-md leading-snug">
              A physics-based, software-only model of the property and its surroundings.
            </p>
          </div>
        </div>
      </Reveal>

      <SectionDivider index="03" label="The Solution" />

      {/* 3. Solution, three steps */}
      <Reveal as="section" className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-12 md:mb-16">
        <div className="text-center mb-16 md:mb-24">
          <h2 data-reveal-child className="headline-ink font-headline text-4xl md:text-5xl italic text-primary mb-6">
            An environmental twin, exposed via MCP
          </h2>
          <p data-reveal-child style={{ ["--reveal-delay" as string]: "200ms" }} className="text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Instead of pushing yet another dashboard, Tacet publishes calibrated yield rules and a mathematical <Term id="chainOfThought">Chain of Thought</Term> on an <Term id="mcp">MCP</Term> server. Sense, reason, expose.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-16">
          {HOW.map((s, i) => (
            <div
              key={s.n}
              data-reveal-child
              style={{ ["--reveal-delay" as string]: `${300 + i * 80}ms` }}
              className="lift-card p-8 bg-surface-container-low rounded-lg hover:bg-surface-container-lowest hover:shadow-2xl hover:shadow-primary/5 group relative overflow-hidden"
            >
              <span className="font-label text-[10px] text-secondary mb-8 block tracking-widest">{s.n}</span>
              <div className="w-12 h-12 rounded-full bg-surface-container-highest/50 mb-6 flex items-center justify-center text-primary">
                <Icon name={s.icon} className="text-sm" />
              </div>
              <h5 className="font-headline text-2xl italic mb-4 text-primary">{s.title}</h5>
              <p className="text-sm text-on-surface-variant leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Example workflow pull-quote */}
        <div className="max-w-3xl mx-auto bg-primary text-on-primary rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <span className="font-label text-[10px] uppercase tracking-[0.25em] text-on-primary mb-4 block">
            Example workflow
          </span>
          <p className="font-headline italic text-xl md:text-2xl leading-relaxed">
            "Heatwave forecast plus rail strike on June 13. Tacet suggests minus 15% on street-facing suites for two nights, and a staffing buffer for breakfast service. Awaiting Revenue Manager approval."
          </p>
        </div>
      </Reveal>

      <SectionDivider index="04" label="Architecture" />

      {/* The Intelligence Pipeline diagram */}
      <Reveal as="section" id="architecture" className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-16 md:mb-24 scroll-mt-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 data-reveal-child className="headline-ink font-headline text-4xl md:text-5xl italic text-primary mb-4">
            The intelligence pipeline
          </h2>
          <p data-reveal-child style={{ ["--reveal-delay" as string]: "200ms" }} className="text-on-surface-variant max-w-xl mx-auto">
            From proxy signals to MCP rules, the headless flow that turns context into decisions.
          </p>
        </div>
        <div className="rounded-2xl border border-outline-variant overflow-hidden">
          <TacetPipelineDiagram />
        </div>
      </Reveal>

      <SectionDivider index="05" label="Pillars" />

      {/* 5. Architectural Pillars */}
      <Reveal as="section" id="pillars" className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-16 md:mb-24 scroll-mt-24">
        <div className="text-center mb-16">
          <h2 data-reveal-child className="font-headline text-4xl md:text-5xl italic text-primary mb-6">
            Four pillars give Tacet its edge
          </h2>
          <p data-reveal-child style={{ ["--reveal-delay" as string]: "200ms" }} className="text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Physics, memory, restraint and explainability. Each pillar protects the others against the failure modes of a headless agent.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
          {PILLARS.map((p, i) => (
            <div
              key={p.letter}
              data-reveal-child
              style={{ ["--reveal-delay" as string]: `${300 + i * 80}ms` }}
              className="lift-card p-8 md:p-10 bg-surface-container-low border border-outline-variant rounded-2xl hover:bg-surface-container-lowest hover:shadow-2xl hover:shadow-primary/5 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-label text-[10px] text-secondary tracking-[0.25em]">PILLAR {p.letter}</span>
                <div className="w-10 h-10 rounded-full bg-surface-container-highest/50 flex items-center justify-center text-primary">
                  <Icon name={p.icon} className="text-sm" />
                </div>
              </div>
              <h3 className="font-headline text-2xl md:text-3xl italic text-primary mb-4 leading-snug">{p.title}</h3>
              <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <SectionDivider index="06" label="Impact" />

      {/* 6. Impact & ESG */}
      <section id="impact" className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-16 md:mb-24 scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl md:text-5xl italic text-primary mb-6">
            Impact, beyond yield
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Embedded in an agentic OS, Tacet shifts properties from reactive to proactive. Yield protected, operations smoothed, footprint reduced.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
          {IMPACT.map((it) => (
            <div key={it.title} className="p-8 bg-surface-container-low border border-outline-variant rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest/50 mb-6 flex items-center justify-center text-primary">
                <Icon name={it.icon} className="text-sm" />
              </div>
              <h3 className="font-headline italic text-2xl text-primary mb-4 leading-snug">{it.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{it.body}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider index="07" label="Synergy" />

      {/* 7. Synergy with Aetherix */}
      <section id="synergy" className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-16 md:mb-24 scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl md:text-5xl italic text-primary mb-6">Tacet and Aetherix</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Tacet exposes its rules and reasoning through <Term id="mcp">MCP</Term>.{" "}
            <Link to="/aetherix" className="text-secondary border-b border-secondary hover:border-secondary transition-colors">
              Aetherix
            </Link>
            {" "}consumes them as one more tool in the multi-agent architecture.
          </p>
          <p className="text-on-surface-variant max-w-2xl mx-auto leading-relaxed mt-4">
            Until the orchestrator is built (Design), this exchange is direct: the one documented exception,
            non-personal, read-only, logged.
          </p>
          <p className="text-on-surface-variant max-w-2xl mx-auto leading-relaxed mt-4">
            Part of the Hospitality Multi-Agent Architecture:{" "}
            <Link to="/architecture" className="text-secondary border-b border-secondary hover:border-secondary transition-colors">
              the architecture note
            </Link>
            {" "}explains how the five agents divide the work.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          <div className="p-10 bg-surface-container-low border border-outline-variant rounded-2xl">
            <Icon name="hub" className="text-secondary text-2xl mb-6" />
            <h3 className="font-headline italic text-2xl text-primary mb-4">Aetherix, internal context</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Anticipates operational needs, F&B demand and staffing, based on occupancy and historical trends.
            </p>
          </div>
          <div className="p-10 bg-surface-container-low border border-outline-variant rounded-2xl">
            <Icon name="public" className="text-secondary text-2xl mb-6" />
            <h3 className="font-headline italic text-2xl text-primary mb-4">Tacet, external context</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Reads street, weather and event signals, ray-traces their impact, and publishes yield rules on MCP.
            </p>
          </div>
        </div>
        <p className="text-center text-on-surface-variant max-w-2xl mx-auto leading-relaxed mt-12">
          Together, they let teams control costs, reduce waste and protect the experience guests came for.
        </p>
      </section>

      <SectionDivider index="08" label="Horizon" />

      {/* 8. Horizon */}
      <section id="horizon" className="px-6 md:px-12 max-w-screen-2xl mx-auto py-8 md:py-12 mb-8 md:mb-10 scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-headline text-3xl md:text-5xl italic text-primary mb-8 leading-snug">
            Where Tacet is going
          </h2>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Widen the catalogue of signals (mobility, air quality, cultural events), invite more orchestration agents on the MCP layer, and let the dual memory get sharper at each property.
            <br /><br />
            Over time, Tacet becomes the environmental layer of an agentic OS for hospitality: each property reads its surroundings with its own context, and responds faster because of it. A Quiet Certification standard is a likely side-effect, not the goal.
          </p>
          <div className="mt-8 mx-auto max-w-2xl border border-outline-variant bg-surface-container-lowest p-5 text-left">
            <span className="inline-flex items-center border border-outline px-2 py-0.5 font-label uppercase tracking-[0.18em] text-[10px] text-on-surface-variant">
              Design
            </span>
            <p className="mt-3 font-body text-sm text-on-surface-variant leading-relaxed">
              Signals on the routes into the property (rail lines, stations, airports), keyed by place
              and time, never by person.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider spacing="tight" />

      {/* CTA / Explore */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-12 md:mb-16">
        <div className="bg-surface-container-low rounded-3xl p-12 md:p-24 flex flex-col items-center text-center relative overflow-hidden">
          <h2 className="font-headline text-3xl md:text-4xl italic text-primary mb-6 relative z-10">
            Pilot Tacet with your hotel
          </h2>
          <p className="text-on-surface-variant mb-12 max-w-xl relative z-10">
            Looking for design partners among boutique hotels in Europe.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 relative z-10">
            <a
              href="mailto:ivandemurard@gmail.com?subject=Tacet%20pilot%20inquiry"
              className="inline-flex items-center bg-primary text-on-primary px-8 py-4 rounded-full hover:bg-primary/90 transition-colors duration-300 shadow-md"
            >
              <span className="font-label text-sm uppercase tracking-widest mr-4">Inquire about a pilot</span>
              <Icon name="east" className="text-sm" />
            </a>
            <a
              href="https://tacet.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-secondary border-b border-secondary pb-1 hover:border-secondary transition-colors"
            >
              <span className="font-label text-xs uppercase tracking-widest mr-3">
                Original B2C dashboard, visual reference
              </span>
              <Icon name="open_in_new" className="text-xs" />
            </a>
            <a
              href="https://github.com/IvandeMurard/tacet-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-secondary border-b border-secondary pb-1 hover:border-secondary transition-colors"
            >
              <span className="font-label text-xs uppercase tracking-widest mr-3">
                View source on GitHub
              </span>
              <Icon name="open_in_new" className="text-xs" />
            </a>
          </div>
        </div>
      </section>

      <SectionDivider spacing="tight" />

      {/* FAQ */}
      <section id="faq" className="px-6 md:px-12 max-w-3xl mx-auto mb-16 md:mb-24 scroll-mt-24">
        <h3 className="font-headline text-2xl md:text-3xl italic text-primary mb-12 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-8">
          {FAQ.map((f) => (
            <div key={f.q} className="border-b border-outline-variant pb-8">
              <h4 className="font-body text-lg text-primary mb-4">{f.q}</h4>
              <p className="text-on-surface-variant leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section id="contact" className="px-6 md:px-12 max-w-screen-2xl mx-auto py-32 md:py-48 border-t border-outline-variant scroll-mt-24">
        <div className="max-w-4xl">
          <h2 className="font-headline text-4xl md:text-7xl italic text-primary mb-12 leading-tight">
            Interested in proactive intelligence for hotel operations?
          </h2>
          <a href="mailto:ivandemurard@gmail.com" className="inline-flex items-center group">
            <span className="font-headline text-2xl md:text-3xl italic text-secondary border-b border-secondary group-hover:border-secondary transition-all duration-500 pb-1">
              Let's discuss.
            </span>
            <Icon
              name="east"
              className="ml-4 text-secondary group-hover:translate-x-2 transition-transform duration-500"
            />
          </a>
        </div>
      </section>

      <div className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-12 text-right">
        <a
          href="/tacet.md"
          className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors"
        >
          View as markdown
        </a>
      </div>
    </div>
  </SiteLayout>
);

export default Tacet;
