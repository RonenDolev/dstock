// components/ChartPanel.tsx
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartPanel = ({ symbol = 'AAPL' }) => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'TIME_SERIES_DAILY',
            symbol,
            outputsize: 'compact',
            apikey: 'N87N8RCLYFTOHBEU',
          },
        });

        const timeSeries = response.data['Time Series (Daily)'];
        if (!timeSeries) {
          setError('No time series data found.');
          return;
        }

        const dates = Object.keys(timeSeries).slice(0, 30).reverse(); // last 30 days
        const prices = dates.map((date) => ({
          x: new Date(date),
          y: parseFloat(timeSeries[date]['4. close']),
        }));

        setChartData({
          datasets: [
            {
              label: `${symbol} Closing Price`,
              data: prices,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              fill: true,
              tension: 0.3,
            },
          ],
        });
      } catch (err) {
        setError('Failed to load chart data.');
        console.error(err);
      }
    };

    fetchStockData();
  }, [symbol]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `${symbol} Daily Chart` },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)',
        },
      },
    },
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!chartData ? <p>Loading chart...</p> : <Line options={options} data={chartData} />}
    </div>
  );
};

export default ChartPanel;
