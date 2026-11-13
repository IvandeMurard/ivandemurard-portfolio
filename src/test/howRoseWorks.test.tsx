import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HowRoseWorks } from "@/components/rose/HowRoseWorks";
import { RoseCaseStudy } from "@/components/rose/RoseCaseStudy";
import { HOW_ROSE_WORKS as H } from "@/content/howRoseWorks";
import { renderRoseMirror } from "../../scripts/rose-mirror";

// Chapter 06, "How Rose works": the loop (board F, variant B). Copy is the board's, verbatim.

afterEach(cleanup);
const css = readFileSync("src/components/rose/howRoseWorks.css", "utf8");
const source = readFileSync("src/components/rose/HowRoseWorks.tsx", "utf8");
const flat = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

const STEP_TITLES = ["You read a page", "You ask in the dock", "Rose reads the site", "She answers with sources", "A source opens the passage"];

describe("The figure and its reading order", () => {
  it("is a figure labelled for screen readers, with the caption under it", () => {
    render(<HowRoseWorks />);
    const figure = screen.getByRole("figure", { name: "How Rose works, a loop of five steps around the site's text" });
    const caption = figure.querySelector("figcaption") as HTMLElement;
    expect(caption.textContent).toBe("How Rose works. Solid lines are built; dashed lines are design.");
    expect(figure.lastElementChild).toBe(caption);
  });

  it("reads in order: the two rules, the centre, then steps 01 to 05", () => {
    const { container } = render(<HowRoseWorks />);
    const text = flat(container.textContent);
    const marks = [
      "Tested before every release", "Each change runs on fixed questions. A critical failure blocks it.",
      "Questions kept 90 days", "Contact details are masked before they are stored.",
      "The site's text", "Case studies, Field Notes, CV. The same text AI agents read through the MCP server.",
      ...STEP_TITLES,
    ];
    let from = 0;
    for (const m of marks) {
      const at = text.indexOf(m, from);
      expect(at, m).toBeGreaterThanOrEqual(from);
      from = at + m.length;
    }
  });

  it("has the five steps as an ordered list, with the board's text", () => {
    render(<HowRoseWorks />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(5);
    items.forEach((li, i) => {
      expect(li.textContent).toContain(STEP_TITLES[i]);
      expect(li.textContent).toContain(H.steps[i].text);
    });
    expect(items[2].textContent).toContain("A language model, under rules Ivan wrote: answer from the pages, cite them.");
  });

  it("gives the Next tags to step 04 only, as two separate tags", () => {
    render(<HowRoseWorks />);
    const items = screen.getAllByRole("listitem");
    expect(items[3].textContent).toContain("Next: relations");
    expect(items[3].textContent).toContain("Next: diagrams");
    items.filter((_, i) => i !== 3).forEach((li) => expect(li.textContent).not.toContain("Next:"));
    expect(screen.getAllByText(/^Next: /)).toHaveLength(2);
  });

  it("marks step 05 with the highlight colour of the passage-cited mark", () => {
    const { container } = render(<HowRoseWorks />);
    const items = [...container.querySelectorAll("li")];
    expect(items.map((li) => li.hasAttribute("data-highlight"))).toEqual([false, false, false, false, true]);
    const index = readFileSync("src/index.css", "utf8");
    expect(index).toContain('[data-passage-cited="on"] { background-color: hsl(var(--rose-copper) / 0.22); }');
    expect(css).toContain("--hrw-highlight: hsl(var(--rose-copper) / 0.22);");
  });
});

describe("Labels have no box, and 05 wears the passage-cited colour", () => {
  it("gives the step labels and the centre no background of their own", () => {
    const inside = css.slice(css.indexOf("@container"));
    expect(inside).toMatch(/\.hrw-step \{[^}]*background: none/);
    expect(inside).toMatch(/\.hrw-centre \{[^}]*background: transparent/);
    expect(css.slice(0, css.indexOf("@container"))).not.toMatch(/\.hrw-centre \{[^}]*background/);
  });

  it("keeps every label outside the dashed circle (r 290 around 500, 410)", () => {
    const src = source.slice(source.indexOf("const STEP_AT"), source.indexOf("] as const;"));
    const rows = [...src.matchAll(/side: "(\w)", x: (\d+), y: (\d+), w: (\d+)/g)];
    expect(rows).toHaveLength(5);
    for (const [, side, x, y, w] of rows) {
      if (side === "c") continue; // top label, 50px above the circle
      const near = side === "r" ? +x : +x + +w; // the label edge that faces the circle
      for (let yy = +y; yy <= +y + 115; yy += 5) {
        const dy = yy - 410;
        const half = Math.sqrt(Math.max(0, 290 * 290 - dy * dy));
        const edge = side === "r" ? 500 + half : 500 - half;
        expect(side === "r" ? near - edge : edge - near, `${side} ${x},${y} at y ${yy}`).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it("fills disc 05 with the page surface, then the exact passage-cited colour, in both themes", () => {
    const { container } = render(<HowRoseWorks />);
    const discs = [...container.querySelectorAll('svg.hrw-bg circle[r="24"]')];
    expect(discs).toHaveLength(6);
    expect(discs[4].getAttribute("class")).toContain("hrw-fill-surface");
    expect(discs[5].getAttribute("class")).toContain("hrw-fill-highlight");
    expect(css).toContain(".hrw-fill-surface { fill: hsl(var(--surface)); }");
    expect(css).toContain(".hrw-fill-highlight { fill: var(--hrw-highlight); }");
    expect(css).not.toMatch(/\[data-mood="dusk"\] \.hrw \{[^}]*--hrw-highlight/); // one value for Day and Night
  });
});

describe("The SVG draws and says nothing", () => {
  it("has no text inside any SVG, and the drawing is aria-hidden", () => {
    const { container } = render(<HowRoseWorks />);
    const drawing = container.querySelector("svg.hrw-bg") as SVGElement;
    expect(drawing.getAttribute("aria-hidden")).toBe("true");
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg.querySelectorAll("text, tspan, title, desc")).toHaveLength(0);
      expect(svg.textContent).toBe("");
      expect(svg.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("draws the board's geometry: dashed circle r 290, ring r 240, disc r 128, five discs r 24, five chevrons", () => {
    const { container } = render(<HowRoseWorks />);
    const drawing = container.querySelector("svg.hrw-bg") as SVGElement;
    const radii = [...drawing.querySelectorAll("circle")].map((c) => c.getAttribute("r"));
    expect(radii.filter((r) => r === "290")).toHaveLength(1);
    expect(radii.filter((r) => r === "240")).toHaveLength(2); // band and line
    expect(radii.filter((r) => r === "128")).toHaveLength(1);
    expect(radii.filter((r) => r === "24")).toHaveLength(6); // five discs and the highlight on 05
    expect(drawing.querySelectorAll("polyline")).toHaveLength(5);
    expect(drawing.querySelector('circle[r="290"]')?.getAttribute("stroke-dasharray")).toBe("4 6");
  });
});

describe("List layout under 1000px of room", () => {
  it("switches on a container query of 1000px, not on the viewport", () => {
    expect(css).toContain("container: hrw / inline-size;");
    expect(css).toContain("@container hrw (min-width: 1000px)");
    expect(css).not.toMatch(/@media/);
    expect(source).not.toMatch(/matchMedia|innerWidth|useMediaQuery/);
  });

  it("is the default: a column in reading order, no fixed width, the figure only inside the query", () => {
    const outside = css.slice(0, css.indexOf("@container"));
    expect(outside).toContain(".hrw-fig { display: flex; flex-direction: column;");
    expect(outside).not.toMatch(/width: 1000px|position: absolute/);
    const inside = css.slice(css.indexOf("@container"));
    expect(inside).toContain("width: 1000px; height: 820px;");
  });

  it("shows 'At the centre:' before the title in the list, and each step has its number in a circle", () => {
    const { container } = render(<HowRoseWorks />);
    expect(container.querySelector(".hrw-pre")?.textContent).toBe("At the centre: ");
    expect(css.slice(css.indexOf("@container"))).toContain(".hrw-pre { display: none; }");
    const nums = [...container.querySelectorAll("li .hrw-num")];
    expect(nums.map((n) => n.textContent)).toEqual(["01", "02", "03", "04", "05"]);
    nums.forEach((n) => expect(n.getAttribute("aria-hidden")).toBe("true"));
    const outside = css.slice(0, css.indexOf("@container"));
    expect(outside).toContain("border-radius: 9999px");
  });

  it("aligns the Next tags of step 04 left in the list; right only in the figure", () => {
    const outside = css.slice(0, css.indexOf("@container"));
    const inside = css.slice(css.indexOf("@container"));
    expect(outside).toMatch(/\.hrw-tags \{[^}]*justify-content: flex-start/);
    expect(inside).toMatch(/\[data-side="l"\] \.hrw-tags \{ justify-content: flex-end; \}/);
  });

  it("never scrolls sideways: no overflow-x, no min-width on the list", () => {
    const outside = css.slice(0, css.indexOf("@container"));
    expect(outside).not.toMatch(/overflow|min-width|width: [0-9]{3,}px/);
  });
});

describe("In chapter 06 and in the mirror", () => {
  it("sits in chapter 06, after the demo and the passage questions", () => {
    render(<MemoryRouter><RoseCaseStudy reduced={false} /></MemoryRouter>);
    const figure = screen.getByRole("figure", { name: /How Rose works/ });
    const six = document.getElementById("ch-06") as HTMLElement;
    expect(six.contains(figure)).toBe(true);
    const lastQuestion = screen.getByText("Draw how it works");
    expect(lastQuestion.compareDocumentPosition(figure) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("the Markdown mirror has the two rules, the centre and the five steps, in order", () => {
    const md = renderRoseMirror("2026-11-13");
    let from = md.indexOf("**Tested before every release**");
    expect(from).toBeGreaterThan(-1);
    const steps = STEP_TITLES.map((t, i) => `${i + 1}. **${t}**`);
    const marks = ["**Questions kept 90 days**", "**The site's text**", ...steps.slice(0, 4), "Next: relations", "Next: diagrams", steps[4], H.caption];
    for (const m of marks) {
      const at = md.indexOf(m, from);
      expect(at, m).toBeGreaterThan(from - 1);
      from = at;
    }
    // Next tags only under step 04.
    const loop = md.slice(md.indexOf("**Tested before every release**"), md.indexOf(H.caption));
    expect(loop.split("Next: ")).toHaveLength(3);
    expect(readFileSync("public/rose-design-lab.md", "utf8")).toContain("1. **You read a page**");
  });

  it("the copy deck carries the loop and no longer lists the old nodes", () => {
    const deck = readFileSync("docs/rose-case-study-copy-v2.md", "utf8");
    for (const m of [...STEP_TITLES, "Tested before every release", "Questions kept 90 days", H.centre.text]) expect(deck).toContain(m);
    expect(deck).not.toContain("Reader context (page, section in view, marked passage)");
  });
});
