import { useEffect, useRef, useState } from "react";

/**
 * Thin decorative progress bar reflecting scroll position through the article.
 * Suppressed entirely under prefers-reduced-motion.
 */
export const ReadingProgress = ({ targetRef }: { targetRef: React.RefObject<HTMLElement> }) => {
  const [progress, setProgress] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const compute = () => {
      frame.current = null;
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setProgress(rect.bottom <= window.innerHeight ? 1 : 0);
        return;
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(scrolled / total);
    };
    const onScroll = () => {
      if (frame.current === null) frame.current = window.requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [enabled, targetRef]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent pointer-events-none">
      <div
        className="h-full bg-secondary origin-left"
        style={{ transform: `scaleX(${progress})`, width: "100%" }}
      />
    </div>
  );
};

export default ReadingProgress;
