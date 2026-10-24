import * as formidable from "formidable";
import cloudinary from "cloudinary";
import requireSession from "../../lib/requireSession";

export const config = {
  api: {
    bodyParser: false,
  },
};

const requiredEnv = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// images only, up to 10 MB
function parseForm(req) {
  const form = new formidable.IncomingForm({
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024,
    filter: ({ mimetype }) => Boolean(mimetype && mimetype.startsWith("image/")),
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve(files)));
  });
}

// cloudinary rejects with { error: { message } } rather than an Error
function errorMessage(error) {
  return error?.message || error?.error?.message || error?.error?.code || "Upload failed";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const session = await requireSession(req, res);
  if (!session) return;

  const missing = requiredEnv.filter((name) => !process.env[name]);
  if (missing.length) {
    console.error("Upload is not configured, missing:", missing.join(", "));
    return res.status(500).json({ error: `Uploads aren't set up yet (missing ${missing.join(", ")})` });
  }

  let files;
  try {
    files = await parseForm(req);
  } catch (err) {
    return res.status(400).json({ error: errorMessage(err) });
  }

  const file = files.file?.[0];
  if (!file) return res.status(400).json({ error: "An image file is required" });

  try {
    const result = await cloudinary.v2.uploader.upload(file.filepath, {
      folder: "nextjs_uploads",
    });
    return res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ error: errorMessage(error) });
  }
}
