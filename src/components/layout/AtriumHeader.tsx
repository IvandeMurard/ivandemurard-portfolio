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
import { useMood } from "@/components/MoodProvider";
import { Button } from "@/components/ui/button";

/** Live Paris time, the register's clock. */
const ParisClock = () => {
  const { mood } = useMood();
  const fmt = () => new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => { const id = window.setInterval(() => setT(fmt()), 15000); return () => window.clearInterval(id); }, []);
  return (
    <span className="font-mono text-[11px] tracking-[0.04em] text-on-surface-variant tabular-nums whitespace-nowrap" aria-label={`Paris time ${t}, ${mood} mode`}>
      Paris {t} · {mood === "dusk" ? "Dusk" : "Day"}
    </span>
  );
};

const AskRosePill = ({ compact = false }: { compact?: boolean }) => (
  <Button
    variant="ghost"
    type="button"
    onClick={() => window.dispatchEvent(new Event("rose:open"))}
    className={`h-auto font-mono font-normal uppercase tracking-[0.1em] text-[11px] text-primary border border-outline rounded-full ${compact ? "gap-1 px-2 py-1" : "px-4 py-1.5"} hover:bg-transparent hover:border-secondary hover:text-secondary transition-colors whitespace-nowrap`}
  >
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="20" cy="20" r="17" />
      <circle cx="20" cy="20" r="5.5" strokeWidth="0.8" />
      <path d="M20 3l4 13 13 4-13 4-4 13-4-13-13-4 13-4z" />
      <path d="M8 8l6 6M32 8l-6 6M8 32l6-6M32 32l-6-6" strokeWidth="0.6" />
    </svg>
    Ask Rose
  </Button>
);

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
      <nav className="fixed top-0 w-full z-50 bg-surface/95 glass-nav transition-all duration-500 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-gradient-to-b after:from-outline-variant after:to-transparent after:pointer-events-none">
        <div className="flex justify-between items-center gap-2 md:gap-6 px-4 md:px-10 py-5 md:py-6 w-full max-w-screen-2xl mx-auto relative">
          <TransitionLink
            to="/"
            className="group relative inline-flex shrink-0 items-baseline text-lg md:text-2xl font-headline italic text-primary tracking-wide"
          >
            <span className="transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-secondary">
              Ivan de Murard
            </span>
            <span
              aria-hidden="true"
              className="ml-1 inline-block h-1 w-1 rounded-full bg-secondary opacity-0 scale-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-100"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-secondary transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-1.5 left-0 h-px w-0 bg-secondary/30 transition-[width] duration-1000 delay-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
            />
          </TransitionLink>

          {/* Center primary nav */}
          <div className="hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-10">
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
                      ? "text-secondary border-b border-secondary pb-1 [text-shadow:0_0_18px_hsl(var(--secondary)/0.25)]"
                      : "text-on-surface-variant hover:text-primary",
                  ].join(" ")}
                >
                  {item.label}
                </TransitionLink>
              );
            })}
          </div>

          {/* Right utility links */}
          <div className="hidden lg:flex shrink-0 items-center gap-4">
            <ParisClock />
            <AskRosePill />
            <MoodToggle />
            <AmbienceControl />
            <span className="hidden 2xl:inline-block h-4 w-px bg-outline-variant" aria-hidden="true" />
            {UTILITY_ICON_NAV.map(({ label, href, Icon: LucideIcon, kind }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                title={label}
                onClick={() => track({ label, href, kind })}
                className="hidden 2xl:inline-flex text-on-surface-variant hover:text-secondary transition-all duration-500 hover:scale-110"
              >
                <LucideIcon size={18} strokeWidth={1.5} />
              </a>
            ))}
          </div>

          {/* Mobile right cluster: toggle + hamburger */}
          <div className="lg:hidden flex items-center gap-1">
            <AskRosePill compact />
            <MoodToggle size="sm" />
            <AmbienceControl size="sm" />
            <button
              type="button"
              onClick={() => {
                haptic("tap");
                setOpen((v) => !v);
              }}
              aria-label="Toggle menu"
              aria-controls="site-mobile-menu"
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
        id="site-mobile-menu"
        className={[
          "fixed inset-0 z-40 bg-surface/95 glass-nav lg:hidden transition-opacity duration-500",
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
                    ? "text-secondary border-b border-secondary pb-1 [text-shadow:0_0_24px_hsl(var(--secondary)/0.3)]"
                    : "text-primary",
                ].join(" ")}
              >
                {item.label}
              </TransitionLink>
            );
          })}
          <div className="h-px w-16 bg-outline-variant my-4" />
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
