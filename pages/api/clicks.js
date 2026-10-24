import mongoose from 'mongoose';
import connectMongo from '../../database/conn';
import Links from '../../model/LinkSchema';

// counts a click on a homepage link; called with navigator.sendBeacon
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "HTTP method not allowed" });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { _id } = body || {};
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).json({ error: "Invalid link id" });
  }

  try {
    await connectMongo();
    await Links.updateOne({ _id }, { $inc: { clicks: 1 } });
    return res.status(204).end();
  } catch (err) {
    console.error("Click error:", err);
    return res.status(500).json({ error: "Failed to count click" });
  }
}
