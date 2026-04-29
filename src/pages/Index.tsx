import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Icon } from "@/components/ui/Icon";
import { PROJECTS, SOCIAL_LINKS } from "@/content/site";

const Index = () => (
  <SiteLayout title="The Atrium">
    {/* Hero */}
    <header className="relative min-h-screen flex items-center justify-center pt-24 px-6 md:px-8 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary-fixed-dim rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary-fixed-dim rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 max-w-5xl w-full text-center">
        <span className="font-label uppercase tracking-[0.3em] text-[12px] text-secondary mb-8 block opacity-80 relative z-10">
          Ivan de Murard
        </span>
        <div className="relative">
          {/* Animated gold halo centered behind the headline */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] max-w-[110vw] rounded-full gold-halo gold-halo-pulse pointer-events-none z-0"
          />
          <h1 className="relative z-10 font-headline text-5xl md:text-8xl text-primary leading-[1.1] italic perspective-text">
            Welcome.
            <br />
            <span className="text-on-primary-container opacity-90">It's great to see you!</span>
          </h1>
        </div>
        <p className="mt-12 text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-light">
          A digital practice rooted in the philosophy of high-hospitality. I design and ship AI-powered systems that
          deliver measurable business impact — reducing operational costs, eliminating waste, and unlocking new value —
          while restoring the human touch in complex environments.
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
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
        <span className="font-label text-[10px] uppercase tracking-widest">Descend</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </header>

    {/* Current Journeys */}
    <section className="py-24 md:py-32 px-6 md:px-8 max-w-screen-2xl mx-auto">
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
        {Object.values(PROJECTS).map((p) => (
          <Link key={p.slug} to={`/${p.slug}`} className="group block">
            <div className="aspect-[4/3] overflow-hidden bg-surface-container-high rounded-lg relative">
              <img
                src={p.image}
                alt={`${p.name} project preview`}
                loading="lazy"
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-primary/15 mix-blend-multiply transition-opacity group-hover:opacity-0" />
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
    </section>

    {/* Shall we begin? */}
    <section className="py-24 md:py-32 px-6 md:px-8 max-w-5xl mx-auto text-center">
      <div className="bg-gradient-to-br from-primary-fixed/50 via-surface-container-low to-primary-fixed-dim/30 p-12 md:p-24 rounded-lg relative overflow-hidden group ambient-shadow">
        <div className="absolute inset-0 bg-primary-fixed/25 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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
            className="text-primary font-medium border-b border-primary/30 pb-1 font-headline italic tracking-wide hover:opacity-70 transition-all"
          >
            Email
          </a>
          <a
            href={SOCIAL_LINKS.schedule}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium border-b border-primary/30 pb-1 font-headline italic tracking-wide hover:opacity-70 transition-all"
          >
            Book a Call
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium border-b border-primary/30 pb-1 font-headline italic tracking-wide hover:opacity-70 transition-all"
          >
            LinkedIn
          </a>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium border-b border-primary/30 pb-1 font-headline italic tracking-wide hover:opacity-70 transition-all"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  </SiteLayout>
);

export default Index;
