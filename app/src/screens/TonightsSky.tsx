import { useMemo, useState } from 'react';
import { useSettings } from '../lib/useSettings';
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

export default function TonightsSky() {
  const { settings, save, loaded } = useSettings();
  const [lat, setLat] = useState(String(settings.latitude ?? ''));
  const [lng, setLng] = useState(String(settings.longitude ?? ''));
  const [handle, setHandle] = useState(settings.handle ?? '');

  const now = useMemo(() => new Date(), []);
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

  return (
    <div>
      <h1>Tonight&rsquo;s sky</h1>
      <p className="muted">
        {now.toLocaleDateString(undefined, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}{' '}
        — {season.charAt(0).toUpperCase() + season.slice(1)} in the {hemisphere} hemisphere.
      </p>

      <Tile
        label="Moon"
        value={`${phaseName} — ${illum}% lit`}
        note={phaseHint(phaseName)}
      />

      <Tile
        label="Sun"
        value={
          hasLocation
            ? `Rise ${formatTime(sun.sunrise)} · Set ${formatTime(sun.sunset)}`
            : 'Add your location below to see sunrise and sunset.'
        }
      />

      <Tile
        label="Orion"
        value={orion ? 'Up in the evening sky tonight.' : 'Not in the evening sky this month.'}
        note={
          orion
            ? 'Look south after dark. Follow the Belt down-left to Sirius.'
            : 'Orion is an evening constellation from roughly November to March (Northern Hemisphere).'
        }
      />

      <div className="callout">
        For an actual sky map, open{' '}
        <a href="https://stellarium-web.org" target="_blank" rel="noreferrer">
          Stellarium
        </a>
        . WayFare is a companion to the paper Fieldbook; it is not a planetarium.
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
