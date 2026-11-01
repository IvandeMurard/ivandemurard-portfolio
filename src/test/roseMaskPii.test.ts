import { describe, expect, it } from "vitest";
import { ibanValid, luhnValid, maskPii } from "../../supabase/functions/_shared/mask-pii";

describe("maskPii: existing classes", () => {
  it("masks emails and phone numbers", () => {
    expect(maskPii("write to jane.doe@example.com")).toBe("write to [email masked]");
    expect(maskPii("call +33 6 12 34 56 78 now")).toBe("call [phone masked] now");
  });
  it("leaves plain questions alone", () => {
    const q = "What does Ivan measure on the Aetherix page?";
    expect(maskPii(q)).toBe(q);
  });
});

describe("maskPii: postal addresses", () => {
  it.each([
    ["J'habite au 12 rue de la Paix, 75002 Paris", "J'habite au [address masked]"],
    ["Mon adresse est 5 bis avenue Victor Hugo 69003 Lyon", "Mon adresse est [address masked]"],
    ["Livrez au 8 boulevard Saint-Germain.", "Livrez au [address masked]."],
    ["I live at 221B Baker Street, London", "I live at [address masked], London"],
    ["Send it to 10 Downing Street", "Send it to [address masked]"],
    ["Meet at 45 Park Avenue", "Meet at [address masked]"],
  ])("masks %s", (input, expected) => {
    expect(maskPii(input)).toBe(expected);
  });
  it.each([
    "In 2026 the street view feature shipped",
    "I read 3 streets of data",
    "Rue is a French word for street",
    "The Main Street project has 4 chapters",
    "Version 12 of the avenue",
  ])("leaves %s alone", (input) => {
    expect(maskPii(input)).toBe(input);
  });
});

describe("maskPii: URLs", () => {
  it.each([
    ["see https://example.com/path?q=1 for details", "see [link masked] for details"],
    ["go to www.example.org today", "go to [link masked] today"],
    ["my profile is linkedin.com/in/jane-doe.", "my profile is [link masked]."],
  ])("masks %s", (input, expected) => {
    expect(maskPii(input)).toBe(expected);
  });
  it.each([
    "Aetherix.ai is a product name",
    "e.g. the file.txt example",
    "version 1.2 shipped",
  ])("leaves %s alone", (input) => {
    expect(maskPii(input)).toBe(input);
  });
});

describe("maskPii: card numbers", () => {
  it("accepts Luhn-valid numbers only", () => {
    expect(luhnValid("4111111111111111")).toBe(true);
    expect(luhnValid("4111111111111112")).toBe(false);
  });
  it.each([
    ["my card is 4111 1111 1111 1111 ok", "my card is [card masked] ok"],
    ["card 4111-1111-1111-1111", "card [card masked]"],
    ["5500 0000 0000 0004", "[card masked]"],
    ["4111111111111111", "[card masked]"],
  ])("masks %s", (input, expected) => {
    expect(maskPii(input)).toBe(expected);
  });
  it("does not label a Luhn-invalid number as a card", () => {
    expect(maskPii("4111 1111 1111 1112")).not.toContain("[card masked]");
  });
  it("leaves short numbers alone", () => {
    expect(maskPii("order 12345678 of 2026")).toBe("order 12345678 of 2026");
  });
});

describe("maskPii: IBANs", () => {
  it("validates the mod-97 check", () => {
    expect(ibanValid("GB82WEST12345698765432")).toBe(true);
    expect(ibanValid("GB82WEST12345698765433")).toBe(false);
  });
  it.each([
    ["pay to FR14 2004 1010 0505 0001 3M02 606 please", "pay to [IBAN masked] please"],
    ["IBAN GB82WEST12345698765432", "IBAN [IBAN masked]"],
    ["de89 3704 0044 0532 0130 00", "[IBAN masked]"],
    ["DE89370400440532013000 does it work", "[IBAN masked] does it work"],
  ])("masks %s", (input, expected) => {
    expect(maskPii(input)).toBe(expected);
  });
  it("leaves a failed check alone", () => {
    expect(maskPii("FR14 2004 1010 0505 0001 3M02 607")).not.toContain("[IBAN masked]");
  });
  it("leaves ordinary codes alone", () => {
    const q = "Case ID AB12 CD34 and reference note";
    expect(maskPii(q)).toBe(q);
  });
});

describe("maskPii: IP addresses", () => {
  it.each([
    ["my ip is 192.168.1.10", "my ip is [IP masked]"],
    ["8.8.8.8 is public", "[IP masked] is public"],
    ["from 2001:0db8:85a3:0000:0000:8a2e:0370:7334 today", "from [IP masked] today"],
    ["link-local fe80::1ff:fe23:4567 here", "link-local [IP masked] here"],
  ])("masks %s", (input, expected) => {
    expect(maskPii(input)).toBe(expected);
  });
  it.each([
    "version 1.2.3 shipped",
    "meeting at 12:30:45 sharp",
    "use std::vector here",
  ])("leaves %s alone", (input) => {
    expect(maskPii(input)).toBe(input);
  });
  // The long-standing phone pattern still catches dotted digit runs; they must not be labelled as IP addresses.
  it.each([
    "300.1.1.1 is not an address",
    "section 1.2.3.4.5 of the plan",
  ])("does not label %s as an IP address", (input) => {
    expect(maskPii(input)).not.toContain("[IP masked]");
  });
});

describe("maskPii: labels stay distinct", () => {
  it("does not report a card, an IBAN or an IP address as a phone number", () => {
    const out = maskPii("4111 1111 1111 1111, GB82WEST12345698765432, 192.168.1.10");
    expect(out).toBe("[card masked], [IBAN masked], [IP masked]");
  });
});
