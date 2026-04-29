# WayFare

*A family apprenticeship in finding your way — by sky, by land, by story.*

This is a living project. It is for one family, but if it helps yours too, you are welcome.

It has three parts:

- **A paper Fieldbook** you print, punch, and fill in by hand.
- **A Challenge Deck** of real-world tasks — most of them ask you to leave the house.
- **A tiny app** that tells you what’s in the sky tonight and holds the chapters.

The paper is the point. The app is a companion.

## What’s in the box

- `WAYFARE_PROJECT.md` — the whole plan, in one document. Read it first.
- `content/chapters/` — the chapter library, one markdown file per sky body or skill.
- `content/challenges/deck.yaml` — the cards.
- `content/fieldbook-templates/` — the paper pages, as SVGs.
- `printables/` — generated PDFs, ready to print. Made by `scripts/build-printables.mjs`.
- `app/` — the PWA. Works offline after the first load. No accounts, no tracking.

## Getting going

1. Print the Fieldbook templates (or run `node scripts/build-printables.mjs` to get a PDF of each page).
1. Put them in a cheap A4 ring binder.
1. Go outside on the next clear night. Find the Moon. Draw it.
1. Come back inside. Open the app. Log what you saw.
1. Next clear night, do it again.

That is the whole instruction.

## For the kids

If you are a kid reading this because someone in your family gave you this repo: hello. You can draw, write, argue, log mistakes, add stories, add chapters. Every commit you make is part of this forever. The sky is free. Go outside.

## Running it locally

You need **Node.js 18 or later** (any current LTS release works).

```sh
# 1. Install dependencies
cd app
npm install

# 2. Start the dev server (hot-reload, runs on http://localhost:5173)
npm run dev

# 3. Or build a production bundle to app/dist/
npm run build

# 4. Run the unit tests
npm test
```

To regenerate the printable templates (fieldbook pages + constellation dot-to-dots):

```sh
# From the repo root
npm run printables
```

The printables script writes HTML files to `app/public/printables/`. Open any of them in a browser and print to PDF.

The app is a static site. After `npm run build`, serve `app/dist/` from any static host — GitHub Pages, Cloudflare Pages, a local `npx serve dist`, anything. No server required.

## For anyone touching the code

Read `WAYFARE_PROJECT.md`. Then `CONTRIBUTING.md`. The rules there are the rules.
