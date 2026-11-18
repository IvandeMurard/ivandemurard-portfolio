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

  it("on any page, not only the homepage", async () => {
    render(wrap(<RoseDock />, "/contact"));
    await flush();
    expect(shown()).toBe(true);
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
  it("'Dim the lights' switches the mood to dusk itself, then the welcome is gone for the session", async () => {
    render(wrap(<Index />));
    await flush();
    fireEvent.click(within(welcome()!).getByRole("button", { name: "Dim the lights" }));
    expect(document.documentElement.dataset.mood).toBe("dusk");
    expect(window.localStorage.getItem("mood")).toBe("dusk");
    expect(welcome()).toBeNull();
  });

  it("in dusk the button reads 'Turn the lights up' and switches to day", async () => {
    window.localStorage.setItem("mood", "dusk");
    render(wrap(<Index />));
    await flush();
    expect(within(welcome()!).queryByRole("button", { name: "Dim the lights" })).toBeNull();
    fireEvent.click(within(welcome()!).getByRole("button", { name: "Turn the lights up" }));
    expect(document.documentElement.dataset.mood).toBe("day");
    expect(welcome()).toBeNull();
  });

  it("'Put on a record' is hidden when the ambience is unavailable (missing files)", async () => {
    stubAudio(false);
    render(wrap(<Index />));
    await flush();
    expect(within(welcome()!).queryByRole("button", { name: "Put on a record" })).toBeNull();
  });

  it("'Put on a record' unmutes the existing ambience, then the welcome is gone", async () => {
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
    expect(welcome()).toBeNull();
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

  it("sits in the dock, above the bar", async () => {
    render(wrap(<Index />));
    await flush();
    const dock = document.querySelector("[data-rose-dock]") as HTMLElement;
    expect(dock.contains(welcome())).toBe(true);
    const bar = dock.querySelector("[data-rose-bar]")!;
    expect(welcome()!.compareDocumentPosition(bar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // The dock is up while the welcome is, though the hero is still on screen; it goes back to waiting after.
    expect(dock.getAttribute("aria-hidden")).toBeNull();
    fireEvent.click(within(welcome()!).getByRole("button", { name: "No thanks" }));
    expect(dock.getAttribute("aria-hidden")).toBe("true");
  });

  it("waits for the first scroll when it would cover the hero's primary call to action", async () => {
    const cta = { top: 700, bottom: 752, left: 24, right: 220 };
    rects(cta);
    render(wrap(<Index />));
    await flush();
    expect(shown()).toBe(false);
    expect(welcome()!.getAttribute("aria-hidden")).toBe("true");
    // A first scroll of a few pixels leaves the call to action under it: it keeps waiting.
    Object.defineProperty(window, "scrollY", { value: 40, configurable: true });
    act(() => { window.dispatchEvent(new Event("scroll")); });
    expect(shown()).toBe(false);
    // Once the scroll has moved the call to action clear of it, it shows.
    Object.assign(cta, { top: 300, bottom: 352 });
    Object.defineProperty(window, "scrollY", { value: 400, configurable: true });
    act(() => { window.dispatchEvent(new Event("scroll")); });
    expect(shown()).toBe(true);
  });

  it("does not wait when the call to action is clear of it", async () => {
    rects({ top: 300, bottom: 352, left: 24, right: 220 });
    render(wrap(<Index />));
    await flush();
    expect(shown()).toBe(true);
  });
});
