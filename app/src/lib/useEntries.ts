import { useEffect, useState } from 'react';
import { liveQuery } from 'dexie';
import { db } from './db';
import type { FieldbookEntry } from './types';

/**
 * Subscribe to the local Fieldbook entries and re-render when they change.
 * Uses Dexie's liveQuery so the UI stays in sync with writes.
 */
export function useEntries(): FieldbookEntry[] {
  const [entries, setEntries] = useState<FieldbookEntry[]>([]);

  useEffect(() => {
    const obs = liveQuery(() =>
      db.entries.orderBy('date').reverse().toArray()
    );
    const sub = obs.subscribe({
      next: (list) => setEntries(list),
      error: (err) => console.warn('useEntries error', err),
    });
    return () => sub.unsubscribe();
  }, []);

  return entries;
}
