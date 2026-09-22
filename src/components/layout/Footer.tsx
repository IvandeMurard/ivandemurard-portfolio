import { useState } from "react";
import { useLocation } from "react-router-dom";
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
  const showColophon = !pathname.startsWith("/contact");

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
            <PressMark
              aria-hidden="true"
              className="mx-auto h-24 w-auto text-outline transition-colors duration-700 group-hover:text-secondary md:h-28"
            />
            <p className="mt-6 font-label text-[10px] uppercase tracking-[0.24em] text-secondary">
              Colophon
            </p>
            <p className="mt-4 font-display text-xl italic text-on-surface md:text-2xl">
              Thank you for your time.
            </p>
            <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">
              In a crowded field, sustained attention is the rarest courtesy. I hope this work
              offered both rigour and quiet clarity.
            </p>
            <p className="mt-5 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              Conceived and crafted in Paris · Built 0→1 · Verified through open specifications
            </p>
          </div>
        )}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
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
