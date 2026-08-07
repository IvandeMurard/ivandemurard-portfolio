import { Icon } from "@/components/ui/Icon";

const RECEIPT = `Breakfast    84 covers   ·  confidence 88%        (illustrative)
             72 rooms booked + 12 typical Tue walk-ins
             Staff: 4 FOH  (you ran 3 last Tue → 1 understaffing flag)
Driver       local conference check-ins + clear weather
Last week    forecast 79 · actual 81 · MAPE 2.5%`;

export const AetherixDailyReceipt = () => (
  <div className="max-w-2xl mx-auto bg-surface-container-high border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
    {/* Header */}
    <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant bg-surface-container">
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon name="chat" className="text-secondary text-lg" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-headline italic text-primary text-sm leading-tight">Aetherix</p>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">today · 18:42</p>
      </div>
      <span className="font-label uppercase tracking-[0.18em] text-[10px] text-secondary">Daily Receipt</span>
    </div>

    {/* Receipt body */}
    <pre className="px-5 py-6 md:px-7 md:py-7 font-mono text-xs md:text-sm text-on-surface leading-relaxed whitespace-pre-wrap overflow-x-auto">
{RECEIPT}
    </pre>

    {/* Reply chips */}
    <div className="px-5 pb-5 md:px-7 md:pb-6 flex flex-wrap gap-2">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant text-xs text-on-surface hover:bg-surface transition-colors"
      >
        ✅ accept
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant text-xs text-on-surface hover:bg-surface transition-colors"
      >
        ✏️ modify
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant text-xs text-on-surface hover:bg-surface transition-colors"
      >
        ❌ reject
      </button>
    </div>

    <p className="px-5 pb-5 md:px-7 md:pb-6 text-xs text-on-surface-variant italic">
      One tap. That reply is the signal Aetherix learns from. The day-90 receipt is sharper than the day-7 one.
    </p>
  </div>
);

export default AetherixDailyReceipt;
