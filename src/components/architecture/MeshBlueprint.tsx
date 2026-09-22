import { useState } from "react";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { useIsMobile } from "@/hooks/use-mobile";
import { MESH_NODES, type MeshNode } from "@/content/meshNodes";

/**
 * FIG. 3.1 — The mesh, as wired.
 * Hairline engraving of the five agents around the persistence core.
 * Facts come from MESH_NODES so the figure and the table cannot diverge.
 */

const DESKTOP = { w: 900, h: 440, cx: 450, cy: 220, rx: 320, ry: 150, core: 66 };
const MOBILE = { w: 360, h: 540, cx: 180, cy: 280, rx: 108, ry: 212, core: 54 };

const ANGLES = [-90, -18, 54, 126, 198];

const point = (
  g: typeof DESKTOP,
  index: number,
): { x: number; y: number } => {
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

export const MeshBlueprint = () => {
  const isMobile = useIsMobile();
  const g = isMobile ? MOBILE : DESKTOP;
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const selected = MESH_NODES.find((n) => n.node === active) ?? null;
  const lit = hovered ?? active;

  return (
    <figure className="mb-8 rounded-sm border border-outline-variant bg-surface-container-lowest">
      <figcaption className="flex items-center justify-between gap-4 border-b border-outline-variant px-4 py-3">
        <span className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary">
          Fig. 3.1 · The mesh, as wired
        </span>
        <span className="font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
          Solid: built · Dashed: designed
        </span>
      </figcaption>

      <div className="px-3 py-4 md:px-6 md:py-6">
        <svg
          viewBox={`0 0 ${g.w} ${g.h}`}
          className="w-full h-auto mesh-blueprint"
          role="group"
          aria-label="The five agents of the mesh, each wired to the shared persistence core"
        >
          {/* Core */}
          <g aria-hidden="true">
            <circle
              cx={g.cx}
              cy={g.cy}
              r={g.core}
              className="fill-none stroke-outline-variant"
              strokeWidth={1}
            />
            <circle
              cx={g.cx}
              cy={g.cy}
              r={g.core - 7}
              className="fill-none stroke-outline-variant"
              strokeWidth={1}
              strokeDasharray="2 5"
            />
            <text
              x={g.cx}
              y={g.cy - 4}
              textAnchor="middle"
              className="fill-primary"
              style={{ fontSize: isMobile ? 12 : 13, fontStyle: "italic" }}
            >
              Persistence
            </text>
            <text
              x={g.cx}
              y={g.cy + 12}
              textAnchor="middle"
              className="fill-secondary"
              style={{ fontSize: isMobile ? 8 : 9, letterSpacing: "0.16em" }}
            >
              POSTGRES
            </text>
            <text
              x={g.cx}
              y={g.cy + 24}
              textAnchor="middle"
              className="fill-secondary"
              style={{ fontSize: isMobile ? 8 : 9, letterSpacing: "0.16em" }}
            >
              SHARED MEMORY
            </text>
          </g>

          {MESH_NODES.map((n, i) => {
            const p = point(g, i);
            const rim = rimPoint(g, p.x, p.y);
            const isLit = lit === n.node;
            const isActive = active === n.node;
            const left = !isMobile && p.x < g.cx - 8;
            const right = !isMobile && p.x > g.cx + 8;
            const anchor = left ? "end" : right ? "start" : "middle";
            const tx = left ? p.x - 14 : right ? p.x + 14 : p.x;
            const ty = anchor === "middle" ? (p.y < g.cy ? p.y - 22 : p.y + 30) : p.y - 2;
            // Transparent hit area over the mark and its label.
            const charW = (isMobile ? 13 : 15) * 0.62;
            const hitW = Math.max(n.node.length, STATE_LABEL[n.state].length) * charW + 34;
            const hitH = 46;
            const hitX =
              anchor === "end" ? tx + 8 - hitW : anchor === "start" ? p.x - 12 : tx - hitW / 2;
            const hitY = anchor === "middle" ? (p.y < g.cy ? p.y - 40 : p.y - 8) : p.y - 20;



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
                onClick={() => setActive(isActive ? null : n.node)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(isActive ? null : n.node);
                  }
                  if (e.key === "Escape") setActive(null);
                }}
              >
                {/* Hit area */}
                <rect
                  x={hitX}
                  y={hitY}
                  width={hitW}
                  height={hitH}
                  fill="transparent"
                />
                {/* Spoke */}

                <line
                  x1={rim.x}
                  y1={rim.y}
                  x2={p.x}
                  y2={p.y}
                  strokeWidth={isLit ? 1.4 : 1}
                  strokeDasharray={n.state === "built" ? undefined : "4 5"}
                  className={isLit ? "stroke-secondary" : "stroke-outline-variant"}
                />
                {/* Pulse travelling to the core */}
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
                {/* Node mark */}
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
                {/* Label */}
                <text
                  x={tx}
                  y={ty}
                  textAnchor={anchor}
                  className="fill-primary"
                  style={{ fontSize: isMobile ? 13 : 15, fontStyle: "italic" }}
                >
                  {n.node}
                </text>
                <text
                  x={tx}
                  y={ty + (isMobile ? 13 : 15)}
                  textAnchor={anchor}
                  className={isLit ? "fill-secondary" : "fill-on-surface-variant"}
                  style={{ fontSize: isMobile ? 8 : 9, letterSpacing: "0.16em" }}
                >
                  {STATE_LABEL[n.state].toUpperCase()}
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
              <span className="font-headline italic text-primary text-lg">{selected.node}</span>
              <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
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
                className="inline-block font-label uppercase tracking-[0.16em] text-[10px] text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
              >
                Read the {selected.node} case study
              </Link>
            ) : (
              <p className="font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
                No page yet: a named slot in the contract, and no code
              </p>
            )}
          </div>
        ) : (
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            Every agent talks to the core, never to another agent. Select one to read what it owns
            and what it does not.
          </p>
        )}
      </div>
    </figure>
  );
};

export default MeshBlueprint;
