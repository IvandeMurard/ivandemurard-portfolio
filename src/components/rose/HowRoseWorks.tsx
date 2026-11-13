import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { HOW_ROSE_WORKS as H } from "@/content/howRoseWorks";
import "./howRoseWorks.css";

/**
 * Chapter 06, "How Rose works": the loop (canvas board F, variant B). A 1000 x 820 figure, or under 1000px of room
 * a list in reading order. Everything readable is HTML; the one SVG is decoration (aria-hidden, no text in it).
 * DOM order is the reading order: the two rules, the centre, steps 01 to 05.
 * Geometry (board): centre (500, 410); dashed circle r 290, ring r 240, centre disc r 128, step discs r 24 at
 * -90, -18, 54, 126 and 198 degrees; chevrons at -54, 18, 90, 162 and 222 degrees.
 */

/** How far the figure may extend past the text column to the right, keeping this much clear of the window edge. */
const EDGE_GUTTER = 24;

/** Pixels between the right edge of `el`'s parent (the text column) and the right edge of the window, less the gutter. */
const useRoomOnTheRight = () => {
  const ref = useRef<HTMLElement>(null);
  const [room, setRoom] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const measure = () => {
      const free = document.documentElement.clientWidth - parent.getBoundingClientRect().right - EDGE_GUTTER;
      setRoom(Math.max(0, Math.floor(free)));
    };
    measure();
    window.addEventListener("resize", measure);
    if (typeof ResizeObserver === "undefined") return () => window.removeEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    return () => { window.removeEventListener("resize", measure); ro.disconnect(); };
  }, []);
  return { ref, room };
};

/** Where each step sits in the figure: its label's top-left (or top-centre) and its disc's centre. */
const STEP_AT = [
  { side: "c", x: 500, y: 8, cx: 500, cy: 170 },
  { side: "r", x: 760, y: 290, cx: 728, cy: 336 },
  { side: "r", x: 680, y: 586, cx: 641, cy: 604 },
  { side: "l", x: 90, y: 586, cx: 359, cy: 604 },
  { side: "l", x: 4, y: 272, cx: 272, cy: 336 },
] as const;
const CARD_AT = [{ x: 80, y: 104 }, { x: 648, y: 104 }] as const;
const CHEVRONS = [
  "641.1,207.2 646.7,220.0 632.9,218.6",
  "736.5,481.6 726.1,490.8 723.1,477.2",
  "505.0,657.0 493.0,650.0 505.0,643.0",
  "266.6,491.1 269.6,477.5 279.9,486.8",
  "313.1,248.4 326.3,244.2 323.5,257.8",
];

const INK = "text-primary [[data-mood=dusk]_&]:text-on-surface";
const at = (x: number, y: number) => ({ "--x": `${x}px`, "--y": `${y}px` }) as CSSProperties;

const RuleIcon = ({ kind }: { kind: "check" | "lock" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="hrw-copper shrink-0">
    {kind === "check"
      ? <><circle cx="12" cy="12" r="9.5" /><path d="M7.5 12.5l3 3 6-6.5" /></>
      : <><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>}
  </svg>
);

/** The drawing: circles, ring, chevrons, the compass and the five discs. No text: the numbers are HTML on top. */
const Drawing = () => (
  <svg className="hrw-bg" viewBox="0 0 1000 820" aria-hidden="true" focusable="false">
    <circle cx="500" cy="410" r="290" fill="none" className="hrw-ink" strokeWidth="1.25" strokeDasharray="4 6" />
    <circle cx="500" cy="410" r="240" fill="none" className="hrw-band" strokeWidth="34" />
    <circle cx="500" cy="410" r="240" fill="none" className="hrw-copper" strokeWidth="1.25" />
    {CHEVRONS.map((p) => <polyline key={p} points={p} fill="none" className="hrw-copper" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />)}
    <circle cx="500" cy="410" r="128" className="hrw-fill-low hrw-ink" strokeWidth="1.25" />
    <g transform="translate(482 318)" fill="none" className="hrw-copper" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="15" /><circle cx="18" cy="18" r="5" strokeWidth="0.9" />
      <path d="M18 3l3.6 11.4 11.4 3.6-11.4 3.6-3.6 11.4-3.6-11.4-11.4-3.6 11.4-3.6z" />
    </g>
    {STEP_AT.map((s, i) => (
      <g key={i}>
        <circle cx={s.cx} cy={s.cy} r="24" className="hrw-fill-lowest hrw-ink" strokeWidth="1.5" />
        {i === 4 && <circle cx={s.cx} cy={s.cy} r="24" className="hrw-fill-highlight" stroke="none" />}
      </g>
    ))}
  </svg>
);

export const HowRoseWorks = () => {
  const { ref, room } = useRoomOnTheRight();
  return (
    <figure ref={ref} aria-label={H.label} className="hrw mt-14" style={{ marginRight: -room }}>
      <div className="hrw-fig">
        <Drawing />
        {H.rules.map((r, i) => (
          <div key={r.title} className="hrw-card" style={at(CARD_AT[i].x, CARD_AT[i].y)}>
            <p className={`m-0 flex items-center gap-2 font-body text-base font-semibold leading-[1.25] ${INK}`}><RuleIcon kind={r.icon} />{r.title}</p>
            <p className="m-0 ml-[26px] mt-1 font-body text-[14.5px] leading-[1.45] text-on-surface-variant">{r.text}</p>
          </div>
        ))}
        <div className="hrw-centre">
          <p className={`m-0 font-headline text-2xl leading-[1.2] ${INK}`}><span className="hrw-pre">{H.centre.pre}</span>{H.centre.title}</p>
          <p className="m-0 mt-1.5 font-body text-[15px] leading-normal text-on-surface-variant">{H.centre.text}</p>
        </div>
        <ol className="hrw-steps" role="list">
          {H.steps.map((s, i) => (
            <li key={s.n} className="hrw-step" data-side={STEP_AT[i].side} data-highlight={i === 4 ? "" : undefined} style={at(STEP_AT[i].x, STEP_AT[i].y)}>
              <span className="hrw-num font-mono text-[13px] font-medium" aria-hidden="true">{s.n}</span>
              <div>
                <p className={`m-0 font-headline text-[23px] leading-[1.2] ${INK}`}>{s.title}</p>
                <p className="m-0 mt-[5px] font-body text-[15.5px] leading-normal text-on-surface-variant">{s.text}</p>
                {"tags" in s && (
                  <p className="hrw-tags m-0 mt-2">
                    {s.tags.map((t) => <span key={t} className="rounded-full border border-dashed border-primary px-[9px] py-0.5 font-mono text-[12.5px] text-on-surface-variant [[data-mood=dusk]_&]:border-on-surface">{t}</span>)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
        <div className="hrw-nodes" aria-hidden="true">
          {STEP_AT.map((s, i) => (
            <span key={i} className="hrw-node font-mono text-sm" style={{ left: s.cx - 24, top: s.cy - 24 }}>{H.steps[i].n}</span>
          ))}
        </div>
      </div>
      <figcaption className="mt-3 font-label text-xs text-on-surface-variant">{H.caption}</figcaption>
    </figure>
  );
};
