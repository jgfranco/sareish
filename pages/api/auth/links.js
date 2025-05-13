import connectMongo from '../../../database/conn';
import Links from '../../../model/LinkSchema';

export default async function handler(req, res) {
  console.log("handler has been called");

  await connectMongo().catch(error => {
    console.error("Connection error:", error);
    return res.status(500).json({ error: "Connection Failed...!" });
  });

  console.log("HTTP Method:", req.method);

  if (req.method === 'POST') {
    if (!req.body) return res.status(400).json({ error: "Don't have form data...!" });

    const { index, title, url, active, photoUrl } = req.body;

    try {
      const data = await Links.create({ index, title, url, active, photoUrl });
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

    try {
      console.log("Updating link with:", { _id, index, title, url, active, photoUrl });

      const updateResult = await Links.updateOne(
        { _id },
        { index, title, url, active, photoUrl }
      );

      return res.status(200).json({ status: true, result: updateResult });
    } catch (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Failed to update link" });
    }

  } else {
    res.status(405).json({ message: "HTTP method not allowed" });
  }
}
