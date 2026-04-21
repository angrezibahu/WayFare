import { Link } from 'react-router-dom';
import { allChapters } from '../lib/content';
import { resolveAll } from '../lib/unlock';
import { useEntries } from '../lib/useEntries';
import { useSettings } from '../lib/useSettings';

export default function Chapters() {
  const entries = useEntries();
  const { settings } = useSettings();
  const chapters = allChapters();
  const status = resolveAll(chapters, {
    now: new Date(),
    hemisphere: settings.hemisphere ?? 'northern',
    entries,
  });

  const grouped: Record<string, typeof chapters> = {};
  for (const ch of chapters) {
    (grouped[ch.season] ??= []).push(ch);
  }

  const order: Array<keyof typeof grouped> = ['always', 'winter', 'spring', 'summer', 'autumn'];

  return (
    <div>
      <h1>Chapters</h1>
      <p className="muted">
        Some chapters are always open. Others wait for the real world to make them relevant —
        for winter to come, for the Moon to be drawn.
      </p>

      {order.map((season) => {
        const list = grouped[season] ?? [];
        if (list.length === 0) return null;
        return (
          <section key={season}>
            <h2>{labelFor(season as string)}</h2>
            {list.map((ch) => {
              const s = status[ch.id];
              if (s?.unlocked) {
                return (
                  <Link key={ch.id} to={`/chapters/${ch.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card">
                      <h3>{ch.title}</h3>
                      <span className="tag">{ch.kind}</span>
                      <span className="tag">{ch.season}</span>
                    </div>
                  </Link>
                );
              }
              return (
                <div key={ch.id} className="card locked">
                  <h3>{ch.title}</h3>
                  <span className="tag">{ch.kind}</span>
                  <span className="tag">{ch.season}</span>
                  <p className="small">{s?.reason ?? 'Locked.'}</p>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}

function labelFor(s: string): string {
  if (s === 'always') return 'Always open';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
