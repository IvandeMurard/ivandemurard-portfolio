import { useEffect } from "react";

/**
 * PageLight, a fixed background layer that shifts the page's "light"
 * from cool Picasso-blue afternoon (top) to warm cream + gold dusk (bottom)
 * as the user scrolls. Smoothly reverses on scroll up.
 *
 * The shift is driven by a CSS variable (--page-light-progress, 0..1),
 * updated once per animation frame. Setting a single CSS variable on a
 * GPU-promoted layer is composited only, no layout, no paint.
 */
export const PageLight = () => {
  useEffect(() => {
    let raf = 0;
    let pending = false;

    const apply = () => {
      pending = false;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      doc.style.setProperty("--page-light-progress", p.toFixed(4));
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(apply);
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
