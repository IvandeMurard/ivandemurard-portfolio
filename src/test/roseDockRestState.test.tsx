import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import type { UIMessage } from "ai";
import { RoseDock } from "@/components/rose/RoseDock";
import { getRoseChat, resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";
import { ROSE_DATA_SHORT } from "@/content/roseDataContract";

class NoopObserver { observe() {} unobserve() {} disconnect() {} }

const seed: UIMessage[] = [
  { id: "u1", role: "user", parts: [{ type: "text", text: "What has actually been built?" }] },
  { id: "a1", role: "assistant", parts: [{ type: "text", text: "The loop and its checks." }] },
];

const mount = (messages: UIMessage[] = []) => {
  const chat = resetRoseChat("test");
  chat.messages = messages;
  render(<MemoryRouter initialEntries={["/aetherix"]}><RoseDock roseStatus="live" /></MemoryRouter>);
};
const opened = () => !!document.querySelector('[role="log"]');

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  setRoseOpen(false);
  window.sessionStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  void getRoseChat("test");
});

describe("Rose dock: the short data line goes wherever the message input is rendered", () => {
  const shortLine = () => screen.queryAllByText((_, el) => el?.tagName === "P" && el.textContent?.replace(/\s+/g, " ").trim() === ROSE_DATA_SHORT.line);
  const input = () => screen.queryAllByRole("textbox", { name: "Message Rose" });
  const open = () => fireEvent.click(screen.getByRole("button", { name: /^(Open Rose|Reopen the conversation with Rose)$/ }));
  const minimise = () => fireEvent.click(screen.getByRole("button", { name: "Minimise Rose and keep the conversation" }));
  const states: Array<[string, boolean, () => void]> = [
    ["rest, no conversation", false, () => {}],
    ["rest, with a conversation", true, () => {}],
    ["open, no conversation", false, open],
    ["open, with a conversation", true, open],
    ["closed again after opening", true, () => { open(); fireEvent.click(screen.getAllByRole("button", { name: "Close Rose" })[0]); }],
  ];

  for (const [name, conversation, reach] of states) {
    it(`${name}: the input and the line are both there`, () => {
      mount(conversation ? seed : []);
      reach();
      expect(input()).toHaveLength(1);
      expect(shortLine()).toHaveLength(1);
      const line = shortLine()[0];
      expect(line.querySelector("a")?.getAttribute("href")).toBe("/privacy");
      // One line: never allowed to wrap.
      expect(line.className).toContain("whitespace-nowrap");
      // Under the input, not beside it.
      expect(input()[0].compareDocumentPosition(line) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  }

  it("folded with the chevron: back at the bar, with its input and its line", () => {
    mount(seed);
    open();
    minimise();
    expect(input()).toHaveLength(1);
    expect(shortLine()).toHaveLength(1);
  });

  it("in every state, an input without the line is impossible: both or neither", () => {
    mount(seed);
    const check = () => expect(input().length).toBe(shortLine().length);
    check();
    open();
    check();
    minimise();
    check();
    fireEvent.click(screen.getByRole("button", { name: "Reopen the conversation with Rose" }));
    check();
    fireEvent.click(screen.getAllByRole("button", { name: "Close Rose" })[0]);
    check();
  });
});

describe("Rose dock: open state", () => {
  it("shows the page's three starters and the input, with no heading or paragraph", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Open Rose" }));
    expect(opened()).toBe(true);
    expect(screen.getByRole("button", { name: "What has actually been built?" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "What happens when it's wrong?" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^Book a call/ })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Message Rose" })).toBeTruthy();
    expect(screen.queryByText(/Explore Ivan's work/)).toBeNull();
    expect(screen.queryByText(/What he has built, the decisions behind it/)).toBeNull();
  });

  it("states the data contract in one line, with Privacy linking to /privacy", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Open Rose" }));
    const link = screen.getByRole("link", { name: ROSE_DATA_SHORT.linkLabel });
    expect(link.getAttribute("href")).toBe("/privacy");
    expect(link.parentElement?.textContent?.replace(/\s+/g, " ").trim()).toBe(ROSE_DATA_SHORT.line);
    expect(screen.queryByText(/stays in this tab/)).toBeNull();
    expect(screen.queryByText(/masked before storage/)).toBeNull();
  });

  it("has labelled Minimise and Close controls, both real buttons reachable by keyboard", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Open Rose" }));
    const minimise = screen.getByRole("button", { name: "Minimise Rose and keep the conversation" });
    const close = screen.getAllByRole("button", { name: "Close Rose" });
    expect(minimise.tagName).toBe("BUTTON");
    expect(minimise.getAttribute("tabindex")).not.toBe("-1");
    expect(close.length).toBeGreaterThan(0);
    expect(close.every((b) => b.getAttribute("tabindex") !== "-1")).toBe(true);
  });

  it("closes on Escape", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Open Rose" }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(opened()).toBe(false);
  });
});

describe("Rose dock: the bar at rest, the chevron and close", () => {
  const fold = () => fireEvent.click(screen.getByRole("button", { name: "Minimise Rose and keep the conversation" }));

  it("at rest it is the centred bar \"Ask Rose anything\", with the data line under it", () => {
    mount();
    const box = screen.getByRole("textbox", { name: "Message Rose" });
    expect(box.getAttribute("placeholder")).toBe("Ask Rose anything");
    const dock = document.querySelector("[data-rose-dock]") as HTMLElement;
    expect(dock.className).toContain("md:left-1/2"); // centred at the bottom
    expect(dock.className).not.toMatch(/right-4 [^"]*md:right-6|md:bottom-6 md:right-6/);
    expect(box.compareDocumentPosition(screen.getByRole("link", { name: ROSE_DATA_SHORT.linkLabel })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("the chevron folds the open panel back to the bar and focuses its input; there is no compass rest button", async () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Open Rose" }));
    fold();
    expect(opened()).toBe(false);
    expect(document.querySelector("[data-rose-minimised]")).toBeNull();
    const box = screen.getByRole("textbox", { name: "Message Rose" });
    await vi.waitFor(() => expect(document.activeElement).toBe(box));
    // The only compass button is the small one inside the bar; no 44 px button floats at the bottom right.
    const compass = screen.getAllByRole("button", { name: /^(Open Rose|Reopen the conversation with Rose)$/ });
    expect(compass).toHaveLength(1);
    expect(compass[0].closest("form")).not.toBeNull();
    expect(document.querySelector("button.h-11.w-11")).toBeNull();
    expect(document.querySelectorAll("[data-rose-dock]")).toHaveLength(1);
  });

  it("folding keeps the conversation: the bar offers Resume, and it reopens the conversation without typing", () => {
    mount(seed);
    fireEvent.click(screen.getByRole("button", { name: "Reopen the conversation with Rose" }));
    expect(screen.getByText("The loop and its checks.")).toBeTruthy();
    fold();
    expect(screen.queryByText("The loop and its checks.")).toBeNull();
    const resume = screen.getByRole("button", { name: "Reopen the conversation with Rose" });
    expect(resume.textContent).toContain("Resume");
    fireEvent.click(resume);
    expect(screen.getByText("The loop and its checks.")).toBeTruthy();
  });

  it("close also returns to the bar, and Ctrl+K opens the dock from it", () => {
    mount(seed);
    fireEvent.click(screen.getByRole("button", { name: "Reopen the conversation with Rose" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Close Rose" })[1] ?? screen.getAllByRole("button", { name: "Close Rose" })[0]);
    expect(opened()).toBe(false);
    expect(screen.getByRole("textbox", { name: "Message Rose" })).toBeTruthy();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(opened()).toBe(true);
  });

  it("paused: the bar is an opener, not a text field, and the notice stays inside the open panel", () => {
    resetRoseChat("test");
    render(<MemoryRouter initialEntries={["/aetherix"]}><RoseDock roseStatus="paused" /></MemoryRouter>);
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(document.querySelector("[data-rose-minimised]")).toBeNull();
    expect(screen.getByRole("link", { name: ROSE_DATA_SHORT.linkLabel })).toBeTruthy(); // the data line stays under the bar
    fireEvent.click(screen.getByRole("button", { name: "Ask Rose anything" }));
    expect(opened()).toBe(false); // the paused panel has no conversation log
    expect(screen.getByText(/Rose has run out of credits/)).toBeTruthy();
  });
});

describe("Back to top and the bar", () => {
  it("rides above the bar below md, where the bar spans the page, and keeps its place from md up", () => {
    const rail = readFileSync("src/components/layout/SectionRail.tsx", "utf8");
    expect(rail).toContain('"fixed bottom-28 md:bottom-8 right-6 lg:right-10 z-30"');
    // The bar is centred and 560 px wide from md up, so it does not reach the button there.
    mount();
    const dock = document.querySelector("[data-rose-dock]") as HTMLElement;
    expect(dock.className).toContain("md:w-[min(560px,calc(100vw-3rem))]");
  });
});
