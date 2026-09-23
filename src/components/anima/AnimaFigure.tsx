import type { ReactNode } from "react";

/** Shared plate furniture for the Anima figures: engraved frame, plate number, caption. */
export const AnimaFigure = ({
  label,
  note,
  caption,
  children,
}: {
  label: string;
  note?: string;
  caption?: string;
  children: ReactNode;
}) => (
  <figure className="mb-8 max-w-3xl">
    <div className="rounded-sm border border-outline-variant bg-surface-container-lowest">
      <div className="flex items-baseline justify-between gap-4 border-b border-outline-variant px-4 py-3">
        <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">
          {label}
        </span>
        {note && (
          <span className="font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
            {note}
          </span>
        )}
      </div>
      <div className="p-4 md:p-6">{children}</div>
    </div>
    {caption && (
      <figcaption className="mt-3 font-body text-sm text-on-surface-variant leading-relaxed">
        {caption}
      </figcaption>
    )}
  </figure>
);

/** Tag for anything in a figure that is not built. */
export const DesignTag = ({ children = "Design" }: { children?: ReactNode }) => (
  <span className="inline-flex items-center rounded-sm border border-dashed border-outline px-1.5 py-0.5 font-label uppercase tracking-[0.16em] text-[9px] text-secondary align-middle">
    {children}
  </span>
);

export default AnimaFigure;
