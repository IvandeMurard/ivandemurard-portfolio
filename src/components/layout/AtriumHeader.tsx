import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Mail, Calendar, Linkedin, Github, type LucideIcon } from "lucide-react";
import { PRIMARY_NAV, SOCIAL_LINKS } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

const UTILITY_ICON_NAV: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Email", href: SOCIAL_LINKS.email, Icon: Mail },
  { label: "Book a Call", href: SOCIAL_LINKS.schedule, Icon: Calendar },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, Icon: Linkedin },
  { label: "GitHub", href: SOCIAL_LINKS.github, Icon: Github },
];

export const AtriumHeader = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/70 glass-nav border-b border-outline-variant/20 transition-all duration-500">
        <div className="flex justify-between items-center px-6 md:px-12 py-6 md:py-8 w-full max-w-screen-2xl mx-auto relative">
          <Link
            to="/"
            className="text-xl md:text-2xl font-headline italic text-primary tracking-wide hover:opacity-80 transition-opacity duration-500"
          >
            Ivan de Murard
          </Link>

          {/* Center primary nav */}
          <div className="hidden lg:flex items-center space-x-12 absolute left-1/2 -translate-x-1/2">
            {[
              ...(location.pathname !== "/" ? [{ label: "Home", to: "/" }] : []),
              ...PRIMARY_NAV,
            ].map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "font-headline italic tracking-wide text-sm transition-colors duration-500",
                    isActive
                      ? "text-secondary border-b border-secondary/60 pb-1 [text-shadow:0_0_18px_hsl(var(--secondary)/0.25)]"
                      : "text-on-surface-variant hover:text-primary",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right utility links */}
          <div className="hidden md:flex items-center space-x-5 lg:space-x-6">
            {UTILITY_ICON_NAV.map(({ label, href, Icon: LucideIcon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                title={label}
                className="text-on-surface-variant hover:text-secondary transition-all duration-500 hover:scale-110"
              >
                <LucideIcon size={18} strokeWidth={1.5} />
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
            {UTILITY_ICON_NAV.map(({ label, href, Icon: LucideIcon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                title={label}
                className="text-on-surface-variant hover:text-secondary transition-colors"
              >
                <LucideIcon size={22} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AtriumHeader;
