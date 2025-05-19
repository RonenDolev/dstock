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
    const url = `https://api.polygon.io/v2/last/trade/${normalized}?apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    const price = data?.results?.p || data?.last?.price || 0;
    if (!price) {
      console.warn(`⚠️ No price returned for ${symbol}`, data);
    }

    res.status(200).json({ price });
  } catch (err) {
    console.error(`❌ Error fetching price for ${symbol}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch price', details: err.message });
  }
}
