# CLAUDE.md

Read this before changing anything in this repo.

## First run

If `SETUP.md` exists in the project root, this copy of the kit has not been set up. Before anything else, follow `SETUP.md`: it is a short interview, then Claude builds the first page, installs the skills, starts the memory and puts the site online. The `/setup` command does the same.

## Every session

Start by reading `docs/DEVLOG.md` and the two newest notes in `sessions/`. End by writing a note in `sessions/` (see its README) and a line in `docs/DEVLOG.md`.

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
| What changed and why | `docs/DEVLOG.md`, then `sessions/` |
| Reference sites | `reference/README.md` |

## Docs and code change together

If you add, remove or rename a page, a section, a token or a script, update the matching doc in the same change. Do not leave it for later. Pure copy edits inside an existing section do not need a doc change.

## Before you say a change is done


1. Run `node scripts/check.mjs`.
2. Run `node scripts/probe.mjs` and look at both screenshots. The page must work at 390px wide with no sideways scroll.
3. Read `DESIGN.md` → "Tells to avoid" and check the page against it.

## Working rules

- Plain HTML and CSS. No frameworks, no CSS libraries, no component kits.
- One `site.css`. Tokens at the top, in `:root`.
- Inter Variable is the only typeface. It is already in `public/assets/fonts/`.
- Write copy to `docs/copy-rules.md`. Every heading is a full sentence or a plain noun phrase.
- Do not add tracking, fonts from a CDN, or third-party scripts unless asked.
