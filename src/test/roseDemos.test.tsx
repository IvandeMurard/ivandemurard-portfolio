import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import type { ReactNode } from "react";
import { AnswerFormats, HeroDock, TestLoop } from "@/components/rose/RoseDemos";
import { CONNECT_LINKS, DESIGN_CAPTION, DESIGN_EXCHANGES, EVALUATION_URL, HERO_EXCHANGES, PASSAGE_QUESTIONS, SKETCH_STEPS } from "@/components/rose/roseDemoData";
import { GOT_WRONG, REPO_URL } from "@/components/rose/RoseCaseStudy";

// Copy deck v2 is the source of the words; the prototype source gives the lines the deck leaves to it
// (the page each exchange reads, its source line) and the test loop.
const norm = (x: string) => x.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
const deck = norm(readFileSync("docs/rose-case-study-copy-v2.md", "utf8"));
const prototype = norm(readFileSync("docs/rose-prototype/source/Rose.dc.html", "utf8"));

const inRouter = (node: ReactNode) => render(<MemoryRouter>{node}</MemoryRouter>);
/** Advance the loop by whole ticks of 900 ms. */
const ticks = (n: number) => act(() => { vi.advanceTimersByTime(900 * n); });

beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("Hero demo: three built exchanges in a loop", () => {
  it("uses the words of the deck, and the reading and source lines of the prototype", () => {
    expect(HERO_EXCHANGES.map((e) => e.q)).toEqual(["Say it more simply.", "Is Aetherix in production?", "What has Ivan built?"]);
    for (const e of HERO_EXCHANGES) {
      expect(deck, e.q).toContain(norm(e.q));
      expect(deck, e.a).toContain(norm(e.a));
      expect(prototype, e.where).toContain(e.where);
      expect(prototype, e.src).toContain(e.src);
    }
    expect(deck).toContain("Source: chapter 03");
    expect(HERO_EXCHANGES[1].link).toEqual({ label: "Aetherix, the case study", to: "/aetherix" });
    expect(HERO_EXCHANGES[2].chips).toEqual(["What happens when it's wrong?", "Which ones are live?"]);
    for (const c of HERO_EXCHANGES[2].chips ?? []) expect(deck, c).toContain(c);
  });

  it("plays the three exchanges in turn, then starts again", () => {
    inRouter(<HeroDock reduced={false} />);
    expect(screen.getByText("Say it more simply.")).toBeTruthy();
    expect(screen.queryByText(/I also receive the page/)).toBeNull();
    ticks(1); // reading
    expect(screen.getByText("Rose is reading the page…")).toBeTruthy();
    ticks(1); // answer
    expect(screen.getByText(/I also receive the page you are on/)).toBeTruthy();
    expect(screen.getByText("Source: chapter 03")).toBeTruthy();
    expect(screen.getByText("Reading: /rose · 03 · Know where you are")).toBeTruthy();

    ticks(9); // second exchange, answer shown
    expect(screen.getByText("Is Aetherix in production?")).toBeTruthy();
    const caseLink = screen.getByRole("link", { name: /Aetherix, the case study/ });
    expect(caseLink.getAttribute("href")).toBe("/aetherix");
    // It stays on the site, so it does not carry the arrow of a link that leaves it.
    expect(caseLink.textContent).not.toContain("↗");
    expect(screen.getByText("Source: /aetherix, status")).toBeTruthy();

    ticks(9); // third exchange, answer shown
    expect(screen.getByText("What has Ivan built?")).toBeTruthy();
    const chips = screen.getByRole("list", { name: "Suggested questions" });
    expect(chips.textContent).toContain("What happens when it's wrong?");
    expect(chips.textContent).toContain("Which ones are live?");
    expect(screen.getByText("Source: case studies, /journeys")).toBeTruthy();

    ticks(9); // back to the first
    expect(screen.getByText("Say it more simply.")).toBeTruthy();
  });

  it("carries no Design marker: every exchange is a built behaviour", () => {
    inRouter(<HeroDock reduced={false} />);
    for (let i = 0; i < 3; i++) { ticks(3); expect(document.body.textContent).not.toMatch(/Design|○/); ticks(6); }
  });

  it("is blue in Night with an existing navy token, and adds no colour", () => {
    inRouter(<HeroDock reduced={false} />);
    const panel = document.querySelector("[data-rose-hero]") as HTMLElement;
    expect(panel.className).toContain("bg-primary");
    expect(panel.className).toContain("[[data-mood=dusk]_&]:bg-inverse-primary");
    expect(panel.className).not.toContain("surface-container");
    expect(panel.outerHTML).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(/i);
  });

  it("under reduced motion shows the first exchange complete and never loops", () => {
    inRouter(<HeroDock reduced />);
    expect(screen.getByText(/I also receive the page you are on/)).toBeTruthy();
    expect(screen.getByText("Source: chapter 03")).toBeTruthy();
    ticks(60);
    expect(screen.getByText("Say it more simply.")).toBeTruthy();
    expect(screen.queryByText("Is Aetherix in production?")).toBeNull();
  });

  it("opens the real dock from the input", () => {
    const opened = vi.fn();
    window.addEventListener("rose:open", opened);
    inRouter(<HeroDock reduced />);
    act(() => { screen.getByRole("button", { name: "Ask Rose anything" }).click(); });
    expect(opened).toHaveBeenCalledTimes(1);
    window.removeEventListener("rose:open", opened);
  });
});

describe("Chapter 06 demo: Reformulate (built), then Locate, Connect and Sketch (design)", () => {
  const header = (text: string) => screen.getByText(text);
  const question = (format: string) => screen.getByRole("button", { name: new RegExp(`${format} `) });

  it("uses the deck's questions, answers and caption", () => {
    expect(DESIGN_EXCHANGES.map((e) => [e.format, e.mark])).toEqual([["Reformulate", "Built"], ["Locate", "Design"], ["Connect", "Design"], ["Sketch", "Design"]]);
    // The caption is Ivan's wording of 4 Nov, set in review: it is in neither the deck nor the prototype.
    expect(DESIGN_CAPTION).toBe("These formats are in design. Live Rose answers in text only.");
    expect(DESIGN_EXCHANGES[0].q).toBe("Say it more simply.");
    expect(DESIGN_EXCHANGES[0].a).toBe("When you ask me something, I also receive the page you are on, so I answer about what you are reading rather than about Ivan in general.");
    for (const e of DESIGN_EXCHANGES.filter((x) => x.format !== "Connect")) {
      expect(deck, e.q).toContain(e.q.replace(/\.$/, ""));
      expect(deck, e.a).toContain(e.a);
    }
    expect(deck).toContain("How does this relate to his other work?");
  });

  it("marks Reformulate ● Built and the others ○ Design in the header, and plays them in this order", () => {
    inRouter(<AnswerFormats reduced={false} />);
    ticks(2);
    expect(header("● Built · Reformulate")).toBeTruthy();
    expect(screen.getByText(/rather than about Ivan in general/)).toBeTruthy();
    expect(screen.getByText(DESIGN_CAPTION)).toBeTruthy();

    ticks(9);
    expect(header("○ Design · Locate")).toBeTruthy();
    expect(screen.getByText(/Ivan made this call on 10 August/)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Locate, show me/ })).toBeTruthy();
    ticks(9);
    expect(header("○ Design · Connect")).toBeTruthy();
    ticks(9);
    expect(header("○ Design · Sketch")).toBeTruthy();
    ticks(9);
    expect(header("● Built · Reformulate")).toBeTruthy(); // and round again
  });

  it("lists the two decided relations in Connect, as links", () => {
    expect(CONNECT_LINKS.map((l) => [l.kind, l.text])).toEqual([["how she is tested", "The evaluation"], ["uses the method of", "Harnesses, graders and closed loops"]]);
    // The kinds are the labels of the relations decided on 3 Nov.
    for (const l of CONNECT_LINKS) expect(deck, l.kind).toContain(l.kind);
    expect(EVALUATION_URL).toBe(`${REPO_URL}/blob/main/${GOT_WRONG.evalDoc}`);
    const connect = DESIGN_EXCHANGES.find((e) => e.format === "Connect");
    expect(connect?.q).toBe("How does this relate to his other work?");
    expect(connect?.a).toBe("Two links, each with the reason Ivan wrote for it: the evaluation page, which shows how every change to me is tested, and the Field Note whose method that evaluation applies.");
    inRouter(<AnswerFormats reduced={false} />);
    ticks(2 * 9 + 2);
    expect(screen.getByText(/the evaluation page, which shows how every change to me is tested/)).toBeTruthy();
    expect(screen.getByRole("link", { name: /^The evaluation/ }).getAttribute("href")).toBe(EVALUATION_URL);
    expect(screen.getByRole("link", { name: "Harnesses, graders and closed loops" }).getAttribute("href")).toBe("/journal/harnesses-graders-closed-loops");
  });

  it("draws the Sketch answer as page, section, passage, answer", () => {
    expect(SKETCH_STEPS).toEqual(["Page", "Section in view", "Marked passage", "Answer"]);
    inRouter(<AnswerFormats reduced={false} />);
    ticks(3 * 9 + 2);
    const steps = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(steps.filter((t) => SKETCH_STEPS.some((st) => t?.replace("→", "") === st)).map((t) => t?.replace("→", ""))).toEqual([...SKETCH_STEPS]);
  });

  it("shows the first exchange complete under reduced motion", () => {
    inRouter(<AnswerFormats reduced />);
    expect(header("● Built · Reformulate")).toBeTruthy();
    expect(screen.getByText(/rather than about Ivan in general/)).toBeTruthy();
    ticks(60);
    expect(screen.queryByText("○ Design · Locate")).toBeNull();
  });

  describe("the four passage questions", () => {
    it("are buttons with their markers: Reformulate built, the others in design", () => {
      expect(PASSAGE_QUESTIONS.map((p) => [p.format, p.mark])).toEqual([["Locate", "Design"], ["Reformulate", "Built"], ["Connect", "Design"], ["Sketch", "Design"]]);
      inRouter(<AnswerFormats reduced={false} />);
      const list = within(screen.getByRole("list", { name: "The four passage questions" }));
      const buttons = list.getAllByRole("button");
      expect(buttons).toHaveLength(4);
      expect(buttons[1].textContent).toContain("●");
      expect(buttons[1].textContent).toContain("Built: Reformulate");
      for (const i of [0, 2, 3]) { expect(buttons[i].textContent).toContain("○"); expect(buttons[i].textContent).toContain("Design: "); }
      for (const p of PASSAGE_QUESTIONS) expect(deck, p.q).toContain(p.q);
    });

    it("highlight the running exchange with aria-current, and follow the loop", () => {
      inRouter(<AnswerFormats reduced={false} />);
      const current = () => within(screen.getByRole("list", { name: "The four passage questions" })).getAllByRole("button").filter((b) => b.getAttribute("aria-current") === "true").map((b) => b.textContent);
      expect(current()).toHaveLength(1);
      expect(current()[0]).toContain("Reformulate");
      ticks(9);
      expect(current()).toHaveLength(1);
      expect(current()[0]).toContain("Locate");
      ticks(9);
      expect(current()[0]).toContain("Connect");
    });

    it("on click show that exchange complete and pause the loop, so the button reads Play", () => {
      inRouter(<AnswerFormats reduced={false} />);
      expect(screen.getByRole("button", { name: "Pause" })).toBeTruthy();
      act(() => { question("Sketch").click(); });
      expect(header("○ Design · Sketch")).toBeTruthy();
      expect(screen.getByText("Page, then section in view, then marked passage, then answer.")).toBeTruthy();
      expect(question("Sketch").getAttribute("aria-current")).toBe("true");
      expect(screen.getByRole("button", { name: "Play" })).toBeTruthy();
      ticks(100); // the loop is stopped
      expect(header("○ Design · Sketch")).toBeTruthy();
      act(() => { question("Reformulate").click(); });
      expect(header("● Built · Reformulate")).toBeTruthy();
      expect(question("Reformulate").getAttribute("aria-current")).toBe("true");
      // Play resumes from there.
      act(() => { screen.getByRole("button", { name: "Play" }).click(); });
      ticks(12);
      expect(header("○ Design · Locate")).toBeTruthy();
    });

    it("control the demo only: they never ask or open Rose, and make no request", () => {
      const fetchMock = vi.fn(async (_url: string) => new Response("{}"));
      vi.stubGlobal("fetch", fetchMock);
      const events = vi.fn();
      window.addEventListener("rose:ask", events);
      window.addEventListener("rose:open", events);
      inRouter(<AnswerFormats reduced={false} />);
      for (const f of ["Locate", "Reformulate", "Connect", "Sketch"]) act(() => { question(f).click(); });
      expect(events).not.toHaveBeenCalled();
      expect(fetchMock).not.toHaveBeenCalled();
      window.removeEventListener("rose:ask", events);
      window.removeEventListener("rose:open", events);
    });

    it("also work under reduced motion, where there is no loop and no Pause button", () => {
      inRouter(<AnswerFormats reduced />);
      expect(screen.queryByRole("button", { name: /^(Pause|Play)$/ })).toBeNull();
      act(() => { question("Connect").click(); });
      expect(header("○ Design · Connect")).toBeTruthy();
      expect(screen.getByText(/the evaluation page, which shows how every change to me is tested/)).toBeTruthy();
      expect(question("Connect").getAttribute("aria-current")).toBe("true");
    });
  });
});

describe("Chapter 08: how a case is judged", () => {
  it("has the seven steps of the loop and its caption, as in the prototype", () => {
    expect(GOT_WRONG.loop).toHaveLength(7);
    expect(GOT_WRONG.loop[0]).toBe("Write cases before the run");
    expect(GOT_WRONG.loop[4]).toBe("Pass? If not, back to 2");
    for (const step of GOT_WRONG.loop) expect(prototype, step).toContain(step);
    expect(prototype).toContain(GOT_WRONG.loopCaption);
  });

  it("renders the steps in order, numbered 1 to 7, with the caption", () => {
    inRouter(<TestLoop steps={GOT_WRONG.loop} caption={GOT_WRONG.loopCaption} />);
    const items = screen.getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(GOT_WRONG.loop.map((t, i) => `${i + 1}${t}`));
    expect(screen.getByText(GOT_WRONG.loopCaption)).toBeTruthy();
  });
});

describe("Pause and Play (WCAG 2.2.2)", () => {
  const button = () => screen.getByRole("button", { name: /^(Pause|Play)$/ }) as HTMLButtonElement;

  for (const [name, node] of [["hero demo", <HeroDock key="h" reduced={false} />], ["chapter 06 demo", <AnswerFormats key="d" reduced={false} />]] as const) {
    it(`${name}: a real button whose label switches between Pause and Play, with no aria-pressed`, () => {
      inRouter(node);
      expect(button().tagName).toBe("BUTTON");
      expect(button().getAttribute("type")).toBe("button");
      expect(button().textContent).toBe("Pause");
      expect(button().hasAttribute("aria-pressed")).toBe(false);
      act(() => { button().click(); });
      expect(button().textContent).toBe("Play");
      expect(button().hasAttribute("aria-pressed")).toBe(false);
      act(() => { button().click(); });
      expect(button().textContent).toBe("Pause");
      expect(button().hasAttribute("aria-pressed")).toBe(false);
    });

    it(`${name}: Pause stops the loop on the current exchange, shown complete; Play resumes`, () => {
      inRouter(node);
      const firstQuestion = (node.type === HeroDock ? HERO_EXCHANGES[0] : DESIGN_EXCHANGES[0]).q;
      const secondQuestion = (node.type === HeroDock ? HERO_EXCHANGES[1] : DESIGN_EXCHANGES[1]).q;
      // The panel of the demo only: the passage questions below it repeat the questions as buttons.
      const panel = () => within((node.type === HeroDock ? document.querySelector("[data-rose-hero]") : document.querySelector("figure")) as HTMLElement);
      ticks(1); // reading, not yet answered
      act(() => { button().click(); });
      const frozen = document.body.textContent;
      expect(panel().getByText(firstQuestion)).toBeTruthy();
      ticks(100);
      expect(document.body.textContent).toBe(frozen);
      expect(panel().queryByText(secondQuestion)).toBeNull();
      act(() => { button().click(); });
      ticks(12);
      expect(panel().getByText(secondQuestion)).toBeTruthy();
    });
  }

  it("is a keyboard control: a button, so Enter and Space activate it, and it takes focus", () => {
    inRouter(<HeroDock reduced={false} />);
    button().focus();
    expect(document.activeElement).toBe(button());
    expect(button().className).toContain("focus-visible:outline");
  });

  it("is absent under reduced motion, where nothing moves", () => {
    inRouter(<HeroDock reduced />);
    expect(screen.queryByRole("button", { name: /^(Pause|Play)$/ })).toBeNull();
    cleanup();
    inRouter(<AnswerFormats reduced />);
    expect(screen.queryByRole("button", { name: /^(Pause|Play)$/ })).toBeNull();
  });
});
