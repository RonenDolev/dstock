// components/Ticker.js
import { useEffect, useState } from 'react';
import styles from '../styles/Ticker.module.css';

export default function Ticker() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const res = await fetch('/api/stockTicker');
        const data = await res.json();
        setStocks(data);
      } catch (err) {
        console.error('Error fetching ticker:', err);
      }
    };

    fetchTicker();
    const interval = setInterval(fetchTicker, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.ticker}>
      <h4>Live Ticker</h4>
      <ul>
        {stocks.map((stock, i) => (
          <li key={i} style={{ color: stock.isUp ? 'green' : stock.isUp === false ? 'red' : 'gray' }}>
            {stock.symbol}: ${stock.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
