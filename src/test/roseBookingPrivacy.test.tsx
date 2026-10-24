import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("@/hooks/useTrackClick", () => ({ useTrackClick: () => () => {} }));
vi.mock("@/hooks/useHaptic", () => ({ useHaptic: () => () => {} }));

import { RoseBookingCard } from "@/components/rose/RoseBookingCard";
import { CAL_URL } from "@/components/rose/roseConfig";

describe("Rose booking card privacy", () => {
  const fetchMock = vi.fn(() => Promise.resolve(new Response("{}")));
  beforeEach(() => {
    fetchMock.mockClear();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("DEV", false);
    vi.stubGlobal("window", new Proxy(window, {
      get: (target, property) => property === "location" ? { hostname: "ivandemurard.com", pathname: "/" } : Reflect.get(target, property),
    }));
  });

  it("opens Cal.com with no conversation in the URL", () => {
    render(<RoseBookingCard intent="product" reason="Discuss a pilot" sessionId="s1" />);
    expect(screen.getByRole("link").getAttribute("href")).toBe(CAL_URL);
  });

  it("a click sends only one booking_clicked event and never calls the notify endpoint", () => {
    render(<RoseBookingCard intent="product" reason="Synthetic private challenge, never send this" sessionId="s1" />);
    fireEvent.click(screen.getByRole("link"));
    const urls = fetchMock.mock.calls.map((c) => String((c as unknown[])[0]));
    expect(urls.some((u) => u.includes("rose-booking-notify"))).toBe(false);
    expect(urls.filter((u) => u.includes("rose-event"))).toHaveLength(1);
    const body = JSON.parse(String(((fetchMock.mock.calls[0] as unknown[])[1] as RequestInit).body));
    expect(body).toEqual({
      session_id: "s1", path: "/", kind: "booking_clicked",
      booking_source: "card", label_or_question: "Booking card · product",
    });
    expect(JSON.stringify(body)).not.toContain("Synthetic private challenge");
  });
});
