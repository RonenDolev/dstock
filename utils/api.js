export async function fetchStockData(symbol) {
  try {
    const res = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2024-10-01/2025-05-01?adjusted=true&sort=desc&limit=60&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`);
    const data = await res.json();
    return data.results.map(item => ({
      open: item.o,
      high: item.h,
      low: item.l,
      close: item.c,
      volume: item.v,
      time: item.t
    }));
  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    return [];
  }
}
