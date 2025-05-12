// components/LeftPanel.tsx
import { useState } from 'react';
import styles from '../styles/LeftPanel.module.css';
import Ticker from './Ticker';

const STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' }
];

export default function LeftPanel() {
  const [selectedStock, setSelectedStock] = useState(STOCKS[0].symbol);
  const [amount, setAmount] = useState(100);

  return (
    <div className={styles.leftPanel}>
      <h2 className={styles.panelTitle}>Stock Analysis Tools</h2>

      <label className={styles.label}>Select Stock:</label>
      <select
        value={selectedStock}
        onChange={(e) => setSelectedStock(e.target.value)}
        className={styles.dropdown}
      >
        {STOCKS.map((stock) => (
          <option key={stock.symbol} value={stock.symbol}>
            {stock.name} ({stock.symbol})
          </option>
        ))}
      </select>

      <label className={styles.label}>Amount of Investment:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className={styles.input}
      />

      <div className={styles.buttonRow}>
        <button className={styles.buyButton}>Buy</button>
        <button className={styles.sellButton}>Sell</button>
      </div>

      <button className={styles.analyzeButton}>Analyze</button>

      <Ticker />
    </div>
  );
}
