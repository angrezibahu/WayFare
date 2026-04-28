import yaml from 'js-yaml';
import { parseFrontMatter } from './frontmatter';
import type {
  Chapter,
  ChapterMeta,
  ChallengeCard,
  FollowUpQuest,
  FollowUpQuestKind,
} from './types';

// Eager-import all markdown chapters from ../../content/chapters/**/*.md as raw text.
// Vite resolves these at build time so the PWA is self-contained.
const chapterFiles = import.meta.glob('../../../content/chapters/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

// Deck, loaded as raw YAML text.
const deckFiles = import.meta.glob('../../../content/challenges/deck.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const QUEST_KINDS: readonly FollowUpQuestKind[] = ['sky', 'ground', 'story'];

function normaliseFollowUpQuests(input: unknown, path: string): FollowUpQuest[] | undefined {
  if (input == null) return undefined;
  if (!Array.isArray(input)) {
    console.warn('Chapter follow_up_quests must be an array:', path);
    return undefined;
  }
  const out: FollowUpQuest[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== 'object') continue;
    const obj = raw as Record<string, unknown>;
    const kind = obj.kind;
    const text = obj.text;
    if (typeof kind !== 'string' || !QUEST_KINDS.includes(kind as FollowUpQuestKind)) {
      console.warn(`Skipping follow_up_quest with unknown kind in ${path}:`, kind);
      continue;
    }
    if (typeof text !== 'string' || !text.trim()) continue;
    out.push({
      kind: kind as FollowUpQuestKind,
      text: text.trim(),
      auto_generated: obj.auto_generated === true,
    });
  }
  return out.length > 0 ? out : undefined;
}

function parseChapter(raw: string, path: string): Chapter | null {
  const { data, content } = parseFrontMatter<Partial<ChapterMeta> & { follow_up_quests?: unknown }>(raw);
  if (!data || !data.id || !data.title) {
    console.warn('Skipping chapter missing id/title:', path);
    return null;
  }
  return {
    id: data.id,
    title: data.title,
    kind: (data.kind ?? 'sky') as ChapterMeta['kind'],
    season: (data.season ?? 'always') as ChapterMeta['season'],
    unlock: data.unlock,
    sources: data.sources ?? [],
    follow_up_quests: normaliseFollowUpQuests(data.follow_up_quests, path),
    body: content.trim() + '\n',
  };
}

let _chaptersCache: Chapter[] | null = null;
export function allChapters(): Chapter[] {
  if (_chaptersCache) return _chaptersCache;
  const list: Chapter[] = [];
  for (const [path, raw] of Object.entries(chapterFiles)) {
    const ch = parseChapter(raw, path);
    if (ch) list.push(ch);
  }
  // Stable, readable order: always first, then by season order, then by title.
  const seasonOrder = ['always', 'winter', 'spring', 'summer', 'autumn'];
  list.sort((a, b) => {
    const s = seasonOrder.indexOf(a.season) - seasonOrder.indexOf(b.season);
    if (s !== 0) return s;
    return a.title.localeCompare(b.title);
  });
  _chaptersCache = list;
  return list;
}

export function chapterById(id: string): Chapter | undefined {
  return allChapters().find((c) => c.id === id);
}

let _deckCache: ChallengeCard[] | null = null;
export function allCards(): ChallengeCard[] {
  if (_deckCache) return _deckCache;
  const raw = Object.values(deckFiles)[0];
  if (!raw) {
    _deckCache = [];
    return _deckCache;
  }
  const doc = yaml.load(raw) as { cards?: ChallengeCard[] } | null;
  _deckCache = doc?.cards ?? [];
  return _deckCache;
}

export function cardById(id: string): ChallengeCard | undefined {
  return allCards().find((c) => c.id === id);
}
