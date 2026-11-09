import { describe, expect, it } from "vitest";
import { shortNoteTitle } from "@/lib/shortTitle";

describe("shortNoteTitle", () => {
  it("prefers the homepage title", () => {
    expect(shortNoteTitle("A long title: with a colon?", "Home title.")).toBe("Home title.");
  });
  it("cuts at and including the first question mark", () => {
    expect(shortNoteTitle("What is an LLM evaluation harness? Graders, protocols and closed loops")).toBe("What is an LLM evaluation harness?");
  });
  it("else cuts before the first colon", () => {
    expect(shortNoteTitle("Sonor: The Quiet Art of Urban Intelligence")).toBe("Sonor");
  });
  it("else keeps the full title", () => {
    expect(shortNoteTitle("A wrong forecast is absorbed. A wrong action reaches a guest.")).toBe("A wrong forecast is absorbed. A wrong action reaches a guest.");
  });
  it("takes the question mark before a colon that comes later", () => {
    expect(shortNoteTitle("Why? Because: reasons")).toBe("Why?");
  });
});
