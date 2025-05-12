// File: pages/api/refund.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { captureId } = req.body;
  if (!captureId) {
    return res.status(400).json({ error: 'Missing captureId' });
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;

  try {
    // Get OAuth token
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Call PayPal Refund API
    const refundRes = await fetch(`https://api-m.sandbox.paypal.com/v2/payments/captures/${captureId}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!refundRes.ok) {
      const errorData = await refundRes.json();
      console.error('Refund API error:', errorData);
      return res.status(500).json({ error: 'Refund failed', details: errorData });
    }

    const refundData = await refundRes.json();
    res.status(200).json({ success: true, refund: refundData });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
}
