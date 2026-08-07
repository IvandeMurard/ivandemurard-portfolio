import { useEffect, useState } from "react";
import type { TocItem } from "./JournalToc";

export const slugifyHeading = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

/**
 * Derives a table of contents from the DOM for pages written as hand-authored
 * JSX, where no block array exists to read headings from. Each h2 in the
 * container gets a stable slug id if it does not already carry one.
 */
export const useHeadingToc = (
  containerRef: React.RefObject<HTMLElement>,
  selector = "h2",
): TocItem[] => {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const seen = new Set<string>();
    const next: TocItem[] = [];
    root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      if (el.dataset.tocSkip === "true") return;
      const text = (el.textContent ?? "").trim();
      if (!text) return;
      let id = el.id;
      if (!id) {
        const base = slugifyHeading(text);
        id = base;
        let n = 2;
        while (seen.has(id) || document.getElementById(id)) {
          id = `${base}-${n}`;
          n += 1;
        }
        el.id = id;
      }
      if (seen.has(id)) return;
      seen.add(id);
      if (el.tabIndex < 0) el.tabIndex = -1;
      next.push({ id, text });
    });
    setItems(next);
  }, [containerRef, selector]);

  return items;
};

export default useHeadingToc;
