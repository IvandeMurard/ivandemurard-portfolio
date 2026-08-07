type Step = { value: string; label: string; note?: string; accent?: boolean };

/**
 * Numbered progression of harness runs. Carries the figures that used to sit
 * in nine consecutive paragraphs. Text content, not decorative.
 */
export const CanaryTimeline = ({ steps, label }: { steps: Step[]; label?: string }) => (
  <figure className="rounded-sm border border-outline-variant bg-surface-container-lowest p-5 md:p-6 not-italic m-0">
    {label && (
      <figcaption className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-5">
        {label}
      </figcaption>
    )}
    <ol className="list-none p-0 m-0 space-y-0">
      {steps.map((step, i) => (
        <li key={i} className="grid grid-cols-[auto_1fr] gap-4">
          <div className="flex flex-col items-center">
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-full mt-2 ${
                step.accent ? "bg-secondary" : "bg-outline-variant"
              }`}
            />
            {i < steps.length - 1 && <span aria-hidden="true" className="w-px flex-1 bg-outline-variant" />}
          </div>
          <div className={i < steps.length - 1 ? "pb-6" : ""}>
            <div className="font-headline italic text-xl text-primary">{step.value}</div>
            <div className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary mt-1">
              {step.label}
            </div>
            {step.note && (
              <p className="font-body font-light text-sm text-on-surface-variant mt-2">{step.note}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  </figure>
);

export default CanaryTimeline;
