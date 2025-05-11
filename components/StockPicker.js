import { useState } from 'react';

const STOCK_LIST = [
  {symbol: 'AAPL', name: 'Apple Inc.'},
{symbol: 'MSFT', name: 'Microsoft Corporation'},
{symbol: 'NVDA', name: 'NVIDIA Corporation'},
{symbol: 'AMZN', name: 'Amazon.com, Inc.'},
{symbol: 'GOOGL', name: 'Alphabet Inc. (Class A)'},
{symbol: 'META', name: 'Meta Platforms, Inc.'},
{symbol: 'BRK.B', name: 'Berkshire Hathaway Inc. (Class B)'},
{symbol: 'GOOG', name: 'Alphabet Inc. (Class C)'},
{symbol: 'AVGO', name: 'Broadcom Inc.'},
{symbol: 'TSLA', name: 'Tesla, Inc.'},
{symbol: 'LLY', name: 'Eli Lilly and Company'},
{symbol: 'JPM', name: 'JPMorgan Chase & Co.'},
{symbol: 'WMT', name: 'Walmart Inc.'},
{symbol: 'V', name: 'Visa Inc.'},
{symbol: 'XOM', name: 'Exxon Mobil Corporation'},
{symbol: 'MA', name: 'Mastercard Incorporated'},
{symbol: 'UNH', name: 'UnitedHealth Group Incorporated'},
{symbol: 'ORCL', name: 'Oracle Corporation'},
{symbol: 'NFLX', name: 'Netflix, Inc.'},
{symbol: 'COST', name: 'Costco Wholesale Corporation'},
{symbol: 'JNJ', name: 'Johnson & Johnson'},
{symbol: 'PG', name: 'The Procter & Gamble Company'},
{symbol: 'ABBV', name: 'AbbVie Inc.'},
{symbol: 'HD', name: 'The Home Depot, Inc.'},
{symbol: 'BAC', name: 'Bank of America Corporation'},
{symbol: 'TMUS', name: 'T-Mobile US, Inc.'},
{symbol: 'CRM', name: 'Salesforce, Inc.'},
{symbol: 'CVX', name: 'Chevron Corporation'},
{symbol: 'WFC', name: 'Wells Fargo & Company'},
{symbol: 'CSCO', name: 'Cisco Systems, Inc.'},
{symbol: 'ABT', name: 'Abbott Laboratories'},
{symbol: 'KO', name: 'The Coca-Cola Company'},
{symbol: 'PEP', name: 'PepsiCo, Inc.'},
{symbol: 'MRK', name: 'Merck & Co., Inc.'},
{symbol: 'PFE', name: 'Pfizer Inc.'},
{symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.'},
{symbol: 'INTC', name: 'Intel Corporation'},
{symbol: 'CMCSA', name: 'Comcast Corporation'},
{symbol: 'DIS', name: 'The Walt Disney Company'},
{symbol: 'ADBE', name: 'Adobe Inc.'},
{symbol: 'PYPL', name: 'PayPal Holdings, Inc.'},
{symbol: 'ACN', name: 'Accenture plc'},
{symbol: 'NVDA', name: 'Nvidia Corporation'},
{symbol: 'ASML', name: 'ASML Holding N.V.'},
{symbol: 'TM', name: 'Toyota Motor Corporation'},
{symbol: 'TSM', name: 'Taiwan Semiconductor Manufacturing Company Limited'},
{symbol: 'SIEGY', name: 'Siemens AG'},
{symbol: 'RMS.PA', name: 'Hermès International Société en commandite par actions'},
{symbol: 'SAP', name: 'SAP SE'},
{symbol: 'AZN', name: 'AstraZeneca PLC'},
{symbol: 'NESN.SW', name: 'Nestlé S.A.'},
{symbol: 'SHELL', name: 'Shell plc'},
{symbol: 'HSBC', name: 'HSBC Holdings plc'},
{symbol: 'BABA', name: 'Alibaba Group Holding Limited'},
{symbol: 'LVMUY', name: 'LVMH Moët Hennessy Louis Vuitton SE'},
{symbol: 'TCEHY', name: 'Tencent Holdings Limited'},
{symbol: 'NVO', name: 'Novo Nordisk A/S'},
{symbol: 'ORAN', name: 'Orange S.A.'},
{symbol: 'SNY', name: 'Sanofi'},
{symbol: 'ROG.SW', name: 'Roche Holding AG'},
{symbol: 'BP', name: 'BP p.l.c.'},
{symbol: 'TM', name: 'Toyota Motor Corp'},
{symbol: 'RELX', name: 'RELX PLC'},
{symbol: 'UL', name: 'Unilever PLC'},
{symbol: 'SHEL', name: 'Shell PLC'},
{symbol: 'CVX', name: 'Chevron Corp.'},
{symbol: 'XOM', name: 'Exxon Mobil Corp.'},
{symbol: 'JPM', name: 'JPMorgan Chase & Co.'},
{symbol: 'BAC', name: 'Bank of America Corp.'},
{symbol: 'BNPQY', name: 'BNP Paribas SA'},
{symbol: 'TD', name: 'The Toronto-Dominion Bank'},
{symbol: 'RY', name: 'Royal Bank of Canada'},
{symbol: 'C', name: 'Citigroup Inc.'},
{symbol: 'MS', name: 'Morgan Stanley'},
{symbol: 'GS', name: 'The Goldman Sachs Group, Inc.'},
{symbol: 'AXP', name: 'American Express Co.'},
{symbol: 'MA', name: 'Mastercard Inc.'},
{symbol: 'V', name: 'Visa Inc.'},
{symbol: 'NEE', name: 'NextEra Energy, Inc.'},
{symbol: 'SO', name: 'The Southern Company'},
{symbol: 'DUK', name: 'Duke Energy Corporation'},
{symbol: 'NGG', name: 'National Grid plc'},
{symbol: 'D', name: 'Dominion Energy, Inc.'},
{symbol: 'NEE', name: 'NextEra Energy Inc.'},
{symbol: 'TSN', name: 'Tyson Foods, Inc.'},
{symbol: 'ADM', name: 'Archer-Daniels-Midland Company'},
{symbol: 'MO', name: 'Altria Group, Inc.'},
{symbol: 'PM', name: 'Philip Morris International Inc.'},
{symbol: 'KMB', name: 'Kimberly-Clark Corporation'},
{symbol: 'CL', name: 'Colgate-Palmolive Company'},
{symbol: 'MDLZ', name: 'Mondelez International, Inc.'},
{symbol: 'SBUX', name: 'Starbucks Corporation'},
{symbol: 'MCD', name: 'McDonalds Corporation'},
{symbol: 'HD', name: 'The Home Depot, Inc.'},
{symbol: 'LOW', name: 'Lowes Companies, Inc.'},
{symbol: 'TGT', name: 'Target Corporation'},
{symbol: 'COST', name: 'Costco Wholesale Corporation'},
{symbol: 'NKE', name: 'NIKE, Inc.'},
{symbol: 'GM', name: 'General Motors Company'},
{symbol: 'F', name: 'Ford Motor Company'},
{symbol: 'TM', name: 'Toyota Motor Corporation'},
{symbol: 'HMC', name: 'Honda Motor Co., Ltd.'},
{symbol: 'RACE', name: 'Ferrari N.V.'},
{symbol: 'JPM', name: 'JPMorgan Chase & Co.'},
{symbol: 'V', name: 'Visa Inc.'},
{symbol: 'MA', name: 'Mastercard Incorporated'},
{symbol: 'UNH', name: 'UnitedHealth Group Incorporated'},
{symbol: 'ORCL', name: 'Oracle Corporation'},
{symbol: 'JNJ', name: 'Johnson & Johnson'},
{symbol: 'PG', name: 'The Procter & Gamble Company'},
{symbol: 'ABBV', name: 'AbbVie Inc.'},
{symbol: 'HD', name: 'The Home Depot, Inc.'},
{symbol: 'BAC', name: 'Bank of America Corporation'},
{symbol: 'CVX', name: 'Chevron Corporation'},
{symbol: 'WFC', name: 'Wells Fargo & Company'},
{symbol: 'ABT', name: 'Abbott Laboratories'},
{symbol: 'KO', name: 'The Coca-Cola Company'},
{symbol: 'MRK', name: 'Merck & Co., Inc.'},
{symbol: 'PFE', name: 'Pfizer Inc.'},
{symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.'},
{symbol: 'CMCSA', name: 'Comcast Corporation'},
{symbol: 'DIS', name: 'The Walt Disney Company'},
{symbol: 'ACN', name: 'Accenture plc'},
{symbol: 'ASML', name: 'ASML Holding N.V.'},
{symbol: 'TM', name: 'Toyota Motor Corporation'},
{symbol: 'TSM', name: 'Taiwan Semiconductor Manufacturing Company Limited'},
{symbol: 'SIEGY', name: 'Siemens AG'},
{symbol: 'RMS.PA', name: 'Hermès International Société en commandite par actions'},
{symbol: 'SAP', name: 'SAP SE'},
{symbol: 'AZN', name: 'AstraZeneca PLC'},
{symbol: 'NESN.SW', name: 'Nestlé S.A.'},
{symbol: 'SHELL', name: 'Shell plc'},
{symbol: 'HSBC', name: 'HSBC Holdings plc'},
{symbol: 'BABA', name: 'Alibaba Group Holding Limited'},
{symbol: 'LVMUY', name: 'LVMH Moët Hennessy Louis Vuitton SE'},
{symbol: 'TCEHY', name: 'Tencent Holdings Limited'},
{symbol: 'NVO', name: 'Novo Nordisk A/S'},
{symbol: 'ORAN', name: 'Orange S.A.'},
{symbol: 'SNY', name: 'Sanofi'},
{symbol: 'ROG.SW', name: 'Roche Holding AG'},
{symbol: 'BP', name: 'BP p.l.c.'},
{symbol: 'RELX', name: 'RELX PLC'},
{symbol: 'UL', name: 'Unilever PLC'},
{symbol: 'SHEL', name: 'Shell PLC'},
{symbol: 'CVX', name: 'Chevron Corp.'},
{symbol: 'XOM', name: 'Exxon Mobil Corp.'},
{symbol: 'BNPQY', name: 'BNP Paribas SA'},
{symbol: 'TD', name: 'The Toronto-Dominion Bank'},
{symbol: 'RY', name: 'Royal Bank of Canada'},
{symbol: 'C', name: 'Citigroup Inc.'},
{symbol: 'MS', name: 'Morgan Stanley'},
{symbol: 'GS', name: 'The Goldman Sachs Group, Inc.'},
{symbol: 'AXP', name: 'American Express Co.'},
{symbol: 'NEE', name: 'NextEra Energy, Inc.'},
{symbol: 'SO', name: 'The Southern Company'},
{symbol: 'HPQ', name: 'HP Inc.'},

];

export default function StockPicker({ onSelect }) {
  const [stock, setStock] = useState('AAPL');
  const [amount, setAmount] = useState(10);
  const [price, setPrice] = useState(null);
  const [investments, setInvestments] = useState([]);

  const handleAnalyze = async () => {
    const res = await fetch(`/api/price?symbol=${stock}`);
    const data = await res.json();
    setPrice(data.price);
    onSelect(stock);
  };

  const handleBuy = async () => {
    const res = await fetch(`/api/price?symbol=${stock}`);
    const data = await res.json();
    const entry = {
      symbol: stock,
      amount: Number(amount),
      price: Number(data.price),
      change: (Math.random() * 0.2 - 0.1).toFixed(2)
    };
    setInvestments((prev) => [...prev, entry]);
  };

  const handleSell = () => {
    setInvestments((prev) => prev.filter(inv => inv.symbol !== stock));
  };

  const handleDelete = (symbol) => {
    setInvestments((prev) => prev.filter(inv => inv.symbol !== symbol));
  };

  const getColor = (rec) => rec === 'Buy' ? 'green' : rec === 'Hold' ? 'orange' : 'red';

  return (
    <div>
      <h2 style={{ fontSize: '30px' }}>Stock Analysis</h2>
      <label style={{ fontSize: '14px' }}>Select Stock</label>
      <select value={stock} onChange={(e) => setStock(e.target.value)} style={{ width: '100%', padding: '8px' }}>
        {STOCK_LIST.map(s => (
          <option key={s.symbol} value={s.symbol}>
            {s.name} ({s.symbol})
          </option>
        ))}
      </select>

      <label style={{ fontSize: '14px', marginTop: '10px', display: 'block' }}>Amount of Investment</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: '50%', padding: '8px', marginTop: '5px' }}
      />

      <div style={{ marginTop: '10px' }}>
        <button onClick={handleBuy} style={{ marginRight: '10px' }}>Buy</button>
        <button onClick={handleSell} style={{ marginRight: '10px' }}>Sell</button>
        <button onClick={handleAnalyze}>Analyze</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Top 5 Stocks to Watch</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>Stock</th><th>Price</th><th>Volatility</th><th>Recommendation</th></tr>
          </thead>
          <tbody>
            {STOCK_LIST.map((s, i) => {
              const rec = i % 3 === 0 ? 'Buy' : i % 3 === 1 ? 'Hold' : 'Sell';
              return (
                <tr key={i} style={{ borderBottom: '1px solid #ccc' }}>
                  <td>{s.symbol}</td>
                  <td>${(100 + i * 7).toFixed(2)}</td>
                  <td>{['Low', 'Medium', 'High'][i % 3]}</td>
                  <td style={{ color: getColor(rec) }}>{rec}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Investment Table</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>Stock</th><th>Amount ($)</th><th>Buy Price</th><th>% Change</th><th>Current Value</th><th></th></tr>
          </thead>
          <tbody>
            {investments.map((inv, i) => {
              const percent = parseFloat(inv.change) * 100;
              const current = (inv.amount * (1 + parseFloat(inv.change))).toFixed(2);
              const color = percent > 0 ? 'green' : percent < 0 ? 'red' : 'orange';
              return (
                <tr key={i} style={{ borderBottom: '1px solid #ccc' }}>
                  <td>{inv.symbol}</td>
                  <td>${inv.amount}</td>
                  <td>${inv.price.toFixed(2)}</td>
                  <td style={{ color }}>{percent.toFixed(2)}%</td>
                  <td>${current}</td>
                  <td><button onClick={() => handleDelete(inv.symbol)}>🗑️</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
