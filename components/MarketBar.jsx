import React, { useEffect, useState } from 'react';
import { fetchMarketIndicators } from '../utils/fetchStockData';

const MarketBar = () => {
  const [indicators, setIndicators] = useState([]);

  useEffect(() => {
  const load = async () => {
    const data = await fetchMarketIndicators();
    console.log("📊 MarketBar Data:", data); // <- Add this line
    setIndicators(data);
  };
  load();
  const interval = setInterval(load, 60000);
  return () => clearInterval(interval);
}, []);


  return (
    <div style={{
      backgroundColor: '#333',
      color: 'white',
      padding: '10px 5%',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '10px',
      fontSize: '18px',
      fontFamily: 'Bahnschrift Light'
    }}>
      {indicators.map((item, idx) => (
        <div key={idx} style={{ color: item.color }}>
          {item.display}
        </div>
      ))}
    </div>
  );
};

export default MarketBar;
