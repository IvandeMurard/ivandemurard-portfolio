import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

type ShareRowProps = {
  title: string;
  excerpt: string;
  mirror?: string;
  license?: { label: string; url: string; note?: string };
};

/**
 * Share, export and licence line at the foot of a Field Note.
 * PDF is the browser's own print pipeline, driven by the print stylesheet.
 */
export const ShareRow = ({ title, excerpt, mirror, license }: ShareRowProps) => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const mailto = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
    `${excerpt}\n\n${url}`,
  )}`;

  const cls =
    "inline-flex items-center gap-2 rounded-sm border border-outline-variant bg-surface-container-lowest px-4 py-2 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant transition-colors duration-300 hover:border-secondary hover:text-primary";

  return (
    <div className="mt-16 pt-10 border-t border-outline-variant not-italic print:hidden">
      <div className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-4">
        Share and reuse
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copy} className={cls}>
          <Icon name={copied ? "check" : "link"} className="text-[16px] leading-none" />
          {copied ? "Link copied" : "Copy link"}
        </button>
        <a href={mailto} className={cls}>
          <Icon name="mail" className="text-[16px] leading-none" />
          Email
        </a>
        {mirror && (
          <a href={mirror} download className={cls}>
            <Icon name="description" className="text-[16px] leading-none" />
            Markdown
          </a>
        )}
        <button type="button" onClick={() => window.print()} className={cls}>
          <Icon name="picture_as_pdf" className="text-[16px] leading-none" />
          Print or PDF
        </button>
      </div>
      {license && (
        <p className="mt-5 font-body font-light text-sm text-on-surface-variant">
          Published under{" "}
          <a
            href={license.url}
            rel="license noopener noreferrer"
            target="_blank"
            className="text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
          >
            {license.label}
          </a>
          {license.note ? `. ${license.note}` : "."}
        </p>
      )}
    </div>
  );
};

export default ShareRow;
