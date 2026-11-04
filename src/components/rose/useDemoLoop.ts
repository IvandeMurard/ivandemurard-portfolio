import { useEffect, useState } from "react";

/** One exchange every 9 ticks of 900 ms: question, reading, answer held, blank. */
export const STEPS = [1, 2, 3, 3, 3, 3, 3, 3, 0];
export const TICK_MS = 900;

/**
 * The loop of a demo. Reduced motion: the first exchange complete, no loop. Paused (WCAG 2.2.2): the loop
 * stops and the current exchange is shown complete. select() jumps to an exchange and pauses on it.
 */
export const useDemoLoop = (count: number, reduced: boolean) => {
  const [tick, setTick] = useState(reduced ? 2 : 0);
  const [paused, setPaused] = useState(false);

  useEffect(() => { setTick(reduced ? 2 : 0); }, [reduced, count]);

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % (STEPS.length * count)), TICK_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused, count]);

  return {
    ex: Math.floor(tick / STEPS.length),
    step: paused ? 3 : STEPS[tick % STEPS.length],
    paused,
    toggle: () => setPaused((p) => !p),
    /** Show exchange `index` complete and pause the loop on it. */
    select: (index: number) => { setTick(index * STEPS.length + 2); setPaused(true); },
  };
};
