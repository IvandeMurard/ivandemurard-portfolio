import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { Mail, Calendar, Linkedin, Github, Copy, Check } from "lucide-react";
import { SOCIAL_LINKS } from "@/content/site";
import { useTrackClick } from "@/hooks/useTrackClick";
import { Button } from "@/components/ui/button";
import { PressMark } from "./PressMark";

const MCP_ENDPOINT = "https://lzzlepzecynpztipkdcu.supabase.co/functions/v1/mcp";
const MCP_COMMAND = `claude mcp add ivandemurard --transport http ${MCP_ENDPOINT}`;

const ICON_LINKS = [
  { label: "Email", href: SOCIAL_LINKS.email, Icon: Mail, external: false, kind: "contact" as const },
  { label: "Book a Call", href: SOCIAL_LINKS.schedule, Icon: Calendar, external: true, kind: "contact" as const },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, Icon: Linkedin, external: true, kind: "social" as const },
  { label: "GitHub", href: SOCIAL_LINKS.github, Icon: Github, external: true, kind: "social" as const },
];

export const Footer = () => {
  const track = useTrackClick();
  const { pathname } = useLocation();
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const showColophon = pathname !== "/" && !pathname.startsWith("/contact");

  const copyMcpCommand = async () => {
    try {
      await navigator.clipboard.writeText(MCP_COMMAND);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2500);
    }
  };

  return (
    <footer className="w-full border-t border-outline-variant bg-surface-container-low py-8 md:py-10">
      <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12">
        {showColophon && (
          <div className="group mx-auto max-w-xl pb-10 mb-8 border-b border-outline-variant text-center md:pb-14 md:mb-10">
            <PressMark className="mx-auto h-32 w-auto text-outline transition-colors duration-700 group-hover:text-secondary md:h-40" />
            <p className="mt-6 font-display text-xl italic text-on-surface md:text-2xl">
              Thank you for your time.
            </p>
            <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">
              In a crowded field, sustained attention is the rarest courtesy. I hope this work
              offered both enlightenment and quiet clarity.
            </p>
            <p className="mt-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              Conceived and crafted in Paris · Built 0→1 · Verified through open specifications
            </p>
          </div>
        )}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <Button
              type="button"
              variant="ghost"
              onClick={copyMcpCommand}
              aria-label="Copy the MCP command for the public read-only portfolio tools"
              className="h-auto gap-2 rounded-sm px-0 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-primary hover:bg-transparent hover:text-secondary"
            >
              {copyStatus === "copied" ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
              {copyStatus === "copied"
                ? "MCP command copied"
                : copyStatus === "failed"
                  ? "Copy unavailable"
                  : "MCP available · Copy command"}
            </Button>
            <span className="sr-only" role="status" aria-live="polite">
              {copyStatus === "copied"
                ? "MCP command copied to clipboard."
                : copyStatus === "failed"
                  ? "The MCP command could not be copied."
                  : ""}
            </span>
            <p className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">
              © {new Date().getFullYear()} Ivan de Murard · Curated with Care ·{" "}
              <Link to="/cv" className="hover:text-primary transition-colors">
                Curriculum Vitae
              </Link>{" "}·{" "}
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-8">
            {ICON_LINKS.map(({ label, href, Icon, external, kind }) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                aria-label={label}
                title={label}
                onClick={() => track({ label, href, kind })}
                className="text-on-surface-variant hover:text-secondary transition-all duration-500 hover:scale-110"
              >
                <Icon size={20} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
