# Contributing to WayFare

This is a family heirloom first, a software project second. The rules below are for keeping it that way.

## Who this is for

- Family members of any age. An eight-year-old can add a drawing. A thirteen-year-old can write a chapter. An adult can ship a release.
- Friends of the family who want to point us at better sources.
- Future generations — the commit log is a record of who was here.

Write commits in plain English. They should read well in twenty years.

## How to add a Fieldbook entry

You can do this on paper, in the app, or by committing markdown straight to this repo.

If you commit it:

1. Create a file under `fieldbook/YYYY/MM/your-entry.md`.
1. Front-matter like this:

   ```yaml
   ---
   date: 2026-01-12
   author: Noor
   linked: orion          # chapter id, or a challenge id
   tags: [sighting, winter]
   ---
   ```

1. Then the entry itself — words, sketches (link to an image in `fieldbook/assets/`), anything.

Commit message: `fieldbook: Noor logs first Orion sighting`.

## How to add a new chapter

1. Pick the season folder under `content/chapters/`.
1. Use the front-matter shape shown in `WAYFARE_PROJECT.md` §4.
1. Follow the five-part arc: Story → Sky/Land → Science → Skill → Stretch. End with a `Further` section.
1. **Source every story.** If you can’t name the tradition, don’t write the story. Leave a `<!-- NEEDS SOURCING -->` comment and move on.
1. **Do not retell Indigenous or First Nations stories as if they were ours.** Name the people, link to their voices, and stop.
1. Add the chapter to `content/chapters/index.ts` if it isn’t auto-discovered.

## How to add a new challenge

1. Open `content/challenges/deck.yaml`.
1. Follow the shape of the cards already there: `id`, `title`, `grade`, `kind`, `provenance`, `time`, `prompt`, `fieldbook_prompt`.
1. If the card unlocks a chapter, add the card’s `id` to that chapter’s `unlock.field_trigger`.

## How to add a Fieldbook template

1. SVG, A4, 210×297mm. Black line work only, no colour, no clipart.
1. Drop it into `content/fieldbook-templates/`.
1. Run `node scripts/build-printables.mjs` to regenerate `printables/`.

## Things we don’t do

- No streaks, XP bars, levels, push notifications, analytics, accounts, or social features in the app.
- No in-app sky map. We link to Stellarium.
- No AI chatbot features in the app.
- No emoji UI. No neon. Serif body type, cream background, generous margins.
- No inventing cultural stories. Ever.

If you’re tempted to add something that isn’t in `WAYFARE_PROJECT.md`, put it in `FUTURE.md` instead.

## Branching & commits

- Branch off `main` for any non-trivial change.
- Commit messages should read like a family letter, not a changelog. `fix typo in orion belt description` is fine; `chore(content): update orion.md` is not.
- Pull requests are welcome from family. Friends too.

## Code style

- The app is Vite + React + TypeScript. Dexie for storage.
- Small functions, plain types, no clever tricks. A thirteen-year-old should be able to read this in a year.
- Tests for the unlock-logic resolver (see `app/src/lib/unlock.test.ts`). Elsewhere, use judgement.

## A reminder

The paper Fieldbook is the artifact. The app is a companion. When in doubt, close the laptop and go outside.
