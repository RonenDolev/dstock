import React, { useState, useEffect } from 'react';

export default function ShortTermChart({ symbol, setIndicators }) {
  const [interval, setInterval] = useState('D'); // Default: Daily

  useEffect(() => {
    // Simulated indicator updates
    setIndicators({
      macd: 'bullish',
      rsi: 42,
      pattern: 'doji',
      trend: 'flat',
    });
  }, [symbol, setIndicators]);

  const intervals = {
    '1D': '1',
    '1W': '5',
    '1M': '15',
    '3M': '60',
    '6M': 'D',
    '1Y': 'W',
    '5Y': 'M',
  };

  return (
    <div style={{ background: '#fff', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
      <h3>Short-Term Daily Chart</h3>
      
      <div style={{ marginBottom: '10px' }}>
        {Object.keys(intervals).map(label => (
          <button
            key={label}
            onClick={() => setInterval(intervals[label])}
            style={{
              marginRight: '8px',
              padding: '4px 8px',
              backgroundColor: interval === intervals[label] ? '#555' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <iframe
        key={symbol + interval}
        src={`https://s.tradingview.com/widgetembed/?symbol=NASDAQ:${symbol}&interval=${interval}&theme=light&style=1&locale=en&studies=MACD%40tv-basicstudies,RSI%40tv-basicstudies,BollingerBands%40tv-basicstudies,Volume%40tv-basicstudies`}
        width="100%"
        height="400"
        frameBorder="0"
        allowFullScreen
        title="Short-Term Chart"
      />
    </div>
  );
}
