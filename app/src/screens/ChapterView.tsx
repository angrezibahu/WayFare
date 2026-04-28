import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { chapterById } from '../lib/content';
import { resolveUnlock } from '../lib/unlock';
import { useEntries } from '../lib/useEntries';
import { useSettings } from '../lib/useSettings';
import { useDayNight } from '../lib/useDayNight';
import { recordNightChapterOpened } from '../lib/quests';
import { TomorrowsQuest } from '../TomorrowsQuest';

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'class'],
  },
};

export default function ChapterView() {
  const { id } = useParams();
  const chapter = id ? chapterById(id) : undefined;
  const entries = useEntries();
  const { settings } = useSettings();
  const mode = useDayNight();

  useEffect(() => {
    if (!chapter || chapter.kind !== 'sky') return;
    if (mode !== 'night') return;
    recordNightChapterOpened(chapter.id, chapter.title);
  }, [chapter, mode]);

  if (!chapter) {
    return (
      <div>
        <p className="muted">No such chapter.</p>
        <p><Link to="/chapters">Back to chapters</Link></p>
      </div>
    );
  }

  const status = resolveUnlock(chapter, {
    now: new Date(),
    hemisphere: settings.hemisphere ?? 'northern',
    entries,
  });

  if (!status.unlocked) {
    return (
      <div>
        <p className="muted"><Link to="/chapters">← all chapters</Link></p>
        <h1>{chapter.title}</h1>
        <div className="callout">
          <strong>Locked.</strong> {status.reason}
        </div>
      </div>
    );
  }

  return (
    <article className="prose">
      <p className="muted small"><Link to="/chapters">← all chapters</Link></p>
      <h1>{chapter.title}</h1>
      {chapter.sources && chapter.sources.length > 0 ? (
        <p className="muted small italic">
          Sources: {chapter.sources.join('; ')}.
        </p>
      ) : null}
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}>{chapter.body}</ReactMarkdown>
      {chapter.kind === 'sky' && chapter.follow_up_quests && chapter.follow_up_quests.length > 0 ? (
        <TomorrowsQuest chapterId={chapter.id} quests={chapter.follow_up_quests} />
      ) : null}
      <hr />
      <div className="toolbar">
        <Link to="/fieldbook"><button type="button">Add a Fieldbook entry</button></Link>
        <button type="button" onClick={() => window.print()}>Print this chapter</button>
      </div>
    </article>
  );
}
