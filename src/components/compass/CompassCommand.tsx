import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPASS } from "@/content/compass";

export const CompassCommand = () => {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COMPASS.command);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    window.setTimeout(() => setStatus("idle"), 2500);
  };
  return (
    <div className="inline-flex max-w-full items-center gap-3 rounded-sm border border-outline-variant bg-surface-container-lowest px-3 py-2">
      <code className="font-mono text-xs md:text-sm text-primary break-all">{COMPASS.command}</code>
      <Button variant="ghost" size="icon-sm" onClick={copy} aria-label="Copy Compass MCP command" title="Copy Compass MCP command" className="shrink-0 text-secondary hover:text-primary hover:bg-surface-container-low">
        {status === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </Button>
      <span role="status" className="sr-only">{status === "copied" ? "Command copied" : status === "failed" ? "Copy unavailable" : ""}</span>
    </div>
  );
};