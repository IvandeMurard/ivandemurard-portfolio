import graph from "./portfolio-graph.json";

/**
 * Chapter 06, the map of relations. The edges, links and reasons live in portfolio-graph.json only (written by Ivan);
 * this file adds the two sentences around the map (docs/rose-case-study-copy-v2.md, "Map caption" and "Under the
 * map") and groups edges that share a link, a target and a reason, so the page and the Markdown mirror read the same.
 */
export const RELATIONS_MAP = {
  caption: "What Rose can relate. I write this map by hand, and each link carries a one-line reason.",
  note: "Rose links the site's content, not the projects' code. A dashed line marks an indirect link.",
} as const;

export type GraphEdge = { from: string; link: string; to: string; reason: string; indirect: boolean };
export type RelationRow = { from: string[]; link: string; to: string; reason: string; indirect: boolean };

export const GRAPH_NODES = graph.nodes as { id: string; label: string }[];
export const GRAPH_EDGES = graph.edges as GraphEdge[];
export const GRAPH_STANDALONE = graph.standalone as { node: string; reason: string }[];

export const nodeLabel = (id: string) => {
  const n = GRAPH_NODES.find((x) => x.id === id);
  if (!n) throw new Error(`portfolio-graph.json: unknown node "${id}"`);
  return n.label;
};

/** Consecutive edges with the same link, target and reason become one row ("Aetherix, Tacet, Anima part of, built Orchestrator"). */
export const relationRows = (): RelationRow[] => {
  const rows: RelationRow[] = [];
  for (const e of GRAPH_EDGES) {
    const last = rows[rows.length - 1];
    if (last && last.link === e.link && last.to === nodeLabel(e.to) && last.reason === e.reason && last.indirect === e.indirect) {
      last.from.push(nodeLabel(e.from));
    } else {
      rows.push({ from: [nodeLabel(e.from)], link: e.link, to: nodeLabel(e.to), reason: e.reason, indirect: e.indirect });
    }
  }
  return rows;
};

/** One row for the Markdown mirror: a bullet with from, link and to (as on the page), the reason on the next line. */
export const relationSentence = (r: RelationRow) => `- ${r.from.join(", ")} ${r.link} ${r.to}\n  ${r.reason}`;
