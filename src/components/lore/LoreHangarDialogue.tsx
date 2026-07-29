const EXCHANGE: { speaker: "Thomas" | "Lore"; text: string }[] = [
  {
    speaker: "Thomas",
    text: "I'm on F-GKXA, CFM56-5B, fan section. Unusual low-frequency vibration on the N1 shaft. It's not in the job card. What do I know about this?",
  },
  {
    speaker: "Lore",
    text: "AMM 72-21-00 requires escalation above 4 units. Marc Delaunay noted in October that F-GKXA specifically shows a harmonic resonance between 2 and 3 units below 8°C, a known characteristic of this airframe, not a defect. He recommended logging it and monitoring across the next cycles before escalating. Always verify the AMM procedure before intervening.",
  },
  {
    speaker: "Thomas",
    text: "Logging: vibration at 2.4 units, temperature 6°C, no escalation per Marc's note. Add this to F-GKXA's memory.",
  },
  { speaker: "Lore", text: "Logged. F-GKXA memory updated." },
];

/**
 * A voice exchange, not a chat UI: speaker names as small caps labels,
 * speech set in the serif face, separated by hairlines.
 */
export const LoreHangarDialogue = () => (
  <div className="border-t border-outline-variant/30">
    {EXCHANGE.map((line, i) => (
      <div
        key={i}
        data-reveal-child
        style={{ ["--reveal-delay" as string]: `${180 + i * 120}ms` }}
        className="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-2 md:gap-8 border-b border-outline-variant/30 py-6 md:py-8"
      >
        <span
          className={`font-label uppercase tracking-[0.25em] text-[10px] pt-2 ${
            line.speaker === "Lore" ? "text-secondary" : "text-on-surface-variant"
          }`}
        >
          {line.speaker}
        </span>
        <p
          className={`font-headline text-lg md:text-xl leading-relaxed ${
            line.speaker === "Lore" ? "text-primary italic" : "text-on-surface"
          }`}
        >
          {line.text}
        </p>
      </div>
    ))}
  </div>
);

export default LoreHangarDialogue;
