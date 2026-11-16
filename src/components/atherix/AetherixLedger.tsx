import { LEDGER } from "@/content/aetherixInside";
import { cn } from "@/lib/utils";

const head = "font-label text-[11px] uppercase tracking-[0.08em] text-on-surface-variant";
/** From md up a row is one line of five columns; below md it is a small card, "label: value" per line. */
const rowCls = "block border-b border-outline-variant py-3 md:grid md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] md:gap-3";

/**
 * The Decision Ledger as a real table. Table roles are written out, because a table whose rows are laid out as
 * cards loses its semantics in some browsers. The small labels shown on a card are aria-hidden: a screen reader
 * already gets the column header for each cell.
 */
export const AetherixLedger = () => {
  const [agent, ...values] = LEDGER.built;
  return (
    <div className="aetherix-dark mt-7 rounded-[20px] px-5 py-7 md:px-9 md:py-8">
      <div aria-hidden="true" className="aetherix-dark-glow" />
      <div className="relative">
        <p className="font-label text-[11px] uppercase tracking-[0.12em] text-on-surface-variant">{LEDGER.tableLabel}</p>
        <table role="table" aria-label={LEDGER.tableAria} className="mt-4 block w-full text-left font-body text-sm">
          <thead role="rowgroup" className="sr-only md:not-sr-only md:block">
            <tr role="row" className={cn(rowCls, "py-2")}>
              {LEDGER.columns.map((c) => <th key={c} role="columnheader" scope="col" className={cn(head, "block font-normal md:block")}>{c}</th>)}
            </tr>
          </thead>
          <tbody role="rowgroup" className="block">
            <tr role="row" className={rowCls}>
              <td role="cell" className="block font-semibold md:font-normal">{agent}</td>
              {values.map((v, i) => (
                <td key={LEDGER.columns[i + 1]} role="cell" className="flex justify-between gap-4 pt-1 md:block md:pt-0">
                  <span aria-hidden="true" className={cn(head, "md:hidden")}>{LEDGER.columns[i + 1]}</span>
                  {i === values.length - 1 ? <span className="whitespace-nowrap rounded-full border-[1.5px] border-secondary px-2">{v}</span> : v}
                </td>
              ))}
            </tr>
            {LEDGER.design.map(([who, what]) => (
              <tr key={who} role="row" className={cn(rowCls, "border-dashed text-on-surface-variant last:border-b-0")}>
                <td role="cell" className="block md:block">{who}</td>
                <td role="cell" colSpan={4} className="block pt-1 md:col-span-4 md:pt-0">{what}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3.5 font-label text-xs text-on-surface-variant">{LEDGER.caption}</p>
      </div>
    </div>
  );
};
