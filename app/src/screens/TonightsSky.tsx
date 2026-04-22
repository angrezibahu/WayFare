import { useEffect, useMemo, useState } from 'react';
import { useSettings } from '../lib/useSettings';
import { useDayNight } from '../lib/useDayNight';
import {
  moonPhase,
  moonPhaseName,
  moonIllumination,
  sunriseSunset,
  formatTime,
  orionVisibleTonight,
} from '../lib/astronomy';
import { currentSeason } from '../lib/unlock';

function Tile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="sky-tile">
      <div className="tile-label">{label}</div>
      <div className="tile-value">{value}</div>
      {note ? <div className="muted small">{note}</div> : null}
    </div>
  );
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return 'any moment now';
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export default function TonightsSky() {
  const { settings, save, loaded } = useSettings();
  const mode = useDayNight();
  const [lat, setLat] = useState(String(settings.latitude ?? ''));
  const [lng, setLng] = useState(String(settings.longitude ?? ''));
  const [handle, setHandle] = useState(settings.handle ?? '');

  // Re-render every minute so "time until sunset" ticks down.
  const [clockTick, setClockTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setClockTick((t) => t + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const now = useMemo(() => new Date(), [clockTick]);

  const phase = moonPhase(now);
  const phaseName = moonPhaseName(phase);
  const illum = Math.round(moonIllumination(phase) * 100);
  const hemisphere = settings.hemisphere ?? 'northern';
  const season = currentSeason(now, hemisphere);

  const hasLocation =
    typeof settings.latitude === 'number' && typeof settings.longitude === 'number';

  const sun = hasLocation
    ? sunriseSunset(now, settings.latitude!, settings.longitude!)
    : { sunrise: null, sunset: null };

  const orion = orionVisibleTonight(now, hemisphere);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const next = {
      handle: handle.trim() || undefined,
      latitude: lat ? Number(lat) : undefined,
      longitude: lng ? Number(lng) : undefined,
      hemisphere,
    };
    await save(next);
  }

  async function useGeolocation() {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(3));
        setLng(pos.coords.longitude.toFixed(3));
      },
      () => {
        // silently ignore; user can type manually.
      }
    );
  }

  const sunValue = hasLocation
    ? `Rise ${formatTime(sun.sunrise)} · Set ${formatTime(sun.sunset)}`
    : 'Add your location below to see sunrise and sunset.';

  const sunNote = hasLocation && sun.sunrise && sun.sunset
    ? mode === 'day'
      ? `Sunset in ${formatRemaining(sun.sunset.getTime() - now.getTime())}.`
      : `Next sunrise in ${formatRemaining(nextSunriseDelta(now, settings.latitude!, settings.longitude!))}.`
    : undefined;

  const moonTile = (
    <Tile
      label="Moon"
      value={`${phaseName} — ${illum}% lit`}
      note={phaseHint(phaseName)}
    />
  );

  const sunTile = <Tile label="Sun" value={sunValue} note={sunNote} />;

  const orionTile = (
    <Tile
      label="Orion"
      value={orion ? 'Up in the evening sky tonight.' : 'Not in the evening sky this month.'}
      note={
        orion
          ? 'Look south after dark. Follow the Belt down-left to Sirius.'
          : 'Orion is an evening constellation from roughly November to March (Northern Hemisphere).'
      }
    />
  );

  const heading = mode === 'day' ? "Today’s sky" : "Tonight’s sky";
  const lede = mode === 'day'
    ? 'Follow the sun. Notice the shadow. The stars are waiting for dusk.'
    : 'The day is done. Look up — the moon, the planets, the old constellations.';

  return (
    <div>
      <h1>{heading}</h1>
      <p className="muted">
        {now.toLocaleDateString(undefined, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}{' '}
        — {season.charAt(0).toUpperCase() + season.slice(1)} in the {hemisphere} hemisphere.
      </p>
      <p className="italic muted">{lede}</p>

      {mode === 'day' ? (
        <>
          {sunTile}
          {moonTile}
          {orionTile}
        </>
      ) : (
        <>
          {moonTile}
          {orionTile}
          {sunTile}
        </>
      )}

      <div className="callout">
        {mode === 'day' ? (
          <>
            For a live sky map after dark, open{' '}
            <a href="https://stellarium-web.org" target="_blank" rel="noreferrer">
              Stellarium
            </a>
            . In the meantime, step outside: sun position, wind, cloud shapes — all fair game for the Fieldbook.
          </>
        ) : (
          <>
            For an actual sky map, open{' '}
            <a href="https://stellarium-web.org" target="_blank" rel="noreferrer">
              Stellarium
            </a>
            . WayFare is a companion to the paper Fieldbook; it is not a planetarium.
          </>
        )}
      </div>

      <h2>Your family</h2>
      {!loaded ? (
        <p className="muted">Loading…</p>
      ) : (
        <form onSubmit={onSave}>
          <div className="form-row">
            <label htmlFor="handle">Family handle (optional)</label>
            <input
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. the Okonkwos"
            />
          </div>
          <div className="form-row">
            <label htmlFor="lat">Latitude</label>
            <input
              id="lat"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="51.507"
              inputMode="decimal"
            />
          </div>
          <div className="form-row">
            <label htmlFor="lng">Longitude</label>
            <input
              id="lng"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="-0.128"
              inputMode="decimal"
            />
          </div>
          <div className="toolbar">
            <button type="submit">Save</button>
            <button type="button" onClick={useGeolocation}>
              Use this device&rsquo;s location
            </button>
          </div>
          <p className="muted small">Stays on this device. No account, no sync.</p>
        </form>
      )}
    </div>
  );
}

/**
 * Milliseconds until the next sunrise from `now`. If today's sunrise is still
 * ahead (i.e. pre-dawn), returns that; otherwise returns tomorrow's.
 */
function nextSunriseDelta(now: Date, latitude: number, longitude: number): number {
  const today = sunriseSunset(now, latitude, longitude).sunrise;
  if (today && today.getTime() > now.getTime()) return today.getTime() - now.getTime();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const next = sunriseSunset(tomorrow, latitude, longitude).sunrise;
  if (!next) return 12 * 60 * 60 * 1000;
  return next.getTime() - now.getTime();
}

function phaseHint(name: string): string {
  switch (name) {
    case 'New Moon':
      return 'Invisible tonight. Dark skies — good for faint stars.';
    case 'Waxing Crescent':
      return 'A slim curve low in the west after sunset.';
    case 'First Quarter':
      return 'Half-lit, up at sunset, sets around midnight.';
    case 'Waxing Gibbous':
      return 'Most of the night, bright.';
    case 'Full Moon':
      return 'Rises at sunset, sets at sunrise. Too bright for faint things — a good night for Moon-watching.';
    case 'Waning Gibbous':
      return 'Rises a few hours after sunset.';
    case 'Last Quarter':
      return 'Rises around midnight; up before dawn.';
    case 'Waning Crescent':
      return 'Morning sliver before sunrise.';
    default:
      return '';
  }
}

