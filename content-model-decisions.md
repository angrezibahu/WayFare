# Content-model open questions — agreed answers

Answers to the seven numbered open questions in `content-model.md § 10`.

---

**1. `day_or_night` alongside `kind`, or replacing it?**

Keep both. They are orthogonal axes: `kind` describes what the object *is* (constellation, star, planet, …) while `day_or_night` describes *when* it is relevant (night sky observation vs. daytime phenomena such as the Sun or rainbows). Neither field subsumes the other.

---

**2. Keep `unlock` block unchanged in this pass?**

Yes. The `unlock` block stays as-is, as a nested sub-object. No structural changes to it in this PR.

---

**3. Cultures and themes: closed enum with PR-to-extend?**

Cultures: closed enum (the list in § 6), extended by PR. The `referenced_only: true` flag is set per entry in `sky_objects.names[]` or per source link to make the "no retelling" rule machinable.

Source links additionally carry an optional `cultures: []` array so a link can be scoped to specific cultural traditions.

Themes: closed enum (the list in § 7), extended by PR.

---

**4. Sibling tables in YAML (one file per kind) or markdown-per-object?**

Option (a): single YAML index files. One file per table kind — `content/sky-objects.yaml`, `content/experiments.yaml`, `content/printables.yaml`, `content/ground-objects.yaml` — rather than one Markdown or YAML file per object. The printables table follows the same pattern; `build-printables.mjs` reads `printables.yaml` instead of globbing the SVG directory.

---

**5. Backfill scope for the first PR?**

Schemas plus two worked examples per table for this pass. Full extraction from existing prose is a later prompt (second PR with editorial review).

---

**6. Should the build fail on dangling ids or only warn?**

Advisory warnings first. The validator (`scripts/validate-content.mjs`) emits warnings but does not fail the build for this release. The switch to fail-the-build happens in a later PR once the dangling-id list is cleaned up.

---

**7. Should experiments fully absorb deck cards, or stay parallel with a `deck_card` link?**

Stay parallel. A single `experiments.yaml` table holds all experiment content; each row that maps to a draw-deck card carries a `deck_card` field with the corresponding id from `deck.yaml`. `deck.yaml` itself is untouched, keeping the deck-draw UI unchanged.
