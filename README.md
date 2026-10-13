# BMA Free Website Check — V2.0

V2.0 turns the development tester into the public-facing BMA Free Website Check.

## What is included

- Public BMA-branded interface
- Website URL scan
- Animated six-colour progress bar
- Skippy moving with scan progress
- 0–100 result
- Six category cards
- Top 3 opportunities
- Positive findings
- Hidden developer diagnostics (`?debug=1`)
- Lead capture after the visitor has already seen value
- Automatic 6-page PDF report generation
- Optional GoHighLevel handoff through an inbound webhook

## Deploy

Replace the existing GitHub repository contents with the contents of this folder and commit to `main`.

Keep the existing Vercel environment variable:

`GOOGLE_PAGESPEED_API_KEY`

Optional:

`GHL_WEBHOOK_URL`

If `GHL_WEBHOOK_URL` is not configured, the PDF still works. The lead simply is not sent into GHL yet.

## GoHighLevel connection

Create a GHL workflow with an **Inbound Webhook** trigger, copy the webhook URL, then add it to Vercel as:

`GHL_WEBHOOK_URL`

V2.0 sends these fields:

- First name
- Email
- Business name
- Website URL
- Overall result
- Six category results
- Top 3 opportunities
- Submission date

The workflow can then create/update the contact, apply a `free-website-check` tag, notify BMA, and send a follow-up email.

## Debug mode

Normal visitors do not see developer diagnostics.

To show them temporarily:

`https://your-domain/?debug=1`

## Before public launch

The page currently contains:

`<meta name="robots" content="noindex,nofollow">`

Keep that while testing. Remove it when the Website Check is ready to be indexed publicly.
