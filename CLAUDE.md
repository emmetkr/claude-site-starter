# CLAUDE.md

Read this before changing anything in this repo.

## What this is

A static site: hand-written HTML and CSS in `public/`, no build step. GitHub Pages serves `public/` as the site.

## Where things are

| Touching | Read first |
|---|---|
| Any page | `docs/pages.md` |
| Colours, type, spacing | `DESIGN.md` |
| Copy | `docs/copy-rules.md` |
| Layout and components | `docs/design-rules.md` |
| Anything at phone width | `docs/mobile-patterns.md` |
| What changed and why | `docs/DEVLOG.md` |
| Reference sites | `reference/README.md` |

## Docs and code change together

If you add, remove or rename a page, a section, a token or a script, update the matching doc in the same change. Do not leave it for later. Pure copy edits inside an existing section do not need a doc change.

## Before you say a change is done

0. Add a line to `docs/DEVLOG.md`.

1. Run `node scripts/check.mjs`.
2. Run `node scripts/probe.mjs` and look at both screenshots. The page must work at 390px wide with no sideways scroll.
3. Read `DESIGN.md` → "Tells to avoid" and check the page against it.

## Working rules

- Plain HTML and CSS. No frameworks, no CSS libraries, no component kits.
- One `site.css`. Tokens at the top, in `:root`.
- Inter Variable is the only typeface. It is already in `public/assets/fonts/`.
- Write copy to `docs/copy-rules.md`. Every heading is a full sentence or a plain noun phrase.
- Do not add tracking, fonts from a CDN, or third-party scripts unless asked.
