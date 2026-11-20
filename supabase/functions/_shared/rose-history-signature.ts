/**
 * Signed history. rose-chat signs each assistant message it finishes (HMAC-SHA256 over session id, message id,
 * text parts and issue time, with a key only the server holds) and sends the signature as message metadata.
 * The browser keeps it with the message and sends it back; rose-chat drops any assistant turn whose signature is
 * missing, invalid or older than 60 minutes. Nothing is stored on the server.
 *
 * Pure WebCrypto, no imports: rose-chat (Deno) and the tests use the same code. The key is always passed in.
 */
export const ROSE_HISTORY_TTL_MS = 60 * 60 * 1000;

export type RoseHistoryMetadata = { rose_sig: string; rose_issued_at: number };

type Chunk = { type: string; id?: string; delta?: string; messageId?: string };
type HistoryMessage = { id?: string; role: "user" | "assistant"; parts: { type: "text"; text: string }[]; metadata?: unknown };

const enc = new TextEncoder();
const importKey = (key: string) =>
  crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
const payload = (sessionId: string, messageId: string, texts: string[], issuedAt: number) =>
  enc.encode(JSON.stringify([sessionId, messageId, texts, issuedAt]));
const toB64 = (buf: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = (s: string): Uint8Array<ArrayBuffer> | null => {
  try { return Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); } catch { return null; }
};

export async function signRoseTurn(key: string, sessionId: string, messageId: string, texts: string[], issuedAt: number): Promise<string> {
  return toB64(await crypto.subtle.sign("HMAC", await importKey(key), payload(sessionId, messageId, texts, issuedAt)));
}

export async function verifyRoseTurn(key: string, sessionId: string, m: HistoryMessage, now: number): Promise<boolean> {
  const meta = m.metadata as Partial<RoseHistoryMetadata> | undefined;
  if (!m.id || !meta || typeof meta.rose_sig !== "string" || typeof meta.rose_issued_at !== "number") return false;
  const age = now - meta.rose_issued_at;
  if (!(age >= -60_000 && age <= ROSE_HISTORY_TTL_MS)) return false;
  const sig = fromB64(meta.rose_sig);
  if (!sig) return false;
  // crypto.subtle.verify compares in constant time.
  return crypto.subtle.verify("HMAC", await importKey(key), sig, payload(sessionId, m.id, m.parts.map((p) => p.text), meta.rose_issued_at));
}

/** Keeps user turns and genuine assistant turns; returns how many assistant turns were dropped. */
export async function filterSignedHistory<M extends HistoryMessage>(key: string | undefined, sessionId: string, messages: M[], now = Date.now()) {
  const kept: M[] = [];
  let rejected = 0;
  for (const m of messages) {
    if (m.role === "user") { kept.push(m); continue; }
    if (key && sessionId && await verifyRoseTurn(key, sessionId, m, now)) kept.push(m);
    else rejected++;
  }
  return { kept, rejected };
}

/**
 * Passes every chunk through and, just before "finish", adds a message-metadata chunk with the signature of the
 * text that went out. Without a message id (or a failed stream) nothing is signed, so the turn is later dropped.
 */
export function withRoseSignature<T extends Chunk>(stream: ReadableStream<T>, key: string | undefined, sessionId: string, now = () => Date.now()): ReadableStream<T | { type: "message-metadata"; messageMetadata: RoseHistoryMetadata }> {
  let messageId: string | undefined;
  const order: string[] = [];
  const texts = new Map<string, string>();
  let failed = false;
  return stream.pipeThrough(new TransformStream({
    async transform(chunk, controller) {
      if (chunk.type === "start" && chunk.messageId) messageId = chunk.messageId;
      if (chunk.type === "text-start" && chunk.id && !texts.has(chunk.id)) { order.push(chunk.id); texts.set(chunk.id, ""); }
      if (chunk.type === "text-delta" && chunk.id) texts.set(chunk.id, (texts.get(chunk.id) ?? "") + (chunk.delta ?? ""));
      if (chunk.type === "error" || chunk.type === "abort") failed = true;
      if (chunk.type === "finish" && !failed && key && sessionId && messageId) {
        const issuedAt = now();
        const sig = await signRoseTurn(key, sessionId, messageId, order.map((id) => texts.get(id) ?? ""), issuedAt);
        controller.enqueue({ type: "message-metadata", messageMetadata: { rose_sig: sig, rose_issued_at: issuedAt } });
      }
      controller.enqueue(chunk);
    },
  }));
}
