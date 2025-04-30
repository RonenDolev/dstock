import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export default function TrendChart({ symbol }) {
  const chartRef = useRef();

  useEffect(() => {
    const chart = createChart(chartRef.current, {
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

    const lineSeries = chart.addLineSeries({
      color: 'blue',
      lineWidth: 2,
    });

    const dummyData = [
      { time: '2024-04-01', value: 130 },
      { time: '2024-04-02', value: 132 },
      { time: '2024-04-03', value: 136 },
      { time: '2024-04-04', value: 134 },
      { time: '2024-04-05', value: 133 },
    ];

    lineSeries.setData(dummyData);

    return () => chart.remove();
  }, [symbol]);

  return <div ref={chartRef} />;
}
