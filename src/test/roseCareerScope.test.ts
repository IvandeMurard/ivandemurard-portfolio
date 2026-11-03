import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { getRoseSystemPrompt, isRoseCareerQuestion } from "../../supabase/functions/_shared/rose-context";

// Live bug, 3 Nov: on /rose-design-lab a question about the roles Ivan wants loaded neither the CV nor the Contact
// text, and Rose invented roles. A profile question now loads the CV and the Contact facts on any page.
const QUESTION = "What kind of role is Ivan looking for, and how does he describe his work?";
const CV_BLOCK = "--- BEGIN CASE STUDY: cv ---";
const CONTACT_LINE = "Open to AI Product Manager and Product Builder roles";
const PURPOSE_LINE = "I design, build and evaluate AI services for operations";

beforeAll(() => {
  vi.stubGlobal("fetch", vi.fn(async (url: string) => new Response(`# Mirror of ${url}`, { status: 200 })));
});
afterAll(() => vi.unstubAllGlobals());

describe("Rose career scope", () => {
  for (const [name, path] of [["Rose's page", "/rose-design-lab"], ["a case study", "/aetherix"], ["a Field Note", "/journal/harnesses-graders-closed-loops"]]) {
    it(`loads the CV and the Contact text for the profile question on ${name}`, async () => {
      const prompt = await getRoseSystemPrompt({ page: { path }, question: QUESTION });
      expect(prompt).toContain(CV_BLOCK);
      expect(prompt).toContain(CONTACT_LINE);
      expect(prompt).toContain(PURPOSE_LINE);
      expect(prompt).toContain("Answer only from the CV reference and the Contact text");
      expect(prompt).toContain("link [CV](/cv)");
    });
  }

  it("keeps the page's own references next to the CV", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/aetherix" }, question: QUESTION });
    expect(prompt).toContain("--- BEGIN CASE STUDY: aetherix ---");
    expect(prompt).toContain(CV_BLOCK);
  });

  it("does not load the whole portfolio for a profile question on Rose's page", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/rose-design-lab" }, question: "Is Ivan open to a Head of Product role?" });
    expect(prompt).toContain(CV_BLOCK);
    for (const slug of ["sonor", "tacet", "lore", "anima", "compass"]) expect(prompt).not.toContain(`--- BEGIN CASE STUDY: ${slug} ---`);
    expect(prompt).toContain("never confirm openness to any other role");
  });

  it("a question about Rose herself still does not load the CV or the Contact text", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/rose-design-lab" }, question: "Why were you built?" });
    expect(prompt).not.toContain(CV_BLOCK);
    expect(prompt).not.toContain(CONTACT_LINE);
  });

  it("matches the profile vocabulary and leaves ordinary questions alone", () => {
    for (const q of ["Is he open to a new role?", "Is Ivan hiring or looking for a job?", "What is his background?", "Where is the CV?", "What does he do?", "Can I work with him?", "How does Ivan describe his work?"]) {
      expect(isRoseCareerQuestion(q), q).toBe(true);
    }
    for (const q of ["Why were you built?", "What changed in August?", "What does Ivan measure?"]) expect(isRoseCareerQuestion(q), q).toBe(false);
  });
});
