import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { cn } from "@/lib/utils";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { ContactBlock } from "@/components/case/ContactBlock";
import { PROJECTS } from "@/content/site";
import { STATUSES, type Signal } from "@/content/statuses";
import { CASE_INDEX, GROUP_ARCH, GROUP_SOLO, LEGEND, START_WITH, type CardTint, type IndexCard } from "@/content/caseIndex";
import { useTrackClick } from "@/hooks/useTrackClick";
import sonorPhoto from "@/assets/case-sonor.png";
import compassPhoto from "@/assets/case-paris-compass.jpg";

const kicker = "font-mono text-[11px] font-medium uppercase tracking-[0.12em]";
const RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-secondary";

/** Lamp colour on the page (legend) and on a dark card. One signal, one colour, in both moods. */
const LAMP_PAGE: Record<Signal, string> = { go: "bg-signal-go", warn: "bg-signal-warn", stop: "bg-signal-stop", dark: "bg-signal-dark" };
const LAMP_CARD: Record<Signal, string> = { go: "bg-lamp-go-on-card", warn: "bg-lamp-warn-on-card", stop: "bg-lamp-stop-on-card", dark: "bg-lamp-dark-on-card" };

/** Photos of the two projects that keep one. The rest of the cards are blurred tints. */
const PHOTO: Partial<Record<IndexCard["id"], string>> = { compass: compassPhoto, sonor: sonorPhoto };

const tintBackground = (t: CardTint) =>
  `radial-gradient(45% 55% at 70% 25%, hsl(var(--tint-${t}-hi) / .55), transparent 70%), radial-gradient(40% 50% at 20% 80%, hsl(var(--tint-${t}-lo) / .45), transparent 70%)`;

const Card = ({ card }: { card: IndexCard }) => {
  const track = useTrackClick();
  const project = PROJECTS[card.project];
  const status = STATUSES[card.status];
  const href = `/${project.slug}`;
  const photo = PHOTO[card.id];
  return (
    <article id={card.id}
      className="group relative isolate flex min-h-[340px] scroll-mt-24 flex-col justify-end overflow-hidden rounded-[20px] bg-case-card text-case-ink md:min-h-[400px] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-secondary">
      {card.tint && (
        <div aria-hidden="true" className="absolute -inset-1/4 -z-10 blur-[40px]" style={{ background: tintBackground(card.tint) }} />
      )}
      {photo && (
        <>
          <img src={photo} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-10 h-full w-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-case-card/95 via-case-card/85 to-case-card/70" />
        </>
      )}
      {/* A soft floor under the text, so the tint never lowers its contrast. */}
      {card.tint && <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-case-card/75 via-case-card/30 to-transparent" />}
      <div className="px-5 py-[22px] md:px-[30px] md:pb-[26px] md:pt-7">
        <p className={cn(kicker, photo ? "text-case-ink" : "text-case-ink/80")}>{card.kicker}</p>
        <div className="mt-[10px] flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h3 className="font-headline text-[44px] font-normal leading-none">{project.name}</h3>
          <span className="inline-flex items-center gap-[7px] text-[13px] text-case-ink/90">
            <span aria-hidden="true" className={cn("block h-2 w-2 rounded-full", LAMP_CARD[status.signal])} />
            {status.word}
          </span>
        </div>
        <p className="mt-[14px] max-w-[560px] text-[16.5px] leading-[1.5] text-case-ink/[0.92]">{card.line}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-case-ink/20 pt-4">
          <p className="max-w-[420px] text-[13.5px] text-case-ink/80"><span className={photo ? undefined : "text-case-ink/70"}>{CASE_INDEX.shows}{" "}</span>{card.shows}</p>
          {/* The one link of the card. Its ::after stretches over the whole card, so there is a single focus stop. */}
          <Link to={href} onClick={() => track({ label: project.name, href, kind: "project" })}
            className="inline-flex min-h-10 items-center rounded-full border border-case-ink/40 px-[18px] text-sm after:absolute after:inset-0 after:content-[''] group-hover:border-case-ink focus-visible:outline-none">
            {CASE_INDEX.readCase}<span className="sr-only">: {project.name}</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

const CardList = ({ cards, extra }: { cards: IndexCard[]; extra?: React.ReactNode }) => (
  <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(520px,100%),1fr))] gap-5">
    {cards.map((c) => <Card key={c.id} card={c} />)}
    {extra}
  </div>
);

const CaseStudies = () => {
  const track = useTrackClick();
  return (
    <SiteLayout title="Case studies">
      <Seo
        title="Case Studies, Selected Work by Ivan de Murard"
        description="The Hospitality Multi-Agent Architecture: Aetherix (F&B agent), Tacet (environmental agent), Anima (guest agent). Standalone projects: Rose, Lore, Compass and Sonor. Each states what runs today and what is not proven yet."
        path="/case-studies"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Case Studies",
          url: "https://ivandemurard.com/case-studies",
          hasPart: [...GROUP_ARCH.cards, ...GROUP_SOLO.cards].map((c) => ({
            "@type": "CreativeWork", name: PROJECTS[c.project].name, url: `https://ivandemurard.com/${PROJECTS[c.project].slug}`,
          })),
        }}
      />
      <div className="bg-gradient-to-b from-surface from-30% to-surface-container-high">
        <section className="mx-auto max-w-[1240px] px-6 pb-8 pt-24 md:px-10 md:pt-28">
          <p className={cn(kicker, "text-secondary")}>{CASE_INDEX.kicker}</p>
          <h1 className="mt-[14px] font-headline text-[clamp(48px,6vw,80px)] font-normal leading-none tracking-[-0.02em] text-primary">{CASE_INDEX.title}</h1>
          <p className="mt-[18px] max-w-[620px] text-[19px] text-on-surface-variant">{CASE_INDEX.line}</p>
          <ul className="mt-[18px] flex flex-wrap gap-x-[22px] gap-y-2 text-[13.5px] text-on-surface-variant" aria-label="Status lamps">
            {LEGEND.map((l) => (
              <li key={l.signal} className="inline-flex items-center gap-2">
                <span aria-hidden="true" className={cn("block h-2 w-2 rounded-full", LAMP_PAGE[l.signal])} />{l.label}
              </li>
            ))}
          </ul>
          <div className="mt-9 border-t border-primary pt-4">
            <p className="font-mono text-xs text-on-surface-variant">{CASE_INDEX.startWith}</p>
            <div className="mt-3 flex flex-wrap gap-[10px]">
              {START_WITH.map((s) => (
                <a key={s.id} href={`#${s.id}`} className={cn("inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/35 px-4 text-[14.5px] text-primary", RING)}>
                  <span className="text-on-surface-variant">{s.need}</span> → {s.to}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="g1" className="mx-auto max-w-[1240px] px-6 pt-12 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
            <div className="max-w-[640px]">
              <p className={cn(kicker, "text-secondary")}>{GROUP_ARCH.kicker}</p>
              <h2 id="g1" className="mt-2 font-headline text-[32px] font-normal leading-[1.1] text-primary md:text-[40px]">{GROUP_ARCH.heading}</h2>
              <p className="mt-3 text-[16.5px] text-on-surface-variant">{GROUP_ARCH.line}</p>
            </div>
            <Link to={GROUP_ARCH.linkTo} onClick={() => track({ label: GROUP_ARCH.link, href: GROUP_ARCH.linkTo, kind: "project" })}
              className={cn("border-b border-secondary text-[15px] text-primary", RING)}>{GROUP_ARCH.link}</Link>
          </div>
          <CardList cards={GROUP_ARCH.cards} extra={
            <div className="flex flex-col justify-center gap-[14px] rounded-[20px] border-[1.5px] border-dotted border-primary/35 px-[26px] py-6">
              <p className={cn(kicker, "text-secondary")}>{GROUP_ARCH.noPage.kicker}</p>
              {GROUP_ARCH.noPage.items.map((i) => (
                <p key={i.name}><span className="font-headline text-2xl text-primary">{i.name}</span> <span className="text-sm text-on-surface-variant">· {i.role} · {i.status}</span></p>
              ))}
              <p className="text-sm text-on-surface-variant">{GROUP_ARCH.noPage.note}</p>
            </div>
          } />
        </section>

        <section aria-labelledby="g2" className="mx-auto max-w-[1240px] px-6 pt-20 md:px-10">
          <div className="max-w-[640px]">
            <p className={cn(kicker, "text-secondary")}>{GROUP_SOLO.kicker}</p>
            <h2 id="g2" className="mt-2 font-headline text-[32px] font-normal leading-[1.1] text-primary md:text-[40px]">{GROUP_SOLO.heading}</h2>
            <p className="mt-3 text-[16.5px] text-on-surface-variant">{GROUP_SOLO.line}</p>
          </div>
          <CardList cards={GROUP_SOLO.cards} />
        </section>
        <div aria-hidden="true" className="h-24 md:h-32" />
      </div>
      <ContactBlock />
    </SiteLayout>
  );
};

export default CaseStudies;
