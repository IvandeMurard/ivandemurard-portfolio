import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { PRIMARY_NAV, UTILITY_NAV } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

export const AtriumHeader = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/70 glass-nav transition-all duration-500">
        <div className="flex justify-between items-center px-6 md:px-12 py-6 md:py-8 w-full max-w-screen-2xl mx-auto relative">
          <Link
            to="/"
            className="text-xl md:text-2xl font-headline italic text-primary tracking-wide hover:opacity-80 transition-opacity duration-500"
          >
            Ivan de Murard
          </Link>

          {/* Center primary nav */}
          <div className="hidden lg:flex items-center space-x-12 absolute left-1/2 -translate-x-1/2">
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "font-headline italic tracking-wide text-sm transition-colors duration-500",
                    isActive
                      ? "text-secondary border-b border-secondary/40 pb-1"
                      : "text-on-surface-variant hover:text-primary",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right utility links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {UTILITY_NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="font-headline italic tracking-wide text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-500"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="md:hidden text-primary hover:opacity-80 transition-opacity duration-500 active:scale-95"
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={[
          "fixed inset-0 z-40 bg-surface/95 glass-nav md:hidden transition-opacity duration-500",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="flex flex-col justify-center items-center h-full gap-10 px-8 text-center">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                [
                  "font-headline italic text-3xl transition-colors",
                  isActive ? "text-secondary" : "text-primary",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="h-px w-16 bg-outline-variant/30 my-4" />
          <div className="flex flex-wrap justify-center gap-6">
            {UTILITY_NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="font-headline italic text-base text-on-surface-variant"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AtriumHeader;
