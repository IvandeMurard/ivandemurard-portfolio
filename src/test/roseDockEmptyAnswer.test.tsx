import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { UIMessage } from "ai";
import { RoseDock } from "@/components/rose/RoseDock";
import { getRoseChat, resetRoseChat, setRoseMinimised, setRoseOpen } from "@/components/rose/roseSession";
import { ROSE_EMPTY_ANSWER } from "@/content/roseStatus";

// An assistant turn that ends with no text (only tool calls) shows one fallback line, not an empty bubble.
class NoopObserver { observe() {} unobserve() {} disconnect() {} }

const user: UIMessage = { id: "u1", role: "user", parts: [{ type: "text", text: "What kind of role is Ivan looking for?" }] };
const toolOnly: UIMessage = { id: "a1", role: "assistant", parts: [{ type: "tool-suggest_followups", toolCallId: "t1", state: "input-available", input: { items: ["Would you tell me more about his work?"] } } as never] };
const answered: UIMessage = { id: "a2", role: "assistant", parts: [{ type: "text", text: "He is open to AI Product Manager and Product Builder roles." }] };

const open = (messages: UIMessage[]) => {
  resetRoseChat("test").messages = messages;
  render(<MemoryRouter initialEntries={["/aetherix"]}><RoseDock roseStatus="live" /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: /^(Open Rose|Reopen the conversation with Rose)$/ }));
};
const fallbackShown = () => screen.queryAllByText(/I could not write an answer this time/).length;

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  setRoseOpen(false);
  setRoseMinimised(false);
  window.sessionStorage.clear();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); void getRoseChat("test"); });

describe("An assistant turn with no text", () => {
  it("says the line from the brief, with a CV link", () => {
    expect(ROSE_EMPTY_ANSWER).toBe("I could not write an answer this time. The [CV](/cv) and the case studies have the details.");
  });

  it("shows one fallback line instead of an empty bubble, and links the CV", () => {
    open([user, toolOnly]);
    expect(fallbackShown()).toBe(1);
    expect(screen.getByRole("link", { name: "CV" }).getAttribute("href")).toBe("/cv");
  });

  it("makes no extra request: the line is front end only", () => {
    const fetchMock = vi.fn(async (_url: string) => new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    open([user, toolOnly]);
    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes("rose-chat"))).toHaveLength(0);
  });

  it("is not shown for a turn that has text", () => {
    open([user, answered]);
    expect(fallbackShown()).toBe(0);
    expect(screen.getByText(/open to AI Product Manager and Product Builder roles/)).toBeTruthy();
  });
});

describe("The evaluation script", () => {
  it("flags an answer with no text as a failure", async () => {
    const { readFileSync } = await import("node:fs");
    const source = readFileSync("scripts/rose-stage-b-check.ts", "utf8");
    expect(source).toMatch(/if \(!text\.trim\(\)\) errors\.push\(\{ type: "empty-answer"/);
  });
});
