import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { asSchema, tool } from "ai";
import { z } from "zod";
import { ROSE_HISTORY_WINDOW, createRoseTools, roseHistoryQuestions } from "../../supabase/functions/_shared/rose-tools";
import { GATEWAY_MODEL, GOOGLE_MODEL, ROSE_MAX_RETRIES, withToolCallIndex } from "../../supabase/functions/_shared/rose-provider";
import { ROSE_BOOKING_TOOL_DESCRIPTION, ROSE_FOLLOWUPS_TOOL_DESCRIPTION, roseFollowupPolicyDescription } from "../../supabase/functions/_shared/rose-tool-contract";

// The Stage B evaluation must build the same request as rose-chat: they share one tool factory, one history window,
// one retry count and one tool-call fix, so a run tests what production sends.
const roseChat = readFileSync("supabase/functions/rose-chat/index.ts", "utf8");
const stageB = readFileSync("scripts/rose-stage-b-check.ts", "utf8");

const jsonSchema = async (t: { inputSchema: unknown }) => await Promise.resolve(asSchema(t.inputSchema as never).jsonSchema);
// Both callers pass { tool, z } and { question, pagePath } to the one factory.
const asRoseChat = (question: string, pagePath: string) => createRoseTools({ tool, z }, { question, pagePath });
const asStageB = (question: string, pagePath: string) => createRoseTools({ tool, z }, { question, pagePath });

type Tool = { description: string; inputSchema: { safeParse: (v: unknown) => { success: boolean } } };
const toolsOf = (question: string, pagePath: string) => asRoseChat(question, pagePath) as unknown as Record<string, Tool>;

describe("Tool definitions: rose-chat and the evaluation script build the same", () => {
  const cases: Array<[string, string, string]> = [
    ["a booking request", "I changed my mind. I would like to book a call with Ivan.", "/contact"],
    ["an ordinary question", "What has Ivan built?", "/journeys"],
    ["a profile question", "What kind of role is Ivan looking for?", "/rose-design-lab"],
  ];

  it.each(cases)("%s: identical tool names, descriptions and JSON schemas", async (_n, question, path) => {
    const a = asRoseChat(question, path) as unknown as Record<string, Tool>;
    const b = asStageB(question, path) as unknown as Record<string, Tool>;
    expect(Object.keys(a)).toEqual(Object.keys(b));
    for (const name of Object.keys(a)) {
      expect(b[name].description).toBe(a[name].description);
      expect(await jsonSchema(b[name])).toEqual(await jsonSchema(a[name]));
    }
  });

  it("the booking tool carries its field descriptions", async () => {
    const booking = toolsOf("I would like to book a call with Ivan.", "/contact").propose_booking;
    expect(booking.description).toBe(ROSE_BOOKING_TOOL_DESCRIPTION);
    const schema = (await jsonSchema(booking)) as { properties: Record<string, { description?: string; enum?: string[]; maxLength?: number }> };
    expect(schema.properties.intent.description).toBe("Detected intent bucket.");
    expect(schema.properties.intent.enum).toEqual(["product", "technical", "culture", "exploring"]);
    expect(schema.properties.reason.description).toBe("One short sentence, plain English, shown on the card as the call framing.");
    expect(schema.properties.reason.maxLength).toBe(200);
  });

  it("the follow-up tool carries the policy description, the size limits and the safety check", async () => {
    const question = "What has Ivan built?";
    const followups = toolsOf(question, "/journeys").suggest_followups;
    expect(followups.description).toBe(ROSE_FOLLOWUPS_TOOL_DESCRIPTION);
    const schema = (await jsonSchema(followups)) as { properties: { items: { minItems: number; maxItems: number; items: { description: string; minLength: number; maxLength: number } } } };
    expect(schema.properties.items.minItems).toBe(1);
    expect(schema.properties.items.maxItems).toBe(2);
    expect(schema.properties.items.items.minLength).toBe(3);
    expect(schema.properties.items.items.maxLength).toBe(80);
    expect(schema.properties.items.items.description).toBe(roseFollowupPolicyDescription({ question, pagePath: "/journeys" }));
    expect(followups.inputSchema.safeParse({ items: ["Would you tell me more about his work?"] }).success).toBe(true);
    expect(followups.inputSchema.safeParse({ items: ["What is your role?"] }).success).toBe(false);
  });

  it("withholds the booking tool from a profile question that does not ask for a meeting", () => {
    expect(Object.keys(toolsOf("What kind of role is Ivan looking for?", "/rose-design-lab"))).not.toContain("propose_booking");
    expect(Object.keys(toolsOf("What has Ivan built?", "/journeys"))).toContain("propose_booking");
    expect(Object.keys(toolsOf("Is Ivan open to a call about a role?", "/rose-design-lab"))).toContain("propose_booking");
  });
});

describe("Both callers use the shared pieces and define none of their own", () => {
  it("rose-chat and the script build the tools with the one factory, and define no tool inline", () => {
    for (const source of [roseChat, stageB]) {
      expect(source).toContain("createRoseTools({ tool, z }");
      expect(source).not.toContain("inputSchema:");
      expect(source).not.toContain("ROSE_BOOKING_TOOL_DESCRIPTION");
      expect(source).not.toContain("ROSE_FOLLOWUPS_TOOL_DESCRIPTION");
    }
  });

  it("both use the shared retry count and the shared history window", () => {
    expect(ROSE_MAX_RETRIES).toBe(2);
    for (const source of [roseChat, stageB]) {
      expect(source).toContain("maxRetries: ROSE_MAX_RETRIES");
      expect(source).toContain("roseHistoryQuestions(");
      expect(source).not.toMatch(/maxRetries: \d/);
      expect(source).not.toContain("slice(-20");
    }
  });

  it("the script uses withToolCallIndex and the model ids of rose-provider, with no copy of its own", () => {
    expect(stageB).toContain("withToolCallIndex(fetch)");
    expect(stageB).not.toContain("googleFetch");
    expect(stageB).toContain("GOOGLE_MODEL");
    expect(stageB).toContain("GATEWAY_MODEL");
    expect(stageB).not.toContain('"gemini-3-flash-preview"');
    expect(typeof withToolCallIndex).toBe("function");
    expect([GOOGLE_MODEL, GATEWAY_MODEL]).toEqual(["gemini-3-flash-preview", "google/gemini-3-flash-preview"]);
  });

  it("both pass the suggested chip to the system prompt", () => {
    expect(roseChat).toContain("suggested: body?.suggested");
    expect(stageB).toContain("suggested: turn.suggested");
    expect(stageB).toMatch(/type Turn = \{[^}]*suggested\?:/);
  });
});

describe("The 20-message window", () => {
  const messages = Array.from({ length: 25 }, (_, i) => ({ role: i % 2 === 0 ? "user" : "assistant", parts: [{ type: "text", text: `m${i}` }] }));

  it("keeps the visitor turns among the last 20 messages, without the question itself", () => {
    expect(ROSE_HISTORY_WINDOW).toBe(20);
    // m5..m23 are the 19 messages before the current one (m24); the visitor's are the even ones.
    expect(roseHistoryQuestions(messages)).toEqual(["m6", "m8", "m10", "m12", "m14", "m16", "m18", "m20", "m22"]);
  });

  it("joins the text parts of a turn and skips other parts", () => {
    const history = roseHistoryQuestions([
      { role: "user", parts: [{ type: "text", text: "one" }, { type: "step-start" }, { type: "text", text: "two" }] },
      { role: "assistant", parts: [{ type: "text", text: "answer" }] },
      { role: "user", parts: [{ type: "text", text: "current" }] },
    ]);
    expect(history).toEqual(["one two"]);
  });
});
