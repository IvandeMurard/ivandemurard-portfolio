import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RoseDock } from "@/components/rose/RoseDock";
import { resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";
import { ROSE_DATA_SHORT } from "@/content/roseDataContract";
import { ROSE_PAUSED, ROSE_STATUS } from "@/content/roseStatus";

class NoopObserver { observe() {} unobserve() {} disconnect() {} }

const MESSAGE = "Rose has run out of credits and will be back soon. The case studies and the CV answer most questions. For anything else, contact me.";
let fetchMock: ReturnType<typeof vi.fn>;

const mount = (status: "paused" | "live") => {
  resetRoseChat("test");
  render(<MemoryRouter initialEntries={["/aetherix"]}><RoseDock roseStatus={status} /></MemoryRouter>);
};
const calls = (needle: string) => fetchMock.mock.calls.filter(([url]) => String(url).includes(needle));
const ask = (text: string) => act(() => { window.dispatchEvent(new CustomEvent("rose:ask", { detail: { text } })); });

beforeEach(() => {
  fetchMock = vi.fn(async () => new Response("{}", { status: 500 }));
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  setRoseOpen(false);
  window.sessionStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Rose paused state", () => {
  it("ships live; the paused cases below render roseStatus=\"paused\" explicitly", () => {
    expect(ROSE_STATUS).toBe("live");
    expect(ROSE_PAUSED.text).toBe(MESSAGE);
  });

  it("shows the message with a CV link and a contact link, and keeps the data notice", () => {
    mount("paused");
    fireEvent.click(screen.getByRole("button", { name: "Open Rose" }));
    expect(screen.getByText(MESSAGE)).toBeTruthy();
    expect(screen.getByRole("link", { name: "CV" }).getAttribute("href")).toBe("/cv");
    expect(screen.getByRole("link", { name: "Contact" }).getAttribute("href")).toBe("/contact");
    expect(screen.getByRole("link", { name: ROSE_DATA_SHORT.linkLabel }).getAttribute("href")).toBe(ROSE_DATA_SHORT.href);
  });

  it("hides the input and the starter chips", () => {
    mount("paused");
    fireEvent.click(screen.getByRole("button", { name: "Open Rose" }));
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.queryByRole("button", { name: "Send message to Rose" })).toBeNull();
    expect(document.querySelector('[aria-label="Suggested follow-ups"]')).toBeNull();
    // Only the dock controls remain as buttons: no starter chip.
    const names = screen.getAllByRole("button").map((b) => b.getAttribute("aria-label") ?? b.textContent);
    expect(names.every((n) => /Rose|Close|Minimise|Clear|Cancel|Yes/.test(n ?? ""))).toBe(true);
  });

  it("makes no network call to rose-chat or rose-event, even when asked", () => {
    mount("paused");
    fireEvent.click(screen.getByRole("button", { name: "Open Rose" }));
    ask("What has Ivan actually built?");
    expect(screen.getByText(MESSAGE)).toBeTruthy();
    expect(calls("rose-chat")).toHaveLength(0);
    expect(calls("rose-event")).toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("Rose live state", () => {
  it("shows the input, no paused message, and sends a question to rose-chat", async () => {
    mount("live");
    fireEvent.click(screen.getByRole("button", { name: "Open Rose" }));
    expect(screen.getAllByRole("textbox", { name: "Message Rose" })).toHaveLength(1);
    expect(screen.queryByText(MESSAGE)).toBeNull();
    ask("What has Ivan actually built?");
    await vi.waitFor(() => expect(calls("rose-chat").length).toBeGreaterThan(0));
  });
});

describe("Rose unavailable (quota or credits refused by the provider)", () => {
  const answerChatWith = (status: number, body: string) => {
    fetchMock.mockImplementation(async (url: string) => String(url).includes("rose-chat")
      ? new Response(body, { status, headers: { "Content-Type": "application/json" } })
      : new Response("{}", { status: 200 }));
  };

  it("shows the paused notice for rose_unavailable, in place of the generic error, without a page change", async () => {
    answerChatWith(503, JSON.stringify({ error: "rose_unavailable" }));
    mount("live");
    fireEvent.click(screen.getByRole("button", { name: "Open Rose" }));
    ask("What has Ivan actually built?");
    await vi.waitFor(() => expect(screen.getByText(MESSAGE)).toBeTruthy());
    expect(screen.queryByText(/Rose lost the thread/)).toBeNull();
    expect(screen.getByRole("link", { name: "CV" }).getAttribute("href")).toBe("/cv");
    expect(screen.getByRole("link", { name: "Contact" }).getAttribute("href")).toBe("/contact");
    // Same page, and the conversation input is still there for later.
    expect(screen.getAllByRole("textbox", { name: "Message Rose" })).toHaveLength(1);
  });

  it("keeps today's message for any other error", async () => {
    answerChatWith(500, JSON.stringify({ error: "boom" }));
    mount("live");
    fireEvent.click(screen.getByRole("button", { name: "Open Rose" }));
    ask("What has Ivan actually built?");
    await vi.waitFor(() => expect(screen.getByText(/Rose lost the thread for a moment/)).toBeTruthy());
    expect(screen.queryByText(MESSAGE)).toBeNull();
  });
});
