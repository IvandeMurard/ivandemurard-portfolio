import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import resolveConfig from "tailwindcss/resolveConfig";
import config from "../../tailwind.config";
import { cn } from "@/lib/utils";

// One floor for text on the site (board N, 19 Nov 2026): 13 px for running text, captions, table cells, figure labels and meta
// lines; 12 px for uppercase tracked labels. The tokens carry it (text-meta, text-kicker, and text-xs raised to 13 px);
// scripts/check-text-size.ts measures the rendered pages, and this file keeps the tokens and the sources honest.
const theme = resolveConfig(config).theme as unknown as { fontSize: Record<string, string | [string, unknown]> };
const sizeOf = (key: string) => {
  const v = theme.fontSize[key];
  return Array.isArray(v) ? v[0] : v;
};

describe("text size tokens", () => {
  it("meta and xs are 13px, kicker is 12px", () => {
    expect(sizeOf("meta")).toBe("0.8125rem");
    expect(sizeOf("xs")).toBe("0.8125rem");
    expect(sizeOf("kicker")).toBe("0.75rem");
  });

  it("cn keeps a size token next to a colour: text-meta and text-kicker are font sizes, not colours", () => {
    expect(cn("text-meta", "text-secondary")).toBe("text-meta text-secondary");
    expect(cn("text-kicker", "text-on-surface-variant")).toBe("text-kicker text-on-surface-variant");
    // A size still replaces a size.
    expect(cn("text-sm", "text-meta")).toBe("text-meta");
    expect(cn("text-meta", "text-base")).toBe("text-base");
  });
});

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

describe("no small text in the sources", () => {
  const files = walk("src").filter((f) => /\.(tsx|ts)$/.test(f) && !f.includes("src\\test") && !f.includes("src/test"));
  const hits: string[] = [];
  for (const f of files) {
    readFileSync(f, "utf8").split("\n").forEach((line, i) => {
      for (const m of line.matchAll(/text-\[(\d+(?:\.\d+)?)px\]/g)) {
        const px = Number(m[1]);
        const tracked = /\buppercase\b/.test(line) && /\btracking-/.test(line);
        if (px < (tracked ? 12 : 13)) hits.push(`${f}:${i + 1} ${m[0]}`);
      }
    });
  }
  it("has no text-[Npx] under 13px (12px for an uppercase tracked line); use text-meta or text-kicker", () => {
    expect(hits).toEqual([]);
  });
});
