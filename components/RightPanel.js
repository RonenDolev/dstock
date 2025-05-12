// File: components/RightPanel.js
import React, { useEffect, useState } from 'react';
import { fetchRealTimePrice, getGrowth, getRiskReward } from '../utils/fetchStockData';
import RiskRewardChart from './RiskRewardChart';

// Normalize index symbols for backend API compatibility
const normalizeSymbol = (symbol) => {
  const map = {
    '^GSPC': 'SPX',
    '^IXIC': 'NDX',
    '^DJI': 'DJI',
    '^RUT': 'RUT'
  };
  return map[symbol] || symbol;
};

const RightPanel = ({ selectedStock, setAnalysis }) => {
  const [price, setPrice] = useState(null);
  const [growth3m, setGrowth3m] = useState(null);
  const [growth12m, setGrowth12m] = useState(null);
  const [riskReward, setRiskReward] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedStock) return;

      try {
        console.log(`🔄 Fetching fresh data for ${selectedStock}`);
        const [price, g3, g12, rr] = await Promise.all([
          fetchRealTimePrice(selectedStock),
          getGrowth(selectedStock, 3),
          getGrowth(selectedStock, 12),
          getRiskReward(selectedStock)
        ]);

        setPrice(price);
        setGrowth3m(g3);
        setGrowth12m(g12);
        setRiskReward(rr);
        setAnalysis(rr); // ✅ send riskReward to Home.js
      } catch (err) {
        console.error("❌ Data fetch error in RightPanel:", err);
        setPrice(null);
        setGrowth3m(null);
        setGrowth12m(null);
        setRiskReward(null);
      }
    };

    loadData();
  }, [selectedStock]);

  const shortTermRecommendation = () => {
    if (growth3m === null) return 'No data';
    if (growth3m > 10) return '🟢 ↑ Buy';
    if (growth3m > 2) return '🟠 → Hold';
    return '🔴 ↓ Sell';
  };

  const longTermRecommendation = () => {
    if (growth12m === null) return 'No data';
    if (growth12m > 15) return '🟢 ↑ Buy';
    if (growth12m > 5) return '🟠 → Hold';
    return '🔴 ↓ Sell';
  };

  const sectionDivider = <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '20px 0' }} />;

  return (
    <div style={{ width: '100%', backgroundColor: '#f0f0f0', padding: '20px' }}>
      <h2 style={{ fontFamily: 'Bahnschrift Light', fontSize: '30px', marginBottom: '20px' }}>
        Investment Strategy
      </h2>

      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
        <p><strong>Stock:</strong> {selectedStock || '—'}</p>
        <p><strong>Current Price:</strong> {price ? `$${price.toFixed(2)}` : 'N/A'}</p>

        {sectionDivider}
        <h3 style={{ fontSize: '18px', marginTop: '20px' }}>Technical Performance</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Growth (3-Month): {growth3m !== null ? `${growth3m.toFixed(2)}%` : 'No data'}</li>
          <li>Growth (1-Year): {growth12m !== null ? `${growth12m.toFixed(2)}%` : 'No data'}</li>
        </ul>

        {sectionDivider}
        <h3 style={{ fontSize: '18px', marginTop: '20px' }}>Recommendation</h3>
        <p><strong>Short-Term (&gt;3M):</strong> {shortTermRecommendation()}</p>
        <p><strong>Long-Term (&lt;1Y):</strong> {longTermRecommendation()}</p>

        {sectionDivider}
        <p><strong>Entry Range:</strong> {riskReward ? `$${riskReward.entryRange.min.toFixed(2)} – $${riskReward.entryRange.max.toFixed(2)}` : 'N/A'}</p>
        <p><strong>Target:</strong> {riskReward ? `$${riskReward.target.toFixed(2)}` : 'N/A'}</p>
        <p><strong>Stop-Loss:</strong> {riskReward ? `$${riskReward.stopLoss.toFixed(2)}` : 'N/A'}</p>

      {sectionDivider}
<h3 style={{ fontSize: '18px', marginTop: '20px' }}>Risk/Reward</h3>
<RiskRewardChart
  data={[
    { label: '3M', risk: riskReward?.shortTerm?.risk || 0, reward: riskReward?.shortTerm?.reward || 0 },
    { label: '1Y', risk: riskReward?.longTerm?.risk || 0, reward: riskReward?.longTerm?.reward || 0 }
  ]}
/>

<p>
  <strong>3M →</strong> Risk: {riskReward ? `${riskReward.shortTerm.risk.toFixed(2)}%` : 'N/A'} |
  Reward: {riskReward ? `${riskReward.shortTerm.reward.toFixed(2)}%` : 'N/A'} |
  Ratio: {riskReward ? `1:${riskReward.shortTerm.ratio.toFixed(2)}` : 'N/A'}
</p>
<p>
  <strong>1Y →</strong> Risk: {riskReward ? `${riskReward.longTerm.risk.toFixed(2)}%` : 'N/A'} |
  Reward: {riskReward ? `${riskReward.longTerm.reward.toFixed(2)}%` : 'N/A'} |
  Ratio: {riskReward ? `1:${riskReward.longTerm.ratio.toFixed(2)}` : 'N/A'}
</p>
<p style={{ fontSize: '13px', color: '#444', marginTop: '10px' }}>
  <strong>Tip:</strong> A risk/reward ratio above <strong>1:2</strong> is generally considered a good trade-off.
  The higher the ratio, the better the potential return for the risk taken.
  Use this to decide if the stock is worth buying — aim for <strong>1:2 or higher</strong> before entering a position.
</p>


        <div style={{ fontSize: '12px', marginTop: '20px', color: '#555' }}>
          *Strategy auto-generated based on chart patterns, fundamentals, and AI logic.
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
