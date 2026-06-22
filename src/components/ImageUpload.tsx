/**
 * ============================================================
 * IMAGE UPLOAD — Logo, Avatar, Thumbnail (Base64 Persistent)
 * ============================================================
 * File picker with instant preview. Converts images to base64
 * so they survive page refreshes via localStorage.
 * ============================================================
 */

import { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  label: string;
  currentImage?: string | null;
  onImageSelect: (base64Url: string | null) => void;
  shape?: "circle" | "square" | "rounded";
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = { sm: "w-16 h-16", md: "w-24 h-24", lg: "w-32 h-32" };
const MAX_SIZE_MB = 2;

export function ImageUpload({ label, currentImage, onImageSelect, shape = "rounded", size = "md" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);
  const [error, setError] = useState<string | null>(null);

  const shapeClass = shape === "circle" ? "rounded-full" : shape === "square" ? "rounded-lg" : "rounded-xl";

  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setPreview(base64);
      onImageSelect(base64);
    } catch {
      setError("Failed to process image");
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onImageSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {label && <label className="text-xs text-white/40 mb-2 block">{label}</label>}
      <div className="flex items-center gap-3">
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className={`${SIZE_MAP[size]} ${shapeClass} object-cover border border-white/10`} />
            <button onClick={handleRemove} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className={`${SIZE_MAP[size]} ${shapeClass} border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-1 hover:border-[#C6FF34]/30 transition-all bg-white/[0.02]`}
          >
            <Upload className="w-4 h-4 text-white/20" />
            <span className="text-[9px] text-white/20">Upload</span>
          </button>
        )}
        <div>
          <button onClick={() => inputRef.current?.click()} className="text-xs text-[#C6FF34] hover:underline flex items-center gap-1">
            <ImageIcon className="w-3 h-3" /> {preview ? "Change" : "Choose image"}
          </button>
          <p className="text-[10px] text-white/20 mt-1">PNG, JPG up to {MAX_SIZE_MB}MB</p>
          {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleFile} className="hidden" />
    </div>
  );
}
