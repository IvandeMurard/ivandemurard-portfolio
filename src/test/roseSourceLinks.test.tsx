import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { UIMessage } from "ai";
import { RoseMarkdown } from "@/components/rose/roseMarkdown";
import { RoseDock } from "@/components/rose/RoseDock";
import { SourceContextLine } from "@/components/layout/SourceContextLine";
import { getRoseChat, resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";
import { captureOrigin, clearJump, readJump, saveJump, type Jump } from "@/lib/sourceJump";
import { activeRailItem, registerRail } from "@/lib/railRegistry";
import { SectionRail } from "@/components/layout/SectionRail";
import { arriveAtSource, CITED_ATTR, CITED_MS } from "@/lib/sourceArrival";
import { inSentence, internalSourceLabel, loadSourceLabels } from "@/lib/sourceLinks";

class NoopObserver { observe() {} unobserve() {} disconnect() {} }

beforeAll(async () => { await loadSourceLabels(); });

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
  it("renders an internal link with a #section as § and the section's heading, named without the §", () => {
    md("See [the status](/aetherix#where-it-stands).");
    const a = screen.getByRole("link", { name: "Where it stands, in Aetherix" });
    expect(a.textContent).toBe("§ Where it stands");
    expect(a).toHaveAttribute("href", "/aetherix#where-it-stands");
  });

  it("renders an internal link with no hash as § and the page title, named by the title", () => {
    md("More in [the Lore write-up](/lore).");
    expect(screen.getByRole("link", { name: "Lore" }).textContent).toBe("§ Lore");
  });

  it("labels a Field Note with its short title, and names it by the full title", () => {
    md("See [the harness note](/journal/harnesses-graders-closed-loops).");
    const a = screen.getByRole("link");
    expect(a.textContent).toBe("§ What is an LLM evaluation harness?");
    expect(a.getAttribute("aria-label")).toBe("What is an LLM evaluation harness? Graders, protocols and closed loops for AI agents");
    expect(a.getAttribute("title")).toBe("What is an LLM evaluation harness? Graders, protocols and closed loops for AI agents");
  });

  it("uses the homepage title of a note when it has one, without its final full stop", () => {
    md("See [the split](/journal/agent-boundaries-aetherix).");
    expect(screen.getByRole("link").textContent).toBe("§ Keep the forecaster and the actor apart");
  });

  it("drops a final full stop inside a sentence and keeps ? and !", () => {
    expect(inSentence("Where it stands.")).toBe("Where it stands");
    expect(inSentence("What is a harness?")).toBe("What is a harness?");
    expect(inSentence("Stop!")).toBe("Stop!");
    expect(inSentence("A. B.")).toBe("A. B");
  });

  it("never puts two punctuation marks together in an accessible name, nor a § in it", () => {
    const links = [
      "/lore#honesty", "/aetherix#how-its-built", "/compass#how-sure-is-it",
      "/journal/agent-boundaries-aetherix", "/journal/harnesses-graders-closed-loops#6-acceptance-criteria-the-part-everyone-skips",
    ];
    for (const href of links) {
      const { full } = internalSourceLabel(href, "x");
      expect(full, href).toBeTruthy();
      expect(full, href).not.toMatch(/[.,;:?!]\s*[.,;:]/);
      expect(full, href).not.toContain("§");
    }
    expect(internalSourceLabel("/compass#how-sure-is-it", "x").full).toBe("How sure is it? In Compass");
    expect(internalSourceLabel("/lore#honesty", "x")).toMatchObject({ text: "§ Where it stands", full: "Where it stands, in Lore" });
  });

  it("finds the Compass sections in the registry", () => {
    expect(internalSourceLabel("/compass#the-address", "x").text).toBe("§ The address");
  });

  it("keeps Rose's own text where no registry covers the target, and for a project mention", () => {
    md("Read [the status note](/anima#no-such-section) and [Aetherix](/aetherix) and [a part](/aetherix#no-such-section).");
    expect(screen.getByRole("link", { name: "the status note" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Aetherix" }).textContent).toBe("Aetherix");
    expect(screen.getByRole("link", { name: "a part" })).toBeTruthy();
  });

  it("keeps the text of a link that leaves the site, adds ↗, opens it in a new tab and says so in its name", () => {
    md("See [the Kaggle data](https://www.kaggle.com/c/recruit).");
    const a = screen.getByRole("link", { name: "the Kaggle data, opens in a new tab" });
    expect(a.textContent).toBe("the Kaggle data ↗");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("opens an internal link in the same tab", () => {
    md("See [the status](/aetherix#where-it-stands).");
    expect(screen.getByRole("link", { name: "Where it stands, in Aetherix" })).not.toHaveAttribute("target");
  });
});

describe("Origin of a source link", () => {
  const status = () => screen.getByRole("link", { name: "Where it stands, in Aetherix" });

  it("keeps the origin (path, section, scroll position) and the target in sessionStorage", () => {
    md("See [the status](/aetherix#where-it-stands).", "/rose-design-lab");
    setScrollY(640);
    fireEvent.click(status());
    expect(window.sessionStorage.getItem("rose-source-jump")).toBeTruthy();
    const jump = readJump() as Jump;
    expect(jump.target).toEqual({ path: "/aetherix", hash: "where-it-stands" });
    expect(jump.samePage).toBe(false);
    expect(jump.origin.path).toBe("/rose-design-lab");
    expect(jump.origin.scrollY).toBe(640);
    expect(jump.origin).toHaveProperty("section");
  });

  it("marks a jump within the same page, and keeps nothing for a click that opens elsewhere", () => {
    md("See [the status](/aetherix#where-it-stands).", "/aetherix");
    fireEvent.click(status(), { ctrlKey: true });
    expect(readJump()).toBeNull();
    fireEvent.click(status());
    expect(readJump()?.samePage).toBe(true);
  });
});

describe("Origin section", () => {
  const withRects = (tops: Record<string, number>) => {
    document.body.innerHTML = "";
    const main = document.createElement("main");
    document.body.appendChild(main);
    const add = (parent: HTMLElement, id: string, text: string) => {
      const h = document.createElement("h2");
      h.id = id;
      h.textContent = text;
      h.getBoundingClientRect = () => ({ top: tops[id], bottom: tops[id] + 30, left: 0, right: 0, width: 0, height: 30, x: 0, y: tops[id], toJSON() {} });
      parent.appendChild(h);
      return h;
    };
    for (const id of Object.keys(tops)) if (id !== "bar") add(main, id, id.toUpperCase());
    if ("bar" in tops) {
      const bar = document.createElement("div");
      bar.className = "fixed top-0";
      main.appendChild(bar);
      add(bar, "bar", "BAR");
    }
  };
  afterEach(() => { document.body.innerHTML = ""; });

  beforeEach(() => { Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true }); });

  it("is the active item of the page's rail, with its number, when the page has one", () => {
    withRects({ a: -500, b: 900 });
    const off = registerRail(() => ({ id: "ch-02", label: "02 Listen to the page" }));
    window.history.pushState({}, "", "/rose-design-lab");
    expect(captureOrigin()).toMatchObject({ section: "02 Listen to the page", sectionId: "ch-02" });
    off();
  });

  it("is otherwise the last heading whose top is above 40% of the window", () => {
    withRects({ a: -500, b: 200, c: 450 });
    window.history.pushState({}, "", "/cv");
    expect(captureOrigin()).toMatchObject({ section: "B", sectionId: "b" });
  });

  it("does not take the next heading before it has reached the 40% line, and never a heading in a fixed bar", () => {
    withRects({ a: 100, b: 410, bar: 5 });
    window.history.pushState({}, "", "/cv");
    expect(captureOrigin().section).toBe("A");
  });

  it("is empty when no heading has reached the line yet", () => {
    withRects({ a: 600 });
    window.history.pushState({}, "", "/cv");
    expect(captureOrigin().section).toBeNull();
  });

  it("follows the rail registered by SectionRail, and lets go when the page goes", () => {
    window.history.pushState({}, "", "/tacet");
    const { unmount } = render(<SectionRail sections={[{ id: "overview", label: "Overview" }, { id: "problem", label: "Problem" }]} />);
    expect(activeRailItem()).toEqual({ id: "overview", label: "Overview" });
    unmount();
    expect(activeRailItem()).toBeNull();
  });
});

describe("Return name of the origin page", () => {
  const at = (path: string, h1?: string) => {
    document.body.innerHTML = h1 ? `<main><h1>${h1}</h1></main>` : "<main></main>";
    window.history.pushState({}, "", path);
    return captureOrigin().title;
  };
  afterEach(() => { document.body.innerHTML = ""; });

  it("is Rose's case study for the Rose page", () => {
    expect(at("/rose-design-lab")).toBe("Rose's case study");
  });
  it("is 'the {Name} case study' for a case study", () => {
    expect(at("/aetherix")).toBe("the Aetherix case study");
    expect(at("/lore")).toBe("the Lore case study");
    expect(at("/compass")).toBe("the Compass case study");
  });
  it("is the short title, without its final full stop, for a Field Note", () => {
    expect(at("/journal/agent-boundaries-aetherix")).toBe("Keep the forecaster and the actor apart");
    expect(at("/journal/harnesses-graders-closed-loops")).toBe("What is an LLM evaluation harness?");
  });
  it("is the h1 for any other page", () => {
    expect(at("/architecture", "Hospitality Multi-Agent Architecture")).toBe("Hospitality Multi-Agent Architecture");
    expect(at("/cv", "Ivan de Murard")).toBe("Ivan de Murard");
  });
  it("is 'the homepage' for the homepage, whose h1 is a sentence", () => {
    expect(at("/", "SaaS product manager and co-founder. Now I build AI services")).toBe("the homepage");
  });
  it("reads: ← Back to Rose's case study, 02 Listen to the page", () => {
    const origin = { path: "/rose-design-lab", title: "Rose's case study", section: "02 Listen to the page", sectionId: "ch-02", scrollY: 10 };
    saveJump({ target: { path: "/aetherix", hash: "where-it-stands" }, samePage: false, origin });
    render(<MemoryRouter initialEntries={["/aetherix#where-it-stands"]}><SourceContextLine /></MemoryRouter>);
    expect(screen.getByRole("button", { name: "← Back to Rose's case study, 02 Listen to the page" })).toBeTruthy();
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

  it("shows the full title of a Field Note, not the short one", () => {
    saveJump(jump({ target: { path: "/journal/harnesses-graders-closed-loops", hash: "" } }));
    line("/journal/harnesses-graders-closed-loops");
    const nav = screen.getByRole("navigation", { name: "Return to where you were" });
    expect(nav.textContent).toContain("What is an LLM evaluation harness? Graders, protocols and closed loops for AI agents");
  });

  it("is two lines below md: the way back whole on the first with the close button, where the reader is cut short on the second", () => {
    saveJump(jump());
    line("/aetherix#where-it-stands");
    const nav = screen.getByRole("navigation", { name: "Return to where you were" });
    const [text, close] = Array.from(nav.children) as HTMLElement[];
    const back = screen.getByRole("button", { name: /^← Back to / });
    const where = nav.querySelector("[data-context-where]") as HTMLElement;
    // Text block first, close button beside it at the top (items-start): the close button is on the first line.
    expect(close.getAttribute("aria-label")).toBe("Close this line");
    expect(nav.className).toContain("items-start");
    // Stacked below md, with the way back ordered first; it wraps and is never cut.
    expect(text.className).toContain("flex-col");
    expect(back.className).toContain("order-1");
    expect(back.className).toContain("whitespace-normal");
    expect(back.className).not.toContain("truncate");
    // The second line is the one that is truncated.
    expect(where.className).toContain("order-2");
    expect(where.className).toContain("truncate");
    // From md up: one line, where the reader is first, as before.
    expect(text.className).toContain("md:block");
    expect(where.className).toContain("md:inline");
    expect(back.className).toContain("md:order-none");
    expect(back.className).toContain("md:ml-4");
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
