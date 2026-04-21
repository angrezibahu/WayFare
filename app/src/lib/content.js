import yaml from 'js-yaml';
import { parseFrontMatter } from './frontmatter';
// Eager-import all markdown chapters from ../../content/chapters/**/*.md as raw text.
// Vite resolves these at build time so the PWA is self-contained.
const chapterFiles = import.meta.glob('../../../content/chapters/**/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
});
// Deck, loaded as raw YAML text.
const deckFiles = import.meta.glob('../../../content/challenges/deck.yaml', {
    eager: true,
    query: '?raw',
    import: 'default',
});
function parseChapter(raw, path) {
    const { data, content } = parseFrontMatter(raw);
    if (!data || !data.id || !data.title) {
        console.warn('Skipping chapter missing id/title:', path);
        return null;
    }
    return {
        id: data.id,
        title: data.title,
        kind: (data.kind ?? 'sky'),
        season: (data.season ?? 'always'),
        unlock: data.unlock,
        sources: data.sources ?? [],
        body: content.trim() + '\n',
    };
}
let _chaptersCache = null;
export function allChapters() {
    if (_chaptersCache)
        return _chaptersCache;
    const list = [];
    for (const [path, raw] of Object.entries(chapterFiles)) {
        const ch = parseChapter(raw, path);
        if (ch)
            list.push(ch);
    }
    // Stable, readable order: always first, then by season order, then by title.
    const seasonOrder = ['always', 'winter', 'spring', 'summer', 'autumn'];
    list.sort((a, b) => {
        const s = seasonOrder.indexOf(a.season) - seasonOrder.indexOf(b.season);
        if (s !== 0)
            return s;
        return a.title.localeCompare(b.title);
    });
    _chaptersCache = list;
    return list;
}
export function chapterById(id) {
    return allChapters().find((c) => c.id === id);
}
let _deckCache = null;
export function allCards() {
    if (_deckCache)
        return _deckCache;
    const raw = Object.values(deckFiles)[0];
    if (!raw) {
        _deckCache = [];
        return _deckCache;
    }
    const doc = yaml.load(raw);
    _deckCache = doc?.cards ?? [];
    return _deckCache;
}
export function cardById(id) {
    return allCards().find((c) => c.id === id);
}
