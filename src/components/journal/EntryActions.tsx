import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";

type EntryActionsProps = {
  title: string;
  /** Path of the markdown representation, route shaped: /journal/<slug>.md or /aetherix.md */
  markdownPath?: string;
  /**
   * Reading contract. Field notes teach, so they offer the raw markdown openly.
   * Case studies attest: the mirror stays for agents, not offered as a download.
   */
  variant?: "note" | "case";
  /** What a model should be asked to do with the text. */
  ask?: string;
};

const BTN =
  "inline-flex items-center gap-2 rounded-sm border border-outline-variant bg-surface-container-lowest px-3 py-2 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant transition-colors duration-300 hover:bg-transparent hover:border-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary";

/**
 * Action bar under the title of a long-form piece.
 * Two intents: hand the full text to a model, or share it with a person.
 * The machine actions come first: the markdown representation is the
 * canonical thing an agent should read, not the rendered page.
 */
export const EntryActions = ({ title, markdownPath, variant = "note", ask }: EntryActionsProps) => {
  const [copied, setCopied] = useState<"context" | "link" | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const shareRef = useRef<HTMLDivElement | null>(null);

  const origin = "https://ivandemurard.com";
  const pageUrl = typeof window !== "undefined" ? `${origin}${window.location.pathname}` : origin;
  const mdUrl = markdownPath ? `${origin}${markdownPath}` : undefined;

  const defaultAsk =
    variant === "case"
      ? "summarise the problem, the architecture and what was actually shipped, then tell me what is transferable to my own system."
      : "summarise the working vocabulary and the decisions it asks me to make, then help me apply it to my own system.";

  const prompt = mdUrl
    ? `Read ${mdUrl} (full text, markdown) and ${ask ?? defaultAsk}\n\nSource: ${title} by Ivan de Murard, ${pageUrl}`
    : `Read ${pageUrl} and ${ask ?? defaultAsk}\n\nSource: ${title} by Ivan de Murard.`;

  useEffect(() => {
    if (!shareOpen) return;
    const onDown = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) setShareOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShareOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [shareOpen]);

  const copy = async (text: string, kind: "context" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFailed(false);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
      if (kind === "context") setCopyFailed(true);
    }
  };

  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(pageUrl);

  const links = [
    {
      label: "LinkedIn",
      icon: "share",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
    { label: "X", icon: "share", href: `https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}` },
    { label: "WhatsApp", icon: "chat", href: `https://wa.me/?text=${shareText}%20${shareUrl}` },
    {
      label: "Email",
      icon: "mail",
      href: `mailto:?subject=${shareText}&body=${shareUrl}`,
    },
  ];

  return (
    <div className="mb-10 not-italic print:hidden">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mr-1">
          Read with AI
        </span>
        <Button type="button" variant="ghost" className={`${BTN} h-auto whitespace-normal text-left`} onClick={() => copy(prompt, "context")}>
          <Icon name={copied === "context" ? "check" : "content_copy"} className="text-[16px] leading-none" />
          {copied === "context" ? "Prompt copied" : "Copy prompt for Claude or ChatGPT"}
        </Button>
        {markdownPath && variant === "note" && (
          <a className={BTN} href={markdownPath} target="_blank" rel="noopener noreferrer">
            <Icon name="description" className="text-[16px] leading-none" />
            Raw markdown
          </a>
        )}

        <span className="hidden sm:block h-5 w-px bg-outline-variant mx-1" aria-hidden="true" />

        <div className="relative" ref={shareRef}>
          <button
            type="button"
            className={BTN}
            aria-expanded={shareOpen}
            aria-haspopup="true"
            onClick={() => setShareOpen((v) => !v)}
          >
            <Icon name="ios_share" className="text-[16px] leading-none" />
            Share
          </button>
          {shareOpen && (
            <div className="absolute z-20 mt-2 min-w-[11rem] rounded-sm border border-outline bg-surface-container-lowest p-1 shadow-lg">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShareOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                >
                  <Icon name={l.icon} className="text-[16px] leading-none" />
                  {l.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  copy(pageUrl, "link");
                  setShareOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
              >
                <Icon name="link" className="text-[16px] leading-none" />
                Copy link
              </button>
            </div>
          )}
        </div>
      </div>
      {copyFailed && (
        <div className="mt-3">
          <label htmlFor="ai-reading-prompt" className="font-body text-sm text-on-surface-variant">Copy this prompt</label>
          <textarea id="ai-reading-prompt" readOnly value={prompt} onFocus={(event) => event.currentTarget.select()} className="mt-2 block min-h-28 w-full rounded-sm border border-outline-variant bg-surface-container-lowest p-3 font-body text-sm text-on-surface" />
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        {copied === "link" ? "Link copied" : copied === "context" ? "Context copied" : ""}
      </p>
    </div>
  );
};

export default EntryActions;
