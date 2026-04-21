import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allCards } from '../lib/content';
import type { CardGrade, CardKind } from '../lib/types';

const GRADES: CardGrade[] = ['Starter', 'Core', 'Stretch'];
const KINDS: CardKind[] = ['Sky', 'Land', 'Story', 'Error'];

export default function Challenges() {
  const cards = useMemo(() => allCards(), []);
  const [gradeFilter, setGradeFilter] = useState<CardGrade | ''>('');
  const [kindFilter, setKindFilter] = useState<CardKind | ''>('');
  const [drawn, setDrawn] = useState<string | null>(null);

  const filtered = cards.filter((c) => {
    if (gradeFilter && c.grade !== gradeFilter) return false;
    if (kindFilter && c.kind !== kindFilter) return false;
    return true;
  });

  function drawRandom() {
    if (filtered.length === 0) return;
    const n = Math.floor(Math.random() * filtered.length);
    setDrawn(filtered[n].id);
    // Scroll drawn card into view after render
    requestAnimationFrame(() => {
      const el = document.getElementById(`card-${filtered[n].id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  return (
    <div>
      <h1>Challenges</h1>
      <p className="muted">
        {cards.length} cards. Draw one, choose one, or scroll. Most of them ask you to leave
        the house.
      </p>

      <div className="toolbar">
        <button type="button" onClick={drawRandom}>Draw a card</button>
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value as CardGrade | '')}
          aria-label="Filter by grade"
        >
          <option value="">any grade</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value as CardKind | '')}
          aria-label="Filter by kind"
        >
          <option value="">any kind</option>
          {KINDS.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>

      {filtered.map((card) => {
        const isDrawn = drawn === card.id;
        return (
          <div
            key={card.id}
            id={`card-${card.id}`}
            className="card"
            style={isDrawn ? { outline: '2px solid var(--ink)' } : undefined}
          >
            <h3>{card.title}</h3>
            <div>
              <span className="tag">{card.grade}</span>
              <span className="tag">{card.kind}</span>
              {card.time ? <span className="tag">{card.time}</span> : null}
            </div>
            <p style={{ whiteSpace: 'pre-wrap' }}>{card.prompt.trim()}</p>
            {card.fieldbook_prompt ? (
              <p className="small muted" style={{ whiteSpace: 'pre-wrap' }}>
                <strong>Fieldbook prompt:</strong> {card.fieldbook_prompt.trim()}
              </p>
            ) : null}
            <p className="small muted italic">Provenance: {card.provenance}</p>
            <Link to={`/fieldbook?challenge=${encodeURIComponent(card.id)}`}>
              <button type="button">Log this in the Fieldbook</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
