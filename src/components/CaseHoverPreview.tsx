import { SafeImage } from "@/components/SafeImage";
import { useCallback, useEffect, useRef, useState } from "react";

interface CaseHoverPreviewProps {
  slug: string;
  image: string;
  alt: string;
  className?: string;
}

/**
 * Static cover image that, on hover (fine pointer only), reveals an
 * iframe of the actual case page slowly auto-scrolling like a film teaser.
 */
export const CaseHoverPreview = ({ slug, image, alt, className }: CaseHoverPreviewProps) => {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const enterTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const startScroll = useCallback(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let y = 0;
    let direction = 1;
    const maxY = 2400; // approx case-page height; scrollTo clamps anyway
    const speed = 0.5; // px per frame, slow drift

    const tick = () => {
      y += direction * speed;
      if (y >= maxY) {
        y = maxY;
        direction = -1;
      } else if (y <= 0) {
        y = 0;
        direction = 1;
      }
      iframeRef.current?.contentWindow?.postMessage(
        { type: "preview-scroll", y },
        "*",
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopScroll = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const handleEnter = () => {
    // Skip on touch / coarse pointer.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    enterTimer.current = window.setTimeout(() => {
      setMounted(true);
      // Defer activation a tick so the fade-in transition runs.
      requestAnimationFrame(() => setActive(true));
    }, 250);
  };

  const handleLeave = () => {
    if (enterTimer.current) {
      window.clearTimeout(enterTimer.current);
      enterTimer.current = null;
    }
    setActive(false);
    stopScroll();
    leaveTimer.current = window.setTimeout(() => {
      setMounted(false);
    }, 500);
  };

  const handleIframeLoad = () => {
    startScroll();
  };

  useEffect(() => {
    return () => {
      if (enterTimer.current) window.clearTimeout(enterTimer.current);
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
      stopScroll();
    };
  }, [stopScroll]);

  return (
    <div
      className={`relative overflow-hidden bg-surface-container ${className ?? ""}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
      />
      {mounted && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: active ? 1 : 0,
            transition: "opacity 400ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          aria-hidden="true"
        >
          <iframe
            ref={iframeRef}
            src={`/${slug}?preview=1`}
            title={`${alt} preview`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={handleIframeLoad}
            tabIndex={-1}
            style={{
              border: 0,
              width: "200%",
              height: "200%",
              transform: "scale(0.5)",
              transformOrigin: "top left",
              pointerEvents: "none",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CaseHoverPreview;
