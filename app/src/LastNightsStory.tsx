import { Link } from 'react-router-dom';
import { chapterById } from './lib/content';
import {
  useChapterQuestState,
  useLastNightChapter,
  questKey,
} from './lib/quests';
import type { FollowUpQuest } from './lib/types';

const KIND_LABEL: Record<FollowUpQuest['kind'], string> = {
  sky: 'Sky',
  ground: 'Ground',
  story: 'Story',
};

export function LastNightsStory() {
  const last = useLastNightChapter();
  const chapter = last ? chapterById(last.id) : undefined;
  const quests = chapter?.follow_up_quests ?? [];
  const { checked, toggle } = useChapterQuestState(last?.id ?? '');

  if (!last || !chapter) return null;

  const total = quests.length;
  const done = quests.reduce(
    (n, q, i) => (checked[questKey(i, q.kind)] ? n + 1 : n),
    0
  );

  return (
    <aside className="last-night-strip" aria-label="Last night's story">
      <div className="last-night-head">
        <span className="last-night-eyebrow">Last night's story</span>
        <Link to={`/chapters/${last.id}`} className="last-night-title">
          {chapter.title}
        </Link>
        {total > 0 ? (
          <span className="muted small">
            {done} of {total} done
          </span>
        ) : null}
      </div>
      {total > 0 ? (
        <ul className="quest-list compact">
          {quests.map((q, i) => {
            const key = questKey(i, q.kind);
            const isChecked = checked[key] === true;
            return (
              <li key={key} className={`quest-item${isChecked ? ' checked' : ''}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(key)}
                  />
                  <span className="quest-kind">{KIND_LABEL[q.kind]}</span>
                  <span className="quest-text">{q.text}</span>
                </label>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="muted small">No quests on this one — open the chapter to read it again.</p>
      )}
    </aside>
  );
}
