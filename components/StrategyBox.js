import React, { useEffect, useState } from 'react';
import {
  fetchRealTimePrice,
  fetchStockDetails,
  getGrowth
} from '../utils/fetchStockData';

const StrategyBox = ({ selectedSymbol, setAnalysis }) => {
  const [price, setPrice] = useState(null);
  const [details, setDetails] = useState({});
  const [growth3M, setGrowth3M] = useState(null);
  const [growth1Y, setGrowth1Y] = useState(null);
  const [shortTermRec, setShortTermRec] = useState('—');
  const [longTermRec, setLongTermRec] = useState('—');
  const [entryMin, setEntryMin] = useState(null);
  const [entryMax, setEntryMax] = useState(null);
  const [target, setTarget] = useState(null);
  const [stopLoss, setStopLoss] = useState(null);
  const [risk, setRisk] = useState(null);
  const [reward, setReward] = useState(null);
  const [rrRatio, setRrRatio] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedSymbol) return;

      const current = await fetchRealTimePrice(selectedSymbol);
      const g3 = await getGrowth(selectedSymbol, 3);
      const g12 = await getGrowth(selectedSymbol, 12);

      setPrice(current);
      setGrowth3M(g3);
      setGrowth1Y(g12);

      const entryMin = current * 0.97;
      const entryMax = current * 1.02;
      const target = current * 1.15;
      const stop = current * 0.95;

      const calculatedRisk = ((current - stop) / current) * 100;
      const calculatedReward = ((target - current) / current) * 100;
      const calculatedRatio = calculatedReward / calculatedRisk;

      setEntryMin(entryMin);
      setEntryMax(entryMax);
      setTarget(target);
      setStopLoss(stop);
      setRisk(calculatedRisk);
      setReward(calculatedReward);
      setRrRatio(calculatedRatio);

      if (g3 >= 10 && calculatedRatio >= 2.0) setShortTermRec('🟢 ↑ Buy');
      else if (g3 <= 0 || calculatedRatio < 1.5) setShortTermRec('🔴 ↓ Sell');
      else setShortTermRec('🟠 → Hold');

      if (g12 >= 15 && calculatedRatio >= 2.0) setLongTermRec('🟢 ↑ Buy');
      else if (g12 <= 5 || calculatedRatio < 1.5) setLongTermRec('🔴 ↓ Sell');
      else setLongTermRec('🟠 → Hold');

      // ✅ Pass values up to CenterPanel via setAnalysis
      if (typeof setAnalysis === 'function') {
        setAnalysis({
          risk: calculatedRisk,
          reward: calculatedReward,
          rrRatio: calculatedRatio,
          price: current,
          growth3M: g3,
          growth1Y: g12
        });
      }
    };

    loadData();
  }, [selectedSymbol, setAnalysis]);

  const formatCurrency = (val) => val ? `$${val.toFixed(2)}` : '—';
  const formatPercent = (val) => val !== null ? `${val.toFixed(2)}%` : '—';

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', fontFamily: 'Bahnschrift Light' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Investment Strategy</h3>
      <p><strong>Stock:</strong> {selectedSymbol}</p>
      <p><strong>Current Price:</strong> {formatCurrency(price)}</p>

      <h4 style={{ marginTop: '20px' }}>Technical Analysis</h4>
      <ul>
        <li>📈 Growth (3-Month): {formatPercent(growth3M)}</li>
        <li>📉 Growth (1-Year): {formatPercent(growth1Y)}</li>
      </ul>

      <h4 style={{ marginTop: '20px' }}>Recommendation</h4>
      <p style={{ color: shortTermRec.includes('Buy') ? 'green' : shortTermRec.includes('Sell') ? 'red' : 'orange' }}>
        <strong>Short-Term (&lt;3M): {shortTermRec}</strong>
      </p>
      <p style={{ color: longTermRec.includes('Buy') ? 'green' : longTermRec.includes('Sell') ? 'red' : 'orange' }}>
        <strong>Long-Term (&gt;1Y): {longTermRec}</strong>
      </p>

      <h4>Entry Range:</h4>
      <p>{formatCurrency(entryMin)} – {formatCurrency(entryMax)}</p>

      <h4>Target:</h4>
      <p>{formatCurrency(target)}</p>

      <h4>Stop-Loss:</h4>
      <p>{formatCurrency(stopLoss)}</p>

      <h4>Risk/Reward</h4>
      <p>Risk: {formatPercent(risk)} | Reward: {formatPercent(reward)}</p>
      <p>Ratio: {rrRatio ? `1:${rrRatio.toFixed(2)}` : '—'}</p>
    </div>
  );
};

export default StrategyBox;
