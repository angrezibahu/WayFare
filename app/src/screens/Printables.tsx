import type { CSSProperties } from 'react';
import constellationDots from '../../../content/constellation-dots.json';

type ConstellationEntry = { id: string; label: string; subtitle: string; hint: string };

const TEMPLATES = [
  { id: '01-title-page',             title: 'Title Page',             desc: 'Name your fieldbook and make it yours.' },
  { id: '02-moon-diary-month',       title: 'Moon Diary — Month',     desc: 'Track the full lunar cycle night by night.' },
  { id: '03-sky-log',                title: 'Sky Log',                desc: 'Record each night-sky session.' },
  { id: '04-constellation-study',    title: 'Constellation Study',    desc: 'One page per constellation — how you found it, its stars, a story.' },
  { id: '05-landcraft-log',          title: 'Landcraft Log',          desc: 'Ground features, terrain, living compasses.' },
  { id: '06-error-journal',          title: 'Error Journal',          desc: 'What went wrong and what you learned.' },
  { id: '07-story-of-this-place',    title: 'Story of This Place',    desc: 'The tales that belong to where you stood.' },
  { id: '08-year-map',               title: 'Year Map',               desc: 'Map the whole year of outings.' },
  { id: '09-star-chart-blank',       title: 'Seasonal Star Chart',    desc: 'Blank horizon chart — plot what you see.' },
  { id: '10-things-i-found',         title: 'Things I Found',         desc: 'Dated page with prompts: weather, sounds, sketch, story.' },
  { id: '11-moon-phase-tracker',     title: 'Moon Phase Tracker',     desc: 'Shade each night\'s phase over one lunar cycle.' },
  { id: '12-wayfinding-cheat-sheet', title: 'Daylight Wayfinding',    desc: 'Shadow stick, moon horns, watch method, pacing — all on one page.' },
];

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '0.6rem',
  margin: '0.8rem 0',
};

export default function Printables() {
  const constellations: ConstellationEntry[] = constellationDots.constellations;

  return (
    <div>
      <h1>Printables</h1>
      <p>
        Print-ready field-book pages for the paper Fieldbook. Open any page on your phone to
        view, then tap Save as PDF or send to a printer. All pages are A4, black-and-white.
      </p>

      <div className="callout">
        Print the whole book in one go:{' '}
        <a href="./printables/fieldbook.html">open the full bundle →</a>
      </div>

      <h2>Fieldbook pages</h2>
      <div style={gridStyle}>
        {TEMPLATES.map((t) => (
          <a key={t.id} href={`./printables/${t.id}.html`} style={{ textDecoration: 'none' }}>
            <div className="card">
              <span className="tag">fieldbook</span>
              <h3 style={{ marginTop: '0.3rem' }}>{t.title}</h3>
              <p className="muted small">{t.desc}</p>
            </div>
          </a>
        ))}
      </div>

      <h2>Constellation dot-to-dots</h2>
      <div style={gridStyle}>
        {constellations.map((c) => (
          <a key={c.id} href={`./printables/constellation-${c.id}.html`} style={{ textDecoration: 'none' }}>
            <div className="card">
              <span className="tag">constellation</span>
              <h3 style={{ marginTop: '0.3rem' }}>{c.label}</h3>
              <p className="muted small">{c.subtitle}</p>
            </div>
          </a>
        ))}
      </div>

      <p className="muted small">
        Pages are generated from the content files at build time. Run{' '}
        <code>node scripts/build-printables.mjs</code> to regenerate.
      </p>
    </div>
  );
}
