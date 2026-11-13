import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RoseCue, RoseMark } from "@/components/rose/RoseKinetic";
import { GOT_WRONG, MILESTONES, RoseCaseStudy } from "@/components/rose/RoseCaseStudy";

// Deck v2 and the brief of the cursor branch. Notes are a cursor: when a marked passage enters the reading zone the
// copper tip moves onto its start and the note appears directly under it; one note at a time; it leaves when the
// reader moves on. Below md the note shows under the passage without the tip travelling. Reduced motion: notes are
// always visible inline, no mark is drawn, nothing moves. Screen readers: the note is always in the DOM after its
// passage, role="note" labelled "Rose", never aria-hidden. Marks, one meaning each.

type Env = { desktop: boolean; reduced: boolean };
const setEnv = ({ desktop, reduced }: Env) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reduced : query.includes("min-width: 768px") ? desktop : false,
      media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; },
    }),
  });
};
const DESKTOP: Env = { desktop: true, reduced: false };
const MOBILE: Env = { desktop: false, reduced: false };
const REDUCED: Env = { desktop: true, reduced: true };

/** An IntersectionObserver the test drives: `reach(cue)` plays the cue entering the reading zone. */
type Observer = { callback: (entries: Array<{ isIntersecting: boolean; target: Element }>) => void; targets: Element[] };
let observers: Observer[] = [];
class FakeObserver {
  o: Observer;
  constructor(callback: Observer["callback"]) { this.o = { callback, targets: [] }; observers.push(this.o); }
  observe(el: Element) { this.o.targets.push(el); }
  unobserve() {}
  disconnect() { this.o.targets = []; }
}
const reach = (cue: string, isIntersecting = true) => act(() => {
  for (const o of observers) for (const target of o.targets) if (target.getAttribute("data-rose-cue") === cue) o.callback([{ isIntersecting, target }]);
});

beforeEach(() => { observers = []; vi.stubGlobal("IntersectionObserver", FakeObserver); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); setEnv(MOBILE); });

const note = (text: string) => screen.getByText(text) as HTMLElement;
const opacity = (text: string) => note(text).style.opacity;
const struck = (el: HTMLElement) => el.style.textDecorationLine === "line-through";
const underlined = (el: HTMLElement) => el.style.backgroundSize.startsWith("100%");
// The mark's SVG stretches to its text (preserveAspectRatio); a note carries no SVG of its own.
const hasCircle = () => document.querySelector("svg[preserveAspectRatio] path") !== null;
const tips = () => [...document.querySelectorAll<HTMLElement>("[data-rose-tip]")];

const Passage = () => (
  <>
    <p><RoseMark kind="strike" cue="a" skipWhenReduced>Brief A</RoseMark></p>
    <p id="decision-a"><RoseMark cue="a" skipWhenReduced tip>Decision A</RoseMark></p>
    <RoseCue id="a" note="Note A." className="mt-3" />
    <p><RoseMark kind="circle" cue="b" skipWhenReduced tip>Figure B</RoseMark></p>
    <RoseCue id="b" note="Note B." className="mt-3" />
  </>
);

describe("The cursor: one note at a time, under its passage", () => {
  it("shows a note when its passage is reached and takes it away when the reader moves on", () => {
    setEnv(DESKTOP);
    render(<Passage />);
    expect(opacity("Note A.")).toBe("0");
    reach("a");
    expect(opacity("Note A.")).toBe("1");
    expect(opacity("Note B.")).toBe("0");
    reach("b"); // one active note: A leaves as B arrives
    expect(opacity("Note A.")).toBe("0");
    expect(opacity("Note B.")).toBe("1");
    reach("b", false);
    expect(opacity("Note B.")).toBe("0");
  });

  it("moves the copper tip onto the start of the passage, and it is not a system pointer", () => {
    setEnv(DESKTOP);
    render(<Passage />);
    const decision = document.getElementById("decision-a") as HTMLElement;
    const tip = decision.querySelector<HTMLElement>("[data-rose-tip]");
    expect(tip).not.toBeNull();
    expect(tip?.className).toContain("pointer-events-none");
    expect(tip?.getAttribute("aria-hidden")).toBe("true");
    // The tip sits before the passage text, at its start.
    expect(decision.firstElementChild?.firstElementChild).toBe(tip);
    const needle = () => tip?.querySelector("svg") as SVGElement;
    expect(needle().style.opacity).toBe("0");
    expect(needle().style.transform).toContain("translateX(-28px)"); // waiting off to the left
    reach("a");
    expect(needle().style.opacity).toBe("1");
    expect(needle().style.transform).toContain("translateX(0)"); // arrived on the passage
    // A diamond needle, not an arrow cursor, and no custom pointer is set on the page.
    expect(needle().innerHTML).toContain("M6 0 L8 6 L6 12 L4 6 Z");
    expect(document.documentElement.style.cursor).toBe("");
  });

  it("puts the note after its passage in the DOM, with no margin column", () => {
    setEnv(DESKTOP);
    render(<Passage />);
    const decision = document.getElementById("decision-a") as HTMLElement;
    const cue = document.querySelector('[data-rose-cue="a"]') as HTMLElement;
    expect(decision.compareDocumentPosition(cue) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(cue.className).not.toMatch(/absolute|left-full|xl:/);
  });
});

describe("Screen readers", () => {
  it.each([["desktop, before and after reaching", DESKTOP], ["mobile", MOBILE], ["reduced motion", REDUCED]] as const)("%s: every note is role=note, labelled Rose, never aria-hidden", (_n, env) => {
    setEnv(env);
    render(<Passage />);
    const check = () => {
      const notes = screen.getAllByRole("note", { name: "Note from Rose, written by Ivan" });
      expect(notes).toHaveLength(2);
      for (const text of ["Note A.", "Note B."]) expect(note(text).closest('[aria-hidden="true"]')).toBeNull();
    };
    check(); // not reached
    reach("a");
    check(); // reached
    reach("a", false);
    check(); // left
  });
});

describe("Below md: the note shows under the passage when reached, without the tip travelling", () => {
  it("shows the note only when reached, and draws no tip", () => {
    setEnv(MOBILE);
    render(<Passage />);
    expect(opacity("Note A.")).toBe("0");
    expect(tips()).toHaveLength(0);
    reach("a");
    expect(opacity("Note A.")).toBe("1");
    expect(tips()).toHaveLength(0);
    reach("b");
    expect(opacity("Note A.")).toBe("0");
  });

  it("still draws the marks of the reached cue", () => {
    setEnv(MOBILE);
    render(<Passage />);
    reach("a");
    expect(struck(screen.getByText("Brief A"))).toBe(true);
    expect(underlined(screen.getByText("Decision A"))).toBe(true);
  });
});

describe("Reduced motion: notes always visible, no mark, nothing moves", () => {
  it("shows every note without any cue, in roman, with no transition", () => {
    setEnv(REDUCED);
    render(<Passage />);
    expect(opacity("Note A.")).toBe("1");
    expect(opacity("Note B.")).toBe("1");
    expect(note("Note A.").className).not.toContain("italic");
    const bubble = note("Note A.").parentElement as HTMLElement; // the bubble carries the motion
    expect(bubble.style.transition).toBe("none");
    expect(bubble.style.transform).toBe("none");
  });

  it("draws no mark and no tip, even when the cue is reached", () => {
    setEnv(REDUCED);
    render(<Passage />);
    reach("a");
    reach("b");
    expect(document.querySelector("[data-mark]")).toBeNull();
    expect(hasCircle()).toBe(false);
    expect(tips()).toHaveLength(0);
    expect(screen.getByText("Brief A").getAttribute("style")).toBeNull();
  });
});

describe("Marks, one meaning each", () => {
  it("strike: the first brief is struck through while the decision is underlined, only while its cue is active", () => {
    setEnv(DESKTOP);
    render(<Passage />);
    expect(struck(screen.getByText("Brief A"))).toBe(false);
    expect(underlined(screen.getByText("Decision A"))).toBe(false);
    reach("a");
    expect(struck(screen.getByText("Brief A"))).toBe(true);
    expect(underlined(screen.getByText("Decision A"))).toBe(true);
    reach("b");
    expect(struck(screen.getByText("Brief A"))).toBe(false);
    expect(underlined(screen.getByText("Decision A"))).toBe(false);
  });

  it("circle: drawn around its figure while its cue is active", () => {
    setEnv(DESKTOP);
    render(<Passage />);
    expect(document.querySelector("[data-mark=\"circle\"] svg[preserveAspectRatio] path")?.getAttribute("style")).toContain("stroke-dashoffset: 1");
    reach("b");
    expect(document.querySelector("[data-mark=\"circle\"] svg[preserveAspectRatio] path")?.getAttribute("style")).toContain("stroke-dashoffset: 0");
  });

  it("highlight: the kind exists, is on only when active, and is not drawn with reduced motion", () => {
    setEnv(DESKTOP);
    const { rerender } = render(<RoseMark kind="highlight" active>Cited passage</RoseMark>);
    expect(screen.getByText("Cited passage").getAttribute("data-mark")).toBe("highlight");
    expect(screen.getByText("Cited passage").getAttribute("data-on")).toBe("true");
    rerender(<RoseMark kind="highlight" active={false}>Cited passage</RoseMark>);
    expect(screen.getByText("Cited passage").getAttribute("data-on")).toBe("false");
    setEnv(REDUCED);
    rerender(<RoseMark kind="highlight" active skipWhenReduced>Cited passage</RoseMark>);
    expect(document.querySelector('[data-mark="highlight"]')).toBeNull();
  });
});

describe("On the case study page", () => {
  const page = (env: Env) => {
    setEnv(env);
    return render(<MemoryRouter><RoseCaseStudy reduced={env.reduced} /></MemoryRouter>);
  };

  it("has no margin column at any width", () => {
    page(DESKTOP);
    for (const cue of document.querySelectorAll('[data-rose-cue]')) expect((cue as HTMLElement).className).not.toMatch(/absolute|left-full|xl:/);
    expect(document.querySelector(".xl\\:left-full")).toBeNull();
  });

  it("strikes The brief while the decision is underlined and carries the tip, chapters 01 to 05", () => {
    page(DESKTOP);
    for (const id of ["ch-01", "ch-02", "ch-03", "ch-04", "ch-05"]) {
      const m = MILESTONES[id];
      const brief = screen.getByText(m.brief) as HTMLElement;
      const decision = screen.getByText(m.decision) as HTMLElement;
      expect(struck(brief)).toBe(false);
      reach(id);
      expect(struck(brief)).toBe(true);
      expect(underlined(decision)).toBe(true);
      expect(decision.querySelector("[data-rose-tip]")).not.toBeNull();
    }
  });

  it("chapter 08: the cue is the cost figure, circled, and the note follows the Cost block", () => {
    page(DESKTOP);
    const figure = screen.getByText(GOT_WRONG.cost.figure);
    expect(figure.getAttribute("data-mark")).toBe("circle");
    expect(figure.querySelector("[data-rose-tip]")).not.toBeNull();
    const cost = screen.getByText(/costs about/);
    const source = screen.getByText(/Lovable AI gateway logs/);
    const cue = document.querySelector('[data-rose-cue="ch-08"]') as HTMLElement;
    expect(cue.querySelector("p")?.textContent).toBe(GOT_WRONG.note);
    expect(cost.compareDocumentPosition(cue) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(source.compareDocumentPosition(cue) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // Case 2's "She said" text carries no mark any more.
    const said = screen.getByText(GOT_WRONG.cases[1].said);
    expect(said.closest("[data-mark]")).toBeNull();
    reach("ch-08");
    expect(figure.querySelector("svg[preserveAspectRatio] path")?.getAttribute("style")).toContain("stroke-dashoffset: 0");
  });

  it("does not use the highlight mark on the page yet", () => {
    page(DESKTOP);
    expect(document.querySelector('[data-mark="highlight"]')).toBeNull();
  });

  it("with reduced motion shows the notes and draws no mark", () => {
    page(REDUCED);
    expect(document.querySelector('[data-rose-cue="ch-01"] p')?.getAttribute("style")).toContain("opacity: 1");
    reach("ch-01");
    reach("ch-08");
    expect(document.querySelector("[data-mark]")).toBeNull();
    expect(tips()).toHaveLength(0);
  });
});

describe("Circle: sized from the marked span's own box", () => {
  const wrapper = () => document.querySelector('[data-mark="circle"]') as HTMLElement;

  it("the svg is a child of the span's relative wrapper, inset by a few px on each side", () => {
    setEnv(DESKTOP);
    render(<Passage />);
    const svg = wrapper().querySelector(":scope > svg") as SVGElement;
    expect(svg).not.toBeNull();
    expect(svg.parentElement).toBe(wrapper());
    expect(wrapper().className).toContain("relative");
    expect(wrapper().className).toContain("inline-block");
    const style = svg.getAttribute("style") ?? "";
    expect(style).toContain("left: -7px");
    expect(style).toContain("top: -3px");
    expect(style).toContain("width: calc(100% + 14px)");
    expect(style).toContain("height: calc(100% + 6px)");
  });

  it("draws in the pixels of that box: the viewBox is the span's size plus the padding, so nothing is stretched", () => {
    setEnv(DESKTOP);
    const width = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(154);
    const height = vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(24);
    render(<Passage />);
    const svg = wrapper().querySelector(":scope > svg") as SVGElement;
    expect(svg.getAttribute("viewBox")).toBe("0 0 168 30"); // 154 + 2 x 7, 24 + 2 x 3
    // Every point of the ellipse lies inside the box.
    const numbers = (svg.querySelector("path")?.getAttribute("d") ?? "").match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
    expect(numbers.length).toBeGreaterThan(20);
    numbers.forEach((n, i) => { expect(n).toBeGreaterThanOrEqual(0); expect(n).toBeLessThanOrEqual(i % 2 === 0 ? 168 : 30); });
    width.mockRestore();
    height.mockRestore();
  });

  it("does not use a non-scaling stroke: with a path length it drew only part of the ellipse", () => {
    setEnv(DESKTOP);
    render(<Passage />);
    const path = wrapper().querySelector(":scope > svg path") as SVGPathElement;
    expect(path.getAttribute("vector-effect")).toBeNull();
    expect(path.outerHTML).toMatch(/pathlength="1"/i);
  });
});

describe("The tip: always in the left margin of the text column", () => {
  const tipOf = (id: string) => document.getElementById(id)?.querySelector("[data-rose-tip]") as HTMLElement;
  // jsdom has no layout: the paragraph (the text column) starts at x = columnLeft, a passage at x = its own left.
  let columnLeft = 100;
  let spyRect: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    columnLeft = 100;
    spyRect = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      const left = this.tagName === "P" ? columnLeft : this.getAttribute("data-mark") && this.parentElement?.id === "inline" ? columnLeft + 160 : columnLeft;
      return { left, right: left + 100, top: 0, bottom: 24, width: 100, height: 24, x: left, y: 0, toJSON() {} } as DOMRect;
    });
  });
  afterEach(() => spyRect.mockRestore());

  const Texts = () => (
    <>
      <p id="block"><RoseMark cue="x" skipWhenReduced tip>Starts a block</RoseMark></p>
      <p id="inline">Text before the passage, <RoseMark cue="y" skipWhenReduced tip>starts mid-line</RoseMark></p>
      <RoseCue id="x" note="Note X." />
      <RoseCue id="y" note="Note Y." />
    </>
  );

  it("is 20 px left of the column for a passage that starts a block, as before", () => {
    setEnv(DESKTOP);
    render(<Texts />);
    expect(tipOf("block").getAttribute("data-tip")).toBe("margin");
    expect(tipOf("block").style.left).toBe("-20px");
  });

  it("is at that same x for a passage that starts mid-line, level with its first line, never over the text", () => {
    setEnv(DESKTOP);
    render(<Texts />);
    const tip = tipOf("inline");
    expect(tip.getAttribute("data-tip")).toBe("margin");
    // The passage is 160 px into the column: the tip is 160 + 20 px to its left, i.e. 20 px left of the column.
    expect(tip.style.left).toBe("-180px");
    const spanLeft = columnLeft + 160;
    const tipRight = spanLeft + parseFloat(tip.style.left) + 12;
    expect(tipRight).toBeLessThanOrEqual(columnLeft - 8);
    // Same horizontal position as the block-start tip, and the same vertical offset (line box of the first line).
    expect(columnLeft + 160 + parseFloat(tip.style.left)).toBe(columnLeft + parseFloat(tipOf("block").style.left));
    expect(tip.style.top).toBe(tipOf("block").style.top);
    expect(tip.className).not.toMatch(/-top-|left-0/);
  });

  it("follows the column when the layout changes", () => {
    setEnv(DESKTOP);
    render(<Texts />);
    expect(tipOf("inline").style.left).toBe("-180px");
    columnLeft = 140; // the passage moves with the column, so the offset is unchanged
    act(() => { window.dispatchEvent(new Event("resize")); });
    expect(tipOf("inline").style.left).toBe("-180px");
    spyRect.mockImplementation(function (this: Element) {
      const left = this.tagName === "P" ? 100 : 400; // the passage starts further in: the tip moves further left
      return { left, right: left + 100, top: 0, bottom: 24, width: 100, height: 24, x: left, y: 0, toJSON() {} } as DOMRect;
    });
    act(() => { window.dispatchEvent(new Event("resize")); });
    expect(tipOf("inline").style.left).toBe("-320px");
  });

  it("is absent below md and with reduced motion", () => {
    setEnv(MOBILE);
    render(<Texts />);
    expect(tips()).toHaveLength(0);
    cleanup();
    setEnv(REDUCED);
    render(<Texts />);
    expect(tips()).toHaveLength(0);
  });

  it("on the case study: the chapter 00 link, the cost figure and the decisions all use the margin placement", () => {
    setEnv(DESKTOP);
    render(<MemoryRouter><RoseCaseStudy reduced={false} /></MemoryRouter>);
    const link = screen.getByText("userose.ai's website agent").closest("[data-mark]") as HTMLElement;
    const placed = [
      link.querySelector("[data-rose-tip]"),
      screen.getByText(GOT_WRONG.cost.figure).querySelector("[data-rose-tip]"),
      ...["ch-01", "ch-02", "ch-03", "ch-04", "ch-05"].map((id) => screen.getByText(MILESTONES[id].decision).querySelector("[data-rose-tip]")),
    ];
    expect(placed).toHaveLength(7);
    for (const tip of placed) {
      expect(tip).not.toBeNull();
      expect(tip?.getAttribute("data-tip")).toBe("margin");
    }
  });
});
