
import axios from 'axios';
import { stockList } from './stockList';

const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
console.log("🔑 Loaded API Key:", apiKey);

// Fetch real-time price from server-side API
export const fetchRealTimePrice = async (symbol) => {
  try {
    const res = await fetch(`/api/price?symbol=${symbol}`);
    const data = await res.json();
    if (!data.price) {
      console.warn(`⚠️ No price returned for ${symbol}`);
      return 0;
    }
    console.log(`✅ Live price from server for ${symbol}: $${data.price}`);
    return data.price;
  } catch (err) {
    console.error(`❌ Error fetching real-time price for ${symbol}:`, err?.message);
    return 0;
  }
};

// Calculate growth % over N months using Polygon.io historical data
export const getGrowth = async (symbol, months = 6) => {
  try {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);

    const from = start.toISOString().split('T')[0];
    const to = end.toISOString().split('T')[0];

    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;
    const res = await axios.get(url);
    const prices = res.data?.results || [];

    if (prices.length < 2) return null;
    const first = prices[0].c;
    const last = prices[prices.length - 1].c;
    const growth = ((last - first) / first) * 100;

    return growth;
  } catch (err) {
    console.warn(`⚠️ Growth fetch error for ${symbol}:`, err?.message);
    return null;
  }
};

// Return top 5 stocks with best 6-month growth
export const fetchTop5SixMonthGrowth = async () => {
  const growthData = await Promise.all(
    stockList.map(async (stock) => {
      const growth = await getGrowth(stock.symbol, 6);
      return {
        ...stock,
        growth6m: growth !== null ? growth : -Infinity
      };
    })
  );

  return growthData
    .filter(s => s.growth6m > 0)
    .sort((a, b) => b.growth6m - a.growth6m)
    .slice(0, 5);
};

// Estimate risk/reward ranges for entry/exit
export const getRiskReward = async (symbol) => {
  const price = await fetchRealTimePrice(symbol);
  if (!price) return null;

  const entryRange = { min: price * 0.97, max: price * 1.02 };
  const target = price * 1.15;
  const stopLoss = price * 0.95;

  const risk = ((price - stopLoss) / price) * 100;
  const reward = ((target - price) / price) * 100;
  const ratio = reward / risk;

  return {
    entryRange,
    target,
    stopLoss,
    shortTerm: { risk, reward, ratio },
    longTerm: { risk, reward: reward * 2, ratio: (reward * 2) / risk }
  };
};

// Fetch global market indicators like USD/EUR, SPY, etc.
export const fetchMarketIndicators = async () => {
  const symbols = [
    { key: 'SPY', label: 'S&P 500' },
    { key: 'QQQ', label: 'Nasdaq 100' },
    { key: 'DIA', label: 'Dow Jones' },
    { key: 'IWM', label: 'Russell 2000' },
    { key: 'C:EURUSD', label: 'USD/EUR' },
    { key: 'C:USDILS', label: 'ILS/USD' },
    { key: 'C:EURILS', label: 'ILS/EUR' },
    { key: 'C:XAUUSD', label: 'Gold' },
    { key: 'C:XAGUSD', label: 'Silver' }
  ];

  const results = await Promise.all(
    symbols.map(async ({ key, label }) => {
      try {
        const url = `https://api.polygon.io/v2/aggs/ticker/${key}/prev?adjusted=true&apiKey=${apiKey}`;
        const res = await axios.get(url);
        const { o, c } = res.data?.results?.[0] || {};
        const change = o && c ? ((c - o) / o) * 100 : 0;
        const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';

        return {
          label,
          price: c ? c.toFixed(2) : '-',
          change: change.toFixed(2),
          trend
        };
      } catch (err) {
        console.warn(`⚠️ ${label}: No data`, err?.response?.data || err.message);
        return { label, price: '-', trend: 'flat' };
      }
    })
  );

  return results;
};
