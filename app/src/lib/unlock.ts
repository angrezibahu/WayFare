import type {
  Chapter,
  ChapterMeta,
  FieldbookEntry,
  FieldTrigger,
  Season,
  UnlockRules,
} from './types';

export interface UnlockContext {
  /** The date used to compute "current season". Defaults to today. */
  now: Date;
  /** Northern or southern seasons. Defaults to northern. */
  hemisphere: 'northern' | 'southern';
  /** All Fieldbook entries, used to evaluate prerequisites and field triggers. */
  entries: FieldbookEntry[];
}

export interface UnlockStatus {
  unlocked: boolean;
  /** A plain-English explanation of what's still required, if locked. */
  reason?: string;
}

/**
 * Compute the current season for a given date in a hemisphere.
 *
 * Northern:
 *   winter: Dec, Jan, Feb
 *   spring: Mar, Apr, May
 *   summer: Jun, Jul, Aug
 *   autumn: Sep, Oct, Nov
 * Southern hemisphere is the opposite.
 */
export function currentSeason(date: Date, hemisphere: 'northern' | 'southern' = 'northern'): Season {
  const m = date.getMonth(); // 0-11
  const north: Season =
    m === 11 || m <= 1 ? 'winter' :
    m <= 4 ? 'spring' :
    m <= 7 ? 'summer' :
    'autumn';
  if (hemisphere === 'northern') return north;
  const flip: Record<Season, Season> = {
    always: 'always',
    winter: 'summer',
    spring: 'autumn',
    summer: 'winter',
    autumn: 'spring',
  };
  return flip[north];
}

function seasonLabel(s: Season): string {
  if (s === 'always') return 'any time';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fieldTriggerSatisfied(trigger: FieldTrigger, entries: FieldbookEntry[]): boolean {
  if (trigger.type === 'sighting_logged') {
    return entries.some((e) => (e.tags ?? []).includes('sighting'));
  }
  if (trigger.type === 'challenge_completed') {
    return entries.some((e) => e.challenge_id && e.challenge_id === trigger.challenge_id);
  }
  return false;
}

function evaluateFieldTrigger(rules: UnlockRules['field_trigger'], entries: FieldbookEntry[]): boolean {
  if (!rules) return true;
  if (rules.all_of && rules.all_of.length > 0) {
    return rules.all_of.every((t) => fieldTriggerSatisfied(t, entries));
  }
  if (rules.any_of && rules.any_of.length > 0) {
    return rules.any_of.some((t) => fieldTriggerSatisfied(t, entries));
  }
  return true;
}

export function resolveUnlock(chapter: ChapterMeta, ctx: UnlockContext): UnlockStatus {
  const rules = chapter.unlock;
  if (!rules || rules.always) return { unlocked: true };

  // Season check
  if (rules.season && rules.season !== 'always') {
    const season = currentSeason(ctx.now, ctx.hemisphere);
    if (season !== rules.season) {
      return {
        unlocked: false,
        reason: `Unlocks in ${seasonLabel(rules.season)} — it is ${seasonLabel(season)} now.`,
      };
    }
  }

  // Prerequisite check: at least one entry linked to the prerequisite chapter
  if (rules.prerequisite) {
    const hasEntry = ctx.entries.some((e) => e.chapter_id === rules.prerequisite);
    if (!hasEntry) {
      return {
        unlocked: false,
        reason: `Unlocks once you&rsquo;ve logged a Fieldbook entry for ${rules.prerequisite}.`
          .replace('&rsquo;', '’'),
      };
    }
  }

  // Field trigger check
  if (!evaluateFieldTrigger(rules.field_trigger, ctx.entries)) {
    return {
      unlocked: false,
      reason: 'Unlocks when a related sighting or challenge is logged in the Fieldbook.',
    };
  }

  return { unlocked: true };
}

export function resolveAll(
  chapters: Chapter[],
  ctx: UnlockContext
): Record<string, UnlockStatus> {
  const out: Record<string, UnlockStatus> = {};
  for (const c of chapters) out[c.id] = resolveUnlock(c, ctx);
  return out;
}
