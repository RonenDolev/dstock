export default function InvestmentForm({ amount, setAmount }) {
  return (
    <div style={{ marginTop: '20px' }}>
      <h2 className="NormalCharacterStyle1">Investment Amount ($)</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
        min="1"
      />
    </div>
  );
}
