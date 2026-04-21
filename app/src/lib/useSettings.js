import { useCallback, useEffect, useState } from 'react';
import { liveQuery } from 'dexie';
import { db, saveSettings } from './db';
export function useSettings() {
    const [settings, setSettings] = useState({});
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const obs = liveQuery(async () => {
            const row = await db.settings.get('family');
            if (!row)
                return {};
            const { id: _id, ...rest } = row;
            return rest;
        });
        const sub = obs.subscribe({
            next: (s) => {
                setSettings(s);
                setLoaded(true);
            },
            error: (err) => {
                console.warn('useSettings error', err);
                setLoaded(true);
            },
        });
        return () => sub.unsubscribe();
    }, []);
    const save = useCallback(async (next) => {
        await saveSettings(next);
    }, []);
    return { settings, save, loaded };
}
