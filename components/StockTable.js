import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then(res => res.data);

export default function StockTable() {
  const { data, error } = useSWR('/api/stockTable', fetcher, { refreshInterval: 300000 });

  if (error) return <div>Failed to load stock data.</div>;
  if (!data) return <div>Loading stock data...</div>;

  return (
    <div style={{ marginTop: '30px' }}>
      <h2 className="NormalCharacterStyle1">Real-Time US Stocks</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Symbol</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Price</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Trend</th>
          </tr>
        </thead>
        <tbody>
          {data.map(stock => (
            <tr key={stock.symbol}>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{stock.symbol}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>${stock.price.toFixed(2)}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                {stock.trend === 'up' ? (
                  <span style={{ color: 'green' }}>▲</span>
                ) : (
                  <span style={{ color: 'red' }}>▼</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
