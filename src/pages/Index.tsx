import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo, personJsonLd, SITE } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { McpEndpoint } from "@/components/McpEndpoint";
import { SignalLamp } from "@/components/journal/SignalLamp";
import { PROJECTS, SOCIAL_LINKS } from "@/content/site";
import { JOURNAL_ENTRIES } from "@/content/journal";
import { useTrackClick } from "@/hooks/useTrackClick";
import { Button } from "@/components/ui/button";

// The register: one row per project, statuses from the single source in site.ts.
const REGISTER = [PROJECTS.atherix, PROJECTS.lore, PROJECTS.anima, PROJECTS.compass, PROJECTS.sonor];

// Track record, static values (evidence, not decoration).
const TRACK = [
  { value: "500+", label: "users on an internal SaaS rolled out across 100 care homes" },
  { value: "€1.9M", label: "receivables tracked and 40% recovered through a decision tool" },
  { value: "22", label: "European public-sector clients onboarded, zero churn" },
];

// Latest three Field Notes, oldest first.
const LATEST_NOTES = [...JOURNAL_ENTRIES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).reverse();

// Real proof fragments, taken from the case studies only.
const ALSO = [
  {
    p: PROJECTS.lore,
    fragment: "Evaluation harness · 64 cases · pure-function graders · hard safety tier",
    line: "Captures the tacit knowledge a retiring technician never wrote down and returns it to a junior on the shop floor by voice, always behind the procedure.",
  },
  {
    p: PROJECTS.compass,
    fragment: "APUR shopfront censuses (3, 2 pending licence) · BODACC legal notices · INSEE Sirene · 85,418 units · every figure with its source, licence and date",
    line: PROJECTS.compass.tagline,
  },
];

const kicker = "font-mono uppercase tracking-[0.12em] text-[11px]";
const rule = "border-t border-primary";
const hair = "border-t border-outline-variant";

const Index = () => {
  const track = useTrackClick();
  return (
    <SiteLayout>
      <Seo
        title="Ivan de Murard, product builder, agentic AI for operations"
        rawTitle
        description="Product builder in Paris. Agentic systems for operations, each shipped with its evaluation, its limits stated, and a person who decides."
        path="/"
        jsonLd={[personJsonLd, { "@context": "https://schema.org", "@type": "WebSite", name: "Ivan de Murard", url: SITE.url, inLanguage: "en" }]}
      />

      {/* Hero: statement left, register right */}
      <Reveal as="header" className="pt-24 md:pt-24 pb-16 md:pb-20 px-6 md:px-10 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 lg:items-start">
          <div className="lg:col-span-7" data-reveal-child>
            <p className={`${kicker} text-secondary mb-5`}>Product Builder · Paris</p>
            <h1 className="font-headline font-normal text-primary text-[38px] md:text-[54px] xl:text-[58px] leading-[1.04] tracking-normal">
              Five years getting products adopted. <em className="accent-ink">Now I build the AI agents.</em>
            </h1>
            <p className="mt-6 text-[18px] md:text-[20px] leading-[1.6] text-on-surface max-w-[540px]">
              AI Product Manager and former SaaS co-founder in Paris.
            </p>
            <ul className={`${hair} mt-7 pt-4 max-w-[540px] space-y-2 text-[15px] md:text-[16px] leading-relaxed text-on-surface-variant`}>
              <li>Co-founded <Link to="/sonor" className="text-on-surface border-b border-outline-variant hover:border-secondary">Sonor</Link>: 0→1 urban noise SaaS, Matrice and Banque des Territoires grants, MVP shipped.</li>
              <li>500+ users on 100+ sites and 7 C-level executives aligned at DomusVi.</li>
              <li>€1.9M of receivables tracked and 40% recovered at Bouygues Telecom IoT.</li>
            </ul>
            <p className="mt-7 text-[17px] md:text-[19px] leading-[1.65] text-on-surface max-w-[540px]">
              Since November 2025 I design, build and evaluate AI agents, with RAG, multi-agent workflows and a closed-loop.
            </p>
            <p className="mt-4 font-mono uppercase tracking-[0.12em] text-[11px] text-on-surface-variant">
              Results published, mixed ones included.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-8">
              <Button asChild className="h-auto bg-primary text-on-primary px-8 py-4 rounded-md font-medium tracking-wide hover:bg-secondary hover:text-on-secondary transition-colors">
                <a href="#work">Explore the projects</a>
              </Button>
              <a href={SOCIAL_LINKS.schedule} target="_blank" rel="noopener noreferrer"
                onClick={() => track({ label: "Book a call", href: SOCIAL_LINKS.schedule, kind: "nav" })}
                className="text-secondary font-medium border-b border-secondary/40 pb-1 hover:border-secondary transition-colors">
                Book a call
              </a>
            </div>
          </div>

          <div className="lg:col-span-5" data-reveal-child style={{ ["--reveal-delay" as string]: "160ms" }}>
            <div className={`${rule} flex justify-between pt-3 pb-3 ${kicker} text-on-surface-variant`}>
              <span>Selected projects</span><span>Status</span>
            </div>
            <ol>
              {REGISTER.map((p, i) => (
                <li key={p.slug} className={hair}>
                  <Link to={`/${p.slug}`} onClick={() => track({ label: p.name, href: `/${p.slug}`, kind: "project" })}
                    className="group grid grid-cols-[2rem_1fr_auto] gap-x-4 items-baseline py-4 hover:bg-surface-container-low transition-colors">
                    <span className={`${kicker} text-on-surface-variant`}>{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block font-headline text-[28px] leading-tight text-primary group-hover:text-secondary transition-colors">{p.name}</span>
                      <span className="block mt-1 text-[13.5px] leading-snug text-on-surface-variant">{p.status.note}</span>
                    </span>
                    <SignalLamp state={p.status.signal} label={p.status.word} className="self-center" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>

      {/* 01 · Flagship teaser */}
      <section id="work" className="bg-surface-container-low scroll-mt-24">
        <Reveal className="py-16 md:py-28 px-6 md:px-10 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 lg:items-center">
            <div data-reveal-child>
              <p className={`${kicker} text-secondary mb-8`}>01 · Flagship</p>
              <h2 className="font-headline font-light text-primary text-[clamp(72px,9vw,136px)] leading-[0.9] tracking-[-0.04em]">Aetherix</h2>
              <p className="mt-8 text-[21px] leading-relaxed text-on-surface max-w-[520px]">{PROJECTS.atherix.tagline}</p>
              <Link to="/aetherix#what-it-does-today" onClick={() => track({ label: "Aetherix teaser", href: "/aetherix", kind: "project" })}
                className="mt-10 inline-flex items-center min-h-[48px] px-6 border border-on-surface rounded-md text-on-surface font-medium hover:bg-on-surface hover:text-surface transition-colors">
                How it decides, and when it refuses →
              </Link>
              <p className="mt-5 font-mono text-[11.5px] text-signal-warn">Built and testable. Not yet proven in a hotel.</p>
            </div>
            <div className="w-full max-w-[460px] lg:justify-self-end" data-reveal-child style={{ ["--reveal-delay" as string]: "120ms" }}>
              <div className="bg-surface border border-outline-variant shadow-lg p-5 rounded-[18px_18px_18px_4px]">
                <div className="flex justify-between font-mono text-[11px] text-on-surface-variant mb-3"><span>Aetherix</span><span>Mon 18:42</span></div>
                <p className="font-mono text-[13.5px] leading-[1.75] whitespace-pre-wrap text-on-surface">{`Breakfast tomorrow   84 covers
  72 rooms booked + 12 typical walk-ins
Staff   4 front of house
  (you ran 3 last Tuesday)
Why     conference check-ins, clear weather`}</p>
              </div>
              <div className="mt-4 flex flex-wrap justify-end gap-2" aria-hidden="true">
                <span className="font-mono text-[12.5px] px-3 py-1.5 rounded-full border border-signal-go text-on-surface">Accept</span>
                <span className="font-mono text-[12.5px] px-3 py-1.5 rounded-full border border-signal-warn text-on-surface">The right figure</span>
                <span className="font-mono text-[12.5px] px-3 py-1.5 rounded-full border border-signal-stop text-on-surface">Reject</span>
              </div>
              <p className="mt-3 text-right font-mono text-[11px] text-on-surface-variant">Format mock-up. Figures illustrative.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 01b · Also in the register */}
      <Reveal as="section" className="py-16 md:py-28 px-6 md:px-10 max-w-screen-2xl mx-auto">
        <p className={`${kicker} text-secondary mb-8`} data-reveal-child>01b · More projects</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {ALSO.map(({ p, fragment, line }, i) => (
            <article key={p.slug} className={`${rule} pt-6 flex flex-col`} data-reveal-child style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-headline font-normal text-primary text-[44px] leading-none">{p.name}</h3>
                <SignalLamp state={p.status.signal} label={p.status.word} />
              </div>
              <p className="mt-6 font-mono text-[12.5px] leading-relaxed text-on-surface bg-surface-container-low border-l-2 border-secondary px-4 py-3">{fragment}</p>
              <p className="mt-6 text-on-surface-variant leading-relaxed flex-1">{line}</p>
              <Link to={`/${p.slug}`} onClick={() => track({ label: p.name, href: `/${p.slug}`, kind: "project" })}
                className="mt-6 text-secondary font-medium border-b border-secondary/40 pb-1 hover:border-secondary transition-colors self-start">Read the case</Link>
            </article>
          ))}
        </div>
      </Reveal>

      {/* 02 · Field Notes, a typographic index */}
      <section className="border-t border-outline-variant">
        <Reveal className="py-16 md:py-28 px-6 md:px-10 max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12" data-reveal-child>
            <div>
              <p className={`${kicker} text-secondary mb-6`}>02 · Field Notes</p>
              <h2 className="font-headline font-normal text-primary text-[clamp(32px,3.6vw,44px)] leading-tight max-w-3xl">
                The decisions behind the products. <em className="accent-ink">Written so you can steal them.</em>
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

      {/* 03 · Track record */}
      <Reveal as="section" className="py-16 md:py-28 px-6 md:px-10 max-w-screen-2xl mx-auto">
        <p className={`${kicker} text-secondary mb-10`} data-reveal-child>03 · Before the agents · five years inside operations</p>
        <div className={`${rule} grid grid-cols-1 md:grid-cols-3`} data-reveal-child>
          {TRACK.map((t, i) => (
            <div key={t.value} className={`py-10 md:px-8 ${i > 0 ? "border-t md:border-t-0 md:border-l border-outline-variant" : "md:pl-0"}`}>
              <p className="font-headline font-light text-primary text-[clamp(64px,7.5vw,104px)] leading-none tracking-[-0.03em]">{t.value}</p>
              <p className="mt-6 text-[15px] leading-relaxed text-on-surface-variant max-w-xs">{t.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 04 · Contact */}
      <section className="bg-surface-container-low">
        <Reveal className="py-16 md:py-28 px-6 md:px-10 max-w-[980px] mx-auto">
          <p className={`${kicker} text-secondary mb-8`} data-reveal-child>04 · Contact</p>
          <h2 className="font-headline font-normal text-primary text-[clamp(48px,5.6vw,84px)] leading-[1.02] tracking-[-0.02em]" data-reveal-child>
            Agents that hold up on a Monday morning. <em className="accent-ink">I build them, and I prove it.</em>
          </h2>
          <p className="mt-8 text-[18px] leading-relaxed text-on-surface max-w-2xl" data-reveal-child>
            Open to AI Product Manager and Product Builder roles. Thirty minutes is enough to know whether we should work together.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-8" data-reveal-child>
            <a href={SOCIAL_LINKS.schedule} target="_blank" rel="noopener noreferrer"
              onClick={() => track({ label: "Book 30 minutes", href: SOCIAL_LINKS.schedule, kind: "contact" })}
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-medium tracking-wide hover:bg-secondary hover:text-on-secondary transition-colors">
              Book 30 minutes
            </a>
            <a href={SOCIAL_LINKS.email} className="font-headline text-[22px] text-primary border-b border-primary/40 pb-0.5 hover:border-primary transition-colors break-all">
              {SOCIAL_LINKS.email.replace(/^mailto:/, "")}
            </a>
          </div>
        </Reveal>
      </section>

      <Reveal as="section" className="py-10 md:py-14 px-6 md:px-10 max-w-screen-2xl mx-auto">
        <div data-reveal-child><McpEndpoint label="Built for people. Available to their agents." compact /></div>
      </Reveal>
    </SiteLayout>
  );
};

export default Index;
