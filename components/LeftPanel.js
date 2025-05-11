// File: components/LeftPanel.js
import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { fetchRealTimePrice, getGrowth, top100 } from '../utils/fetchStockData';

const LOCAL_STORAGE_KEY_DUMMY = 'investmentTable';
const LOCAL_STORAGE_KEY_REAL = 'realInvestmentTable';

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

const updatePortfolioPrices = async (portfolio, setPortfolio, key) => {
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
  saveToLocalStorage(key, updated);
};

const LeftPanel = ({ onStockSelect, setAnalysis }) => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [amount, setAmount] = useState(100);
  const [portfolio, setPortfolio] = useState([]);
  const [realPortfolio, setRealPortfolio] = useState([]);
  const [top5Short, setTop5Short] = useState([]);
  const [top5Long, setTop5Long] = useState([]);
  const usdToIls = 3.6;

  useEffect(() => {
    const dummy = loadFromLocalStorage(LOCAL_STORAGE_KEY_DUMMY);
    const real = loadFromLocalStorage(LOCAL_STORAGE_KEY_REAL);
    setPortfolio(dummy);
    setRealPortfolio(real);
    updatePortfolioPrices(dummy, setPortfolio, LOCAL_STORAGE_KEY_DUMMY);
    updatePortfolioPrices(real, setRealPortfolio, LOCAL_STORAGE_KEY_REAL);
  }, []);

  useEffect(() => {
    if (typeof onStockSelect === 'function') onStockSelect(selectedSymbol);
  }, [selectedSymbol, onStockSelect]);

  useEffect(() => {
    const computeGrowth = async () => {
      const growthData = await Promise.all(
        top100.map(async (s) => {
          const g6 = await getGrowth(s.symbol, 6);
          const g12 = await getGrowth(s.symbol, 12);
          const price = await fetchRealTimePrice(s.symbol);
          return { ...s, g6, g12, price };
        })
      );
      setTop5Short(growthData.filter(s => s.g6 !== null).sort((a, b) => b.g6 - a.g6).slice(0, 5));
      setTop5Long(growthData.filter(s => s.g12 !== null).sort((a, b) => b.g12 - a.g12).slice(0, 5));
    };
    computeGrowth();
  }, []);

  const handleBuy = async (real = false) => {
    if (real) return; // Real handled by PayPal button
    const price = await fetchRealTimePrice(selectedSymbol);
    const key = LOCAL_STORAGE_KEY_DUMMY;
    const setFunc = setPortfolio;
    let updated = [...portfolio];
    const existing = updated.find(p => p.symbol === selectedSymbol);
    if (existing) existing.amount += amount;
    else updated.push({ symbol: selectedSymbol, amount, price });
    setFunc(updated);
    saveToLocalStorage(key, updated);
    updatePortfolioPrices(updated, setFunc, key);
  };

  const handleRealSell = async () => {
    const confirmed = window.confirm("Are you sure you want to sell and refund this investment using your PayPal account?");
    if (!confirmed) return;

    const investment = realPortfolio.find(p => p.symbol === selectedSymbol);
    if (!investment || !investment.captureId) {
      alert("Refund not available for this transaction.");
      return;
    }

    try {
      const res = await fetch('/api/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captureId: investment.captureId })
      });

      if (res.ok) {
        const updated = realPortfolio.filter(p => p.symbol !== selectedSymbol);
        setRealPortfolio(updated);
        saveToLocalStorage(LOCAL_STORAGE_KEY_REAL, updated);
        alert("✅ Refund processed successfully.");
      } else {
        alert("❌ Refund failed.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error communicating with refund server.");
    }
  };

  const deleteRow = (symbol, real = false) => {
    const key = real ? LOCAL_STORAGE_KEY_REAL : LOCAL_STORAGE_KEY_DUMMY;
    const data = (real ? realPortfolio : portfolio).filter(p => p.symbol !== symbol);
    const setFunc = real ? setRealPortfolio : setPortfolio;
    setFunc(data);
    saveToLocalStorage(key, data);
  };

  const tableStyle = {
    width: '100%', fontSize: '12px', borderCollapse: 'collapse', border: '1px solid #ccc'
  };
  const cellStyle = {
    border: '1px solid #ccc', padding: '6px', textAlign: 'left'
  };

  const renderTable = (data, title, real = false) => {
    const total = data.reduce((sum, p) => sum + (p.currentPrice * p.amount - p.price * p.amount), 0);
    const color = total > 0 ? 'green' : total < 0 ? 'red' : 'orange';

    return (
      <>
        <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>{title}</h4>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Stock</th>
              <th style={cellStyle}>Amount</th>
              <th style={cellStyle}>Buy Price (₪)</th>
              <th style={cellStyle}>Current Price (₪)</th>
              <th style={cellStyle}>Value (₪)</th>
              <th style={cellStyle}>% Change</th>
              <th style={cellStyle}>Profit (₪)</th>
              <th style={cellStyle}></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="8" style={cellStyle}>No investments yet.</td></tr>
            ) : data.map((p, i) => {
              const original = p.amount * p.price;
              const current = p.amount * p.currentPrice;
              const profit = current - original;
              const percent = original > 0 ? (profit / original) * 100 : 0;
              const col = profit > 0 ? 'green' : profit < 0 ? 'red' : 'gray';
              return (
                <tr key={i}>
                  <td style={cellStyle}>{p.symbol}</td>
                  <td style={cellStyle}>{p.amount}</td>
                  <td style={cellStyle}>₪{p.price?.toFixed(2)}</td>
                  <td style={cellStyle}>₪{p.currentPrice?.toFixed(2)}</td>
                  <td style={cellStyle}>₪{current.toFixed(2)}</td>
                  <td style={{ ...cellStyle, color: col }}>{percent.toFixed(2)}%</td>
                  <td style={{ ...cellStyle, color: col }}>₪{profit.toFixed(2)}</td>
                  <td style={cellStyle}><button onClick={() => deleteRow(p.symbol, real)}>🗑️</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px', color }}>
          Total: ₪{total.toFixed(2)} / ${(total / usdToIls).toFixed(2)}
        </p>
      </>
    );
  };

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID, currency: "ILS" }}>
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0', fontFamily: 'Bahnschrift Light' }}>
        <h2 style={{ fontSize: '36px', color: 'black', marginBottom: '20px' }}>Stock Analysis Tools</h2>

        <label style={{ fontSize: '14px' }}>Select Stock</label>
        <select
          value={selectedSymbol}
          onChange={e => setSelectedSymbol(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '14px' }}>
          {top100.map(p => (
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <button style={{ backgroundColor: 'green', color: 'white', padding: '10px', fontWeight: 'light' }} onClick={() => handleBuy(false)}>Dummy Buy</button>
<button style={{ backgroundColor: '#0070ba', color: 'white', padding: '10px', fontWeight: 'light' }} onClick={() => handleBuy(true)}>Real Buy (Manual)</button>

          <button style={{ backgroundColor: 'red', color: 'white', padding: '10px', fontWeight: 'light' }} onClick={() => handleSell(false)}>Dummy Sell</button>
          <button style={{ backgroundColor: 'red', color: 'white', padding: '10px', fontWeight: 'light' }} onClick={handleRealSell}>Real Sell</button>
          <div>
            <PayPalButtons
              style={{ layout: "horizontal", height: 40 }}
              forceReRender={[selectedSymbol, amount]}
              createOrder={(data, actions) => {
                const confirmed = window.confirm("Are you sure you want to proceed with this stock purchase using your funds?");
                if (!confirmed) return;
                return actions.order.create({
                  purchase_units: [{
                    description: `Stock Investment: ${selectedSymbol}`,
                    amount: {
                      currency_code: "ILS",
                      value: amount.toString(),
                    },
                  }],
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                const captureId = details?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
                const price = await fetchRealTimePrice(selectedSymbol);
                const newItem = { symbol: selectedSymbol, amount, price, captureId };
                const updated = [...realPortfolio, newItem];
                setRealPortfolio(updated);
                saveToLocalStorage(LOCAL_STORAGE_KEY_REAL, updated);
                updatePortfolioPrices(updated, setRealPortfolio, LOCAL_STORAGE_KEY_REAL);
                alert("✅ Purchase completed and added to Real Investment table.");
              }}
              onCancel={() => alert("❌ Purchase cancelled.")}
              onError={(err) => {
  console.error("❌ PayPal ERROR DETAILS:", JSON.stringify(err, null, 2));
  alert("❌ PayPal Error: Check the browser console for details.");
}}
            />
          </div>
        </div>

        <h4 style={{ fontSize: '16px', marginBottom: '6px' }}>Top 5 Leading Stocks (Past 6-Month)</h4>
        <table style={{ ...tableStyle, marginBottom: '20px' }}>
          <thead><tr><th style={cellStyle}>Symbol</th><th style={cellStyle}>Name</th><th style={cellStyle}>Growth</th></tr></thead>
          <tbody>
            {top5Short.map((s, i) => (
              <tr key={i}>
                <td style={cellStyle}>{s.symbol}</td>
                <td style={cellStyle}>{s.name}</td>
                <td style={{ ...cellStyle, color: 'green' }}>{s.g6?.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4 style={{ fontSize: '16px', marginBottom: '6px' }}>Top 5 Long-Term (1Y) Buy Opportunities</h4>
        <table style={{ ...tableStyle, marginBottom: '20px' }}>
          <thead><tr><th style={cellStyle}>Symbol</th><th style={cellStyle}>Name</th><th style={cellStyle}>Growth</th></tr></thead>
          <tbody>
            {top5Long.map((s, i) => (
              <tr key={i}>
                <td style={cellStyle}>{s.symbol}</td>
                <td style={cellStyle}>{s.name}</td>
                <td style={{ ...cellStyle, color: 'green' }}>{s.g12?.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        {renderTable(portfolio, 'Dummy Investment', false)}
        <hr style={{ margin: '20px 0' }} />
        {renderTable(realPortfolio, 'Real Investment', true)}
      </div>
    </PayPalScriptProvider>
  );
};

export default LeftPanel;
