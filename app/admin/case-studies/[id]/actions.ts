'use server';

import { getAdminUserForAction } from '@/lib/admin-auth';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { parseCaseStudyFormData } from '@/lib/parse-case-study-form';

export async function updateCaseStudy(id: string, formData: FormData) {
  const auth = await getAdminUserForAction();

  if (!auth) {
    return { error: 'Unauthorized' };
  }

  try {
    // Parse and validate FormData
    const validatedData = parseCaseStudyFormData(formData);

    // Check if slug is unique (exclude current record)
    if (validatedData.slug) {
      const { data: existing } = await supabaseAdmin
        .from('case_studies')
        .select('id')
        .eq('slug', validatedData.slug)
        .neq('id', id)
        .single();

      if (existing) {
        return { error: 'Slug already exists' };
      }
    }

    // Update case study
    const { data: updatedCaseStudy, error } = await supabaseAdmin
      .from('case_studies')
      .update({
        ...validatedData,
        updated_by: auth.user.id,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Revalidate paths
    revalidatePath('/admin/case-studies');
    revalidatePath(`/admin/case-studies/${id}`);

    // Get the case study slug to revalidate public page
    const { data: caseStudyData } = await supabaseAdmin
      .from('case_studies')
      .select('slug')
      .eq('id', id)
      .single();

    if (caseStudyData?.slug) {
      revalidatePath(`/studi-kasus/${caseStudyData.slug}`);
    }

    // Revalidate homepage
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    console.error('Update error:', error);
    if (error.name === 'ZodError') {
      return { error: 'Validation error', details: error.errors };
    }
    return { error: error.message || 'Something went wrong' };
  }
}
