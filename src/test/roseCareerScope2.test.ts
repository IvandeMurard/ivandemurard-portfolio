import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { getRoseSystemPrompt, shouldOfferRoseBooking } from "../../supabase/functions/_shared/rose-context";
import { isRoseFollowupAllowed, roseFollowupPolicyDescription, ROSE_FOLLOWUPS_TOOL_DESCRIPTION } from "../../supabase/functions/_shared/rose-tool-contract";

// Evaluation of 3 Nov (career-after): a planned DomusVi rollout was stated as done, booking cards appeared
// on profile questions, and follow-ups addressed Ivan as "you".
const CV_GUARD = "distinguish an achieved result from a target or planned rollout";
const NO_BOOKING = "propose_booking tool is not available";

beforeAll(() => { vi.stubGlobal("fetch", vi.fn(async (url: string) => new Response(`# Mirror of ${url}`, { status: 200 }))); });
afterAll(() => vi.unstubAllGlobals());

describe("Rose career scope 2: CV claim guard on every career path", () => {
  const paths: [string, string][] = [
    ["/rose-design-lab", "Is Ivan open to a Head of Product role?"], // cv added by isRoseCareerQuestion
    ["/aetherix", "What kind of role is Ivan looking for, and how does he describe his work?"],
    ["/journal/harnesses-graders-closed-loops", "What is his background?"],
    ["/cv", "What is his experience?"],
    ["/", "What roles is Ivan looking for?"], // broad path: all studies, no focused guards
  ];
  for (const [path, question] of paths) {
    it(`includes the CV claim guard on ${path}`, async () => {
      const prompt = await getRoseSystemPrompt({ page: { path }, question });
      expect(prompt).toContain(CV_GUARD);
      expect(prompt).toContain("its 500+ user rollout was planned");
    });
  }
});

describe("Rose career scope 2: no unrequested booking on profile questions", () => {
  it("does not offer booking for a profile question", async () => {
    expect(shouldOfferRoseBooking("Is Ivan open to a Head of Product role?")).toBe(false);
    expect(shouldOfferRoseBooking("What kind of role is Ivan looking for?")).toBe(false);
    const prompt = await getRoseSystemPrompt({ page: { path: "/rose-design-lab" }, question: "Is Ivan open to a Head of Product role?" });
    expect(prompt).toContain(NO_BOOKING);
  });
  it("keeps booking for an explicit call or meeting request", async () => {
    expect(shouldOfferRoseBooking("Can I book a call with Ivan about a product role?")).toBe(true);
    expect(shouldOfferRoseBooking("I'd like a meeting to discuss his experience")).toBe(true);
    const prompt = await getRoseSystemPrompt({ page: { path: "/cv" }, question: "Can I book a call with Ivan about a product role?" });
    expect(prompt).not.toContain(NO_BOOKING);
  });
  it("keeps booking for questions that are not about the profile", () => {
    expect(shouldOfferRoseBooking("Why were you built?")).toBe(true);
  });
});

describe("Rose career scope 2: follow-ups name Ivan in the third person", () => {
  const ctx = { question: "What kind of role is Ivan looking for?", pagePath: "/rose-design-lab" };
  it("allows polite third-person questions", () => {
    expect(isRoseFollowupAllowed("Would you tell me more about his AI-native projects?", ctx)).toBe(true);
    expect(isRoseFollowupAllowed("Could you show me how he evaluates Aetherix?", ctx)).toBe(true);
  });
  it("rejects follow-ups that address Ivan as you", () => {
    for (const item of ["Tell me about your AI projects", "What did you build at DomusVi?", "Are you open to remote roles?", "How do you measure your work?".replace("do you measure", "did you test")]) {
      expect(isRoseFollowupAllowed(item, ctx), item).toBe(false);
    }
  });
  it("states the voice rule in the tool and the policy text", () => {
    expect(ROSE_FOLLOWUPS_TOOL_DESCRIPTION).toContain("third person");
    expect(roseFollowupPolicyDescription(ctx)).toContain('Never use "you" or "your" for Ivan');
  });
});
