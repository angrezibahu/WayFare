import type { FollowUpQuest } from './lib/types';
import { useChapterQuestState, questKey } from './lib/quests';

const KIND_LABEL: Record<FollowUpQuest['kind'], string> = {
  sky: 'Sky',
  ground: 'Ground',
  story: 'Story',
};

export function TomorrowsQuest({
  chapterId,
  quests,
}: {
  chapterId: string;
  quests: FollowUpQuest[];
}) {
  const { checked, toggle } = useChapterQuestState(chapterId);
  if (!quests || quests.length === 0) return null;

  return (
    <aside className="quest-panel" aria-label="Tomorrow's Quest">
      <div className="quest-header">
        <span className="quest-eyebrow">Tomorrow's Quest</span>
        <p className="muted small">
          Three small things to carry from this chapter into the next day or the next clear sky.
        </p>
      </div>
      <ul className="quest-list">
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
    </aside>
  );
}
