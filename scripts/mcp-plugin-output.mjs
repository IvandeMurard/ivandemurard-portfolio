// Runs the real @lovable.dev/mcp-js Vite plugin on this project, the way `vite build` does, and prints the
// supabase/functions/mcp/index.ts it generates to stdout. Writes nothing in the project: the plugin is pointed at a
// scratch functions folder (removed afterwards) and at an empty env folder, so no .env is read.
// Run by src/test/mcpPluginPaths.test.ts in plain Node, because esbuild cannot run inside the jsdom test environment.
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

const ROOT = process.cwd();
const SCRATCH = join("node_modules", ".cache", "mcp-plugin-paths");
const envDir = mkdtempSync(join(tmpdir(), "mcp-plugin-env-"));
const scratchRoot = resolve(ROOT, SCRATCH);

try {
  mkdirSync(scratchRoot, { recursive: true });
  const plugin = mcpPlugin({ functionsDir: SCRATCH, functionName: "mcp" });
  await plugin.configResolved({ root: ROOT, envDir, envPrefix: "VITE_", base: "/" });
  process.stdout.write(readFileSync(join(scratchRoot, "mcp", "index.ts"), "utf8"));
} finally {
  rmSync(scratchRoot, { recursive: true, force: true });
  rmSync(envDir, { recursive: true, force: true });
}
