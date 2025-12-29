// Database Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  client_logo_url: string | null;
  category_id: string | null;
  categories?: Category;
  challenge: string | null;
  strategy: string | null;
  results: string | null;
  testimonial: string | null;
  testimonial_author: string | null;
  testimonial_position: string | null;
  thumbnail_url: string;
  hero_image_url: string | null;
  gallery_urls: string[] | null;
  metrics: Record<string, string> | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  // Quick Info Section fields
  website_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  services: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  testimonial: string;
  position: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  case_study_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientLogo {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Form Types
export interface CaseStudyFormData {
  title: string;
  slug?: string;
  client_name: string;
  category_id: string;
  challenge: string;
  strategy: string;
  results: string;
  testimonial?: string;
  testimonial_author?: string;
  testimonial_position?: string;
  thumbnail_url: string;
  client_logo_url?: string;
  hero_image_url?: string;
  gallery_urls?: string[];
  metrics?: Array<{ label: string; value: string }>;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  // Quick Info Section fields
  website_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  services?: string;
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  color?: string;
  display_order: number;
  is_active: boolean;
}

export interface TestimonialFormData {
  client_name: string;
  testimonial: string;
  position?: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  case_study_id?: string;
}

export interface ClientLogoFormData {
  name: string;
  logo_url: string;
  website_url?: string;
  is_active: boolean;
  display_order: number;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CaseStudyListResponse {
  case_studies: CaseStudy[];
  total: number;
  page: number;
  per_page: number;
}

// Filter Types
export interface CaseStudyFilters {
  category?: string;
  search?: string;
  is_published?: boolean;
  is_featured?: boolean;
}

// Upload Types
export interface UploadOptions {
  folder: 'thumbnails' | 'heroes' | 'gallery' | 'client-logos';
  file: File;
}

export interface UploadResult {
  url: string;
  path: string;
}

export interface ImageUploadProps {
  name: string;
  label: string;
  defaultValue?: string;
  recommendedSize?: string;
  required?: boolean;
}
