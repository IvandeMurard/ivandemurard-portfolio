import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { cn } from "@/lib/utils";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { ContactBlock } from "@/components/case/ContactBlock";
import { useTrackClick } from "@/hooks/useTrackClick";
import { renderBold } from "@/lib/inlineBold";
import { CARDS, INDEX_COPY, INDEX_HERO, LEAD, heroMeta, metaLine, noteBySlug, notesInOrder, systemNames } from "@/content/journalIndex";
import { PROJECTS, SOCIAL_LINKS } from "@/content/site";
import type { Signal } from "@/content/statuses";

const KICK = "font-mono text-[11px] font-medium uppercase leading-snug tracking-[0.12em]";
const RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-secondary";
const GO = "inline-flex min-h-11 items-center rounded-full px-5 text-[15px] font-medium";
const LAMP: Record<Signal, string> = { go: "bg-signal-go", warn: "bg-signal-warn", stop: "bg-signal-stop", dark: "bg-signal-dark" };

const project = (name: string) => Object.values(PROJECTS).find((p) => p.name === name);

const Journal = () => {
  const track = useTrackClick();
  const lead = noteBySlug(LEAD.slug);
  const others = notesInOrder().filter((e) => e.slug !== LEAD.slug);
  const systems = systemNames().map(project).filter((p): p is NonNullable<ReturnType<typeof project>> => Boolean(p));
  const open = (slug: string, label: string) => () => track({ label, href: `/journal/${slug}`, kind: "project" });

  return (
    <SiteLayout title="Field Notes">
      <Seo
        title="Field Notes by Ivan de Murard"
        description="Notes from the field on product, evaluation, and AI systems design. Written while building Aetherix and other 0 to 1 products."
        path="/journal"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Field Notes",
          url: "https://ivandemurard.com/journal",
          hasPart: notesInOrder().map((e) => ({
            "@type": "Article",
            headline: e.title,
            url: `https://ivandemurard.com/journal/${e.slug}`,
            datePublished: e.date,
            dateModified: e.updates?.map((u) => u.date).sort().at(-1) ?? e.date,
          })),
        }}
      />
      <div className="bg-gradient-to-b from-surface from-35% to-surface-container-high">
        <section className="mx-auto max-w-[1240px] px-6 pb-7 pt-24 md:px-10 md:pt-28">
          <p className={cn(KICK, "text-secondary")}>{INDEX_HERO.kicker}</p>
          <h1 className="mt-3.5 max-w-[900px] font-headline text-[clamp(44px,5.4vw,72px)] font-normal leading-[1.02] tracking-[-0.02em] text-heading">{INDEX_HERO.title}</h1>
          <p className="mt-[18px] max-w-[660px] text-[19px] text-on-surface-variant">{INDEX_HERO.line}</p>
          <p className="mt-[22px] font-mono text-[12.5px] leading-snug text-on-surface-variant">{heroMeta()}</p>
        </section>

        <section aria-labelledby="lead" className="mx-auto max-w-[1240px] px-6 pt-5 md:px-10">
          <p className={cn(KICK, "text-secondary")}>{INDEX_COPY.startHere}</p>
          <div className="mt-3.5 grid overflow-hidden rounded-[20px] border border-outline-variant lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <div className="relative flex flex-col gap-[18px] bg-surface-container-lowest p-6 md:p-10">
              <p className={cn(KICK, "text-on-surface-variant")}>{lead.decision}</p>
              <h2 id="lead" className="font-headline text-[34px] font-normal leading-[1.06] text-heading md:text-[44px]">{noteTitle(lead.title)}</h2>
              <p className="text-[17.5px] text-on-surface">{LEAD.pitch}</p>
              <p className="text-[15px] text-on-surface-variant">{LEAD.why}</p>
              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3">
                {/* The one link of the card: its ::after stretches over the whole lead panel. */}
                <Link to={`/journal/${lead.slug}`} onClick={open(lead.slug, lead.title)}
                  className={cn(GO, "bg-primary text-on-primary after:absolute after:inset-0 after:content-[''] focus-visible:outline-none")}>
                  {INDEX_COPY.readNote}<span className="sr-only">: {lead.title}</span>
                </Link>
                <p className="font-mono text-[12.5px] text-on-surface-variant">{metaLine(lead)}</p>
              </div>
            </div>
            <div className="section-inverse flex flex-col gap-4 p-6 md:p-10">
              <p className="font-mono text-[13px] font-medium uppercase leading-snug tracking-[0.12em] text-secondary">{LEAD.proof.kicker}</p>
              <p className="font-headline text-[24px] font-normal leading-[1.25] text-heading md:text-[28px]">{LEAD.proof.lead}</p>
              <ol className="m-0 mt-1 flex list-none flex-col gap-3 p-0">
                {LEAD.proof.steps.map((s, i) => (
                  <li key={i} className="grid grid-cols-[28px_1fr] items-baseline gap-x-3">
                    <span className="font-mono text-[13px] text-secondary" aria-hidden>{i + 1}</span>
                    <p className={cn("m-0 text-[15.5px] text-on-surface", s.tone === "fail" && "[&_strong]:text-lamp-stop-on-card")}>{renderBold(s.text)}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-auto font-mono text-[13px] text-on-surface-variant">{LEAD.proof.caption}</p>
            </div>
          </div>
        </section>

        <section aria-label={INDEX_COPY.otherNotes} className="mx-auto max-w-[1240px] px-6 pt-14 md:px-10">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(520px,100%),1fr))] gap-5">
            {others.map((e) => {
              const c = CARDS[e.slug];
              return (
                <article key={e.slug} className="relative flex flex-col gap-4 rounded-[20px] border border-outline-variant bg-surface-container-lowest p-6 md:p-8 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-secondary">
                  <p className={cn(KICK, "text-on-surface-variant")}>{e.decision}</p>
                  <h2 className="font-headline text-[28px] font-normal leading-[1.1] text-heading md:text-[34px]">{e.title}</h2>
                  <p className="text-[16.5px] text-on-surface">{c.pitch}</p>
                  <div className="border-l-[3px] border-secondary py-1 pl-4">
                    <p className={cn(KICK, "text-secondary")}>{c.moment.label}</p>
                    <p className="mt-2 font-headline text-[19px] font-normal leading-[1.3] text-heading md:text-[21px]">{c.moment.text}</p>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-outline-variant pt-3.5">
                    <p className="font-mono text-[12.5px] text-on-surface-variant">{metaLine(e)}</p>
                    <Link to={`/journal/${e.slug}`} onClick={open(e.slug, e.title)}
                      className={cn(GO, "border border-primary/35 text-primary after:absolute after:inset-0 after:content-[''] focus-visible:outline-none")}>
                      {INDEX_COPY.readNote}<span className="sr-only">: {e.title}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section aria-label={INDEX_COPY.systems} className="mx-auto max-w-[1240px] px-6 pb-24 pt-12 md:px-10">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-y border-outline-variant py-[18px]">
            <p className="font-mono text-[12.5px] text-on-surface-variant">{INDEX_COPY.systems}</p>
            {systems.map((p) => (
              <Link key={p.slug} to={`/${p.slug}`} onClick={() => track({ label: p.name, href: `/${p.slug}`, kind: "project" })}
                className={cn("inline-flex items-center gap-2 text-primary", RING)}>
                <span aria-hidden="true" className={cn("block h-2 w-2 rounded-full", LAMP[p.status.signal])} />
                <span className="font-headline text-xl">{p.name}</span>
                <span className="text-[13.5px] text-on-surface-variant">{p.status.word}</span>
              </Link>
            ))}
            <Link to="/case-studies" className={cn("ml-auto border-b border-secondary text-[15px] text-primary", RING)}>{INDEX_COPY.allCases}</Link>
          </div>
        </section>
      </div>

      <ContactBlock
        after={<>{INDEX_COPY.compare.lead} <a href={SOCIAL_LINKS.email} className="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">{INDEX_COPY.compare.link}</a>.</>}
      />
    </SiteLayout>
  );
};

/** The short title of a note for the lead heading: up to its first "?". */
const noteTitle = (title: string): string => {
  const q = title.indexOf("?");
  return q >= 0 ? title.slice(0, q + 1) : title;
};

export default Journal;
