import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { getRosePrompts, type RosePrompt } from "@/content/rosePrompts";
import { Link, useLocation } from "react-router-dom";
import { RoseBookingCard } from "./RoseBookingCard";
import { renderRoseMarkdown } from "./roseMarkdown";
import { CAL_URL } from "./roseConfig";
import { logRoseEvent } from "./roseEvents";
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

type ToolPart = { type: string; input?: Record<string, unknown> };
const findTool = (m: UIMessage, name: string): ToolPart | undefined =>
  Array.isArray(m.parts)
    ? (m.parts as ToolPart[]).find((p) => typeof p.type === "string" && p.type === `tool-${name}`)
    : undefined;

type Section = { id: string; heading: string } | null;

/** The h2[id] closest above the upper third of the viewport. */
const useSectionInView = (pathname: string): React.MutableRefObject<Section> => {
  const ref = useRef<Section>(null);
  useEffect(() => {
    ref.current = null;
    const headings = Array.from(document.querySelectorAll<HTMLHeadingElement>("main h2[id]"));
    if (!headings.length) return;
    const visible = new Map<Element, boolean>();
    const pick = () => {
      const line = window.innerHeight / 3;
      let current: HTMLHeadingElement | null = null;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) current = h;
      }
      ref.current = current
        ? { id: current.id, heading: (current.textContent ?? "").trim().slice(0, 120) }
        : null;
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => visible.set(e.target, e.isIntersecting));
      pick();
    }, { rootMargin: "0px 0px -66% 0px" });
    headings.forEach((h) => io.observe(h));
    window.addEventListener("scroll", pick, { passive: true });
    pick();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", pick);
    };
  }, [pathname]);
  return ref;
};

const CompassMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" className={className} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="20" r="17" />
    <circle cx="20" cy="20" r="5.5" strokeWidth="0.8" />
    <path d="M20 3l4 13 13 4-13 4-4 13-4-13-13-4 13-4z" />
    <path d="M8 8l6 6M32 8l-6 6M8 32l6-6M32 32l-6-6" strokeWidth="0.6" />
  </svg>
);

export const RoseDock = () => {
  const [open, setOpen] = useState(false);
  const [detectedIntent, setDetectedIntent] = useState<
    "product" | "technical" | "culture" | "exploring" | null
  >(null);
  const [inputValue, setInputValue] = useState("");
  const [focusWithin, setFocusWithin] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [lift, setLift] = useState(0);
  const expandedInputRef = useRef<HTMLTextAreaElement>(null);
  const sessionId = useMemo(() => getSessionId(), []);
  const { pathname } = useLocation();
  const prompts = useMemo(() => getRosePrompts(pathname), [pathname]);
  const sectionRef = useSectionInView(pathname);
  const isHome = pathname === "/";

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rose-chat`,
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({ id: sessionId, transport });
  const isLoading = status === "submitted" || status === "streaming";

  const log = (kind: Parameters<typeof logRoseEvent>[0]["kind"], label?: string, usedChip = false) =>
    logRoseEvent({
      session_id: sessionId,
      path: pathname,
      section_id: sectionRef.current?.id ?? null,
      kind,
      label_or_question: label ?? null,
      used_chip: usedChip,
    });

  // Homepage: the dock waits until the hero call to action has scrolled away.
  useEffect(() => {
    if (!isHome) { setPastHero(true); return; }
    setPastHero(false);
    const cta = document.querySelector('[data-cta="primary"]');
    if (!cta) { setPastHero(true); return; }
    const io = new IntersectionObserver(([e]) => {
      setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0);
    });
    io.observe(cta);
    return () => io.disconnect();
  }, [isHome]);

  // Lift above the footer so its links stay reachable.
  useEffect(() => {
    const onScroll = () => {
      const footer = document.querySelector("footer");
      if (!footer) return setLift(0);
      const overlap = window.innerHeight - footer.getBoundingClientRect().top;
      setLift(overlap > 0 ? overlap : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (open) {
      log("opened");
      requestAnimationFrame(() => expandedInputRef.current?.focus());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // One booking_proposed event per assistant message that renders the card.
  const proposedSeen = useRef(new Set<string>());
  useEffect(() => {
    for (const m of messages) {
      if (m.role !== "assistant" || proposedSeen.current.has(m.id)) continue;
      if (findTool(m, "propose_booking")) {
        proposedSeen.current.add(m.id);
        log("booking_proposed");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const submit = (text: string, suggested?: RosePrompt) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    if (!open) setOpen(true);
    setInputValue("");
    const section = sectionRef.current;
    void sendMessage(
      { text: trimmed },
      {
        body: {
          page: {
            path: pathname,
            title: typeof document !== "undefined" ? document.title : "",
            ...(section ? { section_id: section.id, section_heading: section.heading } : {}),
          },
          ...(suggested
            ? { suggested: { label: suggested.label, intent: suggested.intent ?? null } }
            : {}),
        },
      },
    );
  };

  const onChip = (chip: RosePrompt) => {
    if (chip.booking) {
      log("booking_clicked", chip.label, true);
      window.open(CAL_URL, "_blank", "noopener,noreferrer");
      return;
    }
    if (chip.intent) setDetectedIntent(chip.intent);
    log("chip", chip.label, true);
    submit(chip.message, chip);
  };

  const onFollowup = (text: string) => {
    log("followup", text, true);
    submit(text);
  };

  const onFree = () => {
    if (!inputValue.trim() || isLoading) return;
    log("question", inputValue.trim(), false);
    submit(inputValue);
  };

  useEffect(() => {
    const onAsk = (event: Event) => {
      const text = (event as CustomEvent<{ text?: string }>).detail?.text;
      if (!text) return;
      setOpen(true);
      log("question", text, true);
      submit(text);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("rose:ask", onAsk as EventListener);
    window.addEventListener("rose:open", onOpen);
    return () => {
      window.removeEventListener("rose:ask", onAsk as EventListener);
      window.removeEventListener("rose:open", onOpen);
    };
  });

  const hidden = !open && !pastHero;
  const showChips = open ? messages.length === 0 : focusWithin;
  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <>
      {open ? (
        <button
          aria-label="Close Rose"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-scrim/30 md:hidden"
        />
      ) : null}

      <div
        aria-hidden={hidden || undefined}
        style={{ transform: `translateY(${hidden ? "160%" : `-${lift}px`})` }}
        className={cn(
          "fixed z-50 transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none",
          "bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-ml-[min(280px,calc(50vw-1.5rem))] md:bottom-6 md:w-[min(560px,calc(100vw-3rem))]",
          hidden ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <div
          onFocusCapture={() => setFocusWithin(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusWithin(false);
          }}
          className={cn(
            "flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest",
            open ? "max-h-[min(600px,80vh)] shadow-xl shadow-primary/10" : "shadow-md shadow-primary/5",
          )}
        >
          {open ? (
            <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3">
              <div className="flex items-center gap-2.5">
                <img src={roseMark} alt="" width={28} height={28} loading="lazy" className="h-7 w-7 dark:invert" />
                <div className="flex flex-col">
                  <span className="font-headline italic text-base text-primary leading-none">Rose</span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">Ivan's site agent</span>
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

          {open ? (
            <div className="flex-1 overflow-y-auto px-5 py-4" role="log" aria-live="polite">
              {messages.length === 0 && !isLoading ? (
                <p className="text-sm text-on-surface-variant">Pick a topic below, or ask anything.</p>
              ) : null}

              <div className="flex flex-col gap-4">
                {messages.map((m) => {
                  const text = renderText(m);
                  if (m.role === "user") {
                    return (
                      <div key={m.id} className="ml-auto max-w-[85%]">
                        <div className="rounded-2xl bg-secondary/10 px-4 py-2.5 text-sm text-on-surface">{text}</div>
                      </div>
                    );
                  }
                  const booking = findTool(m, "propose_booking")?.input as
                    | { intent?: string; reason?: string }
                    | undefined;
                  const follow = findTool(m, "suggest_followups")?.input as { items?: unknown } | undefined;
                  const items = Array.isArray(follow?.items)
                    ? (follow!.items as unknown[]).filter((x): x is string => typeof x === "string").slice(0, 2)
                    : [];
                  return (
                    <div key={m.id} className="mr-auto max-w-[92%]">
                      {text ? <div className="whitespace-pre-wrap text-sm text-on-surface">{renderRoseMarkdown(text)}</div> : null}
                      {booking ? (
                        <RoseBookingCard
                          intent={(booking.intent as "product" | "technical" | "culture" | "exploring" | undefined) ?? detectedIntent}
                          reason={booking.reason ?? ""}
                          sessionId={sessionId}
                        />
                      ) : null}
                      {items.length && m.id === lastAssistantId && !isLoading ? (
                        <div className="mt-3 flex flex-wrap gap-2" aria-label="Suggested follow-ups">
                          {items.map((q) => (
                            <button
                              key={q}
                              type="button"
                              onClick={() => onFollowup(q)}
                              className="rounded-full border border-outline-variant bg-surface-container px-3.5 py-1.5 text-xs text-on-surface transition-colors hover:border-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
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

                {error ? <p className="text-xs text-destructive">Rose lost the thread for a moment. Please feel free to try again, or reach out to Ivan directly.</p> : null}
              </div>
            </div>
          ) : null}

          {showChips ? (
            <div className={cn("flex flex-wrap gap-2 px-4", open ? "pb-3" : "pt-3")}>
              {prompts.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onChip(chip)}
                  disabled={isLoading && !chip.booking}
                  aria-label={chip.booking ? "Book a call (opens cal.com in a new tab)" : chip.ariaLabel ?? chip.label}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs transition-colors hover:border-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:opacity-50",
                    chip.booking
                      ? "border-secondary text-secondary bg-surface-container-lowest"
                      : "border-outline-variant bg-surface-container text-on-surface",
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          ) : null}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onFree();
            }}
            className={cn("flex items-center gap-2 px-3", open ? "border-t border-outline-variant py-3" : "h-[52px] md:h-[48px] py-0")}
          >
            {!open && messages.length > 0 ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Reopen the conversation with Rose"
                tabIndex={hidden ? -1 : 0}
                className="ml-1 flex shrink-0 items-center gap-1.5 rounded-full border border-secondary px-2.5 py-1 text-xs text-secondary transition-colors hover:bg-secondary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <CompassMark className="h-4 w-4" />
                Resume
              </button>
            ) : !open ? <CompassMark className="ml-1 h-6 w-6 shrink-0 text-secondary" /> : null}
            {open ? (
              <textarea
                ref={expandedInputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onFree();
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
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) setOpen(true);
                }}
                placeholder="Ask Rose anything"
                aria-label="Message Rose"
                className="flex-1 bg-transparent px-2 py-1.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
                tabIndex={hidden ? -1 : 0}
              />
            )}
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message to Rose"
              tabIndex={hidden ? -1 : 0}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-on-secondary transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:opacity-40"
            >
              <Icon name="arrow_upward" className="text-lg" />
            </button>
          </form>
          {open ? (
            <p className="px-5 pb-2.5 -mt-1 text-[11px] text-on-surface-variant">
              Questions are kept 90 days, without IP.{" "}
              <Link to="/privacy#rose" className="underline underline-offset-2 hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm">
                Privacy
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default RoseDock;
