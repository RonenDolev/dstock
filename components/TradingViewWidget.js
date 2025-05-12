// components/TradingViewWidget.js
import React, { useEffect, useRef } from 'react';

const TradingViewWidget = ({ symbol }) => {
  const chartRef = useRef(null);
  const shortChartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const script1 = document.createElement('script');
    script1.src = 'https://s3.tradingview.com/tv.js';
    script1.async = true;

    script1.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          symbol: symbol || 'NASDAQ:AAPL',
          interval: 'W',
          container_id: 'tv_chart_container',
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          hide_side_toolbar: true,
          withdateranges: false,
          studies: ['MACD@tv-basicstudies', 'RSI@tv-basicstudies'],
          autosize: true,
        });
      }
    };

    chartRef.current.appendChild(script1);
  }, [symbol]);

  useEffect(() => {
    if (!shortChartRef.current) return;

    const script2 = document.createElement('script');
    script2.src = 'https://s3.tradingview.com/tv.js';
    script2.async = true;

    script2.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          symbol: symbol || 'NASDAQ:AAPL',
          interval: 'D',
          container_id: 'tv_chart_short_term',
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: false,
          hide_side_toolbar: true,
          withdateranges: false,
          studies: ['BB@tv-basicstudies', 'FibRetracement@tv-basicstudies'],
          autosize: true,
        });
      }
    };

    shortChartRef.current.appendChild(script2);
  }, [symbol]);

  return (
    <>
      <div style={{ width: '100%', height: '600px', marginBottom: '40px' }}>
        <h3>Technical Analysis – Weekly</h3>
        <div id="tv_chart_container" ref={chartRef} style={{ width: '100%', height: '100%' }} />
      </div>

      <div style={{ width: '100%', height: '500px' }}>
        <h3>Short-Term Daily Chart</h3>
        <div id="tv_chart_short_term" ref={shortChartRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </>
  );
};

export default TradingViewWidget;
