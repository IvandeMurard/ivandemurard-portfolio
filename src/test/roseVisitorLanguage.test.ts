import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { getRoseSystemPrompt, isRoseCareerQuestion, shouldShowRoseBookingLine } from "../../supabase/functions/_shared/rose-context";
import { isFrenchQuestion, ROSE_FRENCH_RULE, roseLanguageRule } from "../../supabase/functions/_shared/rose-language";
import { addressesIvanAsYou, isRoseExplicitMeetingRequest, isRoseFollowupAllowed, roseFollowupRejection } from "../../supabase/functions/_shared/rose-tool-contract";

// The visitor's language: Rose answers in the language of the question (English or French). The interface stays English.

beforeAll(() => {
  vi.stubGlobal("fetch", vi.fn(async (url: string) => new Response(`# Mirror of ${url}`, { status: 200 })));
});
afterAll(() => vi.unstubAllGlobals());

const FR = "Quel type de poste Ivan cherche-t-il, et comment décrit-il son travail ?";
const EN = "What kind of role is Ivan looking for, and how does he describe his work?";
const ctx = { question: "x" };

describe("the language rule in the prompt", () => {
  it("gives a French question the French-language rule, once", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/aetherix" }, question: FR });
    expect(prompt).toContain(ROSE_FRENCH_RULE);
    expect(prompt.split("Language of this turn").length - 1).toBe(1);
    expect(prompt).toContain("Answer in French");
    expect(prompt).toContain("Translation never upgrades planned to done");
    expect(prompt).toContain("quotes from the site, page titles, project names and statuses");
    expect(prompt).toContain("stays in English: do not translate or paraphrase it");
  });

  it("leaves an English question exactly as it was: no language rule", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/aetherix" }, question: EN });
    expect(prompt).not.toContain("Language of this turn");
    expect(prompt).not.toContain("Answer in French");
    expect(roseLanguageRule(EN)).toBe("");
  });

  it("an English prompt is the same text as the French prompt without the rule", async () => {
    const q = "What does Ivan measure?";
    const en = await getRoseSystemPrompt({ page: { path: "/aetherix" }, question: q });
    expect(en).not.toContain(ROSE_FRENCH_RULE);
  });
});

describe("a profile question in French is routed like the English one", () => {
  const QUESTIONS = [FR, "Ivan est-il ouvert à un poste de Head of Product ?"];
  for (const q of QUESTIONS) {
    it(`loads the CV and the Contact text, and withholds the booking card: ${q}`, async () => {
      expect(isRoseCareerQuestion(q)).toBe(true);
      expect(shouldShowRoseBookingLine(q)).toBe(true);
      const prompt = await getRoseSystemPrompt({ page: { path: "/rose" }, question: q });
      expect(prompt).toContain("--- BEGIN CASE STUDY: cv ---");
      expect(prompt).toContain("Open to AI Product Manager and Product Builder roles");
      expect(prompt).toContain("Answer only from the CV reference and the Contact text");
      expect(prompt).toContain("never confirm openness to any other role");
      expect(prompt).toContain("propose_booking tool is not available");
    });
  }
  it("still offers the booking card when a French profile question asks for a call", () => {
    for (const q of ["Je cherche un poste pour Ivan, peut-on prendre un rendez-vous ?", "Quel est son parcours ? Je voudrais un appel avec Ivan."]) {
      expect(isRoseExplicitMeetingRequest(q), q).toBe(true);
      expect(shouldShowRoseBookingLine(q), q).toBe(false);
    }
  });
  it("does not turn an ordinary French question into a profile question", () => {
    for (const q of ["Comment Ivan mesure-t-il Aetherix ?", "Que dit la page sur les relances ?"]) expect(isRoseCareerQuestion(q), q).toBe(false);
  });
});

describe("what counts as French", () => {
  it("reads French questions", () => {
    for (const q of [FR, "Quels projets d'Ivan sont prévus ?", "Où en est Aetherix ?", "Ivan est-il ouvert à un poste de Head of Product ?", "Bonjour, pouvez-vous m'expliquer Aetherix ?"]) {
      expect(isFrenchQuestion(q), q).toBe(true);
    }
  });
  it("does not read English questions, names or a single shared word", () => {
    for (const q of [EN, "What does Ivan measure?", "How did Ivan test the app?", "Name the tools this portfolio MCP exposes.", "Is Ivan open to a Head of Product role?", "I would like to book a call with Ivan.", "What is the ton of the site?"]) {
      expect(isFrenchQuestion(q), q).toBe(false);
    }
  });
});

describe("the follow-up guard, in French", () => {
  const refused = [
    "Pouvez-vous détailler vos projets ?",
    "Quels sont vos projets ?",
    "Tu as construit quoi ?",
    "Quel est ton rôle chez Aetherix ?",
    "Parle-moi de tes projets",
    "Pourriez-vous m'en dire plus sur vos projets ?",
    "Pourriez-vous nous décrire votre parcours ?",
    "Comment avez-vous mesuré Aetherix ? Vous avez testé quoi ?",
  ];
  const allowed = [
    "Quels projets d'Ivan sont prévus ?",
    "Pourriez-vous m'en dire plus sur ses projets ?",
    "Comment Ivan a-t-il mesuré Aetherix ?",
    "Que dit la page sur son rôle ?",
  ];
  for (const item of refused) it(`refuses: ${item}`, () => {
    expect(addressesIvanAsYou(item)).toBe(true);
    expect(roseFollowupRejection(item, ctx)).toBe("addresses_ivan");
    expect(isRoseFollowupAllowed(item, ctx)).toBe(false);
  });
  for (const item of allowed) it(`keeps: ${item}`, () => expect(isRoseFollowupAllowed(item, ctx)).toBe(true));

  it("still refuses and keeps what it did in English", () => {
    expect(addressesIvanAsYou("Did you build Aetherix?")).toBe(true);
    expect(addressesIvanAsYou("What are your projects?")).toBe(true);
    expect(addressesIvanAsYou("Would you tell me more about his projects?")).toBe(false);
  });
});
