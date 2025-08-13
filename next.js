import dbConnect from '../../lib/mongoose';

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (error) {
    console.error('API error:', error.message);
    res.status(500).json({ error: error.message });
  }
}