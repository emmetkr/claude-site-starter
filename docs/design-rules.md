# Design rules

## Layout

- One column of content, 1160px wide, centred. Sections stack. No sidebars on marketing pages.
- A section heading sits above its content on the page. Never inside a dark panel or card.
- Headings left-aligned with the content under them.
- One call to action per screen. Propose a place for it; do not scatter buttons across the page.

## Components

- Cards only when the content is a discrete thing (a plan, a quote). Running copy and lists sit on the page.
- Images are real. No placeholder art, no stock illustration.
- Product screenshots show one action at a time, cropped to the control in use, never the whole app window.
- Animations are short and play once when the element comes into view. Nothing loops behind text.

## Phones (390px wide)

- Verify every change at 390px. No sideways scroll, ever.
- Side gutter 16px. Buttons full width and at least 44px tall.
- Rows of items become a horizontal rail you swipe, or stack. Never shrink to fit.
- Sticky elements only for the nav. No sticky call-to-action bar.
- Title first, then the image, then the caption.

## Before shipping

Run `node scripts/probe.mjs` and look at both screenshots. Then read `DESIGN.md` → "Tells to avoid".
