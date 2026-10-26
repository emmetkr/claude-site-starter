# Growth stack

The layer that turns the site into a lead engine. Everything here is optional, every tool is its own account, and all of it sits behind the consent banner. Claude offers this at the end of setup ("Do you want to capture leads from the site?") and wires it one tool at a time.

## What fires when someone visits and books

1. **PostHog** records the visit, the pages, and the events that matter (`demo_form_start`, `lead:submitted`, `calendar_booked`). https://posthog.com
2. **RB2B** matches the visitor to a person and company where it can, and posts them to a Slack channel. https://www.rb2b.com
3. The **demo form** (`public/demo/`) creates a contact in your CRM. HubSpot's free tier is enough. https://www.hubspot.com
4. **Calendly** shows on the thank-you state so they book straight away. https://calendly.com
5. **Clay** enriches the new contact (role, company size, funding, LinkedIn) and writes it back to the CRM. https://www.clay.com
6. **Slack** gets one message per lead with the enriched record, so the founder sees it within a minute. https://slack.com

## Consent first

Trackers go in the page as inert scripts:

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

**Clay.** Create a table with the CRM as its source (HubSpot → new contacts). Add enrichment columns: title, company size, industry, LinkedIn. Add a write-back column to the CRM and a Slack message column.

**Slack.** One channel, say `#leads`. RB2B posts visits; Clay posts the enriched contact; Calendly posts bookings via its Slack app. Three messages tell the whole story of a lead without opening a dashboard.

## What to look at weekly

- Visits → demo page → form submitted → booked. Four numbers, in PostHog.
- The RB2B channel, for companies that visited twice and never booked. Those get an email.

## IDs and keys

Never commit them to a public repo. Put them straight in the page where the snippet goes, or in a `config.js` listed in `.gitignore`.
