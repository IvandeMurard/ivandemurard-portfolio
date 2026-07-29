import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  /** Render with thousands separators (1,234). */
  separator?: boolean;
}

/**
 * Counts from 0 → value once the element enters the viewport.
 * Single rAF tween, no library. Honors prefers-reduced-motion.
 * Does not toggle its own opacity, the parent Reveal handles that.
 */
export const CountUp = ({
  value,
  suffix = "",
  prefix = "",
  duration = 1200,
  className,
  separator = false,
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(value);
      return;
    }

    const start = () => {
      if (started.current) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setN(value * eased);
        if (t < 1) requestAnimationFrame(tick);
        else setN(value);
      };
      requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            start();
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {separator ? Math.round(n).toLocaleString("en-US") : Math.round(n)}
      {suffix}
    </span>
  );
};

export default CountUp;
