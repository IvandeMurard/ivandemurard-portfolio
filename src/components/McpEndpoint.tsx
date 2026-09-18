import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

const ENDPOINT = "https://lzzlepzecynpztipkdcu.supabase.co/functions/v1/mcp";
const COMMAND = `claude mcp add ivandemurard --transport http ${ENDPOINT}`;

const TOOLS = [
  "list_case_studies",
  "get_case_study",
  "list_journal",
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
      className={`not-italic rounded-sm border border-outline bg-surface-container-low ${
        compact ? "p-4 md:p-5" : "p-5 md:p-6"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
        <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">{label}</span>
        <span className="inline-flex items-center gap-1.5 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-secondary" />
          MCP · public · read-only · {TOOLS.length} tools
        </span>
      </div>

      <div className="flex items-stretch gap-2">
        <code className="flex-1 min-w-0 overflow-x-auto rounded-sm border border-outline-variant bg-surface-container-lowest px-3 py-2.5 font-mono text-xs text-on-surface whitespace-pre">
          {COMMAND}
        </code>
        <button
          type="button"
          onClick={() => copy(COMMAND, "cmd")}
          aria-label="Copy the MCP install command"
          className="shrink-0 inline-flex items-center gap-2 rounded-sm border border-outline-variant bg-surface-container-lowest px-3 py-2 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant transition-colors duration-300 hover:border-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary"
        >
          <Icon name={copied === "cmd" ? "check" : "content_copy"} className="text-[14px]" />
          {copied === "cmd" ? "Copied" : "Copy"}
        </button>
      </div>

      {!compact && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {TOOLS.map((tool) => (
            <li
              key={tool}
              className="rounded-sm border border-outline-variant bg-surface-container-lowest px-2 py-1 font-mono text-[11px] text-on-surface-variant"
            >
              {tool}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">
        {note ??
          "The case studies and field notes on this site are queryable as tools, not just readable as pages. Same content, served to an agent."}{" "}
        <button
          type="button"
          onClick={() => copy(ENDPOINT, "url")}
          className="text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
        >
          {copied === "url" ? "Endpoint copied" : "Copy the endpoint URL"}
        </button>
      </p>
    </section>
  );
};

export default McpEndpoint;
