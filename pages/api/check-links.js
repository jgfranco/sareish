import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import connectMongo from '../../database/conn';
import checkLinks from '../../lib/checkLinks';

// runs the broken link check: weekly from the Vercel cron in vercel.json, or from the editor
export default async function handler(req, res) {
  const fromCron = process.env.CRON_SECRET && req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`;
  if (!fromCron && !(await getServerSession(req, res, authOptions))) {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    await connectMongo();
    const results = await checkLinks();
    const broken = results.filter(r => r.status === 'broken').length;
    return res.status(200).json({ checked: results.length, broken });
  } catch (err) {
    console.error("Link check error:", err);
    return res.status(500).json({ error: "Link check failed" });
  }
}
