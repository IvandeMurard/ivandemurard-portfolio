import { useEffect } from "react";

/**
 * When the page is loaded with `?preview=1`, hide the chrome and listen
 * for scroll commands posted from a parent window. Used by CaseHoverPreview
 * to drive a slow auto-scroll teaser inside an iframe.
 */
export const usePreviewMode = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") !== "1") return;

    document.documentElement.dataset.preview = "1";

    const onMessage = (event: MessageEvent) => {
      // Only the same-origin parent drives this teaser; ignore every other sender.
      if (event.origin !== window.location.origin) return;
      if (event.source !== window.parent) return;
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "preview-scroll" && typeof data.y === "number") {
        window.scrollTo(0, data.y);
      }
    };
    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
      delete document.documentElement.dataset.preview;
    };
  }, []);
};
