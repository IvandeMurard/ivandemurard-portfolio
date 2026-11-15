/** The visitor's language. Rose answers in the language of the question, English or French; the interface stays English.
 * One place, read by rose-chat and the evaluation runner through getRoseSystemPrompt. English is the default and adds
 * nothing to the prompt, so an English turn is byte-identical to what it was before. */

// Letters that English does not use. A single one is enough ("Où", "quelles", "café" aside, rare in an English question).
const FRENCH_LETTERS = /[éèêëàâùûôîïçœ]/i;
// Common French words that are not English words. Two distinct ones, so a name or a quote does not tip it.
const FRENCH_WORDS = new Set([
  "quel", "quels", "quelle", "quelles", "quoi", "pourquoi", "comment", "combien", "quand", "peux", "pouvez", "pourriez",
  "parlez", "dites", "donne", "montre", "explique", "bonjour", "salut", "merci", "avec", "dans", "pour", "des", "les", "une", "du", "aux",
  "ses", "sa", "mes", "mon", "votre", "vos", "vous", "tu", "ton", "tes", "je", "nous", "est", "sont", "projets", "projet", "poste", "cherche",
  "travaille", "fait", "fais", "et", "ou", "qui", "que", "quelque", "aussi", "pas", "sur", "il", "elle", "ce", "cet", "cette", "ces",
]);
// A few of these ("et", "ton", "fait") also exist in English, so one alone never decides: two distinct words are needed.

export function isFrenchQuestion(question: string): boolean {
  const q = question.slice(0, 2000);
  if (FRENCH_LETTERS.test(q)) return true;
  const words = new Set(q.toLowerCase().match(/[a-z]+/g) ?? []);
  let hits = 0;
  for (const w of words) if (FRENCH_WORDS.has(w) && ++hits >= 2) return true;
  return false;
}

export const ROSE_FRENCH_RULE = `Language of this turn: the visitor wrote in French. Answer in French.
Keep exactly as published, in English and unchanged: quotes from the site, page titles, project names and statuses (Built, Shadow-mode, Synthetic PoC, Design, Research, Pilot-ready and the like). Do not translate them. Put a quote in quotation marks and keep it in English; explain it in French around it.
Keep every figure and every date exactly as published, and keep the distinction between what was achieved and what is planned. Translation never upgrades planned to done: "planned" stays "prévu" or "envisagé", never a past or present accomplishment. Never change a title, a role, a figure or a date in translation.
Follow-ups follow the answer's language: write them in French, with Ivan in the third person ("Quels projets d'Ivan ...", "ses projets"). Never address Ivan as vous, tu, votre, ton, tes or vos.
The interface text (booking line, section labels, fallback line, starter questions) stays in English: do not translate or paraphrase it.`;

/** The language rule for this turn: nothing for English, the French rule for French. */
export const roseLanguageRule = (question: string): string => (isFrenchQuestion(question) ? ROSE_FRENCH_RULE : "");
