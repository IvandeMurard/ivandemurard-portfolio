import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { UIMessage } from "ai";
import { RoseMarkdown } from "@/components/rose/roseMarkdown";
import { RoseDock } from "@/components/rose/RoseDock";
import { SourceContextLine } from "@/components/layout/SourceContextLine";
import { getRoseChat, resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";
import { clearJump, readJump, saveJump, type Jump } from "@/lib/sourceJump";
import { arriveAtSource, CITED_ATTR, CITED_MS } from "@/lib/sourceArrival";
import { internalSourceLabel } from "@/lib/sourceLinks";

class NoopObserver { observe() {} unobserve() {} disconnect() {} }

const md = (text: string, at = "/rose-design-lab") => {
  window.history.pushState({}, "", at);
  return render(<MemoryRouter initialEntries={[at]}><RoseMarkdown text={text} /></MemoryRouter>);
};

const setScrollY = (y: number) => Object.defineProperty(window, "scrollY", { value: y, configurable: true });

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  window.sessionStorage.clear();
  window.scrollTo = vi.fn();
  setScrollY(0);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  window.sessionStorage.clear();
});

describe("Source link labels", () => {
  it("renders an internal link with a #section as § and the section's heading", () => {
    md("See [the status](/aetherix#where-it-stands).");
    const a = screen.getByRole("link", { name: /^§ Where it stands/ });
    expect(a.textContent).toBe("§ Where it stands");
    // The accessible name carries the full section name, and the page it belongs to.
    expect(a).toHaveAttribute("aria-label", "§ Where it stands (Aetherix)");
    expect(a).toHaveAttribute("href", "/aetherix#where-it-stands");
  });

  it("renders an internal link with no hash as § and the page title", () => {
    md("More in [the Lore write-up](/lore).");
    expect(screen.getByRole("link", { name: "§ Lore" }).textContent).toBe("§ Lore");
  });

  it("finds the Compass sections in the Compass content tree", () => {
    expect(internalSourceLabel("/compass#the-address", "x").text).toBe("§ The address");
  });

  it("keeps Rose's own text where no registry covers the target, and for a project mention", () => {
    md("Read [the status note](/anima#no-such-section) and [Aetherix](/aetherix) and [a part](/aetherix#no-such-section).");
    expect(screen.getByRole("link", { name: "the status note" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Aetherix" }).textContent).toBe("Aetherix");
    expect(screen.getByRole("link", { name: "a part" })).toBeTruthy();
  });

  it("keeps the text of a link that leaves the site, adds ↗ and opens it in a new tab", () => {
    md("See [the Kaggle data](https://www.kaggle.com/c/recruit).");
    const a = screen.getByRole("link", { name: "the Kaggle data" });
    expect(a.textContent).toBe("the Kaggle data ↗");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("opens an internal link in the same tab", () => {
    md("See [the status](/aetherix#where-it-stands).");
    expect(screen.getByRole("link", { name: /^§ Where it stands/ })).not.toHaveAttribute("target");
  });
});

describe("Origin of a source link", () => {
  it("keeps the origin (path, section, scroll position) and the target in sessionStorage", () => {
    md("See [the status](/aetherix#where-it-stands).", "/rose-design-lab");
    setScrollY(640);
    fireEvent.click(screen.getByRole("link", { name: /^§ Where it stands/ }));
    const raw = window.sessionStorage.getItem("rose-source-jump");
    expect(raw).toBeTruthy();
    const jump = readJump() as Jump;
    expect(jump.target).toEqual({ path: "/aetherix", hash: "where-it-stands" });
    expect(jump.samePage).toBe(false);
    expect(jump.origin.path).toBe("/rose-design-lab");
    expect(jump.origin.scrollY).toBe(640);
    expect(jump.origin).toHaveProperty("section");
  });

  it("marks a jump within the same page, and keeps nothing for a click that opens elsewhere", () => {
    md("See [the status](/aetherix#where-it-stands).", "/aetherix");
    fireEvent.click(screen.getByRole("link", { name: /^§ Where it stands/ }), { ctrlKey: true });
    expect(readJump()).toBeNull();
    fireEvent.click(screen.getByRole("link", { name: /^§ Where it stands/ }));
    expect(readJump()?.samePage).toBe(true);
  });
});

describe("Context line", () => {
  const jump = (over: Partial<Jump> = {}): Jump => ({
    target: { path: "/aetherix", hash: "where-it-stands" },
    samePage: false,
    origin: { path: "/rose-design-lab", title: "Rose", section: "Chapter 08", sectionId: null, scrollY: 640 },
    ...over,
  });
  const line = (at: string) => render(<MemoryRouter initialEntries={[at]}><SourceContextLine /></MemoryRouter>);

  it("names the page and section and offers the way back, as a labelled nav landmark", () => {
    saveJump(jump());
    line("/aetherix#where-it-stands");
    const nav = screen.getByRole("navigation", { name: "Return to where you were" });
    expect(nav.textContent).toContain("Aetherix · Where it stands");
    expect(screen.getByRole("button", { name: "← Back to Rose, Chapter 08" })).toBeTruthy();
  });

  it("is not shown for a jump within the same page", () => {
    saveJump(jump({ samePage: true, target: { path: "/aetherix", hash: "where-it-stands" }, origin: { path: "/aetherix", title: "Aetherix", section: null, sectionId: null, scrollY: 10 } }));
    line("/aetherix#where-it-stands");
    expect(screen.queryByRole("navigation", { name: "Return to where you were" })).toBeNull();
  });

  it("goes on any other navigation", () => {
    saveJump(jump());
    line("/tacet");
    expect(screen.queryByRole("navigation", { name: "Return to where you were" })).toBeNull();
    expect(readJump()).toBeNull();
  });

  it("closes with its button", () => {
    saveJump(jump());
    line("/aetherix#where-it-stands");
    fireEvent.click(screen.getByRole("button", { name: "Close this line" }));
    expect(screen.queryByRole("navigation", { name: "Return to where you were" })).toBeNull();
    expect(readJump()).toBeNull();
  });

  it("returns to the exact scroll position of the origin", () => {
    vi.useFakeTimers();
    saveJump(jump());
    line("/aetherix#where-it-stands");
    fireEvent.click(screen.getByRole("button", { name: "← Back to Rose, Chapter 08" }));
    act(() => { vi.advanceTimersByTime(3000); });
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 640, behavior: "auto" });
    expect(readJump()).toBeNull();
    expect(screen.queryByRole("navigation", { name: "Return to where you were" })).toBeNull();
  });
});

describe("Arrival", () => {
  const page = () => {
    document.body.innerHTML = `<main><section id="where-it-stands"><div><h2 id="where-it-stands-heading">Where it stands</h2></div><p id="first">First block</p><p id="second">Second</p></section></main>`;
  };

  it("highlights the first block after the heading, focuses the heading, and fades the highlight after about 4 s", () => {
    vi.useFakeTimers();
    page();
    clearJump();
    arriveAtSource("where-it-stands", false);
    const first = document.getElementById("first") as HTMLElement;
    expect(first.getAttribute(CITED_ATTR)).toBe("on");
    expect(document.getElementById("second")?.hasAttribute(CITED_ATTR)).toBe(false);
    expect(document.activeElement?.id).toBe("where-it-stands-heading");
    expect(window.scrollTo).toHaveBeenCalled();
    vi.advanceTimersByTime(CITED_MS + 700);
    expect(first.hasAttribute(CITED_ATTR)).toBe(false);
  });

  it("with reduced motion shows the highlight without animation and drops it on the next scroll", () => {
    vi.useFakeTimers();
    page();
    arriveAtSource("where-it-stands", true);
    const first = document.getElementById("first") as HTMLElement;
    expect(first.getAttribute(CITED_ATTR)).toBe("on");
    vi.advanceTimersByTime(CITED_MS + 700);
    expect(first.getAttribute(CITED_ATTR)).toBe("on");
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(700);
    expect(first.hasAttribute(CITED_ATTR)).toBe(false);
    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "auto" }));
  });
});

describe("Dock below md", () => {
  const seed: UIMessage[] = [
    { id: "u1", role: "user", parts: [{ type: "text", text: "Where does it stand?" }] },
    { id: "a1", role: "assistant", parts: [{ type: "text", text: "Staged." }] },
  ];
  const mount = () => {
    const chat = resetRoseChat("test");
    chat.messages = seed;
    setRoseOpen(false);
    render(<MemoryRouter initialEntries={["/aetherix"]}><RoseDock roseStatus="live" /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: /^(Open Rose|Reopen the conversation with Rose)$/ }));
  };
  const isOpen = () => !!document.querySelector('[role="log"]');
  const narrow = (matches: boolean) => vi.stubGlobal("matchMedia", (query: string) => ({ matches: matches && query.includes("max-width: 767px"), media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false, onchange: null }));

  it("folds to its bar when a source link is followed on a narrow screen", () => {
    narrow(true);
    mount();
    expect(isOpen()).toBe(true);
    act(() => { window.dispatchEvent(new Event("rose:minimise")); });
    expect(isOpen()).toBe(false);
    void getRoseChat("test");
  });

  it("stays open on a wide screen", () => {
    narrow(false);
    mount();
    act(() => { window.dispatchEvent(new Event("rose:minimise")); });
    expect(isOpen()).toBe(true);
    void getRoseChat("test");
  });
});
