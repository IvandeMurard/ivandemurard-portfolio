import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";

const ENDPOINT = "https://lzzlepzecynpztipkdcu.supabase.co/functions/v1/mcp";
const COMMAND = `claude mcp add ivandemurard --transport http ${ENDPOINT}`;

const TOOLS = [
  "list_case_studies",
  "get_case_study",
  "list_journal_entries",
  "get_journal_entry",
  "get_about",
];

/**
 * The site as a tool surface: the MCP endpoint an agent can call directly.
 * Read-only, public, five tools. Stated once per page, never explained twice.
 */
export const McpEndpoint = ({
  label = "Query this site from your agent",
  note,
  compact = false,
}: {
  label?: string;
  note?: string;
  compact?: boolean;
}) => {
  const [copied, setCopied] = useState<"cmd" | "url" | null>(null);

  const copy = async (text: string, kind: "cmd" | "url") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard unavailable, the text stays selectable */
    }
  };

  return (
    <section
      aria-label={label}
      className="not-italic border-y border-outline-variant py-7 md:py-9"
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)] md:items-end md:gap-12">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">MCP access</span>
            <span className="inline-flex items-center gap-1.5 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-secondary" />
              Public · read-only · {TOOLS.length} tools
            </span>
          </div>
          <h2 className="font-headline text-2xl italic leading-tight text-primary md:text-3xl">{label}</h2>
          <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-on-surface-variant md:text-base">
            {note ??
              "Give an agent structured access to my case studies, Field Notes and professional profile, from its own working environment."}
          </p>
        </div>

        <div className="min-w-0">
          <code className="block break-all border-l-2 border-secondary bg-surface-container-low px-4 py-3 font-mono text-[11px] leading-relaxed text-on-surface md:text-xs">
            {COMMAND}
          </code>
          <Button
            type="button"
            onClick={() => copy(COMMAND, "cmd")}
            aria-label="Copy the MCP install command"
            className="mt-3 w-full rounded-sm font-label text-[10px] uppercase tracking-[0.16em] sm:w-auto"
          >
            <Icon name={copied === "cmd" ? "check" : "content_copy"} className="text-[14px]" />
            {copied === "cmd" ? "Command copied" : "Copy MCP command"}
          </Button>
        </div>
      </div>

      {!compact && (
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-outline-variant pt-4">
          {TOOLS.map((tool) => (
            <li
              key={tool}
              className="font-mono text-[11px] text-on-surface-variant"
            >
              {tool}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default McpEndpoint;
