import { cn } from "@/lib/utils";
import { LAMP_INDEX, SIGNAL_WORD, type Signal } from "@/content/recoLine";

const LIT: Record<Exclude<Signal, "dark">, string> = {
  go: "bg-signal-go border-signal-go",
  warn: "bg-signal-warn border-signal-warn",
  stop: "bg-signal-stop border-signal-stop",
};

/** Three-lamp signal. Always paired with its state word, so colour is never the only cue. */
export const SignalLamp = ({
  state, label, hideWord = false, className,
}: { state: Signal; label?: string; hideWord?: boolean; className?: string }) => {
  const lit = LAMP_INDEX[state];
  const word = label ?? SIGNAL_WORD[state];
  return (
    <span className={cn("inline-flex items-center gap-2 align-middle", className)} data-signal={state}>
      <span aria-hidden className="grid gap-[3px] rounded-[4px] border border-outline-variant bg-surface-container-lowest px-[4px] py-[3px]">
        {[0, 1, 2].map((k) => (
          <i key={k} data-lit={k === lit || undefined}
            className={cn("block h-2 w-2 rounded-full border border-outline-variant bg-surface-container-high",
              k === lit && state !== "dark" && LIT[state])} />
        ))}
      </span>
      <span className={cn("font-label text-[11px] uppercase tracking-[0.12em] text-on-surface", hideWord && "sr-only")}>{word}</span>
    </span>
  );
};

export default SignalLamp;
