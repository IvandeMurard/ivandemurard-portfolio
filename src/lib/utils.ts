import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// text-meta and text-kicker are font sizes (tailwind.config.ts). Without this, tailwind-merge reads any unknown text-* as a
// colour, and `cn("text-meta", "text-secondary")` would drop one of the two.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["meta", "kicker"] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
