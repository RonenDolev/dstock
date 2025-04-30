import { useState } from 'react';
import StockSelector from '../components/StockSelector';
import InvestmentForm from '../components/InvestmentForm';
import StockTable from '../components/StockTable';
import StockDetails from '../components/StockDetails';

export default function Home() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState(10);

  return (
    <div style={{ fontFamily: 'Bahnschrift', padding: '20px' }}>
      {/* Logo + Title */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <img src="/dstock_logo.png" alt="Logo" style={{ height: '60px', width: 'auto' }} />
        <h1 style={{ fontSize: '60px', marginLeft: '20px', color: '#231F20' }}>
          Stock Analysis Generator
        </h1>
      </div>

      {/* Trend Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span>S&P 500: ▲</span>
        <span>Nasdaq: ▼</span>
        <span>Dow: ▲</span>
        <span>Russell 2000: ▲</span>
        <span>Gold: ▼</span>
        <span>Silver: ▲</span>
        <span>EUR/USD: ▲</span>
        <span>EUR/ILS: ▼</span>
        <span>USD/ILS: ▲</span>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Left Panel */}
        <div style={{ flex: 1 }}>
          <StockSelector onSelectStock={setSelectedStock} />
          <InvestmentForm amount={investmentAmount} setAmount={setInvestmentAmount} />
          <StockTable />
        </div>

        {/* Right Panel */}
        <div style={{ flex: 2, background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
          {selectedStock ? (
            <StockDetails stock={selectedStock} amount={investmentAmount} />
          ) : (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '100px' }}>
              Please select a stock to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
