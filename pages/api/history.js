
const API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: 'Missing symbol' });

  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 30);
  const from = past.toISOString().split('T')[0];
  const to = today.toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=30&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
}
