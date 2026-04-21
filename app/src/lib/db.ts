import Dexie, { type Table } from 'dexie';
import type { FamilySettings, FieldbookEntry } from './types';

/**
 * WayFareDB — local-only storage. No accounts. No sync.
 *
 * Two tables:
 *   - entries: every Fieldbook entry the family logs.
 *   - settings: a single row, id = 'family'.
 */
export class WayFareDB extends Dexie {
  entries!: Table<FieldbookEntry, number>;
  settings!: Table<FamilySettings & { id: string }, string>;

  constructor() {
    super('wayfare');
    this.version(1).stores({
      entries: '++id, date, chapter_id, challenge_id',
      settings: 'id',
    });
  }
}

export const db = new WayFareDB();

export async function getSettings(): Promise<FamilySettings> {
  const row = await db.settings.get('family');
  if (!row) return {};
  const { id: _id, ...rest } = row;
  return rest;
}

export async function saveSettings(next: FamilySettings): Promise<void> {
  await db.settings.put({ id: 'family', ...next });
}

export async function addEntry(entry: FieldbookEntry): Promise<number> {
  return db.entries.add(entry);
}

export async function allEntries(): Promise<FieldbookEntry[]> {
  return db.entries.orderBy('date').reverse().toArray();
}

export async function deleteEntry(id: number): Promise<void> {
  await db.entries.delete(id);
}
