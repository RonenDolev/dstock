import React from 'react';

export default function LongTermChart({ symbol }) {
  return (
    <div style={{ background: '#fff', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '10px' }}>Long-Term Weekly Chart</h3>
      <iframe
        src={`https://s.tradingview.com/widgetembed/?symbol=NASDAQ:${symbol}&interval=W&theme=light&style=1&locale=en&studies=MACD%40tv-basicstudies,RSI%40tv-basicstudies,IchimokuCloud%40tv-basicstudies,MA%20Exp%201@tv-basicstudies,Volume%40tv-basicstudies`}
        width="100%"
        height="400"
        frameBorder="0"
        allowFullScreen
        title="Long-Term Chart"
      />
    </div>
  );
}
