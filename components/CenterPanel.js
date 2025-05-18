import React, { useEffect, useRef } from 'react';
import { getExchangePrefix } from '../utils/fetchStockData';

// Use ETF alternatives for index symbols to avoid TradingView restrictions
const getTradingViewSymbol = (symbol) => {
  const map = {
    '^GSPC': 'AMEX:SPY',
    '^IXIC': 'NASDAQ:QQQ',
    '^DJI': 'AMEX:DIA',
    '^RUT': 'AMEX:IWM'
  };
  if (map[symbol]) return map[symbol];
  return `${getExchangePrefix(symbol)}:${symbol}`;
};

const CenterPanel = ({ selectedStock }) => {
  const shortTermRef = useRef(null);

  useEffect(() => {
    if (!selectedStock || !shortTermRef.current) return;

    const tvSymbol = getTradingViewSymbol(selectedStock);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `${tvSymbol}`,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      studies: [
        "MACD@tv-basicstudies",
        "RSI@tv-basicstudies",
        "BB@tv-basicstudies",
        "Fibonacci Retracemnt@tv-basicstudies"
      ],
      enable_publishing: false,
      hide_top_toolbar: false,
      allow_symbol_change: false,
      container_id: shortTermRef.current.id
    });

    shortTermRef.current.innerHTML = "";
    shortTermRef.current.appendChild(script);
  }, [selectedStock]);

  return (
    <div style={{ width: '100%', padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h2 style={{ fontSize: '28px', fontFamily: 'Bahnschrift Light', marginBottom: '30px' }}>Technical Chart</h2>

      <div id="short-term-chart" ref={shortTermRef} style={{ height: '620px', marginBottom: '20px' }} />

      <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.6' }}>
        <strong>🛈 Tip:</strong> <br />
        1. The chart shows how the stock moves and helps spot useful signals. <br />
        2. When the <strong>MACD lines cross upward</strong>, it's often a sign the stock may go up. <br />
        3. If the <strong>RSI number is above 50</strong>, it suggests strength or buying momentum. <br />
        4. <strong>Green candlesticks</strong> (longer than red ones) often mean the price is rising steadily. <br />
        5. Our system looks at these signals to suggest if it's a good time to <strong>Buy</strong>, <strong>Hold</strong>, or <strong>Sell</strong> — using both the price trend and how strong the move is.
      </p>
    </div>
  );
};

export default CenterPanel;
