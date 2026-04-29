import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

interface CountUpProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/**
 * Counts from 0 → value once the element enters the viewport.
 * Single rAF tween, no library. Honors prefers-reduced-motion.
 */
export const CountUp = ({
  value,
  suffix = "",
  prefix = "",
  duration = 1200,
  className,
}: CountUpProps) => {
  const ref = useReveal<HTMLSpanElement>(0.4);
  const [n, setN] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(value);
      return;
    }
    const obs = new MutationObserver(() => {
      if (started.current) return;
      if (el.getAttribute("data-revealed") !== "true") return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setN(value * eased);
        if (t < 1) requestAnimationFrame(tick);
        else setN(value);
      };
      requestAnimationFrame(tick);
    });
    obs.observe(el, { attributes: true, attributeFilter: ["data-revealed"] });
    return () => obs.disconnect();
  }, [ref, value, duration]);

  return (
    <span ref={ref} className={className} data-reveal>
      {prefix}
      {Math.round(n)}
      {suffix}
    </span>
  );
};

export default CountUp;
