'use client';

import { useState, useRef } from 'react';
import type { CaseStudyVideoEmbed } from '@/lib/types';

interface VideoEmbedItemProps {
  video: CaseStudyVideoEmbed;
  index: number;
  onUpdate: (index: number, field: keyof CaseStudyVideoEmbed, value: string) => void;
  onRemove: (index: number) => void;
}

export function VideoEmbedItem({ video, index, onUpdate, onRemove }: VideoEmbedItemProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Hanya file JPEG, PNG, dan WebP yang diperbolehkan');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'video-thumbnails');

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
      onUpdate(index, 'thumbnail_url', data.url);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengupload gambar';
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const removeThumbnail = () => {
    onUpdate(index, 'thumbnail_url', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-start gap-4">
        {/* Thumbnail Upload */}
        <div className="flex-shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleThumbnailUpload}
            className="hidden"
          />
          {video.thumbnail_url ? (
            <div className="relative w-20 h-32 rounded-lg overflow-hidden border-2 border-green-500">
              <img
                src={video.thumbnail_url}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-20 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-hadona-primary hover:bg-purple-50 transition-colors"
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <i className="bi bi-image text-gray-400 text-lg"></i>
                  <span className="text-xs text-gray-500">Thumbnail</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Video Info Fields */}
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Video</label>
              <input
                type="text"
                value={video.url}
                onChange={(e) => onUpdate(index, 'url', e.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hadona-primary/20 focus:border-hadona-primary text-sm"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
              <select
                value={video.platform}
                onChange={(e) => onUpdate(index, 'platform', e.target.value)}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hadona-primary/20 focus:border-hadona-primary text-sm bg-white appearance-none cursor-pointer"
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
              <div className="absolute inset-y-0 right-0 top-6 flex items-center pr-2 pointer-events-none">
                <i className="bi bi-chevron-down text-gray-400 text-sm"></i>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul (Opsional)</label>
            <input
              type="text"
              value={video.title || ''}
              onChange={(e) => onUpdate(index, 'title', e.target.value)}
              placeholder="Deskripsi singkat video"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hadona-primary/20 focus:border-hadona-primary text-sm"
            />
          </div>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="flex-shrink-0 w-9 h-9 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
          title="Hapus video"
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </div>
  );
}
