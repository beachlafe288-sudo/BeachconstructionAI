// Simple Express server to receive Zapier webhooks and route to HubSpot + Slack
// Usage (dev):
//   npm install express node-fetch
//   HUBSPOT_API_KEY=yourkey SLACK_WEBHOOK_URL=https://hooks.slack.com/services/... node src/zapier/webhook-server.js

const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { mapToHubSpot } = require('./transform');

const PORT = process.env.PORT || 3000;
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

if (!HUBSPOT_API_KEY) console.warn('Warning: HUBSPOT_API_KEY is not set. HubSpot calls will fail.');
if (!SLACK_WEBHOOK_URL) console.warn('Warning: SLACK_WEBHOOK_URL is not set. Slack notifications will fail.');

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
  try {
    const zapierBody = req.body;

    // Map incoming payload to HubSpot format
    const hubspotPayload = mapToHubSpot(zapierBody);

    // Send to HubSpot
    let hubspotResult = null;
    if (HUBSPOT_API_KEY) {
      const url = `https://api.hubapi.com/crm/v3/objects/contacts`;
      const resp = await fetch(url + `?hapikey=${HUBSPOT_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hubspotPayload),
      });
      hubspotResult = await resp.text();
    }

    // Post notification to Slack
    if (SLACK_WEBHOOK_URL) {
      const slackPayload = {
        text: `New lead received via Zapier: ${zapierBody?.email || zapierBody?.data?.email || 'unknown'}`,
      };
      await fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackPayload),
      });
    }

    res.status(200).json({ ok: true, hubspot: hubspotResult });
  } catch (err) {
    console.error('webhook handler error', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.get('/health', (req, res) => res.send('ok'));

app.listen(PORT, () => console.log(`Zapier lead router listening on :${PORT}`));
