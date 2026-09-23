import { AnimaFigure } from "./AnimaFigure";

const Arrow = () => (
  <svg viewBox="0 0 40 12" className="h-3 w-10 shrink-0 mx-auto sm:mx-0" aria-hidden="true">
    <line x1="0" y1="6" x2="32" y2="6" className="stroke-outline" strokeWidth="1" />
    <path d="M32 2.5 L39 6 L32 9.5" className="fill-none stroke-outline" strokeWidth="1" />
  </svg>
);

const Box = ({
  kicker,
  title,
  line,
}: {
  kicker: string;
  title: string;
  line: string;
}) => (
  <div className="flex-1 min-w-0 border border-outline-variant bg-surface-container-lowest p-4">
    <span className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary block mb-1">
      {kicker}
    </span>
    <p className="font-headline italic text-primary text-lg leading-tight mb-1">{title}</p>
    <p className="font-body text-sm text-on-surface-variant leading-relaxed">{line}</p>
  </div>
);

/** Fig. 6.1: the scope gate. One declared layer passes, a whole person does not. */
export const AnimaGateDiagram = () => (
  <AnimaFigure
    label="Fig. 6.1 · The scope gate"
    note="One layer per call"
    caption="A boundary that depends on people asking politely is not a boundary."
  >
    <div className="flex flex-col sm:flex-row sm:items-stretch gap-3">
      <Box
        kicker="Caller"
        title="Orchestrator"
        line="Declares one layer, for one purpose."
      />
      <div className="flex items-center justify-center sm:px-1">
        <Arrow />
      </div>
      <Box
        kicker="Request that passes"
        title="Semantic layer, room assignment"
        line="Scoped, logged, answerable."
      />
      <div className="flex items-center justify-center sm:px-1">
        <Arrow />
      </div>
      <Box kicker="Anima" title="Answer" line="Who this guest is right now. Nothing more." />
    </div>

    <div className="mt-4 border border-dashed border-outline bg-surface-container-low p-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary">
          Request that does not pass
        </span>
        <span className="font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
          Blocked by protocol
        </span>
      </div>
      <p className="mt-2 font-headline italic text-primary text-lg leading-tight line-through decoration-outline">
        "Everything about this guest"
      </p>
      <p className="mt-1 font-body text-sm text-on-surface-variant leading-relaxed">
        There is no call that returns a whole person. It is a structural choice, not a policy one.
      </p>
    </div>

    <div className="mt-4 border-t border-outline-variant pt-3 flex flex-col sm:flex-row sm:items-baseline gap-2">
      <span className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary sm:w-40 shrink-0">
        After the answer
      </span>
      <span className="font-body text-sm text-on-surface-variant leading-relaxed">
        A human validates what the orchestrator proposes. Anima never decides.
      </span>
    </div>
  </AnimaFigure>
);

export default AnimaGateDiagram;
