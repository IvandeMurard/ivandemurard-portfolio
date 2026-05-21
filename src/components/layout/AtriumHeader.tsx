import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TransitionLink } from "@/hooks/useViewTransition";
import { Mail, Calendar, Linkedin, Github, type LucideIcon } from "lucide-react";
import { PRIMARY_NAV, SOCIAL_LINKS } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { MoodToggle } from "@/components/MoodToggle";
import { AmbienceControl } from "@/components/AmbienceControl";
import { useHaptic } from "@/hooks/useHaptic";
import { useTrackClick } from "@/hooks/useTrackClick";

const UTILITY_ICON_NAV: { label: string; href: string; Icon: LucideIcon; kind: "contact" | "social" }[] = [
  { label: "Email", href: SOCIAL_LINKS.email, Icon: Mail, kind: "contact" },
  { label: "Book a Call", href: SOCIAL_LINKS.schedule, Icon: Calendar, kind: "contact" },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, Icon: Linkedin, kind: "social" },
  { label: "GitHub", href: SOCIAL_LINKS.github, Icon: Github, kind: "social" },
];

const isNavActive = (pathname: string, to: string) => {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
};

export const AtriumHeader = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const haptic = useHaptic();
  const track = useTrackClick();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/70 glass-nav transition-all duration-500 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-gradient-to-b after:from-outline-variant/15 after:to-transparent after:pointer-events-none">
        <div className="flex justify-between items-center px-6 md:px-12 py-6 md:py-8 w-full max-w-screen-2xl mx-auto relative">
          <TransitionLink
            to="/"
            className="text-xl md:text-2xl font-headline italic text-primary tracking-wide hover:opacity-80 transition-opacity duration-500"
          >
            Ivan de Murard
          </TransitionLink>

          {/* Center primary nav */}
          <div className="hidden lg:flex items-center space-x-12 absolute left-1/2 -translate-x-1/2">
            {[
              ...(location.pathname !== "/" ? [{ label: "Home", to: "/" }] : []),
              ...PRIMARY_NAV,
            ].map((item) => {
              const active = isNavActive(location.pathname, item.to);
              return (
                <TransitionLink
                  key={item.label}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "font-headline italic tracking-wide text-sm transition-colors duration-500",
                    active
                      ? "text-secondary border-b border-secondary/60 pb-1 [text-shadow:0_0_18px_hsl(var(--secondary)/0.25)]"
                      : "text-on-surface-variant hover:text-primary",
                  ].join(" ")}
                >
                  {item.label}
                </TransitionLink>
              );
            })}
          </div>

          {/* Right utility links */}
          <div className="hidden md:flex items-center space-x-5 lg:space-x-6">
            <MoodToggle />
            <AmbienceControl />
            <span className="hidden lg:inline-block h-4 w-px bg-outline-variant/40" aria-hidden="true" />
            {UTILITY_ICON_NAV.map(({ label, href, Icon: LucideIcon, kind }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                title={label}
                onClick={() => track({ label, href, kind })}
                className="text-on-surface-variant hover:text-secondary transition-all duration-500 hover:scale-110"
              >
                <LucideIcon size={18} strokeWidth={1.5} />
              </a>
            ))}
          </div>

          {/* Mobile right cluster: toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <MoodToggle size="sm" />
            <AmbienceControl size="sm" />
            <button
              type="button"
              onClick={() => {
                haptic("tap");
                setOpen((v) => !v);
              }}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="text-primary hover:opacity-80 transition-opacity duration-500 active:scale-95"
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
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
          {[
            ...(location.pathname !== "/" ? [{ label: "Home", to: "/" }] : []),
            ...PRIMARY_NAV,
          ].map((item) => {
            const active = isNavActive(location.pathname, item.to);
            return (
              <TransitionLink
                key={item.label}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={[
                  "font-headline italic text-3xl transition-colors",
                  active
                    ? "text-secondary border-b border-secondary/60 pb-1 [text-shadow:0_0_24px_hsl(var(--secondary)/0.3)]"
                    : "text-primary",
                ].join(" ")}
              >
                {item.label}
              </TransitionLink>
            );
          })}
          <div className="h-px w-16 bg-outline-variant/30 my-4" />
          <div className="flex flex-wrap justify-center gap-6">
            {UTILITY_ICON_NAV.map(({ label, href, Icon: LucideIcon, kind }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                title={label}
                onClick={() => track({ label, href, kind })}
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
