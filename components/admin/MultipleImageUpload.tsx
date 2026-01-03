'use client';

import { useState } from 'react';

interface MultipleImageUploadProps {
  name: string;
  label: string;
  defaultValues?: string[];
  recommendedSize?: string;
}

export function MultipleImageUpload({
  name,
  label,
  defaultValues = [],
  recommendedSize,
}: MultipleImageUploadProps) {
  const [images, setImages] = useState<string[]>(defaultValues);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        setError('Hanya file JPEG, PNG, dan WebP yang diperbolehkan');
        return;
      }
      if (file.size > maxSize) {
        setError('Ukuran file maksimal 5MB per file');
        return;
      }
    }

    setError(null);
    setUploading(true);

    try {
      // Upload all files
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'gallery');

        const response = await fetch('/api/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Add new images to existing list
      setImages([...images, ...uploadedUrls]);
      setUploading(false);

      // Clear input
      e.target.value = '';
    } catch (err: any) {
      setError(err.message || 'Gagal mengupload gambar');
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {recommendedSize && (
        <p className="text-xs text-gray-500 mb-2">Recommended: {recommendedSize}</p>
      )}

      {/* Hidden inputs to store all URLs */}
      {images.map((url, index) => (
        <input
          key={index}
          type="hidden"
          name={`${name}_${index}`}
          value={url}
        />
      ))}
      {/* Store the count and JSON array */}
      <input
        type="hidden"
        name={`${name}_count`}
        value={images.length}
      />
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(images)}
      />

      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        id={`file-input-${name}`}
      />

      <div className="space-y-3">
        {/* Upload Button */}
        <div
          onClick={() => document.getElementById(`file-input-${name}`)?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-hadona-primary transition-colors"
        >
          {uploading ? (
            <p className="text-gray-600">Uploading...</p>
          ) : (
            <>
              <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-1 text-sm text-gray-600">Klik untuk upload gambar</p>
              <p className="text-xs text-gray-500">Bisa pilih banyak file sekaligus</p>
            </>
          )}
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`${label} ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <p className="text-sm text-gray-500 text-center">Belum ada gambar yang diupload</p>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
