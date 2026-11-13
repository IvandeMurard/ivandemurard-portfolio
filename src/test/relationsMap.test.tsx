import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RelationsMap } from "@/components/rose/RelationsMap";
import { RoseCaseStudy } from "@/components/rose/RoseCaseStudy";
import { GRAPH_EDGES, GRAPH_NODES, GRAPH_STANDALONE, RELATIONS_MAP as R, nodeLabel, relationRows } from "@/content/relationsMap";
import graph from "@/content/portfolio-graph.json";
import { renderRoseMirror } from "../../scripts/rose-mirror";

// Chapter 06, the map of relations. One source (portfolio-graph.json), edges and reasons as decided in the v2 deck.

afterEach(cleanup);
const css = readFileSync("src/components/rose/relationsMap.css", "utf8");
const source = readFileSync("src/components/rose/RelationsMap.tsx", "utf8");
const deck = readFileSync("docs/rose-case-study-copy-v2.md", "utf8");

describe("portfolio-graph.json, the one source", () => {
  it("has the edges of 'Relations, decided 3 Nov', with their reasons verbatim", () => {
    const seen = GRAPH_EDGES.map((e) => `${nodeLabel(e.from)} | ${e.link} | ${nodeLabel(e.to)}`);
    expect(seen).toEqual([
      "Rose | answers from | Every page",
      "Rose | how she is tested | Evaluation",
      "Evaluation | uses the method of | Field Notes (evaluation harness)",
      "Aetherix | part of, built | Orchestrator",
      "Tacet | part of, built | Orchestrator",
      "Anima | part of, built | Orchestrator",
      "Peritia | part of, design | Orchestrator",
      "Tacet | direct, until the orchestrator exists | Aetherix",
      "Sonor | inspired | Tacet",
      "Lore | same thesis | Aetherix",
    ]);
    for (const e of GRAPH_EDGES) expect(deck, e.reason).toContain(e.reason);
    expect(GRAPH_STANDALONE).toEqual([{ node: "compass", reason: "Standalone project." }]);
  });

  it("draws as dashed only Peritia (design), Tacet to Aetherix, Sonor and Lore", () => {
    expect(GRAPH_EDGES.filter((e) => e.indirect).map((e) => e.from)).toEqual(["peritia", "tacet", "sonor", "lore"]);
  });

  it("only links known nodes, and Compass has no edge", () => {
    const ids = new Set(GRAPH_NODES.map((n) => n.id));
    for (const e of GRAPH_EDGES) { expect(ids.has(e.from)).toBe(true); expect(ids.has(e.to)).toBe(true); }
    expect(GRAPH_EDGES.some((e) => e.from === "compass" || e.to === "compass")).toBe(false);
    expect(Object.keys(graph).sort()).toEqual(["edges", "nodes", "standalone"]);
  });

  it("is read, not copied: the component holds no reason or link text of its own", () => {
    for (const e of GRAPH_EDGES) {
      expect(source).not.toContain(e.reason);
      expect(source).not.toContain(e.link);
    }
  });
});

describe("The list, which is the reading order", () => {
  it("has one row per group of edges: from, link, to, then the reason, and Compass last", () => {
    render(<RelationsMap />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(8 + 1);
    expect(items[3].textContent).toBe(`Aetherix, Tacet, Anima part of, built Orchestrator ${GRAPH_EDGES[3].reason}`);
    expect(items[8].textContent).toBe("Compass Standalone project.");
    relationRows().forEach((r, i) => {
      expect(items[i].textContent).toContain(r.from.join(", "));
      expect(items[i].textContent).toContain(r.reason);
    });
  });

  it("draws dashed link pills for the indirect rows only", () => {
    const { container } = render(<RelationsMap />);
    const dashed = [...container.querySelectorAll(".rm-link[data-indirect]")].map((n) => n.textContent);
    expect(dashed).toEqual(["part of, design", "direct, until the orchestrator exists", "inspired", "same thesis"]);
  });

  it("says the caption, then the note, in the v2 words", () => {
    const { container } = render(<RelationsMap />);
    const fig = container.querySelector("figure") as HTMLElement;
    expect(fig.querySelector("figcaption")?.textContent).toBe("What Rose can relate. I write this map by hand, and each link carries a one-line reason.");
    expect(fig.lastElementChild?.textContent).toBe("Rose links the site's content, not the projects' code. A dashed line marks an indirect link.");
    expect(deck).toContain(R.caption);
    expect(deck).toContain(R.note);
  });
});

describe("The drawing", () => {
  it("is aria-hidden, one line per edge and one box per node, dashed lines for the indirect edges", () => {
    const { container } = render(<RelationsMap />);
    const svg = container.querySelector("svg.rm-bg") as SVGElement;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    const lines = [...svg.querySelectorAll("line")];
    expect(lines).toHaveLength(GRAPH_EDGES.length);
    expect(lines.filter((l) => l.hasAttribute("stroke-dasharray"))).toHaveLength(4);
    expect(svg.querySelectorAll("rect.rm-node")).toHaveLength(GRAPH_NODES.length);
  });

  it("switches on a container query of 720px, never on the viewport, and uses tokens only", () => {
    expect(css).toContain("container: rm / inline-size;");
    expect(css).toContain("@container rm (min-width: 720px)");
    expect(css).not.toMatch(/@media/);
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgb\(/);
    expect(css.slice(0, css.indexOf("@container"))).toContain(".rm-bg { display: none; }");
  });
});

describe("In chapter 06 and in the mirror", () => {
  it("sits in chapter 06, after the loop", () => {
    render(<MemoryRouter><RoseCaseStudy reduced={false} /></MemoryRouter>);
    const loop = screen.getByRole("figure", { name: /How Rose works/ });
    const map = screen.getByText(R.caption).closest("figure") as HTMLElement;
    expect(document.getElementById("ch-06")?.contains(map)).toBe(true);
    expect(loop.compareDocumentPosition(map) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("the Markdown mirror lists every row with its reason, then the caption and the note", () => {
    const md = renderRoseMirror("2026-11-13");
    let from = md.indexOf("How Rose works. Solid lines");
    expect(from).toBeGreaterThan(-1);
    for (const m of [
      "- Rose answers from Every page\n  Rose answers from the page you are on first",
      "- Aetherix, Tacet, Anima part of, built Orchestrator\n  One of the agents",
      "- Sonor inspired Tacet\n  Tacet carries Sonor's",
      "- Compass\n  Standalone project.",
      R.caption, R.note,
    ]) {
      const at = md.indexOf(m, from);
      expect(at, m).toBeGreaterThan(-1);
      from = at;
    }
    expect(readFileSync("public/rose-design-lab.md", "utf8")).toContain(R.note);
  });

  it("the case study doc no longer says Lore was adapted into Peritia", () => {
    expect(readFileSync("docs/rose-case-study.md", "utf8")).not.toContain("Lore (adapted into Peritia)");
  });
});
