import { SafeImage } from "@/components/SafeImage";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";
import { SOCIAL_LINKS } from "@/content/site";
import heroLobby from "@/assets/atherix-hero-lobby.jpg";
import toniPortrait from "@/assets/toni-stoeckl.webp";
import aviPortrait from "@/assets/avi-brosh.webp";
import { AetherixArchitectureDiagram } from "@/components/atherix/AetherixArchitectureDiagram";
import { AetherixHorizonIllustration } from "@/components/atherix/AetherixHorizonIllustration";

const PIPELINE = [
  { icon: "dns", title: "Apaleo PMS", sub: "" },
  { icon: "monitoring", title: "Forecasting", sub: "Prophet" },
  { icon: "psychology", title: "Semantic Reasoning", sub: "RAG + Claude Sonnet" },
  { icon: "hub", title: "Contextual Agent", sub: "MCP Callable" },
  { icon: "chat", title: "WhatsApp Push", sub: "To Team" },
];

const PROJECT_INFO = [
  { label: "Role", value: "Product Builder & AI Agent Designer (side project)" },
  { label: "Duration", value: "2026 – ongoing (validation phase)" },
  { label: "Team", value: "Solo architect & builder" },
  {
    label: "Context",
    value: "Agentic AI for boutique hotel operations (Apaleo PMS, staffing, F&B forecasting, WhatsApp push)",
    wide: true,
  },
  {
    label: "Current Status",
    value: "End-to-end pipeline operational in sandbox, Apaleo OAuth and MCP read access live, outbound MCP server in progress",
    wide: true,
  },
];

const PRINCIPLES = [
  {
    icon: "api",
    title: "API-First Architecture",
    body: "Built from the ground up to integrate seamlessly with property management systems and external data providers.",
  },
  {
    icon: "architecture",
    title: "Context-Aware Intelligence",
    body: "Bridges external signals (events, weather) with internal truth (PMS, calendars, occupancy) into unified prediction.",
  },
  {
    icon: "insights",
    title: "Explainable Predictions",
    body: "RAG architecture provides transparency: managers see historical scenarios used, not just numbers.",
  },
  {
    icon: "group",
    title: "Human-in-the-Loop Design",
    body: "The agent recommends and managers approve, adjust, or override based on local expertise.",
  },
];

const PIPELINE_CARDS = [
  {
    icon: "group_add",
    title: "Staffing Forecasts",
    body: "Intelligent shift optimization based on predicted occupancy, local events, and historical labor utilization patterns.",
  },
  {
    icon: "restaurant",
    title: "F&B Preparation",
    body: "Dynamic inventory planning and food preparation guidelines to match anticipated guest dining intent.",
  },
  {
    icon: "notifications_active",
    title: "Proactive Push",
    body: "Context-aware recommendations delivered directly to team members via WhatsApp exactly when action is needed.",
  },
  {
    icon: "eco",
    title: "Food Waste Reduction",
    body: "Measurable reduction of food waste and overarching operational costs through precise algorithmic anticipation.",
  },
];

const FAQ = [
  {
    q: "What stage is Aetherix currently at?",
    a: "End-to-end pipeline is operational in sandbox with real PMS data (Apaleo). Live pilots are next.",
  },
  {
    q: "Is this already deployed in hotels?",
    a: "Not yet. We are in technical validation and security review phase.",
  },
  {
    q: "What is the role of the human team?",
    a: "Humans stay firmly in the loop for strategic decisions. Aetherix proposes, never decides alone.",
  },
  {
    q: "How does it integrate with existing hotel systems?",
    a: "Through Apaleo PMS and WhatsApp for instant, contextual recommendations.",
  },
];

const Atherix = () => (
  <SiteLayout title="Aetherix: Boutique Hotel Operations AI">
    <Seo
      title="Aetherix, Agentic AI for Boutique Hotel Operations"
      description="Aetherix is an agentic AI framework for boutique hotel operations. It anticipates staffing and F&B needs, reduces food waste and operational costs, and frees teams to focus on guest experience."
      path="/atherix"
      type="article"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: "Aetherix",
        headline: "Aetherix: A new operating layer for boutique hotels",
        url: "https://www.ivandemurard.com/atherix",
        about: ["Agentic AI", "Hospitality Operations", "Boutique Hotels"],
        creator: {
          "@type": "Person",
          name: "Ivan de Murard",
          url: "https://www.ivandemurard.com",
        },
        dateCreated: "2026-01-01",
        codeRepository: "https://github.com/IvandeMurard/aetherix-hospitality-ai",
      }}
    />
    <div className="pt-32">
      {/* Hero */}
      <Reveal as="header" className="px-6 md:px-12 mb-20 md:mb-24">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-end gap-12 lg:gap-16">
          <div className="flex-1">
            <span data-reveal-child className="text-secondary font-label uppercase tracking-[0.2em] text-[10px] mb-6 block">
              Project Detail / Operations AI
            </span>
            <h1 data-reveal-child style={{ ["--reveal-delay" as string]: "120ms" }} className="headline-ink font-headline text-5xl md:text-8xl lg:text-9xl text-primary italic leading-[0.9] tracking-tight mb-8">
              Aetherix: A new operating layer for boutique hotels
            </h1>
            <div data-reveal-child style={{ ["--reveal-delay" as string]: "320ms" }} className="text-on-surface-variant font-body text-xl max-w-xl leading-relaxed">
              <p>
                Aetherix is an agentic framework focused on hotel operations. It anticipates staffing, F&B
                preparation, and resource needs in real time, reduces food waste and operational costs, and frees the
                human team to deliver exceptional guest experiences.
              </p>
            </div>

            {/* Pipeline diagram */}
            <div className="mt-12 md:mt-16 mb-8 w-full max-w-6xl">
              <h4 className="text-sm font-label uppercase tracking-widest text-secondary mb-6 pl-2">
                How Aetherix Works
              </h4>
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between relative px-4 md:px-8 py-8 md:py-10 border border-outline-variant/20 rounded-3xl bg-surface-container-lowest/80 backdrop-blur-md shadow-sm gap-6 md:gap-0">
                {PIPELINE.map((step, i) => (
                  <div key={step.title} className="contents md:contents">
                    <div className="flex flex-col items-center gap-4 relative z-10 w-full md:w-1/5 py-2">
                      <div className="w-16 h-16 rounded-full border border-outline-variant/40 bg-surface flex items-center justify-center shadow-sm">
                        <Icon name={step.icon} className="text-outline text-2xl" />
                      </div>
                      <div className="text-center bg-surface-container-lowest/90 px-4 py-3 rounded-xl backdrop-blur-md shadow-sm border border-outline-variant/10">
                        <h5 className="font-headline text-lg md:text-xl italic text-primary">{step.title}</h5>
                        {step.sub && (
                          <p className="text-[10px] uppercase tracking-widest text-secondary mt-1">{step.sub}</p>
                        )}
                      </div>
                    </div>
                    {i < PIPELINE.length - 1 && (
                      <Icon
                        name="arrow_forward"
                        className="hidden md:inline-block text-outline-variant/60 relative z-10 px-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-none items-center gap-4 text-secondary italic font-headline text-2xl pb-4">
            <span>Scroll to Explore</span>
            <Icon name="expand_more" className="animate-bounce" />
          </div>
        </div>
      </Reveal>

      {/* Project Info */}
      <section className="px-6 md:px-12 mb-24 md:mb-40">
        <div className="max-w-screen-2xl mx-auto border-t border-b border-outline-variant/30 py-12">
          <h3 className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-8">Project Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {PROJECT_INFO.map((info) => (
              <div key={info.label} className={info.wide ? "lg:col-span-2" : ""}>
                <h4 className="text-xs text-on-surface-variant mb-2">{info.label}</h4>
                <p className="text-sm font-medium text-primary">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="mb-24 md:mb-32 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="relative w-full aspect-[21/9] overflow-hidden rounded-xl bg-primary mb-12">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary-container to-secondary/30 mix-blend-overlay" />
            <SafeImage
              src={heroLobby}
              alt="Luxury hotel lobby with warm morning light"
              loading="lazy"
              className="kenburns w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <h2 className="font-headline text-3xl md:text-5xl text-surface-bright italic">The Vision</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <h3 className="font-headline text-2xl md:text-3xl text-primary mb-6">
                Restoring the human touch through algorithms.
              </h3>
              <p className="text-on-surface-variant leading-loose mb-8">
                Aetherix turns automated systems into experiences that feel cared for. It gives the team back the
                hours that define real service: the welcome, the conversation, the small attentions a guest remembers.
              </p>
            </div>
            <div className="lg:col-start-7 lg:col-span-6">
              <div className="bg-surface-container-high p-8 md:p-12 rounded-xl">
                <div className="flex flex-col gap-8">
                  <div className="flex items-start gap-6">
                    <Icon name="auto_awesome" className="text-secondary" />
                    <div>
                      <h4 className="font-bold text-primary mb-2">Guest Ritual Automation</h4>
                      <p className="text-sm text-on-surface-variant">
                        Seamlessly synchronizing check-in rituals and room ambiance to individual guest preferences.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <Icon name="chat_bubble" className="text-secondary" />
                    <div>
                      <h4 className="font-bold text-primary mb-2">Zero-UI Interfaces</h4>
                      <p className="text-sm text-on-surface-variant">
                        Interactions that feel natural and invisible, occurring exactly when and where they are needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligent Anticipation */}
      <Reveal as="section" className="py-20 md:py-32 bg-primary-fixed/20 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <div className="mb-16 md:mb-20">
            <h2 data-reveal-child className="headline-ink font-headline text-4xl md:text-5xl text-primary italic mb-6">Intelligent Anticipation</h2>
            <p data-reveal-child style={{ ["--reveal-delay" as string]: "200ms" }} className="text-on-surface-variant max-w-2xl text-lg">
              Four intelligence layers in sequence: numerical forecasting (Prophet), semantic patterns (Qdrant, 495+ scenarios), cognitive memory (pgvector, per hotel feedback), and reasoning (Claude Sonnet). The result is a single recommendation, pushed when it matters, callable by other agents over MCP.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div data-reveal-child style={{ ["--reveal-delay" as string]: "300ms" }} className="md:col-span-2 relative min-h-[500px] md:min-h-[560px] rounded-xl overflow-hidden bg-surface shadow-sm border border-outline-variant/20">
              <AetherixArchitectureDiagram />
            </div>
            <div data-reveal-child style={{ ["--reveal-delay" as string]: "420ms" }} className="bg-surface rounded-xl p-8 md:p-12 border border-outline-variant/20 shadow-sm flex flex-col justify-between">
              <div>
                <Icon name="forum" className="text-secondary text-4xl mb-6 block" />
                <h4 className="font-headline text-2xl text-primary mb-4">Proactive Messaging</h4>
                <p className="text-on-surface-variant leading-relaxed">
                  Recommendations land where teams already work: WhatsApp first, with explainable reasoning attached. Apaleo OAuth gives read access, an outbound MCP server lets orchestration agents call Aetherix directly.
                </p>
              </div>
              <div className="pt-8 border-t border-outline-variant/20 mt-6">
                <p className="text-xs font-label uppercase tracking-widest text-secondary">
                  Apaleo PMS, MCP callable, WhatsApp delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Quote 1 */}
      <section className="py-20 md:py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto bg-surface-container-low p-8 md:p-12 rounded-3xl text-center shadow-sm">
          <h3 className="font-headline text-2xl md:text-3xl text-primary italic leading-relaxed mb-8">
            "Food waste is one of the biggest challenges in hospitality. It is one of the most immediate and measurable
            ways we can reduce our impact as a hotel group."
          </h3>
          <div className="flex items-center justify-center gap-4">
            <img src={toniPortrait} alt="Toni Stoeckl" loading="lazy" className="w-12 h-12 rounded-full object-cover" />
            <div className="text-left">
              <p className="font-bold text-primary">Toni Stoeckl</p>
              <p className="text-xs text-on-surface-variant">Chief Marketing Officer, Starwood Hotels (1 Hotels)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Design Principles */}
      <Reveal as="section" className="py-24 md:py-40 px-6 md:px-12 bg-surface-container">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 data-reveal-child className="headline-ink font-headline text-4xl md:text-5xl text-primary mb-6">
              Core Design Principles for Operations AI
            </h2>
            <p data-reveal-child style={{ ["--reveal-delay" as string]: "200ms" }} className="text-on-surface-variant text-lg">Built for operational efficiency and human trust</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} data-reveal-child style={{ ["--reveal-delay" as string]: `${300 + i * 80}ms` }} className="flex flex-col gap-6">
                <Icon name={p.icon} className="text-secondary text-4xl" />
                <h3 className="font-bold text-xl text-primary">{p.title}</h3>
                <p className="text-on-surface leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* The Agentic Operations Pipeline */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-surface">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-headline text-4xl md:text-6xl text-primary italic mb-6">
              The Agentic Operations Pipeline
            </h2>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-3xl mx-auto">
              Aetherix anticipates real-time operational needs in boutique hotels, allowing the human team to focus on
              delivering exceptional guest experiences instead of reacting to daily operational chaos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 md:mb-32">
            {PIPELINE_CARDS.map((c) => (
              <div
                key={c.title}
                className="lift-card bg-surface-container-low border border-outline-variant/20 p-8 md:p-12 rounded-3xl hover:shadow-md"
              >
                <Icon name={c.icon} className="text-secondary text-3xl mb-6 block" />
                <h3 className="font-headline text-2xl md:text-3xl text-primary mb-4">{c.title}</h3>
                <p className="text-on-surface-variant text-lg leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
          <div className="max-w-5xl mx-auto bg-surface-container-low p-8 md:p-12 rounded-3xl text-center shadow-sm">
            <h3 className="font-headline text-2xl md:text-3xl text-primary italic leading-relaxed mb-8">
              "Technology has brought incredible convenience, but the human element is irreplaceable. A warm welcome, a
              local tip from the front desk, a morning conversation over coffee, these are the things that linger in a
              guest's memory."
            </h3>
            <div className="flex items-center justify-center gap-4">
              <img src={aviPortrait} alt="Avi Brosh" loading="lazy" className="w-12 h-12 rounded-full object-cover" />
              <div className="text-left">
                <p className="font-bold text-primary">Avi Brosh</p>
                <p className="text-xs text-on-surface-variant">Founder, Palisociety (Roadbook)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore the Platform */}
      <section className="py-20 md:py-24 px-6 md:px-12 bg-surface-container-high/30">
        <div className="max-w-screen-2xl mx-auto flex flex-col items-center text-center">
          <h2 className="font-headline text-3xl md:text-4xl text-primary italic mb-6">Explore the Platform</h2>
          <p className="text-on-surface-variant text-lg mb-8 max-w-xl">
            End-to-end pipeline (PMS Apaleo, forecasting, semantic reasoning, WhatsApp push)
          </p>
          <a
            href="https://github.com/IvandeMurard/Hospitality-Operations-Agentic-AI-B2B"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-outline-variant/40 px-8 py-4 rounded-full text-on-surface-variant hover:text-primary hover:border-outline transition-all duration-500"
          >
            <span className="font-label uppercase tracking-widest text-xs">View on GitHub</span>
            <Icon name="arrow_forward" className="text-sm" />
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-surface">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl text-primary italic mb-12 md:mb-16 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {FAQ.map((f) => (
              <div key={f.q} className="bg-surface-container-low p-8 rounded-2xl">
                <h4 className="font-bold text-primary mb-4">{f.q}</h4>
                <p className="text-on-surface-variant leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Horizon */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="max-w-screen-xl mx-auto text-center">
          <AetherixHorizonIllustration />
          <h2 className="font-headline text-4xl md:text-5xl text-primary italic mb-12">The Horizon</h2>
          <div className="text-on-surface-variant font-body text-lg md:text-xl max-w-4xl mx-auto leading-relaxed flex flex-col gap-6">
            <p>
              Aetherix's ultimate vision is to become the core intelligence layer in a fully agentic operations mesh,
              where specialized agents detect opportunities in real time, orchestrate complex workflows, and continuously
              optimize experiences, all while humans remain firmly in the loop for strategic direction.
            </p>
            <p>This is how we move from reactive operations to invisible, self-improving intelligence.</p>
            <p>Curious to explore what this could look like for your hotel or product vision?</p>
          </div>
          <div className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-outline-variant/20 flex flex-col items-center">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16">
              <a
                href={SOCIAL_LINKS.email}
                className="font-headline italic text-xl text-on-surface-variant hover:text-primary transition-colors duration-500"
              >
                Email me
              </a>
              <a
                href={SOCIAL_LINKS.schedule}
                target="_blank"
                rel="noopener noreferrer"
                className="font-headline italic text-xl text-on-surface-variant hover:text-primary transition-colors duration-500"
              >
                Schedule a conversation
              </a>
              <Link
                to="/contact"
                className="font-headline italic text-xl text-on-surface-variant hover:text-primary transition-colors duration-500"
              >
                Begin a journey
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </SiteLayout>
);

export default Atherix;
