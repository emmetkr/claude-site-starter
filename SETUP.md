# Setup

This file exists only in a fresh copy of the kit. While it is here, Claude runs the setup below the first time someone opens the folder, then deletes this file. Nothing here needs the reader to know git, a terminal or HTML.

## 1. Ask, in one message

Ask these together, in plain words, and wait for the answers. Accept short answers. Where something is missing, propose a default and say so.

1. What is the site for, in one sentence? (a product, a company, a person, an event)
2. Who is it for? One kind of reader.
3. What should the site be called? (the name in the nav and the tab)
4. Three sites you like the look of. Links are best.
5. An accent colour, if you have one. Otherwise the kit's red stays.
6. Your GitHub username, and whether the repo is already on GitHub.
7. Do you want a product demo video later? (yes or no)
8. Do you want to capture leads from the site? (analytics, a book-a-demo page, alerts in Slack when someone visits or books)

## 2. Build the first page from the answers

Replace `public/index.html` with a real first page for their site, keeping `site.css`:

- nav with their name and three anchor links
- a hero: one headline in their reader's words, one supporting line, one button
- three sections that explain what it is, what it does and proof (a quote or a number they gave; if none, a sentence that says what to put there)
- a closing call to action
- the footer

Follow `docs/copy-rules.md` and `docs/design-rules.md`. Use their reference sites for proportion, not for text or images.

Then: set `--accent` in `public/site.css` if they gave a colour; put the name in `public/share-card.html`; update `DESIGN.md`'s accent row; rewrite `README.md`'s first line to describe their site; replace the walkthrough row in `docs/pages.md`.

## 3. Install the skills

Run, from the project folder:

```
npx skills add pbakaus/impeccable
```

If they said yes to video: `npx skills add heygen-com/hyperframes`.

If `npx` is missing, tell them to install Node.js from https://nodejs.org/ and come back. Do not continue past this step without it; the probe and the check need Node as well.

## 4. Save their references

For each reference link, ask them to save the page (File → Save Page As → Web Page, Complete) into `reference/<site>/`. Then clone the design-systems list:

```
git clone https://github.com/alexpate/awesome-design-systems reference/awesome-design-systems
```

Read three systems close to their site and note what they agree on in `docs/design-rules.md` under a new heading, "What our references do".

## 5. Start the memory

Write the first entry in `docs/DEVLOG.md` (today's date, what was set up) and the first note in `sessions/` (see `sessions/README.md`).

## 6. Check the work

```
node scripts/check.mjs
node scripts/probe.mjs
```

Open `shots/390.png` and `shots/1440.png`. Fix anything wrong before going on. Then start `node scripts/serve.mjs` and tell them to open http://localhost:4173 in their browser.

## 7. Put it online

If the repo is already on GitHub and the `gh` command works (`gh auth status`), run:

```
gh api -X POST repos/<username>/<repo>/pages -f build_type=workflow
```

and tell them the site will be at `https://<username>.github.io/<repo>/` after the first push.

If `gh` is not installed, tell them: on GitHub, open the repo → Settings → Pages → under Source choose **GitHub Actions**. The workflow in `.github/workflows/pages.yml` does the rest on every push.

If the repo is not on GitHub yet, tell them to install GitHub Desktop (https://desktop.github.com/), choose File → Add Local Repository, pick this folder, and click Publish repository. Then do the Pages step.

## 8. Analytics and leads (only if they said yes to question 8)

Do this after the site is online, one tool at a time, and stop after each so they can create the account. Follow `docs/growth-stack.md`:

1. Copy the consent banner from `public/demo/index.html` into every page, with `consent.js`. Nothing tracks until a visitor accepts.
2. PostHog: ask for the snippet, paste it as a `data-consent` script, add the three events.
3. The demo page: `public/demo/` is already there. Ask which CRM they use (HubSpot free is the default), wire the form, paste their Calendly embed into the thank-you state, link "Book a demo" from the nav.
4. RB2B, Clay and Slack: offer them, explain what each adds in one sentence, set up the ones they want.

Never write a key or ID into a file that is committed to a public repo.

## 9. Finish

Commit everything with a plain message ("First page for <name>"), delete this file, and tell them three things: the local address, the public address, and that from now on they just describe changes and Claude makes them.
