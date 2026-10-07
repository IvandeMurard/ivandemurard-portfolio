import { AnimaFigure as CaseFigure } from "@/components/anima/AnimaFigure";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { COMPASS_CONFIDENCE, COMPASS_TIMELINE, type CompassConfidence as Confidence } from "@/content/compass";

const badgeTone: Record<Confidence, string> = {
  Established: "border-secondary bg-secondary/10 text-primary",
  Corroborated: "border-outline bg-primary/5 text-primary",
  Probable: "border-outline-variant bg-surface-container-low text-on-surface-variant",
  Undetermined: "border-dashed border-outline text-secondary",
};

const ConfidenceBadge = ({ confidence }: { confidence: Confidence }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span tabIndex={0} className={`inline-flex cursor-help rounded-sm border px-2 py-1 font-label text-[9px] uppercase tracking-[0.16em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${badgeTone[confidence]}`}>
        {confidence}
      </span>
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-xs font-body leading-relaxed">
      {COMPASS_CONFIDENCE[confidence]}
    </TooltipContent>
  </Tooltip>
);

export const CompassTimeline = ({ caption }: { caption: string }) => (
  <CaseFigure label="Fig. 1.1" caption={caption}>
    <ol className="relative list-none p-0 m-0 before:absolute before:bottom-3 before:left-[5.2rem] before:top-3 before:w-px before:bg-outline-variant md:before:left-[7.2rem]">
      {COMPASS_TIMELINE.map((item) => (
        <li key={`${item.date}-${item.event}`} className={`relative grid grid-cols-[4.25rem_minmax(0,1fr)] gap-5 py-3 md:grid-cols-[6rem_minmax(0,1fr)] md:gap-7 ${item.withheld ? "opacity-75" : ""}`}>
          <time className="pt-1 text-right font-label text-[10px] uppercase tracking-[0.12em] text-secondary">{item.date}</time>
          <span aria-hidden="true" className={`absolute left-[4.9rem] top-[1.15rem] h-2.5 w-2.5 rounded-full border bg-surface-container-lowest md:left-[6.9rem] ${item.withheld ? "border-dashed border-outline" : "border-secondary"}`} />
          <div className={`min-w-0 rounded-sm border px-3 py-3 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-4 ${item.withheld ? "border-dashed border-outline-variant bg-surface-container-low" : "border-outline-variant"}`}>
            <div className="min-w-0">
              <p className="font-body text-sm leading-relaxed text-primary">{item.event}</p>
              {item.amount && <p className="mt-1 font-headline text-lg italic text-primary">{item.amount}</p>}
            </div>
            <div className="mt-3 md:mt-0"><ConfidenceBadge confidence={item.confidence} /></div>
          </div>
        </li>
      ))}
    </ol>
  </CaseFigure>
);

export const CompassReaders = ({ caption }: { caption: string }) => (
  <CaseFigure label="Fig. 4.1" caption={caption}>
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-4 font-body text-sm text-on-surface-variant leading-relaxed">
      <p className="border-l border-secondary pl-4">Public sources (APUR BDCom, BODACC, INSEE Sirene)</p>
      <span aria-hidden="true" className="text-secondary text-center"><span className="md:hidden">↓</span><span className="hidden md:inline">→</span></span>
      <p className="border-y border-outline-variant py-5 text-center font-headline italic text-xl text-primary">One scoring core</p>
      <span aria-hidden="true" className="text-secondary text-center"><span className="md:hidden">↓</span><span className="hidden md:inline">→</span></span>
      <ul className="list-none p-0 m-0 space-y-5 border-l border-secondary pl-4">
        <li>Map, for a person</li><li>MCP server, for an agent</li>
      </ul>
    </div>
  </CaseFigure>
);

export const CompassConfidence = ({ caption }: { caption: string }) => (
  <CaseFigure label="Fig. 5.1" caption={caption}>
    <div className="grid grid-cols-[51fr_6fr_37fr_6fr] h-10 border border-outline-variant" role="img" aria-label="Established 51%, Corroborated 6%, Probable 37%, Undetermined 6%">
      <span className="bg-secondary/30 border-r border-outline" />
      <span className="bg-primary/20 border-r border-outline" />
      <span className="bg-surface-container-high border-r border-outline" />
      <span className="bg-surface-container-lowest" />
    </div>
    <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
      {[["Established", "51%"], ["Corroborated", "6%"], ["Probable", "37%"], ["Undetermined", "6%"]].map(([label, value], i) => (
        <div key={label} className="min-w-0 border-l border-outline-variant pl-3">
          <dt className="font-body text-sm text-on-surface-variant break-words"><span className="text-secondary mr-2 font-label text-[10px]">{String(i + 1).padStart(2, "0")}</span>{label}</dt>
          <dd className="font-headline italic text-xl text-primary mt-1">{value}</dd>
        </div>
      ))}
    </dl>
  </CaseFigure>
);