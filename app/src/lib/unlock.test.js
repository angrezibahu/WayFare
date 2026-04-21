import { describe, it, expect } from 'vitest';
import { currentSeason, resolveUnlock } from './unlock';
const moonChapter = {
    id: 'moon',
    title: 'The Moon',
    kind: 'sky',
    season: 'always',
    unlock: { always: true },
};
const orionChapter = {
    id: 'orion',
    title: 'Orion',
    kind: 'sky',
    season: 'winter',
    unlock: {
        season: 'winter',
        prerequisite: 'moon',
        field_trigger: {
            any_of: [
                { type: 'sighting_logged' },
                { type: 'challenge_completed', challenge_id: 'find-orions-belt' },
            ],
        },
    },
};
function entry(patch) {
    return {
        date: '2026-01-15T20:00:00.000Z',
        body: '',
        ...patch,
    };
}
describe('currentSeason', () => {
    it('returns winter for January in Northern Hemisphere', () => {
        expect(currentSeason(new Date('2026-01-15'), 'northern')).toBe('winter');
    });
    it('returns summer for January in Southern Hemisphere', () => {
        expect(currentSeason(new Date('2026-01-15'), 'southern')).toBe('summer');
    });
    it('returns autumn for October in Northern Hemisphere', () => {
        expect(currentSeason(new Date('2026-10-15'), 'northern')).toBe('autumn');
    });
});
describe('resolveUnlock', () => {
    const winter = new Date('2026-01-15');
    const summer = new Date('2026-07-15');
    it('unlocks always-unlocked chapters', () => {
        const r = resolveUnlock(moonChapter, {
            now: winter,
            hemisphere: 'northern',
            entries: [],
        });
        expect(r.unlocked).toBe(true);
    });
    it('locks a winter chapter in summer', () => {
        const r = resolveUnlock(orionChapter, {
            now: summer,
            hemisphere: 'northern',
            entries: [entry({ chapter_id: 'moon' }), entry({ challenge_id: 'find-orions-belt' })],
        });
        expect(r.unlocked).toBe(false);
        expect(r.reason).toMatch(/Winter/);
    });
    it('locks Orion without a Moon entry', () => {
        const r = resolveUnlock(orionChapter, {
            now: winter,
            hemisphere: 'northern',
            entries: [entry({ challenge_id: 'find-orions-belt' })],
        });
        expect(r.unlocked).toBe(false);
        expect(r.reason).toMatch(/moon/);
    });
    it('locks Orion without a field trigger', () => {
        const r = resolveUnlock(orionChapter, {
            now: winter,
            hemisphere: 'northern',
            entries: [entry({ chapter_id: 'moon' })],
        });
        expect(r.unlocked).toBe(false);
        expect(r.reason).toMatch(/sighting|challenge/);
    });
    it('unlocks Orion when season, prereq, and challenge are satisfied', () => {
        const r = resolveUnlock(orionChapter, {
            now: winter,
            hemisphere: 'northern',
            entries: [
                entry({ chapter_id: 'moon' }),
                entry({ challenge_id: 'find-orions-belt' }),
            ],
        });
        expect(r.unlocked).toBe(true);
    });
    it('unlocks Orion when a generic sighting entry is logged', () => {
        const r = resolveUnlock(orionChapter, {
            now: winter,
            hemisphere: 'northern',
            entries: [
                entry({ chapter_id: 'moon' }),
                entry({ tags: ['sighting'] }),
            ],
        });
        expect(r.unlocked).toBe(true);
    });
});
