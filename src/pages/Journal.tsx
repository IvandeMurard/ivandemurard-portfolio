import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Icon } from "@/components/ui/Icon";
import { JOURNAL_ENTRIES, READING_LIST } from "@/content/journal";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const Journal = () => (
  <SiteLayout title="Field Notes">
    <main className="pt-32 md:pt-40">
      {/* Hero strip */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-24 md:mb-32">
        <span className="font-label uppercase tracking-[0.3em] text-[12px] text-secondary mb-8 block opacity-80">
          Field Notes
        </span>
        <h1 className="font-headline text-5xl md:text-8xl italic text-primary leading-[1.05] mb-10">
          Notes from the field.
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl leading-relaxed font-light">
          Opinion on hard product decisions in hospitality tech, and a curated trail of what I am reading, listening
          to, and thinking with.
        </p>
      </section>

      {/* Entries */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-32 md:mb-48">
        <div className="flex items-end justify-between mb-12 md:mb-16 gap-8">
          <h2 className="font-headline text-3xl md:text-4xl italic text-primary">Entries</h2>
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">
            {JOURNAL_ENTRIES.length} {JOURNAL_ENTRIES.length === 1 ? "piece" : "pieces"}
          </span>
        </div>
        <ul className="divide-y divide-outline-variant/20 border-t border-outline-variant/20">
          {JOURNAL_ENTRIES.map((e) => (
            <li key={e.slug}>
              <Link
                to={`/journal/${e.slug}`}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 py-10 md:py-12 group"
              >
                <div className="md:col-span-3 flex flex-col gap-3">
                  <span className="font-label uppercase tracking-[0.18em] text-[10px] text-on-surface-variant">
                    {formatDate(e.date)}
                  </span>
                  <span className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary">
                    {e.category}
                  </span>
                </div>
                <div className="md:col-span-8">
                  <h3 className="font-headline italic text-2xl md:text-3xl text-primary group-hover:opacity-70 transition-opacity duration-500">
                    {e.title}
                  </h3>
                  <p className="mt-4 text-on-surface-variant font-light leading-relaxed max-w-2xl">{e.excerpt}</p>
                </div>
                <div className="md:col-span-1 flex md:justify-end items-start">
                  <Icon
                    name="arrow_outward"
                    className="text-secondary opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Reading list */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-32 md:pb-48">
        <div className="border-t border-outline-variant/20 pt-16 md:pt-24">
          <div className="flex items-end justify-between mb-12 md:mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="font-headline text-3xl md:text-4xl italic text-primary mb-4">Reading list</h2>
              <p className="text-on-surface-variant font-light leading-relaxed">
                A curated trail (articles, Substacks, podcasts) with a one-line take in my own voice.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {READING_LIST.map((r) => (
              <a
                key={r.url + r.title}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-8 md:p-10 bg-surface-container-low border border-outline-variant/15 rounded-lg hover:border-outline-variant/40 transition-all duration-500 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">{r.source}</span>
                  <span className="font-label uppercase tracking-[0.18em] text-[10px] text-on-surface-variant">
                    {formatDate(r.date)}
                  </span>
                </div>
                <h3 className="font-headline italic text-xl md:text-2xl text-primary mb-2 group-hover:opacity-70 transition-opacity duration-500">
                  {r.title}
                </h3>
                <p className="font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant mb-6">
                  {r.author}
                </p>
                <p className="text-on-surface-variant font-light leading-relaxed">{r.take}</p>
                <div className="mt-6 flex items-center gap-2 text-secondary text-sm font-headline italic">
                  Read
                  <Icon
                    name="arrow_outward"
                    className="text-sm group-hover:translate-x-1 transition-transform duration-500"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  </SiteLayout>
);

export default Journal;
