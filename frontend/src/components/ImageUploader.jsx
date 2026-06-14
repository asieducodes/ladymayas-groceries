// src/components/ImageUploader.jsx
import { useRef, useState } from "react";
import { uploadImage } from "../services/api";

export default function ImageUploader({ currentUrl, onUploaded }) {
  const inputRef   = useRef();
  const [preview,   setPreview]   = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState("");

  async function handleFile(file) {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setError("");
    try {
      const data = await uploadImage(file);
      onUploaded(data.image_url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 block mb-1">
        Product Image
      </label>

      <div
        onClick={() => inputRef.current.click()}
        className="border-2 border-dashed border-gray-200 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors overflow-hidden relative"
      >
        {preview
          ? <img src={preview} className="w-full h-full object-cover" alt="preview" />
          : (
            <div className="text-center text-gray-400 text-sm">
              <div className="text-3xl mb-1">📷</div>
              Click to upload
            </div>
          )
        }
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-sm font-semibold text-green-700">
            Uploading…
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}