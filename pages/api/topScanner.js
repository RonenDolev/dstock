// File: /pages/api/topScanner.js
import fs from 'fs';
import path from 'path';
import { getGrowth, fetchRealTimePrice } from '../../utils/fetchStockData';
import { top100 } from '../../utils/fetchStockData';

const CACHE_PATH = path.resolve('./public/top-stocks.json');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const shortTerm = [];
  const longTerm = [];
  const seen = new Set();

  const start = Math.floor(Math.random() * 50);
  const sample = top100.slice(start, start + 50);

  for (const stock of sample) {
    try {
      const g6 = await getGrowth(stock.symbol, 6);
      const g12 = await getGrowth(stock.symbol, 12);
      const price = await fetchRealTimePrice(stock.symbol);

      if (!price || price === 0) {
        console.log(`⏭ Skipping ${stock.symbol}: Invalid price = ${price}`);
        continue;
      }
      if (g6 == null || g12 == null) {
        console.log(`⏭ Skipping ${stock.symbol}: Missing growth data g6=${g6}, g12=${g12}`);
        continue;
      }
      if (g6 === 9.99 && g12 === 9.99) {
        console.log(`⏭ Skipping ${stock.symbol}: Fallback-only growth`);
        continue;
      }
      if (seen.has(stock.symbol)) {
        console.log(`⏭ Skipping ${stock.symbol}: Already processed`);
        continue;
      }

      seen.add(stock.symbol);
      console.log(`✅ Processing ${stock.symbol} | g6=${g6}, g12=${g12}, price=${price}`);

      if (g6 > 7) {
        shortTerm.push({
          symbol: stock.symbol,
          name: stock.name,
          price,
          change: g6,
          profit: g6.toFixed(2),
          recommendation: g12 > 15 ? 'Buy' : g12 > 5 ? 'Hold' : 'Sell'
        });
      }

      if (g12 > 15) {
        longTerm.push({
          symbol: stock.symbol,
          name: stock.name,
          price,
          change: g12,
          profit: g12.toFixed(2),
          recommendation: 'Buy'
        });
      }
    } catch (err) {
      console.warn(`⚠️ Error scanning ${stock.symbol}:`, err.message);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  const result = {
    timestamp: new Date().toISOString(),
    shortTerm: shortTerm.slice(0, 5),
    longTerm: longTerm.slice(0, 5)
  };

  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(result, null, 2));
    console.log('✅ Cached top stocks to public/top-stocks.json');
  } catch (err) {
    console.error('❌ Failed to write cache:', err.message);
  }

  res.status(200).json(result);
}