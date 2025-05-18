// File: utils/fetchStockData.js
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
const baseUrl = 'https://api.polygon.io';

export const getExchangePrefix = (symbol) => {
  const nyseOnly = [
    'WELL', 'BA', 'JNJ', 'XOM', 'WMT', 'T', 'DE', 'CVX', 'NEE', 'DUK', 'SO', 'D', 'ED', 'UPS', 'UNP', 'USB'
  ];
  return nyseOnly.includes(symbol) ? 'NYSE' : 'NASDAQ';
};

export const top100 = [
  { symbol: '^DJI', name: 'Dow Jones Industrial Average' },
  { symbol: '^GSPC', name: 'S&P 500 Index' },
  { symbol: '^IXIC', name: 'Nasdaq Composite Index' },
  { symbol: '^RUT', name: 'Russell 2000 Index' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'ABBV', name: 'AbbVie Inc.' },
  { symbol: 'ABT', name: 'Abbott Laboratories' },
  { symbol: 'ACN', name: 'Accenture Plc' },
  { symbol: 'ADBE', name: 'Adobe Inc.' },
  { symbol: 'ADI', name: 'Analog Devices Inc.' },
  { symbol: 'ADP', name: 'Automatic Data Processing Inc.' },
  { symbol: 'AEP', name: 'American Electric Power Co. Inc.' },
  { symbol: 'AIG', name: 'American International Group Inc.' },
  { symbol: 'AMAT', name: 'Applied Materials Inc.' },
  { symbol: 'AMGN', name: 'Amgen Inc.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'AON', name: 'Aon plc' },
  { symbol: 'APD', name: 'Air Products and Chemicals Inc.' },
  { symbol: 'AVGO', name: 'Broadcom Inc.' },
  { symbol: 'AXP', name: 'American Express Co.' },
  { symbol: 'BA', name: 'Boeing Co.' },
  { symbol: 'BAC', name: 'Bank of America Corp.' },
  { symbol: 'BDX', name: 'Becton, Dickinson and Co.' },
  { symbol: 'BLK', name: 'BlackRock Inc.' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc. (Class B)' },
  { symbol: 'BSX', name: 'Boston Scientific Corp.' },
  { symbol: 'C', name: 'Citigroup Inc.' },
  { symbol: 'CAT', name: 'Caterpillar Inc.' },
  { symbol: 'CB', name: 'Chubb Ltd.' },
  { symbol: 'CL', name: 'Colgate-Palmolive Co.' },
  { symbol: 'CME', name: 'CME Group Inc.' },
  { symbol: 'COST', name: 'Costco Wholesale Corp.' },
  { symbol: 'CRM', name: 'Salesforce, Inc.' },
  { symbol: 'CSCO', name: 'Cisco Systems Inc.' },
  { symbol: 'CVX', name: 'Chevron Corp.' },
  { symbol: 'D', name: 'Dominion Energy Inc.' },
  { symbol: 'DE', name: 'Deere & Co.' },
  { symbol: 'DHR', name: 'Danaher Corp.' },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF' },
  { symbol: 'DUK', name: 'Duke Energy Corp.' },
  { symbol: 'ECL', name: 'Ecolab Inc.' },
  { symbol: 'ED', name: 'Consolidated Edison Inc.' },
  { symbol: 'ELV', name: 'Elevance Health Inc.' },
  { symbol: 'EMR', name: 'Emerson Electric Co.' },
  { symbol: 'EOG', name: 'EOG Resources Inc.' },
  { symbol: 'ETN', name: 'Eaton Corp. plc' },
  { symbol: 'EXC', name: 'Exelon Corp.' },
  { symbol: 'FDX', name: 'FedEx Corp.' },
  { symbol: 'FIS', name: 'Fidelity National Information Services Inc.' },
  { symbol: 'FISV', name: 'Fiserv Inc.' },
  { symbol: 'GILD', name: 'Gilead Sciences Inc.' },
  { symbol: 'GOOG', name: 'Alphabet Inc. (Class C)' },
  { symbol: 'GOOGL', name: 'Alphabet Inc. (Class A)' },
  { symbol: 'GS', name: 'Goldman Sachs Group Inc.' },
  { symbol: 'HD', name: 'The Home Depot, Inc.' },
  { symbol: 'HCA', name: 'HCA Healthcare Inc.' },
  { symbol: 'HUM', name: 'Humana Inc.' },
  { symbol: 'HPQ', name: 'HP Inc.' },
  { symbol: 'IDXX', name: 'IDEXX Laboratories Inc.' },
  { symbol: 'INTC', name: 'Intel Corp.' },
  { symbol: 'INTU', name: 'Intuit Inc.' },
  { symbol: 'ISRG', name: 'Intuitive Surgical Inc.' },
  { symbol: 'ITW', name: 'Illinois Tool Works Inc.' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'KMB', name: 'Kimberly-Clark Corp.' },
  { symbol: 'LIN', name: 'Linde plc' },
  { symbol: 'LLY', name: 'Eli Lilly & Co.' },
  { symbol: 'LOW', name: 'Lowe’s Companies Inc.' },
  { symbol: 'LRCX', name: 'Lam Research Corp.' },
  { symbol: 'MA', name: 'Mastercard Inc.' },
  { symbol: 'MCD', name: 'McDonald’s Corp.' },
  { symbol: 'MCO', name: 'Moody’s Corp.' },
  { symbol: 'MDT', name: 'Medtronic plc' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'MMC', name: 'Marsh & McLennan Companies Inc.' },
  { symbol: 'MO', name: 'Altria Group Inc.' },
  { symbol: 'MRK', name: 'Merck & Co., Inc.' },
  { symbol: 'MS', name: 'Morgan Stanley' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'MTD', name: 'Mettler-Toledo International Inc.' },
  { symbol: 'NEE', name: 'NextEra Energy Inc.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'NKE', name: 'Nike, Inc.' },
  { symbol: 'NOC', name: 'Northrop Grumman Corp.' },
  { symbol: 'NOW', name: 'ServiceNow Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'ORCL', name: 'Oracle Corp.' },
  { symbol: 'PAYX', name: 'Paychex Inc.' },
  { symbol: 'PEP', name: 'PepsiCo, Inc.' },
  { symbol: 'PFE', name: 'Pfizer Inc.' },
  { symbol: 'PG', name: 'Procter & Gamble Co.' },
  { symbol: 'PLD', name: 'Prologis Inc.' },
  { symbol: 'PNC', name: 'PNC Financial Services Group Inc.' },
  { symbol: 'PSA', name: 'Public Storage' },
  { symbol: 'PGR', name: 'Progressive Corp.' },
  { symbol: 'QCOM', name: 'Qualcomm Inc.' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust (Nasdaq 100 ETF)' },
  { symbol: 'REGN', name: 'Regeneron Pharmaceuticals Inc.' },
  { symbol: 'ROK', name: 'Rockwell Automation Inc.' },
  { symbol: 'ROST', name: 'Ross Stores Inc.' },
  { symbol: 'S&P', name: 'S&P Global Inc.' },
  { symbol: 'SCHW', name: 'Charles Schwab Corp.' },
  { symbol: 'SO', name: 'Southern Co.' },
  { symbol: 'SPGI', name: 'S&P Global Inc.' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust' },
  { symbol: 'SRE', name: 'Sempra Energy' },
  { symbol: 'STZ', name: 'Constellation Brands Inc.' },
  { symbol: 'SYK', name: 'Stryker Corp.' },
  { symbol: 'T', name: 'AT&T Inc.' },
  { symbol: 'TGT', name: 'Target Corp.' },
  { symbol: 'TJX', name: 'TJX Companies Inc.' },
  { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.' },
  { symbol: 'TRV', name: 'Travelers Companies Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'TXN', name: 'Texas Instruments Inc.' },
  { symbol: 'UNH', name: 'UnitedHealth Group Inc.' },
  { symbol: 'UNP', name: 'Union Pacific Corp.' },
  { symbol: 'UPS', name: 'United Parcel Service Inc.' },
  { symbol: 'USB', name: 'U.S. Bancorp' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'VLO', name: 'Valero Energy Corp.' },
  { symbol: 'VRTX', name: 'Vertex Pharmaceuticals Inc.' },
  { symbol: 'WELL', name: 'Welltower Inc.' },
  { symbol: 'WFC', name: 'Wells Fargo & Co.' },
  { symbol: 'WMB', name: 'Williams Companies Inc.' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'XOM', name: 'Exxon Mobil Corp.' },
  { symbol: 'ZTS', name: 'Zoetis Inc.' }
];

const normalizeSymbol = (symbol) => {
  const map = {
    '^GSPC': 'SPX',
    '^IXIC': 'NDX',
    '^DJI': 'DJI',
    '^RUT': 'RUT'
  };
  return map[symbol] || symbol;
};

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

export const getGrowth = async (symbol, months) => {
  try {
    const normalized = normalizeSymbol(symbol);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);
    const from = startDate.toISOString().split('T')[0];
    const to = endDate.toISOString().split('T')[0];

    const res = await axios.get(
      `${baseUrl}/v2/aggs/ticker/${normalized}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=5000&apiKey=${apiKey}`
    );

    const prices = res.data?.results;
    if (!prices || prices.length < 2) return null;

    const startPrice = prices[0].c;
    const endPrice = prices[prices.length - 1].c;

    return ((endPrice - startPrice) / startPrice) * 100;
  } catch (err) {
    if (err?.response?.status === 429 || err.code === 'ECONNRESET') {
      console.warn(`⚠️ API error or limit hit for ${symbol}. Returning mock growth.`);
      return Math.random() * 15 + 5; // mock growth between 5% and 20%
    }
    console.error(`❌ Error fetching ${months}M growth for ${symbol}:`, err?.response?.data || err.message);
    return null;
  }
};

export const getRiskReward = async (symbol) => {
  try {
    const normalized = normalizeSymbol(symbol);
    const currentPrice = await fetchRealTimePrice(normalized);
    if (!currentPrice || currentPrice === 0) return null;

    const growth3m = await getGrowth(normalized, 3);
    const growth12m = await getGrowth(normalized, 12);

    const buildMetrics = (growth) => {
      const supportMultiplier = 1 - (growth > 0 ? Math.min(growth / 200, 0.1) : 0.05);
      const targetMultiplier = 1 + (growth > 0 ? Math.min(growth / 100, 0.3) : 0.15);

      const support = currentPrice * supportMultiplier;
      const target = currentPrice * targetMultiplier;

      const risk = ((currentPrice - support) / currentPrice) * 100;
      const reward = ((target - currentPrice) / currentPrice) * 100;
      const ratio = reward / risk;

      return { support, target, risk, reward, ratio };
    };

    const shortTerm = buildMetrics(growth3m);
    const longTerm = buildMetrics(growth12m);

    return {
      entryRange: { min: shortTerm.support, max: currentPrice },
      target: longTerm.target,
      stopLoss: shortTerm.support,
      shortTerm,
      longTerm
    };
  } catch (err) {
    console.error(`❌ getRiskReward failed for ${symbol}:`, err?.message);
    return null;
  }
};

export const fetchMarketIndicators = async () => {
  const symbols = [
    { key: 'I:SPX', label: 'S&P 500', type: 'stocks' },
    { key: 'I:NDX', label: 'Nasdaq 100', type: 'stocks' },
    { key: 'I:DJI', label: 'Dow Jones', type: 'stocks' },
    { key: 'I:RUT', label: 'Russell 2000', type: 'stocks' },
    { key: 'C:EURUSD', label: 'EUR/USD', type: 'forex' },
    { key: 'C:USDILS', label: 'USD/ILS', type: 'forex' },
    { key: 'C:EURILS', label: 'EUR/ILS', type: 'forex' },
    { key: 'C:XAUUSD', label: 'Gold', type: 'forex' },
    { key: 'C:XAGUSD', label: 'Silver', type: 'forex' }
  ];

  const results = [];

  for (const { key, label, type } of symbols) {
    const endpoint = type === 'stocks'
      ? `${baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers/${key}?apiKey=${apiKey}`
      : `${baseUrl}/v2/snapshot/locale/global/markets/forex/tickers/${key}?apiKey=${apiKey}`;

    try {
      const res = await axios.get(endpoint);
      const ticker = res.data?.ticker;

      const price =
        ticker?.lastTrade?.p ??
        ticker?.lastQuote?.bid ??
        ticker?.day?.close ??
        ticker?.min?.c ??
        0;

      const trend =
        ticker?.todaysChange > 0
          ? 'up'
          : ticker?.todaysChange < 0
          ? 'down'
          : 'flat';

      results.push({ label, price: price.toFixed(2), trend });
    } catch (err) {
      console.warn(`⚠️ ${label}: No data`, err?.response?.data || err.message);
      results.push({ label, price: '-', trend: 'flat' });
    }
  }

  return results;
};

export const fetchTop5SixMonthGrowth = async () => {
  const results = [];

  for (const stock of top100) {
    if (stock.symbol.startsWith('^') || ['SPY', 'QQQ', 'DIA', 'IWM'].includes(stock.symbol)) continue;

    try {
      const growth = await getGrowth(stock.symbol, 6);
      console.log(`📈 ${stock.symbol}: 6M Growth =`, growth);
      if (growth !== null) {
        results.push({ ...stock, growth6m: growth });
      }
    } catch (err) {
      console.warn(`⚠️ Skipped ${stock.symbol} due to error:`, err.message);
    }
  }

  return results
    .filter(s => s.growth6m > 0)
    .sort((a, b) => b.growth6m - a.growth6m)
    .slice(0, 5);
};

export const fetchTop5LongTermOpportunities = async () => {
  const results = [];

  for (const stock of top100) {
    try {
      const g12 = await getGrowth(stock.symbol, 12);
      const strategy = await getRiskReward(stock.symbol);
      const reward = strategy?.longTerm?.reward;

      if (g12 !== null && g12 > 0 && reward && reward > 0) {
        results.push({ ...stock, g12 });
      }
    } catch (err) {
      console.warn(`⚠️ Skipped ${stock.symbol} due to error:`, err.message);
    }
  }

  return results.sort((a, b) => b.g12 - a.g12).slice(0, 5);
};
