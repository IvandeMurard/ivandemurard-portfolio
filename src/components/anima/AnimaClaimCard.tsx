import { AnimaFigure } from "./AnimaFigure";

type Claim = {
  regime: string;
  source: string;
  confidence: number;
  age: string;
  reading: string;
};

const CLAIMS: Claim[] = [
  {
    regime: "Stated once",
    source: "Said to a receptionist, one stay",
    confidence: 0.52,
    age: "14 months",
    reading: "Held, and it has faded since nothing renewed it.",
  },
  {
    regime: "Confirmed ×4",
    source: "Requested again on four stays",
    confidence: 0.91,
    age: "Last renewed 3 weeks ago",
    reading: "Corroboration is counted, not claimed.",
  },
  {
    regime: "Inferred",
    source: "Derived from booking behaviour",
    confidence: 0.34,
    age: "2 months",
    reading: "Marked as inferred, and it never outvotes something said.",
  },
];

const Decay = ({ value }: { value: number }) => (
  <div className="mt-2">
    <div className="h-1.5 w-full border border-outline-variant" aria-hidden="true">
      <div className="h-full bg-secondary" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
    <span className="mt-1 block font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant tabular-nums">
      Confidence {value.toFixed(2)} · illustrative
    </span>
  </div>
);

/** Fig. 4.1: one preference, three regimes. Source, confidence, age, decay. */
export const AnimaClaimCard = () => (
  <AnimaFigure
    label="Fig. 4.1 · One preference, three claims"
    note='Claim: "prefers a high floor" · Illustrative values'
    caption="Illustrative values, nothing here is measured. The same sentence, held three different ways. Nothing is stored as a fact."
  >
    <ol className="m-0 list-none p-0 grid grid-cols-1 sm:grid-cols-3 gap-px bg-outline-variant border border-outline-variant">
      {CLAIMS.map((c) => (
        <li key={c.regime} className="bg-surface-container-lowest p-4 flex flex-col">
          <span className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary block mb-2">
            {c.regime}
          </span>
          <p className="font-headline italic text-primary text-lg leading-tight mb-3">
            Prefers a high floor
          </p>
          <dl className="m-0 space-y-1 text-sm flex-1">
            <div className="flex gap-2">
              <dt className="font-label uppercase tracking-[0.14em] text-[10px] text-on-surface-variant w-16 shrink-0 pt-0.5">
                Source
              </dt>
              <dd className="m-0 font-body text-sm text-on-surface-variant leading-relaxed">
                {c.source}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-label uppercase tracking-[0.14em] text-[10px] text-on-surface-variant w-16 shrink-0 pt-0.5">
                Age
              </dt>
              <dd className="m-0 font-body text-sm text-on-surface-variant leading-relaxed">
                {c.age}
              </dd>
            </div>
          </dl>
          <Decay value={c.confidence} />
          <p className="mt-3 border-t border-outline-variant pt-3 font-body text-xs text-on-surface-variant leading-relaxed">
            {c.reading}
          </p>
        </li>
      ))}
    </ol>
  </AnimaFigure>
);

export default AnimaClaimCard;
