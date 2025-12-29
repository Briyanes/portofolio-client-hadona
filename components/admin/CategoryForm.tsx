'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { CategoryFormData } from '@/lib/types';

interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: FormData) => Promise<void | { error?: string }>;
  isSubmitting?: boolean;
}

const BOOTSTRAP_ICONS = [
  { value: 'bi-graph-up', label: 'Graph Up (Growth)' },
  { value: 'bi-megaphone', label: 'Megaphone (Marketing)' },
  { value: 'bi-people', label: 'People (Training)' },
  { value: 'bi-lightbulb', label: 'Lightbulb (Ideas)' },
  { value: 'bi-bar-chart', label: 'Bar Chart (Analytics)' },
  { value: 'bi-camera', label: 'Camera (Creative)' },
  { value: 'bi-phone', label: 'Phone (Mobile)' },
  { value: 'bi-globe', label: 'Globe (Digital)' },
  { value: 'bi-shop', label: 'Shop (E-commerce)' },
  { value: 'bi-bullseye', label: 'Bullseye (Targeting)' },
  { value: 'bi-rocket', label: 'Rocket (Launch)' },
  { value: 'bi-stars', label: 'Stars (Premium)' },
];

export function CategoryForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: CategoryFormProps) {
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!initialData?.slug) {
      setSlug(generateSlug(name));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await onSubmit(formData);

        // Check if there's an error
        if (result && 'error' in result && result.error) {
          alert(`Error: ${result.error}`);
          return;
        }

        // Success - redirect to list
        router.push('/admin/categories');
        router.refresh();
      } catch (error: any) {
        console.error('Submit error:', error);
        alert(`Error: ${error?.message || 'Terjadi kesalahan saat menyimpan data'}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Kategori</h2>
        <div className="space-y-4">
          <Input
            name="name"
            label="Nama Kategori"
            defaultValue={initialData?.name}
            onChange={handleNameChange}
            required
            placeholder="Contoh: Digital Advertising"
          />

          <div>
            <Input
              name="slug"
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="digital-advertising"
            />
          </div>

          <Textarea
            name="description"
            label="Deskripsi"
            defaultValue={initialData?.description}
            rows={3}
            placeholder="Deskripsi singkat tentang kategori ini..."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <select
              name="icon"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hadona-primary focus:border-hadona-primary"
              defaultValue={initialData?.icon || 'bi-graph-up'}
            >
              {BOOTSTRAP_ICONS.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warna Badge
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="color"
                defaultValue={initialData?.color || '#2B46BB'}
                className="h-10 w-20 rounded border border-gray-300"
              />
              <Input
                type="text"
                defaultValue={initialData?.color || '#2B46BB'}
                placeholder="#2B46BB"
                className="flex-1"
              />
            </div>
          </div>

          <Input
            name="display_order"
            label="Urutan Tampilan"
            type="number"
            defaultValue={initialData?.display_order || 0}
            placeholder="0"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={initialData?.is_active !== false}
              className="w-4 h-4 text-hadona-primary border-gray-300 rounded focus:ring-hadona-primary"
            />
            <span className="text-sm font-medium text-gray-700">Aktif</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={() => window.location.href = '/admin/categories'}
          disabled={isPending}
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isPending || isSubmitting}
        >
          {(isPending || isSubmitting) ? 'Menyimpan...' : initialData?.name ? 'Update' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}