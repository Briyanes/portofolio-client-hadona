'use client';

import { useState, useRef } from 'react';
import { ImageUploadProps } from '@/lib/types';

export function ImageUpload({
  name,
  label,
  defaultValue,
  recommendedSize,
  required = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Hanya file JPEG, PNG, dan WebP yang diperbolehkan');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Upload to server
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', name); // use field name as folder

      // Use relative URL - cookies will be sent automatically
      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include', // Include cookies
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();

      // Set preview with uploaded URL
      setPreview(data.url);
      setIsUploading(false);
    } catch (err: any) {
      setError(err.message || 'Gagal mengupload gambar');
      setIsUploading(false);
      // Reset preview on error
      setPreview(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {recommendedSize && (
        <p className="text-xs text-gray-500 mb-2">Recommended: {recommendedSize}</p>
      )}

      {/* Hidden input to store the URL value */}
      <input
        type="hidden"
        name={`${name}_url`}
        value={preview || ''}
      />

      <input
        ref={fileInputRef}
        type="file"
        name={`${name}_file`}
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={label}
            className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-hadona-primary transition-colors"
        >
          {isUploading ? (
            <p className="text-gray-600">Uploading...</p>
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-1 text-sm text-gray-600">Klik untuk upload gambar</p>
              <p className="text-xs text-gray-500">atau drag & drop</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
