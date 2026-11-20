import { GRAPH_EDGES, GRAPH_NODES, GRAPH_STANDALONE, RELATIONS_MAP as R, nodeLabel, nodeUrl, relationRows } from "@/content/relationsMap";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { useTrackClick } from "@/hooks/useTrackClick";
import "./relationsMap.css";

/**
 * Chapter 06, the map of relations. Everything it says comes from src/content/portfolio-graph.json (one source,
 * shared with Rose and the MCP): the drawing reads the nodes and edges, the list reads the reasons. The drawing is
 * decoration (aria-hidden, no link) and only shows from 720px of room; the list is always there and is the reading
 * order. In the list, the name of a node that has a page (its `url` in the graph) is a link to it.
 * Solid line = a link, dashed line = an indirect link (docs/rose-case-study-copy-v2.md).
 */

type Box = { x: number; y: number; w: number; h: number; lines?: string[] };
/** Node centres in the 760 x 420 drawing. Layout only: nothing here says what is linked to what. */
const BOX: Record<string, Box> = {
  rose: { x: 58, y: 70, w: 96, h: 40 },
  "every-page": { x: 196, y: 70, w: 120, h: 40 },
  evaluation: { x: 58, y: 190, w: 96, h: 40 },
  "field-notes": { x: 196, y: 190, w: 150, h: 56, lines: ["Field Notes", "evaluation harness"] },
  "field-note-readers": { x: 196, y: 126, w: 150, h: 44, lines: ["Field Notes", "agent experience"] },
  orchestrator: { x: 520, y: 100, w: 150, h: 40 },
  aetherix: { x: 340, y: 220, w: 96, h: 44 },
  tacet: { x: 460, y: 220, w: 96, h: 44 },
  anima: { x: 580, y: 220, w: 96, h: 44 },
  peritia: { x: 700, y: 220, w: 96, h: 44 },
  lore: { x: 340, y: 380, w: 96, h: 40 },
  sonor: { x: 460, y: 380, w: 96, h: 40 },
  compass: { x: 700, y: 380, w: 96, h: 40 },
};

/** Where the segment between two box centres leaves the first box and enters the second, with a 3px gap. */
const clip = (a: Box, b: Box) => {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const reach = (box: Box) => Math.min(box.w / 2 / Math.max(Math.abs(dx), 1e-6), box.h / 2 / Math.max(Math.abs(dy), 1e-6)) + 3 / len;
  const ta = reach(a), tb = reach(b);
  return { from: { x: a.x + dx * ta, y: a.y + dy * ta }, to: { x: b.x - dx * tb, y: b.y - dy * tb } };
};

const Drawing = () => (
  <svg className="rm-bg" viewBox="0 0 760 420" aria-hidden="true" focusable="false">
    <rect x="280" y="16" width="476" height="258" rx="16" className="rm-frame" fill="none" strokeWidth="1" />
    <text x="296" y="38" className="rm-small font-label">Hospitality multi-agent architecture</text>
    {GRAPH_EDGES.map((e) => {
      const { from, to } = clip(BOX[e.from], BOX[e.to]);
      return <line key={`${e.from}-${e.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="rm-line" strokeWidth="1.5" strokeDasharray={e.indirect ? "5 5" : undefined} />;
    })}
    {GRAPH_NODES.map((n) => {
      const b = BOX[n.id];
      const lines = b.lines ?? [n.label];
      return (
        <g key={n.id}>
          <rect x={b.x - b.w / 2} y={b.y - b.h / 2} width={b.w} height={b.h} rx="12" className="rm-node" strokeWidth="1.5" />
          {lines.map((l, i) => (
            <text key={l} x={b.x} y={b.y + (i - (lines.length - 1) / 2) * 18 + 5} textAnchor="middle" className={i === 0 ? "rm-text font-body" : "rm-small font-label"}>{l}</text>
          ))}
        </g>
      );
    })}
  </svg>
);

/** The name of a node in the list: a link to its page when the graph gives it a url (focus ring, underline, tokens only). */
const NodeName = ({ id, label }: { id: string; label: string }) => {
  const track = useTrackClick();
  const url = nodeUrl(id);
  if (!url) return <span className="font-semibold">{label}</span>;
  return (
    <Link
      to={url}
      onClick={() => track({ label, href: url, kind: "nav" })}
      className="rm-name font-semibold text-on-surface underline decoration-secondary underline-offset-4 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-secondary"
    >
      {label}
    </Link>
  );
};

export const RelationsMap = () => (
  <figure className="rm mt-14">
    <div className="rm-wrap">
      <Drawing />
      <ul className="rm-list m-0 list-none p-0" role="list">
        {relationRows().map((r) => (
          <li key={`${r.from.join()}-${r.to}`} className="rm-row">
            <p className="m-0 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-body text-base text-on-surface">
              <span>
                {r.fromIds.map((id, i) => (
                  <span key={id}>
                    {i > 0 && ", "}
                    <NodeName id={id} label={nodeLabel(id)} />
                  </span>
                ))}
              </span>{" "}
              <span className="rm-link font-mono text-meta text-on-surface-variant" data-indirect={r.indirect ? "" : undefined}>{r.link}</span>{" "}
              <NodeName id={r.toId} label={r.to} />
            </p>{" "}
            <p className="m-0 mt-1 font-body text-[15px] leading-normal text-on-surface-variant">{r.reason}</p>
          </li>
        ))}
        {GRAPH_STANDALONE.map((s) => (
          <li key={s.node} className="rm-row">
            <p className="m-0 font-body text-base text-on-surface"><NodeName id={s.node} label={nodeLabel(s.node)} /></p>{" "}
            <p className="m-0 mt-1 font-body text-[15px] leading-normal text-on-surface-variant">{s.reason}</p>
          </li>
        ))}
      </ul>
    </div>
    <figcaption className="mt-4 font-body text-[15px] leading-normal text-on-surface">{R.caption}</figcaption>{" "}
    <p className="m-0 mt-1 font-body text-[15px] leading-normal text-on-surface-variant">{R.note}</p>
  </figure>
);
