// File: components/Top5Table.js

import { useEffect, useState } from 'react';

export default function Top5Table() {
  const [stocks, setStocks] = useState([]);

  const fetchTop5 = async () => {
    try {
      const res = await fetch('/api/top5Scanner');
      const data = await res.json();
      setStocks(data);
    } catch (err) {
      console.error('Failed to fetch Top 5 stocks:', err);
    }
  };

  useEffect(() => {
    fetchTop5();
    const interval = setInterval(fetchTop5, 60000); // every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
        Top 5 Stocks to Watch
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc' }}>
            <th>Symbol</th>
            <th>Price</th>
            <th>6M Growth</th>
            <th>Return</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
              <td>{s.symbol}</td>
              <td>${s.currentPrice}</td>
              <td style={{ color: s.growth > 0 ? 'green' : 'red' }}>{s.growth}%</td>
              <td>{s.projectedReturn}%</td>
              <td><strong>{s.recommendation}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
