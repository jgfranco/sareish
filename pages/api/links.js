import connectMongo from '../../database/conn';
import Links from '../../model/LinkSchema';
import requireSession from '../../lib/requireSession';

// rebuild the static homepage so changes show up right away
async function refreshHomepage(res) {
  try {
    await res.revalidate('/');
  } catch (err) {
    console.error("Revalidate error:", err);
  }
}

export default async function handler(req, res) {
  const session = await requireSession(req, res);
  if (!session) return;

  try {
    await connectMongo();
  } catch (error) {
    console.error("Connection error:", error);
    return res.status(500).json({ error: "Connection Failed...!" });
  }

  if (req.method === 'POST') {
    if (!req.body) return res.status(400).json({ error: "Don't have form data...!" });

    const { index, title, url, active, photoUrl } = req.body;
    const badge = cleanBadge(req.body.badge);
    const startAt = toDate(req.body.startAt), endAt = toDate(req.body.endAt);

    try {
      const data = await Links.create({ index, title, url, active, photoUrl, badge, startAt, endAt });
      await refreshHomepage(res);
      return res.status(201).json({ status: true, link: data });
    } catch (err) {
      console.error("Create error:", err);
      return res.status(500).json({ error: "Failed to create link" });
    }

  } else if (req.method === 'GET') {
    try {
      const links = await Links.find();
      return res.status(200).json({ links });
    } catch (err) {
      console.error("Fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch links" });
    }

  } else if (req.method === 'PATCH') {
    if (!req.body) return res.status(400).json({ error: "Don't have form data...!" });

    const { _id, index, title, url, active, photoUrl } = req.body;
    const badge = cleanBadge(req.body.badge);
    const startAt = toDate(req.body.startAt), endAt = toDate(req.body.endAt);

    try {
      const updateResult = await Links.updateOne(
        { _id },
        { index, title, url, active, photoUrl, badge, startAt, endAt }
      );
      await refreshHomepage(res);

      return res.status(200).json({ status: true, result: updateResult });
    } catch (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Failed to update link" });
    }

  } else if (req.method === 'PUT') {
    // reorder: ids arrive in display order, first one gets the highest index
    const { order } = req.body || {};
    if (!Array.isArray(order) || !order.length) return res.status(400).json({ error: "Missing link order" });

    try {
      await Links.bulkWrite(order.map((_id, i) => ({
        updateOne: { filter: { _id }, update: { index: String(order.length - 1 - i) } },
      })));
      await refreshHomepage(res);
      return res.status(200).json({ status: true });
    } catch (err) {
      console.error("Reorder error:", err);
      return res.status(500).json({ error: "Failed to save the new order" });
    }

  } else if (req.method === 'DELETE') {
    const { _id } = req.body || {};
    if (!_id) return res.status(400).json({ error: "Missing link id" });

    try {
      await Links.deleteOne({ _id });
      await refreshHomepage(res);
      return res.status(200).json({ status: true });
    } catch (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Failed to delete link" });
    }

  } else {
    res.status(405).json({ message: "HTTP method not allowed" });
  }
}

// only the badges the homepage knows how to show
function cleanBadge(badge){
  return ['New', 'Featured'].includes(badge) ? badge : '';
}

// a date from the editor, or null to clear it
function toDate(value){
  const date = value ? new Date(value) : null;
  return date && !isNaN(date) ? date : null;
}
