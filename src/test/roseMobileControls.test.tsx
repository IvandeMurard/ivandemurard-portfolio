import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MoodProvider } from "@/components/MoodProvider";
import { RoseDock } from "@/components/rose/RoseDock";
import { getRoseChat, resetRoseChat, selectRecent, setRoseOpen } from "@/components/rose/roseSession";
import { roseLightCommand } from "@/components/rose/roseLightCommand";

class Observer { observe() {} unobserve() {} disconnect() {} }
beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 500 })));
  localStorage.clear();
  sessionStorage.clear();
  resetRoseChat("mobile");
  setRoseOpen(true);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); setRoseOpen(false); });

describe("Rose mobile light controls", () => {
  it.each([
    ["Peux-tu allumer la lumière ?", "day"],
    ["Allume les lumières s’il te plaît", "day"],
    ["Tamise la lumière", "dusk"],
    ["Peux-tu éteindre la lumière ?", "dusk"],
    ["Please dim the lights", "dusk"],
    ["Turn the lights on", "day"],
  ])("%s selects %s", (question, mood) => expect(roseLightCommand(question)?.mood).toBe(mood));

  it.each(["Pourquoi la lumière change-t-elle ?", "Comment allumer la lumière dans Aetherix ?", "Allume la lumière et explique son projet", "Do not turn on the lights", "Could Rose dim the lights?"])("does not intercept informational or ambiguous input: %s", question => {
    expect(roseLightCommand(question)).toBeNull();
  });

  it("switches the actual mood, acknowledges in the conversation, and excludes the local turn from model history", () => {
    localStorage.setItem("mood", "dusk");
    render(<MemoryRouter initialEntries={["/aetherix"]}><MoodProvider><RoseDock roseStatus="live" /></MoodProvider></MemoryRouter>);
    fireEvent.change(screen.getByRole("textbox", { name: "Message Rose" }), { target: { value: "Peux-tu allumer la lumière ?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message to Rose" }));
    expect(document.documentElement.dataset.mood).toBe("day");
    expect(localStorage.getItem("mood")).toBe("day");
    expect(screen.getByText("La lumière est allumée.")).toBeTruthy();
    const chat = getRoseChat("mobile");
    expect(chat.messages).toHaveLength(2);
    expect(selectRecent(chat.messages)).toEqual([]);
    expect(vi.mocked(fetch).mock.calls.some(([url]) => String(url).includes("rose-chat"))).toBe(false);
    fireEvent.change(screen.getByRole("textbox", { name: "Message Rose" }), { target: { value: "Brouillon conservé" } });
    fireEvent.click(screen.getByRole("button", { name: "Minimise Rose and keep the conversation" }));
    expect((screen.getByRole("textbox", { name: "Message Rose" }) as HTMLInputElement).value).toBe("Brouillon conservé");
    fireEvent.click(screen.getByRole("button", { name: "Reopen the conversation with Rose" }));
    expect(screen.getByText("La lumière est allumée.")).toBeTruthy();
    expect((screen.getByRole("textbox", { name: "Message Rose" }) as HTMLTextAreaElement).value).toBe("Brouillon conservé");
    expect(getRoseChat("mobile").messages).toHaveLength(2);
  });

  it("folds only on a deliberate downward header swipe and retains the draft", () => {
    class TouchPointer extends MouseEvent {
      pointerType = "touch";
      pointerId = 1;
    }
    vi.stubGlobal("PointerEvent", TouchPointer);
    render(<MemoryRouter initialEntries={["/aetherix"]}><RoseDock roseStatus="live" /></MemoryRouter>);
    const header = document.querySelector("[data-rose-fold-handle]");
    if (!header) throw new Error("Missing dock header");
    Object.defineProperty(header, "setPointerCapture", { value: vi.fn() });
    fireEvent.change(screen.getByRole("textbox", { name: "Message Rose" }), { target: { value: "Continue later" } });
    fireEvent.pointerDown(header, { clientX: 100, clientY: 100 });
    fireEvent.pointerUp(header, { clientX: 180, clientY: 120 });
    expect(screen.getByRole("log")).toBeTruthy();
    fireEvent.pointerDown(header, { clientX: 100, clientY: 100 });
    fireEvent.pointerUp(header, { clientX: 105, clientY: 180 });
    expect(screen.queryByRole("log")).toBeNull();
    expect((screen.getByRole("textbox", { name: "Message Rose" }) as HTMLInputElement).value).toBe("Continue later");
    fireEvent.click(screen.getByRole("button", { name: "Open Rose" }));
    expect((screen.getByRole("textbox", { name: "Message Rose" }) as HTMLTextAreaElement).value).toBe("Continue later");
  });
});