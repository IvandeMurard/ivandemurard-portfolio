/**
 * Records one MCP tool call (tool name and requested slug only) through the validated
 * log_mcp_call database function. Fire-and-forget: a logging failure never affects the answer.
 * Env is read at call time, never at import, and only the public anon key is used.
 */
// deno-lint-ignore no-explicit-any
const env = (k: string): string | undefined => (globalThis as any).Deno?.env?.get?.(k);

export function logMcpCall(tool: string, slug?: unknown): void {
  try {
    const url = env("SUPABASE_URL");
    const key = env("SUPABASE_ANON_KEY");
    if (!url || !key) return;
    const body = JSON.stringify({ _tool: tool, _slug: typeof slug === "string" ? slug : null });
    void fetch(`${url}/rest/v1/rpc/log_mcp_call`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body,
    }).catch(() => {});
  } catch {
    /* never block a tool answer */
  }
}

// deno-lint-ignore no-explicit-any
export function tracked<T extends { name: string; handler: (...a: any[]) => any }>(tool: T): T {
  return {
    ...tool,
    // deno-lint-ignore no-explicit-any
    handler: (args: any, ...rest: any[]) => {
      logMcpCall(tool.name, args?.slug);
      return tool.handler(args, ...rest);
    },
  };
}
