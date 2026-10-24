import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";

/**
 * One Rose conversation per browser tab, owned at module level so it survives
 * route changes (each page remounts SiteLayout and the dock). Persisted in
 * sessionStorage only: no cookies, no localStorage, no server transcript.
 */
export const STORAGE_KEY = "rose_conversation_v1";
export const SCHEMA_VERSION = 1;
export const INACTIVITY_MS = 60 * 60 * 1000;
export const MAX_STORED_MESSAGES = 60;
export const MAX_STORED_BYTES = 150_000;
/** Messages sent to the model per request; the server rejects more than 40. */
export const MAX_SENT_MESSAGES = 20;

type Stored = { v: number; updatedAt: number; messages: UIMessage[] };

const storage = (): Storage | null => {
  try {
    return typeof window !== "undefined" ? window.sessionStorage : null;
  } catch {
    return null;
  }
};

const isMessage = (m: unknown): m is UIMessage =>
  !!m &&
  typeof m === "object" &&
  typeof (m as UIMessage).id === "string" &&
  ((m as UIMessage).role === "user" || (m as UIMessage).role === "assistant") &&
  Array.isArray((m as UIMessage).parts);

export const loadMessages = (now = Date.now()): UIMessage[] => {
  const s = storage();
  if (!s) return [];
  try {
    const raw = s.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as Partial<Stored>;
    if (
      data?.v !== SCHEMA_VERSION ||
      typeof data.updatedAt !== "number" ||
      now - data.updatedAt > INACTIVITY_MS ||
      !Array.isArray(data.messages)
    ) {
      s.removeItem(STORAGE_KEY);
      return [];
    }
    return data.messages.filter(isMessage).slice(-MAX_STORED_MESSAGES);
  } catch {
    try { s.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    return [];
  }
};

export const saveMessages = (messages: UIMessage[], now = Date.now()) => {
  const s = storage();
  if (!s) return;
  try {
    if (!messages.length) return s.removeItem(STORAGE_KEY);
    let kept = messages.slice(-MAX_STORED_MESSAGES);
    let json = JSON.stringify({ v: SCHEMA_VERSION, updatedAt: now, messages: kept });
    while (json.length > MAX_STORED_BYTES && kept.length > 1) {
      kept = kept.slice(Math.ceil(kept.length / 4));
      json = JSON.stringify({ v: SCHEMA_VERSION, updatedAt: now, messages: kept });
    }
    s.setItem(STORAGE_KEY, json);
  } catch {
    /* quota or disabled storage: the conversation simply stays in memory */
  }
};

export const clearStoredMessages = () => {
  try { storage()?.removeItem(STORAGE_KEY); } catch { /* ignore */ }
};

/** Most recent messages, starting on a user turn, capped for the model. */
export const selectRecent = (messages: UIMessage[], max = MAX_SENT_MESSAGES): UIMessage[] => {
  const recent = messages.slice(-max);
  const firstUser = recent.findIndex((m) => m.role === "user");
  return firstUser > 0 ? recent.slice(firstUser) : recent;
};

const makeChat = (id: string, messages: UIMessage[]) =>
  new Chat<UIMessage>({
    id,
    messages,
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rose-chat`,
      headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      prepareSendMessagesRequest: ({ messages: all, body }) => ({
        body: { ...(body ?? {}), messages: selectRecent(all) },
      }),
    }),
  });

let current: Chat<UIMessage> | null = null;
let openState = false;

export const getRoseChat = (id: string): Chat<UIMessage> => {
  if (!current) current = makeChat(id, loadMessages());
  return current;
};

/** Drops an expired conversation before reuse (e.g. tab left idle for an hour). */
export const expireIfIdle = (id: string): Chat<UIMessage> | null => {
  if (current && current.messages.length && loadMessages().length === 0) {
    return resetRoseChat(id);
  }
  return null;
};

export const resetRoseChat = (id: string): Chat<UIMessage> => {
  void current?.stop();
  clearStoredMessages();
  current = makeChat(id, []);
  return current;
};

export const getRoseOpen = () => openState;
export const setRoseOpen = (v: boolean) => { openState = v; };
