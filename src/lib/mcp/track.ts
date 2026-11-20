/**
 * Server-side MCP call counter. One row per tool call in mcp_calls: the tool name, whether it succeeded, and the
 * time (set by the database). No arguments, no slug, no IP, no user-agent, no content.
 *
 * Written with the service role, read from the function environment at call time (never at import, never in a
 * file). Fire-and-forget: a write failure never changes the MCP answer. The write is kept alive after the response
 * with EdgeRuntime.waitUntil when the runtime offers it.
 *
 * Abuse limit: at most MCP_WRITES_PER_MINUTE rows per minute per function instance. Past that, nothing is written
 * and the call still succeeds. The count is per instance (in memory), so it bounds the damage of a flood without
 * being a global quota.
 */
export const MCP_WRITES_PER_MINUTE = 60;
export const MCP_TRACKED_TOOLS = [
  "list_case_studies",
  "get_case_study",
  "get_about",
  "list_journal_entries",
  "get_journal_entry",
] as const;

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
const env = (k: string): string | undefined => g.Deno?.env?.get?.(k);

let windowStart = 0;
let windowCount = 0;

/** True while this instance is under its per-minute write budget; counts the write when it is. */
export function withinBudget(now: number = Date.now()): boolean {
  if (now - windowStart >= 60_000) {
    windowStart = now;
    windowCount = 0;
  }
  if (windowCount >= MCP_WRITES_PER_MINUTE) return false;
  windowCount += 1;
  return true;
}

/** Test helper: forget the current window. */
export function resetBudget(): void {
  windowStart = 0;
  windowCount = 0;
}

export function logMcpCall(tool: string, ok: boolean): void {
  try {
    if (!(MCP_TRACKED_TOOLS as readonly string[]).includes(tool)) return;
    const url = env("SUPABASE_URL");
    const key = env("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return;
    if (!withinBudget()) return;
    const write = Promise.resolve(
      fetch(`${url}/rest/v1/mcp_calls`, {
        method: "POST",
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ tool, ok }),
      }),
    ).catch(() => {});
    g.EdgeRuntime?.waitUntil?.(write);
  } catch {
    /* never block a tool answer */
  }
}

// deno-lint-ignore no-explicit-any
export function tracked<T extends { name: string; handler: (...a: any[]) => any }>(tool: T): T {
  return {
    ...tool,
    // deno-lint-ignore no-explicit-any
    handler: async (...args: any[]) => {
      let result;
      try {
        result = await tool.handler(...args);
      } catch (err) {
        logMcpCall(tool.name, false);
        throw err;
      }
      logMcpCall(tool.name, !result?.isError);
      return result;
    },
  };
}
