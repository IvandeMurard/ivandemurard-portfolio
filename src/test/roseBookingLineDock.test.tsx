import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { UIMessage } from "ai";

const logged: unknown[] = [];
vi.mock("@/components/rose/roseEvents", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/components/rose/roseEvents")>()),
  logRoseEvent: (e: unknown) => { logged.push(e); },
}));

import { RoseDock } from "@/components/rose/RoseDock";
import { getRoseChat, resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";
import { CAL_URL } from "@/components/rose/roseConfig";

class NoopObserver { observe() {} unobserve() {} disconnect() {} }

const LINE = "If this fits a role you are hiring for, book a call with Ivan.";
const question: UIMessage = { id: "u1", role: "user", parts: [{ type: "text", text: "Is Ivan open to a Head of Product role?" }] };
const withLine = (id = "a1", copies = 1): UIMessage => ({
  id, role: "assistant",
  parts: [
    { type: "text", text: "He is open to AI Product Manager and Product Builder roles. Head of Product is not listed." },
    ...Array.from({ length: copies }, () => ({ type: "data-booking-line", data: { show: true } })),
  ] as never,
});
const plain = (id = "a2"): UIMessage => ({ id, role: "assistant", parts: [{ type: "text", text: "Aetherix is staged on Fly.io." }] });

const mount = (messages: UIMessage[], status: "live" | "paused" = "live") => {
  const chat = resetRoseChat("test");
  chat.messages = messages;
  render(<MemoryRouter initialEntries={["/aetherix"]}><RoseDock roseStatus={status} /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: /^(Open Rose|Reopen the conversation with Rose)$/ }));
  return chat;
};
const lines = () => Array.from(document.querySelectorAll("[data-booking-line]"));
const textOf = (el: Element) => el.textContent?.replace(/\s+/g, " ").trim();

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  logged.length = 0;
  setRoseOpen(false);
  window.sessionStorage.clear();
  window.open = vi.fn();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); void getRoseChat("test"); });

describe("The booking line under a profile answer", () => {
  it("has this exact text, with only 'book a call with Ivan' as the link, and no arrow or card", () => {
    mount([question, withLine()]);
    expect(lines()).toHaveLength(1);
    expect(textOf(lines()[0])).toBe(LINE);
    const link = screen.getByRole("button", { name: "Book a call with Ivan (opens cal.com in a new tab)" });
    expect(link.textContent).toBe("book a call with Ivan");
    expect(textOf(lines()[0])).not.toContain("↗");
    expect(lines()[0].querySelector("svg")).toBeTruthy(); // the compass mark
    expect(lines()[0].className).not.toMatch(/rounded|shadow|bg-/); // a rule and a line, not a card
  });

  it("is a real button with a visible focus ring", () => {
    mount([question, withLine()]);
    const link = screen.getByRole("button", { name: /^Book a call with Ivan/ });
    expect(link.tagName).toBe("BUTTON");
    expect(link.className).toContain("focus-visible:ring-2");
  });

  it("appears once per answer, even if the signal came twice", () => {
    mount([question, withLine("a1", 2)]);
    expect(lines()).toHaveLength(1);
  });

  it("is not shown on an answer without the signal", () => {
    mount([question, plain()]);
    expect(lines()).toHaveLength(0);
  });

  it("is shown only after the stream ends", () => {
    const chat = mount([question, withLine()]);
    const state = (chat as unknown as { state: { status: string } }).state;
    act(() => { state.status = "streaming"; });
    expect(lines()).toHaveLength(0);
    act(() => { state.status = "ready"; });
    expect(lines()).toHaveLength(1);
  });

  it("is not shown in the paused state", () => {
    mount([question, withLine()], "paused");
    expect(lines()).toHaveLength(0);
  });

  it("sits under the answer text, before the follow-up questions", () => {
    mount([question, withLine()]);
    const line = lines()[0];
    const answer = screen.getByText(/He is open to AI Product Manager/);
    expect(answer.compareDocumentPosition(line) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const followups = document.querySelector('[aria-label="Suggested follow-ups"]');
    if (followups) expect(line.compareDocumentPosition(followups) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("does what the 'Book a call' chip does: the same event, the same tab", () => {
    // The chip, on an empty conversation.
    mount([]);
    fireEvent.click(screen.getByRole("button", { name: "Book a call (opens cal.com in a new tab)" }));
    const chipEvents = logged.filter((e) => (e as { kind?: string }).kind === "booking_clicked");
    const chipOpen = (window.open as unknown as ReturnType<typeof vi.fn>).mock.calls.slice();
    expect(chipEvents).toHaveLength(1);
    expect(chipOpen).toEqual([[CAL_URL, "_blank", "noopener,noreferrer"]]);

    cleanup();
    logged.length = 0;
    (window.open as unknown as ReturnType<typeof vi.fn>).mockClear();
    setRoseOpen(false);

    // The line, under a profile answer.
    mount([question, withLine()]);
    fireEvent.click(screen.getByRole("button", { name: /^Book a call with Ivan/ }));
    expect(logged.filter((e) => (e as { kind?: string }).kind === "booking_clicked")).toEqual(chipEvents);
    expect((window.open as unknown as ReturnType<typeof vi.fn>).mock.calls).toEqual(chipOpen);
  });
});
