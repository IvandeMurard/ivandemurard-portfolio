import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExternalMark } from "@/components/ui/ExternalMark";
import { useTrackClick } from "@/hooks/useTrackClick";
import { ASK_AI, ASSISTANTS } from "@/content/askAi";


/**
 * One "Ask your AI" entry: a disclosure button (keyboard and touch, not hover) that opens a short list of assistants,
 * each opening a new tab with the prompt prefilled, and "Copy the prompt" for any other assistant.
 * `triggerClassName` styles the button where it sits; the list uses the page's tokens, so it reads in Day, Night and
 * on the inverted closing room alike.
 */
export const AskAiMenu = ({
  prompt,
  label = ASK_AI.label,
  triggerClassName,
  align = "left",
}: {
  prompt: string;
  label?: string;
  triggerClassName?: string;
  align?: "left" | "right";
}) => {
  const track = useTrackClick();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const listId = useId();
  const fallbackId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = async () => {
    track({ label: "Ask your AI: copy the prompt", href: "clipboard", kind: "contact" });
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard (insecure context, permission): show the text to select by hand.
      setCopyFailed(true);
    }
  };

  const item = "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-secondary";

  return (
    <div ref={root} className="relative inline-block">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={cn("inline-flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary", triggerClassName)}
      >
        {label}
        <ChevronDown size={14} aria-hidden className={cn("transition-transform motion-reduce:transition-none", open && "rotate-180")} />
      </button>
      <div
        id={listId}
        hidden={!open}
        className={cn("absolute z-30 mt-2 w-60 rounded-md border border-outline-variant bg-primary text-on-primary shadow-lg", align === "right" ? "right-0" : "left-0")}
      >
        <ul className="m-0 list-none p-1">
          {ASSISTANTS.map((a) => {
            const href = a.href(prompt);
            return (
              <li key={a.name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { track({ label: `Ask ${a.name}`, href, kind: "contact" }); setOpen(false); }}
                  className={item}
                >
                  <ExternalMark>{a.name}</ExternalMark>
                </a>
              </li>
            );
          })}
          <li>
            <button type="button" onClick={copy} className={item}>
              {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
              {copied ? ASK_AI.copied : ASK_AI.copy}
            </button>
          </li>
        </ul>
        {copyFailed && (
          <div className="border-t border-on-primary/20 p-3">
            <label htmlFor={fallbackId} className="text-sm">Copy this prompt</label>
            <textarea
              id={fallbackId}
              readOnly
              value={prompt}
              onFocus={(e) => e.currentTarget.select()}
              className="mt-2 block min-h-24 w-full rounded-sm border border-on-primary/30 bg-transparent p-2 text-sm"
            />
          </div>
        )}
      </div>
      <span aria-live="polite" className="sr-only">{copied ? "Prompt copied to clipboard" : ""}</span>
    </div>
  );
};

export default AskAiMenu;
