# Build a site with Claude Code

The setup I use for kartel.ai, as a starter kit. Plain HTML and CSS, no framework, no build step. Claude Code writes the pages, keeps the docs current and checks its own work on a phone-width screen.

**Walkthrough:** the same six steps, with screenshots, at the kit's own page: `public/index.html` (served from GitHub Pages once you enable it, see step 6).

## The six steps

1. **Install VS Code.** https://code.visualstudio.com/
2. **Install the Claude Code extension** inside VS Code and sign in. https://claude.com/claude-code
3. **Connect GitHub.** Install GitHub Desktop and sign in. Every change is saved there, and it is how the site goes live. https://desktop.github.com/
4. **Add the skills.** In Claude Code, add `impeccable` (design review, catches the things that make a page look AI-generated): https://github.com/pbakaus/impeccable. The font is already in this kit: Inter Variable, in `public/assets/fonts/`.
5. **Save three sites you like as reference.** In your browser, File → Save Page As (Web Page, Complete) into `reference/`. Ask Claude to read them before it designs anything. Details in `reference/README.md`.
6. **Describe your site in plain English.** Open this folder in VS Code, start Claude Code, and say what the site is for and who reads it. Claude edits `public/index.html` and `public/site.css`. Open the page in your browser and ask for changes the way you would brief a designer.

## Use this kit

Click **Use this template** at the top of the GitHub page. That gives you your own copy. Then clone it in GitHub Desktop and open the folder in VS Code.

To put it online: in your repo's Settings → Pages, set Source to **GitHub Actions**. The workflow in `.github/workflows/pages.yml` publishes the `public/` folder on every push.

## What is in the kit

| Path | What it does |
|---|---|
| `CLAUDE.md` | Tells Claude how this repo works, and that the docs and the code change together. |
| `DESIGN.md` | The colour and type tokens, and the list of design tells to avoid. |
| `docs/` | `copy-rules.md` and `design-rules.md`, the rules that make the output read like a real site. `pages.md` lists every page. |
| `public/` | The site. `index.html`, `site.css`, Inter Variable. |
| `scripts/probe.mjs` | Screenshots the site at phone and laptop width with headless Chrome, so Claude can check layout before it says a change is done. |
| `scripts/check.mjs` | Checks every page for unbalanced tags and missing files. |
| `reference/` | Where saved competitor pages go. |

## What is left out, and where to get it

- **Icons.** kartel.ai uses Untitled UI Icons PRO. It is a paid set and cannot be redistributed. https://www.untitledui.com/icons
- **The Figma kit** the design rules come from: Untitled UI. https://www.untitledui.com/
- **Analytics.** Add your own tag manager snippet in `public/index.html` where the comment says so.

## Check your work

```
node scripts/check.mjs          # tag balance and missing files
node scripts/probe.mjs          # screenshots in shots/ at 390 and 1440 wide
```

The probe needs Google Chrome installed. Edit the path at the top of the script on Windows or Linux.
