import { useState } from 'react';

export default function InvestmentForm() {
  const [amount, setAmount] = useState(100);

  return (
    <div className="p-4 bg-white border rounded shadow space-y-3">
      <label className="block text-[14px] font-semibold">Select Stock</label>
      <select className="w-full p-2 border rounded">
        <option value="AAPL">AAPL</option>
        <option value="MSFT">MSFT</option>
        <option value="GOOGL">GOOGL</option>
      </select>

      <label className="block text-[14px] font-semibold">Amount of Investment</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-1/2 p-2 border rounded"
      />

      <div className="flex space-x-2">
        <button className="bg-green-600 text-white px-4 py-2 rounded">Buy</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded">Sell</button>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 rounded">Analyze</button>
    </div>
  );
}
