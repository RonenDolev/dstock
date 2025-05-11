export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: 'Missing stock symbol' });

  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  const normalized = symbol
    .replace('^GSPC', 'SPX')
    .replace('^IXIC', 'NDX')
    .replace('^DJI', 'DJI')
    .replace('^RUT', 'RUT');

  try {
    const url = `https://api.polygon.io/v2/aggs/ticker/${normalized}/prev?adjusted=true&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const price = data?.results?.[0]?.c || 0;
    res.status(200).json({ price });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch price', details: err.message });
  }
}
