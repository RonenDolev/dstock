// components/RiskRewardChart.tsx
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const RiskRewardChart = ({ symbol = 'AAPL' }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(end.getMonth() - 6);
      const from = start.toISOString().split('T')[0];
      const to = end.toISOString().split('T')[0];

      const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=180&apiKey=Ik4AGCpavkhjJfuptm8Dn9shpYS0c9cY`;

      try {
        const res = await axios.get(url);
        const data = res.data.results || [];
        const closes = data.map(d => d.c);

        const startPrice = closes[0];
        const endPrice = closes[closes.length - 1];
        const reward = (((endPrice - startPrice) / startPrice) * 100).toFixed(2);

        let volatility = 0;
        for (let i = 1; i < closes.length; i++) {
          volatility += Math.abs(closes[i] - closes[i - 1]);
        }
        const avgVolatility = (volatility / closes.length).toFixed(2);

        setChartData({
          labels: ['Expected Return', 'Expected Risk'],
          datasets: [{
            label: '%',
            data: [parseFloat(reward), parseFloat(avgVolatility)],
            backgroundColor: ['#28a745', '#dc3545'],
          }],
        });
      } catch (err) {
        console.error('Risk/Reward chart error:', err);
      }
    };

    fetchData();
  }, [symbol]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: '%' } }
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '20px', background: '#fff' }}>
      <h3>Risk vs. Reward (6M)</h3>
      {chartData ? <Bar data={chartData} options={options} /> : <p>Loading...</p>}
    </div>
  );
};

export default RiskRewardChart;
