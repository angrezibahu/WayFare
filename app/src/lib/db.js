import Dexie from 'dexie';
/**
 * WayFareDB — local-only storage. No accounts. No sync.
 *
 * Two tables:
 *   - entries: every Fieldbook entry the family logs.
 *   - settings: a single row, id = 'family'.
 */
export class WayFareDB extends Dexie {
    entries;
    settings;
    constructor() {
        super('wayfare');
        this.version(1).stores({
            entries: '++id, date, chapter_id, challenge_id',
            settings: 'id',
        });
    }
}
export const db = new WayFareDB();
export async function getSettings() {
    const row = await db.settings.get('family');
    if (!row)
        return {};
    const { id: _id, ...rest } = row;
    return rest;
}
export async function saveSettings(next) {
    await db.settings.put({ id: 'family', ...next });
}
export async function addEntry(entry) {
    return db.entries.add(entry);
}
export async function allEntries() {
    return db.entries.orderBy('date').reverse().toArray();
}
export async function deleteEntry(id) {
    await db.entries.delete(id);
}
