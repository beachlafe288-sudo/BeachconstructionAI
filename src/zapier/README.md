# Zapier → HubSpot → Slack lead router

This folder contains starter scaffolding for receiving leads from Zapier, creating/updating a contact/lead in HubSpot, and notifying a Slack channel.

Files:
- webhook-server.js — simple Express webhook receiver
- transform.js — map incoming Zapier payload to HubSpot payload
- examples/zapier-payload.json — example Zapier webhook payload

Next steps:
1. Add the required repository secrets (HUBSPOT_API_KEY, SLACK_WEBHOOK_URL, CRM_WEBHOOK_API_KEY).
2. Install dependencies and run the server locally for testing.
3. Configure a Zap in Zapier to POST to the server's /webhook endpoint.
