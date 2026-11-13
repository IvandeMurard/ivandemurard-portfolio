// Fixes @lovable.dev/mcp-js 0.24.0 on Windows, so that `vite build` writes the same supabase/functions/mcp/index.ts
// there as on Linux. Run by `postinstall`; safe to run again.
//
// The cause: the plugin hands esbuild the MCP entry as an absolute path. Its own resolver keeps a path that starts
// with "." or "/" as a local file and turns every other import into an `npm:` specifier. A Windows path starts with
// a drive letter (C:\...), so the entry became `npm:C:\...` and the bundle was a 7-line stub with a local path in it.
// The fix: a path that starts with a drive letter is a local file too. Behaviour on Linux and macOS is unchanged.
//
// It only edits the one known line. If the plugin changes (another version), it says so and touches nothing:
// src/test/mcpPluginPaths.test.ts then tells whether the new version still has the problem.
//   node scripts/patch-mcp-plugin.mjs [folder holding vite.js and vite.cjs]
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const dir = resolve(process.argv[2] ?? "node_modules/@lovable.dev/mcp-js/dist/stacks/supabase");
const BEFORE = 'if (p.startsWith(".") || p.startsWith("/")) return null;';
const AFTER = 'if (p.startsWith(".") || p.startsWith("/") || /^[A-Za-z]:[\\\\/]/.test(p)) return null;';

for (const name of ["vite.js", "vite.cjs"]) {
  const file = join(dir, name);
  if (!existsSync(file)) { console.warn(`[patch-mcp-plugin] ${file} not found, nothing patched`); continue; }
  const text = readFileSync(file, "utf8");
  if (text.includes(AFTER)) { console.log(`[patch-mcp-plugin] ${name}: already patched`); continue; }
  if (!text.includes(BEFORE)) { console.warn(`[patch-mcp-plugin] ${name}: the line to patch is not there (another plugin version?), nothing patched`); continue; }
  writeFileSync(file, text.replace(BEFORE, AFTER), "utf8");
  console.log(`[patch-mcp-plugin] ${name}: patched`);
}
