import React, { useState, useEffect } from 'react';
import LeftPanel from '../components/LeftPanel';
import CenterPanel from '../components/CenterPanel';
import RightPanel from '../components/RightPanel';
import Image from 'next/image';
import axios from 'axios';

const symbols = [
  { key: 'SPY', label: 'S&P 500' },
  { key: 'QQQ', label: 'Nasdaq 100' },
  { key: 'DIA', label: 'Dow Jones' },
  { key: 'IWM', label: 'Russell 2000' },
  { key: 'C:EURUSD', label: 'USD/EUR' },
  { key: 'C:USDILS', label: 'ILS/USD' },
  { key: 'C:EURILS', label: 'ILS/EUR' },
  { key: 'C:XAUUSD', label: 'Gold' },
  { key: 'C:XAGUSD', label: 'Silver' }
];

const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

const fetchMarketIndicators = async () => {
  const results = await Promise.all(
    symbols.map(async ({ key, label }) => {
      try {
        const url = `https://api.polygon.io/v2/aggs/ticker/${key}/prev?adjusted=true&apiKey=${apiKey}`;
        const res = await axios.get(url);
        const { o, c } = res.data?.results?.[0] || {};
        const change = o && c ? ((c - o) / o) * 100 : 0;
        const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';

        const isILS = ['ILS/USD', 'ILS/EUR'].includes(label);
        const isUSDEUR = label === 'USD/EUR';
        let adjustedTrend = trend;
        if (isILS) adjustedTrend = change > 0 ? 'down' : change < 0 ? 'up' : 'flat';
        if (isUSDEUR) adjustedTrend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';

        return {
          label,
          price: c ? c.toFixed(2) : '-',
          change: change.toFixed(2),
          trend: adjustedTrend
        };
      } catch (err) {
        console.warn(`⚠️ ${label}: No data`, err?.response?.data || err.message);
        return { label, price: '-', trend: 'flat' };
      }
    })
  );
  return results;
};

export default function Home() {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [analysis, setAnalysis] = useState(null);
  const [indicators, setIndicators] = useState([]);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const loadIndicators = async () => {
      try {
        const data = await fetchMarketIndicators();
        setIndicators(data);
      } catch (err) {
        console.error("Failed to load market indicators:", err);
      }
    };
    loadIndicators();
    const interval = setInterval(loadIndicators, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev === 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ backgroundColor: '#d3d3d3', minHeight: '100vh', fontFamily: 'Bahnschrift Light' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        padding: '0px 5% 10px 5%',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/logo.png" alt="Logo" width={130} height={60} />
            <h1 style={{
              fontSize: '80px',
              marginLeft: '30px',
              fontWeight: 'lighter',
              fontFamily: 'Aptos Light, Segoe UI Light, sans-serif'
            }}>
              Stock Analysis Generator
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '-70px', marginLeft: '5px', gap: '4px' }}>
            <img src="/stopwatch.png" alt="Timer Icon" style={{ width: '14px', height: '14px' }} />
            <p style={{ fontSize: '14px', color: '#666' }}>Next update in: {countdown}s</p>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '10px 5%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px',
        fontSize: '16px'
      }}>
        {indicators.length === 0 ? (
          <div style={{ color: 'orange' }}>⚠️ No market data available</div>
        ) : (
          indicators.map((item, idx) => (
            <div
              key={idx}
              style={{
                color:
                  item.trend === 'up'
                    ? 'lightgreen'
                    : item.trend === 'down'
                      ? 'red'
                      : 'orange',
              }}
            >
              {item.label}: {item.price} ({item.change}%) {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '■'}
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 5% 0 5%' }}>
        <div style={{ width: '25%', marginRight: '20px' }}>
          <LeftPanel onStockSelect={setSelectedStock} setAnalysis={setAnalysis} />
        </div>
        <div style={{ width: '45%', marginRight: '20px' }}>
          <CenterPanel selectedStock={selectedStock} riskReward={analysis} />
        </div>
        <div style={{ width: '25%' }}>
          <RightPanel selectedStock={selectedStock} setAnalysis={setAnalysis} />
        </div>
      </div>
    </div>
  );
}
