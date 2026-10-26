# Design

Untitled UI neutrals on white, one accent colour, Inter for everything.

## Tokens

Set in `public/site.css` under `:root`.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#171717` | Headings, body on white |
| `--muted` | `#525252` | Supporting text |
| `--soft` | `#A3A3A3` | Captions, placeholders |
| `--hair` | `#E5E5E5` | Borders |
| `--bg` | `#FFFFFF` | Page |
| `--bg-2` | `#FAFAFA` | Alternate sections |
| `--accent` | `#F04A3C` | One mark per screen at most |

## Type

Inter Variable. Body 17/26. Section headings `clamp(28px, 3vw, 40px)` at weight 600, letter-spacing −0.02em. Nothing under 15px in running copy. Mono only for code.

## Spacing

Sections pad `clamp(64px, 10vh, 128px)` top and bottom. Content sits in a 1160px column. Phones get a 16px gutter.

## Tells to avoid

These make a page read as generated. Do not ship any of them.

- Small uppercase labels above headings ("OUR MISSION").
- Decorative numbers (01, 02, 03) next to features.
- Glowing dots, glows, gradients on text, halo shadows.
- A coloured left border on a card.
- Three-column grids of icon + heading + sentence.
- Rounded "chips" floating on images.
- Headings written as fragment pairs ("Faster. Smarter.").
- Mono text used as decoration.
- A white card on a white page for every block of content. Let content sit on the page.
