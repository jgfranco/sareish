import * as formidable from "formidable";
import cloudinary from "cloudinary";
import requireSession from "../../lib/requireSession";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const session = await requireSession(req, res);
  if (!session) return;

  // images only, up to 10 MB
  const form = new formidable.IncomingForm({
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024,
    filter: ({ mimetype }) => Boolean(mimetype && mimetype.startsWith("image/")),
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const file = files.file?.[0];
    if (!file) return res.status(400).json({ error: "An image file is required" });

    try {
      const result = await cloudinary.v2.uploader.upload(file.filepath, {
        folder: "nextjs_uploads",
      });

      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
