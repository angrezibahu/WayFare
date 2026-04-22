# WayFare

*A family apprenticeship in finding your way — by sky, by land, by story.*

-----

## 0. How to read this document

This is the single source of truth for the WayFare project. If you are Claude Code, read the whole thing before touching a file. Everything downstream — repo layout, PWA scope, chapter formatting, tone of voice — is defined here.

WayFare is **analog-first, digital-minimal**. The paper Fieldbook is the real artifact. The PWA is a companion, not the point. If a decision ever pulls toward “more screen time, more features, more engagement loops,” the decision is wrong.

-----

## 1. Manifesto

1. **Wayfinding is an apprenticeship, not a life-hack.** Polynesian navigators crossed the Pacific with no instruments. Aboriginal songlines encode continental-scale navigation as narrative passed down for tens of thousands of years. We treat this body of knowledge with the respect it deserves. No “10 hacks to read the stars” energy anywhere.
1. **Story is the spine.** Humans remember stories, not bullet points. Every chapter opens with a story from a named cultural tradition. Every technique has a provenance note. The Fieldbook has a “Story of This Place” page for every walk.
1. **Honor, don’t appropriate.** We cite traditions. We link to First Nations and Indigenous voices where they exist online. We do not *teach* Songlines, Polynesian wayfinding, or sacred knowledge systems as if they could be learned from an app. We point toward them with respect.
1. **Analog-first.** The paper Fieldbook is where the love lives. Pen, pencil, glue, tape. The PWA is for: checking what’s in the sky tonight, drawing a challenge card, logging an entry, sharing with family. That’s it.
1. **No dopamine loops.** No streaks. No XP bars. No “you’re on fire!” nonsense. This is a slow project. The reward is the sky.
1. **Seasonal, not sequential.** Chapters unlock when the real world makes them relevant — when Orion is actually visible, when the right moon phase arrives. Anticipation is part of the teaching.
1. **Error is the curriculum.** The Error Journal is a first-class feature. Real navigators get good by logging mistakes, not wins.
1. **Family-shaped.** Kids can contribute at any age. At 8 they draw. At 13 they write. At 25 they maintain the repo. The living document is the heirloom.

-----

## 2. What WayFare Is (the artifacts)

- **The Fieldbook** — a printable paper book of templates the family fills in by hand over a year. Expands yearly.
- **The Challenge Deck** — printable cards (also browseable in the PWA) pulled at random or chosen. Real-world tasks, most require leaving the house.
- **The Chapter Library** — markdown chapters, each one a sky body or landcraft skill. Some always unlocked, some gated by season and field triggers.
- **The PWA** — offline-first, rudely minimal, four screens, no accounts.
- **The Repo** — version-controlled so the kids can literally commit to it over the years. The commit history *is* the family record.

-----

## 3. The Curriculum — Year One

### Always unlocked

- **The Moon.** Gateway. Draw it for a month, learn the phases, navigate by it.
- **Landcraft: First Steps.** Sun direction, shadow-stick, watch-as-compass, water flow, moss myth-busting.
- **Rules of the Countryside / Road.** UK Countryside Code, basic road safety, right-to-roam, leave-no-trace.
- **Reading Water.** Streams, drainage, coasts, tides — the water side of wayfaring.
- **Reading Terrain.** Slope, aspect, contour, vegetation, human marks; ridge-and-valley thinking.
- **Reading the Sky by Day.** Cloud naming (Howard), haloes, birds, smoke — weather from the sky itself.

### Winter (roughly Dec–Feb in Northern Hemisphere)

- **Orion** — hero chapter. Rich cross-cultural storytelling.
- **Taurus & the Pleiades** (unlocked via Orion) — because Orion’s Belt points to Aldebaran.
- **Canis Major & Sirius** — brightest star in the sky, and the Egyptian Nile calendar.
- **Snow, Ice and Frost** (day) — tracks, thin ice, frost hollows, winter safety.

### Spring (Mar–May)

- **Ursa Major (the Plough)** — the always-there anchor in UK skies; Polaris, the pole star, finding true north.
- **Leo** — reading seasonal clocks.
- **Boötes & Arcturus** — “follow the arc to Arcturus.”
- **Rain and Running Water** (day) — swelling streams, rainbow geometry, petrichor, flood safety.

### Summer (Jun–Aug)

- **The Summer Triangle** — Vega (Lyra), Deneb (Cygnus), Altair (Aquila). Dense with story.
- **Scorpius & Antares** — low on the southern horizon; the mythic counterweight to Orion.
- **The Milky Way** — dark-sky pilgrimage capstone.
- **The Sun at its Height** (day) — solstice, shortest shadows, Eratosthenes, heat-craft.

### Autumn (Sep–Nov)

- **Pegasus & Andromeda** — and the galaxy you can see with your naked eye.
- **Cassiopeia** — the W; the second great navigational anchor alongside the Plough.
- **Cygnus revisited** — crossing into autumn.
- **Wind and Weather** (day) — the Shipping Forecast, named winds, Beaufort, fronts.

### Landcraft threads (woven through all seasons)

- **Sun Clock & Shadow Stick** — tell time and direction from any stick.
- **Reading Water** — streams, drainage, coastal safety.
- **Reading Terrain** — contour lines, prevailing wind, tree lean.
- **Dead Reckoning** — pace-count, bearing, time.
- **The No-North Week** — compass banned, directions by landmark only.
- **Graduated Disorientation** — blindfold garden walk, park-corner puzzle, hometown-unknown challenge.
- **The Error Journal** — monthly prompt.

### Capstone events (one per season)

- **Winter:** Family night walk under Orion with hot drinks and the Orion stories read aloud.
- **Spring:** Find Polaris and verify it with a compass.
- **Summer:** Dark-sky pilgrimage (Galloway, Exmoor, Brecon, Snowdonia, Kielder — pick one).
- **Autumn:** Naked-eye spot Andromeda Galaxy — the furthest thing you can see without a lens.

-----

## 4. Chapter Template

Every chapter follows the same five-part arc:

1. **Story** — an opening tale from a named cultural tradition. Written to be read aloud.
1. **Sky** (or **Land**) — how to actually find it. Plain-language, family-readable.
1. **Science** — what’s actually there. Chosen wow-facts, not an encyclopedia.
1. **Skill** — the practical navigation use. How humans have used this to know where they are.
1. **Stretch** — 2–4 challenges that earn a Fieldbook entry.

Each chapter ends with a **Further** section: books, credible links, First Nations / Indigenous voices to read directly where relevant.

Front-matter (YAML) for each chapter:

```yaml
---
id: orion
title: Orion
kind: sky
season: winter
unlock:
  always: false
  season: winter
  prerequisite: moon
  field_trigger:
    any_of:
      - type: sighting_logged
      - type: challenge_completed
        challenge_id: find-orions-belt
sources:
  - Greek mythology
  - Ancient Egyptian (Sah / Osiris)
  - Yolŋu people of Arnhem Land (Australia) — referenced, not taught
  - Arabic astronomy (star naming)
  - Māori (Tautoru)
---
```

-----

## 5. Chapter: The Moon (always unlocked)

See `content/chapters/always/moon.md`.

-----

## 6. Chapter: Orion (winter hero)

See `content/chapters/winter/orion.md`.

-----

## 7. The Challenge Deck

See `content/challenges/deck.yaml` for the 20-card starter deck.

**Card format:**

```
Title
Grade: Starter | Core | Stretch
Kind: Sky | Land | Story | Error
Provenance: (where this technique or idea comes from)
Time / gear needed
The prompt itself
Fieldbook prompt
```

-----

## 8. The Fieldbook (paper)

Printable PDFs in `/printables/`. Designed to be printed on standard A4, hole-punched, and kept in a cheap ring binder so it expands.

**Template pages (ship on day one):**

- **Title page**
- **Moon Diary Month**
- **Sky Log page**
- **Constellation Study page**
- **Landcraft Log page**
- **Error Journal page**
- **Story of This Place page**
- **Year Map**

All templates are clean, uncluttered, with hand-drawn-looking line work. No clipart. No emojis. Leave room for the family’s own marks.

-----

## 9. Landcraft Threads (the day side, in more detail)

- **Sun Clock & Shadow Stick.**
- **Reading Water.**
- **Reading Terrain.**
- **Dead Reckoning.**
- **The No-North Week.**
- **Graduated Disorientation.**
- **The Error Journal.**
- **Rules of the Countryside and Road.**

-----

## 10. Storytelling Principles

1. **Every chapter opens with story.** Not a fact. Not a definition. A story, named to its tradition.
1. **Every named star gets its Arabic name explained** where relevant.
1. **Greek myth is not the default sky.** Give Greek, then give at least two others.
1. **Don’t retell Indigenous stories as if they were ours.** Name the people. Link to their voices where they exist online.
1. **Local British / Celtic / Gaelic / Welsh traditions count.**
1. **Oral reading is a first-class activity.**
1. **Never invent.**

-----

## 11. Repo Structure

```
wayfare/
├── README.md
├── WAYFARE_PROJECT.md        (this file — the source of truth)
├── CONTRIBUTING.md           (how the family adds to the repo)
├── content/
│   ├── chapters/
│   │   ├── always/
│   │   │   ├── moon.md
│   │   │   ├── landcraft-first-steps.md
│   │   │   └── rules-of-road-and-country.md
│   │   ├── winter/
│   │   │   ├── orion.md
│   │   │   ├── taurus-pleiades.md
│   │   │   └── canis-major-sirius.md
│   │   ├── spring/
│   │   ├── summer/
│   │   └── autumn/
│   ├── challenges/
│   │   └── deck.yaml          (card data)
│   └── fieldbook-templates/   (source SVGs / Markdown → PDF)
├── printables/                (generated PDFs, gitignored or checked in — your call)
├── app/                       (the PWA)
├── scripts/
│   └── build-printables.mjs   (generate PDFs from templates)
└── .github/
    └── workflows/
```

-----

## 12. The PWA Spec

### Stack

- **Vite + React** — pure client PWA.
- **PWA with a service worker**, offline-first.
- **IndexedDB via Dexie** for local data. No backend.
- **No accounts.** Just a “family handle” typed once, stored locally.
- **Chapters are loaded from the `content/chapters/` markdown files** at build time.

### The Four Screens

1. **Tonight’s Sky.**
1. **Chapters.**
1. **Challenges.**
1. **Fieldbook.**

### Unlock Logic

A chapter is unlocked if **all** of its `unlock` conditions are satisfied. Computed client-side from the local Fieldbook log.

### What the PWA does NOT do

- No streaks, XP, levels, push notifications, accounts, auth, social features, analytics, in-app sky map, AI summaries.

### What the PWA should do well

- Work offline completely after first load.
- Serif body type, generous margins, cream background.
- Render markdown chapters beautifully.
- Print cleanly to A4.

-----

## 13. Day One Build Order

1. Create the repo scaffold per §11.
1. Write `README.md` as a short, warm introduction to the family.
1. Write `CONTRIBUTING.md`.
1. Drop the two complete chapters (Moon, Orion).
1. Create `content/challenges/deck.yaml` with the 20 starter cards.
1. Create `content/fieldbook-templates/`.
1. Write `scripts/build-printables.mjs`.
1. Scaffold the PWA in `/app/`.
1. Build the four screens.
1. Implement the unlock-logic resolver as a pure function.
1. Wire up markdown rendering of chapters.
1. Ship with a working day-one family experience.

### Rules during build

- **Ask a question only if the spec is genuinely ambiguous.**
- **If a feature is tempting but not in this document, don’t add it.** Write the suggestion into a `FUTURE.md`.
- **Never invent cultural stories.**
- **Commit often, with human-readable messages.**

-----

## 14. A last note

If you’re a future kid reading this because a parent handed you the repo: hello. Go outside. The sky is free.
