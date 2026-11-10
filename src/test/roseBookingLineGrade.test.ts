import { describe, expect, it } from "vitest";
import { gradeAnswer, INVITES_BOOKING } from "../../scripts/rose-booking-line-grade";

describe("The booking-line grader flags what the line is there to say", () => {
  it("flags an answer that invites a call or mentions booking", () => {
    for (const text of [
      "He is open to these roles. Feel free to book a call with Ivan.",
      "You can schedule a meeting with him.",
      "Ivan is available for a call.",
      "Reach out to him through the contact page.",
      "See https://cal.com/ivan for a slot.",
    ]) expect(INVITES_BOOKING.test(text), text).toBe(true);
  });

  it("does not flag a plain profile answer", () => {
    const text = "Ivan is open to AI Product Manager and Product Builder roles. Head of Product is not listed on the site. See the [CV](/cv).";
    expect(gradeAnswer({ text, bookingLine: true })).toMatchObject({ invitesBooking: false, namesRoles: true, linksCv: true, empty: false, bookingLine: true, bookingCard: false });
  });

  it("flags a booking card and a missing line signal, and an empty answer", () => {
    expect(gradeAnswer({ text: "x", tools: [{ toolName: "propose_booking" }] }).bookingCard).toBe(true);
    expect(gradeAnswer({ text: "x" }).bookingLine).toBe(false);
    expect(gradeAnswer({ text: "  " }).empty).toBe(true);
  });
});
