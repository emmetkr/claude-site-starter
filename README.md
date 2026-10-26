# Build a site with Claude Code

The setup I use for kartel.ai, as a starter kit. Plain HTML and CSS, no framework, no build step. Claude Code writes the pages, keeps the docs current and checks its own work on a phone-width screen.

**Walkthrough:** the same six steps, with screenshots, at the kit's own page: `public/index.html` (served from GitHub Pages once you enable it, see step 6).

## The six steps

1. **Install VS Code.** https://code.visualstudio.com/
2. **Install the Claude Code extension** inside VS Code and sign in. https://claude.com/claude-code
3. **Connect GitHub.** Install GitHub Desktop and sign in. Every change is saved there, and it is how the site goes live. https://desktop.github.com/
4. **Add the skills.** In Claude Code, add `impeccable` (design review, catches the things that make a page look AI-generated): https://github.com/pbakaus/impeccable. The font is already in this kit: Inter Variable, in `public/assets/fonts/`.
5. **Give Claude references.** Clone [awesome-design-systems](https://github.com/alexpate/awesome-design-systems) into `reference/`: a list of 140 public design systems with links to their docs and source. Save three sites you like there too (File → Save Page As, Web Page Complete). Ask Claude to study them before it designs anything. Details in `reference/README.md`.
6. **Describe your site in plain English.** Open this folder in VS Code, start Claude Code, and say what the site is for and who reads it. Claude edits `public/index.html` and `public/site.css`. Run `node scripts/serve.mjs`, open http://localhost:4173, and ask for changes the way you would brief a designer. For a product demo video, add [HyperFrames](https://github.com/heygen-com/hyperframes) (`npx skills add heygen-com/hyperframes`): it renders HTML to video, so Claude can make the demo as well as the site.

## Use this kit

1. Click **Use this template** at the top of the GitHub page. That gives you your own copy.
2. Open GitHub Desktop, clone your copy, and open the folder in VS Code.
3. Start Claude Code and say **hello**. Claude sees `SETUP.md`, asks you seven questions about your site, then builds the first page, installs the skills, saves your references, starts the memory and puts the site online at `https://<you>.github.io/<repo>/`.

From then on you describe changes and Claude makes them. Every chat starts by reading the devlog and the last two session notes, so nothing is forgotten between chats.

## What is in the kit

| Path | What it does |
|---|---|
| `CLAUDE.md` | Tells Claude how this repo works, and that the docs and the code change together. |
| `DESIGN.md` | The colour and type tokens, and the list of design tells to avoid. |
| `docs/` | `copy-rules.md` and `design-rules.md`, the rules that make the output read like a real site. `pages.md` lists every page. |
| `public/` | The site. `index.html`, `site.css`, Inter Variable. |
| `scripts/probe.mjs` | Screenshots the site at phone and laptop width with headless Chrome, so Claude can check layout before it says a change is done. |
| `scripts/check.mjs` | Checks every page for unbalanced tags and missing files. |
| `public/mobile.css`, `public/mobile.js` | The phone patterns: horizontal rails, segmented swipe tabs and bottom sheets, switched on by one attribute. |
| `docs/mobile-patterns.md` | The 390px measurements: rhythm, type, buttons, every section type. |
| `docs/DEVLOG.md` | One dated line per change. Claude reads it at the start of a session, so it remembers between chats. |
| `scripts/serve.mjs` | Serves the site at localhost:4173 while you work. |
| `scripts/share-card.mjs` | Renders `public/share-card.html` to the image shown when your link is pasted into Slack or LinkedIn. |
| `.impeccable/config.json` | The design detector's config, with nothing ignored. |
| `reference/` | Where the design systems and saved pages go. |
| `sessions/` | One short note per chat: did, decided, next. The short-term memory. |
| `SETUP.md` | The first-run interview. Claude follows it once, then deletes it. |
| `.claude/skills/setup` | The `/setup` command, same thing on demand. |

## What is left out, and where to get it

- **Icons.** kartel.ai uses Untitled UI Icons PRO. It is a paid set and cannot be redistributed. https://www.untitledui.com/icons
- **The Figma kit** the design rules come from: Untitled UI. https://www.untitledui.com/
- **Analytics.** Add your own tag manager snippet in `public/index.html` where the comment says so.

## Check your work

```
node scripts/serve.mjs          # open http://localhost:4173
node scripts/check.mjs          # tag balance and missing files
node scripts/probe.mjs          # screenshots in shots/ at 390 and 1440 wide
node scripts/share-card.mjs     # public/share-card.png for link previews
```

The probe needs Google Chrome installed. Edit the path at the top of the script on Windows or Linux.
