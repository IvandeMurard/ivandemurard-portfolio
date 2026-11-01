import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { UIMessage } from "ai";
import {
  STORAGE_KEY, INACTIVITY_MS, loadMessages, saveMessages, clearStoredMessages, selectRecent,
  getRoseChat, resetRoseChat, clearOnReload,
} from "@/components/rose/roseSession";

const msg = (i: number, role: "user" | "assistant" = i % 2 ? "assistant" : "user"): UIMessage =>
  ({ id: `m${i}`, role, parts: [{ type: "text", text: `t${i}` }] }) as UIMessage;

beforeEach(() => sessionStorage.clear());

describe("Rose session memory", () => {
  it("restores a saved conversation within the hour", () => {
    saveMessages([msg(0), msg(1)], 1_000);
    expect(loadMessages(1_000 + INACTIVITY_MS - 1).map((m) => m.id)).toEqual(["m0", "m1"]);
  });

  it("expires after 60 minutes of inactivity", () => {
    saveMessages([msg(0)], 1_000);
    expect(loadMessages(1_000 + INACTIVITY_MS + 1)).toEqual([]);
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("discards corrupt or wrong-version data", () => {
    sessionStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadMessages()).toEqual([]);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 99, updatedAt: Date.now(), messages: [msg(0)] }));
    expect(loadMessages()).toEqual([]);
  });

  it("uses sessionStorage only, never localStorage", () => {
    localStorage.clear();
    saveMessages([msg(0)]);
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it("caps stored history at 60 messages", () => {
    saveMessages(Array.from({ length: 90 }, (_, i) => msg(i)));
    const kept = loadMessages();
    expect(kept).toHaveLength(60);
    expect(kept[59].id).toBe("m89");
  });

  it("sends at most 20 recent messages, starting on a user turn", () => {
    const sent = selectRecent(Array.from({ length: 45 }, (_, i) => msg(i)));
    expect(sent.length).toBeLessThanOrEqual(20);
    expect(sent[0].role).toBe("user");
    expect(sent[sent.length - 1].id).toBe("m44");
  });

  it("keeps one conversation across remounts and Clear empties it", () => {
    saveMessages([msg(0), msg(1)]);
    const a = getRoseChat("s");
    expect(getRoseChat("s")).toBe(a);
    const b = resetRoseChat("s");
    expect(b.messages).toEqual([]);
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
    clearStoredMessages();
  });
});

describe("Rose session on reload", () => {
  afterEach(() => { vi.restoreAllMocks(); vi.resetModules(); });

  it("erases the stored conversation when the page load is a reload", () => {
    saveMessages([msg(0), msg(1)]);
    expect(clearOnReload([{ type: "reload" }])).toBe(true);
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(loadMessages()).toEqual([]);
  });

  it.each(["navigate", "back_forward", "prerender", undefined])("keeps the conversation for a %s load", (type) => {
    saveMessages([msg(0), msg(1)]);
    expect(clearOnReload([{ type }])).toBe(false);
    expect(loadMessages().map((m) => m.id)).toEqual(["m0", "m1"]);
  });

  it("keeps the conversation when the browser exposes no navigation entry", () => {
    saveMessages([msg(0)]);
    expect(clearOnReload([])).toBe(false);
    expect(loadMessages()).toHaveLength(1);
  });

  it("clears at module load after a reload, and not after in-app navigation", async () => {
    const spy = vi.spyOn(performance, "getEntriesByType");
    saveMessages([msg(0)]);
    spy.mockReturnValue([{ type: "navigate" }] as unknown as PerformanceEntryList);
    vi.resetModules();
    await import("@/components/rose/roseSession");
    expect(sessionStorage.getItem(STORAGE_KEY)).not.toBeNull();

    spy.mockReturnValue([{ type: "reload" }] as unknown as PerformanceEntryList);
    vi.resetModules();
    await import("@/components/rose/roseSession");
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("does not clear again on later saves within the same page load", () => {
    clearOnReload([{ type: "reload" }]);
    saveMessages([msg(0)]);
    expect(loadMessages()).toHaveLength(1);
  });

  it("keeps the 60-minute expiry and Clear", () => {
    saveMessages([msg(0)], 1_000);
    expect(loadMessages(1_000 + INACTIVITY_MS + 1)).toEqual([]);
    saveMessages([msg(0)]);
    clearStoredMessages();
    expect(loadMessages()).toEqual([]);
  });
});
