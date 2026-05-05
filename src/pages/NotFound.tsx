import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <SiteLayout title="Page not found">
      <div className="min-h-[80vh] flex items-center justify-center px-6 md:px-12 pt-32 pb-24">
        <div className="text-center max-w-xl">
          <span className="font-label uppercase tracking-[0.3em] text-[12px] text-secondary mb-8 block opacity-80">
            A quiet detour
          </span>
          <h1 className="font-headline italic text-6xl md:text-8xl text-primary leading-[1.1] mb-8">
            This room <br />
            is empty.
          </h1>
          <p className="text-on-surface-variant font-light leading-relaxed mb-12">
            The page you were looking for is not here. Let's walk back to the entrance together.
          </p>
          <Link
            to="/"
            className="inline-block bg-primary text-on-primary px-10 py-5 rounded-xl font-label uppercase tracking-[0.2em] text-[11px] hover:bg-primary-container transition-all duration-500 ambient-shadow"
          >
            Return to the Atrium
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
};

export default NotFound;
