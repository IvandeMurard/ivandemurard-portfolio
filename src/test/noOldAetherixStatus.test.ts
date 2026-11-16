import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// Aetherix's status is "Pre-pilot" (src/content/statuses.ts). The old word and the old sentence must not
// come back on any surface a reader or an agent can see: the pre-rendered pages, the public mirrors and the source.
//
// Not scanned: supabase/functions/mcp/index.ts, the generated MCP bundle. It is not edited by hand: Lovable
// rebuilds it from src/lib/mcp, and it carries the old text until then (mcpBundleFreshness is red until it does).
// This file is skipped too, since it has to name the old wording.
const OLD = ["Pilot-ready", "Ready for a 30-day pilot"];
const ROOTS = ["prerendered", "public", "src"];
const TEXT = /\.(html|md|txt|ts|tsx|json|css|xml|js|mjs)$/;
const SELF = join("src", "test", "noOldAetherixStatus.test.ts");

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

describe("Aetherix's old status wording", () => {
  const files = ROOTS.flatMap(walk).filter((f) => TEXT.test(f) && f !== SELF);

  it("scans the three folders", () => {
    expect(files.some((f) => f.startsWith("prerendered"))).toBe(true);
    expect(files.some((f) => f.startsWith("public"))).toBe(true);
    expect(files.some((f) => f.startsWith("src"))).toBe(true);
  });

  for (const phrase of OLD) {
    it(`no file in prerendered/, public/ or src/ contains "${phrase}"`, () => {
      const hits = files.filter((f) => readFileSync(f, "utf8").includes(phrase));
      expect(hits, `Still in: ${hits.join(", ")}`).toEqual([]);
    });
  }
});
