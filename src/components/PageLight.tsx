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
    let pending = false;

    const update = () => {
      pending = false;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      doc.style.setProperty("--page-light-progress", p.toFixed(4));
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    };

    update();
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
