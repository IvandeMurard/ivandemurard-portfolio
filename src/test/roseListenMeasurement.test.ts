import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { measurementPayload } from "@/components/rose/roseEvents";

const migration = readFileSync("drizzle/migrations/0012_rose_listen.sql", "utf8");
const previous = readFileSync("drizzle/migrations/0009_rose_history_rejected_kind.sql", "utf8");
const fn = readFileSync("supabase/functions/rose-event/index.ts", "utf8");

const kindsOf = (sql: string) => [...(sql.match(/CHECK \(kind IN \(([\s\S]*?)\)\)/)?.[1].matchAll(/'([a-z_]+)'/g) ?? [])].map((m) => m[1]);

describe("Listen measurement", () => {
  it("the migration widens the allowed kinds exactly like 0009 did: everything before, plus listen and listen_complete", () => {
    expect(kindsOf(migration)).toEqual([...kindsOf(previous), "listen", "listen_complete"]);
    expect(migration).toContain("listen_source IN ('summary', 'answer')");
  });
  it("rose-event accepts the same two kinds, and only the two sources", () => {
    expect(fn).toMatch(/kind: z\.enum\(\[[^\]]*"listen", "listen_complete"\]\)/);
    expect(fn).toContain('listen_source: z.enum(["summary", "answer"])');
  });
  it("a Listen event carries the source, the page and the session, and no content", () => {
    expect(measurementPayload({
      session_id: "s", path: "/cv", kind: "listen", listen_source: "answer",
      label_or_question: "private question", section_id: "secret", used_chip: true, request_id: "r", target_path: "/cv",
    })).toEqual({ session_id: "s", path: "/cv", kind: "listen", listen_source: "answer" });
    expect(measurementPayload({ session_id: "s", path: "/", kind: "listen_complete", listen_source: "summary", label_or_question: "x" }))
      .toEqual({ session_id: "s", path: "/", kind: "listen_complete", listen_source: "summary" });
  });
  it("the usage table keeps no text, is service-role only, and is purged after seven days", () => {
    const table = migration.slice(migration.indexOf("CREATE TABLE IF NOT EXISTS public.rose_listen_usage"), migration.indexOf(");", migration.indexOf("CREATE TABLE IF NOT EXISTS public.rose_listen_usage")));
    const columns = [...table.matchAll(/^\s+([a-z_]+)\s/gm)].map((m) => m[1]);
    expect(columns).toEqual(["id", "created_at", "session_id", "chars", "cached"]);
    expect(migration).toContain("ALTER TABLE public.rose_listen_usage ENABLE ROW LEVEL SECURITY");
    expect(migration).not.toMatch(/CREATE POLICY/);
    expect(migration).toContain("interval '7 days'");
    expect(migration).toContain("'rose-listen', 'rose-listen', false");
  });
  it("the migration has no cache purge of its own: no pg_net, no Vault, no purge function, no delete on storage.objects", () => {
    expect(migration).not.toMatch(/pg_net|net\.http|vault|purge_rose_listen_cache|storage\.objects/i);
    expect(migration).not.toContain("purge-old-rose-listen-cache");
    // The only cron job left is the content-free usage table.
    expect([...migration.matchAll(/cron\.schedule\('([a-z-]+)'/g)].map((m) => m[1])).toEqual(["purge-old-rose-listen-usage"]);
  });
  it("rose-listen purges the cache through the Storage API, after the response, in the background", () => {
    const index = readFileSync("supabase/functions/rose-listen/index.ts", "utf8");
    expect(index).toContain("purgeExpiredListenCache");
    expect(index).toContain("bucket.remove(names)");
    expect(index).toContain("EdgeRuntime.waitUntil(task)");
    expect(index).not.toMatch(/DELETE\s+FROM\s+storage/i);
  });
  it("/privacy says the private store keeps the text and audio for about 90 days, then deletes them", () => {
    expect(readFileSync("src/pages/Privacy.tsx", "utf8").replace(/\s+/g, " ")).toContain("its audio are also kept for about 90 days, then deleted, in a private store of this site");
  });
  it("is the next drizzle migration and is in the journal", () => {
    expect(readFileSync("drizzle/migrations/meta/_journal.json", "utf8")).toContain('"tag": "0012_rose_listen"');
  });
});

describe("Listen secrets", () => {
  it("no key in any file: the functions and the script read it from the environment", () => {
    for (const f of ["supabase/functions/rose-listen/index.ts", "supabase/functions/_shared/listen-handler.ts", "supabase/functions/_shared/listen-core.ts", "scripts/generate-listen-audio.ts"]) {
      const src = readFileSync(f, "utf8");
      expect(src, f).not.toMatch(/sk_[a-f0-9]{16,}/i);
      expect(src, f).not.toMatch(/xi-api-key":\s*"/);
    }
    expect(readFileSync("scripts/generate-listen-audio.ts", "utf8")).toContain("process.env.ELEVENLABS_API_KEY");
    expect(readFileSync("supabase/functions/_shared/listen-handler.ts", "utf8")).toContain('deps.env("ELEVENLABS_API_KEY")');
  });
  it("the generator is run by hand: nothing in package.json calls it", () => {
    expect(readFileSync("package.json", "utf8")).not.toContain("generate-listen-audio");
  });
});

describe("listen_entry", () => {
  const entries = readFileSync("drizzle/migrations/0014_rose_listen_entry.sql", "utf8");
  it("is a closed list in the migration, like listen_source, and in rose-event, and the two agree", () => {
    expect(entries).toContain("listen_entry IS NULL OR listen_entry IN ('row', 'contents', 'index_card', 'dock_starter', 'answer')");
    expect(fn).toContain('listen_entry: z.enum(["row", "contents", "index_card", "dock_starter", "answer"])');
    expect(entries).not.toMatch(/ALTER TABLE public\.rose_events DROP CONSTRAINT IF EXISTS rose_events_kind_check/);
  });
  it("rejects listen_entry on any kind that is not a listen event", () => {
    expect(fn).toContain("e.listen_source || e.listen_entry");
  });
  it("a Listen event carries the entry beside the source, still no content", () => {
    expect(measurementPayload({
      session_id: "s", path: "/rose", kind: "listen", listen_source: "summary", listen_entry: "index_card", label_or_question: "private",
    })).toEqual({ session_id: "s", path: "/rose", kind: "listen", listen_source: "summary", listen_entry: "index_card" });
  });
});
