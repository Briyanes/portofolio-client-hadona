'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { ClientLogoFormData } from '@/lib/types';

interface ClientLogoFormProps {
  initialData?: Partial<ClientLogoFormData>;
  onSubmit: (data: FormData) => Promise<void | { error?: string }>;
  isSubmitting?: boolean;
}

export function ClientLogoForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: ClientLogoFormProps) {
  const [isPending, startTransition] = useTransition();
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

        router.push('/admin/client-logos');
        router.refresh();
      } catch (error: any) {
        console.error('Submit error:', error);
        alert(`Error: ${error?.message || 'Terjadi kesalahan saat menyimpan data'}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Logo Klien</h2>
        <div className="space-y-4">
          <Input
            name="name"
            label="Nama Klien"
            defaultValue={initialData?.name || ''}
            required
            placeholder="PT Fashion Indonesia"
          />

          <ImageUpload
            name="logo"
            label="Logo Klien"
            defaultValue={initialData?.logo_url || ''}
            recommendedSize="200x200px"
            required
          />

          <Input
            name="website_url"
            label="Website URL (Opsional)"
            type="url"
            defaultValue={initialData?.website_url || ''}
            placeholder="https://example.com"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="is_active"
                  defaultChecked={initialData?.is_active ?? true}
                  className="w-4 h-4 text-hadona-primary border-gray-300 rounded focus:ring-hadona-primary"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>
        </div>
      </div>

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
          {isPending ? 'Menyimpan...' : 'Simpan Logo'}
        </Button>
      </div>
    </form>
  );
}
