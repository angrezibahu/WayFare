import { useEffect, useState, useCallback } from 'react';

const LAST_NIGHT_KEY = 'wayfare_last_night_chapter';
const QUEST_STATE_KEY = 'wayfare_quest_state';

export interface LastNightChapter {
  id: string;
  title: string;
  opened_at: string;
}

type QuestState = Record<string, Record<string, boolean>>;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage may be unavailable (private mode, quota); ignore.
  }
}

export function recordNightChapterOpened(id: string, title: string): void {
  const entry: LastNightChapter = {
    id,
    title,
    opened_at: new Date().toISOString(),
  };
  writeJson(LAST_NIGHT_KEY, entry);
  notifyChange();
}

export function readLastNightChapter(): LastNightChapter | null {
  return readJson<LastNightChapter | null>(LAST_NIGHT_KEY, null);
}

export function readQuestChecked(chapterId: string, questKey: string): boolean {
  const state = readJson<QuestState>(QUEST_STATE_KEY, {});
  return state[chapterId]?.[questKey] === true;
}

export function setQuestChecked(chapterId: string, questKey: string, checked: boolean): void {
  const state = readJson<QuestState>(QUEST_STATE_KEY, {});
  const chapter = state[chapterId] ?? {};
  if (checked) {
    chapter[questKey] = true;
  } else {
    delete chapter[questKey];
  }
  if (Object.keys(chapter).length === 0) {
    delete state[chapterId];
  } else {
    state[chapterId] = chapter;
  }
  writeJson(QUEST_STATE_KEY, state);
  notifyChange();
}

export function readChapterQuestState(chapterId: string): Record<string, boolean> {
  const state = readJson<QuestState>(QUEST_STATE_KEY, {});
  return state[chapterId] ?? {};
}

const listeners = new Set<() => void>();

function notifyChange(): void {
  for (const cb of listeners) cb();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === LAST_NIGHT_KEY || e.key === QUEST_STATE_KEY) cb();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

export function useLastNightChapter(): LastNightChapter | null {
  const [value, setValue] = useState<LastNightChapter | null>(() => readLastNightChapter());
  useEffect(() => subscribe(() => setValue(readLastNightChapter())), []);
  return value;
}

export function useChapterQuestState(chapterId: string): {
  checked: Record<string, boolean>;
  toggle: (questKey: string) => void;
} {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    readChapterQuestState(chapterId)
  );
  useEffect(
    () => subscribe(() => setChecked(readChapterQuestState(chapterId))),
    [chapterId]
  );
  const toggle = useCallback(
    (questKey: string) => {
      const current = readQuestChecked(chapterId, questKey);
      setQuestChecked(chapterId, questKey, !current);
    },
    [chapterId]
  );
  return { checked, toggle };
}

export function questKey(index: number, kind: string): string {
  return `${index}:${kind}`;
}
