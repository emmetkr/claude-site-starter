# Growth stack

The layer that turns the site into a lead engine. Everything here is optional, every tool is its own account, and all of it sits behind the consent banner. Claude offers this at the end of setup ("Do you want to capture leads from the site?") and wires it one tool at a time.

## What fires when someone visits and books

This is the chain as it runs on kartel.ai, with the tool names and none of the account details.

**On page load**

1. **PostHog** records the visit, the pages and the events that matter. https://posthog.com
2. Behind the consent banner: **Google Tag Manager** (for GA4 and ad pixels), **RB2B** (visitor identification) and the **HubSpot tracking script**, which drops the cookie that later tells HubSpot where a contact came from.

**When someone gives an email**

3. **Form fill:** the HubSpot form creates the contact. The tracking cookie carries the source of the visit onto it. A HubSpot workflow picks the new contact up.
4. **Calendly booking:** Calendly sends a webhook to a small receiver (a serverless function; Vercel's free tier is enough). The receiver submits a hidden HubSpot form that writes the booking details onto the contact. A second workflow fires on the meeting.
5. Both workflows run the same steps: post the contact to a **Clay** enrichment receiver, which looks up the company by email domain and the person by name, then writes the enriched fields (role, company size, industry, LinkedIn) back onto the HubSpot contact and company. The workflow waits a few minutes for that to land, then posts the enriched card to a **Slack** channel. A form fill or booking also creates a Lead deal in the CRM.

**RB2B runs on its own.** It identifies some US visitors and sends them wherever its own integrations page points: its Slack app, its HubSpot sync, or only its dashboard. It does not go through Clay. Routing RB2B hits into the same Slack channel is a setting in RB2B, not code.

Links: https://www.rb2b.com · https://www.hubspot.com · https://calendly.com · https://www.clay.com · https://slack.com

**What the kit ships and what it does not.** The kit has the consent gate, the demo page with the form and the thank-you calendar slot, and this doc. The two receivers (Calendly webhook, Clay enrichment) are about forty lines each of serverless code and are specific to your accounts; Claude can write them when you reach that step. The HubSpot workflows are built in HubSpot's own editor.

## Consent first

The kit gates every tracker, PostHog included. (kartel.ai loads PostHog and LinkedIn Insight before consent, a call its owner made; the kit takes the safer default.) Trackers go in the page as inert scripts:

```html
<script type="text/plain" data-consent src="https://…/posthog.js"></script>
<script type="text/plain" data-consent>/* inline init here */</script>
```

`public/consent.js` turns them on when the visitor accepts and remembers the choice. The banner markup is at the bottom of `public/demo/index.html`; copy it to every page. Decline leaves them off. This is the difference between analytics and a privacy complaint.

## Setting each one up

**PostHog.** Create a project, copy the snippet from Project settings, paste it into `<head>` as a `data-consent` script. Then capture three events from your own code:

```js
document.addEventListener('consent:granted', function(){ /* posthog is live now */ });
document.addEventListener('lead:submitted', function(e){ posthog && posthog.capture('lead_submitted', e.detail); });
```

Turn on session replay and dead-click detection in PostHog; both are one switch.

**RB2B.** Sign up, install the script from their dashboard as a `data-consent` script, connect the Slack channel in their settings. It identifies US visitors only, and only some of them.

**The demo form.** Either paste your CRM's form embed into `public/demo/index.html` where the comment says, or keep the kit's form and point `send()` at your CRM's form API (HubSpot: Forms API with your portal and form IDs). Either way, the contact must land in the CRM with the email, the company and the "what do you want to see" text.

**Calendly.** Create a 30-minute event type. Paste the inline embed into the thank-you block in `public/demo/index.html`. Pass the email through so the booking matches the contact.

**Clay.** Create a table that receives a contact (email, name, company) from a webhook. Add enrichment columns: title, company size, industry, LinkedIn. Add a write-back column to the HubSpot contact and company. The HubSpot workflow calls the webhook, waits a few minutes, then posts to Slack.

**Slack.** One channel, say `#leads`. The HubSpot workflow posts the enriched card after Clay has written back; RB2B posts visits through its own Slack app if you turn that on. Two kinds of message tell the whole story of a lead without opening a dashboard.

## What to look at weekly

- Visits → demo page → form submitted → booked. Four numbers, in PostHog.
- The RB2B channel, for companies that visited twice and never booked. Those get an email.

## IDs and keys

Never commit them to a public repo. Put them straight in the page where the snippet goes, or in a `config.js` listed in `.gitignore`.
