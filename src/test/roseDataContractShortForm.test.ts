import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { ROSE_DATA_SHORT } from "../content/roseDataContract";

// The short form of the data contract is one constant. Surfaces with room for one line use it;
// the full sentences stay on /privacy (checked in roseDataContractWording.test.ts).
const flat = (file: string) => readFileSync(file, "utf8").replace(/\s+/g, " ");

describe("Rose data contract, short form", () => {
  it("is the official line, linking to /privacy", () => {
    expect(ROSE_DATA_SHORT.line).toBe("Questions are stored for 90 days · Privacy");
    expect(ROSE_DATA_SHORT.text).toBe("Questions are stored for 90 days");
    expect(ROSE_DATA_SHORT.linkLabel).toBe("Privacy");
    expect(ROSE_DATA_SHORT.href).toBe("/privacy");
  });
  it("is registered in the copy deck", () => {
    expect(flat("docs/rose-case-study-copy.md")).toContain(`"${ROSE_DATA_SHORT.line}"`);
  });
  it("the dock uses the constant and does not retype the line", () => {
    const dock = readFileSync("src/components/rose/RoseDock.tsx", "utf8");
    expect(dock).toContain("ROSE_DATA_SHORT");
    expect(dock).not.toContain("stored for 90 days");
  });
  it("agrees with the full text: 90 days of storage, stated on /privacy", () => {
    expect(flat("src/pages/Privacy.tsx")).toContain("Questions are stored, then purged after 90 days.");
  });
});
