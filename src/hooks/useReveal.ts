import { useEffect, useRef } from "react";

/**
 * Tiny IntersectionObserver hook.
 * Adds `data-revealed="true"` to the element once it crosses the threshold.
 * Pair with the [data-reveal] CSS in index.css.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      el.setAttribute("data-revealed", "true");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-revealed", "true");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
