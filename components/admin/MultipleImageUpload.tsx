'use client';

import { useState, useEffect } from 'react';

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
  // Parse defaultValues safely
  const parsedDefaults = Array.isArray(defaultValues) ? defaultValues : [];
  const [images, setImages] = useState<string[]>(parsedDefaults);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update images when defaultValues change
  useEffect(() => {
    if (Array.isArray(defaultValues)) {
      setImages(defaultValues);
    }
  }, [defaultValues]);

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
    <div className="w-full">
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
          onClick={() => {
            const el = document.getElementById(`file-input-${name}`) as HTMLInputElement;
            if (el) el.click();
          }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-hadona-primary hover:bg-hadona-primary/5 transition-all"
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hadona-primary mb-2"></div>
              <p className="text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
              <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-600">Klik untuk upload gambar</p>
              <p className="text-xs text-gray-500">Bisa pilih banyak file sekaligus</p>
            </>
          )}
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={url}
                  alt={`${label} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100 transform hover:scale-110"
                  title="Hapus gambar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs font-medium">
                      #{index + 1}
                    </span>
                    <span className="text-white/70 text-xs">
                      {images.length} {images.length === 1 ? 'gambar' : 'gambar'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && !uploading && (
          <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-sm text-gray-500">Belum ada gambar yang diupload</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
