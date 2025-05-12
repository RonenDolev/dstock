import React from 'react';

const RiskRewardChart = ({ analysis }) => {
  if (
    !analysis ||
    typeof analysis !== 'object' ||
    !analysis.shortTerm ||
    !analysis.longTerm
  ) {
    return (
      <div style={{ fontFamily: 'Bahnschrift Light', padding: '10px' }}>
        Risk/reward data not available.
      </div>
    );
  }

  const renderBar = (label, { risk, reward }) => {
    const riskPercent = parseFloat(risk.toFixed(2));
    const rewardPercent = parseFloat(reward.toFixed(2));
    const total = riskPercent + rewardPercent;
    const riskWidth = total > 0 ? (riskPercent / total) * 100 : 0;
    const rewardWidth = total > 0 ? (rewardPercent / total) * 100 : 0;

    return (
      <div style={{ marginBottom: '25px' }}>
        <h4 style={{ fontSize: '16px', marginBottom: '6px' }}>
          {label} Risk/Reward
        </h4>
        <div
          style={{
            display: 'flex',
            height: '28px',
            width: '100%',
            borderRadius: '6px',
            overflow: 'hidden',
            backgroundColor: '#ddd',
            border: '1px solid #aaa',
          }}
        >
          <div
            style={{
              width: `${riskWidth}%`,
              backgroundColor: '#e74c3c',
              color: 'white',
              textAlign: 'center',
              lineHeight: '28px',
              fontSize: '13px',
              fontWeight: 'bold',
            }}
          >
            {risk > 0 ? `Risk ${riskPercent}%` : ''}
          </div>
          <div
            style={{
              width: `${rewardWidth}%`,
              backgroundColor: '#2ecc71',
              color: 'white',
              textAlign: 'center',
              lineHeight: '28px',
              fontSize: '13px',
              fontWeight: 'bold',
            }}
          >
            {reward > 0 ? `Reward ${rewardPercent}%` : ''}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'Bahnschrift Light', marginTop: '30px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Risk/Reward Comparison</h3>
      {renderBar('3M', analysis.shortTerm)}
      {renderBar('1Y', analysis.longTerm)}
    </div>
  );
};

export default RiskRewardChart;
