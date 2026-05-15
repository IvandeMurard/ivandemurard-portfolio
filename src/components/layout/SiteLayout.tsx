import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AtriumHeader } from "./AtriumHeader";
import { Footer } from "./Footer";
import { SectionRail, type RailSection } from "./SectionRail";
import { PageLight } from "@/components/PageLight";
import { BrandCursor } from "@/components/BrandCursor";
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
    if (title) document.title = `${title} · Ivan de Murard`;
    else document.title = "Ivan de Murard, Product Builder";
  }, [title]);

  return (
    <div className="relative min-h-screen flex flex-col bg-surface text-on-surface">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-on-primary focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-secondary"
      >
        Skip to content
      </a>
      <PageLight />
      <BrandCursor />
      <AtriumHeader />
      <SectionRail sections={sections} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default SiteLayout;

