import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { CaseHoverPreview } from "@/components/CaseHoverPreview";
import { SafeImage } from "@/components/SafeImage";
import { Compass, Cpu, HeartHandshake, BookOpen, Gauge, GitBranch } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo, personJsonLd, SITE } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { SectionDivider } from "@/components/SectionDivider";
import { PROJECTS, SOCIAL_LINKS } from "@/content/site";
import { JOURNAL_ENTRIES } from "@/content/journal";
import { useTrackClick } from "@/hooks/useTrackClick";


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

// Proof strip above the fold. Same numeral treatment as Milestones.
type Proof =
  | { kind: "count"; value: number; prefix?: string; suffix?: string; display?: never; label: string }
  | { kind: "text"; display: string; label: string };

const PROOF: Proof[] = [
  { kind: "count", value: 500, suffix: "+", label: "users on an internal SaaS rolled out across 100 care homes" },
  { kind: "text", display: "€1.9M", label: "receivables tracked and 40% recovered through a decision tool" },
  { kind: "count", value: 22, label: "European public-sector clients onboarded, zero churn" },
];

const Index = () => {
  const track = useTrackClick();
  return (
  <SiteLayout>

    <Seo
      title="Ivan de Murard, product builder, agentic AI for operations"
      rawTitle
      description="Product builder in Paris. 5 years across start-ups, scale-ups and large groups, plus 2 years co-founding a SaaS. Designs from ops, ships with AI."
      path="/"
      jsonLd={[
        personJsonLd,
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Ivan de Murard",
          url: SITE.url,
          inLanguage: "en",
        },
      ]}
    />
    {/* Hero */}
    <Reveal as="header" className="relative min-h-screen flex items-center justify-center pt-28 md:pt-32 px-6 md:px-8 overflow-hidden">
      <div className="relative z-10 max-w-5xl w-full text-center">
        <span
          data-reveal-child
          className="font-label uppercase tracking-[0.3em] text-[12px] text-secondary mb-8 block opacity-80 relative z-10"
        >
          Welcome, it's good to see you.
        </span>
        <div className="relative">
          {/* Animated gold halo, perfect circle concentrated behind the headline + subtitle */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[42%] w-[620px] h-[400px] max-w-[96vw] max-h-[62vw] pointer-events-none z-0"
          >
            <div className="w-full h-full rounded-full gold-halo gold-halo-pulse" />
          </div>
          <h1
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "120ms" }}
            className="headline-ink relative z-10 font-headline text-4xl md:text-6xl text-primary leading-[1.15] italic perspective-text"
          >
            I build agentic AI systems to continually improve operations, knowledge, and experience.
          </h1>
        </div>
        <p
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "360ms" }}
          className="mt-10 text-lg md:text-xl text-on-surface max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Product builder, Paris. Five years across start-ups, scale-ups and large groups, plus two years co-founding a SaaS. Currently building an architecture of specialised agents for hotel operations.
        </p>
        {/* Proof strip, the Milestones numeral treatment promoted above the fold */}
        <div
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "450ms" }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 max-w-3xl mx-auto sm:divide-x sm:divide-outline-variant"
        >
          {PROOF.map((p) => (
            <div key={p.label} className="px-2 sm:px-6 text-center">
              <p className="font-headline italic text-3xl md:text-4xl text-primary mb-3">
                {p.kind === "count" ? (
                  <CountUp value={p.value} suffix={p.suffix ?? ""} prefix={p.prefix ?? ""} />
                ) : (
                  p.display
                )}
              </p>
              <span className="underline-grow mx-auto mb-4 w-10" />
              <p className="font-label uppercase tracking-[0.18em] text-[10px] text-on-surface-variant leading-relaxed">
                {p.label}
              </p>
            </div>
          ))}
        </div>
        <div
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "540ms" }}
          className="mt-14 flex flex-col md:flex-row items-center justify-center gap-8"
        >
          <Link
            to="/journeys"
            onClick={() => track({ label: "Case Studies", href: "/journeys", kind: "nav" })}
            className="bg-primary text-on-primary px-10 py-5 rounded-xl font-medium tracking-wide hover:bg-secondary hover:text-on-secondary transition-all duration-500 ambient-shadow"
          >
            Case Studies
          </Link>
          <Link
            to="/atrium"
            onClick={() => track({ label: "About", href: "/atrium", kind: "nav" })}
            className="text-secondary font-medium tracking-wide hover:underline decoration-secondary/30 underline-offset-8 transition-all duration-500 flex items-center gap-2 group"
          >
            About
            <Icon name="arrow_forward" className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {/* Scroll cue */}
        <div
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "780ms" }}
          aria-hidden="true"
          className="mt-16 md:mt-20 flex flex-col items-center gap-2 text-on-surface-variant"
        >
          <span className="font-label uppercase tracking-[0.3em] text-[10px]">Scroll</span>
          <Icon name="keyboard_arrow_down" className="text-base animate-bounce" />
        </div>
      </div>
    </Reveal>


    {/* Signature line, a quiet breath */}
    <Reveal as="section" className="py-16 md:py-24 px-6 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <p
          data-reveal-child
          className="headline-ink font-headline italic text-2xl md:text-4xl text-primary leading-snug"
        >
          Five years reading operations from the inside, in care homes, telecom finance and city halls. I now build the
          agents that carry what those teams know: covers and staffing for a hotel, a retiring technician's judgement, a
          guest relationship.
        </p>
      </div>
    </Reveal>

    <SectionDivider index="01" label="Case Studies" />

    {/* Case Studies */}
    <Reveal as="section" className="py-16 md:py-24 px-6 md:px-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
        <div className="max-w-xl">
          <h2
            data-reveal-child
            className="headline-ink font-headline text-4xl md:text-5xl italic text-primary mb-6"
          >
            Case Studies
          </h2>
          <p
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "120ms" }}
            className="text-on-surface-variant font-light leading-relaxed"
          >
            A small selection of recent projects and collaborations, driven by curiosity and a passion for hands-on
            crafting.
          </p>
        </div>
        <Link
          to="/journeys"
          className="font-label uppercase tracking-[0.2em] text-[11px] text-secondary border-b border-secondary pb-2 hover:tracking-[0.25em] transition-all"
        >
          Explore all stories
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {Object.values(PROJECTS).map((p, i) => {
          const isExternal = "external" in p && p.external;
          const inner = (
            <>
              <div className="aspect-[4/3] overflow-hidden bg-surface-container-high rounded-lg relative">
                {isExternal ? (
                  <SafeImage
                    src={p.image}
                    alt={`${p.name} project preview`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <CaseHoverPreview
                    slug={p.slug}
                    image={p.image}
                    alt={`${p.name} project preview`}
                    className="w-full h-full"
                  />
                )}
                <div className="absolute inset-0 bg-primary/5 transition-opacity duration-700 group-hover:opacity-0 pointer-events-none" />
              </div>
              <div className="mt-8 px-2 pb-2 flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-headline text-3xl italic text-primary">{p.name}</h3>
                  <p className="text-on-surface-variant font-light leading-relaxed mt-4">{p.tagline}</p>
                  <p className="font-label uppercase tracking-widest text-[10px] text-on-surface-variant mt-4">
                    {p.label}
                  </p>
                </div>
                {isExternal ? (
                  <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary shrink-0">
                    External
                  </span>
                ) : (
                  <Icon
                    name="arrow_outward"
                    className="text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                  />
                )}
              </div>
            </>
          );
          const cardClass =
            "lift-card group block p-4 rounded-xl border border-outline-variant bg-surface-container-low/40 hover:border-outline-variant";
          return isExternal ? (
            <a
              key={p.slug}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track({ label: p.name, href: p.href, kind: "project" })}
              className={cardClass}
              data-reveal-child
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            >
              {inner}
            </a>
          ) : (
            <Link
              key={p.slug}
              to={`/${p.slug}`}
              onClick={() => track({ label: p.name, href: `/${p.slug}`, kind: "project" })}
              className={cardClass}
              data-reveal-child
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </Reveal>

    <SectionDivider index="02" label="Field Notes" />

    {/* Field Notes, a lighter register: icons, no covers */}
    <Reveal as="section" className="py-16 md:py-24 px-6 md:px-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-20 gap-8">
        <div className="max-w-xl">
          <h2
            data-reveal-child
            className="headline-ink font-headline text-4xl md:text-5xl italic text-primary mb-6"
          >
            Field Notes
          </h2>
          <p
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "120ms" }}
            className="text-on-surface-variant font-light leading-relaxed"
          >
            What I learn while building, written to be used.
          </p>
        </div>
        <Link
          to="/journal"
          className="font-label uppercase tracking-[0.2em] text-[11px] text-secondary border-b border-secondary pb-2 hover:tracking-[0.25em] transition-all"
        >
          Read all notes
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {LATEST_NOTES.map(({ entry, Icon: NoteIcon }, i) => (
          <Link
            key={entry.slug}
            to={`/journal/${entry.slug}`}
            onClick={() => track({ label: entry.title, href: `/journal/${entry.slug}`, kind: "journal" })}
            data-reveal-child
            style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            className="lift-card group p-10 bg-surface-container-low border border-outline-variant rounded-lg hover:border-secondary hover:bg-surface-container-lowest"
          >
            <NoteIcon size={28} strokeWidth={1.25} className="text-secondary mb-8" />
            <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary block mb-4">
              {entry.category}
              <span className="before:content-['/'] before:mx-2 before:text-outline">
                {new Date(entry.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
              </span>
            </span>
            <h3 className="font-headline italic text-2xl text-primary mb-4">{entry.title}</h3>
            <p className="text-on-surface-variant font-light leading-relaxed">{entry.excerpt}</p>
          </Link>
        ))}
      </div>
    </Reveal>

    <SectionDivider index="03" label="Approach" />

    {/* My approach, convictions */}
    <Reveal as="section" className="py-16 md:py-24 px-6 md:px-8 max-w-screen-2xl mx-auto">
      <div className="max-w-2xl mb-16 md:mb-20">
        <h2
          data-reveal-child
          className="headline-ink font-headline text-4xl md:text-5xl italic text-primary mb-6"
        >
          My approach
        </h2>
        <p
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "120ms" }}
          className="text-on-surface-variant font-light leading-relaxed"
        >
          Three convictions that shape every product I build.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {CONVICTIONS.map(({ Icon: ConvIcon, title, body }, i) => (
          <div
            key={title}
            data-reveal-child
            style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            className="lift-card p-10 bg-surface-container-low border border-outline-variant rounded-lg hover:border-secondary hover:bg-surface-container-lowest"
          >
            <ConvIcon size={28} strokeWidth={1.25} className="text-secondary mb-8" />
            <h3 className="font-headline italic text-2xl text-primary mb-4">{title}</h3>
            <p className="text-on-surface-variant font-light leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </Reveal>

    <SectionDivider index="04" label="Method" />

    {/* How I work, three pillars */}
    <Reveal as="section" className="py-16 md:py-24 px-6 md:px-8 max-w-screen-2xl mx-auto">
      <div className="max-w-2xl mb-16 md:mb-20">
        <h2
          data-reveal-child
          className="headline-ink font-headline text-4xl md:text-5xl italic text-primary mb-6"
        >
          How I work
        </h2>
        <p
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "120ms" }}
          className="text-on-surface-variant font-light leading-relaxed"
        >
          And how those convictions translate into a working method.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {PILLARS.map(({ n, Icon: PillarIcon, title, body }, i) => (
          <div
            key={title}
            data-reveal-child
            style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            className="lift-card p-10 bg-surface-container-low border border-outline-variant rounded-lg hover:border-secondary hover:bg-surface-container-lowest"
          >
            <span className="font-label text-[10px] uppercase tracking-[0.25em] text-secondary block mb-6">{n}</span>
            <PillarIcon size={28} strokeWidth={1.25} className="text-secondary mb-8" />
            <h3 className="font-headline italic text-2xl text-primary mb-4">{title}</h3>
            <p className="text-on-surface-variant font-light leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </Reveal>

    <SectionDivider index="05" label="Milestones" />

    {/* Milestones, proof bar */}
    <Reveal as="section" className="py-16 md:py-20 px-6 md:px-8 max-w-screen-2xl mx-auto">
      <div className="max-w-2xl mb-16 md:mb-20">
        <h2
          data-reveal-child
          className="headline-ink font-headline text-4xl md:text-5xl italic text-primary mb-6"
        >
          Milestones
        </h2>
        <p
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "120ms" }}
          className="text-on-surface-variant font-light leading-relaxed"
        >
          A few markers along the way.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12">
        {MILESTONES.map((m, i) => (
          <div
            key={`${m.value}-${m.label}`}
            data-reveal-child
            style={{ ["--reveal-delay" as string]: `${200 + i * 70}ms` }}
            className="px-2 md:px-8 text-center"
          >
            <p className="font-headline italic text-4xl md:text-5xl text-primary mb-3">
              {m.kind === "count" ? (
                <CountUp value={m.value} suffix={m.suffix ?? ""} />
              ) : (
                m.value
              )}
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


    {/* Thank you for your visit, a cool blue bookend on the warm dusk page-light */}
    <Reveal as="section" className="relative py-16 md:py-24 px-6 md:px-8 max-w-5xl mx-auto text-center">
      {/* Faint drifting halo behind the farewell card */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <div className="halo-drift w-[80%] h-[80%] rounded-full bg-gradient-to-br from-primary-fixed/40 via-secondary-fixed/20 to-transparent blur-3xl opacity-60" />
      </div>
      <div className="farewell-card relative z-10 bg-gradient-to-br from-primary-fixed-dim/70 via-primary-fixed/60 to-surface-container-low p-12 md:p-24 rounded-2xl overflow-hidden group ambient-shadow ring-1 ring-primary-fixed-dim/40">
        <div className="absolute inset-0 bg-primary-fixed-dim/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <h2 className="font-headline text-4xl md:text-5xl italic text-primary mb-8 relative z-10">
          Thank you for your visit
        </h2>
        <p className="text-on-surface font-light mb-12 max-w-lg mx-auto relative z-10">
          Contact. Let's discuss how to create business value and meaningful human experiences for your
          operations or users.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 relative z-10">
          <a
            href={SOCIAL_LINKS.email}
            aria-label="Email Ivan"
            className="text-primary font-medium border-b border-primary/60 pb-1 font-headline italic tracking-wide hover:text-primary hover:border-primary transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
          >
            Email
          </a>
          <a
            href={SOCIAL_LINKS.schedule}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book a call with Ivan"
            className="text-primary font-medium border-b border-primary/60 pb-1 font-headline italic tracking-wide hover:text-primary hover:border-primary transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
          >
            Book a Call
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ivan on LinkedIn"
            className="text-primary font-medium border-b border-primary/60 pb-1 font-headline italic tracking-wide hover:text-primary hover:border-primary transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
          >
            LinkedIn
          </a>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ivan on GitHub"
            className="text-primary font-medium border-b border-primary/60 pb-1 font-headline italic tracking-wide hover:text-primary hover:border-primary transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
          >
            GitHub
          </a>
        </div>
      </div>
    </Reveal>
  </SiteLayout>
  );
};

export default Index;
