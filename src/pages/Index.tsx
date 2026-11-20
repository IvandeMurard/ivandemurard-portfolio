import portrait from "@/assets/Ivan_de_Murard.jpg.asset.json";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo, personJsonLd, SITE } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { COMPASS_SOURCES_LINE } from "@/content/statuses";
import { SignalLamp } from "@/components/journal/SignalLamp";
import { AetherixHomepageLoop } from "@/components/atherix/AetherixHomepageLoop";
import { PROJECTS, SOCIAL_LINKS } from "@/content/site";
import { ROSE_HOME_PREFILL } from "@/content/roseWelcome";
import { ContactBlock } from "@/components/case/ContactBlock";
import { INDEX_HERO, INDEX_COPY, notesInOrder } from "@/content/journalIndex";
import { HeroGlow } from "@/components/home/HeroGlow";
import { shortNoteTitle } from "@/lib/shortTitle";
import { useTrackClick } from "@/hooks/useTrackClick";
import { Button } from "@/components/ui/button";
import { CompassMark } from "@/components/rose/CompassMark";
import { RoseMark } from "@/components/rose/RoseKinetic";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ExternalMark } from "@/components/ui/ExternalMark";

const Tip = ({ label, explain, children }: { label: string; explain: string; children: React.ReactNode }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button type="button" aria-label={`${label}: ${explain}`} className="underline decoration-dotted underline-offset-2 cursor-help text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">{label}</button>
    </PopoverTrigger>
    <PopoverContent side="top" className="max-w-[300px] font-mono text-meta leading-relaxed">{children}</PopoverContent>
  </Popover>
);

const AetherixStatus = () => (
  <div className="flex flex-col gap-2">
    <SignalLamp state={PROJECTS.atherix.status.signal} label={PROJECTS.atherix.status.word} />
    <p className="font-mono text-meta leading-relaxed text-on-surface-variant max-w-[560px]">
      Built and tested on the{" "}
      <Tip label="Apaleo sandbox" explain="what this means">Apaleo is a cloud property-management system (PMS) used by hotels. Its sandbox is a test hotel with realistic bookings: the agent runs on the real API without touching real guests.{" "}<a href="https://apaleo.com" target="_blank" rel="noopener noreferrer" className="underline"><ExternalMark>apaleo.com</ExternalMark></a></Tip> and on public restaurant data. 0 real users. Being made pilot-ready; no hotel yet.
    </p>
  </div>
);

// The Field Notes, in the order of the /journal index (harness, boundaries, ground truth, one text three readers). Read from the same data
// as that page: the decision kicker and the current title are never typed again here.
const NOTES = notesInOrder();

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
  { p: PROJECTS.anima, fragment: PROJECTS.anima.status.note, line: "What a hotel knows about its guests sits in one person's head or in scattered tools, so needs are met late. Anima helps teams anticipate them and adapt the stay, from what guests chose to share, with less strain on operations." },
  { p: PROJECTS.compass, fragment: COMPASS_SOURCES_LINE, line: PROJECTS.compass.tagline },
  { p: PROJECTS.sonor, fragment: PROJECTS.sonor.status.note, line: "A two-year B2G SaaS I co-founded with three partners, to help cities reduce noise pollution with open data.", href: "/sonor#what-id-change" },
];

const kicker = "font-mono uppercase tracking-[0.12em] text-kicker";
const rule = "border-t border-primary";
const hair = "border-t border-outline-variant";

/** A soft blend between two rooms: no hard edge between sections. */
const Blend = ({ from, to, height }: { from: string; to: string; height: number }) => (
  <div aria-hidden="true" data-blend className={`bg-gradient-to-b ${from} ${to}`} style={{ height }} />
);

const Index = () => {
  const track = useTrackClick();
  return (
    <SiteLayout>
      <Seo
        title="Ivan de Murard, AI Product Manager & Builder, Paris"
        rawTitle
        description="AI Product Manager & Builder in Paris. I build AI services for operations, and measure what they change. Before that, SaaS product manager and co-founder."
        path="/"
        jsonLd={[personJsonLd, { "@context": "https://schema.org", "@type": "WebSite", name: "Ivan de Murard", url: SITE.url, inLanguage: "en" }]}
      />

      {/* Hero on cream, lit from the top right by the hour in Paris */}
      <div className="relative overflow-hidden bg-surface" data-hero>
      <HeroGlow />
      <Reveal as="header" className="relative pt-24 md:pt-24 pb-16 md:pb-20 px-6 md:px-10 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_480px] gap-12 lg:gap-16 lg:items-start">
          <div className="max-w-[760px]" data-reveal-child>
            <p className={`${kicker} text-secondary mb-5`}>AI Product Manager & Builder · Paris</p>
            <h1 className="font-headline font-normal text-heading text-[38px] md:text-[54px] lg:text-[46px] xl:text-[50px] leading-[1.04] tracking-normal">
              I build AI services for operations, and measure what they change.{" "}
              <span className="mt-3 block text-[22px] md:text-[28px] lg:text-[26px] xl:text-[28px] leading-[1.2] text-on-surface-variant">
                Before that, SaaS product manager and co-founder.
              </span>
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
                <ExternalMark>Book a call</ExternalMark>
              </a>
            </div>
          </div>
          <figure className="w-full max-w-[360px] lg:max-w-none lg:justify-self-end" data-reveal-child style={{ ["--reveal-delay" as string]: "120ms" }}>
            <div className="relative aspect-square overflow-hidden ring-1 ring-outline-variant">
              <img src={portrait.url} alt="Ivan de Murard, portrait" width={532} height={532}
                className="h-full w-full object-cover grayscale" loading="eager" fetchPriority="high" />
              <div aria-hidden className="absolute inset-3 border border-secondary/60 pointer-events-none" />
            </div>
            <figcaption className={`${hair} mt-3 pt-2 font-mono text-meta text-on-surface-variant`}>Ivan de Murard · Paris</figcaption>
          </figure>
        </div>
      </Reveal>
      </div>

      <Blend from="from-surface" to="to-surface-stone" height={120} />

      {/* 01 · Flagship teaser, on stone */}
      <section id="work" className="bg-surface-stone scroll-mt-24">
        <Reveal className="pt-6 pb-16 md:pb-24 px-6 md:px-10 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_480px] gap-12 lg:gap-16 lg:items-start">
            <div data-reveal-child className="max-w-[760px]">
              <p className={`${kicker} text-secondary mb-8`}>01 · Flagship</p>
              <h2 className="font-headline font-light text-heading text-[clamp(72px,9vw,136px)] leading-[0.9] tracking-[-0.04em]">Aetherix</h2>
              <p className="mt-8 text-[18px] md:text-[21px] leading-relaxed text-on-surface max-w-[520px]">{PROJECTS.atherix.tagline}</p>
              <Link to="/aetherix" onClick={() => track({ label: "Aetherix teaser", href: "/aetherix", kind: "project" })}
                className="mt-10 inline-flex items-center min-h-[48px] px-6 border border-on-surface rounded-md text-on-surface font-medium hover:bg-on-surface hover:text-surface transition-colors">
                Read the Aetherix case →
              </Link>
              <div className="mt-6"><AetherixStatus /></div>
            </div>
            <div className="w-full max-w-[480px] lg:justify-self-end" data-reveal-child style={{ ["--reveal-delay" as string]: "120ms" }}>
              <AetherixHomepageLoop initialTab={0} />
            </div>
          </div>
        </Reveal>
      </section>

      <Blend from="from-surface-stone" to="to-surface" height={120} />

      {/* 02 · Selected projects, on cream */}
      <section className="bg-surface">
      <Reveal className="pt-6 pb-16 md:pb-24 px-6 md:px-10 max-w-screen-2xl mx-auto">
        <p className={`${kicker} text-secondary mb-8`} data-reveal-child>02 · Selected projects</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          {SELECTED.map(({ p, fragment, line, href, isRose }: { p: (typeof SELECTED)[number]["p"]; fragment: string; line: string; href?: string; isRose?: boolean }, i) => (
            <article key={p.slug} className={`${rule} pt-6 flex flex-col`} data-reveal-child style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-headline font-normal text-heading text-[44px] leading-none">
                  {isRose ? (
                    <span className="inline-flex items-center gap-3">
                      <RoseMark kind="underline" cue="home-rose" skipWhenReduced tip>{p.name}</RoseMark>
                      <button type="button" aria-label="Open Rose, the same compass as the dock below"
                        onClick={() => window.dispatchEvent(new CustomEvent("rose:ask"))}
                        onMouseEnter={() => window.dispatchEvent(new CustomEvent("rose:echo", { detail: true }))}
                        onMouseLeave={() => window.dispatchEvent(new CustomEvent("rose:echo", { detail: false }))}
                        onFocus={() => window.dispatchEvent(new CustomEvent("rose:echo", { detail: true }))}
                        onBlur={() => window.dispatchEvent(new CustomEvent("rose:echo", { detail: false }))}
                        className="group/compass rounded-full text-primary hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary transition-colors">
                        <CompassMark className="h-7 w-7 shrink-0 transition-transform duration-700 ease-out group-hover/compass:rotate-45 group-focus-visible/compass:rotate-45 motion-reduce:transition-none" />
                      </button>
                    </span>
                  ) : p.name}
                </h3>
                <SignalLamp state={p.status.signal} label={p.status.word} />
              </div>
              <p className={`${hair} mt-6 pt-3 font-mono text-meta leading-relaxed text-on-surface`}>{fragment}</p>
              <p className="mt-6 text-on-surface-variant leading-relaxed flex-1">{line}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                <Link to={href ?? `/${p.slug}`} onClick={() => track({ label: p.name, href: href ?? `/${p.slug}`, kind: "project" })}
                  className="text-secondary font-medium border-b border-secondary/40 pb-1 hover:border-secondary transition-colors">Read the case</Link>
                {isRose && (
                  <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("rose:prefill", { detail: { text: ROSE_HOME_PREFILL } }))}
                    className="text-secondary font-medium border-b border-secondary/40 pb-1 hover:border-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">Ask Rose</button>
                )}
              </div>
            </article>
          ))}
        </div>
      </Reveal>
      </section>

      <Blend from="from-surface" to="to-surface-peach" height={120} />

      {/* 03 · Field Notes, on pale peach */}
      <section className="bg-surface-peach" data-field-notes>
        <Reveal className="pt-6 pb-20 md:pb-24 px-6 md:px-10 max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10" data-reveal-child>
            <div>
              <p className={`${kicker} text-secondary mb-6`}>03 · Field Notes</p>
              <h2 className="font-headline font-normal text-heading text-[clamp(32px,3.6vw,44px)] leading-tight max-w-3xl">{INDEX_HERO.title}</h2>
            </div>
            <Link to="/journal" className={`${kicker} text-secondary border-b border-secondary pb-1 self-start md:self-end`}>All notes</Link>
          </div>
          <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 xl:grid-cols-4">
            {NOTES.map((e, i) => (
              <li key={e.slug} data-reveal-child style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
                <Link to={`/journal/${e.slug}`} onClick={() => track({ label: e.title, href: `/journal/${e.slug}`, kind: "nav" })}
                  className="field-card group flex h-full flex-col rounded-2xl border border-outline-variant/40 p-6">
                  <span className={`${kicker} text-on-surface-variant`}>{e.decision}</span>
                  <span className="mt-3 block font-headline text-[24px] leading-[1.15] text-heading">{shortNoteTitle(e.title)}</span>
                  <span className="mt-auto pt-4 text-[15px] font-medium text-secondary group-hover:underline underline-offset-4">{INDEX_COPY.readNote}</span>
                </Link>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <Blend from="from-surface-peach" to="to-inverse-ground" height={160} />

      <ContactBlock number="04" />
    </SiteLayout>
  );
};

export default Index;
