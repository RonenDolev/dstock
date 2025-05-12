import { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { createChart } from 'lightweight-charts';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartPanel() {
  const chartRef = useRef();
  const [reward, setReward] = useState(20);

  useEffect(() => {
    // TradingView Weekly & Daily removed temporarily for custom layout
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

  return (
    <div className="space-y-4">
      {/* Candlestick Chart */}
      <div className="bg-white p-4 border rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Long-Term Technical Chart (Weekly)</h2>
        <div ref={chartRef} className="w-full h-[300px]" />
      </div>

      {/* Short-Term Placeholder for now */}
      <div className="bg-white p-4 border rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Risk / Reward Ratio</h2>
        <Bar data={barData} options={barOptions} height={100} />
      </div>
    </div>
  );
}
