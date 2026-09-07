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

    const reveal = () => el.setAttribute("data-revealed", "true");

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      reveal();
      return;
    }

    // A section taller than the viewport can never satisfy a percentage
    // threshold, so it would stay invisible forever. Trigger on first contact.
    const tall = el.getBoundingClientRect().height > window.innerHeight * 0.6;
    const effectiveThreshold = tall ? 0 : threshold;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-revealed", "true");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: effectiveThreshold, rootMargin },
    );

    io.observe(el);

    // Safety net: content must never be able to stay invisible.
    const fallback = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      const onScreen = r.top < window.innerHeight && r.bottom > 0;
      if (onScreen) reveal();
    }, 1500);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [threshold, rootMargin]);

  return ref;
}

