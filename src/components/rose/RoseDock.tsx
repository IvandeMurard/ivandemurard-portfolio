import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { INTENT_CHIPS } from "./roseConfig";
import { RoseBookingCard } from "./RoseBookingCard";
import roseMark from "@/assets/rose-mark.png";

const SESSION_KEY = "rose_session";

const getSessionId = (): string => {
  if (typeof window === "undefined") return "";
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = (crypto.randomUUID?.() ??
        `s_${Date.now()}_${Math.random().toString(36).slice(2)}`).slice(0, 64);
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
};

const renderText = (m: UIMessage): string =>
  Array.isArray(m.parts)
    ? m.parts
        .map((p) => (p.type === "text" ? p.text : ""))
        .filter(Boolean)
        .join("")
    : "";

interface RoseDockProps {
  onClose?: () => void;
}

export const RoseDock = () => {
  const [open, setOpen] = useState(false);
  const [detectedIntent, setDetectedIntent] = useState<
    "product" | "technical" | "culture" | "exploring" | null
  >(null);
  const [inputValue, setInputValue] = useState("");
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const expandedInputRef = useRef<HTMLTextAreaElement>(null);
  const sessionId = useMemo(() => getSessionId(), []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rose-chat`,
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: sessionId,
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Resting state = glass veil; any engagement restores the full surface.
  const active =
    open || hovered || focusWithin || isLoading || inputValue.trim().length > 0;

  // Focus expanded textarea when opening.
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => expandedInputRef.current?.focus());
    }
  }, [open]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    if (!open) setOpen(true);
    setInputValue("");
    void sendMessage({ text: trimmed });
  };

  const onChip = (chip: (typeof INTENT_CHIPS)[number]) => {
    setDetectedIntent(chip.intent);
    submit(chip.message);
  };

  // Ready prompts elsewhere on the site (Field Notes) open the dock pre-filled.
  useEffect(() => {
    const onAsk = (event: Event) => {
      const text = (event as CustomEvent<{ text?: string }>).detail?.text;
      if (!text) return;
      setOpen(true);
      submit(text);
    };
    window.addEventListener("rose:ask", onAsk as EventListener);
    return () => window.removeEventListener("rose:ask", onAsk as EventListener);
  });


  // Compact dock (bottom-centered). Shown always; opens the panel on interaction.
  return (
    <>
      {/* Backdrop when expanded (mobile) */}
      {open ? (
        <button
          aria-label="Close Rose"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-scrim/30 backdrop-blur-sm md:hidden"
        />
      ) : null}

      <div
        className={cn(
          "fixed z-50 pointer-events-none",
          "bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:bottom-6 md:w-[min(560px,calc(100vw-3rem))]",
        )}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocusWithin(true)}
          onBlurCapture={() => setFocusWithin(false)}
          className={cn(
            "pointer-events-auto flex flex-col overflow-hidden rounded-3xl border backdrop-blur-md transition-all duration-300 motion-reduce:transition-none",
            active
              ? "border-outline-variant bg-surface-container-lowest/95 shadow-2xl shadow-black/10"
              : "border-outline-variant/40 bg-surface-container-lowest/35 shadow-lg shadow-black/5",
            open ? "max-h-[min(600px,80vh)]" : "max-h-[220px]",
          )}
        >
          {/* Header — only when expanded */}
          {open ? (
            <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={roseMark}
                  alt=""
                  width={28}
                  height={28}
                  loading="lazy"
                  className="h-7 w-7 dark:invert"
                />
                <div className="flex flex-col">
                  <span className="font-headline italic text-base text-primary leading-none">
                    Rose
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                    Ivan's site agent
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close Rose"
                className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <Icon name="close" className="text-lg" />
              </button>
            </div>
          ) : null}

          {/* Expanded transcript */}
          {open ? (
            <div
              className="flex-1 overflow-y-auto px-5 py-4"
              role="log"
              aria-live="polite"
            >
              {messages.length === 0 && !isLoading ? (
                <p className="text-sm text-on-surface-variant">
                  Pick a topic below, or ask anything about Ivan's work.
                </p>
              ) : null}

              <div className="flex flex-col gap-4">
                {messages.map((m) => {
                  const text = renderText(m);
                  const bookingPart = Array.isArray(m.parts)
                    ? m.parts.find(
                        (p) =>
                          typeof p.type === "string" &&
                          p.type.startsWith("tool-propose_booking"),
                      )
                    : undefined;

                  if (m.role === "user") {
                    return (
                      <div key={m.id} className="ml-auto max-w-[85%]">
                        <div className="rounded-2xl bg-secondary/10 px-4 py-2.5 text-sm text-on-surface">
                          {text}
                        </div>
                      </div>
                    );
                  }

                  const bookingInput =
                    bookingPart &&
                    typeof (bookingPart as { input?: unknown }).input ===
                      "object"
                      ? ((bookingPart as { input: Record<string, unknown> })
                          .input as { intent?: string; reason?: string })
                      : undefined;

                  return (
                    <div key={m.id} className="mr-auto max-w-[92%]">
                      {text ? (
                        <div className="whitespace-pre-wrap text-sm text-on-surface">
                          {text}
                        </div>
                      ) : null}
                      {bookingInput ? (
                        <RoseBookingCard
                          intent={
                            (bookingInput.intent as
                              | "product"
                              | "technical"
                              | "culture"
                              | "exploring"
                              | undefined) ??
                            detectedIntent
                          }
                          reason={bookingInput.reason ?? ""}
                          messages={messages}
                          sessionId={sessionId}
                        />
                      ) : null}
                    </div>
                  );
                })}

                {isLoading ? (
                  <div className="mr-auto flex items-center gap-1.5 text-sm text-on-surface-variant">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-secondary [animation-delay:0.15s]" />
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-secondary [animation-delay:0.3s]" />
                  </div>
                ) : null}

                {error ? (
                  <p className="text-xs text-destructive">
                    Something went off. Try again in a moment.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Chips row — always visible (both states) */}
          {(!open || messages.length === 0) ? (
            <div
              className={cn(
                "flex flex-wrap gap-2 px-5",
                open ? "pb-3" : "pt-4 pb-3",
              )}
            >
              {INTENT_CHIPS.slice(0, open ? 4 : 3).map((chip) => (
                <button
                  key={chip.intent}
                  onClick={() => onChip(chip)}
                  disabled={isLoading}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs text-on-surface transition-all duration-300 motion-reduce:transition-none hover:border-secondary hover:bg-secondary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:opacity-50",
                    active
                      ? "border-outline-variant bg-surface-container"
                      : "border-outline-variant/40 bg-surface-container/40",
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          ) : null}

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(inputValue);
            }}
            className={cn(
              "flex items-center gap-2 border-outline-variant px-3 py-3",
              open ? "border-t" : "",
            )}
          >
            <div className="flex items-center pl-2">
              <img
                src={roseMark}
                alt=""
                width={22}
                height={22}
                loading="lazy"
                className={cn("h-5 w-5 dark:invert", open && "hidden")}
              />
            </div>
            {open ? (
              <textarea
                ref={expandedInputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(inputValue);
                  }
                }}
                placeholder="Ask Rose anything"
                rows={1}
                aria-label="Message Rose"
                className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
                disabled={isLoading}
              />
            ) : (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setOpen(true)}
                placeholder="Ask Rose anything"
                aria-label="Message Rose"
                className="flex-1 bg-transparent px-2 py-1.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
                disabled={isLoading}
              />
            )}
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message to Rose"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-on-secondary transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest disabled:opacity-40"
            >
              <Icon name="arrow_upward" className="text-lg" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RoseDock;
