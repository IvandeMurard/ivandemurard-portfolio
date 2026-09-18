import { Icon } from "@/components/ui/Icon";

export type MatrixState = "covered" | "partial" | "absent";

export type MatrixCell = {
  state: MatrixState;
  /** Two or three words naming the concrete instance, or the gap. */
  instance: string;
  /** One clause naming what the gap costs. Omitted when the cell is covered. */
  cost?: string;
};

export type MatrixRow = {
  arm: string;
  when: string;
  cells: MatrixCell[];
};

const STATE: Record<MatrixState, { label: string; dot: string; icon: string }> = {
  covered: { label: "Covered", dot: "bg-secondary", icon: "check_circle" },
  partial: { label: "Partial", dot: "bg-secondary/40", icon: "adjust" },
  absent: { label: "Absent", dot: "bg-transparent border border-outline", icon: "radio_button_unchecked" },
};

const Cell = ({ cell }: { cell: MatrixCell }) => (
  <div>
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className={`h-2 w-2 rounded-full shrink-0 ${STATE[cell.state].dot}`} />
      <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
        {STATE[cell.state].label}
      </span>
    </div>
    <p className="font-body text-sm text-on-surface mt-1.5">{cell.instance}</p>
    {cell.cost && (
      <p className="font-body font-normal text-sm text-on-surface-variant mt-1">{cell.cost}</p>
    )}
  </div>
);

/**
 * Arms down the side, products across. Each cell states coverage in words as
 * well as a dot, and every gap names its consequence, so a reader can project
 * the same reading onto their own system. Replaces four scattered claims.
 */
export const CoverageMatrix = ({
  label,
  columns,
  rows,
}: {
  label?: string;
  columns: string[];
  rows: MatrixRow[];
}) => (
  <figure className="rounded-sm border border-outline-variant bg-surface-container-lowest p-5 md:p-6 not-italic m-0">
    {label && (
      <figcaption className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-5 flex items-center gap-2">
        <Icon name="grid_view" className="text-[16px] leading-none" aria-hidden="true" />
        {label}
      </figcaption>
    )}

    {/* Desktop: a real grid. Mobile: stacked cards per arm. */}
    <div className="hidden md:grid gap-x-6 gap-y-5" style={{ gridTemplateColumns: `10rem repeat(${columns.length}, minmax(0,1fr))` }}>
      <div />
      {columns.map((c) => (
        <div key={c} className="font-label uppercase tracking-[0.2em] text-[10px] text-primary pb-2 border-b border-outline-variant">
          {c}
        </div>
      ))}
      {rows.map((row) => (
        <div key={row.arm} className="contents">
          <div className="pt-1">
            <div className="font-headline italic text-lg text-primary leading-tight">{row.arm}</div>
            <div className="font-body font-normal text-xs text-on-surface-variant mt-1">{row.when}</div>
          </div>
          {row.cells.map((cell, i) => (
            <div key={i} className="pt-1">
              <Cell cell={cell} />
            </div>
          ))}
        </div>
      ))}
    </div>

    <div className="md:hidden flex flex-col gap-6">
      {rows.map((row) => (
        <div key={row.arm}>
          <div className="font-headline italic text-lg text-primary leading-tight">{row.arm}</div>
          <div className="font-body font-normal text-xs text-on-surface-variant mt-1 mb-3">{row.when}</div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {row.cells.map((cell, i) => (
              <div key={i} className="rounded-sm border border-outline-variant bg-surface-container-low p-4">
                <div className="font-label uppercase tracking-[0.2em] text-[10px] text-primary mb-2">
                  {columns[i]}
                </div>
                <Cell cell={cell} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </figure>
);

export default CoverageMatrix;
