import connectMongo from '../../database/conn';
import Subscribers from '../../model/SubscriberSchema';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// saves an email signup from the homepage
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "HTTP method not allowed" });
  }

  const { email, website } = req.body || {};
  // hidden field that only bots fill in; pretend it worked
  if (website) return res.status(200).json({ status: true });

  const clean = String(email || '').trim().toLowerCase();
  if (clean.length > 254 || !emailPattern.test(clean)) {
    return res.status(400).json({ error: "Please enter a valid email" });
  }

  try {
    await connectMongo();
    // signing up twice is fine, it just keeps the first date
    await Subscribers.updateOne({ email: clean }, { $setOnInsert: { email: clean, at: new Date() } }, { upsert: true });
    return res.status(200).json({ status: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return res.status(500).json({ error: "Something went wrong, please try again" });
  }
}
