'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ImageUpload } from './ImageUpload';
import { MultipleImageUpload } from './MultipleImageUpload';
import { Category, CaseStudyFormData } from '@/lib/types';

interface CaseStudyFormProps {
  initialData?: Partial<CaseStudyFormData>;
  categories: Category[];
  onSubmit: (data: FormData) => Promise<void | { error?: string }>;
  isSubmitting?: boolean;
}

export function CaseStudyForm({
  initialData,
  categories,
  onSubmit,
  isSubmitting = false,
}: CaseStudyFormProps) {
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [metrics, setMetrics] = useState<Array<{ label: string; value: string }>>(
    initialData?.metrics || []
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!initialData?.slug) {
      setSlug(generateSlug(title));
    }
  };

  const addMetric = () => {
    setMetrics([...metrics, { label: '', value: '' }]);
  };

  const updateMetric = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...metrics];
    updated[index][field] = value;
    setMetrics(updated);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validate required image fields
    const thumbnailUrl = formData.get('thumbnail_url');
    if (!thumbnailUrl || typeof thumbnailUrl !== 'string' || !thumbnailUrl.trim()) {
      alert('Thumbnail wajib diupload');
      return;
    }

    // Add slug (controlled input) to form data
    formData.set('slug', slug);

    // Add metrics as JSON
    const metricsObj = metrics.reduce((acc, m) => {
      if (m.label && m.value) {
        acc[m.label] = m.value;
      }
      return acc;
    }, {} as Record<string, string>);
    formData.append('metrics', JSON.stringify(metricsObj));

    startTransition(async () => {
      try {
        const result = await onSubmit(formData);

        // Check if there's an error
        if (result && 'error' in result && result.error) {
          alert(`Error: ${result.error}`);
          return;
        }

        // Success - redirect to list
        router.push('/admin/case-studies');
        router.refresh();
      } catch (error: any) {
        console.error('Submit error:', error);
        alert(`Error: ${error?.message || 'Something went wrong'}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {/* Section 1: Basic Information */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-hadona-primary/10 flex items-center justify-center text-hadona-primary text-sm font-bold">1</span>
          Informasi Dasar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              name="title"
              label="Judul"
              defaultValue={initialData?.title || ''}
              onChange={handleTitleChange}
              required
              placeholder="Contoh: Meningkatkan ROAS 8x untuk E-commerce Fashion"
            />
          </div>

          <div>
            <Input
              name="slug"
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="meningkatkan-roas-8x-ecommerce-fashion"
            />
          </div>

          <div>
            <Input
              name="client_name"
              label="Nama Klien"
              defaultValue={initialData?.client_name || ''}
              required
              placeholder="PT Fashion Indonesia"
            />
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-hadona-primary/20 focus:border-hadona-primary bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              defaultValue={initialData?.category_id || ''}
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            name="display_order"
            label="Urutan Tampilan"
            type="number"
            defaultValue={initialData?.display_order ?? 0}
            placeholder="0"
          />
        </div>
      </div>

      {/* Section 2: Images */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-hadona-primary/10 flex items-center justify-center text-hadona-primary text-sm font-bold">2</span>
          Gambar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ImageUpload
            name="thumbnail"
            label="Thumbnail"
            defaultValue={initialData?.thumbnail_url || ''}
            recommendedSize="1200x630px"
            required
          />

          <ImageUpload
            name="hero_image"
            label="Hero Image"
            defaultValue={initialData?.hero_image_url || ''}
            recommendedSize="1920x1080px"
          />

          <ImageUpload
            name="client_logo"
            label="Logo Klien"
            defaultValue={initialData?.client_logo_url || ''}
            recommendedSize="500x500px"
          />
        </div>
      </div>

      {/* Section 3: Gallery (Optional) */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-hadona-primary/10 flex items-center justify-center text-hadona-primary text-sm font-bold">3</span>
          Gallery (Opsional)
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload gambar tambahan untuk ditampilkan di gallery case study. Bisa upload lebih dari 1 gambar sekaligus.
          </p>
          <MultipleImageUpload
            name="gallery_urls"
            label="Gambar Gallery"
            defaultValues={initialData?.gallery_urls || []}
            recommendedSize="1920x1080px atau 1080x1080px"
          />
        </div>
      </div>

      {/* Section 4: Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-hadona-primary/10 flex items-center justify-center text-hadona-primary text-sm font-bold">4</span>
          Konten
        </h2>
        <div className="space-y-4">
          <Textarea
            name="challenge"
            label="Challenge"
            defaultValue={initialData?.challenge || ''}
            rows={5}
            placeholder="Jelaskan tantangan yang dihadapi klien..."
          />

          <Textarea
            name="strategy"
            label="Strategy"
            defaultValue={initialData?.strategy || ''}
            rows={5}
            placeholder="Jelaskan strategi yang diterapkan..."
          />

          <Textarea
            name="results"
            label="Results"
            defaultValue={initialData?.results || ''}
            rows={5}
            placeholder="Jelaskan hasil yang dicapai..."
          />

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Testimonial (Opsional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                name="testimonial"
                label="Isi Testimonial"
                defaultValue={initialData?.testimonial || ''}
                rows={3}
                placeholder="Kata klien tentang hasil kerjasama..."
              />

              <div className="space-y-4">
                <Input
                  name="testimonial_author"
                  label="Nama Testimoni"
                  defaultValue={initialData?.testimonial_author || ''}
                  placeholder="Budi Santoso"
                />
                <Input
                  name="testimonial_position"
                  label="Posisi/Jabatan"
                  defaultValue={initialData?.testimonial_position || ''}
                  placeholder="CEO, PT Fashion Indonesia"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Key Metrics */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-hadona-primary/10 flex items-center justify-center text-hadona-primary text-sm font-bold">5</span>
            Key Metrics (Opsional)
          </h2>
          <Button type="button" variant="secondary" onClick={addMetric}>
            + Tambah Metric
          </Button>
        </div>
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
              <Input
                value={metric.label}
                onChange={(e) => updateMetric(index, 'label', e.target.value)}
                placeholder="Label (cth: ROAS)"
              />
              <Input
                value={metric.value}
                onChange={(e) => updateMetric(index, 'value', e.target.value)}
                placeholder="Value (cth: 8-9x)"
              />
              <Button
                type="button"
                variant="danger"
                onClick={() => removeMetric(index)}
              >
                Hapus
              </Button>
            </div>
          ))}
          {metrics.length === 0 && (
            <p className="text-gray-500 text-sm">Belum ada metrics. Klik "Tambah Metric" untuk menambah.</p>
          )}
        </div>
      </div>

      {/* Section 6: Additional Information (Quick Info) */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-hadona-primary/10 flex items-center justify-center text-hadona-primary text-sm font-bold">6</span>
          Informasi Tambahan (Quick Info)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="services"
            label="Layanan"
            defaultValue={initialData?.services || 'Digital Marketing'}
            placeholder="Digital Marketing, Social Media Management, dll"
            required
          />

          <Input
            name="website_url"
            label="Website URL Client"
            type="url"
            defaultValue={initialData?.website_url || ''}
            placeholder="https://example.com"
          />

          <Input
            name="instagram_url"
            label="Instagram URL Client"
            type="url"
            defaultValue={initialData?.instagram_url || ''}
            placeholder="https://instagram.com/username"
          />

          <Input
            name="facebook_url"
            label="Facebook URL Client"
            type="url"
            defaultValue={initialData?.facebook_url || ''}
            placeholder="https://facebook.com/pagename"
          />
        </div>
        <p className="mt-3 text-sm text-gray-500">
          <i className="bi bi-info-circle mr-1"></i>
          Field URL bersifat opsional. Jika diisi, akan ditampilkan di Quick Info Section dengan link clickable.
        </p>
      </div>

      {/* Section 7: SEO */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-hadona-primary/10 flex items-center justify-center text-hadona-primary text-sm font-bold">7</span>
          SEO (Opsional)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <Input
            name="meta_title"
            label="Meta Title"
            defaultValue={initialData?.meta_title || ''}
            placeholder="Maksimal 60 karakter"
            maxLength={60}
          />

          <Textarea
            name="meta_description"
            label="Meta Description"
            defaultValue={initialData?.meta_description || ''}
            rows={2}
            placeholder="Maksimal 160 karakter"
            maxLength={160}
          />

          <Input
            name="meta_keywords"
            label="Meta Keywords"
            defaultValue={initialData?.meta_keywords?.join(', ') || ''}
            placeholder="digital marketing, facebook ads, iklan fashion (pisahkan dengan koma)"
          />
        </div>
      </div>

      {/* Section 8: Publishing */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-hadona-primary/10 flex items-center justify-center text-hadona-primary text-sm font-bold">8</span>
          Publishing
        </h2>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={initialData?.is_featured}
              className="w-4 h-4 text-hadona-primary border-gray-300 rounded focus:ring-hadona-primary"
            />
            <span className="text-sm font-medium text-gray-700">Tampilkan di Homepage (Featured)</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={initialData?.is_published}
              className="w-4 h-4 text-hadona-primary border-gray-300 rounded focus:ring-hadona-primary"
            />
            <span className="text-sm font-medium text-gray-700">Publish (Tampilkan di website publik)</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end bg-white rounded-xl shadow-md p-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => window.location.href = '/admin/case-studies'}
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isPending || isSubmitting}
        >
          {(isPending || isSubmitting) ? 'Menyimpan...' : initialData?.title ? 'Update' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}
