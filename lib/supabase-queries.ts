import { supabaseAdmin } from './supabase-admin';
import type { CaseStudy, Category, AdminUser, CaseStudyFilters } from './types';

// Get all published case studies with filters
export async function getPublishedCaseStudies(filters: CaseStudyFilters = {}) {
  let query = supabaseAdmin
    .from('case_studies')
    .select('*, categories(*)')
    .eq('is_published', true);

  if (filters.category) {
    query = query.eq('categories.slug', filters.category);
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,client_name.ilike.%${filters.search}%,results.ilike.%${filters.search}%`);
  }

  const { data, error } = await query
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as CaseStudy[];
}

// Get case study by slug
export async function getCaseStudyBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('case_studies')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) throw error;
  return data as CaseStudy;
}

// Get related case studies (same category, excluding current)
export async function getRelatedCaseStudies(categoryId: string, excludeId: string, limit: number = 4) {
  const { data, error } = await supabaseAdmin
    .from('case_studies')
    .select('*, categories(*)')
    .eq('category_id', categoryId)
    .eq('is_published', true)
    .neq('id', excludeId)
    .order('display_order', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data as CaseStudy[];
}

// Get all active categories
export async function getActiveCategories() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as Category[];
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data as Category;
}

// ADMIN: Get all case studies (including drafts)
export async function adminGetAllCaseStudies() {
  const { data, error } = await supabaseAdmin
    .from('case_studies')
    .select('*, category:categories(*)')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as CaseStudy[];
}

// ADMIN: Get case study by ID
export async function adminGetCaseStudyById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('case_studies')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as CaseStudy;
}

// ADMIN: Get all categories
export async function adminGetAllCategories() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as Category[];
}

// ADMIN: Get category by ID
export async function adminGetCategoryById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Category;
}

// ADMIN: Verify admin user
export async function adminVerifyUser(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('id', userId)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data as AdminUser;
}

// ADMIN: Get dashboard statistics
export async function adminGetStatistics() {
  const [caseStudiesResult, categoriesResult] = await Promise.all([
    supabaseAdmin.from('case_studies').select('id, is_published'),
    supabaseAdmin.from('categories').select('id', { count: 'exact', head: true }),
  ]);

  const caseStudies = caseStudiesResult.data || [];
  const totalCategories = categoriesResult.count || 0;

  return {
    totalCaseStudies: caseStudies.length,
    publishedCaseStudies: caseStudies.filter((cs: any) => cs.is_published).length,
    draftCaseStudies: caseStudies.filter((cs: any) => !cs.is_published).length,
    totalCategories,
  };
}
