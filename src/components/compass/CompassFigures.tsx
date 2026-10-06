import { AnimaFigure as CaseFigure } from "@/components/anima/AnimaFigure";

export const CompassTimeline = ({ caption }: { caption: string }) => (
  <CaseFigure label="Fig. 1.1" caption={caption}>
    <ol className="grid grid-cols-3 list-none p-0 m-0">
      {[["2017", "Florist"], ["2020", "Florist"], ["2023", "No longer a shop"]].map(([year, label]) => (
        <li key={year} className="min-w-0">
          <p className="font-headline italic text-xl md:text-2xl text-primary mb-4">{year}</p>
          <div className="relative h-px bg-outline-variant mb-5" aria-hidden="true">
            <span className="absolute left-0 -top-1 h-2.5 w-2.5 rounded-full border border-secondary bg-surface-container-lowest" />
          </div>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed pr-3">{label}</p>
        </li>
      ))}
    </ol>
  </CaseFigure>
);

export const CompassReaders = ({ caption }: { caption: string }) => (
  <CaseFigure label="Fig. 7.1" caption={caption}>
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
  <CaseFigure label="Fig. 8.1" caption={caption}>
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
    <div aria-hidden="true" className="grid grid-cols-[51fr_6fr_37fr_6fr] text-center font-label text-[10px] text-primary -mt-[8.5rem] md:-mt-[5.5rem] mb-[7rem] md:mb-[4rem] pointer-events-none">
      <span>01</span><span>02</span><span>03</span><span>04</span>
    </div>
  </CaseFigure>
);