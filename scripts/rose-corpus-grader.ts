import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export type PublicDocument = { file: string; text: string };
export type ClaimReview = { claim: string; supported: boolean; source: string; quote: string };

export function loadPublicCorpus(directory = 'public'): PublicDocument[] {
  return readdirSync(directory).filter(file => file.endsWith('.md')).sort()
    .map(file => ({ file, text: readFileSync(join(directory, file), 'utf8') }));
}

/** A semantic judge checks entailment; exact citations are independently checked here.
 * The judge must enumerate every factual claim, not just search for forbidden phrases.
 */
export async function gradeCorpusClaims(
  answer: string,
  documents: PublicDocument[],
  review: (answer: string, documents: PublicDocument[]) => Promise<ClaimReview[]>,
): Promise<string[]> {
  if (!documents.length || !answer.trim()) return ['missing answer or public corpus'];
  const claims = await review(answer, documents);
  if (!claims.length) return ['judge returned no claim assessment'];
  return claims.flatMap(claim => {
    if (!claim.supported) return [`unsupported claim: ${claim.claim}`];
    const document = documents.find(doc => doc.file === claim.source);
    if (!document || !claim.quote.trim() || !document.text.includes(claim.quote)) {
      return [`unverifiable evidence: ${claim.claim}`];
    }
    return [];
  });
}