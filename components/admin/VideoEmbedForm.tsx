'use client';

import { useTransition, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
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
    if (url.includes('/embed/')) return url;
    return url.replace(/\/?$/, '/embed/');
  }
  
  if (platform === 'tiktok') {
    const match = url.match(/video\/(\d+)/);
    if (match) {
      return `https://www.tiktok.com/embed/v2/${match[1]}`;
    }
    return url;
  }
  
  if (platform === 'youtube') {
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
  const [platform, setPlatform] = useState(initialData?.platform || 'instagram');
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await onSubmit(formData);

        if (result && 'error' in result && result.error) {
          alert(`Error: ${result.error}`);
          return;
        }

        router.push('/admin/video-embeds');
        router.refresh();
      } catch (error: unknown) {
        console.error('Submit error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data';
        alert(`Error: ${errorMessage}`);
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
              type="url"
              defaultValue={initialData?.video_url || ''}
              required
              placeholder="https://www.instagram.com/reel/... atau https://www.tiktok.com/..."
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform <span className="text-red-500">*</span>
              </label>
              <select
                name="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as 'instagram' | 'tiktok' | 'youtube')}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hadona-primary focus:border-transparent"
              >
                <option value="instagram">Instagram Reels</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
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

          {/* Thumbnail Upload */}
          <div>
            <ImageUpload
              name="thumbnail_url"
              label="Thumbnail Video"
              defaultValue={initialData?.thumbnail_url || ''}
            />
            <p className="mt-2 text-xs text-gray-500">
              💡 Tips: Screenshot frame terbaik dari video (ukuran portrait 9:16 recommended)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              name="display_order"
              label="Urutan Tampilan"
              type="number"
              defaultValue={initialData?.display_order ?? 0}
              placeholder="0"
            />

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

            {/* Preview iframe untuk YouTube */}
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
