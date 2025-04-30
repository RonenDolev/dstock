export default function handler(req, res) {
  res.status(200).json([
    { symbol: 'AAPL', price: 169.25, trend: 'up' },
    { symbol: 'MSFT', price: 312.40, trend: 'down' },
    { symbol: 'TSLA', price: 242.78, trend: 'up' }
  ]);
}