import { useEffect, useState } from 'react';

export default function StockTable() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/stockTable');
        const data = await res.json();
        setStocks(data);
      } catch (err) {
        console.error('Failed to fetch stock data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      marginTop: '30px',
      fontFamily: 'Bahnschrift',
      fontSize: '12px',
      backgroundColor: '#ffffff',
      padding: '15px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{
        fontSize: '18px',
        marginBottom: '15px',
        fontFamily: 'Bahnschrift',
        color: '#231F20'
      }}>
        NASDAQ Stock Market Top 5
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ textAlign: 'left', padding: '6px' }}>Symbol</th>
            <th style={{ textAlign: 'left', padding: '6px' }}>Price</th>
            <th style={{ textAlign: 'left', padding: '6px' }}>Change</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol}>
              <td style={{ padding: '6px' }}>{stock.symbol}</td>
              <td style={{ padding: '6px' }}>${stock.price}</td>
              <td style={{
                padding: '6px',
                color: stock.change >= 0 ? '#008A40' : '#B92027'
              }}>
                {stock.change >= 0 ? '↑' : '↓'} {stock.change}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
