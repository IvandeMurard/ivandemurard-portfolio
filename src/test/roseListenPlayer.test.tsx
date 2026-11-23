import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { existsSync, readFileSync } from "node:fs";
import type { UIMessage } from "ai";
import { ListenPlayer } from "@/components/rose/listen/ListenPlayer";
import { ListenMini } from "@/components/rose/listen/ListenMini";
import { ListenWave } from "@/components/rose/listen/ListenWave";
import { ListenUnavailable, canListen, listenPayload, loadSummaryAudio, requestAnswerAudio, type ListenData } from "@/components/rose/listen/listenClient";
import { activeWordIndex, segmentsOf, seekFromKey, sentencesOf } from "@/components/rose/listen/listenAlign";
import { ListenProvider, useListen, type ListenControls, type ListenRequest } from "@/components/listen/ListenProvider";
import { ListenBadge } from "@/components/listen/ListenBadge";
import { ListenTocLine } from "@/components/listen/ListenTocLine";
import { AMBIENCE_SRC, AmbienceProvider } from "@/components/AmbienceProvider";
import AmbienceControl from "@/components/AmbienceControl";
import { MoodProvider } from "@/components/MoodProvider";
import { RoseDock } from "@/components/rose/RoseDock";
import { getRoseChat, resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";
import { LISTEN_SUMMARIES } from "@/content/listenSummaries";
import { barsFromAudio, isBars, rmsBars } from "../../supabase/functions/_shared/listen-core";
import * as events from "@/components/rose/roseEvents";

vi.mock("@/components/rose/roseEvents", async (orig) => ({ ...(await orig<typeof import("@/components/rose/roseEvents")>()), logRoseEvent: vi.fn() }));

class NoopObserver { observe() {} unobserve() {} disconnect() {} }

const text = "First part is here. Second part follows now.";
const words = text.split(" ").map((w, i) => ({ w, s: i * 1000, e: i * 1000 + 900 }));
const bars72 = Array.from({ length: 72 }, (_, i) => (i % 9) / 10);
const data: ListenData = { text, words, audioUrl: "/listen/x.mp3", durationMs: 8000, bars: bars72 };

/** A controllable stand-in for HTMLAudioElement. */
class FakeAudio {
  static last: FakeAudio;
  static all: FakeAudio[] = [];
  currentTime = 0; paused = true; preload = ""; volume = 1; muted = false; playbackRate = 1; loop = false; src = "";
  onplay: (() => void) | null = null; onpause: (() => void) | null = null; onended: (() => void) | null = null; ontimeupdate: (() => void) | null = null;
  pauses = 0;
  constructor(src?: string) { this.src = src ?? ""; FakeAudio.all.push(this); if (src?.startsWith("/listen/")) FakeAudio.last = this; }
  play() { this.paused = false; this.onplay?.(); return Promise.resolve(); }
  pause() { this.paused = true; this.pauses++; this.onpause?.(); }
}
const readings = () => FakeAudio.all.filter((a) => a.src.startsWith("/listen/"));

const media = (reduced: boolean) => vi.stubGlobal("matchMedia", (q: string) => ({
  matches: reduced && q.includes("prefers-reduced-motion"), media: q, addEventListener() {}, removeEventListener() {},
}));

beforeEach(() => {
  FakeAudio.all = [];
  vi.stubGlobal("Audio", FakeAudio);
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  vi.stubGlobal("ResizeObserver", NoopObserver);
  Element.prototype.scrollIntoView = vi.fn();
  vi.mocked(events.logRoseEvent).mockClear();
  media(false);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); window.localStorage.clear(); });

let ctl: ListenControls;
const Probe = () => { ctl = useListen(); return null; };
const request = (over: Partial<ListenRequest> = {}): ListenRequest => ({
  id: "summary:test", kind: "summary", title: "A test page", entry: "row", load: async () => data, fallbackText: text, ...over,
});
const GoTo = ({ to }: { to: string }) => { const go = useNavigate(); return <button onClick={() => go(to)}>go {to}</button>; };

const mount = (children?: React.ReactNode, opts: { ambience?: boolean } = {}) => {
  const tree = (
    <MemoryRouter initialEntries={["/a"]}>
      <ListenProvider>
        <Probe />
        <Routes>
          <Route path="/a" element={<><GoTo to="/b" />{children}</>} />
          <Route path="/b" element={<p>page b</p>} />
        </Routes>
      </ListenProvider>
    </MemoryRouter>
  );
  return render(opts.ambience ? <MoodProvider><AmbienceProvider>{tree}</AmbienceProvider></MoodProvider> : tree);
};
const begin = async (req: ListenRequest = request()) => {
  act(() => { ctl.start(req); });
  await waitFor(() => expect(ctl.phase).toBe("ready"));
};
const tick = async (ms: number) => { FakeAudio.last.currentTime = ms / 1000; await act(async () => { FakeAudio.last.ontimeupdate?.(); }); };
const phraseWords = () => [...document.querySelectorAll("[data-listen-phrase] [data-word]")] as HTMLElement[];

describe("Listen phrases", () => {
  it("cuts a sentence into phrases: whole sentences up to 9 words, a comma or a colon above that, never over 16", () => {
    const w = (s: string) => s.split(" ");
    expect(segmentsOf(w("One two three. Four five six seven."))).toEqual([{ from: 0, to: 2 }, { from: 3, to: 6 }]);
    // 11 words: cut after the comma, and "First," (1 word) stays with what follows.
    expect(segmentsOf(w("First, 61 answers right out of 64, and the release still failed."))).toEqual([{ from: 0, to: 6 }, { from: 7, to: 11 }]);
    // Over 9 words with a colon.
    expect(segmentsOf(w("The rule was agreed before the engine started: one mistake fails the route."))).toEqual([{ from: 0, to: 7 }, { from: 8, to: 12 }]);
    // No comma: a sentence of 9 words or fewer stays whole, a longer one is cut in equal parts under 16.
    expect(segmentsOf(w("a b c d e f g h i"))).toEqual([{ from: 0, to: 8 }]);
    const long = Array.from({ length: 20 }, (_, i) => `w${i}`);
    expect(segmentsOf(long)).toEqual([{ from: 0, to: 9 }, { from: 10, to: 19 }]);
    for (const s of Object.values(LISTEN_SUMMARIES)) {
      const seg = segmentsOf(s.text.split(/\s+/).filter(Boolean));
      expect(Math.max(...seg.map((x) => x.to - x.from + 1)), s.path).toBeLessThanOrEqual(16);
      expect(seg[0].from).toBe(0);
      expect(seg.at(-1)!.to).toBe(s.text.split(/\s+/).filter(Boolean).length - 1);
    }
  });
  it("finds the word being spoken", () => {
    expect(activeWordIndex(words, -1)).toBe(-1);
    expect(activeWordIndex(words, 2500)).toBe(2);
    expect(activeWordIndex(words, 99_000)).toBe(words.length - 1);
  });
  it("splits sentences for the browser's voice, with their first word", () => {
    expect(sentencesOf("One two. Three four five! Six?").map((s) => s.firstWord)).toEqual([0, 2, 5]);
  });
  it("steps 5 seconds on the arrows and clamps", () => {
    expect(seekFromKey("ArrowRight", 4000, 6000)).toBe(6000);
    expect(seekFromKey("ArrowLeft", 2000, 6000)).toBe(0);
    expect(seekFromKey("a", 0, 6000)).toBeNull();
  });
});

describe("Listen waveform data", () => {
  it("is 72 RMS bars scaled to the loudest, and a bad field is ignored", async () => {
    const samples = new Float32Array(7200).map((_, i) => (i < 3600 ? 0.25 : 0.5) * Math.sin(i));
    const bars = rmsBars(samples);
    expect(bars).toHaveLength(72);
    expect(Math.max(...bars)).toBe(1);
    expect(bars.every((b) => b >= 0 && b <= 1)).toBe(true);
    expect(bars[0]).toBeLessThan(bars[71]);
    expect(isBars(bars)).toBe(true);
    expect(isBars([0.1, 2])).toBe(false);
    expect(await barsFromAudio(new Uint8Array(4), async () => samples)).toHaveLength(72);
    expect(await barsFromAudio(new Uint8Array(4), async () => { throw new Error("odd stream"); })).toBeNull();
    expect(await barsFromAudio(new Uint8Array(4), undefined)).toBeNull();
    expect(await barsFromAudio(new Uint8Array(4), async () => new Float32Array(100))).toBeNull();
  });
  it("every summary in listenSummaries.ts has a .json with 72 bars, each between 0 and 1", () => {
    for (const slug of Object.keys(LISTEN_SUMMARIES)) {
      expect(existsSync(`public/listen/${slug}.json`), `${slug}.json`).toBe(true);
      const j = JSON.parse(readFileSync(`public/listen/${slug}.json`, "utf8")) as { bars?: unknown };
      expect(Array.isArray(j.bars) ? j.bars.length : null, `${slug}: bars`).toBe(72);
      expect(isBars(j.bars), `${slug}: values from 0 to 1`).toBe(true);
    }
  });
});

describe("Listen player", () => {
  it("shows one phrase at a time, the spoken words in ink and the words to come lighter, the previous phrase above", async () => {
    mount(<ListenPlayer />);
    await begin();
    await tick(500);
    await waitFor(() => expect(phraseWords().length).toBe(4));
    expect(phraseWords().map((e) => e.textContent)).toEqual(["First", "part", "is", "here."]);
    expect(document.querySelector("[data-listen-previous]")).toBeNull();
    expect(phraseWords()[0].dataset.tone).toBe("ink");
    expect(phraseWords()[3].dataset.tone).toBe("upcoming");
    await tick(5500);
    await waitFor(() => expect(phraseWords().map((e) => e.textContent)).toEqual(["Second", "part", "follows", "now."]));
    expect(document.querySelector("[data-listen-previous]")?.textContent).toBe("First part is here.");
    expect(phraseWords()[1].dataset.tone).toBe("ink");
    expect(phraseWords()[3].dataset.tone).toBe("upcoming");
    expect(screen.getByText(/Rose · summary of this page/)).toBeTruthy();
    expect(screen.getByText("A test page")).toBeTruthy();
  });

  it("labels an answer 'Rose · answer'", async () => {
    mount(<ListenPlayer />);
    await begin(request({ id: "answer:1", kind: "answer", title: "Rose · answer", entry: "answer" }));
    expect(document.querySelector("[data-listen-label]")?.textContent).toContain("Rose · answer");
  });

  it("with reduced motion, the whole phrase is in full ink and nothing changes word by word", async () => {
    media(true);
    mount(<ListenPlayer />);
    await begin();
    await tick(500);
    await waitFor(() => expect(phraseWords().length).toBe(4));
    for (const w of phraseWords()) expect(w.dataset.tone).toBe("ink");
    // The waveform still fills.
    await tick(4000);
    expect(screen.getByRole("slider", { name: "Position in the reading" }).getAttribute("aria-valuenow")).toBe("4");
  });

  it("the waveform is a slider of 72 bars: a click moves, the arrows step 5 s", async () => {
    mount(<ListenPlayer />);
    await begin();
    const slider = screen.getByRole("slider", { name: "Position in the reading" });
    expect(slider.querySelectorAll("[data-bar]")).toHaveLength(72);
    slider.getBoundingClientRect = () => ({ left: 100, width: 400, top: 0, right: 500, bottom: 44, height: 44, x: 100, y: 0, toJSON() {} });
    fireEvent.click(slider, { clientX: 200 });
    expect(FakeAudio.last.currentTime).toBe(2);
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(FakeAudio.last.currentTime).toBe(7);
    fireEvent.keyDown(slider, { key: "Home" });
    expect(FakeAudio.last.currentTime).toBe(0);
  });

  it("draws a progress line when the take has no bars", async () => {
    mount(<ListenPlayer />);
    await begin(request({ load: async () => ({ ...data, bars: undefined }) }));
    expect(document.querySelector("[data-listen-wave]")?.getAttribute("data-listen-wave")).toBe("line");
    expect(document.querySelectorAll("[data-bar]")).toHaveLength(0);
  });

  it("-10 s, +10 s, speed and play are 44 px targets or more with a label, and they drive the audio", async () => {
    mount(<ListenPlayer />);
    await begin();
    await tick(3000);
    fireEvent.click(screen.getByRole("button", { name: "Forward 10 seconds" }));
    expect(FakeAudio.last.currentTime).toBe(8);
    fireEvent.click(screen.getByRole("button", { name: "Back 10 seconds" }));
    expect(FakeAudio.last.currentTime).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: /^Speed 1, change to 1.25/ }));
    expect(FakeAudio.last.playbackRate).toBe(1.25);
    fireEvent.click(screen.getByRole("button", { name: /^Speed 1.25/ }));
    expect(FakeAudio.last.playbackRate).toBe(1.5);
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(FakeAudio.last.paused).toBe(true);
    for (const b of screen.getAllByRole("button")) expect(b.getAttribute("aria-label") ?? b.textContent, "a name").toBeTruthy();
    // The play button is 60 px, the others 44 (classes: the layout engine is not here).
    expect(screen.getByRole("button", { name: "Play" }).className).toContain("h-[60px]");
    expect(screen.getByRole("button", { name: "Back 10 seconds" }).className).toContain("h-11");
  });

  it("volume: the slider sets it, the mute button mutes and restores", async () => {
    mount(<ListenPlayer />);
    await begin();
    const volume = document.querySelector("[data-listen-volume]") as HTMLInputElement;
    fireEvent.change(volume, { target: { value: "0.4" } });
    expect(FakeAudio.last.volume).toBeCloseTo(0.4);
    fireEvent.click(screen.getByRole("button", { name: "Mute" }));
    expect(FakeAudio.last.muted).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Unmute" }));
    expect(FakeAudio.last.muted).toBe(false);
  });

  it("on iOS the volume slider is hidden (the page cannot set it) and the mute button stays", async () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)");
    mount(<ListenPlayer />);
    await begin();
    expect(document.querySelector("[data-listen-volume]")).toBeNull();
    expect(screen.getByRole("button", { name: "Mute" })).toBeTruthy();
  });

  it("Read shows the whole text with the current phrase marked, and keeps the position", async () => {
    mount(<ListenPlayer />);
    await begin();
    await tick(5200);
    fireEvent.click(screen.getByRole("button", { name: "read" }));
    expect(FakeAudio.last.paused).toBe(true);
    const all = document.querySelector("[data-listen-full]")!;
    expect(all.textContent?.replace(/\s+/g, " ").trim()).toBe(text);
    expect(all.querySelector("[data-current]")?.textContent?.trim()).toBe("Second part follows now.");
    fireEvent.click(screen.getByRole("button", { name: "listen" }));
    expect(FakeAudio.last.currentTime).toBe(5.2);
  });

  it("at the end the last phrase stays, Play becomes Replay and 'Ask Rose about it' appears", async () => {
    mount(<ListenPlayer />);
    await begin();
    expect(document.querySelector("[data-listen-ask]")).toBeNull();
    await act(async () => { FakeAudio.last.onended?.(); });
    expect(phraseWords().map((e) => e.textContent)).toEqual(["Second", "part", "follows", "now."]);
    expect(screen.getByRole("button", { name: "Replay" })).toBeTruthy();
    expect(document.querySelector("[data-listen-ask]")?.textContent).toBe("Ask Rose about it");
    fireEvent.click(screen.getByRole("button", { name: "Replay" }));
    expect(FakeAudio.last.currentTime).toBe(0);
    expect(FakeAudio.last.paused).toBe(false);
    expect(document.querySelector("[data-listen-ask]")).toBeNull();
  });

  it("has no live region that could announce the highlight, and every control is reachable by keyboard", async () => {
    mount(<ListenPlayer />);
    await begin();
    const root = document.querySelector("[data-listen-player]")!;
    expect(root.getAttribute("aria-live")).toBe("off");
    expect(root.querySelector('[aria-live]:not([aria-live="off"]), [role="status"], [role="log"]')).toBeNull();
    for (const el of root.querySelectorAll("button, input, [role=slider]")) expect(el.getAttribute("tabindex"), el.outerHTML.slice(0, 60)).not.toBe("-1");
  });

  it("reads with the browser's voice when there is no generated audio: sentence by sentence, no waveform, labelled", async () => {
    const spoken: string[] = [];
    vi.stubGlobal("SpeechSynthesisUtterance", class { onend: (() => void) | null = null; onerror = null; lang = ""; rate = 1; volume = 1; constructor(public text: string) {} });
    vi.stubGlobal("speechSynthesis", { cancel() {}, speak(u: { text: string }) { spoken.push(u.text); } });
    mount(<ListenPlayer />);
    act(() => { ctl.start(request({ load: async () => { throw new ListenUnavailable(429); } })); });
    await waitFor(() => expect(spoken).toEqual(["First part is here."]));
    expect(document.querySelector("[data-listen-label]")?.textContent).toContain("Your device's voice");
    expect(document.querySelector("[data-listen-wave]")?.getAttribute("data-listen-wave")).toBe("line");
    expect(screen.getByRole("button", { name: "Pause" })).toBeTruthy();
  });
});

describe("One reader for the whole site", () => {
  it("keeps playing when the route changes", async () => {
    mount(<ListenMini onAsk={() => {}} />);
    await begin();
    const audio = FakeAudio.last;
    expect(audio.paused).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "go /b" }));
    await screen.findByText("page b");
    expect(audio.paused).toBe(false);
    expect(audio.pauses).toBe(0);
    expect(ctl.playing).toBe(true);
    expect(readings()).toHaveLength(1);
  });

  it("starts nothing by itself: no audio and no event until a click", async () => {
    mount(<ListenBadge slug="rose" title="Rose" />);
    fireEvent.click(screen.getByRole("button", { name: "go /b" }));
    await screen.findByText("page b");
    expect(readings()).toHaveLength(0);
    expect(ctl.current).toBeNull();
    expect(events.logRoseEvent).not.toHaveBeenCalled();
  });

  it("a second reading replaces the first: one sound at a time", async () => {
    mount();
    await begin();
    const first = FakeAudio.last;
    await begin(request({ id: "summary:other" }));
    expect(first.paused).toBe(true);
    expect(FakeAudio.last).not.toBe(first);
    expect(FakeAudio.last.paused).toBe(false);
  });

  it("pauses the record in the header while Rose speaks, says why, and brings it back at the end", async () => {
    window.localStorage.setItem("ambience-muted", "false");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 200 })));
    mount(<AmbienceControl />, { ambience: true });
    const record = () => FakeAudio.all.filter((a) => a.src === AMBIENCE_SRC);
    await waitFor(() => expect(record().some((a) => !a.paused)).toBe(true), { timeout: 3000 });
    await begin();
    await waitFor(() => expect(record().every((a) => a.paused)).toBe(true), { timeout: 4000 });
    expect(screen.getByRole("switch").getAttribute("aria-label")).toBe("record paused · Rose is speaking");
    await act(async () => { FakeAudio.last.onended?.(); });
    await waitFor(() => expect(record().some((a) => !a.paused)).toBe(true), { timeout: 4000 });
    expect(screen.getByRole("switch").getAttribute("aria-label")).toBe("Stop the record");
  });

  it("does not start the record again if it was not playing before", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 200 })));
    mount(<AmbienceControl />, { ambience: true });
    await begin();
    await act(async () => { FakeAudio.last.onended?.(); });
    await new Promise((r) => setTimeout(r, 100));
    expect(FakeAudio.all.filter((a) => a.src === AMBIENCE_SRC).every((a) => a.paused)).toBe(true);
  });
});

describe("Media Session", () => {
  const handlers: Record<string, ((d: { seekTime?: number }) => void) | null> = {};
  const defined: string[] = [];
  beforeEach(() => {
    for (const k of Object.keys(handlers)) delete handlers[k];
    vi.stubGlobal("MediaMetadata", class { constructor(public init: Record<string, unknown>) {} });
    Object.defineProperty(navigator, "mediaSession", {
      configurable: true,
      value: { metadata: null, playbackState: "none", setActionHandler: (a: string, h: never) => { handlers[a] = h; }, setPositionState: () => {} },
    });
    defined.push("mediaSession");
  });
  afterEach(() => { for (const k of defined.splice(0)) delete (navigator as unknown as Record<string, unknown>)[k]; });

  it("carries the page title, Rose, the site and the compass, and answers play, pause, ±10 s and seekto", async () => {
    mount();
    await begin();
    const meta = (navigator as unknown as { mediaSession: { metadata: { init: Record<string, unknown> } } }).mediaSession.metadata.init;
    expect(meta.title).toBe("A test page");
    expect(meta.artist).toBe("Rose");
    expect(meta.album).toBe("ivandemurard.com");
    expect(meta.artwork).toEqual([{ src: "/rose-compass-512.png", sizes: "512x512", type: "image/png" }]);
    expect(existsSync("public/rose-compass-512.png")).toBe(true);
    for (const a of ["play", "pause", "seekbackward", "seekforward", "seekto"]) expect(typeof handlers[a], a).toBe("function");
    await tick(3000);
    act(() => handlers.seekforward!({}));
    expect(FakeAudio.last.currentTime).toBe(8);
    act(() => handlers.seekbackward!({}));
    expect(FakeAudio.last.currentTime).toBe(0);
    act(() => handlers.seekto!({ seekTime: 5 }));
    expect(FakeAudio.last.currentTime).toBe(5);
    act(() => handlers.pause!({}));
    expect(FakeAudio.last.paused).toBe(true);
    act(() => handlers.play!({}));
    expect(FakeAudio.last.paused).toBe(false);
  });
});

describe("listen_entry", () => {
  const sent = () => vi.mocked(events.logRoseEvent).mock.calls.map((c) => c[0]);

  it("is sent with the source on start and on completion, for each way in", async () => {
    mount();
    for (const entry of ["row", "contents", "index_card", "dock_starter", "answer"] as const) {
      vi.mocked(events.logRoseEvent).mockClear();
      await begin(request({ id: `summary:${entry}`, entry, kind: entry === "answer" ? "answer" : "summary" }));
      await waitFor(() => expect(sent()).toHaveLength(1));
      expect(sent()[0]).toMatchObject({ kind: "listen", listen_entry: entry, listen_source: entry === "answer" ? "answer" : "summary", path: "/a" });
      await act(async () => { FakeAudio.last.onended?.(); });
      expect(sent()[1]).toMatchObject({ kind: "listen_complete", listen_entry: entry });
    }
  });

  it("is sent by the row-side controls with their own value", async () => {
    vi.stubGlobal("SpeechSynthesisUtterance", class { onend = null; onerror = null; lang = ""; rate = 1; volume = 1; constructor(public text: string) {} });
    vi.stubGlobal("speechSynthesis", { cancel() {}, speak() {} });
    mount(<><ListenBadge slug="rose" title="Rose" /><ListenTocLine slug="harnesses-graders-closed-loops" /></>);
    fireEvent.click(screen.getByRole("button", { name: /^Listen to the summary of Rose, 1:14$/ }));
    await waitFor(() => expect(sent().some((e) => e.listen_entry === "index_card")).toBe(true));
    fireEvent.click(screen.getByRole("button", { name: "Listen to the summary of this page" }));
    await waitFor(() => expect(sent().some((e) => e.listen_entry === "contents")).toBe(true));
  });
});

describe("Cards and contents", () => {
  it("a badge is shown only on a card that has a summary, with its length, and starts the reading in place", async () => {
    mount(<><ListenBadge slug="rose" title="Rose" /><ListenBadge slug="no-such-note" title="Nothing" /></>);
    expect(screen.getAllByRole("button", { name: /Listen to the summary/ })).toHaveLength(1);
    expect(screen.getByRole("button", { name: /1:14/ }).textContent).toContain("1:14");
    fireEvent.click(screen.getByRole("button", { name: /1:14/ }));
    await waitFor(() => expect(ctl.current?.id).toBe("summary:rose"));
    expect(ctl.current?.title).toBe("Rose");
  });
  it("the contents line says 'Listen · 1:14' with the recorded length", () => {
    mount(<ListenTocLine slug="rose" />);
    expect(screen.getByRole("button", { name: "Listen to the summary of this page" }).textContent).toContain("Listen · 1:14");
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
  const mountDock = (path: string, messages: UIMessage[] = [], open = true) => {
    const chat = resetRoseChat("test");
    chat.messages = messages;
    setRoseOpen(open);
    return render(<MemoryRouter initialEntries={[path]}><ListenProvider><Probe /><RoseDock roseStatus="live" /></ListenProvider></MemoryRouter>);
  };
  beforeEach(() => { window.sessionStorage.clear(); });
  afterEach(() => { void getRoseChat("test"); });
  const factual = (id: string, register = "factual"): UIMessage => ({ id, role: "assistant", parts: [{ type: "text", text: `Answer ${id}.` }], metadata: { rose_sig: "s", rose_issued_at: Date.now(), rose_register: register } });

  it("offers the summary as the starter question, with its length, on the page that has one only", () => {
    mountDock(LISTEN_SUMMARIES["harnesses-graders-closed-loops"].path);
    expect(screen.getByRole("button", { name: /^Listen to a summary of this page · 1 min$/ })).toBeTruthy();
    cleanup();
    mountDock("/cv");
    expect(screen.queryByRole("button", { name: /Listen to a summary/ })).toBeNull();
  });

  it("shows a Listen button under a factual signed answer, never under a light one, and keeps the written answer", () => {
    mountDock("/cv", [{ id: "u1", role: "user", parts: [{ type: "text", text: "What is built?" }] }, factual("f1"), { id: "u2", role: "user", parts: [{ type: "text", text: "Hello" }] }, factual("l1", "light")]);
    expect(screen.getAllByRole("button", { name: "Listen" })).toHaveLength(1);
    expect(screen.getByText("Answer f1.")).toBeTruthy();
    expect(screen.getByText("Answer l1.")).toBeTruthy();
  });

  it("a click on Listen under an answer opens the player labelled 'Rose · answer'", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 503 })));
    mountDock("/cv", [{ id: "u1", role: "user", parts: [{ type: "text", text: "What is built?" }] }, factual("f1")]);
    fireEvent.click(screen.getByRole("button", { name: "Listen" }));
    await screen.findByLabelText("Rose reads aloud");
    expect(document.querySelector("[data-listen-label]")?.textContent).toContain("Rose · answer");
    expect(ctl.current?.entry).toBe("answer");
  });

  it("while it reads, the bar at rest is the mini-player: one object, no second player and no text bar", async () => {
    mountDock("/cv", [], false);
    expect(document.querySelector("[data-listen-mini]")).toBeNull();
    expect(document.querySelector("[data-rose-bar]")).not.toBeNull();
    await act(async () => { ctl.start(request()); });
    await waitFor(() => expect(ctl.phase).toBe("ready"));
    expect(document.querySelectorAll("[data-listen-mini]")).toHaveLength(1);
    expect(document.querySelector("[data-listen-player]")).toBeNull();
    expect(document.querySelector("[data-rose-bar]")).toBeNull();
    const mini = document.querySelector("[data-listen-mini]")!;
    expect(mini.textContent).toContain("Rose");
    expect(mini.textContent).toContain("A test page");
    expect(screen.getByRole("button", { name: "Pause" }).className).toContain("h-10");
    // The chevron opens the player, which takes the mini-player's place at the bottom of the screen.
    fireEvent.click(screen.getByRole("button", { name: "Open the player" }));
    expect(document.querySelectorAll("[data-listen-player]")).toHaveLength(1);
    expect(document.querySelector("[data-listen-mini]")).toBeNull();
    // Back to the conversation closes the player, the sound goes on.
    fireEvent.click(screen.getByRole("button", { name: /Back to the conversation/ }));
    expect(document.querySelector("[data-listen-player]")).toBeNull();
    expect(ctl.playing).toBe(true);
  });

  it("Escape closes the player first and leaves the sound alone", async () => {
    mountDock("/cv", [], false);
    await act(async () => { ctl.start(request({ openPlayer: true })); });
    await waitFor(() => expect(ctl.phase).toBe("ready"));
    expect(document.querySelector("[data-listen-player]")).not.toBeNull();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.querySelector("[data-listen-player]")).toBeNull();
    expect(ctl.playing).toBe(true);
  });

  it("opens no global keyboard shortcut of its own: a bare space or arrow on the page does nothing", async () => {
    mountDock("/cv", [], false);
    await act(async () => { ctl.start(request()); });
    await waitFor(() => expect(ctl.phase).toBe("ready"));
    const before = FakeAudio.last.currentTime;
    for (const key of [" ", "ArrowRight", "k", "m"]) fireEvent.keyDown(document.body, { key });
    expect(FakeAudio.last.paused).toBe(false);
    expect(FakeAudio.last.currentTime).toBe(before);
  });
});
