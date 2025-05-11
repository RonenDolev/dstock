import { useEffect, useState } from 'react';

export default function InvestmentTable() {
  const [data, setData] = useState([
    { stock: 'AAPL', amount: 100 },
    { stock: 'MSFT', amount: 150 }
  ]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const responses = await Promise.all(
          data.map(item =>
            fetch(`https://api.polygon.io/v2/aggs/ticker/${item.stock}/prev?adjusted=true&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`)
              .then(res => res.json())
          )
        );

        const updated = data.map((item, index) => {
          const res = responses[index];
          const change = ((res.results[0].c - res.results[0].o) / res.results[0].o) * 100;
          const currentValue = item.amount * (1 + change / 100);

          return {
            ...item,
            change: change.toFixed(2) + '%',
            value: '$' + currentValue.toFixed(2),
            color: change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-orange-500'
          };
        });

        setData(updated);
      } catch (error) {
        console.error('Error fetching investment data:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const removeStock = (index) => {
    setData(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-4 bg-white border rounded shadow">
      <h2 className="text-lg font-semibold p-2 border-b">Investment Table</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Stock</th>
            <th className="p-2 text-left">% Change</th>
            <th className="p-2 text-left">Current Value</th>
            <th className="p-2 text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{item.stock}</td>
              <td className={`p-2 ${item.color}`}>{item.change}</td>
              <td className="p-2">{item.value}</td>
              <td className="p-2 text-center">
                <button onClick={() => removeStock(idx)} className="text-red-500 font-bold">X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
