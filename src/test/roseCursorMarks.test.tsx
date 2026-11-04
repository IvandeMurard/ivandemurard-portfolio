import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RoseCue, RoseMark, RosePassage, locatePassage } from "@/components/rose/RoseKinetic";
import { GOT_WRONG, MILESTONES, RoseCaseStudy } from "@/components/rose/RoseCaseStudy";

// Deck v2: the copper tip moves to the passage, one note at a time, and leaves when the reader moves on.
// Marks, one meaning each: underline = the decision, strike = the first brief, circle = a figure and its
// comparison (chapter 08 cost), highlight = the passage Rose cited. Mobile, reduced motion and screen readers
// get the note inline, with no motion and no mark.

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

const scroll = vi.fn();
beforeEach(() => {
  observers = [];
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  Element.prototype.scrollIntoView = scroll;
  scroll.mockClear();
  vi.useFakeTimers();
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); setEnv({ desktop: false, reduced: false }); });

const noteOpacity = (text: string) => (screen.getByText(text) as HTMLElement).style.opacity;
const struck = (text: string) => (screen.getByText(text) as HTMLElement).style.textDecorationLine === "line-through";

const Passage = () => (
  <>
    <p><RoseMark kind="strike" cue="a" desktopOnly>Brief A</RoseMark></p>
    <p><RoseMark cue="a" desktopOnly>Decision A</RoseMark></p>
    <p><RoseMark kind="circle" cue="a" desktopOnly>Figure A</RoseMark></p>
    <RoseCue id="a" note="Note A." />
    <RoseCue id="b" note="Note B." />
  </>
);
const underlined = (text: string) => (screen.getByText(text) as HTMLElement).style.backgroundSize.startsWith("100%");
// The mark's SVG stretches to its text (preserveAspectRatio); the compass tip beside a note does not.
const hasCircle = () => document.querySelector("svg[preserveAspectRatio] path") !== null;

describe("Rose's cursor: one note at a time", () => {
  it("shows a note when its passage is reached, and takes it away when the reader moves on", () => {
    setEnv({ desktop: true, reduced: false });
    render(<Passage />);
    expect(noteOpacity("Note A.")).toBe("0");
    reach("a");
    expect(noteOpacity("Note A.")).toBe("1");
    expect(noteOpacity("Note B.")).toBe("0");
    reach("b");
    expect(noteOpacity("Note A.")).toBe("0");
    expect(noteOpacity("Note B.")).toBe("1");
    reach("b", false);
    expect(noteOpacity("Note B.")).toBe("0");
  });

  it("draws a mark only while its cue is active: strike the brief, underline the decision, circle the figure", () => {
    setEnv({ desktop: true, reduced: false });
    render(<Passage />);
    expect(struck("Brief A")).toBe(false);
    expect(underlined("Decision A")).toBe(false);
    reach("a");
    expect(struck("Brief A")).toBe(true);
    expect(underlined("Decision A")).toBe(true);
    expect(hasCircle()).toBe(true);
    reach("b"); // Rose moves on: the marks leave with the note
    expect(struck("Brief A")).toBe(false);
    expect(underlined("Decision A")).toBe(false);
  });

  it("never hides the note from a screen reader", () => {
    setEnv({ desktop: true, reduced: false });
    render(<Passage />);
    expect(screen.getAllByRole("note", { name: "Rose" })).toHaveLength(2);
    expect(screen.getByText("Note A.").closest('[aria-hidden="true"]')).toBeNull();
  });
});

describe.each([["reduced motion", { desktop: true, reduced: true }], ["mobile", { desktop: false, reduced: false }]] as const)("%s: the note is inline and no mark is drawn", (_name, env) => {
  it("shows every note without any cue, in roman and with no motion", () => {
    setEnv(env);
    render(<Passage />);
    expect(noteOpacity("Note A.")).toBe("1");
    expect(noteOpacity("Note B.")).toBe("1");
    expect((screen.getByText("Note A.") as HTMLElement).className).not.toContain("italic");
    expect((screen.getByText("Note A.") as HTMLElement).style.transition).toBe("none");
  });

  it("draws no mark, even when the cue is reached", () => {
    setEnv(env);
    render(<Passage />);
    reach("a");
    expect(struck("Brief A")).toBe(false);
    expect(underlined("Decision A")).toBe(false);
    expect(hasCircle()).toBe(false);
  });
});

describe("Highlight: the passage Rose cited", () => {
  const Target = () => <p id="p"><RosePassage id="p">The decision.</RosePassage></p>;
  const highlighted = () => document.querySelector("[data-rose-passage]")?.getAttribute("data-highlighted");

  it("Locate scrolls to the passage and highlights it for a moment", () => {
    setEnv({ desktop: true, reduced: false });
    render(<Target />);
    act(() => locatePassage("p"));
    expect(scroll).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
    expect(highlighted()).toBe("false");
    act(() => { vi.advanceTimersByTime(700); });
    expect(highlighted()).toBe("true");
    act(() => { vi.advanceTimersByTime(3000); });
    expect(highlighted()).toBe("false");
  });

  it.each([["reduced motion", { desktop: true, reduced: true }], ["mobile", { desktop: false, reduced: false }]] as const)("%s: Locate only scrolls, with no highlight", (_n, env) => {
    setEnv(env);
    render(<Target />);
    act(() => locatePassage("p"));
    expect(scroll).toHaveBeenCalledWith({ behavior: "auto", block: "center" });
    act(() => { vi.advanceTimersByTime(6000); });
    expect(highlighted()).toBe("false");
  });
});

describe("On the case study page", () => {
  const page = (env: Env) => {
    setEnv(env);
    return render(<MemoryRouter><RoseCaseStudy reduced={env.reduced} /></MemoryRouter>);
  };

  it("circles the cost figure, as one mark of chapter 08, and no longer underlines case 2", () => {
    page({ desktop: true, reduced: false });
    const figure = screen.getByText(GOT_WRONG.cost.figure);
    expect(figure.querySelector("svg path")).not.toBeNull();
    expect(GOT_WRONG.cost.text).toContain(GOT_WRONG.cost.figure);
    const said = screen.getByText(GOT_WRONG.cases[1].said);
    expect(said.className).not.toContain("box-decoration-clone");
    expect(said.querySelector("span")).toBeNull();
  });

  it("strikes the first brief while the decision that replaced it is underlined", () => {
    page({ desktop: true, reduced: false });
    const m = MILESTONES["ch-01"];
    const brief = screen.getByText(m.brief) as HTMLElement;
    const decision = screen.getByText(m.decision) as HTMLElement;
    expect(brief.style.textDecorationLine).toBe("none");
    reach("ch-01");
    expect(brief.style.textDecorationLine).toBe("line-through");
    expect(decision.style.backgroundSize.startsWith("100%")).toBe(true);
    // The decision is a passage Locate can highlight.
    expect(decision.closest("[data-rose-passage]")?.getAttribute("data-rose-passage")).toBe("ch-01-decision");
  });

  it("draws no mark and shows the notes inline under reduced motion", () => {
    page({ desktop: true, reduced: true });
    expect(document.querySelector('[data-rose-cue="ch-01"] p')?.getAttribute("style")).toContain("opacity: 1");
    reach("ch-01");
    expect((screen.getByText(MILESTONES["ch-01"].brief) as HTMLElement).style.textDecorationLine).not.toBe("line-through");
    const cost = screen.getByText(/costs about 0\.015 Lovable credits/);
    expect(cost.textContent).toContain(GOT_WRONG.cost.figure);
    expect(cost.querySelector("svg")).toBeNull();
  });
});
