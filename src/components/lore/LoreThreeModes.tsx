import { Icon } from "@/components/ui/Icon";
import { Term } from "@/components/Term";
import type { ReactNode } from "react";

const MODES: { icon: string; title: string; lead: string; body: ReactNode }[] = [
  {
    icon: "mic",
    title: "Capture",
    lead: "The senior speaks.",
    body: (
      <>
        After an intervention, the senior debriefs by voice. Lore interviews back: asks follow-ups, flags what is
        ambiguous, and files the knowledge against the airframe, the component and the conditions it applies to.
      </>
    ),
  },
  {
    icon: "hearing",
    title: "Query",
    lead: "The junior asks.",
    body: (
      <>
        Hands inside the machine, a question out loud. The answer arrives in three layers, in this order: the relevant{" "}
        <Term id="sop">SOP</Term> excerpt, then the senior's oral knowledge attributed by name and month, then this
        specific aircraft's own history.
      </>
    ),
  },
  {
    icon: "edit_note",
    title: "Log",
    lead: "The work is recorded.",
    body: (
      <>
        "Log: N1 vibration 2.4 units, ambient 6°C, no escalation." Straight into the aircraft's memory, spoken, no
        keyboard.
      </>
    ),
  },
];

export const LoreThreeModes = () => (
  <div>
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0 m-0">
      {MODES.map((m, i) => (
        <li
          key={m.title}
          data-reveal-child
          style={{ ["--reveal-delay" as string]: `${200 + i * 120}ms` }}
          className="bg-surface-container-low border border-outline-variant/25 rounded-2xl p-6 md:p-8 flex flex-col gap-4"
        >
          <Icon name={m.icon} className="text-secondary text-3xl" />
          <div>
            <h3 className="font-headline italic text-2xl text-primary leading-tight">{m.title}</h3>
            <p className="text-on-surface-variant not-italic font-body text-base mt-1">{m.lead}</p>
          </div>
          <p className="text-on-surface-variant leading-relaxed">{m.body}</p>
        </li>
      ))}
    </ul>
    <p
      data-reveal-child
      style={{ ["--reveal-delay" as string]: "600ms" }}
      className="mt-10 font-headline italic text-primary text-xl md:text-2xl leading-snug max-w-3xl"
    >
      Rule number one: Lore never contradicts a procedure. It completes it.
    </p>
  </div>
);

export default LoreThreeModes;
