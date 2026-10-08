import { SafeImage } from "@/components/SafeImage";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";
import { SectionDivider } from "@/components/SectionDivider";
import { CountUp } from "@/components/CountUp";
import { SOCIAL_LINKS, TRACK_RECORD, NOW_PROJECTS } from "@/content/site";

// Numeric milestones get a count-up. Textual ones stay static.
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
import portraitIvan from "@/assets/portrait-ivan.png";

const PRINCIPLES = [
  {
    icon: "trending_up",
    title: "Real business value",
    body: "Every product I ship has to move a number that matters: operational cost down, capacity freed, decisions sharpened. If it doesn't, it's a demo.",
  },
  {
    icon: "favorite",
    title: "Human interactions first",
    body: "Technology should give time back to people, not pull them deeper into screens. The best automation is the one that lets a host be more present.",
  },
  {
    icon: "architecture",
    title: "Full-stack 0 to 1 craft",
    body: "From insight to shipped product, bridging digital interfaces with physical operations, so the experience holds together end to end.",
  },
];

const METHOD = [
  {
    n: "01",
    title: "Problem analysis",
    body: "I start by understanding context, problem and architecture before writing a line. Field-level fluency before design.",
  },
  {
    n: "02",
    title: "Build",
    body: "I pick the lightest stack and methodology that solves the job, then iterate fast on real usage, not demos.",
  },
  {
    n: "03",
    title: "Continuous discovery",
    body: "I keep challenging the vision and roadmap by reading the market, the competition, and the weak signals.",
  },
  {
    n: "04",
    title: "Documenting",
    body: "I keep a single source of truth, so context, decisions, and learnings stay accessible to everyone who follows.",
  },
];

const Atrium = () => (
  <SiteLayout title="About">
    <Seo
      title="About Ivan de Murard, Product Builder"
      description="Ivan de Murard is a product builder based in Paris. Five years across start-ups, scale-ups and large groups, plus two years co-founding Sonor. Convictions, method, and track record."
      path="/atrium"
      type="profile"
    />
    <div className="relative pt-24 md:pt-32 pb-24 md:pb-32">
      {/* Hero */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-12 md:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
          <div className="lg:col-span-8">
            <span className="font-label uppercase tracking-[0.3em] text-[12px] text-secondary mb-8 block opacity-80">
              About
            </span>
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-primary leading-[1.05] tracking-tight italic mb-10">
              I'm Ivan, <br />
              <span className="text-on-primary-container opacity-90">a Product Builder.</span>
            </h1>
            <p className="font-body text-lg md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed whitespace-pre-line">
              I'm Ivan, a product builder with 5 years of experience across start-ups, scale-ups and
              large groups as a consultant, and 2 years co-founding a SaaS dedicated to noise
              pollution.{"\n"}I build with AI, while always keeping the human at the center.
            </p>
          </div>
          <div className="lg:col-span-4 h-[340px] lg:h-[440px] relative">
            <div
              aria-hidden="true"
              className="absolute -inset-6 gold-halo opacity-50 pointer-events-none"
            />
            <div className="relative h-full w-full overflow-hidden ring-1 ring-secondary-fixed-dim/30">
              <SafeImage
                src={portraitIvan}
                alt="Ivan de Murard, Product Builder"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-3 border border-secondary pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider label="Origin" />

      {/* Origin */}
      <section className="mb-12 md:mb-16">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <span className="font-label text-secondary mb-6 tracking-widest uppercase text-xs block">
            Origin
          </span>
          <h2 className="font-headline text-4xl md:text-6xl text-primary mb-10 italic">
            Where I come from
          </h2>
          <div className="space-y-6 font-body text-lg text-on-surface-variant leading-relaxed">
            <p>
              I started in agri-food business, passionate about food and where it came from, and
              working in hospitality. In 2017, I win my first team innovation competition, since then
              curiosity led me to explore various topics, environments, and organizations, always
              with the same drive: build meaningful, lasting products.
            </p>
            <p>
              Lately, I worked two years co-founding{" "}
              <a
                href="https://sonor.dorik.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline decoration-secondary/40 underline-offset-4 hover:decoration-secondary transition-colors"
              >
                Sonor
              </a>
              , a 0 to 1 open data SaaS for urban noise mapping, backed by Matrice and La Banque
              des Territoires, which taught me how to read a field, build with very little, and
              ship something cities actually used. Every role since has been a different angle on
              the same craft.
            </p>
          </div>
        </div>
      </section>

      {/* Track record */}
      <SectionDivider label="Track record" />

      {/* Track record */}
      <Reveal as="section" className="mb-12 md:mb-16 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="max-w-2xl mb-16 md:mb-20">
          <span className="font-label text-secondary mb-6 tracking-widest uppercase text-xs block">
            Track record
          </span>
          <h2 className="font-headline text-4xl md:text-6xl italic text-primary mb-6">
            Last Experiences
          </h2>
          <p className="text-on-surface-variant font-normal leading-relaxed">
            Four roles, four sizes of company, one constant: data-driven SaaS that lands in
            operations.
          </p>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {TRACK_RECORD.map((entry, i) => (
            <article
              key={`${entry.company}-${entry.range}`}
              data-reveal-child
              style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
              className="atrium-card p-10 bg-surface-container-low border border-outline-variant rounded-lg hover:border-outline-variant transition-all duration-500"
            >
              <span className="font-label italic text-secondary text-sm tracking-[0.18em] block mb-6">
                {entry.range}
              </span>
              <h3 className="font-headline italic text-2xl text-primary mb-2 leading-tight">
                {entry.role}
              </h3>
              <p className="font-label uppercase tracking-[0.18em] text-[11px] text-on-surface-variant mb-6">
                {entry.company}
              </p>
              <p className="text-on-surface-variant font-normal leading-relaxed">{entry.outcome}</p>
            </article>
          ))}
        </div>
      </Reveal>

      <SectionDivider label="Milestones" />

      {/* Milestones, moved here from the homepage: a track record belongs with the track record. */}
      <Reveal as="section" className="mb-12 md:mb-16 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="max-w-2xl mb-10 md:mb-16">
          <h2 className="font-headline text-4xl md:text-5xl italic text-primary mb-4 md:mb-6">
            Milestones
          </h2>
          <p className="text-on-surface-variant font-normal leading-relaxed">
            A few markers along the way.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-y-12">
          {MILESTONES.map((m, i) => (
            <div
              key={`${m.value}-${m.label}`}
              data-reveal-child
              style={{ ["--reveal-delay" as string]: `${200 + i * 70}ms` }}
              className="px-2 md:px-8 text-center"
            >
              <p className="font-headline italic text-4xl md:text-5xl text-primary mb-3">
                {m.kind === "count" ? <CountUp value={m.value} suffix={m.suffix ?? ""} /> : m.value}
              </p>
              <span
                className="underline-grow mx-auto mb-4 w-10"
                style={{ ["--reveal-delay" as string]: `${360 + i * 70}ms` }}
              />
              <p className="font-label uppercase tracking-[0.18em] text-[10px] text-on-surface-variant leading-relaxed">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <SectionDivider label="Now" />


      {/* Now */}
      <Reveal as="section" className="mb-12 md:mb-16 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="max-w-2xl mb-16 md:mb-20">
          <span className="font-label text-secondary mb-6 tracking-widest uppercase text-xs block">
            Now
          </span>
          <h2 className="font-headline text-4xl md:text-6xl italic text-primary mb-6">
            What I'm building
          </h2>
          <p className="text-on-surface-variant font-normal leading-relaxed">
            A handful of live builds, in hospitality operations, civic life, evaluation, music, and
            industrial knowledge. I work in public, with the source open whenever I can.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {NOW_PROJECTS.map((p, i) => {
            const Wrapper: React.ElementType = p.external ? "a" : Link;
            const wrapperProps = p.external
              ? { href: p.href, target: "_blank", rel: "noopener noreferrer" }
              : { to: p.href };
            return (
              <Wrapper
                key={p.name}
                {...(wrapperProps as Record<string, unknown>)}
                data-reveal-child
                style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
                className="atrium-card group p-10 bg-surface-container-low border border-outline-variant rounded-lg hover:border-outline-variant transition-all duration-500 flex flex-col"
              >
                <h3 className="font-headline italic text-2xl text-primary mb-4">{p.name}</h3>
                <p className="text-on-surface-variant font-normal leading-relaxed mb-8 flex-1">
                  {p.blurb}
                </p>
                <span className="inline-flex items-center gap-2 font-label uppercase tracking-[0.2em] text-[10px] text-secondary">
                  {p.meta}
                  <Icon
                    name={p.external ? "arrow_outward" : "arrow_forward"}
                    className="text-sm group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </Wrapper>
            );
          })}
        </div>
      </Reveal>

      {/* Principles, dark band */}
      <section className="principles-band relative py-32 md:py-48 overflow-hidden mb-12 md:mb-16">
        <div className="absolute inset-0 turner-gradient-warm opacity-15" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-12 text-center">
          <span className="font-label uppercase tracking-[0.3em] text-[12px] text-secondary-fixed mb-6 block opacity-80">
            Principles
          </span>
          <h2 className="font-headline text-4xl md:text-7xl text-surface mb-16 md:mb-20 italic">
            What I build with
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="p-10 md:p-12 bg-surface-container-high/15 backdrop-blur-2xl border border-outline-variant rounded-lg flex flex-col items-center text-center group transition-all duration-500 hover:bg-surface-container-high/25"
              >
                <Icon
                  name={p.icon}
                  className="text-surface text-4xl mb-8 group-hover:scale-110 transition-transform duration-500"
                />
                <h3 className="font-headline text-2xl text-surface-bright mb-4 italic">
                  {p.title}
                </h3>
                <p className="font-body text-surface-dim/85 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider label="Method" />

      {/* Method */}
      <Reveal as="section" className="mb-12 md:mb-16 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="max-w-2xl mb-16 md:mb-20">
          <span className="font-label text-secondary mb-6 tracking-widest uppercase text-xs block">
            Method
          </span>
          <h2 className="font-headline text-4xl md:text-6xl italic text-primary mb-6">
            How I work
          </h2>
          <p className="text-on-surface-variant font-normal leading-relaxed">
            A loop, not a waterfall. Four moves I keep returning to, on every project.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {METHOD.map((m, i) => (
            <div
              key={m.n}
              data-reveal-child
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
              className="atrium-card p-10 bg-surface-container-low border border-outline-variant rounded-lg hover:border-outline-variant transition-all duration-500"
            >
              <span className="font-headline italic text-secondary text-sm tracking-[0.2em] block mb-6">
                {m.n}
              </span>
              <h3 className="font-headline italic text-xl text-primary mb-4">{m.title}</h3>
              <p className="text-on-surface-variant font-normal leading-relaxed text-[15px]">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <SectionDivider label="Let's talk" />

      {/* Let's talk */}
      <Reveal as="section" className="relative px-6 md:px-12 max-w-5xl mx-auto text-center">
        <div className="farewell-card relative z-10 bg-gradient-to-br from-primary-fixed-dim/70 via-primary-fixed/60 to-surface-container-low p-12 md:p-20 rounded-2xl overflow-hidden ambient-shadow ring-1 ring-primary-fixed-dim/40">
          <span className="font-label uppercase tracking-[0.3em] text-[11px] text-secondary mb-6 block opacity-80">
            Let's talk
          </span>
          <h2 className="font-headline text-4xl md:text-6xl italic text-primary mb-6">
            Ready to build the future?
          </h2>
          <p className="text-on-surface font-normal mb-12 max-w-xl mx-auto leading-relaxed">
            Hiring leads, design partners, fellow builders, all welcome. Pick the door that suits
            you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10">
            <a
              href={SOCIAL_LINKS.schedule}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-on-primary hover:bg-secondary hover:text-on-secondary px-10 py-5 rounded-xl font-medium tracking-wide [transition:background-color_500ms_ease,color_500ms_ease,box-shadow_500ms_ease] ambient-shadow inline-flex items-center gap-3 group"
            >
              Book a call
              <Icon
                name="arrow_forward"
                className="text-sm group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href={SOCIAL_LINKS.email}
              className="border border-primary/40 text-primary hover:bg-primary hover:text-on-primary hover:border-primary px-10 py-5 rounded-xl font-medium tracking-wide [transition:background-color_500ms_ease,color_500ms_ease,border-color_500ms_ease] inline-flex items-center gap-3"
            >
              <Icon name="mail" className="text-sm" />
              Email
            </a>
            <Link
              to="/cv"
              className="text-secondary font-medium tracking-wide hover:underline decoration-secondary/30 underline-offset-8 transition-all duration-500 inline-flex items-center gap-2 group"
            >
              View the CV
              <Icon name="arrow_forward" className="text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 pt-8 border-t border-primary/10">
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-label uppercase tracking-[0.2em] text-[11px] text-on-surface-variant hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-label uppercase tracking-[0.2em] text-[11px] text-on-surface-variant hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <a
              href={SOCIAL_LINKS.x}
              target="_blank"
              rel="noopener noreferrer"
              className="font-label uppercase tracking-[0.2em] text-[11px] text-on-surface-variant hover:text-primary transition-colors"
            >
              X
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  </SiteLayout>
);

export default Atrium;
