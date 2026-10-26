import mongoose from 'mongoose';
import connectMongo from '../../database/conn';
import Links from '../../model/LinkSchema';
import Clicks from '../../model/ClickSchema';
import { clickSources } from '../../lib/clickSource';

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
  const source = clickSources.includes(body?.source) ? body.source : 'other';
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).json({ error: "Invalid link id" });
  }

  try {
    await connectMongo();
    await Promise.all([
      Links.updateOne({ _id }, { $inc: { clicks: 1 } }),
      Clicks.create({ link: _id, source }),
    ]);
    return res.status(204).end();
  } catch (err) {
    console.error("Click error:", err);
    return res.status(500).json({ error: "Failed to count click" });
  }
}
