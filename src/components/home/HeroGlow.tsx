import { useEffect, useState, type CSSProperties } from "react";
import { useMood } from "@/components/MoodProvider";
import { heroLight, sunLight, sunTimes, useParisNow, type HeroLight } from "@/lib/parisClock";

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
  const light = sunLight(minutes, sun);
  // Day mood: the real sun by day, a low rosy light at civil dawn and dusk, and a faint persistent twilight at night.
  // Dusk mood: the beam appears only at civil dawn and dusk, fainter, under the lamp.
  const twilight = light.phase !== "day";
  const strength = m === "day"
    ? light.phase === "day" ? 0.55 + 0.4 * Math.min(1, light.height * 2.2) : light.phase === "night" ? 0.3 : 0.3 + 0.3 * light.glow
    : light.phase === "dawn" || light.phase === "dusk" ? 0.12 + 0.22 * light.glow : 0;
  const lit = strength > 0;
  const h = twilight ? 0.04 : light.height;
  const style = {
    "--sun-x": `${(82 - 52 * light.progress).toFixed(2)}%`,
    "--sun-y": `${(4 + 14 * h).toFixed(2)}%`,
    "--sun-skew": `${(-28 + 56 * light.progress).toFixed(2)}deg`,
    "--sun-len": `${(1.7 - 0.7 * h).toFixed(3)}`,
    "--sun-strength": `${strength.toFixed(3)}`,
  } as CSSProperties;
  const [arrive] = useState(() => !arrived);
  useEffect(() => { arrived = true; }, []);
  return (
    <div aria-hidden="true" className="hero-glow" data-hero-glow={active} {...(arrive ? { "data-arrive": "" } : {})}>
      {LIGHTS.map((l) => (
        <div key={l} className="hero-glow-layer" data-light={l} {...(l === active ? { "data-active": "" } : {})} />
      ))}
      <div className="hero-sun" style={style} {...(lit ? { "data-lit": "" } : {})} {...(lit && twilight ? { "data-twilight": "" } : {})}><div className="hero-sun-pane" /></div>
      <div className="hero-grain" />
    </div>
  );
};

export default HeroGlow;
