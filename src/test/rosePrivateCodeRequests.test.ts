import { describe, expect, it } from "vitest";
import { getRoseSystemPrompt, isRoseCodeAccessRequest } from "../../supabase/functions/_shared/rose-context";
import { ROSE_BOOKING_TOOL_DESCRIPTION } from "../../supabase/functions/_shared/rose-tool-contract";

const GUIDANCE = "Three ways to use AI on this site";

describe("Rose private code requests (§11.2)", () => {
  it("detects requests to access, review or test the visitor's code", () => {
    expect(isRoseCodeAccessRequest("Can you review my private repository?")).toBe(true);
    expect(isRoseCodeAccessRequest("Could you test our codebase against this method?")).toBe(true);
    expect(isRoseCodeAccessRequest("Please inspect the files in github.com/acme/app")).toBe(true);
    expect(isRoseCodeAccessRequest("What did Ivan build?")).toBe(false);
  });

  it("loads the three-ways guidance on a focused page for a code-access request", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/journal/harnesses-graders-closed-loops" }, question: "Can you review my private repository?" });
    expect(prompt).toContain(GUIDANCE);
    expect(prompt).toContain("is not a contact signal");
    expect(prompt).toContain("Copy implementation brief");
  });

  it("tells the model a code-access request is not contact intent", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/" }, question: "Hi" });
    expect(prompt).toContain("no card unless the visitor asks for contact");
  });

  it("forbids card reasons that promise a service Ivan does not offer", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/" }, question: "Hi" });
    expect(prompt).toContain("must never promise a service Ivan does not offer");
    expect(ROSE_BOOKING_TOOL_DESCRIPTION).toContain("must never promise a service Ivan does not offer");
  });
});
