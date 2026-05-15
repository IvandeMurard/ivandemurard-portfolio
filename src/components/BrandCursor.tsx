import { useEffect, useRef, useState } from "react";
import { useMood } from "./MoodProvider";

/**
 * BrandCursor — minimal editorial pointer.
 * - 8px dot (secondary) tracks the cursor 1:1.
 * - 24px ring (outline-variant) lags ~120ms with soft easing.
 * - Hover on interactive elements scales the ring; press pulses the dot.
 * - Disabled on touch / coarse pointer and when prefers-reduced-motion.
 * - Native cursor preserved on form fields and audio controls.
 */
export const BrandCursor = () => {
  const { mood } = useMood();
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const hovering = useRef(false);
  const pressed = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)${pressed.current ? " scale(0.6)" : ""}`;
      }
      // Update hover state from element under pointer
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest(
        'a, button, [role="button"], [data-cursor="hover"], summary, label[for]',
      );
      const suppress = !!el?.closest(
        'input, textarea, select, [contenteditable="true"], [data-cursor="native"], iframe',
      );
      document.documentElement.style.cursor = suppress ? "" : "none";
      if (suppress !== !hovering.current && suppress) {
        // when suppressed, briefly hide overlay
      }
      if (dotRef.current) dotRef.current.style.opacity = suppress ? "0" : "1";
      if (ringRef.current) ringRef.current.style.opacity = suppress ? "0" : "1";
      hovering.current = interactive;
    };

    const onDown = () => {
      pressed.current = true;
      if (dotRef.current) dotRef.current.dataset.pressed = "true";
    };
    const onUp = () => {
      pressed.current = false;
      if (dotRef.current) dotRef.current.dataset.pressed = "false";
    };
    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    const tick = () => {
      // ease ring toward target
      ring.current.x += (target.current.x - ring.current.x) * 0.18;
      ring.current.y += (target.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        const scale = hovering.current ? 1.6 : 1;
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    document.documentElement.style.cursor = "none";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.style.cursor = "";
    };
  }, []);

  if (!enabled) return null;

  const ringBorder =
    mood === "dusk"
      ? "hsl(var(--primary-fixed) / 0.45)"
      : "hsl(var(--outline-variant) / 0.7)";
  const dotBg = "hsl(var(--secondary) / 0.85)";

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-6 w-6 rounded-full transition-[opacity,border-color,background-color] duration-300 ease-out"
        style={{
          border: `1px solid ${ringBorder}`,
          backgroundColor: "transparent",
          willChange: "transform, opacity",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full transition-[opacity,transform] duration-150 ease-out"
        style={{
          backgroundColor: dotBg,
          boxShadow: `0 0 12px ${dotBg}`,
          willChange: "transform, opacity",
        }}
      />
    </>
  );
};

export default BrandCursor;
