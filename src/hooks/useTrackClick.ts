import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ClickKind = "project" | "contact" | "social" | "nav";

const SESSION_KEY = "idm_session";

const getSessionId = (): string => {
  if (typeof window === "undefined") return "";
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = (crypto.randomUUID?.() ?? `s_${Date.now()}_${Math.random().toString(36).slice(2)}`).slice(0, 64);
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
};

interface TrackArgs {
  label: string;
  href: string;
  kind: ClickKind;
}

/**
 * Fire-and-forget click tracker. Never blocks navigation,
 * never throws if the network or backend is unreachable.
 */
export const useTrackClick = () => {
  return useCallback(({ label, href, kind }: TrackArgs) => {
    if (typeof window === "undefined") return;
    const payload = {
      label: label.slice(0, 120),
      href: href.slice(0, 2048),
      kind,
      page: window.location.pathname.slice(0, 512),
      referrer: document.referrer ? document.referrer.slice(0, 2048) : null,
      session_id: getSessionId() || null,
    };
    // Don't await: navigation should feel instant.
    void supabase
      .from("link_clicks")
      .insert(payload)
      .then(({ error }) => {
        if (error && import.meta.env.DEV) {
          console.warn("[track] insert failed", error.message);
        }
      });
  }, []);
};

export default useTrackClick;
