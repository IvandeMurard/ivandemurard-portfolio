import type { JournalEntry } from "@/content/journal";

export const ArticleUpdates = ({ updates }: { updates: JournalEntry["updates"] }) => {
  if (!updates?.length) return null;
  return (
    <section aria-labelledby="article-updates" className="mt-12 border-t border-outline-variant pt-8">
      <h2 id="article-updates" className="font-headline italic text-2xl text-primary mb-4">Updates</h2>
      <p className="font-body text-sm text-on-surface-variant mb-4">This piece is revised when something it claims stops being true. Each revision says what changed and why.</p>
      <ul className="space-y-4 font-body text-sm text-on-surface-variant">
        {updates.map((update, i) => <li key={`${update.date}-${i}`}><time dateTime={update.date}>{update.date}</time>{" · "}<span className="font-medium">{update.summary}</span>{" "}<span className="font-normal">{update.reason}</span></li>)}
      </ul>
    </section>
  );
};
