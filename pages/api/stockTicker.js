// pages/api/stockTicker.js
export default async function handler(req, res) {
  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];

  const results = [];

  for (const symbol of symbols) {
    try {
      const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`;
      const response = await fetch(url);
      const json = await response.json();
      const data = json.results?.[0];

      if (data) {
        const change = data.c - data.o;
        results.push({
          symbol,
          value: data.c.toFixed(2),
          change: change.toFixed(2),
          isUp: change > 0
        });
      }
    } catch {
      results.push({ symbol, value: 'N/A', change: '', isUp: null });
    }
  }

  res.status(200).json(results);
}
