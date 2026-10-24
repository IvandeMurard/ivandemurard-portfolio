import { useState } from "react";
import type { PyramidLayer } from "@/content/journal";
import { Icon } from "@/components/ui/Icon";

/**
 * Interactive reliability pyramid. Hover or focus previews a layer, click or
 * Enter pins it and reveals what it measures, which product has it, and the
 * signal it emits. The ordered list stays the accessible text equivalent.
 */
export const PyramidDiagram = ({
  layers,
  renderNote,
}: {
  layers: PyramidLayer[];
  renderNote?: (text: string) => React.ReactNode;
}) => {
  const [active, setActive] = useState<number | null>(null);
  const total = layers.length;
  const detailed = layers.some((l) => l.detail);
  const current = active !== null ? layers[active] : null;

  return (
    <div className="not-italic">
      <ol
        aria-label="Layered model, from top layer to foundation"
        className="flex flex-col items-center gap-2 list-none p-0 m-0"
      >
        {layers.map((layer, i) => {
          const width = 55 + ((i + 1) / total) * 45;
          const isActive = active === i;
          const interactive = detailed && !!layer.detail;
          // A <button> layer must not contain interactive content (glossary
          // Term buttons): nested buttons break the HTML parser and eject
          // pre-rendered markup outside #root. Plain text inside buttons.
          const note = layer.note && renderNote && !interactive ? renderNote(layer.note) : layer.note;
          const body = (
            <>
              <div className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary">
                {layer.level}
                {layer.base && <span className="sr-only"> (foundation)</span>}
              </div>
              <div
                className={`font-headline italic text-lg ${
                  layer.base || isActive ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {layer.name}
              </div>
              {layer.note && (
                <div className="font-body font-normal text-xs text-on-surface-variant mt-1">
                  {note}
                </div>
              )}
            </>
          );

          const shell = `w-full md:w-[var(--pw)] rounded-sm px-4 py-3 text-center transition-[width,border-color,background-color] duration-500 ease-hospitable ${
            isActive
              ? "bg-surface-container-high border border-secondary"
              : layer.base
                ? "bg-surface-container-high border border-secondary"
                : "bg-surface-container-low border border-outline-variant"
          }`;

          return (
            <li key={i} style={{ ["--pw" as string]: `${width}%` }} className="w-full flex justify-center">
              {interactive ? (
                <button
                  type="button"
                  aria-controls="pyramid-detail"
                  aria-expanded={isActive}
                  onClick={() => setActive(isActive ? null : i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`${shell} hover:border-secondary`}
                >
                  {body}
                </button>
              ) : (
                <div className={shell}>{body}</div>
              )}
            </li>
          );
        })}
      </ol>
      {detailed && (
        <div
          id="pyramid-detail"
          aria-live="polite"
          className="mt-4 rounded-sm border border-outline-variant bg-surface-container-lowest p-5 min-h-[6.5rem]"
        >
          {current?.detail ? (
            <>
              <div className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary mb-2">
                {current.level} · {current.name}
              </div>
              <p className="font-body font-normal text-sm text-on-surface-variant">{current.detail}</p>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {current.product && (
                  <div>
                    <dt className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
                      Where it runs
                    </dt>
                    <dd className="font-body font-normal text-sm text-on-surface-variant">
                      {current.product}
                    </dd>
                  </div>
                )}
                {current.signal && (
                  <div>
                    <dt className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
                      Signal emitted
                    </dt>
                    <dd className="font-body font-normal text-sm text-on-surface-variant">
                      {current.signal}
                    </dd>
                  </div>
                )}
              </dl>
            </>
          ) : (
            <p className="flex items-center gap-2 font-body font-normal text-sm text-on-surface-variant">
              <Icon name="touch_app" className="text-secondary text-[18px] leading-none" />
              Select a layer to see what it measures and what it emits.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PyramidDiagram;
