'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { TestimonialFormData } from '@/lib/types';

interface TestimonialFormProps {
  initialData?: Partial<TestimonialFormData>;
  onSubmit: (data: FormData) => Promise<void | { error?: string }>;
  isSubmitting?: boolean;
}

export function TestimonialForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: TestimonialFormProps) {
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

        router.push('/admin/testimonials');
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Testimoni</h2>
        <div className="space-y-4">
          <Input
            name="client_name"
            label="Nama Klien"
            defaultValue={initialData?.client_name || ''}
            required
            placeholder="PT Fashion Indonesia"
          />

          <Textarea
            name="testimonial"
            label="Testimoni"
            defaultValue={initialData?.testimonial || ''}
            required
            placeholder="Hadona Digital Media membantu kami..."
            rows={4}
          />

          <Input
            name="position"
            label="Jabatan"
            defaultValue={initialData?.position || ''}
            placeholder="Marketing Director"
          />

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
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={initialData?.is_published ?? true}
                  className="w-4 h-4 text-hadona-primary border-gray-300 rounded focus:ring-hadona-primary"
                />
                <span className="text-sm font-medium text-gray-700">Published</span>
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
          loading={isPending}
        >
          {isPending ? 'Menyimpan...' : 'Simpan Testimoni'}
        </Button>
      </div>
    </form>
  );
}
