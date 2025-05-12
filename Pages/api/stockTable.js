const STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];

export default async function handler(req, res) {
  const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
  const results = [];

  for (const symbol of STOCKS) {
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
      const response = await fetch(url);
      const json = await response.json();

      const quote = json['Global Quote'];

      if (!quote || !quote['05. price']) {
        throw new Error('Missing data from Alpha Vantage');
      }

      const price = parseFloat(quote['05. price']).toFixed(2);
      const changePercent = parseFloat(quote['10. change percent'].replace('%', '')).toFixed(2);

      results.push({
        symbol,
        price,
        change: parseFloat(changePercent)
      });
    } catch (error) {
      console.warn(`API failed for ${symbol}, using fallback`);
      // Fallback mock value
      results.push({
        symbol,
        price: (Math.random() * 200 + 100).toFixed(2),
        change: (Math.random() * 2 - 1).toFixed(2) // -1% to +1%
      });
    }
  }

  res.status(200).json(results);
}
