import { useState } from 'react';

const stockList = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
];

export default function StockSelector({ onSelectStock }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStocks = stockList.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="NormalCharacterStyle1">Select a Stock</h2>
      <input
        type="text"
        placeholder="Search stocks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />
      <div style={{
        maxHeight: '200px',
        overflowY: 'auto',
        border: '1px solid #eee',
        padding: '10px',
        borderRadius: '5px'
      }}>
        {filteredStocks.map(stock => (
          <div
            key={stock.symbol}
            onClick={() => onSelectStock(stock)}
            style={{ padding: '5px', cursor: 'pointer' }}
          >
            {stock.symbol} - {stock.name}
          </div>
        ))}
      </div>
    </div>
  );
}
