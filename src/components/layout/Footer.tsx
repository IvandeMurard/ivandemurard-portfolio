import { useState } from "react";
import { Mail, Calendar, Linkedin, Github, Copy, Check, ChevronDown } from "lucide-react";
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
  const [mcpOpen, setMcpOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyMcpCommand = async () => {
    try {
      await navigator.clipboard.writeText(MCP_COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* The command remains selectable when clipboard access is unavailable. */
    }
  };

  return (
    <footer className="w-full border-t border-outline-variant bg-surface-container-low py-8 md:py-10">
      <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="border-b border-outline-variant pb-6 mb-7">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setMcpOpen((current) => !current)}
            aria-expanded={mcpOpen}
            aria-controls="footer-mcp-command"
            className="h-auto w-full justify-between rounded-sm px-0 py-2 text-left hover:bg-transparent"
          >
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">MCP</span>
              <span className="font-body text-sm font-normal text-on-surface-variant">5 public read-only tools for agents</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 font-label text-[10px] uppercase tracking-[0.16em] text-primary">
              {mcpOpen ? "Hide command" : "Show command"}
              <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform duration-300 ${mcpOpen ? "rotate-180" : ""}`} />
            </span>
          </Button>
          {mcpOpen && (
            <div id="footer-mcp-command" className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <code className="min-w-0 break-all border-l-2 border-secondary bg-surface-container-lowest px-4 py-3 font-mono text-[11px] leading-relaxed text-on-surface">
                {MCP_COMMAND}
              </code>
              <Button type="button" variant="outline" onClick={copyMcpCommand} className="rounded-sm font-label text-[10px] uppercase tracking-[0.16em]">
                {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                {copied ? "Command copied" : "Copy MCP command"}
              </Button>
            </div>
          )}
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
