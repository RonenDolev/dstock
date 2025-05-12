
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ChartView({ selectedStock, setCandles }) {
  const [chartData, setChartData] = useState([]);
  const [selectedRange, setSelectedRange] = useState('1M');

  useEffect(() => {
    const fetchData = async () => {
      const symbol = selectedStock.symbol;
      const to = new Date().toISOString().split('T')[0];
      const from = getStartDate(selectedRange);

      const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`;
      console.log("🔍 API URL:", url);

      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("✅ API Data:", data);

        if (data.results && data.results.length > 0) {
          const candles = data.results.map(item => ({
            x: new Date(item.t),
            y: [item.o, item.h, item.l, item.c]
          }));

          setChartData(candles);
          if (setCandles) setCandles(candles);
        } else {
          console.warn("⚠️ No results, fallback to dummy.");
          const dummy = [{
            x: new Date('2024-04-01'),
            y: [150, 160, 145, 158]
          }, {
            x: new Date('2024-04-02'),
            y: [158, 165, 155, 160]
          }];
          setChartData(dummy);
          if (setCandles) setCandles(dummy);
        }
      } catch (err) {
        console.error("❌ API Error:", err);
        setChartData([]);
        if (setCandles) setCandles([]);
      }
    };

    fetchData();
  }, [selectedStock, selectedRange]);

  const getStartDate = (range) => {
    const today = new Date();
    switch (range) {
      case '1D': return formatDateOffset(today, -1);
      case '1W': return formatDateOffset(today, -7);
      case '1M': return formatDateOffset(today, -30);
      case '3M': return formatDateOffset(today, -90);
      case '6M': return formatDateOffset(today, -180);
      case '1Y': return formatDateOffset(today, -365);
      case '5Y': return formatDateOffset(today, -1825);
      default: return formatDateOffset(today, -30);
    }
  };

  const formatDateOffset = (date, offsetDays) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + offsetDays);
    return newDate.toISOString().split('T')[0];
  };

  return (
    <div>
      <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>
        {selectedStock.symbol} - {selectedStock.name}
      </h3>

      <div style={{ marginBottom: '10px' }}>
        {['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'].map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            style={{
              marginRight: '5px',
              padding: '5px 10px',
              backgroundColor: selectedRange === range ? '#231F20' : '#ddd',
              color: selectedRange === range ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              fontFamily: 'Bahnschrift',
              cursor: 'pointer'
            }}
          >
            {range}
          </button>
        ))}
      </div>

      {chartData.length > 0 ? (
        <>
          <ApexChart
            type="candlestick"
            height={300}
            series={[{ data: chartData }]}
            options={{
              chart: { type: 'candlestick', toolbar: { show: false } },
              xaxis: { type: 'datetime' }
            }}
          />

          <h4 style={{ marginTop: '20px', fontSize: '18px' }}>Price Trend</h4>
          <ApexChart
            type="line"
            height={200}
            series={[{
              name: "Close Price",
              data: chartData.map(item => ({ x: item.x, y: item.y[3] }))
            }]}
            options={{
              chart: { type: 'line', toolbar: { show: false } },
              xaxis: { type: 'datetime' }
            }}
          />
        </>
      ) : (
        <p>No chart data available.</p>
      )}
    </div>
  );
}
