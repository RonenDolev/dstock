import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./public/portfolio.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = fs.existsSync(filePath) ? fs.readFileSync(filePath) : '[]';
    return res.status(200).json(JSON.parse(data));
  }

  if (req.method === 'POST') {
    const body = req.body;
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
    return res.status(200).json({ status: 'Saved' });
  }

  return res.status(405).end();
}
