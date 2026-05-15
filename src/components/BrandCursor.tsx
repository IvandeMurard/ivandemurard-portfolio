import { useEffect, useRef, useState } from "react";

/**
 * BrandCursor — minimal editorial pointer.
 * A single small dot tracks the cursor. On hover over interactive elements
 * the dot quietly grows and softens. On press it pulses inward.
 * Disabled on touch / coarse pointer and when prefers-reduced-motion.
 * Native cursor preserved on form fields, iframes, and [data-cursor="native"].
 */
export const BrandCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const pressed = useRef(false);
  const hovering = useRef(false);
  const suppressed = useRef(false);
  const idle = useRef(false);
  const idleTimer = useRef<number | null>(null);
  const IDLE_MS = 1500;
  const IDLE_OPACITY = "0.18";

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    // Force cursor:none everywhere except explicit native zones.
    // This overrides per-element cursor:pointer on links/buttons.
    const style = document.createElement("style");
    style.setAttribute("data-brand-cursor", "");
    style.textContent = `
      html, body, *, *::before, *::after { cursor: none !important; }
      input, textarea, select, [contenteditable="true"],
      [data-cursor="native"], iframe {
        cursor: auto !important;
      }
      input[type="range"] { cursor: ew-resize !important; }
    `;
    document.head.appendChild(style);
    styleRef.current = style;

    const setOpacity = () => {
      if (!dotRef.current) return;
      if (suppressed.current) {
        dotRef.current.style.opacity = "0";
        return;
      }
      if (hovering.current || pressed.current || !idle.current) {
        dotRef.current.style.opacity = "1";
        return;
      }
      dotRef.current.style.opacity = IDLE_OPACITY;
    };

    const apply = (x: number, y: number) => {
      if (!dotRef.current) return;
      const scale = pressed.current ? 0.55 : hovering.current ? 2.4 : 1;
      dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
    };

    const scheduleIdle = () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        idle.current = true;
        setOpacity();
      }, IDLE_MS);
    };

    const onMove = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      suppressed.current = !!el?.closest(
        'input, textarea, select, [contenteditable="true"], [data-cursor="native"], iframe',
      );
      hovering.current = !suppressed.current && !!el?.closest(
        'a, button, [role="button"], [data-cursor="hover"], summary, label[for]',
      );
      idle.current = false;
      setOpacity();
      apply(e.clientX, e.clientY);
      scheduleIdle();
    };

    const onDown = (e: MouseEvent) => {
      pressed.current = true;
      setOpacity();
      apply(e.clientX, e.clientY);
    };
    const onUp = (e: MouseEvent) => {
      pressed.current = false;
      setOpacity();
      apply(e.clientX, e.clientY);
    };
    const onLeave = () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      if (dotRef.current) dotRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      idle.current = false;
      setOpacity();
      scheduleIdle();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      styleRef.current?.remove();
    };
  }, []);

  if (!enabled) return null;

  const dotBg = "hsl(var(--secondary) / 0.85)";

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full transition-[opacity,transform] duration-200 ease-out"
      style={{
        backgroundColor: dotBg,
        boxShadow: `0 0 14px ${dotBg}`,
        willChange: "transform, opacity",
      }}
    />
  );
};

export default BrandCursor;
