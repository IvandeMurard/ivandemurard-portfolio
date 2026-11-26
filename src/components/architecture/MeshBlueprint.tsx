import { useLayoutEffect, useRef, useState } from "react";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { MESH_NODES, type MeshNode } from "@/content/meshNodes";

/**
 * FIG. 3.1 — The architecture, as wired.
 * Hairline engraving: the four domain agents orbit the supervisory orchestrator,
 * which routes and holds no state of its own.
 * Facts come from MESH_NODES so the figure and the page cannot diverge.
 */

const DESKTOP = { w: 900, h: 440, cx: 450, cy: 220, rx: 320, ry: 150, core: 74 };
const MOBILE = { w: 360, h: 560, cx: 180, cy: 290, rx: 112, ry: 222, core: 70 };

const ORCHESTRATOR = "Orchestrator";
const SPECIALISTS = MESH_NODES.filter((n) => n.node !== ORCHESTRATOR);
const CORE_NODE = MESH_NODES.find((n) => n.node === ORCHESTRATOR) as MeshNode;

const ANGLES = [-90, 0, 90, 180];

const point = (g: typeof DESKTOP, index: number): { x: number; y: number } => {
  const a = (ANGLES[index] * Math.PI) / 180;
  return { x: g.cx + g.rx * Math.cos(a), y: g.cy + g.ry * Math.sin(a) };
};

// Stop the spoke at the core rim rather than under it.
const rimPoint = (g: typeof DESKTOP, x: number, y: number) => {
  const dx = x - g.cx;
  const dy = y - g.cy;
  const len = Math.hypot(dx, dy) || 1;
  return { x: g.cx + (dx / len) * g.core, y: g.cy + (dy / len) * g.core };
};

const STATE_LABEL: Record<MeshNode["state"], string> = {
  built: "Built",
  poc: "Synthetic PoC",
  design: "Design",
};

/** A point on the orbit ellipse, scaled inward by k. */
const orbit = (g: typeof DESKTOP, deg: number, k = 1) => {
  const a = (deg * Math.PI) / 180;
  return { x: g.cx + g.rx * k * Math.cos(a), y: g.cy + g.ry * k * Math.sin(a) };
};

/** Engraved graduation marks around the contract ring. */
const Graduations = ({ g }: { g: typeof DESKTOP }) => (
  <g aria-hidden="true" className="stroke-outline-variant">
    {Array.from({ length: 60 }, (_, i) => i * 6).map((deg) => {
      const long = deg % 30 === 0;
      const a = orbit(g, deg, 1);
      const b = orbit(g, deg, long ? 0.945 : 0.968);
      return (
        <line
          key={deg}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          strokeWidth={long ? 0.9 : 0.5}
          opacity={long ? 0.85 : 0.5}
        />
      );
    })}
  </g>
);

/** Corner register marks, as on a printer's plate. */
const CornerMarks = ({ g }: { g: typeof DESKTOP }) => {
  const m = 10;
  const l = 12;
  const corners = [
    [m, m, 1, 1],
    [g.w - m, m, -1, 1],
    [m, g.h - m, 1, -1],
    [g.w - m, g.h - m, -1, -1],
  ] as const;
  return (
    <g aria-hidden="true" className="stroke-outline-variant" strokeWidth={0.8} opacity={0.7}>
      {corners.map(([x, y, sx, sy], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={x + sx * l} y2={y} />
          <line x1={x} y1={y} x2={x} y2={y + sy * l} />
        </g>
      ))}
    </g>
  );
};

/** Below this width of the figure's frame the orbit stacks into the tall layout. */
const STACK_BELOW = 760;
/** The stacked layout stops growing here, so its labels do not balloon on a tablet. */
const STACK_MAX_W = 440;
/** No label of the figure renders below this many screen pixels (site floor, scripts/check-text-size.ts). */
const MIN_LABEL_PX = 13;

/** The content width of an element (padding left out), kept up to date. 0 until it is measured. */
const useContentWidth = (ref: React.RefObject<HTMLElement>) => {
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const cs = getComputedStyle(el);
      setW(el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
};

export const MeshBlueprint = () => {
  const frame = useRef<HTMLDivElement>(null);
  const frameW = useContentWidth(frame);
  const isMobile = frameW > 0 && frameW < STACK_BELOW;
  const g = isMobile ? MOBILE : DESKTOP;
  // How many screen pixels one unit of the figure is. A label is sized in figure units, so it is given
  // at least MIN_LABEL_PX / scale of them: the text stays readable however far the figure is scaled down.
  const figureW = frameW > 0 ? (isMobile ? Math.min(frameW, STACK_MAX_W) : frameW) : g.w;
  const scale = figureW / g.w;
  const label = (designUnits: number) => Math.max(designUnits, MIN_LABEL_PX / scale);
  const nameSize = label(isMobile ? 13 : 15);
  const smallSize = label(11);
  const lineGap = smallSize * 0.8 + nameSize * 0.3 + 3; // from a name's baseline to the baseline of its state line
  // The core's three lines, centred on the core.
  const coreY1 = g.cy - (nameSize * 0.9 + smallSize * 2.6) / 2 + nameSize * 0.75;
  const coreY2 = coreY1 + nameSize * 0.3 + smallSize * 0.8 + 4;
  const coreY3 = coreY2 + smallSize * 1.25;
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const selected = MESH_NODES.find((n) => n.node === active) ?? null;
  const lit = hovered ?? active;
  const coreLit = lit === ORCHESTRATOR;
  const coreActive = active === ORCHESTRATOR;

  const toggle = (name: string) => setActive((cur) => (cur === name ? null : name));

  return (
    <figure className="mb-8 rounded-sm border border-outline-variant bg-surface-container-lowest">
      <figcaption className="flex items-center justify-between gap-4 border-b border-outline-variant px-4 py-3">
        <span className="font-label uppercase tracking-[0.18em] text-kicker text-secondary">
          Fig. 3.1 · The architecture, as wired
        </span>
        <span className="font-label uppercase tracking-[0.16em] text-kicker text-on-surface-variant">
          Solid: built · Dashed: synthetic PoC or designed
        </span>
      </figcaption>

      <div ref={frame} className="px-3 py-4 md:px-6 md:py-6">
        <svg
          viewBox={`0 0 ${g.w} ${g.h}`}
          className="w-full h-auto mesh-blueprint mx-auto"
          style={isMobile ? { maxWidth: STACK_MAX_W } : undefined}
          role="group"
          aria-label="Four domain agents wired to a central supervisory orchestrator that holds no memory"
        >
          {/* Plate: register marks, the contract ring and its graduations */}
          <CornerMarks g={g} />
          <g aria-hidden="true">
            <ellipse
              cx={g.cx}
              cy={g.cy}
              rx={g.rx}
              ry={g.ry}
              className="fill-none stroke-outline-variant"
              strokeWidth={0.9}
              strokeDasharray="1 6"
            />
            <ellipse
              cx={g.cx}
              cy={g.cy}
              rx={g.rx * 0.66}
              ry={g.ry * 0.66}
              className="fill-none stroke-outline-variant"
              strokeWidth={0.5}
              opacity={0.55}
            />
            <line
              x1={g.cx - g.rx}
              y1={g.cy}
              x2={g.cx + g.rx}
              y2={g.cy}
              className="stroke-outline-variant"
              strokeWidth={0.4}
              opacity={0.35}
            />
            <line
              x1={g.cx}
              y1={g.cy - g.ry}
              x2={g.cx}
              y2={g.cy + g.ry}
              className="stroke-outline-variant"
              strokeWidth={0.4}
              opacity={0.35}
            />
          </g>
          <Graduations g={g} />
          <text
            x={orbit(g, 42, 1.1).x}
            y={orbit(g, 42, 1.1).y}
            textAnchor="middle"
            className="fill-on-surface-variant"
            style={{ fontSize: label(10) }}
          >
            MCP surface
          </text>

          {/* Spokes, drawn under the marks */}
          {SPECIALISTS.map((n, i) => {
            const p = point(g, i);
            const rim = rimPoint(g, p.x, p.y);
            const isLit = lit === n.node;
            return (
              <g key={`spoke-${n.node}`} aria-hidden="true">
                <line
                  x1={rim.x}
                  y1={rim.y}
                  x2={p.x}
                  y2={p.y}
                  strokeWidth={isLit ? 1.4 : 1}
                  strokeDasharray={n.state === "built" ? undefined : "4 5"}
                  className={isLit ? "stroke-secondary" : "stroke-outline-variant"}
                />
                {isLit && (
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={rim.x}
                    y2={rim.y}
                    pathLength={1}
                    strokeWidth={1.6}
                    strokeDasharray="0.16 1"
                    className="stroke-secondary mesh-pulse"
                  />
                )}
              </g>
            );
          })}

          {/* Core: the orchestrator, stateless */}
          <g
            role="button"
            tabIndex={0}
            aria-pressed={coreActive}
            aria-label="Orchestrator, Synthetic PoC, in shadow, supervisory agent with no memory. Show details."
            className="cursor-pointer focus:outline-none [&:focus-visible_.mesh-core]:stroke-secondary"
            onMouseEnter={() => setHovered(ORCHESTRATOR)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(ORCHESTRATOR)}
            onBlur={() => setHovered(null)}
            onClick={() => toggle(ORCHESTRATOR)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(ORCHESTRATOR);
              }
              if (e.key === "Escape") setActive(null);
            }}
          >
            <circle cx={g.cx} cy={g.cy} r={g.core} fill="transparent" />
            <circle
              cx={g.cx}
              cy={g.cy}
              r={g.core}
              strokeWidth={coreLit ? 1.4 : 1}
              strokeDasharray="5 4"
              className={`mesh-core fill-surface ${
                coreLit ? "stroke-secondary" : "stroke-outline"
              }`}
            />
            <circle
              cx={g.cx}
              cy={g.cy}
              r={g.core - 8}
              className="fill-none stroke-outline-variant"
              strokeWidth={0.5}
              opacity={0.6}
            />
            <text
              x={g.cx}
              y={coreY1}
              textAnchor="middle"
              className="fill-primary"
              style={{ fontSize: nameSize, fontStyle: "italic" }}
            >
              Orchestrator
            </text>
            <text
              x={g.cx}
              y={coreY2}
              textAnchor="middle"
              className={coreLit ? "fill-secondary" : "fill-on-surface-variant"}
              style={{ fontSize: smallSize }}
            >
              Supervisory agent
            </text>
            <text
              x={g.cx}
              y={coreY3}
              textAnchor="middle"
              className="fill-secondary"
              style={{ fontSize: smallSize }}
            >
              No memory
            </text>
          </g>

          {SPECIALISTS.map((n, i) => {
            const p = point(g, i);
            const isLit = lit === n.node;
            const isActive = active === n.node;
            const left = !isMobile && p.x < g.cx - 8;
            const right = !isMobile && p.x > g.cx + 8;
            const anchor = left ? "end" : right ? "start" : "middle";
            const tx = left ? p.x - 14 : right ? p.x + 14 : p.x;
            const above = anchor === "middle" && p.y < g.cy;
            const ty = anchor !== "middle" ? p.y - 2 : above ? p.y - 12 - lineGap : p.y + 18 + nameSize * 0.8;
            const stateY = ty + lineGap;
            // Transparent hit area over the mark and its label.
            const nameW = n.node.length * nameSize * 0.55;
            const stateW = STATE_LABEL[n.state].length * smallSize * 0.6;
            const hitW = Math.max(nameW, stateW) + 34;
            const hitTop = Math.min(ty - nameSize * 0.9, p.y - 8) - 4;
            const hitH = Math.max(stateY + smallSize * 0.35, p.y + 8) + 2 - hitTop;
            const hitX =
              anchor === "end" ? tx + 8 - hitW : anchor === "start" ? p.x - 12 : tx - hitW / 2;
            const hitY = hitTop;

            return (
              <g
                key={n.node}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`${n.node}, ${STATE_LABEL[n.state]}. Show details.`}
                className="cursor-pointer focus:outline-none [&:focus-visible_.mesh-hit]:stroke-secondary"
                onMouseEnter={() => setHovered(n.node)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(n.node)}
                onBlur={() => setHovered(null)}
                onClick={() => toggle(n.node)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(n.node);
                  }
                  if (e.key === "Escape") setActive(null);
                }}
              >
                <rect x={hitX} y={hitY} width={hitW} height={hitH} fill="transparent" />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isLit ? 6 : 5}
                  strokeWidth={1.2}
                  className={`mesh-hit fill-surface ${
                    isLit ? "stroke-secondary" : "stroke-outline"
                  }`}
                />
                {n.state !== "design" && (
                  <circle cx={p.x} cy={p.y} r={2} className="fill-secondary" />
                )}
                <text
                  x={tx}
                  y={ty}
                  textAnchor={anchor}
                  className="fill-primary"
                  style={{ fontSize: nameSize, fontStyle: "italic" }}
                >
                  {n.node}
                </text>
                <text
                  x={tx}
                  y={stateY}
                  textAnchor={anchor}
                  className={isLit ? "fill-secondary" : "fill-on-surface-variant"}
                  style={{ fontSize: smallSize }}
                >
                  {STATE_LABEL[n.state]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel */}
      <div
        aria-live="polite"
        className="border-t border-outline-variant px-4 py-4 md:px-6 md:py-5"
      >
        {selected ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-headline italic text-heading text-lg">{selected.node}</span>
              <span className="font-label uppercase tracking-[0.16em] text-kicker text-secondary">
                {selected.status}
              </span>
            </div>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              <span className="text-primary">Owns.</span> {selected.owns}
            </p>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              <span className="text-primary">Does not own.</span> {selected.not}
            </p>
            {selected.to ? (
              <Link
                to={selected.to}
                className="inline-block font-label uppercase tracking-[0.16em] text-kicker text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
              >
                Read the {selected.node} case study
              </Link>
            ) : (
              <p className="font-label uppercase tracking-[0.16em] text-kicker text-on-surface-variant">
                No page yet: a named slot in the contract, and no code
              </p>
            )}
          </div>
        ) : (
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            Four domain agents, one supervisory agent at the centre. {CORE_NODE.node} holds no
            memory of its own: state stays with the agent that owns it, and no agent talks to
            another. Select a mark to read what it owns and what it does not.
          </p>
        )}
      </div>
    </figure>
  );
};

export default MeshBlueprint;
