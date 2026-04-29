import { Link } from "react-router-dom";
import { Compass, Cpu, HeartHandshake } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { PROJECTS, SOCIAL_LINKS } from "@/content/site";

const PILLARS = [
  {
    n: "01",
    Icon: Compass,
    title: "Reading the ground",
    body: "Field-level fluency in operations (boutique hotels, F&B, design partners, open-data ecosystems). I learn an environment before I design for it.",
  },
  {
    n: "02",
    Icon: Cpu,
    title: "From insight to product decisions",
    body: "I turn that reading into shipped products. Aetherix is the proof: a real operating layer for boutique hotels, not a slideware concept.",
  },
  {
    n: "03",
    Icon: HeartHandshake,
    title: "Right tool for the problem",
    body: "Sometimes a workflow, sometimes a checklist, sometimes an agentic system. I pick the lightest mechanism that solves the job, with the human always in the loop.",
  },
];

const CONVICTIONS = [
  {
    Icon: HeartHandshake,
    title: "Human interactions first",
    body: "Technology should give time back to people, not pull them deeper into screens. The best automation is the one that lets a host be more present.",
  },
  {
    Icon: Compass,
    title: "Real business value",
    body: "Reducing operational costs, freeing capacity, sharpening decisions. Every product I ship has to move a number that matters to the business.",
  },
  {
    Icon: Cpu,
    title: "Full-stack 0→1 craft",
    body: "From insight to shipped product, bridging digital interfaces and physical operations, so the experience holds together end to end.",
  },
];

// Numeric milestones get a count-up. Textual ones (MCP, Field, Paris) stay static.
type Milestone =
  | { kind: "count"; value: number; suffix?: string; label: string }
  | { kind: "text"; value: string; label: string };

const MILESTONES: Milestone[] = [
  { kind: "count", value: 5, suffix: " yrs", label: "Product Management experience" },
  { kind: "count", value: 10, suffix: "+", label: "Products launched (DomusVi, Bouygues Telecom, Opendatasoft, …)" },
  { kind: "count", value: 2, suffix: " yrs", label: "Co-founder & Product Lead, Sonor" },
  {
    kind: "count",
    value: 4,
    label: "Sizes of companies explored (entrepreneur, start-up, scale-up, large group)",
  },
  { kind: "text", value: "MCP", label: "Agentic architecture (Aetherix)" },
  { kind: "text", value: "Field", label: "Hotel & F&B design partners" },
  { kind: "count", value: 2, label: "Hackathons won" },
  { kind: "text", value: "Paris", label: "Based" },
];

const Index = () => (
  <SiteLayout title="The Atrium">
    {/* Hero */}
    <header className="relative min-h-screen flex items-center justify-center pt-24 px-6 md:px-8 overflow-hidden">
      <div className="relative z-10 max-w-5xl w-full text-center">
        <span className="font-label uppercase tracking-[0.3em] text-[12px] text-secondary mb-8 block opacity-80 relative z-10">
          Ivan de Murard
        </span>
        <div className="relative">
          {/* Animated gold halo, perfect circle concentrated behind the headline + subtitle */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] w-[620px] h-[440px] max-w-[96vw] max-h-[70vw] pointer-events-none z-0"
          >
            <div className="w-full h-full rounded-full gold-halo gold-halo-pulse" />
          </div>
          <h1 className="relative z-10 font-headline text-5xl md:text-8xl text-primary leading-[1.1] italic perspective-text">
            Welcome,
            <br />
            <span className="text-on-primary-container opacity-90">It's great to see you!</span>
          </h1>
        </div>
        <p className="mt-12 text-lg md:text-xl text-on-surface/85 max-w-2xl mx-auto leading-relaxed font-normal">
          I build AI-powered systems that quietly deliver measurable business impact by reducing
          operational costs, eliminating waste, sharing intelligence, while keeping the human at the center.
        </p>
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8">
          <Link
            to="/journeys"
            className="bg-primary text-on-primary px-10 py-5 rounded-xl font-medium tracking-wide hover:opacity-90 transition-all duration-500 ambient-shadow"
          >
            Step inside
          </Link>
          <Link
            to="/journeys"
            className="text-secondary font-medium tracking-wide hover:underline decoration-secondary/30 underline-offset-8 transition-all duration-500 flex items-center gap-2 group"
          >
            View the Journeys
            <Icon name="arrow_forward" className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </header>

    {/* Milestones, proof bar right after the hero */}
    <Reveal as="section" className="py-24 md:py-28 px-6 md:px-8 max-w-screen-2xl mx-auto">
      <div className="max-w-2xl mb-16 md:mb-20">
        <h2 className="font-headline text-4xl md:text-5xl italic text-primary mb-6">Milestones</h2>
        <p className="text-on-surface-variant font-light leading-relaxed">
          A few markers along the way.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 md:divide-x md:divide-outline-variant/20">
        {MILESTONES.map((m, i) => (
          <div
            key={`${m.value}-${m.label}`}
            data-reveal-child
            style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
            className={[
              "px-2 md:px-8 text-center",
              i >= 4 ? "md:border-t md:border-outline-variant/15 md:pt-12" : "",
            ].join(" ")}
          >
            <p className="font-headline italic text-4xl md:text-5xl text-primary mb-4">
              {m.kind === "count" ? (
                <CountUp value={m.value} suffix={m.suffix ?? ""} />
              ) : (
                m.value
              )}
            </p>
            <p className="font-label uppercase tracking-[0.18em] text-[10px] text-on-surface-variant leading-relaxed">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </Reveal>

    {/* Signature line, a quiet breath */}
    <Reveal as="section" className="py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-px h-16 bg-primary/20 mx-auto mb-12" />
        <p className="font-headline italic text-2xl md:text-4xl text-primary leading-snug">
          I read environments from the inside, then turn what I see into products that create real business value while keeping human interactions at the center.
        </p>
        <div className="w-px h-16 bg-primary/20 mx-auto mt-12" />
      </div>
    </Reveal>

    {/* Case Studies */}
    <Reveal as="section" className="py-24 md:py-32 px-6 md:px-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
        <div className="max-w-xl">
          <h2 className="font-headline text-4xl md:text-5xl italic text-primary mb-6">Case Studies</h2>
          <p className="text-on-surface-variant font-light leading-relaxed">
            A small selection of recent projects and collaborations, driven by curiosity and a passion for hands-on
            crafting.
          </p>
        </div>
        <Link
          to="/journeys"
          className="font-label uppercase tracking-[0.2em] text-[11px] text-secondary border-b border-secondary/20 pb-2 hover:tracking-[0.25em] transition-all"
        >
          Explore all stories
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {Object.values(PROJECTS).map((p, i) => (
          <Link
            key={p.slug}
            to={`/${p.slug}`}
            className="group block"
            data-reveal-child
            style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}
          >
            <div className="aspect-[4/3] overflow-hidden bg-surface-container-high rounded-lg relative">
              <img
                src={p.image}
                alt={`${p.name} project preview`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-primary/5 transition-opacity duration-700 group-hover:opacity-0" />
            </div>
            <div className="mt-8 flex justify-between items-start">
              <div>
                <h3 className="font-headline text-3xl italic text-primary">{p.name}</h3>
                <p className="text-on-surface-variant font-light leading-relaxed mt-4">{p.tagline}</p>
                <p className="font-label uppercase tracking-widest text-[10px] text-on-surface-variant mt-4">
                  {p.label}
                </p>
              </div>
              <Icon
                name="arrow_outward"
                className="text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
              />
            </div>
          </Link>
        ))}
      </div>
    </Reveal>

    {/* My approach, convictions */}
    <Reveal as="section" className="py-24 md:py-32 px-6 md:px-8 max-w-screen-2xl mx-auto">
      <div className="max-w-2xl mb-16 md:mb-20">
        <h2 className="font-headline text-4xl md:text-5xl italic text-primary mb-6">My approach</h2>
        <p className="text-on-surface-variant font-light leading-relaxed">
          Three convictions that shape every product I build.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {CONVICTIONS.map(({ Icon: ConvIcon, title, body }, i) => (
          <div
            key={title}
            data-reveal-child
            style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
            className="p-10 bg-surface-container-low border border-outline-variant/15 rounded-lg hover:border-outline-variant/40 transition-all duration-500"
          >
            <ConvIcon size={28} strokeWidth={1.25} className="text-secondary mb-8" />
            <h3 className="font-headline italic text-2xl text-primary mb-4">{title}</h3>
            <p className="text-on-surface-variant font-light leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </Reveal>

    {/* How I work, three pillars */}
    <Reveal as="section" className="py-24 md:py-32 px-6 md:px-8 max-w-screen-2xl mx-auto">
      <div className="max-w-2xl mb-16 md:mb-20">
        <h2 className="font-headline text-4xl md:text-5xl italic text-primary mb-6">How I work</h2>
        <p className="text-on-surface-variant font-light leading-relaxed">
          And how those convictions translate into a working method.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {PILLARS.map(({ n, Icon: PillarIcon, title, body }, i) => (
          <div
            key={title}
            data-reveal-child
            style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
            className="p-10 bg-surface-container-low border border-outline-variant/15 rounded-lg hover:border-outline-variant/40 transition-all duration-500"
          >
            <span className="font-headline italic text-secondary text-sm tracking-[0.2em] block mb-6">{n}</span>
            <PillarIcon size={28} strokeWidth={1.25} className="text-secondary mb-8" />
            <h3 className="font-headline italic text-2xl text-primary mb-4">{title}</h3>
            <p className="text-on-surface-variant font-light leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </Reveal>

    {/* Thank you for your visit, with a soft blue halo bookend */}
    <Reveal as="section" className="relative py-24 md:py-32 px-6 md:px-8 max-w-5xl mx-auto text-center">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] max-w-[110vw] max-h-[110vw] aspect-square rounded-full gold-halo gold-halo-pulse pointer-events-none z-0"
      />
      <div className="relative z-10 bg-gradient-to-br from-secondary-fixed/60 via-secondary-fixed-dim/40 to-surface-container-low p-12 md:p-24 rounded-lg overflow-hidden group ambient-shadow ring-1 ring-secondary-fixed-dim/40">
        <div className="absolute inset-0 bg-secondary-fixed-dim/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <h2 className="font-headline text-4xl md:text-5xl italic text-primary mb-8 relative z-10">
          Thank you for your visit
        </h2>
        <p className="text-on-surface-variant font-light mb-12 max-w-lg mx-auto relative z-10">
          Shall we meet again? Let's discuss how to create business value and meaningful human experiences for your
          operations or users.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 relative z-10">
          <a
            href={SOCIAL_LINKS.email}
            className="text-primary font-medium border-b border-primary/50 pb-1 font-headline italic tracking-wide hover:opacity-70 transition-all"
          >
            Email
          </a>
          <a
            href={SOCIAL_LINKS.schedule}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium border-b border-primary/50 pb-1 font-headline italic tracking-wide hover:opacity-70 transition-all"
          >
            Book a Call
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium border-b border-primary/50 pb-1 font-headline italic tracking-wide hover:opacity-70 transition-all"
          >
            LinkedIn
          </a>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium border-b border-primary/50 pb-1 font-headline italic tracking-wide hover:opacity-70 transition-all"
          >
            GitHub
          </a>
        </div>
      </div>
    </Reveal>
  </SiteLayout>
);

export default Index;
