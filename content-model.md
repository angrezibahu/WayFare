## `content-model.md`
```markdown
# WayFare content model — proposal (not yet implemented)
A normalised data model so chapters, sky objects, ground objects, experiments, printables, and deck cards can be authored once and cross-referenced cleanly. Designed to coexist with the existing markdown bodies and the existing unlock resolver.
## Goals
1. Every named entity (chapter, sky object, ground object, experiment, printable, card) has a stable `id`.
2. A single sky object carries all its cross-cultural names ("Ursa Major / Saptarshi / The Plough") in one place — chapters reference it instead of repeating.
3. Cultures and themes become first-class queryable fields, so we can later answer "show me every chapter with a Hindustani thread" or "every science-themed daytime chapter".
4. Source links separate from culture tags; both are structured.
5. Markdown bodies stay markdown — long-form prose isn't trying to be database rows.
6. Backwards-compatible with today's `unlock` rules and the Vite raw-import pipeline.
## Where the data lives (proposed)
content/
├── chapters/ # unchanged — markdown bodies stay here
│ └── <season>/<slug>.md # front-matter extended (see §1)
├── sky-objects.yaml # NEW — single index, all sky bodies
├── ground-objects.yaml # NEW
├── experiments.yaml # NEW — replaces / formalises Try-It blocks
├── printables.yaml # NEW — metadata for the SVG templates
└── challenges/deck.yaml # unchanged shape; ids referenced by experiments

Single-file YAML indexes are recommended for the four new tables: easy to scan, easy to diff, and a thirteen-year-old can edit them.
## 1. Chapter — extended front-matter
```yaml
---
id: orion
title: Orion
season: winter                       # always | winter | spring | summer | autumn
day_or_night: night                  # day | night | either
kind: sky                            # sky | land   (kept; orthogonal to day_or_night)
cultures:                            # closed enum, see §6
  - greek
  - egyptian
  - arabic
  - māori
  - yolŋu                            # paired with referenced_only on the source
themes:                              # closed enum, see §7
  - folktale
  - science
  - language
  - seasonal-clock
  - wayfinding
# Unchanged from today; kept so the existing unlock resolver still works.
unlock:
  season: winter
  prerequisite: moon
  field_trigger:
    any_of:
      - type: sighting_logged
      - type: challenge_completed
        challenge_id: find-orions-belt
# NEW cross-references — all are arrays of ids, validated at build time.
related_sky_objects:
  - orion
  - betelgeuse
  - rigel
  - sirius
  - aldebaran
  - pleiades
  - orion-nebula
related_ground_objects: []
suggested_experiments:
  - belt-to-sirius-sighting
  - name-the-seven-of-orion
  - sketch-the-nebula
follow_up_quests:                    # other chapters this naturally leads to
  - taurus-pleiades
  - canis-major-sirius
# Body either inline (current) or pointer (optional alternative).
body_path: ./orion.md                # default = the file you're in; rarely overridden
# Free-text 'sources' replaced by structured source_links.
source_links:
  - label: "Star Tales — Ian Ridpath"
    url: https://ianridpath.com/startales/
    note: "Cross-cultural mythology, carefully sourced."
  - label: "Australian Indigenous Astronomy"
    url: https://aboriginalastronomy.com.au
    note: "Yolŋu voices direct — start here, do not retell."
    cultures: [yolŋu, aboriginal-australian]
  - label: "Arabic Star Names — Paul Kunitzsch"
    note: "Academic, definitive on star naming."
    cultures: [arabic]
---
Notes:

day_or_night is new and orthogonal to kind. reading-the-sky-by-day becomes kind: sky, day_or_night: day. Most constellation chapters are kind: sky, day_or_night: night. moon is either (it's up at all hours).
unlock is kept as-is so the resolver in app/src/lib/unlock.ts doesn't need to change in this pass.
related_* are pure cross-references; the build validates them.
source_links[] replaces the free-text sources[] array. A short migration script can split today's strings into either cultures[] (for entries like "Greek mythology" or "Yolŋu people of Arnhem Land — referenced, not taught") or a source_links[] entry (for book/site references).
2. sky_objects.yaml
A single object can be a constellation, asterism, star, planet, moon-phase, galaxy, or nebula. Type tells the renderer how to treat it.

sky_objects:
  - id: ursa-major
    type: constellation              # constellation | asterism | star | planet | moon-phase | nebula | galaxy | meteor-shower | dark-cloud
    canonical: Ursa Major
    names:
      - { culture: latin,        name: "Ursa Major",        gloss: "Greater Bear" }
      - { culture: english-folk, name: "The Plough" }
      - { culture: english-folk, name: "The Big Dipper", region: north-america }
      - { culture: hindustani,   name: "Saptarshi",          gloss: "Seven Sages" }
      - { culture: arabic,       name: "Banat Naʿsh",        gloss: "daughters of the bier" }
      - { culture: egyptian,     name: "Meskhetyu",          gloss: "the bull's foreleg" }
      - { culture: mi-kmaq,      name: "the celestial bear hunt", referenced_only: true }
    visibility:
      hemisphere: northern
      circumpolar_above_lat: 41
      best_seasons: [spring, autumn]
    related_sky_objects: [polaris, alcor, mizar, arcturus]
    chapters: [ursa-major]           # back-reference (build-derivable, but explicit is friendlier)

  - id: betelgeuse
    type: star
    canonical: Betelgeuse
    parent: orion                    # the constellation it sits in
    names:
      - { culture: arabic, name: "Yad al-Jauzāʾ", gloss: "hand of the Central One" }
    properties:
      magnitude: 0.5
      colour: red
      distance_ly: 550
    chapters: [orion]

  - id: pleiades
    type: asterism
    parent: taurus
    names:
      - { culture: greek,    name: "The Seven Sisters" }
      - { culture: japanese, name: "Subaru" }
      - { culture: māori,    name: "Matariki", gloss: "small eyes / new-year marker" }
      - { culture: cherokee, name: "Aniʼtsutsa", referenced_only: true }
    chapters: [taurus-pleiades]

  - id: moon-waxing-crescent
    type: moon-phase
    canonical: Waxing Crescent
    properties:
      illumination_range_pct: [1, 49]
      visibility_window: "evening sky, west after sunset"
    chapters: [moon]
Notes:

names[].culture uses the same closed enum as chapter cultures[].
referenced_only: true is the explicit "we name this and link out, we do not retell".
parent lets stars belong to constellations and asterisms belong to constellations.
properties is loose by design — different object types carry different fields.
3. ground_objects.yaml
Trees, tracks, rocks, weather signs, drainage features, human marks, snow features.

ground_objects:
  - id: sastrugi
    type: snow-feature
    canonical: Sastrugi
    short: "Wind-carved ridges on a snow surface; align with prevailing wind."
    names:
      - { culture: russian, name: "sastrugi" }
    related_experiments: [walk-by-the-sastrugi]
    chapters: [snow-ice-and-frost]

  - id: holloway
    type: human-mark
    canonical: Holloway
    short: "A path worn into a sunken hollow by centuries of feet and carts."
    chapters: [reading-terrain]

  - id: oxbow-lake
    type: river-feature
    canonical: Oxbow lake
    short: "A curved pond left when a meander cuts off its own neck."
    chapters: [reading-water]

  - id: cumulonimbus
    type: cloud-genus
    canonical: Cumulonimbus
    names:
      - { culture: latin, name: "Cumulonimbus", gloss: "heap-rain" }
    chapters: [reading-the-sky-by-day]

  - id: tree-lean
    type: living-compass
    canonical: Tree-lean
    short: "Mature exposed trees lean away from the prevailing wind."
    related_experiments: [tree-lean-survey]
    chapters: [landcraft-first-steps, reading-terrain, wind-and-weather]
type is loose enum: cloud-genus | snow-feature | river-feature | human-mark | living-compass | track | rock-feature | tide-feature | weather-sign | terrain-feature.

4. experiments.yaml
The single source of truth for "things to actually do outside". This unifies today's deck cards, in-chapter Stretch list items, and <div class="vibe vibe-try"> blocks. Deck cards become a view over experiments (cards add grade, prompt, fieldbook_prompt); the Try-It blocks in markdown can be replaced by a renderer that includes the experiment by id.

experiments:
  - id: shadow-stick-noon
    title: Shadow Stick at Noon
    short: "Mark a shadow tip, wait fifteen minutes, mark again — west-east line."
    grade: Starter                   # Starter | Core | Stretch
    kind: Land                       # Sky | Land | Story | Error
    day_or_night: day
    duration_minutes: 20
    gear: [stick, two stones]
    requires:
      season: any
      weather: sunny
      hemisphere: any
    cultures: [universal]            # documented Egypt → Polynesia
    provenance: "Universal pre-modern technique."
    related_sky_objects: [sun]
    related_ground_objects: []
    chapters: [landcraft-first-steps]
    deck_card: shadow-stick-at-noon  # back-link; deck.yaml stays as it is
    body_md: |
      Push a stick upright into the ground...

  - id: merkhet-polaris
    title: Polaris by Plumb-Line (after the Egyptian merkhet)
    short: "Suspend a plumb-line, sight Polaris through a slotted card, peg the line."
    grade: Stretch
    kind: Sky
    day_or_night: night
    duration_minutes: 45
    gear: [string, weight, card with slot, two pegs]
    requires:
      season: any
      weather: clear-night
      hemisphere: northern
    cultures: [egyptian]
    related_sky_objects: [polaris, ursa-major]
    chapters: [landcraft-first-steps]

  - id: garden-nilometer
    title: Garden Nilometer
    grade: Stretch
    kind: Land
    day_or_night: either
    cultures: [egyptian]
    related_ground_objects: [stream]
    chapters: [rain-and-running-water]

  - id: tree-lean-survey
    title: The Tree-Lean Survey
    grade: Stretch
    kind: Land
    day_or_night: day
    cultures: [british-folk]
    related_ground_objects: [tree-lean]
    chapters: [reading-terrain, wind-and-weather]
    deck_card: tree-lean-survey
Notes:

requires is enforced at runtime (the PWA can grey out an experiment that needs a clear night when the forecast is solid cloud, etc.) — optional for v1.
deck_card is the bridge: deck cards keep their prompt / fieldbook_prompt / unlocks shape; experiments add the catalog metadata.
An experiment with no deck_card is a pure Try-It block (it appears inside chapter renders but isn't drawable from the deck).
5. printables.yaml
printables:
  - id: title-page
    page_number: 1
    title: Title Page
    svg: ./fieldbook-templates/01-title-page.svg
    fieldbook_section: front-matter
    related_chapters: []
    related_experiments: []

  - id: moon-diary-month
    page_number: 2
    title: Moon Diary — Month
    svg: ./fieldbook-templates/02-moon-diary-month.svg
    fieldbook_section: sky-log
    related_chapters: [moon]
    related_experiments: [moon-diary-week, predict-tomorrow]

  - id: sky-log
    page_number: 3
    title: Sky Log
    svg: ./fieldbook-templates/03-sky-log.svg
    fieldbook_section: sky-log
    related_chapters: [orion, ursa-major, summer-triangle, pegasus-andromeda, cassiopeia, leo, bootes-arcturus, scorpius-antares, milky-way, cygnus-revisited]

  - id: constellation-study
    page_number: 4
    title: Constellation Study
    svg: ./fieldbook-templates/04-constellation-study.svg
    fieldbook_section: sky-log
    related_chapters: [orion, ursa-major, summer-triangle, pegasus-andromeda, cassiopeia]

  - id: landcraft-log
    page_number: 5
    title: Landcraft Log
    svg: ./fieldbook-templates/05-landcraft-log.svg
    fieldbook_section: landcraft

  - id: error-journal
    page_number: 6
    title: Error Journal
    svg: ./fieldbook-templates/06-error-journal.svg
    fieldbook_section: error-journal
    related_experiments: [error-entry]

  - id: story-of-this-place
    page_number: 7
    title: Story of This Place
    svg: ./fieldbook-templates/07-story-of-this-place.svg
    fieldbook_section: story
    related_experiments: [story-of-this-place]

  - id: year-map
    page_number: 8
    title: Year Map
    svg: ./fieldbook-templates/08-year-map.svg
    fieldbook_section: year-map
The build-printables.mjs script can read this file (instead of globbing the SVG dir) so titles, page numbers, and chapter back-links are explicit. SVG is still the source of truth for the artwork.

6. Cultures — closed enum (proposed)
greek, latin, egyptian, arabic, persian, babylonian,
norse, celtic, welsh, irish, scots, english-folk, british-folk,
chinese, japanese, korean,
hindustani, sanskrit,
polynesian, hawaiian, māori,
aboriginal-australian, yolŋu, gamilaraay, boorong,
inuit, mi-kmaq, abenaki, cherokee,
sami, san, finnish, baltic,
universal                         # for techniques attested broadly
Add cultures by PR. referenced_only: true is set per-name (in sky_objects.names[]) or per source link. The point is to make the WAYFARE_PROJECT.md rule machinable: anything tagged referenced_only cannot be retold in the body, only linked out.

7. Themes — closed enum (proposed)
science, language, folktale, history, instrument, safety,
error-curriculum, seasonal-clock, wayfinding, weather,
storytelling, capstone
8. Cross-reference rules (build-time validation)
When the model lands, a small scripts/validate-content.mjs should fail the build on:

A chapter related_sky_objects id missing from sky-objects.yaml.
A chapter suggested_experiments id missing from experiments.yaml.
An experiment deck_card id missing from deck.yaml.
A printable related_chapters / related_experiments id missing.
An unlock.field_trigger.any_of[].challenge_id missing from deck.yaml (this would have caught the 9 dangling references listed in the audit).
A culture value not in the closed enum.
A theme value not in the closed enum.
Validation is fast (single-file YAMLs, ~hundreds of rows total) and cheap to wire into npm run build.

9. Migration sketch (no code yet)
A pragmatic order, smallest blast radius first:

Add the new front-matter fields to chapters with safe defaults (day_or_night derived from current kind + chapter id, cultures: [], themes: [], related_*: [], source_links: [] — the existing sources array stays as a deprecated alias).
Author sky-objects.yaml for the named constellations and the ~30 named stars used in chapters. This is a one-evening backfill if I extract from existing prose.
Author experiments.yaml by lifting every <div class="vibe vibe-try"> block and every Stretch list item out of chapter bodies, plus the existing 33 deck cards. Keep deck.yaml intact.
Author printables.yaml (8 rows). Update build-printables.mjs to read it.
Author ground-objects.yaml last — it's the table that benefits most from a second editorial pass.
Add scripts/validate-content.mjs and wire into CI. Leave it advisory for one release; switch to fail-the-build once the dangling-id list is cleaned up.
Update the PWA only when needed — most of this lands without UI changes. The first user-visible win is "Tonight's Sky" tiles deriving from chapter front-matter instead of the hardcoded FEATURED record.
10. Open questions to resolve before implementation
(Repeated from the audit so this file stands alone.)

day_or_night alongside kind, or replacing it? Recommend alongside.
Keep unlock block unchanged in this pass? Recommend yes.
Cultures and themes: closed enum with PR-to-extend? Recommend yes.
Sibling tables in YAML (one file per kind) or markdown-per-object? Recommend YAML.
Backfill scope for the first PR: schema + worked examples, or full extraction from prose? Recommend schema + a handful of worked examples first, full backfill in a second PR with editorial review.
Should the build fail on dangling ids or only warn? Recommend warn for one release, then fail.
Should experiments fully absorb deck cards (cards become a thin view), or stay parallel with a deck_card link? Recommend the link — keeps deck.yaml editable on its own and avoids touching the deck draw UI.
