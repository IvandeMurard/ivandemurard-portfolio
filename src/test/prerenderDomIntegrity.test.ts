import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

// Regression: invalid nesting (e.g. <button> in <button>) in pre-rendered HTML
// makes the parser eject markup (footer, Rose dock) outside #root, leaving an
// inert duplicate dock that intercepts clicks.
const dir = path.resolve(__dirname, "../../prerendered");
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".html")) : [];

describe("pre-rendered DOM integrity", () => {
  it("has pre-rendered files", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("%s keeps everything inside #root", (file) => {
    const html = fs.readFileSync(path.join(dir, file), "utf8");
    const doc = new JSDOM(`<!DOCTYPE html><html><body><div id="root">${html}</div></body></html>`).window.document;
    expect(doc.body.children.length).toBe(1);
    expect(doc.body.firstElementChild?.id).toBe("root");
    expect(doc.querySelectorAll("button button").length).toBe(0);
  });
});
