
// /components/CandleChart.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Dynamically import Chart.js and other plugins to avoid SSR issues
const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Chart), { ssr: false });
const zoomPlugin = dynamic(() => import('chartjs-plugin-zoom'), { ssr: false });

// Dynamically import the necessary Chart.js components
const TimeScale = dynamic(() => import('chart.js').then((mod) => mod.TimeScale), { ssr: false });
const LinearScale = dynamic(() => import('chart.js').then((mod) => mod.LinearScale), { ssr: false });
const CandlestickController = dynamic(() => import('chart.js').then((mod) => mod.CandlestickController), { ssr: false });
const CandlestickElement = dynamic(() => import('chart.js').then((mod) => mod.CandlestickElement), { ssr: false });
const Tooltip = dynamic(() => import('chart.js').then((mod) => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('chart.js').then((mod) => mod.Legend), { ssr: false });

import 'chartjs-adapter-date-fns';  // Import date-fns adapter for chart.js

const CandleChart = ({ symbol }: { symbol: string }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Ensure that all components are registered when the component is mounted in the client-side environment
    Promise.all([TimeScale, LinearScale, CandlestickController, CandlestickElement, Tooltip, Legend]).then(
      ([TimeScale, LinearScale, CandlestickController, CandlestickElement, Tooltip, Legend]) => {
        import('chart.js').then(({ ChartJS }) => {
          ChartJS.register(TimeScale, LinearScale, CandlestickController, CandlestickElement, Tooltip, Legend);

          const fetchData = async () => {
            // Fetch stock data from Alpha Vantage API
            const response = await axios.get(
              `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=N87N8RCLYFTOHBEU`
            );
            const data = response.data["Time Series (Daily)"];

            // Prepare data for the chart
            const chartData = {
              labels: Object.keys(data),  // Dates
              datasets: [
                {
                  label: symbol,
                  data: Object.keys(data).map((key) => ({
                    x: key,
                    o: parseFloat(data[key]["1. open"]),
                    h: parseFloat(data[key]["2. high"]),
                    l: parseFloat(data[key]["3. low"]),
                    c: parseFloat(data[key]["4. close"]),
                  })),
                  borderColor: '#4e73df',
                  backgroundColor: 'rgba(78, 115, 223, 0.2)', // Color of the candlesticks
                  type: 'candlestick',
                },
              ],
            };
            setChartData(chartData);
          };

          fetchData();  // Fetch the data when the component mounts
        });
      }
    );
  }, [symbol]);

  return (
    <div>
      {chartData ? (
        <Chart
          type="candlestick"
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: [zoomPlugin],
            scales: {
              x: {
                type: 'time',
              },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CandleChart;
