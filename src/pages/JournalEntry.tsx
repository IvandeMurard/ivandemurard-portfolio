import { Link, useParams } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { JOURNAL_ENTRIES } from "@/content/journal";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const JournalEntry = () => {
  const { slug } = useParams<{ slug: string }>();
  const entry = JOURNAL_ENTRIES.find((e) => e.slug === slug);

  if (!entry) {
    return (
      <SiteLayout title="Field Notes">
        <div className="pt-40 px-6 md:px-12 max-w-3xl mx-auto min-h-[60vh]">
          <span className="font-label uppercase tracking-[0.3em] text-[12px] text-secondary mb-8 block">
            Field Notes
          </span>
          <h1 className="font-headline text-4xl md:text-6xl italic text-primary mb-8">Entry not found.</h1>
          <p className="text-on-surface-variant font-light mb-12">
            That note may have been moved, renamed, or is still in draft.
          </p>
          <Link
            to="/journal"
            className="font-headline italic text-secondary border-b border-secondary/30 pb-1 hover:opacity-70 transition-opacity"
          >
            Back to Field Notes
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout title={entry.title}>
      <Seo
        title={entry.title}
        description={entry.excerpt}
        path={`/journal/${entry.slug}`}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: entry.title,
          description: entry.excerpt,
          datePublished: entry.date,
          dateModified: entry.date,
          author: { "@type": "Person", name: "Ivan de Murard", url: "https://ivandemurard.com" },
          articleSection: entry.category,
          url: `https://ivandemurard.com/journal/${entry.slug}`,
        }}
      />
      <div className="pt-32 md:pt-40 pb-32 md:pb-48">
        <article className="px-6 md:px-12 max-w-3xl mx-auto">
          <div className="mb-12 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">{entry.category}</span>
            <span className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">
              {formatDate(entry.date)}
            </span>
          </div>
          <h1 className="font-headline text-4xl md:text-6xl italic text-primary leading-[1.1] mb-12">
            {entry.title}
          </h1>
          <p className="text-xl md:text-2xl font-headline italic text-on-surface-variant leading-relaxed mb-16">
            {entry.excerpt}
          </p>
          <div className="space-y-8 text-lg text-on-surface-variant font-light leading-relaxed">
            {entry.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-24 pt-12 border-t border-outline-variant/20 flex items-center justify-between">
            <Link
              to="/journal"
              className="font-headline italic text-secondary border-b border-secondary/30 pb-1 hover:opacity-70 transition-opacity inline-flex items-center gap-2"
            >
              <Icon name="arrow_back" className="text-sm" />
              All Field Notes
            </Link>
          </div>
        </article>
      </div>
    </SiteLayout>
  );
};

export default JournalEntry;
