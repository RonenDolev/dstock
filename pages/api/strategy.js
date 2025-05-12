function calculateEMA(data, period) {
  const k = 2 / (period + 1);
  let ema = [data[0]];

  for (let i = 1; i < data.length; i++) {
    ema[i] = data[i] * k + ema[i - 1] * (1 - k);
  }

  return ema;
}

function calculateMACD(closePrices) {
  const ema12 = calculateEMA(closePrices, 12);
  const ema26 = calculateEMA(closePrices, 26);
  const macd = ema12.map((val, i) => val - (ema26[i] || 0));
  const signal = calculateEMA(macd, 9);
  return { macd, signal };
}

function calculateRSI(closes, period = 14) {
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const delta = closes[i] - closes[i - 1];
    if (delta >= 0) gains += delta;
    else losses -= delta;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < closes.length; i++) {
    const delta = closes[i] - closes[i - 1];
    if (delta >= 0) {
      avgGain = (avgGain * (period - 1) + delta) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - delta) / period;
    }
  }

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function detectBullishEngulfing(candles) {
  if (candles.length < 2) return false;
  const prev = candles[candles.length - 2];
  const last = candles[candles.length - 1];

  const isBearishPrev = prev.c < prev.o;
  const isBullishLast = last.c > last.o;
  const engulfed = last.o < prev.c && last.c > prev.o;

  return isBearishPrev && isBullishLast && engulfed;
}

export default async function handler(req, res) {
  const { symbol, investment } = req.query;
  const key = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

  if (!symbol || !investment) {
    return res.status(400).json({ error: 'Missing parameters.' });
  }

  const end = new Date().toISOString().split('T')[0];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 60);
  const start = startDate.toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${start}/${end}?adjusted=true&sort=asc&limit=60&apiKey=${key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length < 30) {
      return res.status(500).json({ error: 'Not enough data' });
    }

    const candles = data.results;
    const closes = candles.map((c) => c.c);

    // Trend %
    const change = ((closes.at(-1) - closes[0]) / closes[0]) * 100;

    // Technical indicators
    const rsi = calculateRSI(closes);
    const { macd, signal } = calculateMACD(closes);
    const macdCrossover = macd.at(-1) > signal.at(-1) && macd.at(-2) <= signal.at(-2);
    const isBullishPattern = detectBullishEngulfing(candles);

    // Combine logic
    let score = 0;
    if (change > 0) score++;
    if (rsi > 50) score++;
    if (macdCrossover) score++;
    if (isBullishPattern) score++;

    let recommendation = 'Hold';
    if (score >= 3) recommendation = 'Buy';
    else if (score <= 1) recommendation = 'Sell';

    const shortTerm = (investment * (change / 100)).toFixed(2);
    const longTerm = (investment * (change / 100) * 2).toFixed(2);

    res.status(200).json({
      symbol,
      change: change.toFixed(2),
      recommendation,
      shortTerm,
      longTerm,
      reason: `Score: ${score}/4 → RSI=${rsi.toFixed(1)}, MACD=${macdCrossover ? 'Bullish' : 'Neutral'}, Pattern=${isBullishPattern ? 'Yes' : 'No'}`,
      rsiValue: rsi,
      macdSeries: macd.slice(-10) // for sparkline
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Strategy API failed.' });
  }
}
