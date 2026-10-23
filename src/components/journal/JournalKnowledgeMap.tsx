import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { JOURNAL_ENTRIES, JOURNAL_KNOWLEDGE_QUESTIONS } from "@/content/journal";

const label = "font-label uppercase tracking-[0.2em] text-[10px]";

export const JournalKnowledgeMap = () => (
  <section aria-labelledby="explore-by-question" className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-24 md:mb-32">
    <h2 id="explore-by-question" className={`${label} text-secondary mb-10 md:mb-12`}>Explore by question</h2>
    <ol className="grid grid-cols-1 lg:grid-cols-3 border-t border-outline-variant lg:divide-x divide-outline-variant">
      {JOURNAL_KNOWLEDGE_QUESTIONS.map((q) => {
        const entry = JOURNAL_ENTRIES.find((e) => e.slug === q.slug);
        if (!entry) return null;
        return (
          <li key={q.slug} className="flex flex-col gap-5 py-10 lg:py-12 lg:px-8 first:lg:pl-0 last:lg:pr-0 border-b lg:border-b-0 border-outline-variant">
            <span className={`${label} text-on-surface-variant`}>{q.number} · {q.label}</span>
            <h3 className="font-headline italic text-2xl md:text-3xl text-primary leading-tight">{q.question}</h3>
            <p className="text-on-surface-variant leading-relaxed font-normal">{q.description}</p>
            <Link to={`/journal/${entry.slug}`}
              className="mt-auto min-h-[44px] inline-flex items-center self-start font-headline italic text-lg text-secondary border-b border-secondary/40 hover:border-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">
              Read the method: {entry.title} →
            </Link>
            <p className={`${label} text-on-surface-variant flex flex-wrap items-center gap-x-3 gap-y-2`}>
              <span>Applied in</span>
              {q.cases.map((c, i) => (
                <span key={c.to} className="inline-flex items-center gap-x-3">
                  {i > 0 && <span aria-hidden="true" className="text-on-surface-variant">·</span>}
                  <Link to={c.to} aria-label={`${c.label} case study`}
                    className="min-h-[44px] inline-flex items-center text-primary border-b border-primary/40 hover:border-secondary hover:text-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">
                    {c.label}
                  </Link>
                </span>
              ))}
            </p>
          </li>
        );
      })}
    </ol>
  </section>
);
