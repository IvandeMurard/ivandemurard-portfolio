import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RoseDock } from "@/components/rose/RoseDock";
import { ROSE_HOME_PREFILL } from "@/content/roseWelcome";
import { resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";

// Buttons that open Rose always do something visible: when the dock is already open, a short pulse and the input focused;
// the homepage card's "Ask Rose" sends a prefill (a text in the input, selected), not a question.

class NoopObserver { observe() {} unobserve() {} disconnect() {} }
let fetchMock: ReturnType<typeof vi.fn>;
const fire = (type: string, detail?: unknown) => act(() => { window.dispatchEvent(new CustomEvent(type, detail === undefined ? undefined : { detail })); });
const panel = () => document.querySelector("[data-rose-panel]") as HTMLElement;
const input = () => screen.getByRole("textbox", { name: "Message Rose" }) as HTMLTextAreaElement;
const frames = async () => { await act(async () => { await new Promise((r) => setTimeout(r, 60)); }); };

const mount = (open: boolean) => {
  resetRoseChat("test");
  setRoseOpen(open);
  render(<MemoryRouter initialEntries={["/"]}><RoseDock roseStatus="live" /></MemoryRouter>);
};

beforeEach(() => {
  fetchMock = vi.fn(async () => new Response("{}", { status: 500 }));
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  window.sessionStorage.clear();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers(); setRoseOpen(false); });

describe("An open dock acknowledges being asked to open", () => {
  it.each(["rose:open", "rose:ask"])("%s with no text: the panel pulses for 400 ms and the input takes focus", async (type) => {
    mount(true);
    await frames();
    (document.activeElement as HTMLElement | null)?.blur();
    expect(panel().getAttribute("data-pulse")).toBe("false");
    fire(type);
    expect(panel().getAttribute("data-pulse")).toBe("true");
    expect(panel().className).toContain("motion-reduce:shadow-xl"); // no visible pulse under prefers-reduced-motion
    await frames();
    expect(document.activeElement).toBe(input());
    await act(async () => { await new Promise((r) => setTimeout(r, 450)); });
    expect(panel().getAttribute("data-pulse")).toBe("false");
  });

  it("sends nothing and logs nothing", async () => {
    mount(true);
    await frames();
    fetchMock.mockClear();
    fire("rose:open");
    fire("rose:ask");
    await frames();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("a closed dock simply opens, with focus in the input, and no pulse", async () => {
    mount(false);
    fire("rose:open");
    await frames();
    expect(panel().getAttribute("data-pulse")).toBe("false");
    expect(document.activeElement).toBe(input());
  });
});

describe("rose:prefill", () => {
  it.each([true, false])("dock open=%s: the input receives the text, selected, and nothing is submitted", async (open) => {
    mount(open);
    await frames();
    fetchMock.mockClear();
    fire("rose:prefill", { text: ROSE_HOME_PREFILL });
    await act(async () => { await new Promise((r) => setTimeout(r, 120)); });
    expect(input().value).toBe(ROSE_HOME_PREFILL);
    expect(document.activeElement).toBe(input());
    expect([input().selectionStart, input().selectionEnd]).toEqual([0, ROSE_HOME_PREFILL.length]);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Stop" })).toBeNull();
  });

  it("without text it does nothing; rose:ask keeps its meaning (text is a question that is sent)", async () => {
    mount(true);
    await frames();
    fire("rose:prefill", {});
    fire("rose:prefill");
    expect(input().value).toBe("");
    fire("rose:ask", { text: "What has Ivan built?" });
    await frames();
    expect(fetchMock.mock.calls.some(([u]) => String(u).includes("rose-chat"))).toBe(true);
  });
});
