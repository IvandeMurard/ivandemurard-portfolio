import { useCallback, useEffect, useRef, useState } from "react";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { cn } from "@/lib/utils";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { PROJECTS } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { useReveal } from "@/hooks/useReveal";
import { useTrackClick } from "@/hooks/useTrackClick";
import { SafeImage } from "@/components/SafeImage";

type Tint = { h: number; s: number; l: number; a: number };

type Act = {
  group: "mesh" | "standalone";
  kicker: string;
  slug: string;
  name: string;
  body: string;
  /** Extra line placing the act relative to the mesh. */
  note?: string;
  image: string;
  cta: string;
  tint: Tint;
  flip?: boolean;
};

/** The five agents of the mesh, in the order they exist. */
const MESH_AGENTS: { name: string; role: string; status: string; to?: string }[] = [
  { name: "Aetherix", role: "F&B execution", status: "Built, tested on historical data, and staged for production. Ready for a 30-day pilot.", to: "/aetherix" },
  { name: "Tacet", role: "Environmental signal", status: "Built", to: "/tacet" },
  { name: "Anima", role: "Guest memory", status: "Synthetic PoC", to: "/anima" },
  { name: "Peritia", role: "House knowledge", status: "Design" },
  { name: "Orchestrator", role: "Supervisory routing", status: "Design" },
];

const ACTS: Act[] = [
  {
    group: "mesh",
    kicker: "The Hospitality Multi-Agent Architecture",
    slug: "aetherix",
    name: PROJECTS.atherix.name,
    body: "The F&B agent for boutique hotels, without another dashboard. One daily recommendation, one-tap manager feedback, audited against real covers so it learns from every shift. Built, tested on historical data, and staged for production. Ready for a 30-day pilot.",
    note: "The food and beverage agent of the architecture.",
    image: PROJECTS.atherix.image,
    cta: "Trace the Path",
    tint: { h: 38, s: 70, l: 55, a: 0.16 },
    flip: true,
  },
  {
    group: "mesh",
    kicker: "The Hospitality Multi-Agent Architecture",
    slug: "tacet",
    name: PROJECTS.tacet.name,
    body: "The Synthetic Acoustic Twin. A headless intelligence layer for hotels: a physics-based, software-only acoustic model that predicts how construction, traffic, weather and events affect guest rooms, then pushes JSON alerts to RMS and PMS for proactive yield management.",
    note: "The environmental agent of the architecture.",
    image: PROJECTS.tacet.image,
    cta: "Begin the Ascent",
    tint: { h: 230, s: 45, l: 22, a: 0.22 },
  },
  {
    group: "mesh",
    kicker: "The Hospitality Multi-Agent Architecture",
    slug: "anima",
    name: PROJECTS.anima.name,
    body: "The guest memory node, and the one that is not allowed to simply accumulate. Four memory layers with different lifetimes, claims that carry a weight and a source and decay unless renewed, and a scope gate that makes asking for a whole person impossible. Built, evaluated on synthetic data, and deliberately not switched on.",
    note: "The guest memory node.",
    image: PROJECTS.anima.image,
    cta: "Read the Constraint",
    tint: { h: 200, s: 40, l: 30, a: 0.18 },
    flip: true,
  },
  {
    group: "standalone",
    kicker: "Standalone project",
    slug: "lore",
    name: PROJECTS.lore.name,
    body: "A living memory for a trade that is handed down out loud. Lore captures what a retiring aviation technician knows and never wrote down, then gives it back to a junior on the shop floor by voice, always behind the procedure, graded by a harness that treats safety as a tier with no budget.",
    note: "Outside: the same architecture in aviation maintenance, where a licensed technician signs the release.",
    image: PROJECTS.lore.image,
    cta: "Follow the Thread",
    tint: { h: 28, s: 55, l: 40, a: 0.18 },
  },
  {
    group: "standalone",
    kicker: "Standalone project",
    slug: "sonor",
    name: PROJECTS.sonor.name,
    body: "Reclaiming urban silence through data. As Co-founder and Product Lead, I took a B2G SaaS from discovery to MVP, turning acoustic open data into a decision tool for cities. No contract signed; the project stopped in 2022.",
    note: "Outside: a B2G SaaS, two years, before any of this.",
    image: PROJECTS.sonor.image,
    cta: "Explore the Narrative",
    tint: { h: 215, s: 65, l: 38, a: 0.18 },
    flip: true,
  },
  {
    group: "standalone",
    kicker: "Standalone project",
    slug: "compass",
    name: PROJECTS.compass.name,
    body: "Every address has a story. Compass reads it before you sign: open data turned into traceable, address-level context for commercial location decisions in Paris.",
    image: PROJECTS.compass.image,
    cta: "Read the case study",
    tint: { h: 160, s: 40, l: 35, a: 0.16 },
  },
];

const MESH_ACTS = ACTS.filter((a) => a.group === "mesh");
const STANDALONE_ACTS = ACTS.filter((a) => a.group === "standalone");

/** Split a word into per-letter spans for the ink reveal. */
const SplitWord = ({ text }: { text: string }) => (
  <span aria-label={text}>
    {Array.from(text).map((ch, i) => (
      <span
        key={`${ch}-${i}`}
        aria-hidden="true"
        className="journey-letter"
        style={{ ["--char-index" as string]: i }}
      >
        {ch === " " ? "\u00A0" : ch}
      </span>
    ))}
  </span>
);

const ActSection = ({ act }: { act: Act }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const revealRef = useReveal<HTMLDivElement>(0.35);
  const track = useTrackClick();

  // Drive --act-progress and --act-scale from scroll position, plus the
  // stage tint when this act is centered.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let pending = false;

    const apply = () => {
      pending = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 when top of section meets bottom of viewport,
      // 0.5 when section is centered, 1 when bottom meets top of viewport.
      const total = vh + rect.height;
      const raw = (vh - rect.top) / total;
      const p = Math.min(1, Math.max(0, raw));
      // distance from center, 0 at middle, 1 at edges
      const d = Math.abs(p - 0.5) * 2;
      const scale = 1 + d * 0.12; // 1 at center, 1.12 at edges

      el.style.setProperty("--act-progress", p.toFixed(4));
      el.style.setProperty("--act-scale", scale.toFixed(4));

      // Tint stage when this act dominates the viewport.
      const centerVisible = rect.top < vh * 0.55 && rect.bottom > vh * 0.45;
      if (centerVisible) {
        const stage = document.querySelector(".journey-stage") as HTMLElement | null;
        if (stage) {
          stage.style.setProperty("--journey-tint-h", String(act.tint.h));
          stage.style.setProperty("--journey-tint-s", `${act.tint.s}%`);
          stage.style.setProperty("--journey-tint-l", `${act.tint.l}%`);
          stage.style.setProperty("--journey-tint-a", String(act.tint.a));
        }
      }
    };

    const onScroll = () => {
      if (reduce) return;
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [act.tint.h, act.tint.s, act.tint.l, act.tint.a]);

  const headingId = `journey-${act.slug}-heading`;

  return (
    <section
      ref={sectionRef}
      id={`act-${act.slug}`}
      aria-labelledby={headingId}
      className="journey-act"
      data-flip={act.flip ? "true" : "false"}
    >
      <Link
        to={`/${act.slug}`}
        onClick={() => track({ label: act.name, href: `/${act.slug}`, kind: "project" })}
        aria-label={`${act.name}, open case study`}
        className="journey-act-media group block"
        style={{ viewTransitionName: `case-hero-${act.slug}` }}
      >
        <SafeImage src={act.image} alt={`${act.name} cover`} loading="lazy" />
      </Link>

      <div ref={revealRef} data-reveal className="journey-act-text">
        <span
          data-reveal-child
          className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary mb-6"
        >
          {act.kicker}
        </span>
        <h2
          id={headingId}
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "120ms" }}
          className="font-headline italic text-primary text-6xl md:text-8xl leading-[0.95] mb-8 overflow-hidden"
        >
          <SplitWord text={act.name} />
        </h2>
        <p
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "300ms" }}
          className="text-on-surface-variant leading-relaxed max-w-md mb-6 md:text-lg"
        >
          {act.body}
        </p>
        {act.note && (
          <p
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "380ms" }}
            className="text-on-surface-variant/90 font-body text-sm leading-relaxed max-w-md mb-8 border-l border-outline-variant pl-4"
          >
            {act.note}
          </p>
        )}
        <span
          data-reveal-child
          style={{ ["--reveal-delay" as string]: "440ms" }}
        >
          <Link
            to={`/${act.slug}`}
            onClick={() => track({ label: act.name, href: `/${act.slug}`, kind: "project" })}
            className="text-secondary font-body tracking-wider hover:underline underline-offset-8 transition-all duration-500 inline-flex items-center gap-2 group/cta w-fit"
          >
            {act.cta}
            <Icon name="arrow_forward" className="text-sm group-hover/cta:translate-x-1 transition-transform" />
          </Link>
        </span>
      </div>
    </section>
  );
};

const Journeys = () => {
  const track = useTrackClick();
  const [hoveredSlug, setHoveredSlug] = useState<string>(ACTS[0].slug);

  // Toggle scroll-snap only while on this page.
  useEffect(() => {
    document.documentElement.classList.add("journeys-snap");
    return () => document.documentElement.classList.remove("journeys-snap");
  }, []);

  const scrollToAct = useCallback((slug: string) => (e: React.MouseEvent) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = document.getElementById(`act-${slug}`);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, []);

  return (
    <SiteLayout title="Stories">
      <Seo
        title="Case Studies, Selected Work by Ivan de Murard"
        description="The Hospitality Multi-Agent Architecture: Aetherix (F&B agent), Tacet (environmental agent), Anima (guest agent). Standalone projects: Lore (voice AI for aviation maintenance), Sonor (urban noise SaaS), Compass (Paris commercial premises from open data). Product and AI work shipped 0 to 1."
        path="/journeys"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Case Studies",
          url: "https://ivandemurard.com/journeys",
          hasPart: [
            { "@type": "CreativeWork", name: "Aetherix", url: "https://ivandemurard.com/aetherix" },
            { "@type": "CreativeWork", name: "Sonor", url: "https://ivandemurard.com/sonor" },
            { "@type": "CreativeWork", name: "Tacet", url: "https://ivandemurard.com/tacet" },
            { "@type": "CreativeWork", name: "Lore", url: "https://ivandemurard.com/lore" },
            { "@type": "CreativeWork", name: "Anima", url: "https://ivandemurard.com/anima" },
            { "@type": "CreativeWork", name: "Compass", url: "https://ivandemurard.com/compass" },
          ],
        }}
      />

      <div className="journey-stage overflow-hidden">
        {/* Opening, full viewport editorial index */}
        <Reveal
          as="header"
          className="journey-act relative"
          threshold={0.1}
        >
          <div className="journey-act-text md:!py-0">
            <div className="max-w-screen-2xl w-full mx-auto md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
              {/* Left: editorial title */}
              <div className="md:col-span-5 relative">
                <div className="absolute -top-16 -left-16 w-80 h-80 hilma-circle halo-drift pointer-events-none hidden md:block" />
                <span data-reveal-child className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary mb-6 block">
                  The Project Index
                </span>
                <h1 className="font-headline italic text-primary text-6xl md:text-8xl leading-[1.02] mb-8">
                  <span data-reveal-child className="headline-ink block" style={{ ["--reveal-delay" as string]: "100ms" }}>
                    Case
                  </span>
                  <span
                    data-reveal-child
                    className="headline-ink block pl-12 md:pl-24"
                    style={{ ["--reveal-delay" as string]: "260ms" }}
                  >
                    studies
                  </span>
                </h1>
                <p
                  data-reveal-child
                  style={{ ["--reveal-delay" as string]: "420ms" }}
                  className="text-on-surface-variant font-normal leading-relaxed max-w-md text-base md:text-lg"
                >
                  A curated collection of projects where technology quietly becomes an act of care.
                </p>
                <div
                  data-reveal-child
                  style={{ ["--reveal-delay" as string]: "500ms" }}
                  className="mt-8 max-w-md border-t border-outline-variant pt-6"
                >
                  <span className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary block mb-2">
                    The Hospitality Multi-Agent Architecture
                  </span>
                  <p className="text-on-surface-variant font-body text-sm leading-relaxed mb-4">
                    Five specialised agents, one architecture. Three of them have a page.
                  </p>
                  <ul className="space-y-2 mb-4">
                    {MESH_AGENTS.map((a) => (
                      <li key={a.name} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                        {a.to ? (
                          <Link
                            to={a.to}
                            className="font-headline italic text-primary text-base border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
                          >
                            {a.name}
                          </Link>
                        ) : (
                          <span className="font-headline italic text-on-surface-variant text-base">{a.name}</span>
                        )}
                        <span className="text-on-surface-variant">{a.role}</span>
                        <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
                          {a.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/architecture"
                    className="text-primary font-body text-sm border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
                  >
                    How they fit together: the architecture note
                  </Link>
                </div>
              </div>

              {/* Middle: grouped, hoverable summary */}
              <nav
                aria-label="Case studies index"
                className="md:col-span-3"
                onMouseLeave={() => setHoveredSlug(ACTS[0].slug)}
              >
                {[
                  { title: "The Hospitality Multi-Agent Architecture", acts: MESH_ACTS },
                  { title: "Standalone projects", acts: STANDALONE_ACTS },
                ].map((group, gi) => (
                  <div key={group.title} className={gi > 0 ? "mt-10" : ""}>
                    <h2
                      data-reveal-child
                      style={{ ["--reveal-delay" as string]: `${480 + gi * 80}ms` }}
                      className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary mb-4"
                    >
                      {group.title}
                    </h2>
                    <ul className="flex flex-col gap-3 md:gap-4 list-none p-0 m-0">
                      {group.acts.map((act, i) => (
                        <li
                          key={act.slug}
                          data-reveal-child
                          style={{ ["--reveal-delay" as string]: `${540 + (gi * 3 + i) * 100}ms` }}
                        >
                          <a
                            href={`#act-${act.slug}`}
                            onClick={scrollToAct(act.slug)}
                            onMouseEnter={() => setHoveredSlug(act.slug)}
                            onFocus={() => setHoveredSlug(act.slug)}
                            className="journey-summary-link group"
                          >
                            <span className="journey-summary-name font-headline italic text-primary text-3xl md:text-5xl leading-none">
                              {act.name}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="mt-10 flex items-center gap-3 text-on-surface-variant font-label uppercase tracking-[0.25em] text-[10px]">
                  <span className="block h-px w-12 bg-outline-variant" />
                  Scroll to enter
                </div>
              </nav>

              {/* Right: hover preview */}
              <div
                className="hidden md:block md:col-span-4"
                aria-hidden="true"
                data-reveal-child
                style={{ ["--reveal-delay" as string]: "640ms" }}
              >
                <div className="journey-preview relative aspect-[4/5] overflow-hidden rounded-sm bg-surface-container">
                  {ACTS.map((act) => (
                    <SafeImage
                      key={act.slug}
                      src={act.image}
                      alt=""
                      loading="lazy"
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-all duration-[900ms] ease-out",
                        hoveredSlug === act.slug
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105",
                      )}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>


        {/* Start here: the architecture note, a lead-in above the cases */}
        <Reveal as="section" aria-labelledby="start-here" className="px-6 md:px-12 py-12 md:py-16">
          <div className="max-w-screen-2xl mx-auto border-y border-outline-variant py-8 md:py-10">
            <span className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary block mb-3">
              Start here
            </span>
            <h2
              id="start-here"
              className="font-headline italic text-primary text-2xl md:text-4xl leading-tight mb-4 max-w-3xl"
            >
              Start here: the Hospitality Multi-Agent Architecture
            </h2>
            <p className="text-on-surface-variant font-body leading-relaxed max-w-2xl mb-6">
              Five specialised agents, one bounded context each, talking only through MCP. Which one is
              built, which one is design, and why the boundaries are enforced by the protocol rather than
              by discipline.
            </p>
            <Link
              to="/architecture"
              onClick={() => track({ label: "Architecture note", href: "/architecture", kind: "project" })}
              className="group/cta inline-flex items-center gap-2 text-primary font-body text-sm border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
            >
              Read the architecture note
              <Icon name="arrow_forward" className="text-sm group-hover/cta:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>

        {/* Group one: the mesh */}
        {MESH_ACTS.map((act) => (
          <ActSection key={act.slug} act={act} />
        ))}

        {/* Group two: standalone projects */}
        <Reveal as="section" className="px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-screen-2xl mx-auto border-t border-outline-variant pt-8">
            <h2
              data-reveal-child
              className="font-headline italic text-primary text-3xl md:text-5xl leading-tight mb-4"
            >
              Standalone projects
            </h2>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "160ms" }}
              className="text-on-surface-variant font-body leading-relaxed max-w-2xl"
            >
              Not part of this architecture. Lore is the same architecture under a stricter regime, in aviation
              maintenance. Sonor is the two-year B2G product that came before all of it. Compass reads commercial
              premises in Paris from public open data.
            </p>
          </div>
        </Reveal>

        {STANDALONE_ACTS.map((act) => (
          <ActSection key={act.slug} act={act} />
        ))}

        {/* Outro CTA, outside the snap rhythm */}
        <Reveal as="section" className="px-6 md:px-12 text-center max-w-2xl mx-auto py-24 md:py-32">
          <span data-reveal-child className="divider-fall mx-auto mb-12 md:mb-16" style={{ height: "6rem" }} />
          <h3
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "200ms" }}
            className="headline-ink font-headline text-3xl md:text-4xl italic text-primary mb-12"
          >
            Every journey begins with a single conversation.
          </h3>
          <span data-reveal-child style={{ ["--reveal-delay" as string]: "420ms" }} className="inline-block">
            <Link
              to="/contact"
              onClick={() => track({ label: "Inquire Within", href: "/contact", kind: "contact" })}
              className="inline-block bg-primary text-on-primary px-10 py-5 rounded-xl font-label uppercase tracking-[0.2em] text-[11px] transition-all duration-500 hover:bg-primary-container active:scale-95 ambient-shadow"
            >
              Inquire Within
            </Link>
          </span>
        </Reveal>
      </div>
    </SiteLayout>
  );
};

export default Journeys;
