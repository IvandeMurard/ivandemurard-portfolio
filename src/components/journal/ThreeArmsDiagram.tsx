type Arm = {
  key: string;
  name: string;
  when: string;
  span: [number, number]; // 0..100 along the release timeline
};

const ARMS: Arm[] = [
  { key: "A", name: "Offline", when: "Before the merge", span: [0, 34] },
  { key: "B", name: "Runtime", when: "In production, continuously", span: [38, 100] },
  { key: "C", name: "Outcome", when: "After the fact, long loop", span: [62, 100] },
];

const MARKERS = ["Commit", "Merge", "Release", "Weeks later"];

/**
 * Compact figure showing when each evaluation arm fires along a release
 * timeline. Decorative: the accompanying table carries the same information
 * as accessible text.
 */
export const ThreeArmsDiagram = ({ label = "When each arm fires" }: { label?: string }) => (
  <figure aria-hidden="true" className="rounded-sm border border-outline-variant/30 bg-surface-container-lowest p-5 md:p-6 not-italic">
    <figcaption className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-5">
      {label}
    </figcaption>
    <div className="space-y-3">
      {ARMS.map((arm) => (
        <div key={arm.key} className="grid grid-cols-[3.5rem_1fr] items-center gap-3">
          <div className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
            {arm.key}
          </div>
          <div className="relative h-9 rounded-sm bg-surface-container-low border border-outline-variant/25">
            <div
              style={{ left: `${arm.span[0]}%`, width: `${arm.span[1] - arm.span[0]}%` }}
              className="absolute inset-y-0 rounded-sm bg-surface-container-high border border-secondary/40 flex items-center px-3"
            >
              <span className="font-headline italic text-sm text-primary truncate">{arm.name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4 grid grid-cols-[3.5rem_1fr] gap-3">
      <div />
      <div className="flex justify-between font-label uppercase tracking-[0.14em] text-[9px] text-on-surface-variant">
        {MARKERS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  </figure>
);

export default ThreeArmsDiagram;
