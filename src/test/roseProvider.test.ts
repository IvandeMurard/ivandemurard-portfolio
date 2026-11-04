import { describe, expect, it } from "vitest";
import {
  GATEWAY_MODEL, GOOGLE_MODEL, ROSE_UNAVAILABLE, chooseRoseProvider, isQuotaRefusal, isRoseUnavailableError, roseStreamErrorText, withToolCallIndex,
} from "../../supabase/functions/_shared/rose-provider";

const env = (vars: Record<string, string>) => ({ get: (name: string) => vars[name] });

describe("rose-chat provider choice", () => {
  it("uses Google directly, with the same model, when its secret is set", () => {
    expect(chooseRoseProvider(env({ GOOGLE_GENERATIVE_AI_API_KEY: "g-key", LOVABLE_API_KEY: "l-key" }))).toEqual({ kind: "google", apiKey: "g-key", modelId: "gemini-3-flash-preview" });
    expect(GOOGLE_MODEL).toBe("gemini-3-flash-preview");
  });
  it("uses the Lovable gateway without the Google secret, as today", () => {
    expect(chooseRoseProvider(env({ LOVABLE_API_KEY: "l-key" }))).toEqual({ kind: "lovable", apiKey: "l-key", modelId: "google/gemini-3-flash-preview" });
    expect(GATEWAY_MODEL).toBe("google/gemini-3-flash-preview");
  });
  it("treats an empty or blank Google secret as not set", () => {
    expect(chooseRoseProvider(env({ GOOGLE_GENERATIVE_AI_API_KEY: "  ", LOVABLE_API_KEY: "l-key" }))?.kind).toBe("lovable");
    expect(chooseRoseProvider(env({ GOOGLE_GENERATIVE_AI_API_KEY: "" , LOVABLE_API_KEY: "l-key" }))?.kind).toBe("lovable");
  });
  it("returns nothing when neither secret is set", () => {
    expect(chooseRoseProvider(env({}))).toBeNull();
  });
});

describe("rose-chat quota mapping", () => {
  it("maps a 402 and a 429 to the distinct code", () => {
    expect(roseStreamErrorText({ statusCode: 402, message: "Payment required" })).toBe(ROSE_UNAVAILABLE);
    expect(roseStreamErrorText({ statusCode: 429, message: "slow down" })).toBe(ROSE_UNAVAILABLE);
    expect(ROSE_UNAVAILABLE).toBe("rose_unavailable");
  });
  it("finds the status inside a retry wrapper or a cause", () => {
    expect(isQuotaRefusal({ name: "RetryError", lastError: { statusCode: 429 }, errors: [{ statusCode: 429 }] })).toBe(true);
    expect(isQuotaRefusal({ errors: [{ statusCode: 500 }, { statusCode: 402 }] })).toBe(true);
    expect(isQuotaRefusal({ cause: { status: 429 } })).toBe(true);
  });
  it("recognises the quota wording when no status is attached", () => {
    expect(isQuotaRefusal(new Error("RESOURCE_EXHAUSTED: quota"))).toBe(true);
    expect(isQuotaRefusal(new Error("Payment Required"))).toBe(true);
  });
  it("keeps every other error on the usual text", () => {
    for (const e of [{ statusCode: 500 }, { statusCode: 400 }, { statusCode: 401 }, new Error("socket hang up"), "boom", null, undefined]) {
      expect(isQuotaRefusal(e)).toBe(false);
      expect(roseStreamErrorText(e)).toBe("An error occurred.");
    }
  });
  it("lets the dock read the code from a stream error or a JSON body", () => {
    expect(isRoseUnavailableError(new Error("rose_unavailable"))).toBe(true);
    expect(isRoseUnavailableError(new Error('{"error":"rose_unavailable"}'))).toBe(true);
    expect(isRoseUnavailableError(new Error("An error occurred."))).toBe(false);
    expect(isRoseUnavailableError(undefined)).toBe(false);
  });
});

describe("Google tool-call index workaround", () => {
  it("adds the missing index to streamed tool calls and leaves the rest alone", async () => {
    const chunk = { choices: [{ delta: { tool_calls: [{ function: { name: "suggest_followups" } }, { function: { name: "propose_booking" } }] } }] };
    const upstream = (async () => new Response(`data: ${JSON.stringify(chunk)}\n\ndata: [DONE]\n\n`, { headers: { "content-type": "text/event-stream" } })) as typeof fetch;
    const text = await (await withToolCallIndex(upstream)("https://example.test")).text();
    const calls = JSON.parse(text.split("\n")[0].slice(6)).choices[0].delta.tool_calls;
    expect(calls.map((c: { index: number }) => c.index)).toEqual([0, 1]);
    expect(text).toContain("data: [DONE]");
  });
});
