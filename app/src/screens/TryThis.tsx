import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { allExperiments } from '../lib/content';
import type { DayOrNight, ExperimentGrade, ExperimentKind } from '../lib/types';

type SeasonFilter = 'any' | 'always' | 'winter' | 'spring' | 'summer' | 'autumn';
type TimeFilter = 'any' | 'day' | 'night' | 'either';
type LocationFilter = 'any' | 'outdoor' | 'indoor';

const SEASON_LABELS: Record<SeasonFilter, string> = {
  any: 'Any season',
  always: 'Always',
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
};

const TIME_LABELS: Record<TimeFilter, string> = {
  any: 'Day or night',
  day: 'Daytime',
  night: 'Night',
  either: 'Either',
};

const LOCATION_LABELS: Record<LocationFilter, string> = {
  any: 'Anywhere',
  outdoor: 'Outdoor',
  indoor: 'Indoor',
};

const GRADE_ORDER: ExperimentGrade[] = ['Starter', 'Core', 'Stretch'];

function locationFor(kind: ExperimentKind): 'outdoor' | 'indoor' {
  return kind === 'Story' ? 'indoor' : 'outdoor';
}

function matchesSeason(requiresSeason: string | undefined, filter: SeasonFilter): boolean {
  if (filter === 'any') return true;
  if (!requiresSeason || requiresSeason === 'any') return true;
  return requiresSeason === filter;
}

function matchesTime(dayOrNight: DayOrNight, filter: TimeFilter): boolean {
  if (filter === 'any') return true;
  if (dayOrNight === 'either') return true;
  return dayOrNight === filter;
}

function matchesLocation(kind: ExperimentKind, filter: LocationFilter): boolean {
  if (filter === 'any') return true;
  return locationFor(kind) === filter;
}

export default function TryThis() {
  const [season, setSeason] = useState<SeasonFilter>('any');
  const [time, setTime] = useState<TimeFilter>('any');
  const [location, setLocation] = useState<LocationFilter>('any');

  const experiments = useMemo(() => allExperiments(), []);

  const filtered = useMemo(
    () =>
      experiments.filter(
        (e) =>
          matchesSeason(e.requires?.season, season) &&
          matchesTime(e.day_or_night, time) &&
          matchesLocation(e.kind, location),
      ),
    [experiments, season, time, location],
  );

  const grouped = useMemo(() => {
    const map: Record<ExperimentGrade, typeof filtered> = {
      Starter: [],
      Core: [],
      Stretch: [],
    };
    for (const e of filtered) {
      (map[e.grade] ?? map['Core']).push(e);
    }
    return map;
  }, [filtered]);

  const total = filtered.length;

  return (
    <div>
      <h1>Try This</h1>
      <p className="muted">
        Every experiment across the site. Filter by when and where, then pick
        something for tonight.
      </p>

      <div className="toolbar">
        <select
          value={season}
          onChange={(e) => setSeason(e.target.value as SeasonFilter)}
          style={{ width: 'auto' }}
          aria-label="Filter by season"
        >
          {(Object.keys(SEASON_LABELS) as SeasonFilter[]).map((s) => (
            <option key={s} value={s}>
              {SEASON_LABELS[s]}
            </option>
          ))}
        </select>

        <select
          value={time}
          onChange={(e) => setTime(e.target.value as TimeFilter)}
          style={{ width: 'auto' }}
          aria-label="Filter by time of day"
        >
          {(Object.keys(TIME_LABELS) as TimeFilter[]).map((t) => (
            <option key={t} value={t}>
              {TIME_LABELS[t]}
            </option>
          ))}
        </select>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value as LocationFilter)}
          style={{ width: 'auto' }}
          aria-label="Filter by location"
        >
          {(Object.keys(LOCATION_LABELS) as LocationFilter[]).map((l) => (
            <option key={l} value={l}>
              {LOCATION_LABELS[l]}
            </option>
          ))}
        </select>

        {total > 0 && (
          <span className="muted small" style={{ alignSelf: 'center' }}>
            {total} experiment{total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {total === 0 && (
        <p className="muted">No experiments match those filters — try broadening the selection.</p>
      )}

      {GRADE_ORDER.map((grade) => {
        const list = grouped[grade];
        if (list.length === 0) return null;
        return (
          <section key={grade}>
            <h2>{grade}</h2>
            <div className="grid">
              {list.map((exp) => (
                <div key={exp.id} className="card try-this-card">
                  <div className="try-this-meta">
                    <span className="tag">{exp.kind}</span>
                    <span className="tag">{exp.day_or_night}</span>
                    {exp.duration_minutes && (
                      <span className="tag">{exp.duration_minutes} min</span>
                    )}
                  </div>
                  <h3 style={{ margin: '0.3rem 0 0.2rem' }}>{exp.title}</h3>
                  {exp.short && <p style={{ margin: '0 0 0.5rem' }}>{exp.short}</p>}
                  {exp.chapters && exp.chapters.length > 0 && (
                    <div className="try-this-chapters">
                      {exp.chapters.map((cid) => (
                        <Link key={cid} to={`/chapters/${cid}`} className="try-this-chapter-link">
                          {cid.replace(/-/g, '‑')}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
