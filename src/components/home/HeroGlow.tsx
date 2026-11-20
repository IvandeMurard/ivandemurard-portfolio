import { useEffect, useState, type CSSProperties } from "react";
import { useMood } from "@/components/MoodProvider";
import { heroLight, sunPath, sunTimes, useParisNow, type HeroLight } from "@/lib/parisClock";

const LIGHTS: HeroLight[] = ["morning", "midday", "late", "dusk"];

// The glow warms in once per page load. A later visit to the homepage in the same load (a route change) does not replay it.
let arrived = false;
/** Test helper: a new page load. */
export const resetHeroArrival = () => { arrived = false; };

/**
 * The light of the homepage hero: a soft radial glow from the top right, warmer or paler with the sun over Paris
 * (sunrise and sunset computed in parisClock.ts, from the nav clock's own source), always the lamp glow in the Dusk
 * mood. The hour never changes the mood.
 * All four layers are mounted and only the active one is visible, so a change of period (or of mood) is a crossfade.
 * Over them, a window of daylight on the wall travels continuously with the sun (right to left from sunrise to sunset,
 * long and low near the horizon, short and high at noon), and a fine mineral grain gives the wall its matter.
 */
export const HeroGlow = () => {
  const { mood, preview } = useMood();
  const { date, minutes } = useParisNow();
  const m = preview ?? mood;
  const sun = sunTimes(date);
  const active = heroLight(minutes, m, sun);
  const path = sunPath(minutes, sun);
  const lit = m === "day" && path.up;
  const style = {
    "--sun-x": `${(82 - 52 * path.progress).toFixed(2)}%`,
    "--sun-y": `${(4 + 14 * path.elevation).toFixed(2)}%`,
    "--sun-skew": `${(-28 + 56 * path.progress).toFixed(2)}deg`,
    "--sun-len": `${(1.7 - 0.7 * path.elevation).toFixed(3)}`,
    "--sun-strength": `${(0.35 + 0.4 * Math.min(1, path.elevation * 2.2)).toFixed(3)}`,
  } as CSSProperties;
  const [arrive] = useState(() => !arrived);
  useEffect(() => { arrived = true; }, []);
  return (
    <div aria-hidden="true" className="hero-glow" data-hero-glow={active} {...(arrive ? { "data-arrive": "" } : {})}>
      {LIGHTS.map((l) => (
        <div key={l} className="hero-glow-layer" data-light={l} {...(l === active ? { "data-active": "" } : {})} />
      ))}
      <div className="hero-sun" style={style} {...(lit ? { "data-lit": "" } : {})}><div className="hero-sun-pane" /></div>
      <div className="hero-grain" />
    </div>
  );
};

export default HeroGlow;
