import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

// Vercel rejects request bodies over 4.5 MB, so large photos are scaled down first
const MAX_DIMENSION = 2000;
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

async function shrinkImage(file) {
  if (file.size <= MAX_UPLOAD_BYTES && file.type !== "image/heic") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    // the browser can't decode this format; send the original
    return file;
  }
}

export default function DragDropUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const upload = await shrinkImage(file);
      if (upload.size > MAX_UPLOAD_BYTES) {
        throw new Error("This photo is too large. Please use one under 4 MB.");
      }

      const formData = new FormData();
      formData.append("file", upload);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        throw new Error(data.error || `Upload failed (${res.status})`);
      }
      if (onUploadComplete) onUploadComplete(data.url);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div
        {...getRootProps()}
        className={`w-full max-w-md p-10 border-2 border-dashed rounded-2xl transition ${
          isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-400 text-center">Drop the file here ...</p>
        ) : (
          <p className="text-gray-500 text-center">Drag & drop an image here, or click to select</p>
        )}
      </div>

      {uploading && <p className="mt-4 text-gray-400">Uploading...</p>}
      {error && <p className="mt-4 text-rose-500" role="alert">{error}</p>}
    </div>
  );
}
