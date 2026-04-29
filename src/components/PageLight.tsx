import { useEffect } from "react";

/**
 * PageLight, a fixed background layer that shifts the page's "light"
 * from warm cream + gold (top) to a desaturated Picasso-blue dusk (bottom)
 * as the user scrolls. Reverses on scroll up.
 *
 * The shift is driven by a CSS variable (--page-light-progress, 0..1) that
 * we update once per animation frame. The gradient itself is pure CSS so
 * we never trigger layout, only compositor work.
 */
export const PageLight = () => {
  useEffect(() => {
    let raf = 0;
    let lastRun = 0;
    let pending = false;
    // Throttle to ~10 fps. The wash is slow, the eye does not need 60 updates per second.
    const MIN_INTERVAL = 50;

    const apply = () => {
      pending = false;
      lastRun = performance.now();
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      doc.style.setProperty("--page-light-progress", p.toFixed(3));
    };

    const onScroll = () => {
      if (pending) return;
      const now = performance.now();
      const wait = Math.max(0, MIN_INTERVAL - (now - lastRun));
      pending = true;
      if (wait === 0) {
        raf = requestAnimationFrame(apply);
      } else {
        window.setTimeout(() => {
          raf = requestAnimationFrame(apply);
        }, wait);
      }
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div aria-hidden="true" className="page-light" />;
};

export default PageLight;
