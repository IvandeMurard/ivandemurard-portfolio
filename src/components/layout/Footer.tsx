import { useState } from "react";
import { Mail, Calendar, Linkedin, Github, Copy, Check } from "lucide-react";
import { SOCIAL_LINKS } from "@/content/site";
import { useTrackClick } from "@/hooks/useTrackClick";
import { Button } from "@/components/ui/button";

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
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

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
        <div className="border-b border-outline-variant pb-6 mb-7">
          <Button
            type="button"
            variant="ghost"
            onClick={copyMcpCommand}
            aria-label="Copy the MCP command for five public read-only portfolio tools"
            className="h-auto w-full flex-col items-start gap-3 rounded-sm px-0 py-2 text-left hover:bg-transparent sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">MCP</span>
              <span className="font-body text-sm font-normal text-on-surface-variant">5 public read-only tools for agents</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 font-label text-[10px] uppercase tracking-[0.16em] text-primary">
              {copyStatus === "copied" ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
              {copyStatus === "copied"
                ? "MCP command copied"
                : copyStatus === "failed"
                  ? "Copy unavailable"
                  : "Copy MCP command"}
            </span>
          </Button>
          <span className="sr-only" role="status" aria-live="polite">
            {copyStatus === "copied"
              ? "MCP command copied to clipboard."
              : copyStatus === "failed"
                ? "The MCP command could not be copied."
                : ""}
          </span>
        </div>
        <div className="group flex flex-col items-center gap-3 pb-7 mb-7 border-b border-outline-variant text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 text-outline-variant transition-colors duration-500 group-hover:text-secondary"
          >
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M12 0.5 V5.5 M12 18.5 V23.5 M0.5 12 H5.5 M18.5 12 H23.5" stroke="currentColor" strokeWidth="1" />
          </svg>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            Paris · 0→1 craft · Verifiable via MCP and markdown mirrors
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">
            © {new Date().getFullYear()} Ivan de Murard · Curated with Care
          </p>
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
