import portrait from "@/assets/Ivan_de_Murard.jpg.asset.json";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo, personJsonLd, SITE } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { COMPASS_SOURCES_LINE } from "@/content/statuses";
import { SignalLamp } from "@/components/journal/SignalLamp";
import { AetherixHomepageLoop } from "@/components/atherix/AetherixHomepageLoop";
import { PROJECTS, SOCIAL_LINKS } from "@/content/site";
import { ContactBlock } from "@/components/case/ContactBlock";
import { JOURNAL_ENTRIES } from "@/content/journal";
import { useTrackClick } from "@/hooks/useTrackClick";
import { Button } from "@/components/ui/button";
import { CompassMark } from "@/components/rose/CompassMark";
import { RoseMark } from "@/components/rose/RoseKinetic";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Tip = ({ label, explain, children }: { label: string; explain: string; children: React.ReactNode }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button type="button" aria-label={`${label}: ${explain}`} className="underline decoration-dotted underline-offset-2 cursor-help text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">{label}</button>
    </PopoverTrigger>
    <PopoverContent side="top" className="max-w-[300px] font-mono text-[11.5px] leading-relaxed">{children}</PopoverContent>
  </Popover>
);

const AetherixStatus = () => (
  <div className="flex flex-col gap-2">
    <SignalLamp state={PROJECTS.atherix.status.signal} label={PROJECTS.atherix.status.word} />
    <p className="font-mono text-[12.5px] leading-relaxed text-on-surface-variant max-w-[560px]">
      Built and evaluated on historical data. <Tip label="Staged" explain="what this means">Deployed on a pre-production server (Fly.io, Paris): the same setup a pilot hotel would get, before any real hotel data.</Tip> on Fly.io, connected to the{" "}
      <Tip label="Apaleo sandbox" explain="what this means">Apaleo is a cloud property-management system (PMS) used by hotels. Its sandbox is a test hotel with realistic bookings: the agent runs on the real API without touching real guests.{" "}<a href="https://apaleo.com" target="_blank" rel="noopener noreferrer" className="underline">apaleo.com ↗</a></Tip>. Ready for a 30-day pilot.
    </p>
  </div>
);

// Latest three Field Notes, oldest first.
const LATEST_NOTES = [...JOURNAL_ENTRIES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).reverse();

// Selected projects (Rose, Lore, Anima, Compass, Sonor). Fragments only where sourced from the case studies; otherwise the status note.
const SELECTED = [
  {
    p: PROJECTS.rose,
    fragment: "Contextual assistant · knows the page you are reading · answers from the site's own text · text only today",
    line: PROJECTS.rose.tagline,
    isRose: true,
  },
  {
    p: PROJECTS.lore,
    fragment: "Evaluation harness · 64 cases · pure-function graders · hard safety tier",
    line: "Captures the tacit knowledge a retiring technician never wrote down and returns it to a junior on the shop floor by voice, always behind the procedure.",
  },
  { p: PROJECTS.anima, fragment: PROJECTS.anima.status.note, line: "What hotels' know of their guests sits in one person's head or in scattered tools. It is difficult to anticipate their needs and adapt operations. Anima provides intelligence to help managers adapt their guests' stay." },
  { p: PROJECTS.compass, fragment: COMPASS_SOURCES_LINE, line: PROJECTS.compass.tagline },
  { p: PROJECTS.sonor, fragment: PROJECTS.sonor.status.note, line: "Sonor is a two year B2B SaaS entrepreneurial project led with 3 co-founders. Goal: help cities reduce noise pollution thanks to open data.", href: "/sonor#what-id-change" },
];

const kicker = "font-mono uppercase tracking-[0.12em] text-[11px]";
const rule = "border-t border-primary";
const hair = "border-t border-outline-variant";

const Index = () => {
  const track = useTrackClick();
  return (
    <SiteLayout>
      <Seo
        title="Ivan de Murard, AI Product Manager & Builder, Paris"
        rawTitle
        description="AI Product Manager & Builder in Paris. Front-of-house, co-founder, product manager. Now I build AI workflows for operations, bridging operations, tech and real business value."
        path="/"
        jsonLd={[personJsonLd, { "@context": "https://schema.org", "@type": "WebSite", name: "Ivan de Murard", url: SITE.url, inLanguage: "en" }]}
      />

      {/* Hero: statement left, register right */}
      <Reveal as="header" className="pt-24 md:pt-24 pb-16 md:pb-20 px-6 md:px-10 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_480px] gap-12 lg:gap-16 lg:items-start">
          <div className="max-w-[760px]" data-reveal-child>
            <p className={`${kicker} text-secondary mb-5`}>AI Product Manager & Builder · Paris</p>
            <h1 className="font-headline font-normal text-primary text-[38px] md:text-[54px] lg:text-[46px] xl:text-[50px] leading-[1.04] tracking-normal">
              SaaS Product manager and co-founder.<br />I build AI services&nbsp;working on operations, tech and business.
            </h1>
            <p className="mt-6 text-[17px] md:text-[19px] lg:text-[17px] leading-[1.6] text-on-surface max-w-[600px]">
              Every project on this site states what runs today, what was tested and what is not proven yet.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-8">
              <Button asChild className="h-auto bg-primary text-on-primary px-8 py-4 rounded-md font-medium tracking-wide hover:bg-secondary hover:text-on-secondary transition-colors">
                <a href="#work" data-cta="primary">Explore the projects</a>
              </Button>
              <a href={SOCIAL_LINKS.schedule} target="_blank" rel="noopener noreferrer"
                onClick={() => track({ label: "Book a call", href: SOCIAL_LINKS.schedule, kind: "nav" })}
                className="text-secondary font-medium border-b border-secondary/40 pb-1 hover:border-secondary transition-colors">
                Book a call
              </a>
            </div>
          </div>
          <figure className="w-full max-w-[360px] lg:max-w-none lg:justify-self-end" data-reveal-child style={{ ["--reveal-delay" as string]: "120ms" }}>
            <div className="relative aspect-square overflow-hidden ring-1 ring-outline-variant">
              <img src={portrait.url} alt="Ivan de Murard, portrait" width={532} height={532}
                className="h-full w-full object-cover grayscale" loading="eager" fetchPriority="high" />
              <div aria-hidden className="absolute inset-3 border border-secondary/60 pointer-events-none" />
            </div>
            <figcaption className={`${hair} mt-3 pt-2 font-mono text-[11.5px] text-on-surface-variant`}>Ivan de Murard · Paris</figcaption>
          </figure>
        </div>
      </Reveal>

      {/* 01 · Flagship teaser */}
      <section id="work" className="bg-surface-container-low scroll-mt-24">
        <Reveal className="py-16 md:py-28 px-6 md:px-10 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_480px] gap-12 lg:gap-16 lg:items-start">
            <div data-reveal-child className="max-w-[760px]">
              <p className={`${kicker} text-secondary mb-8`}>01 · Flagship</p>
              <h2 className="font-headline font-light text-primary text-[clamp(72px,9vw,136px)] leading-[0.9] tracking-[-0.04em]">Aetherix</h2>
              <p className="mt-8 text-[21px] leading-relaxed text-on-surface max-w-[520px]">{PROJECTS.atherix.tagline}</p>
              <Link to="/aetherix#what-it-does-today" onClick={() => track({ label: "Aetherix teaser", href: "/aetherix", kind: "project" })}
                className="mt-10 inline-flex items-center min-h-[48px] px-6 border border-on-surface rounded-md text-on-surface font-medium hover:bg-on-surface hover:text-surface transition-colors">
                How it decides, and when it refuses →
              </Link>
              <div className="mt-6"><AetherixStatus /></div>
            </div>
            <div className="w-full max-w-[480px] lg:justify-self-end" data-reveal-child style={{ ["--reveal-delay" as string]: "120ms" }}>
              <AetherixHomepageLoop initialTab={0} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* 02 · Selected projects */}
      <Reveal as="section" className="py-16 md:py-28 px-6 md:px-10 max-w-screen-2xl mx-auto">
        <p className={`${kicker} text-secondary mb-8`} data-reveal-child>02 · Selected projects</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          {SELECTED.map(({ p, fragment, line, href, isRose }: { p: (typeof SELECTED)[number]["p"]; fragment: string; line: string; href?: string; isRose?: boolean }, i) => (
            <article key={p.slug} className={`${rule} pt-6 flex flex-col`} data-reveal-child style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-headline font-normal text-primary text-[44px] leading-none">
                  {isRose ? (
                    <span className="inline-flex items-center gap-3">
                      <RoseMark kind="underline" cue="home-rose" skipWhenReduced tip>{p.name}</RoseMark>
                      <button type="button" aria-label="Open Rose, the same compass as the dock below"
                        onClick={() => window.dispatchEvent(new CustomEvent("rose:ask"))}
                        onMouseEnter={() => window.dispatchEvent(new CustomEvent("rose:echo", { detail: true }))}
                        onMouseLeave={() => window.dispatchEvent(new CustomEvent("rose:echo", { detail: false }))}
                        onFocus={() => window.dispatchEvent(new CustomEvent("rose:echo", { detail: true }))}
                        onBlur={() => window.dispatchEvent(new CustomEvent("rose:echo", { detail: false }))}
                        className="group/compass -m-1 cursor-pointer rounded-full p-1 ring-1 ring-outline-variant hover:ring-secondary/60 text-primary hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary transition-colors">
                        <CompassMark className="h-7 w-7 shrink-0 transition-transform duration-700 ease-out group-hover/compass:rotate-45 group-focus-visible/compass:rotate-45 motion-reduce:transition-none" />
                      </button>
                    </span>
                  ) : p.name}
                </h3>
                <SignalLamp state={p.status.signal} label={p.status.word} />
              </div>
              <p className={`${hair} mt-6 pt-3 font-mono text-[12.5px] leading-relaxed text-on-surface`}>{fragment}</p>
              <p className="mt-6 text-on-surface-variant leading-relaxed flex-1">{line}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                <Link to={href ?? `/${p.slug}`} onClick={() => track({ label: p.name, href: href ?? `/${p.slug}`, kind: "project" })}
                  className="text-secondary font-medium border-b border-secondary/40 pb-1 hover:border-secondary transition-colors">Read the case</Link>
                {isRose && (
                  <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("rose:ask"))}
                    className="text-secondary font-medium border-b border-secondary/40 pb-1 hover:border-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">Ask Rose</button>
                )}
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      {/* 03 · Field Notes, a typographic index */}
      <section className="border-t border-outline-variant">
        <Reveal className="py-16 md:py-28 px-6 md:px-10 max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12" data-reveal-child>
            <div>
              <p className={`${kicker} text-secondary mb-6`}>03 · Field Notes</p>
              <h2 className="font-headline font-normal text-primary text-[clamp(32px,3.6vw,44px)] leading-tight max-w-3xl">
                The decisions behind the products. <span className="text-secondary">Written to be reused.</span>
              </h2>
            </div>
            <Link to="/journal" className={`${kicker} text-secondary border-b border-secondary pb-1 self-start md:self-end`}>All notes</Link>
          </div>
          <ol className={rule}>
            {LATEST_NOTES.map((e) => (
              <li key={e.slug} className={`${hair} first:border-t-0`}>
                <Link to={`/journal/${e.slug}`} onClick={() => track({ label: e.title, href: `/journal/${e.slug}`, kind: "nav" })}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-10">
                  <span className={`${kicker} text-on-surface-variant md:col-span-3`}>
                    {e.category} · {new Date(e.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                  </span>
                  <span className="md:col-span-9">
                    <span className="block font-headline text-[clamp(28px,3vw,38px)] leading-tight text-primary group-hover:text-secondary transition-colors">{e.homeHook?.title ?? e.title}</span>
                    <span className="block mt-3 text-[16.5px] leading-relaxed text-on-surface-variant max-w-3xl">{e.homeHook?.text ?? e.excerpt}</span>
                    <span className={`${kicker} block mt-4 text-secondary`}>Read the note →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <ContactBlock number="04" />
    </SiteLayout>
  );
};

export default Index;
