import connectMongo from '../../database/conn';
import Subscribers from '../../model/SubscriberSchema';
import requireSession from '../../lib/requireSession';

// downloads every email signup as a CSV file
export default async function handler(req, res) {
  const session = await requireSession(req, res);
  if (!session) return;

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
