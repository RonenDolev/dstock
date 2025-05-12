// File: components/CenterPanel.js

import React from 'react';
import ChartPanel from './ChartPanel';
import StrategyBox from './StrategyBox';
import RiskRewardChart from './RiskRewardChart';

export default function CenterPanel({ selectedStock, analysis, setAnalysis }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* 1. Charts and Technical Signals */}
      <ChartPanel symbol={selectedStock} />

      {/* 2. Strategy + Risk Calculation */}
      <StrategyBox selectedSymbol={selectedStock} setAnalysis={setAnalysis} />

      {/* 3. Risk/Reward Comparison Chart */}
      <RiskRewardChart analysis={analysis} />
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend
);

function calculateEMA(data, period) {
  const k = 2 / (period + 1);
  let emaArray = [];
  data.forEach((price, i) => {
    if (i === 0) {
      emaArray.push(price);
    } else {
      emaArray.push(price * k + emaArray[i - 1] * (1 - k));
    }
  });
  return emaArray;
}

function calculateMACD(prices) {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const signalLine = calculateEMA(macdLine, 9);
  return { macdLine, signalLine };
}

function calculateRSI(prices, period = 14) {
  let gains = [], losses = [];
  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    gains.push(Math.max(0, diff));
    losses.push(Math.max(0, -diff));
  }
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const rs = avgGain / (avgLoss || 1);
  const rsi = 100 - 100 / (1 + rs);
  return rsi;
}

export default function ChartPanel({ symbol }) {
  const chartRef = useRef();
  const [strategyMessage, setStrategyMessage] = useState('Loading strategy...');
  const [macdData, setMacdData] = useState(null);
  const [rsiData, setRsiData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/60/2024-01-01/2024-12-31?adjusted=true&sort=desc&limit=60&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`);
      const data = await res.json();
      const candles = data.results?.slice(0, 50).reverse();
      if (!candles || candles.length < 30) return;

      const closes = candles.map(c => c.c);
      const { macdLine, signalLine } = calculateMACD(closes);
      const latestMACD = macdLine[macdLine.length - 1];
      const latestSignal = signalLine[signalLine.length - 1];
      const rsi = calculateRSI(closes);

      const prev = candles[candles.length - 2];
      const curr = candles[candles.length - 1];
      const isBullishEngulfing = curr.o < curr.c && prev.o > prev.c && curr.o <= prev.c && curr.c >= prev.o;
      const isBearishEngulfing = curr.o > curr.c && prev.o < prev.c && curr.o >= prev.c && curr.c <= prev.o;
      const isDoji = Math.abs(curr.o - curr.c) / (curr.h - curr.l) < 0.1;

      let patternMsg = '', signal = '';

      if (isBullishEngulfing) {
        patternMsg = 'Bullish Engulfing';
        signal = 'buy';
      } else if (isBearishEngulfing) {
        patternMsg = 'Bearish Engulfing';
        signal = 'sell';
      } else if (isDoji) {
        patternMsg = 'Doji';
        signal = 'hold';
      } else {
        patternMsg = 'No clear pattern';
        signal = 'hold';
      }

      if (latestMACD > latestSignal && rsi < 70) {
        signal = 'buy';
      } else if (latestMACD < latestSignal && rsi > 30) {
        signal = signal === 'sell' ? 'sell' : 'hold';
      }

      let recommendation = '🟠 Hold';
      if (signal === 'buy') recommendation = '🟢 Buy';
      else if (signal === 'sell') recommendation = '🔴 Sell';

      setStrategyMessage(`${recommendation}\nPattern: ${patternMsg}\nMACD: ${latestMACD.toFixed(2)} vs Signal: ${latestSignal.toFixed(2)}\nRSI: ${rsi.toFixed(2)}`);

      const chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: 300,
        layout: { background: { color: '#f4f4f4' }, textColor: '#000' },
        grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
        crosshair: { mode: CrosshairMode.Normal },
        rightPriceScale: { borderVisible: false },
        timeScale: { borderVisible: false }
      });

      const candleSeries = chart.addCandlestickSeries();
      candleSeries.setData(candles.map(c => ({
        time: c.t / 1000,
        open: c.o,
        high: c.h,
        low: c.l,
        close: c.c
      })));

      const labels = candles.map(c => new Date(c.t));

      setMacdData({
        labels,
        datasets: [
          {
            label: 'MACD',
            data: macdLine,
            borderColor: 'blue',
            fill: false,
          },
          {
            label: 'Signal',
            data: signalLine,
            borderColor: 'red',
            fill: false,
          },
        ],
      });

      setRsiData({
        labels,
        datasets: [
          {
            label: 'RSI',
            data: closes.map((_, i) => (i >= 14 ? calculateRSI(closes.slice(i - 14, i + 1)) : null)),
            borderColor: 'green',
            fill: false,
          },
        ],
      });

      return () => chart.remove();
    }

    fetchData();
  }, [symbol]);

  const macdOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'MACD Chart',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
    },
  };

  const rsiOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'RSI Chart',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
      y: {
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  return (
    <div>
      <h2>Charts and Strategy</h2>
      <div ref={chartRef} style={{ height: 300, marginBottom: '20px' }}></div>

      <div style={{ padding: '15px', backgroundColor: '#fff', border: '1px solid #ccc' }}>
        <h3>Investment Strategy</h3>
        <p style={{ fontSize: '18px', whiteSpace: 'pre-wrap' }}>{strategyMessage}</p>
      </div>

      {macdData && (
        <div style={{ marginTop: '20px' }}>
          <Line data={macdData} options={macdOptions} />
        </div>
      )}

      {rsiData && (
        <div style={{ marginTop: '20px' }}>
          <Line data={rsiData} options={rsiOptions} />
        </div>
      )}
    </div>
  );
}
