// File: pages/api/top5Scanner.js

const axios = require('axios');

const STOCK_LIST = [ // 100 curated tickers
  "AAPL", "MSFT", "GOOG", "AMZN", "META", "NVDA", "TSLA", "NFLX", "AMD", "INTC",
  "ADBE", "CSCO", "QCOM", "AVGO", "TXN", "CRM", "ORCL", "IBM", "MU", "AMAT",
  "LRCX", "KLAC", "ADI", "NXPI", "MRVL", "ZM", "SNOW", "SHOP", "PYPL", "SQ",
  "PLTR", "DDOG", "CRWD", "DOCU", "ZS", "MDB", "NET", "FSLY", "OKTA", "BILL",
  "SPLK", "TWLO", "ROKU", "TEAM", "ASML", "WDAY", "PANW", "S", "U", "AI",
  "TSM", "BABA", "JD", "PDD", "BIDU", "NTES", "TCEHY", "VIPS", "YNDX", "SE",
  "MELI", "GLBE", "WIX", "FVRR", "UPWK", "ETSY", "EBAY", "PINS", "SNAP", "TWTR",
  "UBER", "LYFT", "DASH", "ABNB", "COIN", "ROKU", "INTU", "ENPH", "SQ", "SPOT",
  "ZM", "PATH", "HOOD", "AFRM", "RBLX", "TTD", "DOCN", "BMBL", "APPN", "ESTC",
  "PD", "ZI", "CFLT", "GTLB", "SAMS", "LUMN", "CNXC", "EXAS", "HIMS", "UPST"
];

const API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

async function fetchStockData(symbol) {
  try {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 6);

    const res = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from.toISOString().split('T')[0]}/${to.toISOString().split('T')[0]}?adjusted=true&sort=asc&limit=1&apiKey=${API_KEY}`);

    const results = res.data.results;
    if (!results || results.length < 2) return null;

    const startPrice = results[0].o;
    const endPrice = results[results.length - 1].c;
    const growth = ((endPrice - startPrice) / startPrice) * 100;

    const strategy = growth > 10 ? 'Buy' : growth > 0 ? 'Hold' : 'Sell';
    const recommendation = strategy === 'Buy' ? '🟢 Buy' : strategy === 'Hold' ? '🟠 Hold' : '🔴 Sell';
    const projectedReturn = strategy === 'Buy' ? growth * 0.7 : 0;

    return {
      symbol,
      currentPrice: endPrice.toFixed(2),
      growth: growth.toFixed(2),
      strategy,
      projectedReturn: projectedReturn.toFixed(2),
      recommendation
    };
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  const allData = await Promise.all(STOCK_LIST.map(symbol => fetchStockData(symbol)));
  const valid = allData.filter(s => s && s.strategy === 'Buy');
  const top5 = valid.sort((a, b) => b.projectedReturn - a.projectedReturn).slice(0, 5);
  res.status(200).json(top5);
}
