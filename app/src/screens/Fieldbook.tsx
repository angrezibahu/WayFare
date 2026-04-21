import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addEntry, deleteEntry } from '../lib/db';
import { useEntries } from '../lib/useEntries';
import { allChapters, allCards, cardById, chapterById } from '../lib/content';
import type { FieldbookEntry } from '../lib/types';

function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function Fieldbook() {
  const entries = useEntries();
  const chapters = useMemo(() => allChapters(), []);
  const cards = useMemo(() => allCards(), []);
  const [params, setParams] = useSearchParams();

  const preset = params.get('challenge') ?? '';

  const [date, setDate] = useState(todayIso());
  const [author, setAuthor] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [challengeId, setChallengeId] = useState(preset);
  const [body, setBody] = useState('');
  const [sighting, setSighting] = useState(false);

  useEffect(() => {
    if (preset && !challengeId) setChallengeId(preset);
  }, [preset, challengeId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const entry: FieldbookEntry = {
      date: new Date(date + 'T12:00:00').toISOString(),
      body: body.trim(),
      author: author.trim() || undefined,
      chapter_id: chapterId || undefined,
      challenge_id: challengeId || undefined,
      tags: sighting ? ['sighting'] : [],
    };
    await addEntry(entry);
    setBody('');
    setSighting(false);
    setChallengeId('');
    if (params.get('challenge')) {
      params.delete('challenge');
      setParams(params, { replace: true });
    }
  }

  async function onDelete(id: number) {
    if (!confirm('Delete this entry? This cannot be undone.')) return;
    await deleteEntry(id);
  }

  function exportMarkdown() {
    const lines: string[] = ['# WayFare Fieldbook export', ''];
    for (const e of entries) {
      lines.push('---');
      lines.push(`date: ${e.date.slice(0, 10)}`);
      if (e.author) lines.push(`author: ${e.author}`);
      if (e.chapter_id) lines.push(`chapter: ${e.chapter_id}`);
      if (e.challenge_id) lines.push(`challenge: ${e.challenge_id}`);
      if (e.tags && e.tags.length) lines.push(`tags: [${e.tags.join(', ')}]`);
      lines.push('---');
      lines.push('');
      lines.push(e.body);
      lines.push('');
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wayfare-fieldbook-${todayIso()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1>Fieldbook</h1>
      <p className="muted">
        A local log. Lives on this device. Export it as Markdown to commit it to the family
        repo once a year — that is the archive.
      </p>

      <h2>New entry</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="form-row">
          <label htmlFor="author">Who wrote this (optional)</label>
          <input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Noor"
          />
        </div>
        <div className="form-row">
          <label htmlFor="chapter">Linked chapter (optional)</label>
          <select
            id="chapter"
            value={chapterId}
            onChange={(e) => setChapterId(e.target.value)}
          >
            <option value="">—</option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="challenge">Linked challenge (optional)</label>
          <select
            id="challenge"
            value={challengeId}
            onChange={(e) => setChallengeId(e.target.value)}
          >
            <option value="">—</option>
            {cards.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>
            <input
              type="checkbox"
              checked={sighting}
              onChange={(e) => setSighting(e.target.checked)}
              style={{ width: 'auto', marginRight: '0.4rem' }}
            />
            This was a sighting (helps unlock related chapters)
          </label>
        </div>
        <div className="form-row">
          <label htmlFor="body">What happened</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What you saw, where you were, who was with you, what you learned…"
          />
        </div>
        <div className="toolbar">
          <button type="submit" disabled={!body.trim()}>Save entry</button>
        </div>
      </form>

      <h2>{entries.length === 0 ? 'No entries yet' : 'Entries'}</h2>
      {entries.length === 0 ? (
        <p className="muted">Write your first one above. Go outside first if you can.</p>
      ) : (
        <>
          <div className="toolbar">
            <button type="button" onClick={exportMarkdown}>Export as Markdown</button>
          </div>
          {entries.map((e) => (
            <div key={e.id} className="entry">
              <div className="when">
                {new Date(e.date).toLocaleDateString(undefined, {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
                {e.author ? ` · ${e.author}` : ''}
                {e.chapter_id ? ` · ${chapterById(e.chapter_id)?.title ?? e.chapter_id}` : ''}
                {e.challenge_id ? ` · ${cardById(e.challenge_id)?.title ?? e.challenge_id}` : ''}
                {e.tags && e.tags.length ? ` · ${e.tags.join(', ')}` : ''}
              </div>
              <div className="body">{e.body}</div>
              <div className="toolbar">
                <button type="button" onClick={() => onDelete(e.id!)}>Delete</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
