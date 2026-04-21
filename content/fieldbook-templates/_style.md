# Fieldbook template style notes

All templates are SVGs sized for A4 (210 × 297 mm), black stroke only.

- Viewbox: `0 0 210 297` so 1 unit = 1 mm.
- Outer margin: 15 mm on all sides.
- Stroke: `#1a1a1a`, width `0.3` for light rules, `0.5` for frames, `0.9` for headings.
- Font: the printer's default serif. Do not embed fonts — families will print from any machine.
- No clip art. No screenshots. No colour.
- Every page carries a footer: `wayfare · <page name> · v1`.

If you're adding a new page, save it here and re-run `node scripts/build-printables.mjs`.
