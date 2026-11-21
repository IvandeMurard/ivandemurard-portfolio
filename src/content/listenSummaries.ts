/**
 * Page summaries Rose reads aloud (Listen). Pilot: the Harness Field Note only.
 *
 * The text below was validated word for word by Ivan. Changing a word changes its hash, and the audio in
 * public/listen/<slug>.mp3 and .json is then stale until Ivan runs `bun scripts/generate-listen-audio.ts` locally
 * (it never runs in CI or in the Lovable build). Asset-free, so the dock and the generator share it.
 */
export type ListenSummary = {
  /** The page the summary belongs to. */
  path: string;
  text: string;
  /** Date Ivan validated the text. */
  validatedOn: string;
};

export const LISTEN_SUMMARIES: Record<string, ListenSummary> = {
  "harnesses-graders-closed-loops": {
    path: "/journal/harnesses-graders-closed-loops",
    validatedOn: "2026-11-21",
    text: `How do you know your AI is working? Most teams look at a score. This Field Note shows how a score can mislead, in both directions, with two moments from a system Ivan built.

First, 61 answers right out of 64, and the release still failed. Think of a driving test, where one rolled stop sign fails a flawless route: the rule was agreed before the engine started. Some mistakes outweigh everything else, and writing that down in advance is what turns a number into a decision.

Then, 64 out of 64, all green, with a dangerous answer inside. An assistant for aircraft mechanics told a technician that a worrying reading was normal. The test only checked for a word. Reading the answers caught it, and the fix moved the rule into the code: when the model contradicts the manual, the manual wins.

What to take away: before you test, write down the one mistake you will never accept. After you test, read what passed.`,
  },
};

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
