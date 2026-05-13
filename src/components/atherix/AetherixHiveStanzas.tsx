import { Reveal } from "@/components/Reveal";

/**
 * The Hive paragraph, broken into three animated stanzas.
 * Avoids a dense block of text. Each stanza reveals with a stagger.
 */
export const AetherixHiveStanzas = () => (
  <section className="relative py-24 md:py-32 px-6 md:px-12 bg-surface-container-lowest overflow-hidden">
    {/* Soft gold halo, drifting */}
    <div
      aria-hidden="true"
      className="absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full gold-halo opacity-30 halo-drift pointer-events-none"
    />
    {/* Orbiting dots, decorative */}
    <svg
      aria-hidden="true"
      viewBox="0 0 800 200"
      className="absolute inset-x-0 top-12 w-full h-32 opacity-50 pointer-events-none"
    >
      <circle cx="120" cy="100" r="2" fill="hsl(var(--secondary))" opacity="0.6" />
      <circle cx="220" cy="60" r="1.5" fill="hsl(var(--secondary))" opacity="0.4" />
      <circle cx="340" cy="120" r="2" fill="hsl(var(--secondary))" opacity="0.5" />
      <circle cx="460" cy="80" r="1.5" fill="hsl(var(--secondary))" opacity="0.4" />
      <circle cx="580" cy="110" r="2" fill="hsl(var(--secondary))" opacity="0.6" />
      <circle cx="680" cy="70" r="1.5" fill="hsl(var(--secondary))" opacity="0.4" />
    </svg>

    <Reveal as="div" className="relative max-w-4xl mx-auto flex flex-col gap-16 md:gap-20">
      <div data-reveal-child className="text-center">
        <span className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">The Hive</span>
        <h2 className="font-headline italic text-4xl md:text-6xl text-primary mt-4 leading-[1.05]">
          Scaling soul through collective intelligence.
        </h2>
      </div>

      {/* Stanza 1 */}
      <div
        data-reveal-child
        style={{ ["--reveal-delay" as string]: "200ms" }}
        className="flex flex-col md:flex-row gap-6 md:gap-10 items-start"
      >
        <span className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary md:pt-2 shrink-0 md:w-16">
          01
        </span>
        <p className="text-on-surface text-lg md:text-xl leading-relaxed">
          Beyond individual optimisation, Aetherix introduces a proactive, anonymous, metadata-driven intelligence
          layer. It aggregates contextual signals from properties with a similar DNA: guest profiles, hotel type,
          location.
        </p>
      </div>

      {/* Stanza 2, pulled out as italic display */}
      <div
        data-reveal-child
        style={{ ["--reveal-delay" as string]: "400ms" }}
        className="border-l-2 border-secondary-fixed-dim/60 pl-6 md:pl-10 max-w-3xl mx-auto"
      >
        <p className="font-headline italic text-2xl md:text-3xl text-primary leading-snug">
          A boutique hotel can now anticipate a surge in specific guest needs, or right-size F&amp;B inventory, by
          tapping into the shared wisdom of the network. Without ever sharing data.
        </p>
      </div>

      {/* Stanza 3, closing, large */}
      <div
        data-reveal-child
        style={{ ["--reveal-delay" as string]: "600ms" }}
        className="text-center"
      >
        <span aria-hidden="true" className="block divider-fall h-12 mx-auto mb-6" />
        <p className="font-headline text-2xl md:text-3xl text-primary leading-relaxed max-w-3xl mx-auto">
          Scale stops being a corporate privilege. It becomes a distributed technological asset, available to every
          independent operator.
        </p>
      </div>
    </Reveal>
  </section>
);

export default AetherixHiveStanzas;
