import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { CaseHoverPreview } from "@/components/CaseHoverPreview";
import { SafeImage } from "@/components/SafeImage";
import { Compass, Cpu, HeartHandshake, BookOpen, Gauge, GitBranch } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo, personJsonLd, SITE } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";

import { SectionDivider } from "@/components/SectionDivider";
import { McpEndpoint } from "@/components/McpEndpoint";
import { PressMark } from "@/components/layout/PressMark";

import { PROJECTS, SOCIAL_LINKS } from "@/content/site";
import { JOURNAL_ENTRIES } from "@/content/journal";
import { useTrackClick } from "@/hooks/useTrackClick";


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


// Proof strip above the fold. Fixed figures, sourced in the labels.
type Proof =
  | { kind: "count"; value: number; prefix?: string; suffix?: string; display?: never; label: string }
  | { kind: "text"; display: string; label: string };

const PROOF: Proof[] = [
  { kind: "count", value: 500, suffix: "+", label: "users on an internal SaaS rolled out across 100 care homes" },
  { kind: "text", display: "€1.9M", label: "receivables tracked and 40% recovered through a decision tool" },
  { kind: "count", value: 22, label: "European public-sector clients onboarded, zero churn" },
];

// Latest Field Notes, newest first. Icons, not covers: a lighter register than case studies.
const NOTE_ICONS = [Gauge, BookOpen, GitBranch];
const LATEST_NOTES = [...JOURNAL_ENTRIES]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 3)
  .map((entry, i) => ({ entry, Icon: NOTE_ICONS[i % NOTE_ICONS.length] }));



type Project = (typeof PROJECTS)[keyof typeof PROJECTS];

const ProjectGroup = ({
  kicker,
  kickerHref,
  projects,
  track,
}: {
  kicker: string;
  kickerHref?: string;
  projects: Project[];
  track: ReturnType<typeof useTrackClick>;
}) => {
  const kickerEl = (
    <span className="font-label uppercase tracking-[0.2em] text-[11px] text-secondary border-b border-secondary pb-2">
      {kicker}
    </span>
  );
  return (
    <div>
      <div className="mb-10 md:mb-14">
        {kickerHref ? (
          <Link
            to={kickerHref}
            className="inline-block hover:tracking-[0.25em] transition-all"
          >
            {kickerEl}
          </Link>
        ) : (
          kickerEl
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {projects.map((p, i) => {
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
                  <p className="text-on-surface-variant font-normal leading-relaxed mt-4">{p.tagline}</p>
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
    </div>
  );
};

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
    <Reveal as="header" className="relative flex items-center justify-center pt-28 md:pt-32 pb-10 md:pb-14 px-6 md:px-8 overflow-hidden">
      <div className="relative z-10 max-w-5xl w-full text-center">
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
            className="headline-ink relative z-10 font-headline text-5xl md:text-7xl text-primary leading-[1.1] italic perspective-text"
          >
            Product builder.
            <span className="block text-primary-container">Agentic AI systems for operations.</span>
          </h1>

        </div>
        <p
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "360ms" }}
          className="mt-10 text-lg md:text-xl text-on-surface max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Product builder. Five years inside operations -
          <br />
          Founder → scale-up → large groups → builder.
          <br />
          Vision → architecture → evaluation → continuous and autonomous improvement.
        </p>
        {/* Proof strip. Fixed figures, no numeric tween: these are evidence, not decoration. */}
        <div
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "450ms" }}
          className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 max-w-3xl mx-auto"
        >
          {PROOF.map((p) => (
            <div key={p.label} className="px-2 sm:px-6 text-center">
              <p className="font-headline italic text-3xl md:text-4xl text-primary mb-3">
                {p.kind === "count"
                  ? `${p.prefix ?? ""}${p.value}${p.suffix ?? ""}`
                  : p.display}
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
          className="mt-10 md:mt-14 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8"
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
          <a
            href={SOCIAL_LINKS.schedule}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track({ label: "Book a call", href: SOCIAL_LINKS.schedule, kind: "nav" })}
            className="text-secondary font-medium tracking-wide hover:underline decoration-secondary/30 underline-offset-8 transition-all duration-500 flex items-center gap-2 group"
          >
            Book a call
            <Icon name="arrow_outward" className="text-sm group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </Reveal>


    <SectionDivider index="01" label="Case Studies" spacing="tight" />

    {/* Case Studies */}
    <Reveal as="section" className="py-10 md:py-24 px-6 md:px-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-24 gap-6 md:gap-8">
        <div className="max-w-xl">
          <h2
            data-reveal-child
            className="headline-ink font-headline text-4xl md:text-5xl italic text-primary mb-4 md:mb-6"
          >
            Case Studies
          </h2>
          <p
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "120ms" }}
            className="text-on-surface-variant font-normal leading-relaxed"
          >
            Three to start with: the flagship agent of the{" "}
            <Link to="/architecture" className="text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity">
              Hospitality Multi-Agent Architecture
            </Link>
            , a voice mentor for aviation maintenance, and the SaaS I co-founded. The rest sit on the case studies page.
          </p>
        </div>
        <Link
          to="/journeys"
          className="font-label uppercase tracking-[0.2em] text-[11px] text-secondary border-b border-secondary pb-2 hover:tracking-[0.25em] transition-all"
        >
          Explore all stories
        </Link>
      </div>

      <ProjectGroup
        kicker="Selected work"
        projects={[PROJECTS.atherix, PROJECTS.lore, PROJECTS.sonor]}
        track={track}
      />
    </Reveal>


    <SectionDivider index="02" label="Field Notes" />

    {/* Field Notes, a lighter register: icons, no covers */}
    <Reveal as="section" className="py-10 md:py-24 px-6 md:px-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-20 gap-6 md:gap-8">
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
            className="text-on-surface-variant font-normal leading-relaxed"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl">
        {LATEST_NOTES.map(({ entry, Icon: NoteIcon }, i) => (
          <Link
            key={entry.slug}
            to={`/journal/${entry.slug}`}
            onClick={() => track({ label: entry.title, href: `/journal/${entry.slug}`, kind: "nav" })}
            data-reveal-child
            style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            className="lift-card group p-8 bg-surface-container-low border border-outline-variant rounded-lg hover:border-secondary hover:bg-surface-container-lowest"
          >
            <NoteIcon size={24} strokeWidth={1.25} className="text-secondary mb-6" />
            <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary block mb-4">
              {entry.category}
              <span className="before:content-['/'] before:mx-2 before:text-outline">
                {new Date(entry.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
              </span>
            </span>
            <h3 className="font-headline italic text-2xl text-primary mb-4">{entry.title}</h3>
            <p className="text-on-surface-variant font-normal leading-relaxed">{entry.excerpt}</p>
          </Link>
        ))}
      </div>
    </Reveal>

    <SectionDivider index="03" label="Approach" />

    {/* My approach: convictions and the method that follows from them */}
    <Reveal as="section" className="py-10 md:py-24 px-6 md:px-8 max-w-screen-2xl mx-auto">
      <div className="max-w-2xl mb-10 md:mb-20">
        <h2
          data-reveal-child
          className="headline-ink font-headline text-4xl md:text-5xl italic text-primary mb-4 md:mb-6"
        >
          My approach
        </h2>
        <p
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "120ms" }}
          className="text-on-surface-variant font-normal leading-relaxed"
        >
          Three convictions that shape every product I build, and the method that follows from them.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
        {CONVICTIONS.map(({ Icon: ConvIcon, title, body }, i) => (
          <div
            key={title}
            data-reveal-child
            style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            className="lift-card p-7 md:p-10 bg-surface-container-low border border-outline-variant rounded-lg hover:border-secondary hover:bg-surface-container-lowest"
          >
            <ConvIcon size={28} strokeWidth={1.25} className="text-secondary mb-6 md:mb-8" />
            <h3 className="font-headline italic text-2xl text-primary mb-3 md:mb-4">{title}</h3>
            <p className="text-on-surface-variant font-normal leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
      <p
        data-reveal-child
        style={{ ["--reveal-delay" as string]: "320ms" }}
        className="mt-8 md:mt-12 text-on-surface-variant font-normal leading-relaxed max-w-2xl"
      >
        In practice: read the ground first, turn that reading into shipped product decisions, and pick the lightest
        mechanism that solves the job, with the human always in the loop.{" "}
        <Link
          to="/atrium"
          className="text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
        >
          The track record behind it
        </Link>
        .
      </p>
    </Reveal>

    {/* A machine-readable proof point, kept secondary to the work itself. */}
    <Reveal as="section" className="py-8 md:py-14 px-6 md:px-8 max-w-screen-2xl mx-auto">
      <div data-reveal-child>
        <McpEndpoint label="Built for people. Available to their agents." compact />
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
        <p className="text-on-surface font-normal mb-12 max-w-lg mx-auto relative z-10">
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
