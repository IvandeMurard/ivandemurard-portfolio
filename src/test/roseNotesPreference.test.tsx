import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RoseAside, RoseCue, RoseMark } from "@/components/rose/RoseKinetic";
import { RoseCaseStudy } from "@/components/rose/RoseCaseStudy";
import { RoseDock } from "@/components/rose/RoseDock";
import { resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";
import { ROSE_NOTES_KEY, resetRoseNotesCache, setRoseNotes } from "@/lib/roseNotes";

// Rose's notes: a bubble with her name, a footer on the first note of a page, and one preference (localStorage
// "rose_notes" = "off") that every note, every mark and the dock read.

const NOTE_NAME = "Note from Rose, written by Ivan";
const FOOTER = "Written by Ivan in my voice. My answers in the bar are live.";

const setMedia = (desktop: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true, configurable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? false : query.includes("min-width: 768px") ? desktop : false,
      media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; },
    }),
  });
};

type Observer = { callback: (entries: Array<{ isIntersecting: boolean; target: Element }>) => void; targets: Element[] };
let observers: Observer[] = [];
class FakeObserver {
  o: Observer;
  constructor(callback: Observer["callback"]) { this.o = { callback, targets: [] }; observers.push(this.o); }
  observe(el: Element) { this.o.targets.push(el); }
  unobserve() {}
  disconnect() { this.o.targets = []; }
}
const reach = (cue: string) => act(() => {
  for (const o of observers) for (const target of o.targets) if (target.getAttribute("data-rose-cue") === cue) o.callback([{ isIntersecting: true, target }]);
});

const Page = () => (
  <>
    <p><RoseMark kind="strike" cue="a">Brief A</RoseMark></p>
    <p><RoseMark cue="a" tip>Decision A</RoseMark></p>
    <RoseCue id="a" note="Note A." />
    <p><RoseMark kind="circle" cue="b" tip>Figure B</RoseMark></p>
    <RoseCue id="b" note="Note B." />
  </>
);

const mountDock = () => {
  resetRoseChat("test");
  return <MemoryRouter initialEntries={["/aetherix"]}><RoseDock /></MemoryRouter>;
};
const notes = () => screen.queryAllByRole("note", { name: NOTE_NAME });
const tips = () => document.querySelectorAll("[data-rose-tip]");
const struck = () => (screen.getByText("Brief A") as HTMLElement).style.textDecorationLine === "line-through";
const underlined = () => (screen.getByText("Decision A") as HTMLElement).style.backgroundSize.startsWith("100%");
const circled = () => (screen.getByText("Figure B").querySelector("svg path") as SVGElement).getAttribute("style")?.includes("stroke-dashoffset: 0") ?? false;

beforeEach(() => {
  observers = [];
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  setMedia(true);
  window.localStorage.clear();
  resetRoseNotesCache();
  setRoseOpen(false);
  window.sessionStorage.clear();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); window.localStorage.clear(); resetRoseNotesCache(); });

describe("The note bubble", () => {
  it("renders Rose's name and the text, as a note written by Ivan", () => {
    render(<Page />);
    const first = notes()[0];
    expect(first.textContent).toContain("Rose");
    expect(first.textContent).toContain("Note A.");
    expect(first.getAttribute("aria-label")).toBe(NOTE_NAME);
    expect(first.querySelector("svg")).not.toBeNull(); // the compass mark
    const bubble = first.querySelector("p")?.parentElement as HTMLElement;
    expect(bubble.className).toContain("rounded-[14px]");
    expect(bubble.className).toContain("border-outline-variant");
    expect(bubble.className).toContain("bg-surface-container-lowest");
    expect(first.querySelector("p")?.className).toContain("text-on-surface");
    expect(first.querySelector("p")?.className).not.toContain("rose-copper");
  });

  it("carries the footer on the first note of the page only", () => {
    render(<Page />);
    expect(notes()).toHaveLength(2);
    expect(screen.getAllByText(FOOTER)).toHaveLength(1);
    expect(notes()[0].textContent).toContain(FOOTER);
    expect(notes()[1].textContent).not.toContain(FOOTER);
    expect(screen.getAllByRole("button", { name: "Hide notes" })).toHaveLength(1);
  });
});

describe("Hide notes", () => {
  it("removes every note and every tip, and keeps the marks drawn, fully", () => {
    render(<Page />);
    reach("a");
    expect(tips().length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Hide notes" }));
    expect(notes()).toHaveLength(0);
    expect(screen.queryByText("Note A.")).toBeNull();
    expect(screen.queryByText(FOOTER)).toBeNull();
    expect(tips()).toHaveLength(0);
    expect(struck()).toBe(true);
    expect(underlined()).toBe(true);
    expect(circled()).toBe(true);
    // Still: no transition on a mark.
    expect((screen.getByText("Decision A") as HTMLElement).style.transition).toBe("none");
  });

  it("is remembered in localStorage as \"off\"", () => {
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Hide notes" }));
    expect(window.localStorage.getItem(ROSE_NOTES_KEY)).toBe("off");
  });

  it("the dock button says whether notes are on, reports it with aria-pressed, and restores them", () => {
    render(<><Page />{mountDock()}</>);
    const button = () => screen.getByRole("button", { name: /^Page notes: (on|off)$/ });
    expect(button().textContent).toBe("Page notes: on");
    expect(button().getAttribute("aria-pressed")).toBe("true");
    expect(button().getAttribute("aria-describedby")).toBeTruthy();
    expect(document.getElementById(button().getAttribute("aria-describedby") as string)?.textContent).toBe("Ivan writes the notes on the pages in Rose's voice. Her answers here are live.");
    fireEvent.click(button());
    expect(button().textContent).toBe("Page notes: off");
    expect(button().getAttribute("aria-pressed")).toBe("false");
    expect(notes()).toHaveLength(0);
    fireEvent.click(button());
    expect(button().textContent).toBe("Page notes: on");
    expect(notes()).toHaveLength(2);
    expect(window.localStorage.getItem(ROSE_NOTES_KEY)).toBeNull();
  });

  it("the dock keeps its Privacy link and the Page notes button on one line of text", () => {
    render(mountDock());
    const privacy = screen.getByRole("link", { name: "Privacy" });
    const button = screen.getByRole("button", { name: /^Page notes/ });
    expect(privacy.closest("div")?.contains(button)).toBe(true);
    expect(privacy.closest("div")?.textContent).toContain("Questions are stored for 90 days · Privacy · Page notes: on");
  });
});

describe("Notes off leave no trace in the layout; notes on are always visible", () => {
  it("RoseCue and RoseAside render nothing at all: no wrapper, no height, no margin", () => {
    setRoseNotes(false);
    const { container } = render(<><RoseCue id="x" note="Gone." className="mt-8" /><RoseAside>Gone too.</RoseAside></>);
    expect(container.innerHTML).toBe("");
  });

  it("on the case study page, after Hide notes, no note, no cue wrapper and no reserved height is left", () => {
    render(<MemoryRouter><RoseCaseStudy reduced={false} /></MemoryRouter>);
    expect(document.querySelectorAll("[data-rose-cue]").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Hide notes" }));
    expect(document.querySelectorAll("[data-rose-cue], [role=note]")).toHaveLength(0);
    expect(document.body.innerHTML).not.toMatch(/min-h-\[1\.75rem\]/);
    // The passage before the first note still ends the block: nothing follows "she does not sell."
    const para = screen.getByText(/she does not sell\./);
    expect(para.nextElementSibling).toBeNull();
  });

  it("a note is visible as soon as it renders, without scrolling into the reading zone", () => {
    render(<Page />);
    for (const note of notes()) {
      const bubble = note.querySelector("p")?.parentElement as HTMLElement;
      expect(bubble.style.opacity).toBe("");
      expect(bubble.style.visibility).toBe("");
      expect(note.querySelector("p")?.style.opacity).toBe("");
    }
  });

  it("the rule above the first-note footer is the hairline colour, not primary", () => {
    render(<Page />);
    const footer = screen.getByText(FOOTER).parentElement as HTMLElement;
    expect(footer.className).toContain("border-t");
    expect(footer.className).toContain("border-outline-variant");
    expect(footer.className).not.toMatch(/border-primary/);
  });
});

describe("The preference survives a reload and a broken storage", () => {
  it("starts hidden after a reload when it was hidden", () => {
    setRoseNotes(false);
    cleanup();
    resetRoseNotesCache(); // a reload: nothing in memory, only storage
    render(<Page />);
    expect(notes()).toHaveLength(0);
    expect(struck()).toBe(true);
  });

  it("starts on after a reload when it was turned back on", () => {
    setRoseNotes(false);
    setRoseNotes(true);
    cleanup();
    resetRoseNotesCache();
    render(<Page />);
    expect(notes()).toHaveLength(2);
  });

  it("a localStorage that throws on read and on write does not break the page", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => { throw new Error("blocked"); });
    resetRoseNotesCache();
    render(<Page />);
    expect(notes()).toHaveLength(2); // default on
    expect(() => fireEvent.click(screen.getByRole("button", { name: "Hide notes" }))).not.toThrow();
    expect(notes()).toHaveLength(0); // the choice holds for the visit
  });
});
