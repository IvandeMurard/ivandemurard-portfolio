import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { AetherixAgentAccordion } from "../components/atherix/AetherixAgentAccordion";
import { AetherixArchitectureFigure } from "../components/atherix/AetherixArchitectureFigure";
import { AetherixLedger } from "../components/atherix/AetherixLedger";
import { ARCH, INSIDE, LEDGER, METHOD, NEXT } from "../content/aetherixInside";
import { STATUSES } from "../content/statuses";
import { MESH_ANCHORS } from "../content/systems";

const md = readFileSync("public/aetherix.md", "utf8");
const page = readFileSync("src/pages/Atherix.tsx", "utf8");

describe("Inside the agent: the five steps", () => {
  it("carry the words of docs/aetherix-prototype/steps.json, in order", () => {
    // steps.json rows: number, label, title, description, "has a first bubble", speaker, first bubble, agent bubble, badge.
    const raw = JSON.parse(readFileSync("docs/aetherix-prototype/steps.json", "utf8")) as string[][];
    // Two sentences were reworded for the style check (listed in docs/aetherix-prototype/README.md). Each must still be
    // exactly the words of steps.json before the change, so any other drift is caught.
    const reworded: Record<string, string> = {
      "Read. Weather: poor. Local events: none.": "Read. Weather is poor, and there are no local events.",
      "A statistical forecast with its range, not a single number.": "A statistical forecast that comes with its range.",
    };
    expect(raw.flat().filter((c) => c in reworded)).toHaveLength(2);
    const rows = raw.map((r) => r.map((c) => reworded[c] ?? c));
    expect(INSIDE.steps).toHaveLength(rows.length);
    rows.forEach(([n, label, title, description, hasFrom, who, text, says, badge], i) => {
      const s = INSIDE.steps[i];
      expect([s.n, s.label, s.title, s.description, s.says, s.badge]).toEqual([n, label, title, description, says, badge]);
      expect(Boolean(s.from)).toBe(hasFrom === "true");
      if (s.from) expect(s.from).toEqual({ who, text });
    });
  });

  it("are all in the Markdown mirror", () => {
    for (const s of INSIDE.steps) {
      for (const t of [s.title, s.description, s.says, s.badge]) expect(md, t).toContain(t);
      if (s.from) expect(md).toContain(`${s.from.who}: "${s.from.text}"`);
    }
    for (const t of [INSIDE.intro, INSIDE.around, INSIDE.aroundText, INSIDE.caption]) expect(md, t).toContain(t);
  });
});

describe("Inside the agent: the accordion", () => {
  const headers = () => INSIDE.steps.map((s) => screen.getByRole("button", { name: `${s.n} ${s.title}` }));

  it("opens step 05 by default and ties each header to its panel", () => {
    render(<AetherixAgentAccordion />);
    const hs = headers();
    expect(hs.map((h) => h.getAttribute("aria-expanded"))).toEqual(["false", "false", "false", "false", "true"]);
    hs.forEach((h) => {
      const panel = document.getElementById(h.getAttribute("aria-controls")!)!;
      expect(panel).toBeTruthy();
      expect(panel.getAttribute("aria-labelledby")).toBe(h.id);
      expect(panel.hidden).toBe(h.getAttribute("aria-expanded") === "false");
    });
  });

  it("shows the open card's bubbles, badge and description, and a closed card's number and label", () => {
    render(<AetherixAgentAccordion />);
    const last = INSIDE.steps[4];
    const panel = screen.getByRole("region", { name: `${last.n} ${last.title}` });
    for (const t of [last.from!.text, last.says, last.badge, last.description]) expect(within(panel).getByText(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))).toBeTruthy();
    const closed = headers()[0];
    expect(closed.textContent).toContain("01");
    expect(closed.textContent).toContain(INSIDE.steps[0].label);
  });

  it("opens a card on click, one at a time", () => {
    render(<AetherixAgentAccordion />);
    fireEvent.click(headers()[1]);
    expect(headers().map((h) => h.getAttribute("aria-expanded"))).toEqual(["false", "true", "false", "false", "false"]);
  });

  it("moves the focus with Left and Right, without opening, and stops at the ends", () => {
    render(<AetherixAgentAccordion />);
    const hs = headers();
    hs[4].focus();
    fireEvent.keyDown(hs[4], { key: "ArrowLeft" });
    expect(document.activeElement).toBe(hs[3]);
    expect(hs[3].getAttribute("aria-expanded")).toBe("false");
    fireEvent.keyDown(hs[3], { key: "ArrowRight" });
    expect(document.activeElement).toBe(hs[4]);
    fireEvent.keyDown(hs[4], { key: "ArrowRight" });
    expect(document.activeElement).toBe(hs[4]);
    hs[0].focus();
    fireEvent.keyDown(hs[0], { key: "ArrowLeft" });
    expect(document.activeElement).toBe(hs[0]);
  });

  it("uses real buttons, and does not animate its width under reduced motion", () => {
    render(<AetherixAgentAccordion />);
    headers().forEach((h) => expect(h.tagName).toBe("BUTTON"));
    const css = readFileSync("src/index.css", "utf8").replace(/\r\n/g, "\n");
    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce) {\n  .aetherix-acc-card"));
    expect(reduced.slice(0, 120)).toContain(".aetherix-acc-card { transition: none; }");
  });
});

describe("The Decision Ledger", () => {
  it("is a table: five column headers, the built row, two design rows", () => {
    render(<AetherixLedger />);
    const table = screen.getByRole("table", { name: LEDGER.tableAria });
    expect(within(table).getAllByRole("columnheader", { hidden: true }).map((c) => c.textContent)).toEqual(LEDGER.columns);
    const rows = within(table).getAllByRole("row", { hidden: true });
    expect(rows).toHaveLength(4);
    const cells = within(rows[1]).getAllByRole("cell").map((c) => c.textContent?.replace(/^(Recommended|Human said|What happened|Gap)/, ""));
    expect(cells).toEqual(["Aetherix · built", "101", "79", "95", "6% vs 17%"]);
    LEDGER.design.forEach(([who, what], i) => {
      const c = within(rows[i + 2]).getAllByRole("cell");
      expect(c.map((x) => x.textContent)).toEqual([who, what]);
    });
    expect(screen.getByText(LEDGER.caption)).toBeTruthy();
  });

  it("is in the Markdown mirror, and the page underlines the bet sentence", () => {
    for (const t of [LEDGER.intro, LEDGER.bet, LEDGER.why, LEDGER.whyNote, LEDGER.sharedLabel, LEDGER.caption, ...LEDGER.shared]) expect(md, t).toContain(t);
    expect(md).toContain("| Aetherix · built | 101 | 79 | 95 | 6% vs 17% |");
    expect(page).toContain("border-b-[1.5px] border-secondary\">{LEDGER.bet}");
  });
});

describe("Chapter 06 method points", () => {
  it("are in the Markdown mirror", () => {
    for (const [lead, rest] of METHOD) expect(md).toContain(`**${lead}** ${rest}`);
  });
});

describe("Where it sits", () => {
  it("states the statuses of statuses.ts and of the architecture page", () => {
    const status = Object.fromEntries(ARCH.nodes.map((n) => [n.id, n.status]));
    expect(status.tacet.toLowerCase()).toContain(STATUSES.tacet.word.toLowerCase());
    expect(STATUSES.anima.note).toContain("Synthetic PoC");
    expect(STATUSES.anima.note).toContain("DPIA");
    expect(status.anima).toBe("Synthetic PoC · DPIA-gated");
    expect(status.aetherix).toBe("Built · forecast in shadow mode");
    expect(status.orchestrator).toBe("Design, proto-stub");
    expect(MESH_ANCHORS.find((a) => a.slug === "orchestrator")!.status).toContain("proto-stub");
    expect(status.peritia.startsWith("Design")).toBe(true);
    expect(MESH_ANCHORS.find((a) => a.slug === "peritia")!.status.startsWith("Design")).toBe(true);
    // Never higher than the project statuses: Aetherix is Pre-pilot and the figure never says pilot.
    expect(STATUSES.aetherix.word).toBe("Pre-pilot");
    expect(Object.values(status).join(" ")).not.toMatch(/pilot-ready|live|production/i);
  });

  it("draws line style from status: solid Built, long dashes Synthetic PoC, dots Design", () => {
    for (const n of ARCH.nodes) {
      const want = n.status.startsWith("Built") ? "solid" : n.status.startsWith("Synthetic PoC") ? "dashed" : "dotted";
      expect(n.line, n.name).toBe(want);
    }
  });

  it("reads in order: orchestrator, the four agents, the ledger, then the notes; the drawing is hidden from assistive tech", () => {
    const { container } = render(<AetherixArchitectureFigure />);
    const text = container.textContent!;
    const order = ["Orchestrator", "Aetherix", "Tacet", "Anima", "Peritia", ARCH.ledgerName, ARCH.link, ARCH.thirdParty].map((t) => text.indexOf(t));
    expect(order.every((n) => n >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(container.querySelector("svg")!.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector("svg")!.textContent).toBe("");
    expect(screen.getByRole("figure", { name: ARCH.figureLabel })).toBeTruthy();
    expect(container.querySelectorAll("li")).toHaveLength(5);
  });

  it("is in the Markdown mirror", () => {
    for (const n of ARCH.nodes) expect(md).toContain(`${n.role} (${n.status})`);
    for (const t of [ARCH.link, ARCH.thirdParty, ARCH.caption]) expect(md, t).toContain(t);
  });
});

describe("The Next card", () => {
  it("is on the page before the close, and in the mirror", () => {
    expect(page.indexOf("<Next />")).toBeGreaterThan(0);
    expect(page.indexOf("<Next />")).toBeLessThan(page.indexOf("<Close />"));
    for (const t of [NEXT.title, NEXT.text, NEXT.agents]) expect(md, t).toContain(t);
  });
});

describe("Anchors kept", () => {
  it("keeps where-it-stands, the-numbers and how-its-built", () => {
    expect(page).toContain('id="the-numbers"');
    const ids = readFileSync("src/content/aetherixCase.ts", "utf8");
    expect(ids).toContain('id: "where-it-stands"');
    expect(ids).toContain('id: "how-its-built"');
  });
});
