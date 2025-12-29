import { z } from 'zod';

// Helper untuk optional string yang bisa berupa string, empty string, atau undefined/null
const optionalField = () =>
  z.string().optional();

// Helper untuk field yang bisa string kosong atau undefined
const optionalString = () => z.string().optional().transform(val => val === '' ? undefined : val);

// Case Study Validator
export const caseStudySchema = z.object({
  title: z.string().min(10, 'Judul minimal 10 karakter').max(200, 'Judul maksimal 200 karakter'),
  slug: optionalString(),
  client_name: z.string().min(2, 'Nama klien minimal 2 karakter').max(100, 'Nama klien maksimal 100 karakter'),
  category_id: optionalString(),
  challenge: optionalString(),
  strategy: optionalString(),
  results: optionalString(),
  testimonial: optionalString(),
  testimonial_author: optionalString(),
  testimonial_position: optionalString(),
  thumbnail_url: optionalString(),
  client_logo_url: optionalString(),
  hero_image_url: optionalString(),
  gallery_urls: z.array(z.string()).optional(),
  metrics: z.record(z.string()).optional(),
  meta_title: optionalString(),
  meta_description: optionalString(),
  meta_keywords: z.array(z.string()).optional(),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
  display_order: z.number().int().min(0, 'Display order tidak boleh negatif').default(0),
  // Quick Info fields
  website_url: optionalString(),
  instagram_url: optionalString(),
  facebook_url: optionalString(),
  services: optionalString(),
});

export const caseStudyUpdateSchema = caseStudySchema.partial();

// Category Validator
export const categorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter').max(50, 'Nama kategori maksimal 50 karakter'),
  slug: optionalField(),
  description: optionalField(),
  icon: optionalField(),
  color: optionalField(),
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
