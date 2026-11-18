import { useEffect, useState } from "react";
import { useMood } from "@/components/MoodProvider";
import { heroLight, hourOf, useParisTime, type HeroLight } from "@/lib/parisClock";

const LIGHTS: HeroLight[] = ["morning", "midday", "late", "dusk"];

// The glow warms in once per page load. A later visit to the homepage in the same load (a route change) does not replay it.
let arrived = false;
/** Test helper: a new page load. */
export const resetHeroArrival = () => { arrived = false; };

/**
 * The light of the homepage hero: a soft radial glow from the top right, warmer or paler with the hour in Paris (the
 * nav clock's own source, see parisClock.ts), always the lamp glow in the Dusk mood. The hour never changes the mood.
 * All four layers are mounted and only the active one is visible, so a change of hour (or of mood) is a crossfade.
 */
export const HeroGlow = () => {
  const { mood, preview } = useMood();
  const active = heroLight(hourOf(useParisTime()), preview ?? mood);
  const [arrive] = useState(() => !arrived);
  useEffect(() => { arrived = true; }, []);
  return (
    <div aria-hidden="true" className="hero-glow" data-hero-glow={active} {...(arrive ? { "data-arrive": "" } : {})}>
      {LIGHTS.map((l) => (
        <div key={l} className="hero-glow-layer" data-light={l} {...(l === active ? { "data-active": "" } : {})} />
      ))}
    </div>
  );
};

export default HeroGlow;
