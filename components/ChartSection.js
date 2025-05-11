import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ChartSection({ symbol }) {
  const labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
  const generateData = () => Array.from({ length: 30 }, () => 100 + Math.random() * 50);

  const data = {
    labels,
    datasets: [
      {
        label: `${symbol} Price`,
        data: generateData(),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `${symbol} Trend (Last 30 Days)` }
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '22px' }}>Long-Term Weekly Chart</h2>
      <Line data={data} options={options} />
      <h2 style={{ fontSize: '22px', marginTop: '30px' }}>Short-Term Daily Chart</h2>
      <Line data={data} options={{ ...options, title: { display: true, text: `${symbol} Daily Trend` } }} />
      <h2 style={{ fontSize: '22px', marginTop: '30px' }}>Risk / Reward</h2>
      <Line data={data} options={{ ...options, title: { display: true, text: `Risk/Reward Outlook` } }} />
    </div>
  );
}
