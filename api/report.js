import { createWebsiteCheckPdf } from '../lib/report-pdf.js';

function setCors(res) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function safeText(value, max=300) {
  return String(value ?? '').trim().slice(0, max);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

async function sendWebhook(payload) {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return { sent:false, reason:'not-configured' };

  try {
    const response = await fetch(url, {
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify(payload),
      signal:AbortSignal.timeout(7000),
    });
    return { sent:response.ok, status:response.status };
  } catch (error) {
    return { sent:false, reason:error?.message || 'webhook-failed' };
  }
}

export default async function handler(req,res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed.' });

  try {
    const lead = req.body?.lead || {};
    const scan = req.body?.scan || {};

    const firstName = safeText(lead.firstName, 80);
    const businessName = safeText(lead.businessName, 120);
    const email = safeText(lead.email, 160);

    if (!firstName) return res.status(400).json({ error:'First name is required.' });
    if (!validEmail(email)) return res.status(400).json({ error:'A valid email is required.' });
    if (lead.consent !== true) return res.status(400).json({ error:'Consent is required.' });
    if (!scan?.success || !scan?.website?.domain || !scan?.categories || !scan?.score) {
      return res.status(400).json({ error:'The Website Check data is missing or invalid. Please run the check again.' });
    }

    const webhookPayload = {
      source: 'BMA Free Website Check',
      submittedAt: new Date().toISOString(),
      contact: {
        firstName,
        email,
        businessName,
      },
      websiteCheck: {
        url: scan.website.finalUrl || scan.website.requestedUrl,
        domain: scan.website.domain,
        siteType: scan.website.siteType,
        overallResult: scan.score.overall,
        label: scan.score.label,
        performance: scan.categories.performance?.score ?? null,
        conversion: scan.categories.conversion?.score ?? null,
        trust: scan.categories.trust?.score ?? null,
        seo: scan.categories.seo?.score ?? null,
        technical: scan.categories.technical?.score ?? null,
        tracking: scan.categories.tracking?.score ?? null,
        issue1: scan.topIssues?.[0]?.title || '',
        issue2: scan.topIssues?.[1]?.title || '',
        issue3: scan.topIssues?.[2]?.title || '',
      }
    };

    // Never block the visitor's report if the optional GHL webhook is unavailable.
    const webhookPromise = sendWebhook(webhookPayload);

    const pdfBytes = await createWebsiteCheckPdf({
      lead: { firstName, businessName, email },
      scan,
    });

    const webhook = await webhookPromise;
    res.setHeader('X-BMA-Lead-Webhook', webhook.sent ? 'sent' : 'not-sent');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="BMA-Website-Check-${scan.website.domain.replace(/[^a-z0-9.-]/gi,'-')}.pdf"`);
    res.setHeader('Cache-Control', 'no-store');

    return res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    return res.status(500).json({ error:error?.message || 'We could not generate the report.' });
  }
}
