/**
 * Glossary annotations for Field Notes.
 *
 * The entry prose in journal.ts stays plain text so the LLM corpus and the MCP
 * tools keep serving clean sentences. Marks live here and are applied at render
 * time: each phrase is marked once per article, on its first occurrence.
 */
export type TermMark = { phrase: string; id: string };

export const JOURNAL_TERMS: Record<string, TermMark[]> = {
  "harnesses-graders-closed-loops": [
    { phrase: "golden dataset", id: "goldenDataset" },
    { phrase: "harness", id: "harness" },
    { phrase: "protocol", id: "protocol" },
    { phrase: "case set", id: "caseSet" },
    { phrase: "abstention", id: "abstention" },
    { phrase: "drift", id: "drift" },
    { phrase: "counterfactual", id: "counterfactual" },
    { phrase: "closed loop", id: "closedLoop" },
    { phrase: "MAPE", id: "mape" },
    { phrase: "precision at five", id: "precisionAtK" },
    { phrase: "canary", id: "canary" },
    { phrase: "CI gate", id: "ciGate" },
    { phrase: "ontology", id: "ontology" },
  ],
};

export const getJournalTerms = (slug?: string): TermMark[] =>
  (slug && JOURNAL_TERMS[slug]) || [];
