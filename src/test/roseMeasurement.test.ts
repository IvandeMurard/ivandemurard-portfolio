import { beforeEach, describe, expect, it, vi } from "vitest";
import { measurementAllowed, measurementPayload } from "@/components/rose/roseEvents";
import { rateLabel } from "@/components/rose/roseMetrics";
import { finishRoseRequest, referencePath, startRoseRequest } from "@/components/rose/roseMeasurement";

const log = vi.hoisted(() => vi.fn());
vi.mock("@/components/rose/roseEvents", async (original) => ({
  ...await original<typeof import("@/components/rose/roseEvents")>(), logRoseEvent: log,
}));
beforeEach(() => log.mockClear());

describe("Rose minimal measurement", () => {
  it("excludes local and preview traffic, even in a production build", () => {
    expect(measurementAllowed(true, "ivandemurard.com")).toBe(false);
    expect(measurementAllowed(false, "localhost")).toBe(false);
    expect(measurementAllowed(false, "id-preview.example.app")).toBe(false);
    expect(measurementAllowed(false, "ivandemurard.com")).toBe(true);
  });
  it("removes all content from new measurement events", () => {
    expect(measurementPayload({ session_id: "fake", path: "/cv", kind: "rose_answer_completed", request_id: "r1", label_or_question: "fake private text", section_id: "secret", used_chip: true })).toEqual({ session_id: "fake", path: "/cv", kind: "rose_answer_completed", request_id: "r1" });
  });
  it("only collects known portfolio paths, without queries or fragments", () => {
    expect(referencePath("/aetherix?email=fake#status")).toBe("/aetherix");
    expect(referencePath("https://ivandemurard.com/cv?x=fake")).toBe("/cv");
    expect(referencePath("//evil.example/cv")).toBeNull();
    expect(referencePath("/admin/rose")).toBeNull();
    expect(referencePath("/unknown")).toBeNull();
  });
  it("emits one start and one terminal outcome with the original page", () => {
    startRoseRequest("fake", "/lore", "chat1");
    finishRoseRequest(false, "chat1");
    finishRoseRequest(true, "chat1");
    expect(log).toHaveBeenCalledTimes(2);
    expect(log.mock.calls[1][0]).toMatchObject({ kind: "rose_answer_completed", path: "/lore" });
    expect(log.mock.calls[0][0].request_id).toBe(log.mock.calls[1][0].request_id);
  });
  it("does not log rehydration or allow a cancelled old chat to finish a new request", () => {
    finishRoseRequest(false, "restored");
    expect(log).not.toHaveBeenCalled();
    startRoseRequest("fake", "/cv", "new");
    finishRoseRequest(true, "old");
    expect(log).toHaveBeenCalledTimes(1);
    finishRoseRequest(true, "new");
    expect(log.mock.calls[1][0].kind).toBe("rose_answer_failed");
  });
  it("withholds rates without data or below 20 observations", () => {
    expect(rateLabel(0, 0)).toBe("Not yet measurable");
    expect(rateLabel(3, 19)).toBe("Insufficient data for a rate");
    expect(rateLabel(5, 20)).toBe("25.0%");
  });
});