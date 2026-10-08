import { describe, expect, it } from "vitest";
import { LAMP_INDEX, RECO_LINES, lampOf } from "@/content/recoLine";

describe("signal vocabulary", () => {
  it("lights GO top, WARN middle, STOP bottom", () => {
    expect([LAMP_INDEX.go, LAMP_INDEX.warn, LAMP_INDEX.stop]).toEqual([0, 1, 2]);
  });
  it("DARK lights nothing", () => expect(LAMP_INDEX.dark).toBeNull());
  it("a declared truth is amber, a counterfactual is dark", () => {
    const s = RECO_LINES.aetherix.stations;
    expect(lampOf(s[2], "truth")).toBe("warn");
    expect(lampOf(s[4], "truth")).toBe("dark");
  });
});
