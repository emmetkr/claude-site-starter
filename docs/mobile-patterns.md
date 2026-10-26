# Mobile patterns (390px)

The phone rules, distilled from the Untitled UI kit and adjusted by use on real pages. Every change is checked at 390px wide. `public/mobile.css` and `public/mobile.js` carry the interaction patterns (rails, segmented tabs, bottom sheets); this file carries the measurements.

## Rhythm

Container padding 16px. Section block padding 64px; a section that opens with a heading pads only its bottom, the previous 64 carries the gap. Heading block to content: 48px (features, FAQ, testimonial) or 64px (hero, metrics, CTA). Heading to supporting text 16px. Heading block to actions 32px. Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64, nothing between.

## Type

Hero h1 36/44 at 600, letter-spacing −2%. Section h2 30/38 at 600. Supporting text 18/28 at 400 in `#525252`. Card and feature titles 18/28 at 600; card body 16/24. Captions over a logo row 16/24 at 500, centred. Buttons 16/24 at 600. Nothing read on a page goes under 16px; nothing labelled under 14px.

**Long headings.** A sentence past about three lines of h2 cannot be a display headline on a phone, whatever the treatment. Cut it, or find its natural seam and demote the second half to supporting text. Shrinking the type reads as a wall.

## Buttons

48px tall, 16/24 at 600, radius 999, 13px 22px padding. A pair of CTAs sits side by side as pills and wraps if it must. Not stacked full-width bars.

## Hero

64px nav (logo left, 40px menu button right). h1, 16, lede, 32, the actions, 64, media.

## Social proof

One caption, 32, then the marks wrapped and centred at 16px row / 32px column gaps, 36px tall (28 to 32 for wordmarks). More than six marks becomes a horizontal rail (`data-mrail`).

## Features

Rows stack with 16px block padding, title 18/28 at 600 and body 16/24 at a 4px gap, optional 16px text link with a 20px arrow. Rows sit on a 1px `#E5E5E5` top hairline. No coloured border-left on the active row.

## Metrics

One `#FAFAFA` card, radius 16, padding 40 block / 24 inline. Items stacked at 32px, centred: figure 48/60 at 600, 12, label 18/28 at 600, 4, optional 16/24 support.

## CTA block

64px block; h2, 16, lede, 32, the button pair. Text left-aligned at 390, never centred.

## Testimonial

One compact card (`#FAFAFA`, radius 16, padding 40/24): quote 24/32 at 500, 32, name 18/28 at 600 and role 16/24. Arrows, no dots, when there are several.

## FAQ

Items separated by 1px `#E5E5E5` top borders with 24px padding-top, question 16/24 at 600, answer 16/24, a 24px plus or minus on the right.

## Footer

48px block padding. Brand line, then link columns stacked, each heading 14/20 at 600 muted with links 16/24 at 600 at 12px. Link rows 44px tall. Bottom bar last.

## Nav on phones

The sticky bar at `.94` white (or `.88` ink on a dark hero) so buttons scrolling under it do not smear through the wordmark.

## Rails, tabs and sheets

`public/mobile.js` turns, under 1024px:

- any `[data-mrail]` row into a snap-scrolling rail with dots;
- any `[data-mtabs]` group into segmented tabs synced to swipe panes;
- any `[data-msheet]` block into a bottom sheet opened by its trigger.

Everything it inserts is `display:none` on desktop. Read the file's header comment for the attributes.
