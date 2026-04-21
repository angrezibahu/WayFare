import { useCallback, useEffect, useState } from 'react';
import { liveQuery } from 'dexie';
import { db, saveSettings } from './db';
import type { FamilySettings } from './types';

export function useSettings() {
  const [settings, setSettings] = useState<FamilySettings>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const obs = liveQuery(async () => {
      const row = await db.settings.get('family');
      if (!row) return {} as FamilySettings;
      const { id: _id, ...rest } = row;
      return rest as FamilySettings;
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

  const save = useCallback(async (next: FamilySettings) => {
    await saveSettings(next);
  }, []);

  return { settings, save, loaded };
}
