import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// `vite build` runs the @lovable.dev/mcp-js plugin, which writes supabase/functions/mcp/index.ts. On Windows it used
// to write a 7-line stub that imported "npm:C:\\Users\\...\\src\\lib\\mcp\\index.ts" (the entry's absolute path taken
// for an npm package). The bundle must be the same on every machine and never hold a local path.
// This test runs the real plugin on this project (scripts/mcp-plugin-output.mjs, in plain Node: esbuild cannot run
// inside jsdom) and writes nothing in the project. Never edit the committed bundle to make it pass; the fix is
// scripts/patch-mcp-plugin.mjs, run by postinstall. The committed bundle is rebuilt by Lovable.

const ROOT = process.cwd();
const run = (script: string, ...args: string[]) =>
  execFileSync(process.execPath, [script, ...args], { cwd: ROOT, maxBuffer: 1 << 26, encoding: "utf8" });

/** A local path in a bundle: a drive letter (C:\ or C:/), a Unix home or a macOS user folder. */
const ABSOLUTE_PATH = /(?<![A-Za-z0-9])[A-Za-z]:[\\/]|\/home\/|\/Users\//;

describe("The MCP bundle the plugin generates", () => {
  const generated = run("scripts/mcp-plugin-output.mjs").replace(/\r\n/g, "\n");

  it("is a real bundle, not the stub: the entry and its tools are inside it", () => {
    expect(generated.split("\n").length).toBeGreaterThan(100);
    expect(generated).toContain("// Bundled from src/lib/mcp/index.ts by @lovable.dev/mcp-js.");
    expect(generated).toContain("defineMcp");
    expect(generated).not.toMatch(/import mcp from "npm:/);
  });

  it("holds no absolute local path (drive letter, /home/, /Users/)", () => {
    const hits = generated.split("\n").map((line, i) => ({ line, n: i + 1 })).filter(({ line }) => ABSOLUTE_PATH.test(line));
    expect(hits.map(({ n, line }) => `line ${n}: ${line.slice(0, 120)}`)).toEqual([]);
  });

  it("the absolute-path check catches the Windows stub, the Linux form and the macOS form, and spares URLs", () => {
    expect(ABSOLUTE_PATH.test('import mcp from "npm:C:\\\\Users\\\\ivand\\\\src\\\\lib\\\\mcp\\\\index.ts";')).toBe(true);
    expect(ABSOLUTE_PATH.test('import mcp from "d:/a/repo/src/lib/mcp/index.ts";')).toBe(true);
    expect(ABSOLUTE_PATH.test("// /home/runner/work/repo/src/lib/mcp/index.ts")).toBe(true);
    expect(ABSOLUTE_PATH.test("// /Users/someone/repo/src/lib/mcp/index.ts")).toBe(true);
    expect(ABSOLUTE_PATH.test('fetch("https://example.com/a"); // src/lib/mcp/index.ts')).toBe(false);
  });
});

describe("scripts/patch-mcp-plugin.mjs", () => {
  const plugin = join(ROOT, "node_modules/@lovable.dev/mcp-js/dist/stacks/supabase");
  const BEFORE = 'if (p.startsWith(".") || p.startsWith("/")) return null;';
  const PATCHED = 'if (p.startsWith(".") || p.startsWith("/") || /^[A-Za-z]:[\\\\/]/.test(p)) return null;';
  /** The plugin file as the package ships it, whether or not this machine has already patched it. */
  const original = (name: string) => readFileSync(join(plugin, name), "utf8").replace(PATCHED, BEFORE);
  const scratch = () => mkdtempSync(join(tmpdir(), "mcp-patch-"));

  it("keeps a drive-letter path as a local file, once, in both builds of the plugin", () => {
    const dir = scratch();
    try {
      for (const f of ["vite.js", "vite.cjs"]) {
        expect(original(f), `${f}: the line this script patches is gone, so the plugin changed: check it`).toContain(BEFORE);
        writeFileSync(join(dir, f), original(f));
      }
      run("scripts/patch-mcp-plugin.mjs", dir);
      const once = readFileSync(join(dir, "vite.js"), "utf8");
      expect(once).toContain(PATCHED);
      expect(once).not.toContain(BEFORE);
      expect(readFileSync(join(dir, "vite.cjs"), "utf8")).toContain(PATCHED);
      run("scripts/patch-mcp-plugin.mjs", dir);
      expect(readFileSync(join(dir, "vite.js"), "utf8")).toBe(once);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("touches nothing, and does not fail the install, when the plugin has another shape", () => {
    const dir = scratch();
    try {
      const other = original("vite.js").replace('p.startsWith("/")', 'p.startsWith("~")');
      writeFileSync(join(dir, "vite.js"), other);
      expect(() => run("scripts/patch-mcp-plugin.mjs", dir)).not.toThrow();
      expect(readFileSync(join(dir, "vite.js"), "utf8")).toBe(other);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
