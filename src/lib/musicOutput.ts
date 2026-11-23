/** One Web Audio gain per media element, including Safari where media.volume is read-only. */
export class MusicOutput {
  private readonly gains: GainNode[];

  constructor(private readonly context: AudioContext | null, private readonly elements: HTMLAudioElement[]) {
    if (!context) {
      elements.forEach(element => { element.volume = 0; });
      this.gains = [];
      return;
    }
    this.gains = elements.map(element => {
      const gain = context.createGain();
      gain.gain.value = 0;
      element.volume = 1;
      context.createMediaElementSource(element).connect(gain);
      gain.connect(context.destination);
      return gain;
    });
  }

  resume() { return this.context?.resume() ?? Promise.resolve(); }

  level(index: number, volume: number, seconds = 0) {
    if (!this.context) {
      const element = this.elements[index];
      if (element) element.volume = Math.min(1, Math.max(0, volume));
      return;
    }
    const parameter = this.gains[index]?.gain;
    if (!parameter) return;
    const now = this.context.currentTime;
    // Hold an interrupted fade before replacing it, never let old ramps overwrite a slider move.
    if (typeof parameter.cancelAndHoldAtTime === "function") parameter.cancelAndHoldAtTime(now);
    else {
      const current = parameter.value;
      parameter.cancelScheduledValues(now);
      parameter.setValueAtTime(current, now);
    }
    const next = Math.min(1, Math.max(0, volume));
    if (seconds > 0) parameter.linearRampToValueAtTime(next, now + seconds);
    else parameter.setValueAtTime(next, now);
  }

  close() { void this.context?.close().catch(() => {}); }
}