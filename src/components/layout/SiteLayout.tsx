import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AtriumHeader } from "./AtriumHeader";
import { Footer } from "./Footer";

interface SiteLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const SiteLayout = ({ children, title }: SiteLayoutProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    if (title) document.title = `${title} — Ivan de Murard`;
    else document.title = "Ivan de Murard — Digital Hospitality";
  }, [title]);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface overflow-x-hidden">
      <AtriumHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default SiteLayout;
