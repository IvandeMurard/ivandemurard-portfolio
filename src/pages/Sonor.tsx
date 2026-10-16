// Source of truth for facts (dates, stack, metrics, status).
// If you change facts here, also update public/sonor.md and public/llms-full.txt.
import { SafeImage } from "@/components/SafeImage";
import { useState } from "react";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import type React from "react";
import { CaseAnchors } from "@/components/case/CaseAnchors";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PROJECTS } from "@/content/site";
import { Term } from "@/components/Term";
import { EntryActions } from "@/components/journal/EntryActions";
import { useMood } from "@/components/MoodProvider";
import sonorCartographie from "@/assets/sonor-cartographie.png";
import sonorRecommandations from "@/assets/sonor-recommandations.png";
import sonorLogo from "@/assets/sonor-logo.png";
import logoBanqueTerritoires from "@/assets/logo-banque-territoires.png";
import logoMatrice from "@/assets/logo-matrice.png";
import logoNightingale from "@/assets/logo-nightingale.png";
import logoPhilosophie from "@/assets/logo-philosophie.png";
import logoTed from "@/assets/logo-ted.png";

const GO_FURTHER = [
  {
    logo: logoNightingale,
    alt: "Nightingale, Journal of the Data Visualization Society",
    title: "Noisy Cities: Behind the Scenes with Karim Douïeb",
    description:
      "Discover how noise pollution open data maps of Paris, Brussels, and New York were made.",
    cta: "Read",
    href: "https://nightingaledvs.com/noisy-cities-behind-the-scenes-with-karim-douieb/",
  },
  {
    logo: logoPhilosophie,
    alt: "Philosophie Magazine",
    title: "Jura: A Forest Under Surveillance",
    description: "Discover how data is used to preserve one of Jura's most important forests.",
    cta: "Read",
    href: "https://www.philomag.com/articles/une-foret-sur-ecoute",
  },
  {
    logo: logoTed,
    alt: "TED",
    title: "TEDx: The benefits of the sound of silence",
    description:
      "TEDx by Mathias Basner telling the dangers of noise pollution and the benefits of silence.",
    cta: "Watch",
    href: "https://www.youtube.com/watch?v=ewNTwBbLUhM",
  },
];

const FIGMA_PROTOTYPE_URL =
  "https://www.figma.com/embed?embed_host=lovable&url=" +
  encodeURIComponent(
    "https://www.figma.com/proto/OcBu81qdpjpPdjHQPA6oae/Sonor-Site-Mairie?content-scaling=fixed&kind=proto&node-id=25-0&page-id=0%3A1&scaling=scale-down&starting-point-node-id=25%3A0",
  );

const META = [
  { label: "Role", value: "Co-founder and Product Lead" },
  { label: "Duration", value: "2020 to 2022" },
  { label: "Team", value: "4 co-founders, plus a developer and data scientist" },
  { label: "Context", value: "Incubated at Matrice (Banque des Territoires)" },
  { label: "Funding", value: "€20k in grants" },
  { label: "Outcome", value: "MVP shipped, commercial discussions with municipalities, no contract" },
];

const NARRATIVE: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "what-happened",
    title: "What happened",
    body: "To ease adoption, we offered services around the platform. Each city asked for something different: a field feasibility study for a Paris district town hall, mediation and a field study for a town west of Paris, communication on actions taken for a metropolitan authority. We had commercial discussions; none became a contract.",
  },
  {
    id: "why-it-stopped",
    title: "Why it stopped",
    body: "Discovery concluded no contract would clear. When the grants and the incubation ended, we stopped Sonor.",
  },
  {
    id: "what-id-change",
    title: "What I'd change",
    body: "Stay on delivering the product. We drifted into a \"neo-agency\" answering every need a city expressed, so the loop lived in our team's time, not in the product. I believe one use case, delivered and repeated, would have had a better chance of a first contract. I cannot prove it.",
  },
  {
    id: "what-i-applied-next",
    title: "What I applied next",
    body: (
      <>
        <Link to="/aetherix" className="text-primary border-b border-outline-variant hover:border-primary">Aetherix</Link> starts with one job, F&B covers, because its result can be checked the next morning. And the loop lives in the product: the recommendation, the manager's reply and the outcome are recorded without anyone in between.
      </>
    ),
  },
  {
    id: "related-work",
    title: "Related work",
    body: (
      <>
        <Link to="/tacet" className="text-primary border-b border-outline-variant hover:border-primary">Tacet</Link> carries the acoustic thesis forward, as an environmental twin for boutique hotels.
      </>
    ),
  },
];

const SONOR_SECTIONS = [
  { id: "hypothesis", label: "Prototype" },
  { id: "product", label: "What it is" },
  ...NARRATIVE.map((n) => ({ id: n.id, label: n.title })),
  { id: "platform", label: "Platform" },
];
const Sonor = () => {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const { mood } = useMood();

  return (
  <SiteLayout title="Sonor: The Quiet Art of Urban Intelligence" sections={SONOR_SECTIONS}>
    <Seo
      title="Sonor, Urban Noise Intelligence for Cities"
      description="B2G SaaS that turned acoustic open data into a decision tool for cities. Taken from discovery to MVP, technical core validated; stopped in 2022 after discovery concluded no contract would clear."
      path="/sonor"
      type="article"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "Sonor",
          headline: "Sonor: The Quiet Art of Urban Intelligence",
          url: "https://ivandemurard.com/sonor",
          about: ["Urban Noise", "Open Data", "Public Sector SaaS"],
          creator: { "@type": "Person", name: "Ivan de Murard", url: "https://ivandemurard.com" },
          dateCreated: "2020-01-01",
        },
      ]}
    />
    <div className="pt-32">
      {/* Hero */}
      <Reveal as="section" className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-16 md:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <span data-reveal-child className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-6 block">
              Case Study: Sonor (2020-2022)
            </span>
            <h1 data-reveal-child style={{ ["--reveal-delay" as string]: "120ms" }} className="headline-ink text-5xl md:text-8xl font-headline italic text-primary leading-[1.1] mb-8">
              Sonor: The Quiet Art of <br />
              Urban Intelligence.
            </h1>
            <p data-reveal-child style={{ ["--reveal-delay" as string]: "320ms" }} className="text-xl md:text-2xl font-body text-on-surface-variant max-w-xl leading-relaxed mb-16">
              B2G <Term id="saas">SaaS</Term> that turned acoustic <Term id="openData">open data</Term> into a decision tool for cities. Taken from discovery to MVP, technical core validated; stopped in 2022 after discovery concluded no contract would clear.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-8 border-t border-outline-variant">
              {META.map((m, i) => (
                <div key={m.label} data-reveal-child style={{ ["--reveal-delay" as string]: `${440 + i * 60}ms` }}>
                  <h4 className="font-label uppercase tracking-widest text-[10px] text-secondary mb-2">{m.label}</h4>
                  <p className="text-on-surface-variant font-medium">{m.value}</p>
                </div>
              ))}
            </div>
            <div data-reveal-child style={{ ["--reveal-delay" as string]: "800ms" }} className="mt-6">
              <a
                href="https://sonor.dorik.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors border-b border-outline-variant hover:border-primary/60 pb-0.5"
              >
                <span>Original project site (2020)</span>
                <Icon name="arrow_outward" className="text-sm" />
              </a>
            </div>
            <div data-reveal-child style={{ ["--reveal-delay" as string]: "860ms" }} className="mt-8">
              <EntryActions title="Sonor" markdownPath="/sonor.md" variant="case" />
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-end">
            <div data-reveal-child style={{ ["--reveal-delay" as string]: "200ms", viewTransitionName: "case-hero-sonor" }} className="w-full aspect-[4/5] bg-surface-container-high overflow-hidden relative group">
              <SafeImage
                src={PROJECTS.sonor.image}
                alt="Aerial view of urban landscape"
                className="kenburns w-full h-full object-cover opacity-90"
              />
            </div>
          </div>
        </div>
      </Reveal>

      {/* The Hypothesis (Figma prototype) */}
      <section id="hypothesis" className="py-16 md:py-28 bg-surface scroll-mt-24">
        <div className="px-6 md:px-12 max-w-4xl mx-auto text-center">
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-6 block">
            The Hypothesis
          </span>
          <h2 className="text-4xl md:text-5xl font-headline italic text-primary mb-12">
            Our first 2020 prototype
          </h2>
          <div className="relative w-full pt-[56.25%] bg-surface-container-high rounded-xl overflow-hidden shadow-2xl border border-outline-variant">
            <iframe
              title="Sonor 2020 prototype"
              src={FIGMA_PROTOTYPE_URL}
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="font-headline italic text-on-surface-variant text-lg md:text-xl leading-relaxed mt-10 max-w-3xl mx-auto">
            The vision: a loop between a city and its residents. The platform gathers information (noise cartography, tracking of field surveys and regulation, alerts left by residents), field surveys collect what residents experience, findings are reported to the city, and the city's actions are communicated back to residents.
          </p>
        </div>
      </section>

      {/* Product interfaces */}
      <section id="product" className="py-16 md:py-28 overflow-hidden bg-surface-container scroll-mt-24">
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-6 block">
              The Product
            </span>
            <h2 className="text-4xl md:text-5xl font-headline italic text-primary">
              From prototype to MVP.
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center mb-16 md:mb-28">
            <div className="order-2 lg:order-1">
              <div className="relative bg-surface-container rounded-lg p-4 shadow-xl">
              <button
                type="button"
                onClick={() =>
                  setLightbox({ src: sonorCartographie, alt: "Sonor Cartographie dashboard, real-time acoustic mapping" })
                }
                className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                <SafeImage
                  src={sonorCartographie}
                  alt="Sonor Cartographie dashboard, real-time acoustic mapping"
                  loading="lazy"
                  className="w-full h-auto rounded border border-outline-variant shadow-sm cursor-zoom-in transition-transform duration-500 hover:scale-[1.01]"
                />
              </button>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h3 className="text-4xl font-headline italic text-primary">What it is</h3>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                A SaaS platform built to turn open noise data into cartography and recommendations for city teams: map exposure, prioritise interventions, justify policy with evidence.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-8">
              <h3 className="text-4xl font-headline italic text-primary">A loop between a city and its residents</h3>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                Residents leave alerts and field surveys collect what they experience. Findings are reported to the city, and the city's actions are communicated back to residents.
              </p>
            </div>
            <div>
              <div className="relative bg-surface-container rounded-lg p-4 shadow-xl">
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      src: sonorRecommandations,
                      alt: "Sonor Recommandations interface, prioritized action plans for planners",
                    })
                  }
                  className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <SafeImage
                    src={sonorRecommandations}
                    alt="Sonor Recommandations interface, prioritized action plans for planners"
                    loading="lazy"
                    className="w-full h-auto rounded border border-outline-variant shadow-sm cursor-zoom-in transition-transform duration-500 hover:scale-[1.01]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Narrative */}
      <section className="py-16 md:py-28 bg-surface-container-low scroll-mt-24">
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto space-y-16 md:space-y-20">
          {NARRATIVE.map((n) => (
            <div key={n.id} id={n.id} className="flex flex-col md:flex-row gap-6 md:gap-20 scroll-mt-24">
              <div className="w-full md:w-1/3">
                <h2 className="text-3xl md:text-4xl font-headline italic text-primary">{n.title}</h2>
              </div>
              <p className="w-full md:w-2/3 text-lg md:text-xl text-on-surface-variant leading-relaxed">{n.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore the platform */}
      <section id="platform" className="py-16 md:py-28 bg-surface-container-low scroll-mt-24">
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-headline italic text-primary">Explore the Platform</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="relative w-full pt-[56.25%] bg-surface-container-high rounded-xl overflow-hidden shadow-2xl border border-outline-variant">
              <iframe
                title="Sonor walkthrough"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                src="https://www.loom.com/embed/80aea87ed30245bdb4a0847abbda7aae"
              />
            </div>
            <div className="text-center">
              <a
                href="https://byronbark.github.io/sonor-web-component/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-on-primary font-headline italic text-lg rounded-full hover:bg-primary-container transition-colors shadow-lg"
              >
                Banque des Territoires vision →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Acknowledgments */}
      <section className="py-16 md:py-28 bg-surface border-t border-outline-variant">
        <div className="px-6 md:px-12 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-headline italic text-primary mb-12">Acknowledgments</h2>
          <p className="text-xl md:text-2xl font-headline text-on-surface-variant leading-relaxed mb-12 md:mb-20 max-w-3xl mx-auto">
            This project would not have been possible without the support of Banque des Territoires and Matrice
            association, and the collaboration of my three co-founders: Émilie, Majda and Benjamin.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
            <SafeImage
              src={sonorLogo}
              alt="Sonor logo"
              loading="lazy"
              className="h-16 md:h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
            <SafeImage
              src={logoBanqueTerritoires}
              alt="Banque des Territoires, Groupe Caisse des Dépôts"
              loading="lazy"
              className="h-16 md:h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
            <SafeImage
              src={logoMatrice}
              alt="Matrice"
              loading="lazy"
              className="h-16 md:h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </section>

      {/* Go Further */}
      <section className="py-16 md:py-28 bg-surface-container-lowest border-t border-outline-variant">
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <p className="font-label uppercase tracking-[0.3em] text-xs text-secondary mb-4">
              Further Reading
            </p>
            <h2 className="text-4xl md:text-5xl font-headline italic text-primary">Go Further</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
            {GO_FURTHER.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-surface border border-outline-variant rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-outline-variant"
              >
                <div className="h-16 mb-8 flex items-center">
                  <SafeImage
                    src={item.logo}
                    alt={item.alt}
                    className="max-h-12 max-w-[70%] object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-headline italic text-on-surface mb-4 leading-snug">
                  {item.title}
                </h3>
                <p className="text-base text-on-surface-variant leading-relaxed mb-8 flex-1">
                  {item.description}
                </p>
                <span className="inline-flex items-center gap-2 font-label uppercase tracking-widest text-xs text-primary">
                  {item.cta}
                  <Icon name="open_in_new" className="text-sm" />
                </span>
              </a>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/contact"
              className="inline-block bg-primary text-on-primary px-10 py-4 rounded-xl font-label uppercase tracking-[0.2em] text-[11px] hover:bg-primary-container transition-all"
            >
              Begin a Conversation
            </Link>
          </div>
        </div>
      </section>

      <div className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-12 text-right">
        <a
          href="/sonor.md"
          className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors"
        >
          View as markdown
        </a>
      </div>
    </div>

    <Dialog open={!!lightbox} onOpenChange={(open) => !open && setLightbox(null)}>
      <DialogContent className="max-w-[95vw] md:max-w-6xl p-2 md:p-4 bg-surface-container border-outline-variant">
        {lightbox && (
          <SafeImage
            src={lightbox.src}
            alt={lightbox.alt}
            className="w-full h-auto max-h-[85vh] object-contain rounded"
          />
        )}
      </DialogContent>
    </Dialog>
  </SiteLayout>
  );
};

export default Sonor;
