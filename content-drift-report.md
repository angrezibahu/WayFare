# Content Drift Report

`npm run validate:content` emitted **15 warnings** in total across two warning types. There were **6 `dangling related_sky_objects`** warnings: 4 originating from the `sky-objects` entry for `ursa-major` (referencing `polaris`, `alcor`, `mizar`, and `arcturus`) and 2 from `experiments` entries (`shadow-stick-noon` referencing `sun`, and `merkhet-polaris` referencing `polaris`). There were also **9 `dangling challenge_id`** warnings, one each from the following chapter files: `cassiopeia.md`, `cygnus-revisited.md`, `pegasus-andromeda.md`, `bootes-arcturus.md`, `leo.md`, `ursa-major.md`, `milky-way.md`, `scorpius-antares.md`, and `summer-triangle.md`.

## Full stderr output

```
WARN  sky-objects[ursa-major]: dangling related_sky_objects → "polaris"
WARN  sky-objects[ursa-major]: dangling related_sky_objects → "alcor"
WARN  sky-objects[ursa-major]: dangling related_sky_objects → "mizar"
WARN  sky-objects[ursa-major]: dangling related_sky_objects → "arcturus"
WARN  experiments[shadow-stick-noon]: dangling related_sky_objects → "sun"
WARN  experiments[merkhet-polaris]: dangling related_sky_objects → "polaris"
WARN  chapter[cassiopeia] (content/chapters/autumn/cassiopeia.md): dangling challenge_id → "find-the-w"
WARN  chapter[cygnus-revisited] (content/chapters/autumn/cygnus-revisited.md): dangling challenge_id → "northern-cross-sets"
WARN  chapter[pegasus-andromeda] (content/chapters/autumn/pegasus-andromeda.md): dangling challenge_id → "find-the-great-square"
WARN  chapter[bootes-arcturus] (content/chapters/spring/bootes-arcturus.md): dangling challenge_id → "arc-to-arcturus"
WARN  chapter[leo] (content/chapters/spring/leo.md): dangling challenge_id → "find-the-sickle"
WARN  chapter[ursa-major] (content/chapters/spring/ursa-major.md): dangling challenge_id → "find-polaris"
WARN  chapter[milky-way] (content/chapters/summer/milky-way.md): dangling challenge_id → "dark-sky-milky-way"
WARN  chapter[scorpius-antares] (content/chapters/summer/scorpius-antares.md): dangling challenge_id → "find-antares"
WARN  chapter[summer-triangle] (content/chapters/summer/summer-triangle.md): dangling challenge_id → "find-the-summer-triangle"
validate-content: 15 warning(s) found
```
