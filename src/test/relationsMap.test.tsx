import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RelationsMap } from "@/components/rose/RelationsMap";
import { RoseCaseStudy, ROSE_CHAPTERS } from "@/components/rose/RoseCaseStudy";
import { SEO_ROUTES } from "../../scripts/seo-routes";
import { SECTION_INDEX } from "@/content/sectionIndex.generated";

// The navigation tracker is the site's existing one; here it is a spy, so a click can be checked without the network.
const { trackSpy } = vi.hoisted(() => ({ trackSpy: vi.fn() }));
vi.mock("@/hooks/useTrackClick", () => ({ useTrackClick: () => trackSpy, default: () => trackSpy }));
import { GRAPH_EDGES, GRAPH_NODES, GRAPH_STANDALONE, RELATIONS_MAP as R, nodeLabel, nodeUrl, relationRows } from "@/content/relationsMap";
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
      "Tacet | direct, while the orchestrator is not the way through | Aetherix",
      "Sonor | inspired | Tacet",
      "Lore | same thesis | Aetherix",
      "Rose | how she reads the site | Field Notes (agent experience)",
    ]);
    for (const e of GRAPH_EDGES) expect(deck, e.reason).toContain(e.reason);
    expect(GRAPH_STANDALONE).toEqual([{ node: "compass", reason: "Standalone project." }]);
  });

  it("draws as dashed only Tacet to Aetherix, Sonor and Lore; Peritia is not indirect", () => {
    expect(GRAPH_EDGES.filter((e) => e.indirect).map((e) => e.from)).toEqual(["tacet", "sonor", "lore"]);
    expect(GRAPH_EDGES.find((e) => e.from === "peritia")?.indirect).toBe(false);
  });

  it("gives a url to every node but Rose and Every page, and each url is a route or an anchor that exists", () => {
    const routes = new Set(SEO_ROUTES.map((r) => r.path));
    expect(GRAPH_NODES.filter((n) => !n.url).map((n) => n.id)).toEqual(["rose", "every-page"]);
    for (const n of GRAPH_NODES.filter((x) => x.url)) {
      const [path, anchor] = n.url!.split("#");
      expect(n.url, n.id).toMatch(/^\//);
      expect(routes.has(path), `${n.id}: route ${path}`).toBe(true);
      if (anchor) {
        const ids = path === "/rose" ? ROSE_CHAPTERS.map((c) => c.id) : (SECTION_INDEX.find((e) => e.path === path)?.sections.map((s) => s.id) ?? []);
        expect(ids, `${n.id}: anchor #${anchor} on ${path}`).toContain(anchor);
      }
    }
    expect(GRAPH_NODES.find((n) => n.id === "evaluation")?.url).toBe("/rose#ch-08");
  });

  it("keeps no style-allowlist entry for the old note text", () => {
    expect(readFileSync("docs/style-allowlist.json", "utf8")).not.toContain("content, not the projects");
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
    render(<MemoryRouter><RelationsMap /></MemoryRouter>);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(9 + 1);
    expect(items[3].textContent).toBe(`Aetherix, Tacet, Anima part of, built Orchestrator ${GRAPH_EDGES[3].reason}`);
    expect(items[8].textContent).toBe(`Rose how she reads the site Field Notes (agent experience) ${GRAPH_EDGES[10].reason}`);
    expect(items[9].textContent).toBe("Compass Standalone project.");
    relationRows().forEach((r, i) => {
      expect(items[i].textContent).toContain(r.from.join(", "));
      expect(items[i].textContent).toContain(r.reason);
    });
  });

  it("navigates each graph node to its published source, with no invented destination", () => {
    render(<MemoryRouter><RelationsMap /></MemoryRouter>);
    const links = screen.getAllByRole("link");
    const expected = GRAPH_NODES.filter((n) => n.url);
    expect(links.map((a) => a.getAttribute("href"))).toEqual(expected.map((n) => n.url));
  });

  it("tracks a click on a node name with the site's navigation tracker", () => {
    trackSpy.mockClear();
    render(<MemoryRouter><RelationsMap /></MemoryRouter>);
    fireEvent.click(screen.getAllByRole("link", { name: "Orchestrator" })[0]);
    expect(trackSpy).toHaveBeenCalledWith({ label: "Orchestrator", href: "/architecture", kind: "nav" });
  });

  it("says the caption, then the note, in the v2 words", () => {
    const { container } = render(<MemoryRouter><RelationsMap /></MemoryRouter>);
    const fig = container.querySelector("figure") as HTMLElement;
    expect(fig.querySelector("figcaption")?.textContent).toBe("What Rose can relate. I write these links by hand, and each carries a one-line reason.");
    expect(fig.lastElementChild?.textContent).toBe("Rose links what the site's pages say about each project. A dashed label marks an indirect link.");
    expect(deck).toContain(R.caption);
    expect(deck).toContain(R.note);
  });
});

describe("The drawing", () => {
  it("draws the Field Note node as Field Notes / agent experience", () => {
    expect(source).toContain('lines: ["Field Notes", "agent experience"]');
    expect(nodeLabel("field-note-readers")).toBe("Field Notes (agent experience)");
  });


});

describe("In chapter 06 and in the mirror", () => {
  it("is reached through Connect in chapter 06", () => {
    render(<MemoryRouter><RoseCaseStudy reduced={false} /></MemoryRouter>);
    expect(screen.queryByText(R.caption)).toBeNull();
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Connect" }), { button: 0, ctrlKey: false });
    const map = screen.getByText(R.caption).closest("figure");
    expect(document.getElementById("ch-06")?.contains(map)).toBe(true);
  });

  it("the Markdown mirror lists every row with its reason, then the caption and the note", () => {
    const md = renderRoseMirror("2026-11-13");
    let from = md.indexOf("How Rose works. Solid lines");
    expect(from).toBeGreaterThan(-1);
    for (const m of [
      "- Rose answers from Every page\n  Rose answers from the page you are on first",
      "- Rose how she is tested [Evaluation](https://ivandemurard.com/rose#ch-08)\n  Caught in testing shows how every change to Rose is tested",
      "- [Aetherix](https://ivandemurard.com/aetherix), [Tacet](https://ivandemurard.com/tacet), [Anima](https://ivandemurard.com/anima) part of, built [Orchestrator](https://ivandemurard.com/architecture)\n  One of the agents",
      "- [Sonor](https://ivandemurard.com/sonor) inspired [Tacet](https://ivandemurard.com/tacet)\n  Tacet carries Sonor's",
      "- Rose how she reads the site [Field Notes (agent experience)](https://ivandemurard.com/journal/one-text-three-readers)\n  This Field Note shows how one source",
      "- [Compass](https://ivandemurard.com/compass)\n  Standalone project.",
      R.caption, R.note,
    ]) {
      const at = md.indexOf(m, from);
      expect(at, m).toBeGreaterThan(-1);
      from = at;
    }
    expect(readFileSync("public/rose.md", "utf8")).toContain(R.note);
  });

  it("the case study doc no longer says Lore was adapted into Peritia", () => {
    expect(readFileSync("docs/rose-case-study.md", "utf8")).not.toContain("Lore (adapted into Peritia)");
  });
});
