import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AtriumHeader } from "./AtriumHeader";
import { Footer } from "./Footer";
import { SectionRail, type RailSection } from "./SectionRail";
import { PageLight } from "@/components/PageLight";
import { RoseDock } from "@/components/rose/RoseDock";
import { usePreviewMode } from "@/hooks/usePreviewMode";

interface SiteLayoutProps {
  children: React.ReactNode;
  title?: string;
  sections?: RailSection[];
}

export const SiteLayout = ({ children, title, sections }: SiteLayoutProps) => {
  const { pathname } = useLocation();
  usePreviewMode();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    // Only a fallback: pages that render <Seo> own their own title.
    if (title) document.title = `${title} · Ivan de Murard`;
  }, [title]);


  return (
    {/* Bottom safe zone reserves the Rose dock's height so it never sits over the last CTA or status line. */}
    <div className="relative min-h-screen flex flex-col bg-surface text-on-surface pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-28">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-on-primary focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-secondary"
      >
        Skip to content
      </a>
      <PageLight />
      <div className="relative z-50" style={{ viewTransitionName: "site-header" }}>
        <AtriumHeader />
      </div>
      <SectionRail sections={sections} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <div style={{ viewTransitionName: "site-footer" }}>
        <Footer />
      </div>
      <RoseDock />
    </div>
  );
};

export default SiteLayout;

