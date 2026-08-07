import { Icon } from "@/components/ui/Icon";

export const AetherixVideoPlaceholder = () => (
  <div className="aspect-video rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col items-center justify-center gap-3">
    <Icon name="play_circle" className="text-outline text-4xl" />
    <span className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
      Closed-loop demo, coming soon
    </span>
    <p className="text-xs text-on-surface-variant max-w-md text-center px-6">
      A three-minute walk-through of the loop: signal in, forecast, WhatsApp receipt, manager reply, memory update.
    </p>
  </div>
);

export default AetherixVideoPlaceholder;
