import CandlestickChart from './CandlestickChart';
import TrendChart from './TrendChart';

export default function StockDetails({ stock, amount }) {
  return (
    <div>
      <h2 className="NormalCharacterStyle1" style={{ textAlign: 'center' }}>
        {stock.symbol} - {stock.name}
      </h2>

      {/* Current Price and Forecast */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <h3 className="NormalCharacterStyle8">Price: $XXX.XX</h3>
        <div style={{ marginTop: '5px', fontSize: '18px', color: 'green' }}>
          📈 Expected Trend: Up
        </div>
      </div>

      {/* Candlestick Chart */}
      <div style={{ marginTop: '30px' }}>
        <h3 className="NormalCharacterStyle1">Candlestick Chart</h3>
        <CandlestickChart symbol={stock.symbol} />
      </div>

      {/* Trend Chart */}
      <div style={{ marginTop: '30px' }}>
        <h3 className="NormalCharacterStyle1">Price Trend Chart</h3>
        <TrendChart symbol={stock.symbol} />
      </div>

      {/* Investment Strategy Output */}
      <div style={{ marginTop: '30px', padding: '20px', background: '#eef9f1', borderRadius: '10px' }}>
        <h3 className="NormalCharacterStyle1">Investment Strategy</h3>
        <div style={{ marginTop: '10px' }}>
          <strong>Investment Amount:</strong> ${amount}<br />
          <strong>Strategy Recommendation:</strong> 🟢 Buy<br />
          <strong>Target Price:</strong> $XX.XX - $YY.YY<br />
          <strong>Expected Profit Timeline:</strong><br />
          • 1 Month: +$Z1<br />
          • 3 Months: +$Z2<br />
          • 6 Months: +$Z3<br />
          • 1 Year: +$Z4
        </div>
      </div>
    </div>
  );
}
