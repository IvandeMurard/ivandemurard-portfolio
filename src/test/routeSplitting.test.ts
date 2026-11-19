import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pageFor, pages } from "@/routes";

// Route splitting: every page but the homepage loads on demand, and main.tsx fetches the first route's chunk before it
// renders. pageFor must therefore know every route App.tsx declares, or a first load would meet a Suspense fallback.
const app = readFileSync("src/App.tsx", "utf8");
const main = readFileSync("src/main.tsx", "utf8");
const routePaths = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);

describe("route splitting", () => {
  it("keeps only the homepage as a static import in App.tsx", () => {
    const staticPages = [...app.matchAll(/^import .* from "\.\/pages\/(\w+)\.tsx";/gm)].map((m) => m[1]);
    expect(staticPages).toEqual(["Index"]);
  });

  it("loads every other page through routes.ts, inside one Suspense", () => {
    for (const name of Object.keys(pages)) expect(app).toContain(`const ${name} = pages.${name}.Component;`);
    expect(app.match(/<Suspense /g)).toHaveLength(1);
  });

  it("knows the page of every route App.tsx declares (redirects included)", () => {
    expect(routePaths.length).toBeGreaterThan(20);
    for (const path of routePaths) {
      if (path === "*") continue;
      const concrete = path.replace(":slug", "some-entry");
      if (concrete === "/") expect(pageFor(concrete)).toBeNull();
      else if (/^\/(journal\/harnais|journeys$|atherix$|rose-design-lab$)/.test(concrete)) expect(pageFor(concrete)).not.toBeNull();
      else expect(pageFor(concrete), concrete).not.toBe(pages.NotFound);
    }
  });

  it("resolves a redirect to the page it ends on", () => {
    expect(pageFor("/journeys")).toBe(pages.CaseStudies);
    expect(pageFor("/atherix")).toBe(pages.Atherix);
    expect(pageFor("/journal/harnais-graders-boucles-fermees")).toBe(pages.JournalEntry);
    expect(pageFor("/rose-design-lab", "")).toBe(pages.RoseCasePage);
    expect(pageFor("/rose-design-lab", "?x=1")).toBe(pages.RoseCasePage);
    expect(pageFor("/rose-design-lab", "?concept=d")).toBe(pages.RoseDesignLab);
    expect(pageFor("/rose-design-lab", "?concept=")).toBe(pages.RoseDesignLab);
  });

  it("matches the way the router does: trailing slash and case ignored, unknown path is the 404 page", () => {
    expect(pageFor("/Rose/")).toBe(pages.RoseCasePage);
    expect(pageFor("/journal/")).toBe(pages.Journal);
    expect(pageFor("/no-such-page")).toBe(pages.NotFound);
    expect(pageFor("/journal/a/b")).toBe(pages.NotFound);
  });

  it("renders the first route only after its chunk is fetched", () => {
    expect(main.indexOf("await preloadRoute(")).toBeGreaterThan(-1);
    expect(main.indexOf("await preloadRoute(")).toBeLessThan(main.indexOf("createRoot(root).render("));
  });
});
