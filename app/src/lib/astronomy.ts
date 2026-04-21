/**
 * Tiny astronomy helpers for the "Tonight's Sky" screen.
 *
 * These are approximations — accurate to within a minute or two for our
 * purposes (telling a family what to expect tonight, not landing a probe).
 * For anything requiring precision, the app points the user at Stellarium.
 */

/** Julian day number for a JS Date (UTC). */
export function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/**
 * Moon phase as a fraction of a synodic cycle [0, 1).
 *   0.00 — new moon
 *   0.25 — first quarter
 *   0.50 — full moon
 *   0.75 — last quarter
 *
 * Based on John Conway's classic approximation, accurate to ~1 day.
 */
export function moonPhase(date: Date): number {
  const synodic = 29.53058867;
  // Reference new moon: 2000-01-06 18:14 UTC
  const ref = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
  const now = date.getTime() / 86400000;
  const days = now - ref;
  let phase = (days % synodic) / synodic;
  if (phase < 0) phase += 1;
  return phase;
}

export type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent';

export function moonPhaseName(p: number): MoonPhaseName {
  // Eight slices, each 1/8 wide, centred on the canonical phases.
  const slice = Math.floor((p + 1 / 16) * 8) % 8;
  return (
    [
      'New Moon',
      'Waxing Crescent',
      'First Quarter',
      'Waxing Gibbous',
      'Full Moon',
      'Waning Gibbous',
      'Last Quarter',
      'Waning Crescent',
    ] as MoonPhaseName[]
  )[slice];
}

/** Illuminated fraction of the Moon's visible disc [0, 1]. */
export function moonIllumination(p: number): number {
  return (1 - Math.cos(2 * Math.PI * p)) / 2;
}

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

function toDeg(r: number) {
  return (r * 180) / Math.PI;
}

/**
 * Approximate sunrise and sunset for a given date, latitude, and longitude.
 * Based on the NOAA sunrise equation. Returns Date objects in local time, or
 * null if the sun doesn't rise/set that day (polar regions).
 */
export function sunriseSunset(
  date: Date,
  latitude: number,
  longitude: number
): { sunrise: Date | null; sunset: Date | null } {
  const dayOfYear = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
      86400000
  );

  const lngHour = longitude / 15;

  function compute(isRise: boolean): Date | null {
    const t = isRise
      ? dayOfYear + (6 - lngHour) / 24
      : dayOfYear + (18 - lngHour) / 24;

    // Sun's mean anomaly
    const M = 0.9856 * t - 3.289;
    // True longitude
    let L =
      M +
      1.916 * Math.sin(toRad(M)) +
      0.020 * Math.sin(toRad(2 * M)) +
      282.634;
    L = ((L % 360) + 360) % 360;

    // Right ascension
    let RA = toDeg(Math.atan(0.91764 * Math.tan(toRad(L))));
    RA = ((RA % 360) + 360) % 360;

    // Put RA in the same quadrant as L
    const Lquad = Math.floor(L / 90) * 90;
    const RAquad = Math.floor(RA / 90) * 90;
    RA = RA + (Lquad - RAquad);
    RA = RA / 15;

    // Declination
    const sinDec = 0.39782 * Math.sin(toRad(L));
    const cosDec = Math.cos(Math.asin(sinDec));

    // Zenith for "official" sunrise/set (90°50')
    const zenith = 90.8333;
    const cosH =
      (Math.cos(toRad(zenith)) - sinDec * Math.sin(toRad(latitude))) /
      (cosDec * Math.cos(toRad(latitude)));

    if (cosH > 1 || cosH < -1) return null;

    let H = isRise ? 360 - toDeg(Math.acos(cosH)) : toDeg(Math.acos(cosH));
    H = H / 15;

    const T = H + RA - 0.06571 * t - 6.622;
    let UT = T - lngHour;
    UT = ((UT % 24) + 24) % 24;

    const hours = Math.floor(UT);
    const minutes = Math.floor((UT - hours) * 60);
    const seconds = Math.floor((((UT - hours) * 60) - minutes) * 60);

    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
        seconds
      )
    );
  }

  return {
    sunrise: compute(true),
    sunset: compute(false),
  };
}

/** "21:07" in the user's locale. */
export function formatTime(d: Date | null): string {
  if (!d) return '—';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * A rough "is Orion in the evening sky tonight?" check for Northern latitudes.
 * Orion is an evening constellation from roughly late November through March.
 * This is a blunt month check — good enough to tell a family whether to go out.
 */
export function orionVisibleTonight(date: Date, hemisphere: 'northern' | 'southern' = 'northern'): boolean {
  const m = date.getMonth(); // 0-11
  // Northern evening visibility: Nov–Mar (10, 11, 0, 1, 2)
  const north = m === 10 || m === 11 || m <= 2;
  return hemisphere === 'northern' ? north : !north;
}
