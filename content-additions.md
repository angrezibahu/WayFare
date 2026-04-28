# Content additions — review summary

Branch: `claude/expand-cultural-stories-zaVV6`
Scope: ten new chapters expanding the Celtic, Saxon (Anglo-Saxon), and Hindustani threads, with a rotating "pot luck" slot used twice (Polynesian, Norse), plus cross-culture name updates to `sky-objects.yaml`. Designed to merge cleanly behind the existing five-part chapter template and the proposed `content-model.md` schema.

This file is a review surface, not a feature. Once you've signed off, it can be deleted (or kept as a CHANGELOG entry).

## Distribution at a glance

| Season | Existing | New | New chapter slugs                                                  |
|--------|---------:|----:|---------------------------------------------------------------------|
| Always | 6        | 0   | (none — kept lean)                                                  |
| Winter | 4        | 2   | `mrigashira-vyadha`, `imbolc-and-brigid`                            |
| Spring | 4        | 2   | `saptarshi`, `wodens-wain`                                          |
| Summer | 4        | 3   | `lughnasadh`, `nakshatras-lunar-mansions`, `polynesian-star-compass`|
| Autumn | 4        | 3   | `caer-gwydion`, `dhruva-pole-star`, `norse-sun-stone`               |

10 new chapters total. No season more than 7. Pot-luck slot used twice — once Polynesian, once Norse — picked because both have unusually strong primary-source backing for their respective claims.

## Chapter-by-chapter

### Winter

**1. `winter/mrigashira-vyadha.md` — Mṛgaśīrṣa and Vyādha (Hindustani)**
- Pairs with the existing `orion.md` chapter. Same stars, Hindustani cuts: Orion's head triangle is Mṛgaśīrṣa (the deer's head), the Belt is the arrow, Sirius is Vyādha (the hunter), Aldebaran is Rohiṇī.
- Frames the nakshatra system as a *living* astronomical tradition — explicitly rejects "ancient myth" framing.
- Sources: Aitareya Brāhmaṇa (primary, public-domain Keith translation), Pingree's *Jyotiḥśāstra*, Subhash Kak's open-access arXiv paper, drikpanchang.com (living-tradition).

**2. `winter/imbolc-and-brigid.md` — Imbolc, the Quickening (Celtic / Gaelic)**
- Late-winter / cross-quarter chapter (1 February). Brigid in Cormac's Glossary; Hebridean Là Fhèill Brìghde from Carmina Gadelica; Cailleach weather augury.
- Day-side land chapter: snowdrops, hazel catkins, sunrise-position-on-horizon clock, eight-fold cross-quarter wheel.
- Sources: Carmina Gadelica (Carmichael 1900, public-domain), Cormac's Glossary (10th c., public-domain), Olmsted on the Coligny Calendar, Met Office (modern science cross-check).

### Spring

**3. `spring/saptarshi.md` — Saptarshi, the Seven Sages (Hindustani)**
- Cross-references the existing `ursa-major.md` chapter — *same seven stars*. The user's ask: "when Ursa Major appears in a Greek chapter and again in a Hindustani chapter as Saptarshi, it's the same sky_object." Sky-object table updated to reflect this.
- Names the sages along the shape; Mizar/Alcor as Vasiṣṭha and Arundhatī (with the Hindu wedding rite); Krittikā connection; Saptarṣi Kāla calendar era.
- Sources: Śatapatha Brāhmaṇa (Eggeling, public-domain), Mahābhārata (Ganguli, public-domain), Sidharth, drikpanchang.com.

**4. `spring/wodens-wain.md` — Carles Wægn, the Old English Sky (Anglo-Saxon)**
- Same Ursa Major; Anglo-Saxon reading. *Carles wægn* (the churl's wagon) is the medieval English ancestor of "Charles' Wain." Wætlinga Stræt is the Milky Way as Watling Street stretched across the sky. Bede's month-names. Day-of-the-week planet identifications.
- Sources: Old English Rune Poem (open-access Camden Rutgers), Bede *De temporum ratione* (Wallis 1999, scholarly), Ælfric *De temporibus anni* (Henel 1942, open-access), Bosworth-Toller dictionary, Layamon's Brut.

### Summer

**5. `summer/lughnasadh.md` — Lughnasadh, the First Harvest (Celtic / Irish)**
- 1 August cross-quarter. Tailtiu, Lugh, the Óenach Tailteann; Lammas / *hlāf-mæsse* as the Anglo-Saxon parallel. Bilberry climbs, Croagh Patrick. Hebridean Lùnastal from Carmina Gadelica.
- Day-side land chapter: reading grain ripeness, sunset-position clock, first-loaf household ritual.
- Sources: Tochmarc Étaíne (CELT, open-access bilingual), Máire MacNeill's foundational *The Festival of Lughnasa* (1962), Carmina Gadelica, Olmsted, Hutton.

**6. `summer/nakshatras-lunar-mansions.md` — The Nakshatras (Hindustani)**
- The 27 lunar mansions — proper Sanskrit names, junction stars, deities. Frames as the *spine of the living Hindu calendar*. Includes the Daksha / Chandra / Rohiṇī mythological frame as continuous with the calendar, not separate from it.
- Cross-references nine bright junction stars already named elsewhere in the book (Aldebaran, Betelgeuse, Pollux, Regulus, Spica, Arcturus, Antares, Altair, Markab) — Sanskrit equivalents pinned to existing English names.
- Sources: Atharvaveda (Whitney, public-domain), Sūrya Siddhānta (Burgess 1860, public-domain), Vedāṅga Jyotiṣa (Sastry critical edition), drikpanchang.com.

**7. `summer/polynesian-star-compass.md` — POT LUCK: Polynesian wayfinding**
- Explicitly framed as **referenced, not taught** (added `referenced_only: true` at front-matter level).
- Story: the largest crossing in human history; the 1976 Hōkūleʻa voyage; Mau Piailug's transmission; Nainoa Thompson's apprenticeship.
- Connects to existing chapters — Hōkūleʻa = Arcturus from `bootes-arcturus.md`; Vega from `summer-triangle.md`. Same stars, different uses, different keepers.
- Sources: hokulea.com (PVS primary), Nainoa Thompson's *On Wayfinding* (PVS essay), Sam Low *Hawaiki Rising* (2013), Ben Finney *Voyage of Rediscovery* (1994), Bishop Museum, SMART (Aotearoa).
- Why this is the pot-luck pick: existing chapters already reference Polynesian wayfinding three times without ever giving it room. This chapter centres it once, properly framed, with the right body of source links.

### Autumn

**8. `autumn/caer-gwydion.md` — Caer Gwydion and Caer Arianrhod (Welsh / Celtic)**
- Welsh reading of the autumn sky: the Milky Way as Gwydion's stone-fortress; Corona Borealis as Caer Arianrhod, the silver-circled fortress. From the Fourth Branch of the Mabinogi.
- Includes R Coronae Borealis (the variable that "retreats to her fortress") — the science-and-language braid the brief specifically asked for.
- Sources: Mabinogion (Sioned Davies modern + Lady Charlotte Guest public-domain), Will Parker's open-access mabinogi.net edition, Geiriadur Prifysgol Cymru (Welsh dictionary, primary lexical source), National Library of Wales digitised White Book of Rhydderch.

**9. `autumn/dhruva-pole-star.md` — Dhruva, the Steadfast Star (Hindustani)**
- Same star as Polaris in the Plough chapter, the Cassiopeia chapter, the Old English chapter. Different story.
- The Bhāgavata Purāṇa story of the boy Dhruva. Frames the metaphor and the navigational fact as the same fact — child meditating on what is permanent / star that does not move / latitude marker for ships.
- Honest about precession: pyramid-era pole was Thuban; current pole near Polaris; future pole near Vega. The "steadfast" is steadfast on a human timescale, not a cosmic one — and the Hindustani astronomical tradition knew this from the Sūrya Siddhānta onward.
- Sources: Bhāgavata Purāṇa (Sanyal, public-domain), Viṣṇu Purāṇa (Wilson 1840, public-domain), Sūrya Siddhānta (Burgess 1860, public-domain), Aveni *People and the Sky*.

**10. `autumn/norse-sun-stone.md` — POT LUCK: Sólarsteinn**
- Why this is the second pot-luck pick: the source backing is unusually strong — three medieval saga references plus two peer-reviewed Royal Society Proceedings papers (Hegedüs 2007, Ropars 2014) that demonstrate the physics. Most Norse "sky-lore" claims thin out under scrutiny; this one stands up.
- Day-side / instrument chapter: how the Norse may have read the sun through cloud with a calcite crystal. Includes a working "homemade sólarsteinn" experiment families can run.
- Sources: Hrafns saga Sveinbjarnarsonar (heimskringla.no, open-access Old Norse), Konungs skuggsjá (Larson 1917, public-domain), Heimskringla, plus the two Royal Society papers (open access via DOI).

## sky-objects.yaml updates

Existing two entries (`ursa-major`, `betelgeuse`) joined by ten more. Each carries the cross-culture names the user asked for — one sky_object, multiple culture names — and the `chapters: [...]` array back-links every chapter that uses that object.

New entries:
- `orion` — Greek, Arabic, Egyptian, Māori, **Hindustani (Mṛgaśīrṣa, Vyādha)**, Welsh, Yolŋu (referenced_only).
- `pleiades` — Greek, Japanese (Subaru), Māori (Matariki), **Hindustani (Krittikā)**, **Anglo-Saxon (Sefon Steorran)**, Arabic, Cherokee (referenced_only), Aboriginal Australian (referenced_only).
- `polaris` — Latin, Arabic, **Hindustani (Dhruva)**, **Anglo-Saxon (scip-steorra)**, Hawaiian (referenced_only).
- `mizar-alcor` (new pair) — Arabic, **Hindustani (Vasiṣṭha and Arundhatī)**.
- `sirius` — Greek, Egyptian (Sopdet), Arabic, **Hindustani (Lubdhaka / Mṛgavyādha)**, Hawaiian (referenced_only), Māori (referenced_only).
- `corona-borealis` (new) — Latin, Greek, **Welsh (Caer Arianrhod)**, Arabic (Al-Fakkah).
- `milky-way` (new) — Greek, Latin, Chinese, Finnish, **Welsh (Caer Gwydion)**, **Hindustani (Ākāśagaṅgā)**, **Norse (Vetrarbraut)**, **Anglo-Saxon (Wætlinga Stræt)**, San (referenced_only), Aboriginal Australian (referenced_only).
- `aldebaran` (new) — Arabic, **Hindustani (Rohiṇī)**, Persian.
- `cygnus` (new) — Greek, English-folk, Arabic, Irish (Clann Lir, Children of Lir).
- `sun` (new) — Latin, Greek, **Anglo-Saxon (Sunne)**, **Norse (Sól / Sunna)**, **Hindustani (Sūrya)**, **Irish (Grian)**.

Updated:
- `ursa-major` — added **Anglo-Saxon (Carles wægn)**, Norse (Karlavagninn), Welsh (Y Sêr Mawr); chapters list now includes `saptarshi` and `wodens-wain` alongside `ursa-major`.

## Conventions held

- **Five-part arc kept:** Story → Sky/Land → Science → Skill → Stretch — every new chapter follows it.
- **`source_links` is the new field**, alongside legacy `sources:` strings, per the proposed content-model.md schema. Each entry carries `label`, `url` (where one exists), `note`, and (where useful) `cultures:` tags.
- **No Wikipedia-only chapters.** Every chapter has at least three sources from primary texts, open-access scholarly editions, or living-tradition community institutions.
- **Living-tradition framing for Hindustani content:** Nakshatra system, panchāṅga, wedding rites, Saptarṣi Kāla — all framed as in-use, not "ancient." Sanskrit terms paired with English glosses on first use, then used directly.
- **`referenced, not taught` framing for Indigenous traditions:** The Polynesian chapter is explicitly a "we point at this" chapter and front-matter carries `referenced_only: true`. Yolŋu, San, Aboriginal Australian, Mi'kmaq, Inuit, Hawaiian-as-living-tradition, Cherokee — all kept as `referenced_only: true` in the sky-object names list, never retold in chapter prose.
- **Cross-culture rather than parallel-culture:** Stars and constellations are *one* sky_object with multiple `names[]`. Where a chapter centres on the Hindustani reading of Ursa Major (Saptarshi), the back-reference to the same sky-object also appears in the Greek chapter (`ursa-major`) and the Anglo-Saxon chapter (`wodens-wain`). The point of the user's brief.

## Voice notes for review

- Science-language-folktale braid is held throughout. Look at the *Mrigashira* chapter as a clean example: the deer-and-arrow story, the Sanskrit etymology, and the white-dwarf companion of Sirius are in the same paragraph block, not separated.
- Read-aloud register kept on every Story section.
- Sanskrit, Old English, and Welsh quoted in the original where the original is reasonable to print, with translations alongside (Carmina Gadelica blessing, Old English Rune Poem stanza, Hrafns saga passage).
- No invented folklore. Where the textual record is thin (e.g. exact Saptarshi star-to-name correspondence), the chapter says so explicitly: *"Different scholarly sources disagree on a few of these assignments."*

## What I did NOT do

- I did **not** write a `nakshatras` chapter for *each* nakshatra. The summer Nakshatras chapter is the table-of-contents; individual mansions can be chapters in a future expansion if the family wants them.
- I did **not** edit existing chapters. The Saptarshi chapter cross-references `ursa-major.md` but does not modify it. If you want a small "see also: Saptarshi" line at the bottom of `ursa-major.md`, that is a one-line edit you can do now or merge in a follow-up.
- I did **not** add new entries to `experiments.yaml`, `printables.yaml`, or `challenges/deck.yaml`. The chapter Stretch sections list invitations in the existing in-prose form. Promoting them to deck cards or experiments is a separate, deliberate pass.
- I did **not** change the `unlock` resolver or the existing front-matter conventions. Each new chapter has the legacy `unlock` block alongside the new schema fields, so the existing PWA build keeps working without modification.
- I did **not** add a West African or Indigenous North American pot-luck slot. I considered both; the source backing for the strongest candidates (Dogon astronomy, Lakota star knowledge) was either contested or required deeper community partnership than I could responsibly handle in one PR. The two pot-luck slots I used (Polynesian, Norse) had clean primary-source backing. The user's instruction — "pick whichever has the strongest source material per chapter, don't tokenise" — felt like a directive *not* to fill those slots just to fill them.

## Suggested follow-ups (not done in this PR)

- One-line "see also" cross-references at the bottom of `ursa-major.md` (→ saptarshi, wodens-wain) and `orion.md` (→ mrigashira-vyadha) and `milky-way.md` (→ caer-gwydion).
- Promote two or three of the new Stretch challenges into the Challenge Deck (the first-loaf at Lughnasadh, the cloudy-day sun-find from the sólarsteinn chapter, and the Vasiṣṭha-Arundhatī eye test from Saptarshi all feel like good cards).
- Capstone events: the Imbolc capstone (sunrise mark + first-snowdrop) and the Lughnasadh capstone (first-loaf + bilberry climb) would round out the Year One capstones nicely. Currently the four capstones are seasonal-end; cross-quarter capstones would double the rhythm.
