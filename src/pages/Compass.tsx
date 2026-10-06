import { useRef } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { SectionDivider } from "@/components/SectionDivider";
import { CaseAnchors } from "@/components/case/CaseAnchors";
import { EntryActions } from "@/components/journal/EntryActions";
import { HeadingAnchor } from "@/components/reading/HeadingAnchor";
import { JournalToc } from "@/components/reading/JournalToc";
import { ReadingProgress } from "@/components/reading/ReadingProgress";
import { useHeadingToc } from "@/components/reading/useHeadingToc";
import { CompassCommand } from "@/components/compass/CompassCommand";
import { CompassConfidence, CompassReaders, CompassTimeline } from "@/components/compass/CompassFigures";
import { COMPASS, COMPASS_SECTIONS, type CompassBlock } from "@/content/compass";

const linkCls = "text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity";
const chipCls = "inline-block rounded-sm border border-outline bg-surface-container-low px-4 py-2 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant";

const Block = ({ block, title }: { block: CompassBlock; title: string }) => {
  if (block.kind === "paragraph") return <p className="font-body font-normal text-on-surface-variant leading-relaxed text-base md:text-lg mb-5 max-w-3xl">{block.text}</p>;
  if (block.kind === "list") return <ul className="list-disc pl-5 space-y-4 mb-8 max-w-3xl font-body font-normal text-on-surface-variant leading-relaxed text-base md:text-lg">{block.items.map((text) => <li key={text}>{text}</li>)}</ul>;
  if (block.kind === "code") return <div className="mb-8"><CompassCommand /></div>;
  if (block.kind === "figure") {
    const Figure = block.figure === "timeline" ? CompassTimeline : block.figure === "readers" ? CompassReaders : CompassConfidence;
    return <Figure caption={block.caption} />;
  }
  return (
    <div role="region" aria-label={title} tabIndex={0} className="max-w-3xl overflow-x-auto rounded-sm border border-outline-variant bg-surface-container-lowest mb-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{title}</caption>
        <thead><tr className="border-b border-outline">{block.head.map((h) => <th key={h} scope="col" className="px-4 py-3 font-label uppercase tracking-[0.16em] text-[10px] text-secondary">{h}</th>)}</tr></thead>
        <tbody>{block.rows.map((row) => <tr key={row[0]} className="border-b border-outline-variant last:border-b-0 align-top">
          <th scope="row" className="px-4 py-4 font-headline italic text-primary text-base">{row[0]}</th>
          {row.slice(1).map((cell, i) => <td key={i} className="px-4 py-4 font-body font-normal text-sm text-on-surface-variant leading-relaxed">{cell}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
  );
};

const Compass = () => {
  const articleRef = useRef<HTMLElement>(null);
  const toc = useHeadingToc(articleRef);
  return (
    <SiteLayout title="Compass">
      <Seo title="Compass" description={COMPASS.subhead} path="/compass" type="article" jsonLd={{
        "@context": "https://schema.org", "@type": "CreativeWork", name: COMPASS.name,
        headline: COMPASS.headline, description: COMPASS.subhead, url: "https://ivandemurard.com/compass",
        inLanguage: "en", creator: { "@type": "Person", name: "Ivan de Murard", url: "https://ivandemurard.com" },
        codeRepository: COMPASS.repo,
      }} />
      <ReadingProgress targetRef={articleRef} />
      <div className="pt-32">
        <Reveal as="header" className="px-6 md:px-12 mb-12 md:mb-16">
          <div className="max-w-screen-2xl mx-auto">
            <span data-reveal-child className="text-secondary font-label uppercase tracking-[0.2em] text-[10px] mb-6 block">Case study</span>
            <h1 data-reveal-child className="headline-ink font-headline text-4xl md:text-6xl lg:text-7xl text-primary italic leading-[0.98] mb-6">Compass</h1>
            <p data-reveal-child className="font-headline italic text-primary text-2xl md:text-3xl max-w-3xl leading-tight mb-6">{COMPASS.headline}</p>
            <p data-reveal-child className="text-on-surface-variant font-body text-lg max-w-2xl leading-relaxed mb-8">{COMPASS.subhead}</p>
            <p data-reveal-child className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-6">{COMPASS.label}</p>
            <p data-reveal-child className="font-body font-normal text-on-surface-variant max-w-3xl mb-6">Role: {COMPASS.role}</p>
            <span data-reveal-child className={`${chipCls} max-w-3xl`}>Status: {COMPASS.status}</span>
            <div data-reveal-child className="mt-8 flex flex-wrap items-center gap-6">
              <a href={COMPASS.demo} target="_blank" rel="noopener noreferrer" className={linkCls}>Open the demo</a>
              <a href={COMPASS.repo} target="_blank" rel="noopener noreferrer" className={linkCls}>GitHub</a>
              <CompassCommand />
            </div>
            <div data-reveal-child className="mt-8"><EntryActions title="Compass" markdownPath="/compass.md" variant="case" /></div>
          </div>
        </Reveal>
        <CaseAnchors current="compass" />
        <div className="px-6 md:px-12">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_14rem] gap-12">
            <article ref={articleRef} className="min-w-0 -mx-6 md:-mx-12">
              {COMPASS_SECTIONS.map((section, i) => (
                <div key={section.id}>
                  {i > 0 && <SectionDivider />}
                  <Reveal as="section" aria-labelledby={section.id} className="px-6 md:px-12 mb-12 md:mb-16">
                    <div className="max-w-screen-2xl mx-auto">
                      <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary block mb-3">Sec. {String(i + 1).padStart(2, "0")}</span>
                      <h2 id={section.id} tabIndex={-1} className="group font-headline italic text-primary text-3xl md:text-4xl leading-tight mb-6 scroll-mt-32">{section.title}<HeadingAnchor id={section.id} text={section.title} /></h2>
                      {section.status && <p className="mb-8"><span className={chipCls}>{section.status}</span></p>}
                      {section.blocks.map((block, index) => <Block key={index} block={block} title={section.title} />)}
                      {i === COMPASS_SECTIONS.length - 1 && <div className="max-w-3xl mt-10">
                        <a href={COMPASS.schedule} target="_blank" rel="noopener noreferrer" className={linkCls}>Schedule a conversation</a>
                        <p className="mt-5 font-body font-normal text-sm text-on-surface-variant">© Ivan de Murard. All rights reserved.</p>
                      </div>}
                    </div>
                  </Reveal>
                </div>
              ))}
            </article>
            <div className="hidden lg:block"><JournalToc items={toc} /></div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};
export default Compass;