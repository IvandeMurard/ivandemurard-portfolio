import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { UIMessage } from "ai";
import { RoseDock } from "@/components/rose/RoseDock";
import { getRoseChat, resetRoseChat, setRoseMinimised, setRoseOpen } from "@/components/rose/roseSession";
import { ROSE_DATA_SHORT } from "@/content/roseDataContract";

class NoopObserver { observe() {} unobserve() {} disconnect() {} }

const seed: UIMessage[] = [
  { id: "u1", role: "user", parts: [{ type: "text", text: "What has actually been built?" }] },
  { id: "a1", role: "assistant", parts: [{ type: "text", text: "The loop and its checks." }] },
];

const mount = (messages: UIMessage[] = []) => {
  const chat = resetRoseChat("test");
  chat.messages = messages;
  render(<MemoryRouter initialEntries={["/aetherix"]}><RoseDock /></MemoryRouter>);
};
const opened = () => !!document.querySelector('[role="log"]');
const minimisedDock = () => document.querySelector("[data-rose-minimised]");

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  setRoseOpen(false);
  setRoseMinimised(false);
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

  it("minimised: no input, so no line", () => {
    mount(seed);
    open();
    minimise();
    expect(input()).toHaveLength(0);
    expect(shortLine()).toHaveLength(0);
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

describe("Rose dock: minimise, close and the compass button", () => {
  it("minimise leaves only the compass button, focused; with no conversation it reopens on the starters", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Open Rose" }));
    fireEvent.click(screen.getByRole("button", { name: "Minimise Rose and keep the conversation" }));
    expect(opened()).toBe(false);
    expect(minimisedDock()).not.toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();
    const compass = screen.getByRole("button", { name: "Open Rose" });
    expect(document.activeElement).toBe(compass);
    fireEvent.click(compass);
    expect(opened()).toBe(true);
    expect(minimisedDock()).toBeNull();
    expect(screen.getByRole("button", { name: "What has actually been built?" })).toBeTruthy();
  });

  it("minimise keeps the conversation, and the compass reopens it without typing", () => {
    mount(seed);
    fireEvent.click(screen.getByRole("button", { name: "Reopen the conversation with Rose" }));
    expect(screen.getByText("The loop and its checks.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Minimise Rose and keep the conversation" }));
    expect(screen.queryByText("The loop and its checks.")).toBeNull();
    const compass = screen.getByRole("button", { name: "Reopen the conversation with Rose" });
    expect(document.activeElement).toBe(compass);
    fireEvent.click(compass);
    expect(screen.getByText("The loop and its checks.")).toBeTruthy();
    expect(screen.getByText("What has actually been built?", { selector: "div" })).toBeTruthy();
  });

  it("close returns to the rest bar with the input, and its compass button resumes the conversation", () => {
    mount(seed);
    fireEvent.click(screen.getByRole("button", { name: "Reopen the conversation with Rose" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Close Rose" })[1] ?? screen.getAllByRole("button", { name: "Close Rose" })[0]);
    expect(opened()).toBe(false);
    expect(minimisedDock()).toBeNull();
    expect(screen.getByRole("textbox", { name: "Message Rose" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Reopen the conversation with Rose" }));
    expect(screen.getByText("The loop and its checks.")).toBeTruthy();
  });

  it("Ctrl+K opens the dock from the minimised state", () => {
    mount(seed);
    fireEvent.click(screen.getByRole("button", { name: "Reopen the conversation with Rose" }));
    fireEvent.click(screen.getByRole("button", { name: "Minimise Rose and keep the conversation" }));
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(opened()).toBe(true);
    expect(minimisedDock()).toBeNull();
  });
});
