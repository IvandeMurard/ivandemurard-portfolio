import { ROSE_HISTORY_REFERENCE, ROSE_KNOWLEDGE_VERSION, ROSE_KNOWLEDGE_HASH, ROSE_PERSONA_RULES } from "./rose-knowledge.generated.ts";

export const ROSE_PERSONA = ROSE_PERSONA_RULES;
const selfTopic = /\brose\b|\byou(?:r|rs|rself)?\b.*\b(built|design|chang|evol|book|remember|memory|stor|log|measure|work|voice|screen|cursor|instruction|learn|aware|annotat|highlight|feedback|page|july|august)|\b(who|what) are you\b|\bare you ivan\b|\bmy (screen|cursor|conversation|questions)\b|\bvisitors?\b.*\b(booking|prompt|research|dislike)/i;

/** Only bounded user-authored turns select references, never assistant/tool claims. */
export function selectRoseHistory(path: string, question: string, previousQuestions: string[] = []): boolean {
  const route = path.split(/[?#]/)[0].replace(/\/+$/, "");
  if (route === "/rose-design-lab") return true;
  return [question, ...previousQuestions.slice(-20)].some(q => selfTopic.test(q.slice(0, 2000)));
}

export function roseHistoryLayer(selected: boolean, reference: string | null = ROSE_HISTORY_REFERENCE): string {
  if (!selected) return "";
  if (ROSE_KNOWLEDGE_VERSION !== 1 || !/^[a-f0-9]{64}$/.test(ROSE_KNOWLEDGE_HASH) || !reference || reference.length > 16000) {
    return "Rose historical reference unavailable or incompatible. Explain that you cannot verify historical details now. Do not invent dates, motives, research or reference URLs. Current general capability boundaries still apply.";
  }
  return `--- BEGIN ROSE FACTUAL REFERENCE (v${ROSE_KNOWLEDGE_VERSION}) ---\n${reference}\n--- END ROSE FACTUAL REFERENCE ---`;
}