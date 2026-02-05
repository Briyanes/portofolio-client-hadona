'use client';

import { useTransition, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { VideoEmbedFormData } from '@/lib/types';

interface VideoEmbedFormProps {
  initialData?: Partial<VideoEmbedFormData>;
  onSubmit: (data: FormData) => Promise<void | { error?: string }>;
  isSubmitting?: boolean;
}

// Helper function to convert video URL to embed URL
function getEmbedUrl(url: string, platform: string): string {
  if (!url) return '';
  
  if (platform === 'instagram') {
    // Instagram: add /embed/ if not present
    if (url.includes('/embed/')) return url;
    return url.replace(/\/?$/, '/embed/');
  }
  
  if (platform === 'tiktok') {
    // TikTok: extract video ID and create embed URL
    const match = url.match(/video\/(\d+)/);
    if (match) {
      return `https://www.tiktok.com/embed/v2/${match[1]}`;
    }
    return url;
  }
  
  if (platform === 'youtube') {
    // YouTube: convert watch URL to embed URL
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  }
  
  return url;
}

// Helper to get platform icon
function getPlatformIcon(platform: string): string {
  switch (platform) {
    case 'instagram': return 'bi-instagram';
    case 'tiktok': return 'bi-tiktok';
    case 'youtube': return 'bi-youtube';
    default: return 'bi-play-circle';
  }
}

export function VideoEmbedForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: VideoEmbedFormProps) {
  const [isPending, startTransition] = useTransition();
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || '');
  const [isFetchingThumbnail, setIsFetchingThumbnail] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // Auto-fetch thumbnail from video URL
  const handleFetchThumbnail = async () => {
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    const videoUrl = formData.get('video_url') as string;
    const platform = formData.get('platform') as string;

    if (!videoUrl) {
      alert('Masukkan URL video terlebih dahulu');
      return;
    }

    setIsFetchingThumbnail(true);
    try {
      const response = await fetch('/api/fetch-video-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: videoUrl, platform }),
      });

      const data = await response.json();
      
      if (data.success && data.thumbnail_url) {
        setThumbnailUrl(data.thumbnail_url);
        alert('Thumbnail berhasil diambil!');
      } else {
        alert('Tidak dapat mengambil thumbnail otomatis. Silakan upload manual.');
      }
    } catch (error) {
      console.error('Error fetching thumbnail:', error);
      alert('Gagal mengambil thumbnail. Silakan upload manual.');
    } finally {
      setIsFetchingThumbnail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // If we have auto-fetched thumbnail, add it to formData
    if (thumbnailUrl && !formData.get('thumbnail_url')) {
      formData.set('thumbnail_url', thumbnailUrl);
    }

    startTransition(async () => {
      try {
        const result = await onSubmit(formData);

        if (result && 'error' in result && result.error) {
          alert(`Error: ${result.error}`);
          return;
        }

        router.push('/admin/video-embeds');
        router.refresh();
      } catch (error: any) {
        console.error('Submit error:', error);
        alert(`Error: ${error?.message || 'Terjadi kesalahan saat menyimpan data'}`);
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Video</h2>
        <div className="space-y-4">
          <Input
            name="title"
            label="Judul Video"
            defaultValue={initialData?.title || ''}
            required
            placeholder="Nama kampanye atau deskripsi singkat"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="video_url"
              label="URL Video"
              defaultValue={initialData?.video_url || ''}
              required
              placeholder="https://www.instagram.com/reel/... atau https://www.tiktok.com/..."
            />

            <Select
              name="platform"
              label="Platform"
              defaultValue={initialData?.platform || 'instagram'}
              required
              options={[
                { value: 'instagram', label: 'Instagram Reels' },
                { value: 'tiktok', label: 'TikTok' },
                { value: 'youtube', label: 'YouTube' },
              ]}
            />
          </div>

          <Input
            name="client_name"
            label="Nama Klien (Opsional)"
            defaultValue={initialData?.client_name || ''}
            placeholder="PT Fashion Indonesia"
          />

          <Textarea
            name="description"
            label="Deskripsi (Opsional)"
            defaultValue={initialData?.description || ''}
            placeholder="Deskripsi singkat tentang video ini..."
            rows={3}
          />

          {/* Thumbnail Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Video
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Klik tombol "Ambil Otomatis" untuk mengambil thumbnail dari video, atau upload manual.
              </p>
              
              {/* Auto-fetch button */}
              <button
                type="button"
                onClick={handleFetchThumbnail}
                disabled={isFetchingThumbnail}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {isFetchingThumbnail ? (
                  <>
                    <i className="bi bi-arrow-repeat animate-spin"></i>
                    Mengambil Thumbnail...
                  </>
                ) : (
                  <>
                    <i className="bi bi-magic"></i>
                    Ambil Thumbnail Otomatis
                  </>
                )}
              </button>

              {/* Auto-fetched thumbnail preview */}
              {thumbnailUrl && (
                <div className="mb-4">
                  <p className="text-xs text-green-600 font-medium mb-2 flex items-center gap-1">
                    <i className="bi bi-check-circle"></i>
                    Thumbnail berhasil diambil:
                  </p>
                  <div className="relative w-32 aspect-[9/16] rounded-lg overflow-hidden border-2 border-green-500 shadow-md">
                    <img
                      src={thumbnailUrl}
                      alt="Auto-fetched thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setThumbnailUrl('')}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                  <input type="hidden" name="thumbnail_url" value={thumbnailUrl} />
                </div>
              )}

              {/* Manual upload option */}
              {!thumbnailUrl && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    Atau upload manual (disarankan ukuran 9:16 portrait):
                  </p>
                  <ImageUpload
                    name="thumbnail_url"
                    currentImage={initialData?.thumbnail_url || ''}
                    folder="video-thumbnails"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                name="display_order"
                label="Urutan Tampilan"
                type="number"
                defaultValue={initialData?.display_order ?? 0}
                placeholder="0"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  defaultChecked={initialData?.is_featured || false}
                  className="w-4 h-4 text-hadona-primary border-gray-300 rounded focus:ring-hadona-primary"
                />
                <span className="text-sm font-medium text-gray-700">Featured di Homepage</span>
              </label>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={initialData?.is_active ?? true}
                  className="w-4 h-4 text-hadona-primary border-gray-300 rounded focus:ring-hadona-primary"
                />
                <span className="text-sm font-medium text-gray-700">Aktif</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {initialData?.video_url && initialData?.platform && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className={`bi ${getPlatformIcon(initialData.platform)}`}></i>
            Preview Video
          </h2>
          <div className="flex flex-col items-center gap-4">
            {/* Info tentang embed */}
            <div className="w-full max-w-md p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 flex items-start gap-2">
                <i className="bi bi-info-circle mt-0.5"></i>
                <span>
                  {initialData.platform === 'instagram' 
                    ? 'Instagram membatasi preview embed. Video akan tampil dengan benar di homepage.'
                    : initialData.platform === 'tiktok'
                    ? 'TikTok embed memerlukan script khusus. Video akan tampil dengan benar di homepage.'
                    : 'Preview mungkin tidak tersedia untuk beberapa video.'}
                </span>
              </p>
            </div>
            
            {/* Link langsung ke video */}
            <a
              href={initialData.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              <i className={`bi ${getPlatformIcon(initialData.platform)} text-lg`}></i>
              Lihat Video di {initialData.platform.charAt(0).toUpperCase() + initialData.platform.slice(1)}
              <i className="bi bi-box-arrow-up-right"></i>
            </a>

            {/* Preview iframe untuk YouTube (biasanya work) */}
            {initialData.platform === 'youtube' && (
              <div className="w-full max-w-[560px] aspect-video bg-gray-100 rounded-xl overflow-hidden">
                <iframe
                  src={getEmbedUrl(initialData.video_url, initialData.platform)}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isPending || isSubmitting}
          isLoading={isPending}
        >
          {isPending ? 'Menyimpan...' : 'Simpan Video'}
        </Button>
      </div>
    </form>
  );
}
