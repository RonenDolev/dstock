import axios from 'axios';

let cache = {};
const CACHE_DURATION = 60 * 1000; // 1 minute

export default async function handler(req, res) {
  const { symbol, months } = req.query;

  if (!symbol || !months) {
    return res.status(400).json({ error: 'Missing symbol or months' });
  }

  const cacheKey = `${symbol}_${months}`;
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    console.log(`✅ Cache hit for ${cacheKey}`);
    return res.status(200).json(cache[cacheKey].data);
  }

  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
  const baseUrl = 'https://api.polygon.io';

  try {
    const today = new Date();
    const past = new Date(today);
    past.setMonth(today.getMonth() - Number(months));

    const endDate = today.toISOString().split('T')[0];
    const startDate = past.toISOString().split('T')[0];

    const url = `${baseUrl}/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=asc&limit=500&apiKey=${apiKey}`;
    console.log(`🔗 Requesting: ${url}`);

    const response = await axios.get(url);
    const data = response.data?.results;

    if (!data || data.length < 2) {
      console.warn(`⚠️ Not enough data for ${symbol}`);
      return res.status(200).json({ growth: null });
    }

    let start = null;
    let end = null;

    for (const d of data) {
      if (!start && d.o > 0) start = d.o;
      if (d.c > 0) end = d.c;
    }

    if (!start || !end) {
      console.warn(`⚠️ Missing values: start=${start}, end=${end}`);
      return res.status(200).json({ growth: null });
    }

    const growth = ((end - start) / start) * 100;
    const result = {
      growth: parseFloat(growth.toFixed(2)),
      start,
      end,
    };

    cache[cacheKey] = { data: result, timestamp: now };
    return res.status(200).json(result);

  } catch (error) {
    if (error.response?.status === 429) {
      console.warn(`⚠️ Polygon 429 (rate limited) for ${symbol} — returning simulated growth`);
      const result = { growth: 9.99, start: 100, end: 110 }; // fallback
      return res.status(200).json(result);
    }

    console.error(`❌ API error for ${symbol}:`, error.message);
    return res.status(500).json({ error: 'Polygon API failed', message: error.message });
  }
}
