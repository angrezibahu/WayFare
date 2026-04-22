import { useEffect, useState } from 'react';
import { sunriseSunset } from './astronomy';
import { useSettings } from './useSettings';

export type DayNight = 'day' | 'night';

/**
 * Decide whether the given moment falls between local sunrise and sunset.
 * Falls back to clock hours (06:00–18:00) when a location isn't known.
 */
export function isDaytime(
  now: Date,
  latitude?: number,
  longitude?: number
): boolean {
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    const { sunrise, sunset } = sunriseSunset(now, latitude, longitude);
    if (sunrise && sunset) {
      return now.getTime() >= sunrise.getTime() && now.getTime() < sunset.getTime();
    }
    // Polar day / polar night: fall through to the clock heuristic.
  }
  const hour = now.getHours();
  return hour >= 6 && hour < 18;
}

/**
 * Track whether it is currently day or night. Re-checks every minute so the
 * theme can flip around sunrise and sunset without a page reload.
 */
export function useDayNight(): DayNight {
  const { settings } = useSettings();
  const [mode, setMode] = useState<DayNight>(() =>
    isDaytime(new Date(), settings.latitude, settings.longitude) ? 'day' : 'night'
  );

  useEffect(() => {
    function tick() {
      const next = isDaytime(new Date(), settings.latitude, settings.longitude)
        ? 'day'
        : 'night';
      setMode((prev) => (prev === next ? prev : next));
    }
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [settings.latitude, settings.longitude]);

  return mode;
}
