import { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  TimeScale
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { createChart } from 'lightweight-charts';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  TimeScale
);

export default function ChartPanel() {
  const chartRef = useRef();
  const [reward, setReward] = useState(20);
  const [macdData, setMacdData] = useState({ labels: [], macd: [], signal: [] });

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333'
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' }
      }
    });

    const candleSeries = chart.addCandlestickSeries();

    fetch(`https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/60/now?adjusted=true&sort=asc&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.results.map(item => ({
          time: item.t / 1000,
          open: item.o,
          high: item.h,
          low: item.l,
          close: item.c
        }));
        candleSeries.setData(formatted);

        const closes = data.results.map(item => item.c);
        const labels = data.results.map(item => new Date(item.t));
        const macd = [], signal = [];

        const ema = (data, span) => {
          const k = 2 / (span + 1);
          let emaArray = [data[0]];
          for (let i = 1; i < data.length; i++) {
            emaArray.push(data[i] * k + emaArray[i - 1] * (1 - k));
          }
          return emaArray;
        };

        const ema12 = ema(closes, 12);
        const ema26 = ema(closes, 26);

        for (let i = 0; i < closes.length; i++) {
          macd.push(ema12[i] - ema26[i]);
        }

        const signalLine = ema(macd, 9);
        setMacdData({ labels, macd, signal: signalLine });
      });
  }, []);

  const barData = {
    labels: ['Reward', 'Risk'],
    datasets: [
      {
        label: 'Percentage',
        data: [parseFloat(reward), -8],
        backgroundColor: ['#16a34a', '#dc2626']
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.raw + '%';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + '%';
          }
        }
      }
    }
  };

  const macdChartData = {
    labels: macdData.labels,
    datasets: [
      {
        label: 'MACD',
        data: macdData.macd,
        borderColor: '#0ea5e9',
        fill: false
      },
      {
        label: 'Signal',
        data: macdData.signal,
        borderColor: '#f97316',
        fill: false
      }
    ]
  };

  const macdChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    scales: {
      x: { type: 'time', time: { unit: 'day' } },
      y: { beginAtZero: false }
    }
  };

  return (
    <div className="space-y-4">
      {/* Candlestick Chart */}
      <div className="bg-white p-4 border rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Long-Term Technical Chart (Japanese Candlesticks)</h2>
        <div ref={chartRef} className="w-full h-[300px]" />
      </div>

      {/* MACD Chart */}
      <div className="bg-white p-4 border rounded shadow">
        <h2 className="text-lg font-semibold mb-2">MACD</h2>
        <Line data={macdChartData} options={macdChartOptions} height={150} />
      </div>

      {/* Risk / Reward */}
      <div className="bg-white p-4 border rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Risk / Reward Ratio</h2>
        <Bar data={barData} options={barOptions} height={100} />
      </div>
    </div>
  );
}
