import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function DragDropUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (onUploadComplete) {
        console.log(data.url)
        onUploadComplete(data.url); // <<< Call parent function here!
        
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
    </div>
  );
}
