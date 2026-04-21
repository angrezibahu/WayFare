import { useEffect, useState } from 'react';
import { liveQuery } from 'dexie';
import { db } from './db';
/**
 * Subscribe to the local Fieldbook entries and re-render when they change.
 * Uses Dexie's liveQuery so the UI stays in sync with writes.
 */
export function useEntries() {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        const obs = liveQuery(() => db.entries.orderBy('date').reverse().toArray());
        const sub = obs.subscribe({
            next: (list) => setEntries(list),
            error: (err) => console.warn('useEntries error', err),
        });
        return () => sub.unsubscribe();
    }, []);
    return entries;
}
