import { z } from 'zod';

// Case Study Validator
export const caseStudySchema = z.object({
  title: z.string().min(10, 'Judul minimal 10 karakter').max(200, 'Judul maksimal 200 karakter'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung').optional(),
  client_name: z.string().min(2, 'Nama klien minimal 2 karakter').max(100, 'Nama klien maksimal 100 karakter'),
  category_id: z.string().uuid('ID kategori tidak valid'),
  challenge: z.string().max(5000, 'Challenge maksimal 5000 karakter').optional(),
  strategy: z.string().max(5000, 'Strategy maksimal 5000 karakter').optional(),
  results: z.string().max(5000, 'Results maksimal 5000 karakter').optional(),
  testimonial: z.string().max(1000, 'Testimonial maksimal 1000 karakter').optional(),
  testimonial_author: z.string().max(100, 'Nama penulis testimonial maksimal 100 karakter').optional(),
  testimonial_position: z.string().max(100, 'Posisi penulis testimonial maksimal 100 karakter').optional(),
  thumbnail_url: z.string().url('URL thumbnail tidak valid'),
  client_logo_url: z.string().url('URL logo klien tidak valid').optional(),
  hero_image_url: z.string().url('URL hero image tidak valid').optional(),
  gallery_urls: z.array(z.string().url('URL gambar tidak valid')).max(10, 'Maksimal 10 gambar di gallery').optional(),
  metrics: z.record(z.string()).optional(),
  meta_title: z.string().max(60, 'Meta title maksimal 60 karakter').optional(),
  meta_description: z.string().max(160, 'Meta description maksimal 160 karakter').optional(),
  meta_keywords: z.array(z.string()).optional(),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  display_order: z.number().int().min(0, 'Display order tidak boleh negatif'),
  // Quick Info fields
  website_url: z.string().nullable().optional(),
  instagram_url: z.string().nullable().optional(),
  facebook_url: z.string().nullable().optional(),
  services: z.string().min(2, 'Layanan minimal 2 karakter'),
});

export const caseStudyUpdateSchema = caseStudySchema.partial();

// Category Validator
export const categorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter').max(50, 'Nama kategori maksimal 50 karakter'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung').optional(),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
  icon: z.string().max(50, 'Icon maksimal 50 karakter').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color harus dalam format hex (contoh: #FF0000)').optional(),
  display_order: z.number().int().min(0, 'Display order tidak boleh negatif'),
  is_active: z.boolean(),
});

export const categoryUpdateSchema = categorySchema.partial();

// Login Validator
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

// File Upload Validator
export const uploadSchema = z.object({
  folder: z.enum(['thumbnails', 'heroes', 'gallery', 'client-logos']),
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Ukuran file maksimal 5MB')
    .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Format file harus JPEG, PNG, atau WebP'),
});

// Query Validators
export const caseStudyQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  per_page: z.coerce.number().int().positive().max(50).optional(),
});

export type CaseStudyInput = z.infer<typeof caseStudySchema>;
export type CaseStudyUpdateInput = z.infer<typeof caseStudyUpdateSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UploadInput = z.infer<typeof uploadSchema>;
export type CaseStudyQueryInput = z.infer<typeof caseStudyQuerySchema>;
