import connectMongo from '../../database/conn';
import Subscribers from '../../model/SubscriberSchema';
import requireSession from '../../lib/requireSession';
import { addToKit, kitEnabled } from '../../lib/kit';

// GET downloads every email signup as a CSV file; POST copies them all to Kit
export default async function handler(req, res) {
  const session = await requireSession(req, res);
  if (!session) return;

  if (req.method === 'POST') {
    if (!kitEnabled()) return res.status(400).json({ error: "Kit isn't connected yet" });
    try {
      await connectMongo();
      const subscribers = await Subscribers.find({}, { email: 1 });
      let added = 0;
      // one at a time to stay under Kit's limit of 120 requests a minute
      for (const s of subscribers) {
        if (await addToKit(s.email)) added++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      return res.status(200).json({ total: subscribers.length, added });
    } catch (err) {
      console.error("Kit sync error:", err);
      return res.status(500).json({ error: "Copying to Kit failed" });
    }
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: "HTTP method not allowed" });
  }

  try {
    await connectMongo();
    const subscribers = await Subscribers.find().sort({ at: 1 });
    const rows = subscribers.map(s => `${s.email},${s.at.toISOString()}`);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="sareish-subscribers.csv"');
    return res.status(200).send(['email,signed_up', ...rows].join('\n'));
  } catch (err) {
    console.error("Subscribers error:", err);
    return res.status(500).json({ error: "Failed to load subscribers" });
  }
}
