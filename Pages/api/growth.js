export default async function handler(req, res) {
  const { symbol, months } = req.query;

  if (!symbol || !months) {
    return res.status(400).json({ error: 'Missing symbol or months parameter' });
  }

  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  const normalized = symbol
    .replace('^GSPC', 'SPX')
    .replace('^IXIC', 'NDX')
    .replace('^DJI', 'DJI')
    .replace('^RUT', 'RUT');

  const baseUrl = 'https://api.polygon.io';
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - parseInt(months));

  const from = startDate.toISOString().split('T')[0];
  const to = endDate.toISOString().split('T')[0];

  const url = `${baseUrl}/v2/aggs/ticker/${normalized}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=5000&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const prices = data?.results;
    if (!prices || prices.length < 2) {
      return res.status(200).json({ growth: null });
    }

    const start = prices[0].c;
    const end = prices[prices.length - 1].c;
    const growth = ((end - start) / start) * 100;

    res.status(200).json({ growth });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch growth', details: err.message });
  }
}
