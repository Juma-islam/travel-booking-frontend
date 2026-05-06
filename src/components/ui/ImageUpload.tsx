"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { uploadApi } from "@/services/api.service";

interface ImageUploadProps {
  value?: string;           // current image URL
  onChange: (url: string) => void;
  type?: "package" | "destination" | "avatar";
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, type = "package", label = "Upload Image", className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      const { url } = await uploadApi.uploadImage(file, type);
      onChange(url);
      setPreview(url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setPreview(value || "");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    setPreview("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs text-slate-400 uppercase tracking-wider">{label}</label>}

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all cursor-pointer ${
          uploading ? "border-brand-500/50 bg-brand-500/5" :
          preview ? "border-slate-700 bg-slate-800/50" :
          "border-slate-700 bg-slate-800/30 hover:border-brand-500/50 hover:bg-brand-500/5"
        }`}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium bg-slate-900/80 px-3 py-1.5 rounded-xl">
                Click to change
              </span>
            </div>
            {!uploading && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clear(); }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-400 text-white rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className={`p-3 rounded-2xl mb-3 ${uploading ? "bg-brand-500/20" : "bg-slate-700/50"}`}>
              {uploading
                ? <Loader size={24} className="text-brand-400 animate-spin" />
                : <Upload size={24} className="text-slate-400" />}
            </div>
            <p className="text-slate-300 text-sm font-medium">
              {uploading ? "Uploading to Cloudinary..." : "Drop image here or click to browse"}
            </p>
            <p className="text-slate-500 text-xs mt-1">JPG, PNG, WebP · Max 5MB</p>
          </div>
        )}

        {/* Upload progress overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
            <div className="text-center">
              <Loader size={28} className="text-brand-400 animate-spin mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
            <AlertCircle size={13} /> {error}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
            <CheckCircle size={13} /> Image uploaded successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Multiple Image Upload ────────────────────────────────────────────────────
interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  max?: number;
}

export function MultiImageUpload({ values, onChange, label = "Upload Images", max = 5 }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const fileArr = Array.from(files).slice(0, max - values.length);
    if (fileArr.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const { images } = await uploadApi.uploadMultiple(fileArr);
      onChange([...values, ...images.map((i) => i.url)]);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {label && <label className="block text-xs text-slate-400 uppercase tracking-wider">{label}</label>}

      {/* Existing images */}
      {values.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {values.map((url, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden h-24 bg-slate-800 group">
              <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              <button type="button" onClick={() => remove(i)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={12} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-brand-600 text-white px-1.5 py-0.5 rounded-md">Main</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {values.length < max && (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-brand-500/50 transition-all text-sm disabled:opacity-50">
          {uploading ? <><Loader size={16} className="animate-spin" /> Uploading...</> : <><Upload size={16} /> Add Images ({values.length}/{max})</>}
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" multiple onChange={(e) => e.target.files && handleFiles(e.target.files)} className="hidden" />

      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} />{error}</p>
      )}
    </div>
  );
}
