// File: components/RiskRewardChartCenter.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const RiskRewardChartCenter = ({ riskReward }) => {
  if (!riskReward || !riskReward.shortTerm || !riskReward.longTerm) {
    return <div style={{ fontFamily: 'Bahnschrift Light', padding: '10px' }}>No Risk/Reward data.</div>;
  }

  const labels = ['3M', '1Y'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Risk (%)',
        data: [
          riskReward.shortTerm.risk.toFixed(2),
          riskReward.longTerm.risk.toFixed(2)
        ],
        backgroundColor: 'rgba(231, 76, 60, 0.7)' // red
      },
      {
        label: 'Reward (%)',
        data: [
          riskReward.shortTerm.reward.toFixed(2),
          riskReward.longTerm.reward.toFixed(2)
        ],
        backgroundColor: 'rgba(46, 204, 113, 0.7)' // green
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Bahnschrift Light',
            size: 14
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: val => `${val}%`
        }
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
      <h3 style={{ fontFamily: 'Bahnschrift Light', fontSize: '20px', marginBottom: '20px' }}>
        Risk/Reward Comparison (Chart)
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RiskRewardChartCenter;
