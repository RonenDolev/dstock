import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export default function CandlestickChart({ symbol }) {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: 600,
      height: 300,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      priceScale: {
        borderColor: '#ccc',
      },
      timeScale: {
        borderColor: '#ccc',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addCandlestickSeries();

    // Dummy data - replace later with real API data
    const dummyData = [
      { time: '2024-04-01', open: 130, high: 135, low: 129, close: 132 },
      { time: '2024-04-02', open: 132, high: 137, low: 130, close: 136 },
      { time: '2024-04-03', open: 136, high: 139, low: 135, close: 138 },
      { time: '2024-04-04', open: 138, high: 140, low: 134, close: 135 },
      { time: '2024-04-05', open: 135, high: 138, low: 132, close: 133 },
    ];

    candleSeries.setData(dummyData);

    return () => {
      chart.remove();
    };
  }, [symbol]);

  return <div ref={chartContainerRef} />;
}
