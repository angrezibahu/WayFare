export type Season = 'always' | 'winter' | 'spring' | 'summer' | 'autumn';
export type ChapterKind = 'sky' | 'land';
export type CardGrade = 'Starter' | 'Core' | 'Stretch';
export type CardKind = 'Sky' | 'Land' | 'Story' | 'Error';

export interface FieldTrigger {
  type: 'sighting_logged' | 'challenge_completed';
  challenge_id?: string;
}

export interface UnlockRules {
  always?: boolean;
  season?: Season;
  prerequisite?: string;
  field_trigger?: {
    any_of?: FieldTrigger[];
    all_of?: FieldTrigger[];
  };
}

export type FollowUpQuestKind = 'sky' | 'ground' | 'story';

export interface FollowUpQuest {
  kind: FollowUpQuestKind;
  text: string;
  auto_generated?: boolean;
}

export interface ChapterMeta {
  id: string;
  title: string;
  kind: ChapterKind;
  season: Season;
  unlock?: UnlockRules;
  sources?: string[];
  follow_up_quests?: FollowUpQuest[];
}

export interface Chapter extends ChapterMeta {
  body: string;
}

export interface ChallengeCard {
  id: string;
  title: string;
  grade: CardGrade;
  kind: CardKind;
  provenance: string;
  time?: string;
  prompt: string;
  fieldbook_prompt?: string;
  unlocks?: string[];
}

export interface FieldbookEntry {
  /** Primary key, auto-assigned by Dexie. */
  id?: number;
  /** ISO date string, e.g. 2026-01-12T20:30:00.000Z. */
  date: string;
  /** Free text. */
  body: string;
  /** Optional author handle. */
  author?: string;
  /** Optional chapter id this entry is about (sighting or study). */
  chapter_id?: string;
  /** Optional challenge card this entry completes. */
  challenge_id?: string;
  /** Tags, e.g. ['sighting', 'winter']. */
  tags?: string[];
}

export interface FamilySettings {
  handle?: string;
  latitude?: number;
  longitude?: number;
  /** 'northern' | 'southern' — affects seasonal unlocks. */
  hemisphere?: 'northern' | 'southern';
}

export type ExperimentGrade = 'Starter' | 'Core' | 'Stretch';
export type ExperimentKind = 'Sky' | 'Land' | 'Story' | 'Error';
export type DayOrNight = 'day' | 'night' | 'either';

export interface ExperimentRequires {
  season?: string;
  weather?: string;
  hemisphere?: string;
}

export interface Experiment {
  id: string;
  title: string;
  short?: string;
  grade: ExperimentGrade;
  kind: ExperimentKind;
  day_or_night: DayOrNight;
  duration_minutes?: number;
  gear?: string[];
  requires?: ExperimentRequires;
  cultures?: string[];
  provenance?: string;
  related_sky_objects?: string[];
  related_ground_objects?: string[];
  chapters?: string[];
  deck_card?: string;
  body_md?: string;
}
