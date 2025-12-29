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

// AGENCY: Get featured client logos
export async function getFeaturedClientLogos(limit: number = 12) {
  const { data, error } = await supabaseAdmin
    .from('case_studies')
    .select('client_name, client_logo_url')
    .eq('is_published', true)
    .not('client_logo_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// AGENCY: Get featured testimonials
export async function getFeaturedTestimonials(limit: number = 6) {
  const { data, error } = await supabaseAdmin
    .from('case_studies')
    .select('id, slug, testimonial, testimonial_author, testimonial_position, client_name, client_logo_url, thumbnail_url')
    .eq('is_published', true)
    .not('testimonial', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// AGENCY: Get aggregate metrics
export async function getAgencyMetrics() {
  const { count: totalCaseStudies } = await supabaseAdmin
    .from('case_studies')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  const { data: caseStudies } = await supabaseAdmin
    .from('case_studies')
    .select('client_name, metrics')
    .eq('is_published', true);

  const uniqueClients = new Set(caseStudies?.map((cs: any) => cs.client_name)).size;

  // Calculate average ROAS from metrics JSONB
  let totalROAS = 0;
  let roasCount = 0;

  caseStudies?.forEach((cs: any) => {
    if (cs.metrics) {
      const roas = Object.entries(cs.metrics).find(([key, value]: [string, unknown]) => {
        if (typeof value !== 'string') return false;
        return key.toLowerCase().includes('roas') || key.toLowerCase().includes('roi');
      });
      if (roas) {
        const numericValue = parseFloat(String(roas[1]).replace(/[^\d.]/g, ''));
        if (!isNaN(numericValue)) {
          totalROAS += numericValue;
          roasCount++;
        }
      }
    }
  });

  const avgROAS = roasCount > 0 ? (totalROAS / roasCount).toFixed(1) + 'x' : 'N/A';

  return {
    totalCaseStudies: totalCaseStudies || 0,
    totalClients: uniqueClients,
    avgROAS,
    yearsExperience: new Date().getFullYear() - 2020,
  };
}
