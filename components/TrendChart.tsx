// components/TrendChart.tsx
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const calculateRSI = (closes: number[], period = 14) => {
  const gains = [];
  const losses = [];
  for (let i = 1; i < period + 1; i++) {
    const delta = closes[i] - closes[i - 1];
    delta >= 0 ? gains.push(delta) : losses.push(Math.abs(delta));
  }
  let avgGain = gains.reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.reduce((a, b) => a + b, 0) / period;
  const rsi = [100 - 100 / (1 + avgGain / avgLoss)];

  for (let i = period + 1; i < closes.length; i++) {
    const delta = closes[i] - closes[i - 1];
    delta >= 0
      ? (avgGain = (avgGain * (period - 1) + delta) / period)
      : (avgLoss = (avgLoss * (period - 1) + Math.abs(delta)) / period);

    const rs = avgGain / avgLoss;
    rsi.push(100 - 100 / (1 + rs));
  }

  return rsi;
};

const TrendChart = ({ symbol = 'AAPL' }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchAndBuild = async () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(end.getMonth() - 1);
      const from = start.toISOString().split('T')[0];
      const to = end.toISOString().split('T')[0];

      const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=100&apiKey=Ik4AGCpavkhjJfuptm8Dn9shpYS0c9cY`;

      try {
        const res = await axios.get(url);
        const data = res.data.results;
        const labels = data.map((d) => new Date(d.t).toLocaleDateString());
        const closes = data.map((d) => d.c);

        const rsi = calculateRSI(closes);
        const macd = closes.map((v, i) => {
          const ema12 = closes.slice(Math.max(i - 11, 0), i + 1).reduce((a, b) => a + b, 0) / Math.min(12, i + 1);
          const ema26 = closes.slice(Math.max(i - 25, 0), i + 1).reduce((a, b) => a + b, 0) / Math.min(26, i + 1);
          return ema12 - ema26;
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Closing Price',
              data: closes,
              borderColor: '#007bff',
              fill: false,
              yAxisID: 'y',
            },
            {
              label: 'RSI',
              data: Array(closes.length - rsi.length).fill(null).concat(rsi),
              borderColor: 'green',
              fill: false,
              yAxisID: 'y1',
            },
            {
              label: 'MACD',
              data: macd,
              borderColor: 'orange',
              fill: false,
              yAxisID: 'y1',
            },
          ],
        });
      } catch (err) {
        console.error('Trend chart error:', err);
      }
    };

    fetchAndBuild();
  }, [symbol]);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Price ($)' },
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'RSI / MACD' },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div style={{ marginTop: '20px', padding: '20px', background: '#fff' }}>
      <h3>Trend Chart (RSI & MACD)</h3>
      {chartData ? <Line data={chartData} options={options} /> : <p>Loading...</p>}
    </div>
  );
};

export default TrendChart;
