// Source of truth for facts (dates, stack, metrics, status).
// If you change facts here, also update public/tacet.md and public/llms-full.txt.
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";
import { TacetPipelineDiagram } from "@/components/tacet/TacetPipelineDiagram";
import { SectionDivider } from "@/components/SectionDivider";
import acousticTwinImg from "@/assets/tacet-acoustic-twin.jpg";

const PROJECT_INFO = [
  { label: "Rôle", value: "Product Builder, Architect of an acoustic intelligence layer" },
  { label: "Durée", value: "2026, ongoing (V3 pivot from B2C to B2B)" },
  { label: "Équipe", value: "Solo (with AI collaboration)" },
  {
    label: "Contexte",
    value: "Headless API for hospitality, complement to Aetherix",
  },
  {
    label: "Stack",
    value:
      "Proxy data APIs (OpenData permits, traffic, weather, events), OpenStreetMap 3D geometry, synthetic acoustic model, JSON alerts to RMS and PMS",
  },
];

const HOW = [
  {
    n: "01",
    icon: "sensors",
    title: "Proxy Data Ingestion",
    body: "The engine continuously ingests APIs for construction permits, traffic flow, weather conditions, and local events.",
  },
  {
    n: "02",
    icon: "view_in_ar",
    title: "Spatial Geometry",
    body: "Using OpenStreetMap 3D building data, the algorithm calculates acoustic line of sight and building shielding.",
  },
  {
    n: "03",
    icon: "bolt",
    title: "Proactive Alerts",
    body: "Tacet pushes JSON payloads directly to the hotel's Revenue Management System (RMS) or Property Management System (PMS).",
  },
];

const FAQ = [
  {
    q: "Why headless and not a dashboard?",
    a: "An API-first layer integrates into the RMS and PMS where decisions already happen, instead of asking managers to watch yet another screen.",
  },
  {
    q: "How accurate is a software-only model versus hardware sensors?",
    a: "The synthetic twin is physics-based and calibrated against Bruitparif baselines. No capex, no rooftop sensors, the model improves as data sources expand.",
  },
  {
    q: "How does Tacet relate to Aetherix?",
    a: "Aetherix reads internal context (occupancy, F&B, staffing). Tacet reads external context (street, weather, events). Together they form one predictive digital twin for the hotel.",
  },
];

const Tacet = () => (
  <SiteLayout title="Tacet: The Synthetic Acoustic Twin">
    <Seo
      title="Tacet, Synthetic Acoustic Twin for Hospitality"
      description="Tacet is a proactive, headless intelligence layer for hotels. It predicts the impact of the external acoustic environment on revenue and guest experience, pushing JSON alerts to RMS and PMS."
      path="/tacet"
      type="article"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Tacet",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, API",
        url: "https://www.ivandemurard.com/tacet",
        creator: { "@type": "Person", name: "Ivan de Murard", url: "https://www.ivandemurard.com" },
      }}
    />
    <div className="pt-32">
      {/* Hero */}
      <Reveal as="section" className="relative min-h-[80vh] md:min-h-[800px] flex flex-col justify-center px-6 md:px-12 max-w-screen-2xl mx-auto mb-16 overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <p data-reveal-child className="font-label text-secondary uppercase tracking-[0.3em] text-xs mb-8">
            Selected Work / 2026 — Hospitality
          </p>
          <h1 data-reveal-child style={{ ["--reveal-delay" as string]: "120ms" }} className="headline-ink font-headline text-5xl md:text-9xl italic leading-tight text-primary mb-12">
            Tacet: The <br />
            Synthetic <br />
            Acoustic Twin.
          </h1>
          <p data-reveal-child style={{ ["--reveal-delay" as string]: "380ms" }} className="font-headline text-2xl md:text-3xl text-on-surface-variant max-w-2xl italic leading-relaxed">
            A proactive, headless intelligence layer that predicts the impact of the external acoustic environment on revenue and guest experience.
          </p>
        </div>
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-full md:w-3/4 h-[600px] md:h-[800px] opacity-80 pointer-events-none">
          <div className="halo-drift w-full h-full bg-gradient-to-tr from-primary/20 via-primary-container/10 to-transparent rounded-full blur-3xl" />
        </div>
      </Reveal>

      {/* Project Info */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-24 md:mb-32">
        <div className="grid md:grid-cols-5 gap-8 py-12 border-y border-surface-variant">
          <div className="md:col-span-1">
            <h4 className="font-label text-xs uppercase tracking-[0.2em] text-secondary mb-2">Project Info</h4>
          </div>
          <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECT_INFO.map((info) => (
              <div key={info.label}>
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {info.label}
                </p>
                <p className="font-body text-sm text-on-surface">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. Overview */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto py-16 md:py-24 mb-24 md:mb-32 grid md:grid-cols-12 gap-12">
        <div className="md:col-start-2 md:col-span-4 self-start">
          <span className="font-label text-[10px] uppercase tracking-widest text-secondary mb-4 block">01 / Overview</span>
          <h2 className="font-headline text-3xl md:text-4xl italic text-primary mb-8 leading-snug">
            From dashboard <br />
            to anticipation
          </h2>
        </div>
        <div className="md:col-span-6">
          <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed max-w-lg">
            <p>
              Tacet began as an exploration of urban noise pollution, a dashboard translating Bruitparif data into a human-readable Score Sérénité for Parisians.
            </p>
            <p>
              The true value of data, however, lies not in visualization but in anticipation. Tacet has evolved into a headless Synthetic Acoustic Twin, designed specifically for the hospitality sector. It predicts the impact of the external environment on the guest experience, moving from passive awareness to proactive yield management.
            </p>
          </div>
        </div>
      </section>

      {/* 2. The Problem */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-24 md:mb-32">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-label text-[10px] uppercase tracking-widest text-secondary mb-4 block">02 / The Problem</span>
          <h2 className="font-headline text-3xl md:text-5xl italic text-primary mb-8 leading-snug">
            "Quiet room" is a subjective request.
          </h2>
          <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
            A single bad review about noise can cost thousands in lost bookings. Yet hotel managers lack the tools to anticipate environmental disruptions (construction, traffic spikes, local events) and adjust their operations or pricing dynamically.
          </p>
        </div>
      </section>

      {/* 3. Solution illustration */}
      <Reveal as="section" className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-24 md:mb-32">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-outline-variant/20">
          <img
            src={acousticTwinImg}
            alt="Isometric synthetic acoustic twin visualisation, concentric waves over a wireframe city"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
            <p className="font-label text-[10px] uppercase tracking-[0.25em] text-on-primary/80 mb-2">
              Synthetic acoustic twin, isometric view
            </p>
            <p className="font-headline italic text-on-primary text-xl md:text-2xl max-w-md leading-snug">
              A physics-based, software-only model of the hotel and its surroundings.
            </p>
          </div>
        </div>
      </Reveal>

      {/* 3. Solution, three steps */}
      <Reveal as="section" className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-24 md:mb-32">
        <div className="text-center mb-16 md:mb-24">
          <span data-reveal-child className="font-label text-[10px] uppercase tracking-widest text-secondary mb-4 block">03 / The Solution</span>
          <h2 data-reveal-child style={{ ["--reveal-delay" as string]: "120ms" }} className="headline-ink font-headline text-4xl md:text-5xl italic text-primary mb-6">
            A Synthetic Digital Twin
          </h2>
          <p data-reveal-child style={{ ["--reveal-delay" as string]: "200ms" }} className="text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Instead of relying on costly hardware sensors, Tacet builds a physics-based, software-only acoustic model of the hotel.
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
              <div className="w-12 h-12 rounded-full bg-surface-container-highest/50 mb-6 flex items-center justify-center text-primary/70">
                <Icon name={s.icon} className="text-sm" />
              </div>
              <h5 className="font-headline text-2xl italic mb-4 text-primary">{s.title}</h5>
              <p className="text-sm text-on-surface-variant leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Example workflow pull-quote */}
        <div className="max-w-3xl mx-auto bg-primary text-on-primary rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <span className="font-label text-[10px] uppercase tracking-[0.25em] text-on-primary/70 mb-4 block">
            Example workflow
          </span>
          <p className="font-headline italic text-xl md:text-2xl leading-relaxed">
            "Alert: OpenData Paris shows jackhammering scheduled for 7:00 AM tomorrow outside the East Wing. Recommendation: reduce booking price by 10% for affected rooms, and automatically reassign VIP guests to the West Wing."
          </p>
        </div>
      </Reveal>

      {/* The Intelligence Pipeline diagram */}
      <Reveal as="section" className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-32 md:mb-48">
        <div className="text-center mb-12 md:mb-16">
          <span data-reveal-child className="font-label text-[10px] uppercase tracking-widest text-secondary mb-4 block">
            Architecture
          </span>
          <h2 data-reveal-child style={{ ["--reveal-delay" as string]: "120ms" }} className="headline-ink font-headline text-4xl md:text-5xl italic text-primary mb-4">
            The Intelligence Pipeline
          </h2>
          <p data-reveal-child style={{ ["--reveal-delay" as string]: "200ms" }} className="text-on-surface-variant max-w-xl mx-auto">
            An architecture diagram illustrating the headless data flow.
          </p>
        </div>
        <div className="rounded-2xl border border-outline-variant/20 overflow-hidden">
          <TacetPipelineDiagram />
        </div>
      </Reveal>

      {/* 4. Synergy with Aetherix */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-32 md:mb-48">
        <div className="text-center mb-16">
          <span className="font-label text-[10px] uppercase tracking-widest text-secondary mb-4 block">04 / Synergy</span>
          <h2 className="font-headline text-4xl md:text-5xl italic text-primary mb-6">Tacet and Aetherix</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Tacet is designed to work in tandem with{" "}
            <Link to="/aetherix" className="text-secondary border-b border-secondary/30 hover:border-secondary transition-colors">
              Aetherix
            </Link>
            , forming a complete Predictive Digital Twin for hotels.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          <div className="p-10 bg-surface-container-low border border-outline-variant/20 rounded-2xl">
            <Icon name="hub" className="text-secondary text-2xl mb-6" />
            <h3 className="font-headline italic text-2xl text-primary mb-4">Aetherix, internal context</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Predicts operational needs, F&B demand, and staffing based on occupancy and historical trends.
            </p>
          </div>
          <div className="p-10 bg-surface-container-low border border-outline-variant/20 rounded-2xl">
            <Icon name="public" className="text-secondary text-2xl mb-6" />
            <h3 className="font-headline italic text-2xl text-primary mb-4">Tacet, external context</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Predicts environmental impact, street disruptions, and acoustic risks.
            </p>
          </div>
        </div>
        <p className="text-center text-on-surface-variant max-w-2xl mx-auto leading-relaxed mt-12">
          Together, they allow hotel operators to control costs, reduce waste, and guarantee an unparalleled guest experience.
        </p>
      </section>

      {/* 5. The 5-Year Horizon */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto py-16 md:py-24 mb-24 md:mb-32 border-t border-surface-variant/50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-label text-[10px] uppercase tracking-widest text-secondary mb-4 block">05 / Horizon</span>
          <h2 className="font-headline text-3xl md:text-5xl italic text-primary mb-8 leading-snug">
            The 5-Year Horizon
          </h2>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            The goal is to continually improve the acoustic analysis and connectivity, while integrating new context specific agents, allowing for a greater scope of action.
            <br /><br />
            Ultimately, Tacet becomes the agentic solution offering hyper-personalized environmental contextual intelligence, allowing for better responsivity.
          </p>
        </div>
      </section>

      {/* CTA / Explore */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-32 md:mb-48">
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
              className="inline-flex items-center text-secondary border-b border-secondary/30 pb-1 hover:border-secondary transition-colors"
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
              className="inline-flex items-center text-secondary border-b border-secondary/30 pb-1 hover:border-secondary transition-colors"
            >
              <span className="font-label text-xs uppercase tracking-widest mr-3">
                View source on GitHub
              </span>
              <Icon name="open_in_new" className="text-xs" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto mb-24 md:mb-32">
        <h3 className="font-headline text-2xl md:text-3xl italic text-primary mb-12 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-8">
          {FAQ.map((f) => (
            <div key={f.q} className="border-b border-surface-variant pb-8">
              <h4 className="font-body text-lg text-primary mb-4">{f.q}</h4>
              <p className="text-on-surface-variant leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto py-32 md:py-48 border-t border-surface-container-high">
        <div className="max-w-4xl">
          <h2 className="font-headline text-4xl md:text-7xl italic text-primary mb-12 leading-tight">
            Interested in proactive intelligence for hotel operations?
          </h2>
          <a href="mailto:ivandemurard@gmail.com" className="inline-flex items-center group">
            <span className="font-headline text-2xl md:text-3xl italic text-secondary border-b border-secondary/20 group-hover:border-secondary transition-all duration-500 pb-1">
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
