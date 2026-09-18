import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Scenario = {
  id: string;
  label: string;
  context: string;
  forecast: number;
  actual: number;
  /** What the node did with the forecast before service. */
  action: string;
  /** What the loop saw afterwards, in the operator's terms. */
  reading: string;
  alert?: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "tue-rain",
    label: "Rainy Tuesday",
    context: "Weekday service, steady rain from 18:00, no event nearby.",
    forecast: 74,
    actual: 71,
    action: "Prep cut on two slow-moving dishes, one runner moved to the later shift.",
    reading: "Forecast held. Waste stayed inside the usual range, no manual override needed.",
  },
  {
    id: "sat-match",
    label: "Saturday, match night",
    context: "Stadium two streets away, kick-off 21:00, late second seating.",
    forecast: 168,
    actual: 191,
    action: "Second seating opened early, prep raised on the three fastest movers.",
    reading: "Forecast short by 23 covers. The late surge is under-modelled when the match runs long.",
    alert: "Variance above 10 percent. The forecast is flagged for review before the next match night.",
  },
  {
    id: "holiday",
    label: "Bank holiday",
    context: "Public holiday, local offices closed, tourist footfall up.",
    forecast: 96,
    actual: 62,
    action: "Prep held at the normal weekday level rather than the holiday uplift.",
    reading: "Forecast long by 34 covers. Office trade does not transfer to holiday trade on this site.",
    alert: "Over-forecast. Holiday calendar weighting is pulled back until three more holidays are observed.",
  },
];

/**
 * What the anticipation loop actually produces: a forecast, a decision taken
 * before service, and the reading that comes back after. Including the days
 * it gets wrong, because those are the days that move the model.
 */
export const AetherixForecastConsole = ({
  label = "Anticipation, inspected",
}: {
  label?: string;
}) => {
  const [active, setActive] = useState(0);
  const current = SCENARIOS[active];
  const delta = current.actual - current.forecast;
  const pct = Math.round((Math.abs(delta) / current.forecast) * 100);

  return (
    <section
      aria-label={label}
      className="rounded-sm border border-outline bg-surface-container-low p-5 md:p-6"
    >
      <div className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-4">{label}</div>

      <div role="tablist" aria-label={label} className="grid gap-2 sm:grid-cols-3">
        {SCENARIOS.map((scenario, i) => {
          const isActive = i === active;
          return (
            <button
              key={scenario.id}
              type="button"
              role="tab"
              id={`forecast-tab-${scenario.id}`}
              aria-selected={isActive}
              aria-controls="forecast-panel"
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`text-left rounded-sm border px-4 py-3 transition-colors duration-300 ${
                isActive
                  ? "border-secondary bg-secondary/15"
                  : "border-outline-variant bg-surface-container-lowest hover:border-secondary"
              }`}
            >
              <span className="block font-headline italic text-base text-primary">{scenario.label}</span>
              <span className="block font-body text-xs text-on-surface-variant mt-1">{scenario.context}</span>
            </button>
          );
        })}
      </div>

      <div
        id="forecast-panel"
        role="tabpanel"
        aria-live="polite"
        aria-labelledby={`forecast-tab-${current.id}`}
        className="mt-5 rounded-sm border border-outline-variant bg-surface-container-lowest p-4 md:p-5"
      >
        <dl className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <dt className="font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
              Forecast
            </dt>
            <dd className="font-headline italic text-2xl text-primary">{current.forecast}</dd>
          </div>
          <div>
            <dt className="font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
              Actual
            </dt>
            <dd className="font-headline italic text-2xl text-primary">{current.actual}</dd>
          </div>
          <div>
            <dt className="font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
              Variance
            </dt>
            <dd className={`font-headline italic text-2xl ${pct > 10 ? "text-error" : "text-primary"}`}>
              {delta > 0 ? "+" : ""}
              {delta} · {pct}%
            </dd>
          </div>
        </dl>

        <div
          aria-hidden="true"
          className="h-1.5 w-full rounded-full bg-outline-variant overflow-hidden mb-4"
        >
          <div
            className={`h-full transition-[width] duration-700 ${pct > 10 ? "bg-error" : "bg-secondary"}`}
            style={{ width: `${Math.min(100, Math.max(6, pct * 4))}%` }}
          />
        </div>

        <p className="font-body text-sm leading-relaxed text-on-surface-variant">
          <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary mr-2">
            Decision
          </span>
          {current.action}
        </p>
        <p className="font-body text-sm leading-relaxed text-on-surface-variant mt-2">
          <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary mr-2">
            Reading
          </span>
          {current.reading}
        </p>
        {current.alert && (
          <p className="mt-3 flex items-start gap-2 rounded-sm border border-error/60 bg-error/10 p-3 font-body text-sm leading-relaxed text-on-surface">
            <Icon name="warning" className="text-[16px] text-error mt-0.5" />
            {current.alert}
          </p>
        )}
        <p className="mt-4 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
          Illustrative figures from shadow-mode runs, not a signed pilot
        </p>
      </div>
    </section>
  );
};

export default AetherixForecastConsole;
