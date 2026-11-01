import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";

// Drizzle is the migration system this project applies; 0004 is the applied retention migration.
const MIGRATION = "drizzle/migrations/0004_rose_retention_cron.sql";
const migration = existsSync(MIGRATION) ? readFileSync(MIGRATION, "utf8") : "";

/** The `SELECT cron.schedule('<name>', ...);` statement as recorded in an earlier drizzle migration. */
const original = (file: string, name: string) => {
  const sql = readFileSync(`drizzle/migrations/${file}`, "utf8");
  const start = sql.indexOf(`SELECT cron.schedule('${name}'`);
  return start < 0 ? undefined : sql.slice(start, sql.indexOf(";", start) + 1);
};

describe("Rose retention cron migration", () => {
  it("is the applied drizzle migration, and no second copy exists under supabase/migrations", () => {
    expect(existsSync(MIGRATION)).toBe(true);
    expect(readFileSync("drizzle/migrations/meta/_journal.json", "utf8")).toContain('"tag": "0004_rose_retention_cron"');
    expect(readdirSync("supabase/migrations").filter((f) => f.includes("rose_retention_cron"))).toEqual([]);
  });
  it("declares both purge jobs at 03:00 daily, 90 days", () => {
    for (const name of ["purge-old-rose-events", "purge-old-rose-sessions"]) {
      expect(migration).toContain(`cron.schedule('${name}', '0 3 * * *'`);
    }
    expect(migration.split("interval '90 days'")).toHaveLength(3);
  });
  it("uses exactly the definitions already recorded in the earlier drizzle migrations", () => {
    const events = original("0000_rose_events_and_roles.sql", "purge-old-rose-events");
    const sessions = original("0002_rose_sessions_retention.sql", "purge-old-rose-sessions");
    expect(events).toBeDefined();
    expect(sessions).toBeDefined();
    expect(migration).toContain(events!);
    expect(migration).toContain(sessions!);
  });
  it("is idempotent: unschedules each job by name before scheduling it", () => {
    for (const name of ["purge-old-rose-events", "purge-old-rose-sessions"]) {
      const unschedule = migration.indexOf(`cron.unschedule('${name}')`);
      const schedule = migration.indexOf(`cron.schedule('${name}'`);
      expect(unschedule).toBeGreaterThan(-1);
      expect(unschedule).toBeLessThan(schedule);
      expect(migration).toContain(`jobname = '${name}'`);
    }
  });
});
