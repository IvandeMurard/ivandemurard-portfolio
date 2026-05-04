import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Icon } from "@/components/ui/Icon";
import { PROJECTS } from "@/content/site";
import { CaseHoverPreview } from "@/components/CaseHoverPreview";

interface RowProps {
  index: string;
  slug: string;
  name: string;
  body: string;
  image: string;
  cta: string;
  flip?: boolean;
}

const Row = ({ index, slug, name, body, image, cta, flip }: RowProps) => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
    <div className={`md:col-span-6 group relative ${flip ? "md:order-2" : ""}`}>
      <CaseHoverPreview
        slug={slug}
        image={image}
        alt={`${name} cover`}
        className="aspect-[4/5] md:aspect-[16/11]"
      />
      <div className={`absolute -bottom-8 ${flip ? "-left-8" : "-right-8"} w-40 h-40 hilma-circle hidden md:block pointer-events-none`} />
    </div>
    <div className={`md:col-span-6 flex flex-col justify-center ${flip ? "md:order-1" : ""}`}>
      <span className="font-label uppercase tracking-[0.2em] text-[10px] text-on-tertiary-fixed-variant mb-4">
        {index}
      </span>
      <h2 className="font-headline text-4xl md:text-5xl text-primary mb-5 italic">{name}</h2>
      <p className="text-on-surface-variant mb-7 leading-relaxed">{body}</p>
      <Link
        to={`/${slug}`}
        className="text-secondary font-body tracking-wider hover:underline underline-offset-8 transition-all duration-500 inline-flex items-center gap-2 group w-fit"
      >
        {cta}
        <Icon name="arrow_forward" className="text-sm group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </div>
);

const Journeys = () => (
  <SiteLayout title="Stories">
    <div className="pt-28 md:pt-32 pb-24 overflow-hidden">
      {/* Hero */}
      <header className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-16 md:mb-20 relative">
        <div className="absolute -top-20 -left-20 w-96 h-96 hilma-circle pointer-events-none" />
        <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-6 block">
          The Project Index
        </span>
        <h1 className="font-headline text-6xl md:text-8xl text-primary leading-[1.05] italic mb-8 md:mb-10">
          Case <br />
          <span className="pl-12 md:pl-24">studies</span>
        </h1>
        <p className="text-on-surface-variant font-light leading-relaxed max-w-xl text-base md:text-lg">
          A curated collection of projects where technology quietly becomes an act of care.
        </p>
      </header>

      {/* Asymmetric rows */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto space-y-16 md:space-y-24">
        <Row
          index="Journey 01"
          slug="sonor"
          name={PROJECTS.sonor.name}
          body="Reclaiming urban silence through data. As Co-founder & Product Lead, I built a SaaS platform that turns open data into actionable acoustic intelligence for cities. Used by municipalities to protect citizen health, drive sustainability policies, and increase territorial attractiveness."
          image={PROJECTS.sonor.image}
          cta="Explore the Narrative"
        />
        <Row
          index="Journey 02"
          slug="atherix"
          name={PROJECTS.atherix.name}
          body="An agentic AI framework for boutique hotel operations. It anticipates staffing and F&B needs in real time, reduces food waste and operational costs, and frees the human team to focus on exceptional guest experiences."
          image={PROJECTS.atherix.image}
          cta="Trace the Path"
          flip
        />
        <Row
          index="Journey 03"
          slug="tacet"
          name={PROJECTS.tacet.name}
          body="The Architecture of Silence. A personal mobile sanctuary for Parisians. Using real-time Bruitparif data and Serenity Score, it helps users reclaim quiet in daily life, housing choices, and urban commutes."
          image={PROJECTS.tacet.image}
          cta="Begin the Ascent"
        />
      </section>

      {/* CTA */}
      <section className="mt-28 md:mt-40 mb-16 md:mb-24 px-6 md:px-12 text-center max-w-2xl mx-auto">
        <div className="w-px h-24 bg-primary/20 mx-auto mb-12 md:mb-16" />
        <h3 className="font-headline text-3xl md:text-4xl italic text-primary mb-12">
          Every journey begins with a single conversation.
        </h3>
        <Link
          to="/contact"
          className="inline-block bg-primary text-on-primary px-10 py-5 rounded-xl font-label uppercase tracking-[0.2em] text-[11px] transition-all duration-500 hover:bg-primary-container active:scale-95 ambient-shadow"
        >
          Inquire Within
        </Link>
      </section>
    </div>
  </SiteLayout>
);

export default Journeys;
