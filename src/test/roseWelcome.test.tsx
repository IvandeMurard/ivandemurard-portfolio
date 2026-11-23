import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import Index from "@/pages/Index";
import { MoodProvider } from "@/components/MoodProvider";
import { AmbienceProvider } from "@/components/AmbienceProvider";
import { RoseDock } from "@/components/rose/RoseDock";
import { resetRoseWelcome, WELCOME_KEY } from "@/components/rose/RoseWelcome";
import { getRoseChat, resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";
import { ROSE_NOTES_KEY, resetRoseNotesCache } from "@/lib/roseNotes";
import { ROSE_WELCOME } from "@/content/roseWelcome";

// Homepage v2, part B (18 Nov 2026): Rose's welcome. Scripted UI in the dock, once per browser session; each button does
// its action itself; no model call and nothing in the conversation.

class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }

let fetchSpy: ReturnType<typeof vi.fn>;

const stubAudio = (available: boolean) => {
  fetchSpy = vi.fn(async () => ({ ok: available }));
  vi.stubGlobal("fetch", fetchSpy);
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
};

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  vi.stubGlobal("ResizeObserver", NoopObserver);
  window.scrollTo = vi.fn();
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  Element.prototype.scrollIntoView = vi.fn();
  window.localStorage.clear();
  window.sessionStorage.clear(); // a new browser session
  resetRoseWelcome(); // a new page load
  resetRoseNotesCache();
  resetRoseChat("welcome-test");
  setRoseOpen(false);
  document.documentElement.removeAttribute("data-mood");
  stubAudio(false);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

const wrap = (ui: React.ReactNode, path = "/") => <MoodProvider><AmbienceProvider><MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter></AmbienceProvider></MoodProvider>;
const welcome = () => document.querySelector("[data-rose-welcome]") as HTMLElement | null;
const shown = () => { const w = welcome(); return !!w && w.getAttribute("aria-hidden") !== "true"; };
const flush = () => act(async () => { await Promise.resolve(); });

describe("When Rose's welcome shows", () => {
  it("on the first page view of a browser session, with the exact words and three-button offer", async () => {
    render(wrap(<Index />));
    await flush();
    const w = welcome()!;
    expect(shown()).toBe(true);
    expect(within(w).getByText(ROSE_WELCOME.text)).toBeTruthy();
    expect(ROSE_WELCOME.text).toBe("Welcome, make yourself comfortable. Sadly, I can't offer you a drink, but I can dim the lights or put on a record.");
    expect(within(w).getByRole("button", { name: "Dim the lights" })).toBeTruthy();
    expect(within(w).getByRole("button", { name: "No thanks" })).toBeTruthy();
    expect(window.sessionStorage.getItem(WELCOME_KEY)).toBe("seen");
  });

  it("never on a case study or another non-homepage route", async () => {
    render(wrap(<RoseDock />, "/rose"));
    await flush();
    expect(welcome()).toBeNull();
    cleanup();
    resetRoseWelcome();
    window.sessionStorage.clear();
    render(wrap(<RoseDock />, "/contact"));
    await flush();
    expect(welcome()).toBeNull();
  });

  it("does not greet on the homepage after a first visit to a case study", async () => {
    const first = render(wrap(<RoseDock />, "/rose"));
    await flush();
    first.unmount();
    render(wrap(<Index />));
    await flush();
    expect(welcome()).toBeNull();
  });

  it("not on a later page view of the same session (a route change, then a reload)", async () => {
    const first = render(wrap(<Index />));
    await flush();
    expect(shown()).toBe(true);
    first.unmount();
    render(wrap(<RoseDock />, "/contact")); // another page view in the same load
    await flush();
    expect(welcome()).toBeNull();
    cleanup();
    resetRoseWelcome(); // a reload: the load starts again, the session is the same
    render(wrap(<Index />));
    await flush();
    expect(welcome()).toBeNull();
  });

  it("never when Page notes are off", async () => {
    window.localStorage.setItem(ROSE_NOTES_KEY, "off");
    resetRoseNotesCache();
    render(wrap(<Index />));
    await flush();
    expect(welcome()).toBeNull();
  });

  it("and goes when the visitor turns Page notes off while it is up", async () => {
    render(wrap(<Index />));
    await flush();
    expect(shown()).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: /Page notes: on/ }));
    expect(welcome()).toBeNull();
  });
});

describe("What the buttons do", () => {
  it("'Dim the lights' switches the mood to dusk itself and the welcome stays, now offering 'Turn the lights up'", async () => {
    render(wrap(<Index />));
    await flush();
    fireEvent.click(within(welcome()!).getByRole("button", { name: "Dim the lights" }));
    expect(document.documentElement.dataset.mood).toBe("dusk");
    expect(window.localStorage.getItem("mood")).toBe("dusk");
    expect(shown()).toBe(true);
    expect(within(welcome()!).getByRole("button", { name: "Turn the lights up" })).toBeTruthy();
  });

  it("in dusk the button reads 'Turn the lights up' and switches to day", async () => {
    window.localStorage.setItem("mood", "dusk");
    render(wrap(<Index />));
    await flush();
    expect(within(welcome()!).queryByRole("button", { name: "Dim the lights" })).toBeNull();
    fireEvent.click(within(welcome()!).getByRole("button", { name: "Turn the lights up" }));
    expect(document.documentElement.dataset.mood).toBe("day");
    expect(shown()).toBe(true);
  });

  it("'Put on a record' is hidden when the ambience is unavailable (missing files)", async () => {
    stubAudio(false);
    render(wrap(<Index />));
    await flush();
    expect(within(welcome()!).queryByRole("button", { name: "Put on a record" })).toBeNull();
  });

  it("'Put on a record' toggles the ambience: Now playing, then Stop, and the welcome stays throughout", async () => {
    stubAudio(true);
    render(wrap(<Index />));
    await flush();
    await flush();
    const rec = within(welcome()!).getByRole("button", { name: "Put on a record" });
    expect(window.localStorage.getItem("ambience-muted")).toBe("true");
    fireEvent.click(rec);
    await flush();
    expect(window.localStorage.getItem("ambience-muted")).toBe("false");
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    expect(shown()).toBe(true);
    expect(within(welcome()!).getByText(ROSE_WELCOME.playing)).toBeTruthy();
    expect(ROSE_WELCOME.playing).toBe("Now playing: Odetta, ATCQ Tribute.");
    fireEvent.click(within(welcome()!).getByRole("button", { name: "Stop the record" }));
    await flush();
    expect(window.localStorage.getItem("ambience-muted")).toBe("true");
    expect(shown()).toBe(true);
    expect(within(welcome()!).getByRole("button", { name: "Put on a record" })).toBeTruthy();
  });

  it("dim, then record, then stop: the welcome is still shown after each", async () => {
    stubAudio(true);
    render(wrap(<Index />));
    await flush(); await flush();
    for (const name of ["Dim the lights", "Put on a record", "Stop the record"]) {
      fireEvent.click(within(welcome()!).getByRole("button", { name }));
      await flush();
      expect(shown()).toBe(true);
    }
    expect(document.documentElement.dataset.mood).toBe("dusk");
  });

  it("opening Rose to type a question dismisses the welcome", async () => {
    render(wrap(<Index />));
    await flush();
    fireEvent.click(within(welcome()!).getByRole("button", { name: "Open Rose" }));
    expect(welcome()).toBeNull();
    expect(screen.getByRole("textbox", { name: "Message Rose" })).toBeTruthy();
  });

  it("'No thanks' closes it and changes nothing else", async () => {
    stubAudio(true);
    render(wrap(<Index />));
    await flush();
    fireEvent.click(within(welcome()!).getByRole("button", { name: "No thanks" }));
    expect(welcome()).toBeNull();
    expect(window.localStorage.getItem("ambience-muted")).not.toBe("false");
    expect(document.documentElement.dataset.mood).toBe("day");
  });

  it("Escape closes it", async () => {
    render(wrap(<Index />));
    await flush();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(welcome()).toBeNull();
  });

  it("opening the dock closes it, and the dock opens on an empty conversation", async () => {
    render(wrap(<Index />));
    await flush();
    act(() => { window.dispatchEvent(new Event("rose:open")); });
    expect(welcome()).toBeNull();
    expect(document.body.textContent).not.toContain(ROSE_WELCOME.text);
  });
});

describe("It is scripted UI, not a chat message", () => {
  it("makes no request, adds nothing to the conversation history, and the source has no model call, event or storage of a message", async () => {
    stubAudio(false);
    render(wrap(<Index />));
    await flush();
    fireEvent.click(within(welcome()!).getByRole("button", { name: "Dim the lights" }));
    expect(fetchSpy.mock.calls.map((c) => String(c[0])).filter((u) => /rose-chat|rose-event|supabase/.test(u))).toEqual([]);
    expect(getRoseChat("welcome-test").messages).toHaveLength(0);
    expect(window.sessionStorage.getItem("rose_conversation_v1")).toBeNull();
    const src = readFileSync("src/components/rose/RoseWelcome.tsx", "utf8");
    expect(src).not.toMatch(/useChat|logRoseEvent|fetch\(|saveMessages|roseSession|supabase/);
  });

  it("leaves supabase/ and the event types alone", () => {
    const events = readFileSync("src/components/rose/roseEvents.ts", "utf8");
    expect(events).not.toMatch(/welcome/i);
  });
});

describe("Accessibility", () => {
  it("is a polite status, takes no focus, has no timer, and every button is at least 44 px high", async () => {
    const timeouts = vi.spyOn(window, "setTimeout");
    render(wrap(<Index />));
    await flush();
    const w = welcome()!;
    expect(w.getAttribute("role")).toBe("status");
    expect(w.getAttribute("aria-live")).toBe("polite");
    expect(document.activeElement === document.body || !w.contains(document.activeElement)).toBe(true);
    for (const b of within(w).getAllByRole("button")) expect(b.className, b.textContent ?? "").toContain("min-h-[44px]");
    // No auto-dismiss: nothing in the welcome sets a timer.
    expect(readFileSync("src/components/rose/RoseWelcome.tsx", "utf8")).not.toMatch(/setTimeout|setInterval/);
    expect(timeouts.mock.calls.filter(([, ms]) => ms === 5000 || ms === 8000 || ms === 10000)).toEqual([]);
  });

  it("every button is reachable and operable with the keyboard", async () => {
    render(wrap(<Index />));
    await flush();
    const b = within(welcome()!).getByRole("button", { name: "No thanks" });
    b.focus();
    expect(document.activeElement).toBe(b);
    fireEvent.click(b);
    expect(welcome()).toBeNull();
  });
});

describe("Where it sits, and the phone", () => {
  const rects = (cta: { top: number; bottom: number; left: number; right: number }) => {
    const real = Element.prototype.getBoundingClientRect;
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
      const make = (r: { top: number; bottom: number; left: number; right: number }) => ({ ...r, width: r.right - r.left, height: r.bottom - r.top, x: r.left, y: r.top, toJSON() {} }) as DOMRect;
      if (this.matches('[data-cta="primary"]')) return make(cta);
      if (this.hasAttribute("data-rose-dock")) return make({ left: 16, right: 374, top: 600, bottom: 828 });
      return real.call(this);
    });
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) { return this.hasAttribute("data-rose-dock") ? 240 : 0; });
    vi.stubGlobal("innerHeight", 844);
  };

  it("replaces the resting bar inside the dock", async () => {
    render(wrap(<Index />));
    await flush();
    const dock = document.querySelector("[data-rose-dock]") as HTMLElement;
    expect(dock.contains(welcome())).toBe(true);
    const bar = dock.querySelector("[data-rose-bar]")!;
    expect(bar).toBe(welcome());
    expect(dock.querySelector("input")).toBeNull();
    // The dock is up while the welcome is, though the hero is still on screen; it goes back to waiting after.
    expect(dock.getAttribute("aria-hidden")).toBeNull();
    fireEvent.click(within(welcome()!).getByRole("button", { name: "No thanks" }));
    expect(dock.getAttribute("aria-hidden")).toBe("true");
  });

  const scrollTo = (y: number) => { Object.defineProperty(window, "scrollY", { value: y, configurable: true }); act(() => { window.dispatchEvent(new Event("scroll")); }); };
  /** The top of the dock's footprint (dock height 240, 16 px from the bottom, 8 px of air) on an 844 px viewport. */
  const FOOTPRINT_TOP = 844 - 16 - 240 - 8;

  it("at 390: not shown on arrival, not covering the call to action, and shown after a scroll of 200 px", async () => {
    vi.stubGlobal("innerWidth", 390);
    const cta = { top: 538, bottom: 590, left: 24, right: 220 }; // the button as measured at 390 x 844
    rects(cta);
    render(wrap(<Index />));
    await flush();
    // Arrival: the welcome's footprint and the button would overlap, so it is not there.
    expect(cta.bottom).toBeGreaterThan(FOOTPRINT_TOP);
    expect(shown()).toBe(false);
    expect(welcome()!.getAttribute("aria-hidden")).toBe("true");
    // A first scroll that leaves the button on screen is not enough.
    Object.assign(cta, { top: 538 - 100, bottom: 590 - 100 });
    scrollTo(100);
    expect(shown()).toBe(false);
    // 200 px: it shows, and the button is clear of it.
    Object.assign(cta, { top: 538 - 200, bottom: 590 - 200 });
    scrollTo(200);
    expect(shown()).toBe(true);
    expect(cta.bottom).toBeLessThanOrEqual(FOOTPRINT_TOP);
  });

  it("at 390: shows as soon as the call to action has left the viewport, before 200 px", async () => {
    vi.stubGlobal("innerWidth", 390);
    const cta = { top: 40, bottom: 92, left: 24, right: 220 };
    rects(cta);
    render(wrap(<Index />));
    await flush();
    expect(shown()).toBe(false);
    Object.assign(cta, { top: -60, bottom: -8 });
    scrollTo(120);
    expect(shown()).toBe(true);
  });

  it("under 768 px it waits even when the call to action is clear; from 768 px it shows on arrival", async () => {
    rects({ top: 300, bottom: 352, left: 24, right: 220 });
    vi.stubGlobal("innerWidth", 767);
    const phone = render(wrap(<Index />));
    await flush();
    expect(shown()).toBe(false);
    phone.unmount();
    resetRoseWelcome();
    window.sessionStorage.removeItem(WELCOME_KEY);
    vi.stubGlobal("innerWidth", 768);
    render(wrap(<Index />));
    await flush();
    expect(shown()).toBe(true);
  });

  it("on a desktop it waits only if it would cover the call to action, and then by the same rule", async () => {
    vi.stubGlobal("innerWidth", 1280);
    const cta = { top: 700, bottom: 752, left: 24, right: 220 };
    rects(cta);
    render(wrap(<Index />));
    await flush();
    expect(shown()).toBe(false);
    Object.assign(cta, { top: 660, bottom: 712 });
    scrollTo(40);
    expect(shown()).toBe(false);
    Object.assign(cta, { top: 500, bottom: 552 });
    scrollTo(200);
    expect(shown()).toBe(true);
  });

  it("on a desktop, with the call to action clear of it, it shows on arrival: unchanged", async () => {
    vi.stubGlobal("innerWidth", 1440);
    rects({ top: 300, bottom: 352, left: 24, right: 220 });
    render(wrap(<Index />));
    await flush();
    expect(shown()).toBe(true);
  });
});
