// File: components/LeftPanel.js
import React, { useState, useEffect } from 'react';
import {
  fetchRealTimePrice,
  getGrowth,
  fetchTop5SixMonthGrowth,
  getRiskReward,
  fetchMarketIndicators
} from '../utils/fetchStockData';

import { stockList } from '../utils/stockList';
import { getExchangePrefix } from '../utils/stockList';


const LOCAL_STORAGE_KEY = 'investmentTable';

function saveToLocalStorage(data) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

const updatePortfolioPrices = async (portfolio, setPortfolio) => {
  const updated = await Promise.all(
    portfolio.map(async (p) => {
      const livePrice = await fetchRealTimePrice(p.symbol);
      const newValue = livePrice * p.amount;
      const originalCost = p.amount * p.price;
      const profit = newValue - originalCost;
      const percentChange = originalCost > 0 ? ((newValue - originalCost) / originalCost) * 100 : 0;
      return {
        ...p,
        currentPrice: livePrice,
        value: newValue,
        profit,
        percentChange
      };
    })
  );

  setPortfolio(updated);
  saveToLocalStorage(updated);
};

  const LeftPanel = ({ onStockSelect, setAnalysis }) => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [amount, setAmount] = useState(100);
  const [portfolio, setPortfolio] = useState([]);
  const [top5Short, setTop5Short] = useState([]);
  const [top5Long, setTop5Long] = useState([]);
  const [indicators, setIndicators] = useState([]);

  const usdRate = (() => {
    const usd = indicators.find(i => i.label === 'USD/ILS')?.price;
    const parsed = parseFloat(usd);
    return isNaN(parsed) ? 3.7 : parsed;
  })();

  useEffect(() => {
    const stored = loadFromLocalStorage();
    if (stored.length) {
      setPortfolio(stored);
      updatePortfolioPrices(stored, setPortfolio);
    }
  }, []);

  useEffect(() => {
    const loadIndicators = async () => {
      const data = await fetchMarketIndicators();
      setIndicators(data);
    };
    loadIndicators();
  }, []);


  useEffect(() => {
    if (typeof onStockSelect === 'function') onStockSelect(selectedSymbol);
  }, [selectedSymbol, onStockSelect]);

  useEffect(() => {
    const computeTopStocks = async () => {
      const topShort = await fetchTop5SixMonthGrowth();

      const longCandidates = await Promise.all(
        stockList.map(async (s) => {
          const g12 = await getGrowth(s.symbol, 12);
          const strategyData = await getRiskReward(s.symbol);
          const rr = strategyData?.longTerm?.reward;
          if (g12 !== null && rr !== null) {
            return { ...s, g12 };
          }
          return null;
        })
      );

      const validLong = longCandidates
        .filter(Boolean)
        .sort((a, b) => b.g12 - a.g12)
        .slice(0, 5);

        console.log("✅ Long-Term Stocks After Filtering:", validLong);


      setTop5Short(topShort);
      setTop5Long(validLong);
    };
    computeTopStocks();
  }, []);

  const handleBuy = async () => {
    const price = await fetchRealTimePrice(selectedSymbol);
    const quantity = amount / price;
    let updated = [...portfolio];
    const existing = updated.find(p => p.symbol === selectedSymbol);
    if (existing) {
      existing.amount += quantity;
    } else {
      updated.push({ symbol: selectedSymbol, amount: quantity, price });
    }
    setPortfolio(updated);
    saveToLocalStorage(updated);
    updatePortfolioPrices(updated, setPortfolio);
  };

  const handleSell = async () => {
    let updated = portfolio.map(p =>
      p.symbol === selectedSymbol ? { ...p, amount: p.amount - (amount / p.price) } : p
    ).filter(p => p.amount > 0);
    setPortfolio(updated);
    saveToLocalStorage(updated);
    updatePortfolioPrices(updated, setPortfolio);
  };

  const deleteRow = (symbol) => {
    const updated = portfolio.filter(p => p.symbol !== symbol);
    setPortfolio(updated);
    saveToLocalStorage(updated);
  };

  const tableStyle = {
    width: '100%', fontSize: '12px', borderCollapse: 'collapse', border: '1px solid #ccc'
  };
  const cellStyle = {
    border: '1px solid #ccc', padding: '6px', textAlign: 'left'
  };

  if (!Array.isArray(stockList)) {
    return <div style={{ padding: '20px', color: 'red' }}>⚠️ Stock list failed to load. Please check data source.</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', fontFamily: 'Bahnschrift Light' }}>
      <h2 style={{ fontSize: '36px', color: 'black', marginBottom: '20px' }}>Stock Analysis Tools</h2>

      <label style={{ fontSize: '14px' }}>Select Stock</label>
      <select
        value={selectedSymbol}
        onChange={e => setSelectedSymbol(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '14px' }}>
        {stockList.map(p => (
          <option key={p.symbol} value={p.symbol}>{p.symbol} - {p.name}</option>
        ))}
      </select>

      <label style={{ fontSize: '14px' }}>Amount of Investment (₪)</label><br />
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
        style={{ width: '50%', padding: '8px', fontSize: '14px', marginBottom: '10px' }}
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button style={{ flex: 1, backgroundColor: 'green', color: 'white', padding: '10px', fontWeight: 'bold' }} onClick={handleBuy}>Buy</button>
        <button style={{ flex: 1, backgroundColor: 'red', color: 'white', padding: '10px', fontWeight: 'bold' }} onClick={handleSell}>Sell</button>
      </div>

      <h4 style={{ fontSize: '16px', marginBottom: '6px' }}>Top 5 Leading Stocks (Past 6-Month)</h4>
      <table style={{ ...tableStyle, marginBottom: '20px' }}>
        <thead><tr><th style={cellStyle}>Symbol</th><th style={cellStyle}>Name</th><th style={cellStyle}>Growth</th></tr></thead>
        <tbody>
          {top5Short.map((s, i) => (
            <tr key={i}>
              <td style={cellStyle}>{s.symbol}</td>
              <td style={cellStyle}>{s.name}</td>
              <td style={{ ...cellStyle, color: 'green' }}>{s.growth6m?.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{ fontSize: '16px', marginBottom: '6px' }}>Top 5 Long-Term (1Y) Buy Opportunities</h4>
      <table style={{ ...tableStyle, marginBottom: '20px' }}>
        <thead><tr><th style={cellStyle}>Symbol</th><th style={cellStyle}>Name</th><th style={cellStyle}>Growth</th></tr></thead>
        
       <tbody>
  {top5Long.length === 0 ? (
    <tr>
      <td colSpan="3" style={{ textAlign: 'center', color: 'orange' }}>
        ⚠️ No valid long-term stocks found.
      </td>
    </tr>
  ) : (
    top5Long.map((s, i) => (
      <tr key={i}>
        <td style={cellStyle}>{s.symbol}</td>
        <td style={cellStyle}>{s.name}</td>
        <td style={{ ...cellStyle, color: 'green' }}>{s.g12?.toFixed(2)}%</td>
      </tr>
    ))
  )}
</tbody>

      </table>

      <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>My Investments</h4>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}>Stock</th>
            <th style={cellStyle}>Share Quantity</th>
            <th style={cellStyle}>Buy Price</th>
            <th style={cellStyle}>Current Price</th>
            <th style={cellStyle}>Value</th>
            <th style={cellStyle}>% Change</th>
            <th style={cellStyle}>Profit</th>
            <th style={cellStyle}></th>
          </tr>
        </thead>
        <tbody>
          {portfolio.length === 0 ? (
            <tr><td colSpan="8" style={cellStyle}>No investments yet.</td></tr>
          ) : portfolio.map((p, i) => {
            const originalCost = (p.amount * p.price);
            const currentValue = (p.currentPrice * p.amount);
            const profit = currentValue - originalCost;
            const percent = originalCost > 0 ? (profit / originalCost) * 100 : 0;
            const color = profit > 0 ? 'green' : profit < 0 ? 'red' : 'gray';
            return (
              <tr key={i}>
                <td style={cellStyle}>{p.symbol}</td>
                <td style={cellStyle}>{p.amount.toFixed(2)}</td>
                <td style={cellStyle}>₪{p.price?.toFixed(2)}</td>
                <td style={cellStyle}>₪{p.currentPrice?.toFixed(2)}</td>
                <td style={cellStyle}>₪{currentValue.toFixed(2)}</td>
                <td style={{ ...cellStyle, color }}>{percent.toFixed(2)}%</td>
                <td style={{ ...cellStyle, color }}>₪{profit.toFixed(2)}</td>
                <td style={cellStyle}><button onClick={() => deleteRow(p.symbol)}>🗑️</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {portfolio.length > 0 && (() => {
        const totalProfit = portfolio.reduce((sum, p) => sum + ((p.currentPrice - p.price) * p.amount) / 100, 0);
        const totalCost = portfolio.reduce((sum, p) => (sum + p.price * p.amount) / 100, 0);
        const totalChange = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
        const color = totalProfit > 0 ? 'green' : totalProfit < 0 ? 'red' : 'gray';
        return (
          <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: 'bold' }}>
            <div style={{ color }}>Profit: ₪{totalProfit.toFixed(2)}</div>
            <div style={{ color }}>Total Change: {totalChange.toFixed(2)}%</div>
          </div>
        );
      })()}
    </div>
  );
};

export default LeftPanel;