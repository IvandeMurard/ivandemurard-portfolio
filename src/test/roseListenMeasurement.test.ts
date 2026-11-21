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
  it("purges the cache bucket after 90 days with pg_cron, through the Storage API, so the files really go", () => {
    expect(migration).toContain("cron.schedule('purge-old-rose-listen-cache', '0 3 * * *'");
    expect(migration).toContain("created_at < now() - interval '90 days'");
    expect(migration).toContain("bucket_id = 'rose-listen'");
    // A SQL delete on storage.objects orphans the files: the job must call the Storage API instead.
    expect(migration).not.toMatch(/DELETE\s+FROM\s+storage\.objects/i);
    expect(migration).toContain("net.http_delete");
    expect(migration).toContain("/storage/v1/object/rose-listen/");
    // The key comes from the Vault and is never written in the file; a missing secret fails loudly.
    expect(migration).toContain("vault.decrypted_secrets");
    expect(migration).not.toMatch(/eyJ[A-Za-z0-9_-]{20,}/);
    expect(migration).toContain("RAISE EXCEPTION");
    expect(migration).toContain("REVOKE ALL ON FUNCTION public.purge_rose_listen_cache()");
  });
  it("/privacy says the private store keeps the text and audio for 90 days, the same number as the job", () => {
    expect(readFileSync("src/pages/Privacy.tsx", "utf8").replace(/\s+/g, " ")).toContain("its audio are also kept for 90 days in a private store of this site");
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
