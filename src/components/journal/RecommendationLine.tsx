import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { SignalLamp } from "./SignalLamp";
import { RECO_LINES, lampOf, recoLineMarkdown, viewOf, type Layer, type LineId } from "@/content/recoLine";

/** FIG: recommendation line. Station strip, board readout, line/layer switches, autoplay. Keys only while focused. */
export const RecommendationLine = ({ id = "fig-reco-line", initialLayer = "checks" as Layer, figLabel = "Fig 1" }) => {
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [line, setLine] = useState<LineId>("aetherix");
  const [layer, setLayer] = useState<Layer>(initialLayer);
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(!reduce);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const L = RECO_LINES[line];
  const n = L.stations.length;
  const p = L.stations[i];
  const v = viewOf(p, layer);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el); return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !visible) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 2600);
    return () => clearInterval(t);
  }, [auto, visible, n]);

  const go = (k: number) => { setAuto(false); setI(((k % n) + n) % n); };
  const switchLine = (k: LineId) => { setAuto(false); if (k !== line) { setLine(k); setI(0); } };
  const onKey = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === "p" || k === "P" || k === " ") setAuto((a) => !a);
    else if (k === "ArrowRight") go(i + 1);
    else if (k === "ArrowLeft") go(i - 1);
    else if (/^[1-5]$/.test(k) && +k <= n) go(+k - 1);
    else if (k === "l" || k === "L") switchLine(line === "aetherix" ? "lore" : "aetherix");
    else if (k === "t" || k === "T") { setAuto(false); setLayer(layer === "checks" ? "truth" : "checks"); }
    else return;
    e.preventDefault();
  };
  const btn = (on: boolean) => cn("rounded-sm border px-2.5 py-1 font-label text-[11px] uppercase tracking-[0.14em] transition-colors",
    on ? "border-on-surface text-on-surface" : "border-outline-variant text-on-surface-variant hover:text-on-surface");

  return (
    <figure ref={ref} id={id} className="my-8 rounded-sm border border-outline-variant bg-surface-container-lowest">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-outline-variant px-4 py-3 font-label text-[10px] uppercase tracking-[0.2em]">
        <span className="text-secondary">{figLabel}</span><span className="text-on-surface-variant">Recommendation line</span>
      </div>
      <div tabIndex={0} onKeyDown={onKey} aria-label={`Recommendation line. ${L.label}, ${layer === "checks" ? "what checks it" : "what truth comes back"}. Keys: 1 to 5 or arrows for stations, L line, T layer, P play or pause.`}
        className="grid gap-5 p-4 md:p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div role="list" aria-label="All stations at a glance" className="relative grid gap-1.5" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}>
          <span aria-hidden className="absolute left-[4%] right-[4%] top-[18px] border-t-2 border-outline-variant" />
          {L.stations.map((q, k) => (
            <button key={q.name} type="button" role="listitem" onClick={() => go(k)}
              aria-label={`${q.name}${q.ghost ? ", never reached" : ""}: ${viewOf(q, layer)[0]}`}
              className={cn("relative grid min-w-0 justify-items-center gap-1 text-center", k === i && "[&_.nm]:underline")}>
              <span className={cn("rounded-[5px] bg-surface-container-lowest p-0.5", q.ghost && "border border-dashed border-outline-variant", k === i && !q.ghost && "ring-1 ring-on-surface")}>
                <SignalLamp state={lampOf(q, layer)} hideWord />
              </span>
              <span className="nm font-body text-[11px] leading-tight text-on-surface [overflow-wrap:anywhere] underline-offset-2">{q.name}</span>
              <span className="hidden font-label text-[10px] uppercase tracking-[0.06em] text-on-surface-variant sm:block">{viewOf(q, layer)[0]}</span>
            </button>
          ))}
        </div>
        <div aria-live="polite" className="rounded-sm border border-outline-variant bg-surface-container px-4 py-3 font-mono">
          <p className="text-[10px] uppercase tracking-[0.14em] text-on-surface-variant">{L.label} line · {layer === "checks" ? "What checks it" : "What truth comes back"}</p>
          <p className="mt-1 font-headline text-xl text-on-surface">{p.name}{p.ghost ? " (never reached)" : ""}</p>
          <p className="mt-1 text-sm text-on-surface"><SignalLamp state={lampOf(p, layer)} label={v[0]} /></p>
          <p className="mt-1 text-sm text-on-surface">{v[1]}</p>
          {v[2] !== "-" && <p className="text-xs text-on-surface-variant">{v[2]}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={btn(line === "aetherix")} onClick={() => switchLine("aetherix")}>Aetherix</button>
          <button type="button" className={btn(line === "lore")} onClick={() => switchLine("lore")}>Lore</button>
          <span className="mx-1 h-4 w-px bg-outline-variant" />
          <button type="button" className={btn(layer === "checks")} onClick={() => { setAuto(false); setLayer("checks"); }}>Checks</button>
          <button type="button" className={btn(layer === "truth")} onClick={() => { setAuto(false); setLayer("truth"); }}>Truth</button>
          <span className="mx-1 h-4 w-px bg-outline-variant" />
          <button type="button" className={btn(auto)} onClick={() => setAuto((a) => !a)}>{auto ? "Pause" : "Play"}</button>
        </div>
      </div>
      <figcaption className="border-t border-outline-variant px-4 py-3 font-body text-sm leading-relaxed text-on-surface-variant">
        Lamps: green top GO (covered), amber middle WARN (partial), red bottom STOP (failing), none lit DARK (no information, treated as stop). In the Truth layer: green, a truth you can rely on comes back; amber, a declared truth (a preference); none lit, nothing comes back.
        <details className="mt-3">
          <summary className="cursor-pointer text-on-surface">What an agent and Rose read</summary>
          <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-relaxed text-on-surface">{recoLineMarkdown(layer)}</pre>
        </details>
        <p className="mt-2">Ask Rose: “{L.rose[layer]}”</p>
      </figcaption>
    </figure>
  );
};

export default RecommendationLine;
