// pages/api/marketData.js
export default async function handler(req, res) {
  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

  const symbols = {
    'S&P 500': 'I:SPX',
    'Nasdaq 100': 'I:NDX',
    'Dow Jones': 'I:DJI',
    'Russell 2000': 'I:RUT',
    'Gold': 'X:AUUSD',
    'Silver': 'X:AGUSD',
    'EUR/USD': 'C:EURUSD',
    'EUR/ILS': 'C:EURILS',
    'USD/ILS': 'C:USDILS'
  };

  const results = [];

  for (const [name, symbol] of Object.entries(symbols)) {
    try {
      const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`;
      const response = await fetch(url);
      const json = await response.json();
      const data = json.results?.[0];

      if (data) {
        const change = data.c - data.o;
        results.push({
          name,
          value: data.c.toFixed(2),
          change: change.toFixed(2),
          isUp: change > 0
        });
      } else {
        results.push({ name, value: 'N/A', change: '', isUp: null });
      }
    } catch (err) {
      results.push({ name, value: 'Error', change: '', isUp: null });
    }
  }

  res.status(200).json(results);
}
