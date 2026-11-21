/**
 * Page summaries Rose reads aloud (Listen). Pilot: two Field Notes (Harness, One text three readers).
 *
 * The text below was validated word for word by Ivan. Changing a word changes its hash, and the audio in
 * public/listen/<slug>.mp3 and .json is then stale until Ivan runs `bun scripts/generate-listen-audio.ts` locally
 * (it never runs in CI or in the Lovable build). Asset-free, so the dock and the generator share it.
 */
export type ListenSummary = {
  /** The page the summary belongs to. */
  path: string;
  /** What is shown and read by the page, the mirrors and MCP. No tags. */
  text: string;
  /**
   * The same text with ElevenLabs expression tags ([thoughtful], [short pause], ...), to record the take again identically.
   * Never shown, never printed in a mirror, never returned by MCP.
   */
  script?: string;
  /** Date Ivan validated the text. */
  validatedOn: string;
  /** Length of the recorded take in ms: the durationMs of public/listen/<slug>.json (a test keeps them equal). */
  durationMs: number;
  /** The summary is spoken in Rose's own voice (first person): the notice says so. */
  inRoseVoice?: boolean;
};

export const LISTEN_SUMMARIES: Record<string, ListenSummary> = {
  "harnesses-graders-closed-loops": {
    path: "/journal/harnesses-graders-closed-loops",
    validatedOn: "2026-11-21",
    durationMs: 63556,
    text: `How do you know your AI is working? Most teams look at a score. This Field Note shows how a score can mislead, in both directions, with two moments from a system Ivan built.

First, 61 answers right out of 64, and the release still failed. Think of a driving test, where one rolled stop sign fails a flawless route: the rule was agreed before the engine started. Some mistakes outweigh everything else, and writing that down in advance is what turns a number into a decision.

Then, 64 out of 64, all green, with a dangerous answer inside. An assistant for aircraft mechanics told a technician that a worrying reading was normal. The test only checked for a word. Reading the answers caught it, and the fix moved the rule into the code: when the model contradicts the manual, the manual wins.

What to take away: before you test, write down the one mistake you will never accept. After you test, read what passed.`,
  },
  "one-text-three-readers": {
    path: "/journal/one-text-three-readers",
    validatedOn: "2026-11-21",
    durationMs: 64993,
    text: `Who reads your website? You, of course. But also an assistant answering questions about it, and AI agents fetching it on someone else's behalf. This Field Note follows one page and its three readers, and what each of them actually got.

First, the promise. On screen, one of Ivan's projects was clearly marked as not yet piloted. A machine reading the same address received an old copy nobody had refreshed, announcing it was ready for a pilot. Nobody had lied: a forgotten file had.

Then, the missing room. Agents asking for the list of projects were quietly handed the homepage instead. In a browser, it fixed itself in a blink. For a machine, the projects simply did not exist.

The cure is simple to say: one source for every fact, every version built from it, and tests that fail the moment one drifts. Rose reads that same text, so she never knows more than the page.

So open three of your pages the way a machine does. What comes back?`,
  },
  rose: {
    path: "/rose",
    validatedOn: "2026-11-21",
    durationMs: 73796,
    inRoseVoice: true,
    text: `Most case studies describe their subject. This one is introduced by it. Hi, I'm Rose, Ivan's contextual agent, and this case study is, well, about me. I started as a funnel with a simple idea: I asked who you were, and I led you to book a call. Then Ivan changed my job: now I explain his work, rephrase it, and put it in context. To do that, I know the page and the section you're reading, I answer from the site's own text, I link the passage I used, and I quote every project's status exactly as published. I went through a lot of testing, so now I only name what the pages name. Oh, and this recording is new: it's a summary of the case study, written by Ivan in my voice. What comes next is still on the drawing board. Ivan is designing me to take you straight to the passage that answers you, to show how one project connects to another, and to sketch a diagram when a page gets too dense or technical. The same idea could serve any documentation where readers bring their own questions. One more thing: when you book a call, the calendar opens but the conversation stays here. So the question is yours: what would you ask me? I am right below.`,
    script: `[thoughtful] Most case studies describe their subject. [short pause] This one is introduced by it. [happy] Hi, I'm Rose, Ivan's contextual agent, and this case study is, well, about me. [short pause] I started as a funnel with a simple idea: I asked who you were, and I led you to book a call. [thoughtful] Then Ivan changed my job: now I explain his work, rephrase it, and put it in context. To do that, I know the page and the section you're reading, I answer from the site's own text, I link the passage I used, and I quote every project's status exactly as published. [confident] I went through a lot of testing, so now I only name what the pages name. [excited] Oh, and this recording is new: it's a summary of the case study, written by Ivan in my voice. [thoughtful] What comes next is still on the drawing board. [excited] Ivan is designing me to take you straight to the passage that answers you, to show how one project connects to another, and to sketch a diagram when a page gets too dense or technical. [thoughtful] The same idea could serve any documentation where readers bring their own questions. [serious] One more thing: when you book a call, the calendar opens but the conversation stays here. [happy] So the question is yours: what would you ask me? [whisper] I am right below.`,
  },
};

/** Entry of a summary by its slug (the basename of its audio files). */
export const listenSummaryBySlug = (slug: string): ListenSummary | null => LISTEN_SUMMARIES[slug] ?? null;

export const LISTEN_SECTION_HEADING = "Listen summary";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-11-21" to "21 Nov 2026". */
export const formatValidatedOn = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

/** The length of a recording as printed in the notice: "1 min 04", or "45 sec" under a minute. */
export const formatRecordedLength = (ms: number): string => {
  const total = Math.round(ms / 1000);
  return total < 60 ? `${total} sec` : `${Math.floor(total / 60)} min ${String(total % 60).padStart(2, "0")}`;
};

/** "Recorded summary, written by Ivan, validated 21 Nov 2026 · 1 min 04". Rose's own summary adds "in Rose's voice". */
export const listenSummaryNotice = (s: ListenSummary): string =>
  `Recorded summary, written by Ivan${s.inRoseVoice ? " in Rose's voice" : ""}, validated ${formatValidatedOn(s.validatedOn)} · ${formatRecordedLength(s.durationMs)}`;

/**
 * The section that mirrors (.md), llms-full.txt and MCP carry for a page that has a summary: the heading, the notice, the
 * full text. One function, so every surface prints the same words as the page.
 */
export const listenSummarySection = (s: ListenSummary): string => `## ${LISTEN_SECTION_HEADING}\n\n${listenSummaryNotice(s)}\n\n${s.text}\n`;

export const listenSummaryFor = (pathname: string): { slug: string; summary: ListenSummary } | null => {
  const clean = pathname.replace(/\/+$/, "") || "/";
  for (const [slug, summary] of Object.entries(LISTEN_SUMMARIES)) if (summary.path === clean) return { slug, summary };
  return null;
};

/** Spoken English runs at about 150 words a minute. Only an estimate, used until the generated file gives the real length. */
export const estimateListenSeconds = (text: string): number =>
  Math.max(10, Math.round((text.split(/\s+/).filter(Boolean).length / 150) * 60));

/** "45 sec" under a minute, then whole minutes: the length is a promise to the reader, so it is rounded, not precise. */
export const formatListenDuration = (seconds: number): string =>
  seconds < 55 ? `${Math.max(5, Math.round(seconds / 5) * 5)} sec` : `${Math.max(1, Math.round(seconds / 60))} min`;

/** "1:04": a recording's length as the row and the index badge print it. */
export const formatClockLength = (ms: number): string => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
