import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { existsSync, readFileSync } from "node:fs";
import type { UIMessage } from "ai";
import { ListenPlayer } from "@/components/rose/listen/ListenPlayer";
import { ListenUnavailable, canListen, listenPayload, loadSummaryAudio, type ListenData } from "@/components/rose/listen/listenClient";
import { activeWordIndex, seekFromKey, sentencesOf, waveformPeaks } from "@/components/rose/listen/listenAlign";
import { RoseDock } from "@/components/rose/RoseDock";
import { getRoseChat, resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";
import { LISTEN_SUMMARIES } from "@/content/listenSummaries";

class NoopObserver { observe() {} unobserve() {} disconnect() {} }

const words = ["How", "do", "you", "know", "it", "works?"].map((w, i) => ({ w, s: i * 1000, e: i * 1000 + 900 }));
const data: ListenData = { text: "How do you know it works?", words, audioUrl: "/listen/x.mp3", durationMs: 6000 };

/** A controllable stand-in for HTMLAudioElement. */
class FakeAudio {
  static last: FakeAudio;
  currentTime = 0; paused = true; preload = "";
  onplay: (() => void) | null = null; onpause: (() => void) | null = null; onended: (() => void) | null = null; ontimeupdate: (() => void) | null = null;
  constructor(public src: string) { FakeAudio.last = this; }
  play() { this.paused = false; this.onplay?.(); return Promise.resolve(); }
  pause() { this.paused = true; this.onpause?.(); }
}

const media = (reduced: boolean) => vi.stubGlobal("matchMedia", (q: string) => ({
  matches: reduced && q.includes("prefers-reduced-motion"), media: q, addEventListener() {}, removeEventListener() {},
}));

beforeEach(() => {
  vi.stubGlobal("Audio", FakeAudio);
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  media(false);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const mountPlayer = (extra: Partial<React.ComponentProps<typeof ListenPlayer>> = {}) =>
  render(<ListenPlayer label="summary of this page" load={async () => data} fallbackText={data.text} {...extra} />);
const wordState = (i: number) => document.querySelector(`[data-word="${i}"]`)?.getAttribute("data-state");
const tick = async (ms: number) => { FakeAudio.last.currentTime = ms / 1000; await act(async () => { FakeAudio.last.ontimeupdate?.(); }); };

describe("Listen audiogram", () => {
  it("shows the label, the whole text, and the word spoken in dark with the rest faded", async () => {
    mountPlayer();
    await screen.findByRole("button", { name: "Pause" });
    expect(screen.getByText(/Rose · summary of this page/)).toBeTruthy();
    expect(document.querySelector("[data-listen-text]")?.textContent?.replace(/\s+/g, " ").trim()).toBe(data.text);
    await tick(2500);
    await waitFor(() => expect(wordState(2)).toBe("current"));
    expect(wordState(0)).toBe("spoken");
    expect(wordState(5)).toBe("next");
  });

  it("reports one start and one completion", async () => {
    const onStart = vi.fn(), onComplete = vi.fn();
    mountPlayer({ onStart, onComplete });
    await screen.findByRole("button", { name: "Pause" });
    expect(onStart).toHaveBeenCalledTimes(1);
    await act(async () => { FakeAudio.last.onended?.(); });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("with reduced motion, shows no moving highlight, only the progress", async () => {
    media(true);
    mountPlayer();
    await screen.findByRole("button", { name: "Pause" });
    await tick(2500);
    expect(document.querySelectorAll("[data-state]").length).toBe(0);
    expect(document.querySelector('[data-word="2"]')?.className).not.toContain("bg-secondary");
    const slider = screen.getByRole("slider", { name: "Position in the reading" });
    await waitFor(() => expect(slider.getAttribute("aria-valuenow")).toBe("3"));
    expect(slider.getAttribute("aria-valuetext")).toBe("0:03 of 0:06");
  });

  it("is driven from the keyboard: play, seek on the waveform, back to the start, switch", async () => {
    mountPlayer();
    const play = await screen.findByRole("button", { name: "Pause" });
    fireEvent.click(play);
    expect(FakeAudio.last.paused).toBe(true);
    const slider = screen.getByRole("slider", { name: "Position in the reading" });
    expect(slider.getAttribute("tabindex")).toBe("0");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(FakeAudio.last.currentTime).toBe(5);
    fireEvent.keyDown(slider, { key: "End" });
    expect(FakeAudio.last.currentTime).toBe(6);
    fireEvent.keyDown(slider, { key: "Home" });
    expect(FakeAudio.last.currentTime).toBe(0);
    for (const b of screen.getAllByRole("button")) expect(b.getAttribute("tabindex")).not.toBe("-1");
  });

  it("keeps the position when switching to Read and back to Listen", async () => {
    mountPlayer();
    await screen.findByRole("button", { name: "Pause" });
    await tick(3200);
    fireEvent.click(screen.getByRole("button", { name: "read" }));
    // Reading is silent and the text stays whole.
    expect(FakeAudio.last.paused).toBe(true);
    expect(document.querySelector("[data-listen-text]")?.textContent?.replace(/\s+/g, " ").trim()).toBe(data.text);
    expect(screen.queryByRole("slider")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "listen" }));
    expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("3");
    expect(FakeAudio.last.currentTime).toBe(3.2);
  });

  it("has no live region that could announce the highlight", async () => {
    mountPlayer();
    await screen.findByRole("button", { name: "Pause" });
    const root = document.querySelector("[data-listen-player]")!;
    expect(root.getAttribute("aria-live")).toBe("off");
    expect(root.querySelector('[aria-live]:not([aria-live="off"]), [role="status"], [role="log"]')).toBeNull();
  });

  it("reads with the browser's voice, sentence by sentence, when there is no generated audio", async () => {
    const spoken: string[] = [];
    vi.stubGlobal("SpeechSynthesisUtterance", class { onend: (() => void) | null = null; onerror = null; lang = ""; constructor(public text: string) {} });
    vi.stubGlobal("speechSynthesis", { cancel() {}, speak(u: { text: string; onend: () => void }) { spoken.push(u.text); }, });
    mountPlayer({ fallbackText: "First sentence here. Second sentence follows.", load: async () => { throw new ListenUnavailable(429); } });
    await waitFor(() => expect(spoken).toEqual(["First sentence here."]));
    expect(screen.getByText(/browser's voice/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Pause" })).toBeTruthy();
  });
});

describe("Listen helpers", () => {
  it("finds the word being spoken", () => {
    expect(activeWordIndex(words, -1)).toBe(-1);
    expect(activeWordIndex(words, 0)).toBe(0);
    expect(activeWordIndex(words, 2500)).toBe(2);
    expect(activeWordIndex(words, 99_000)).toBe(5);
  });
  it("splits sentences with their first word", () => {
    expect(sentencesOf("One two. Three four five! Six?")).toEqual([
      { text: "One two.", firstWord: 0, wordCount: 2 },
      { text: "Three four five!", firstWord: 2, wordCount: 3 },
      { text: "Six?", firstWord: 5, wordCount: 1 },
    ]);
  });
  it("scales the waveform to the loudest slice and never draws an empty bar", () => {
    const peaks = waveformPeaks(Float32Array.from([0, 0, 0.5, -1, 0, 0, 0.25, 0]), 4);
    expect(peaks).toEqual([0.12, 1, 0.12, 0.25]);
  });
  it("steps 5 seconds on the arrows and clamps", () => {
    expect(seekFromKey("ArrowRight", 4000, 6000)).toBe(6000);
    expect(seekFromKey("ArrowLeft", 2000, 6000)).toBe(0);
    expect(seekFromKey("a", 0, 6000)).toBeNull();
  });
});

describe("Listen client", () => {
  const msg = (over: Record<string, unknown> = {}): UIMessage => ({
    id: "a1", role: "assistant", parts: [{ type: "text", text: "A fact." }, { type: "tool-propose_booking" } as never],
    metadata: { rose_sig: "sig", rose_issued_at: 1, rose_register: "factual", ...over },
  });
  it("offers Listen only on a signed factual answer", () => {
    expect(canListen(msg())).toBe(true);
    expect(canListen(msg({ rose_register: "light" }))).toBe(false);
    expect(canListen(msg({ rose_sig: undefined }))).toBe(false);
    expect(canListen({ ...msg(), role: "user" })).toBe(false);
  });
  it("sends the signed text parts and the signature, nothing else of the conversation", () => {
    expect(listenPayload("s1", msg())).toEqual({
      session_id: "s1",
      message: { id: "a1", parts: [{ type: "text", text: "A fact." }], metadata: { rose_sig: "sig", rose_issued_at: 1, rose_register: "factual" } },
    });
  });
  it("reads both spellings of a summary file: {w, s, e} and {w, start, end}, in milliseconds", async () => {
    const serve = (body: unknown) => vi.fn(async () => new Response(JSON.stringify(body), { status: 200 }));
    const a = await loadSummaryAudio("x", serve({ text: "Hi you", words: [{ w: "Hi", s: 0, e: 300 }, { w: "you", s: 400, e: 700 }], durationMs: 800 }) as never);
    expect(a).toEqual({ text: "Hi you", words: [{ w: "Hi", s: 0, e: 300 }, { w: "you", s: 400, e: 700 }], audioUrl: "/listen/x.mp3", durationMs: 800 });
    const b = await loadSummaryAudio("x", serve({ audio: "take.mp3", words: [{ w: "Hi", start: 0, end: 300 }, { w: "you", start: 400, end: 700 }], durationMs: 800 }) as never);
    expect(b).toEqual({ text: "Hi you", words: [{ w: "Hi", s: 0, e: 300 }, { w: "you", s: 400, e: 700 }], audioUrl: "/listen/take.mp3", durationMs: 800 });
    // An audio name that is not a plain mp3 file name is ignored.
    const c = await loadSummaryAudio("x", serve({ audio: "../x.mp3", words: [{ w: "Hi", start: 0, end: 1 }], durationMs: 1 }) as never);
    expect(c.audioUrl).toBe("/listen/x.mp3");
  });
  it("every recorded summary in public/listen says exactly the validated text, word for word", () => {
    for (const [slug, s] of Object.entries(LISTEN_SUMMARIES)) {
      const file = `public/listen/${slug}.json`;
      if (!existsSync(file)) continue; // not recorded yet: the browser voice reads it
      const j = JSON.parse(readFileSync(file, "utf8")) as { words: { w: string }[]; durationMs: number };
      expect(j.words.map((w) => w.w), slug).toEqual(s.text.split(/\s+/).filter(Boolean));
      expect(j.durationMs).toBeGreaterThan(0);
      expect(existsSync(`public/listen/${slug}.mp3`), `${slug}.mp3`).toBe(true);
    }
  });
  it("treats an app shell served for a missing summary file as missing", async () => {
    const shell = vi.fn(async () => new Response("<html></html>", { status: 200 }));
    await expect(loadSummaryAudio("nope", shell as never)).rejects.toBeInstanceOf(ListenUnavailable);
  });
});

describe("Listen in the dock", () => {
  const slug = "harnesses-graders-closed-loops";
  const mount = (path: string, messages: UIMessage[] = []) => {
    const chat = resetRoseChat("test");
    chat.messages = messages;
    setRoseOpen(true);
    render(<MemoryRouter initialEntries={[path]}><RoseDock roseStatus="live" /></MemoryRouter>);
  };
  beforeEach(() => { window.sessionStorage.clear(); });
  afterEach(() => { void getRoseChat("test"); });

  it("offers the summary as the starter question, with its length, on the page that has one only", () => {
    mount(LISTEN_SUMMARIES[slug].path);
    expect(screen.getByRole("button", { name: /^Listen to a summary of this page · \d+ (min|sec)$/ })).toBeTruthy();
    cleanup();
    mount("/cv");
    expect(screen.queryByRole("button", { name: /Listen to a summary/ })).toBeNull();
  });

  it("shows a Listen button under a factual signed answer, never under a light one, and keeps the written answer", () => {
    const base = (id: string, register: string): UIMessage => ({ id, role: "assistant", parts: [{ type: "text", text: `Answer ${id}.` }], metadata: { rose_sig: "s", rose_issued_at: Date.now(), rose_register: register } });
    mount("/cv", [
      { id: "u1", role: "user", parts: [{ type: "text", text: "What is built?" }] }, base("f1", "factual"),
      { id: "u2", role: "user", parts: [{ type: "text", text: "Hello" }] }, base("l1", "light"),
    ]);
    expect(screen.getAllByRole("button", { name: "Listen" })).toHaveLength(1);
    expect(screen.getByText("Answer f1.")).toBeTruthy();
    expect(screen.getByText("Answer l1.")).toBeTruthy();
  });
});
