
const API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

export async function fetchStockPrice(symbol) {
  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch price data");
  const data = await res.json();
  return data.results[0]; // Includes c (close), o (open), h (high), l (low), v (volume)
}
