import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

export const ImageUploader = ({ onFileSelect, selectedFile, onRemoveFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    setError(null);
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid JPEG, PNG, or WebP crop photo.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    onFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
    onRemoveFile();
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
        Crop Photo / Symptom Image (Optional)
      </label>

      {selectedFile && previewUrl ? (
        <div className="relative rounded-2xl border border-gray-200 p-3 bg-gray-50 flex items-center gap-4">
          <img
            src={previewUrl}
            alt="Crop symptom preview"
            className="w-20 h-20 object-cover rounded-xl border border-gray-300 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">
              {selectedFile.name}
            </p>
            <p className="text-[11px] text-gray-500">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
            </p>
            <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
              Ready for AI visual analysis
            </span>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-agro-500 bg-agro-50/50'
              : 'border-gray-300 hover:border-agro-400 bg-gray-50/40 hover:bg-gray-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-agro-600 mx-auto mb-2 shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-gray-800">
            Click to upload or drag & drop clear plant photo
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            JPEG, PNG, or WebP up to 5MB (Leaves, stem, roots, or spots)
          </p>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};

