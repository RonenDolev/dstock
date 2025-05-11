// File: components/MarketBar.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MarketBar() {
  const [data, setData] = useState([]);
  const POLYGON_API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

  const tickers = [
    { name: 'S&P 500', symbol: 'I:SPX' },
    { name: 'Nasdaq 100', symbol: 'I:NDX' },
    { name: 'Dow Jones', symbol: 'I:DJI' },
    { name: 'Russell 2000', symbol: 'I:RUT' },
    { name: 'EUR/USD', symbol: 'C:EURUSD' },
    { name: 'USD/ILS', symbol: 'C:USDILS' },
    { name: 'EUR/ILS', symbol: 'C:EURILS' },
    { name: 'Gold', symbol: 'C:XAUUSD' },
    { name: 'Silver', symbol: 'C:XAGUSD' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all(
        tickers.map(async ({ name, symbol }) => {
          try {
            const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
            const res = await axios.get(url);
            const { o, c } = res.data?.results?.[0] || {};
            const change = o && c ? ((c - o) / o) * 100 : 0;

            const color =
              change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-orange-400';

            return {
              name,
              value: `${c ? c.toFixed(2) : '-'} (${change ? change.toFixed(2) : '0.00'}%)`,
              color
            };
          } catch (err) {
            console.warn(`❌ ${name} fetch error:`, err?.message);
            return { name, value: '-', color: 'text-orange-400' };
          }
        })
      );

      setData(results);
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [POLYGON_API_KEY]);

  return (
    <div className="bg-gray-800 text-white py-2 px-4 text-[1.1rem] grid grid-cols-9 gap-2 justify-between">
      {data.map((item, idx) => (
        <div key={idx} className={`flex justify-center ${item.color} font-semibold`}>
          {item.name}: {item.value}
        </div>
      ))}
    </div>
  );
}