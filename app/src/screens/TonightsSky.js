import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useSettings } from '../lib/useSettings';
import { moonPhase, moonPhaseName, moonIllumination, sunriseSunset, formatTime, orionVisibleTonight, } from '../lib/astronomy';
import { currentSeason } from '../lib/unlock';
function Tile({ label, value, note }) {
    return (_jsxs("div", { className: "sky-tile", children: [_jsx("div", { className: "tile-label", children: label }), _jsx("div", { className: "tile-value", children: value }), note ? _jsx("div", { className: "muted small", children: note }) : null] }));
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
    const hasLocation = typeof settings.latitude === 'number' && typeof settings.longitude === 'number';
    const sun = hasLocation
        ? sunriseSunset(now, settings.latitude, settings.longitude)
        : { sunrise: null, sunset: null };
    const orion = orionVisibleTonight(now, hemisphere);
    async function onSave(e) {
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
        if (!('geolocation' in navigator))
            return;
        navigator.geolocation.getCurrentPosition((pos) => {
            setLat(pos.coords.latitude.toFixed(3));
            setLng(pos.coords.longitude.toFixed(3));
        }, () => {
            // silently ignore; user can type manually.
        });
    }
    return (_jsxs("div", { children: [_jsx("h1", { children: "Tonight\u2019s sky" }), _jsxs("p", { className: "muted", children: [now.toLocaleDateString(undefined, {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    }), ' ', "\u2014 ", season.charAt(0).toUpperCase() + season.slice(1), " in the ", hemisphere, " hemisphere."] }), _jsx(Tile, { label: "Moon", value: `${phaseName} — ${illum}% lit`, note: phaseHint(phaseName) }), _jsx(Tile, { label: "Sun", value: hasLocation
                    ? `Rise ${formatTime(sun.sunrise)} · Set ${formatTime(sun.sunset)}`
                    : 'Add your location below to see sunrise and sunset.' }), _jsx(Tile, { label: "Orion", value: orion ? 'Up in the evening sky tonight.' : 'Not in the evening sky this month.', note: orion
                    ? 'Look south after dark. Follow the Belt down-left to Sirius.'
                    : 'Orion is an evening constellation from roughly November to March (Northern Hemisphere).' }), _jsxs("div", { className: "callout", children: ["For an actual sky map, open", ' ', _jsx("a", { href: "https://stellarium-web.org", target: "_blank", rel: "noreferrer", children: "Stellarium" }), ". WayFare is a companion to the paper Fieldbook; it is not a planetarium."] }), _jsx("h2", { children: "Your family" }), !loaded ? (_jsx("p", { className: "muted", children: "Loading\u2026" })) : (_jsxs("form", { onSubmit: onSave, children: [_jsxs("div", { className: "form-row", children: [_jsx("label", { htmlFor: "handle", children: "Family handle (optional)" }), _jsx("input", { id: "handle", value: handle, onChange: (e) => setHandle(e.target.value), placeholder: "e.g. the Okonkwos" })] }), _jsxs("div", { className: "form-row", children: [_jsx("label", { htmlFor: "lat", children: "Latitude" }), _jsx("input", { id: "lat", value: lat, onChange: (e) => setLat(e.target.value), placeholder: "51.507", inputMode: "decimal" })] }), _jsxs("div", { className: "form-row", children: [_jsx("label", { htmlFor: "lng", children: "Longitude" }), _jsx("input", { id: "lng", value: lng, onChange: (e) => setLng(e.target.value), placeholder: "-0.128", inputMode: "decimal" })] }), _jsxs("div", { className: "toolbar", children: [_jsx("button", { type: "submit", children: "Save" }), _jsx("button", { type: "button", onClick: useGeolocation, children: "Use this device\u2019s location" })] }), _jsx("p", { className: "muted small", children: "Stays on this device. No account, no sync." })] }))] }));
}
function phaseHint(name) {
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
