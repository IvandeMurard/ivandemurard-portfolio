import { defineConfig } from "@playwright/test";

// Journey tests: each one asserts a visible outcome, against the built site served from dist/ (`bun run build` first).
// Two widths: 1440 (desktop) and 390 (phone). Locally on Windows ARM64 use the installed Edge: PW_CHANNEL=msedge.
// In CI: `bunx playwright install --with-deps chromium`, no channel needed.
const PORT = Number(process.env.PW_PORT ?? 4173);

export default defineConfig({
  testDir: "tests/journeys",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    channel: process.env.PW_CHANNEL || undefined,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop-1440", use: { viewport: { width: 1440, height: 900 } } },
    { name: "phone-390", use: { viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    // dist/ served like the host does: files, then folder stubs (/atherix, /journeys, /rose-design-lab), then the SPA shell.
    command: `node tests/journeys/serve-dist.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
