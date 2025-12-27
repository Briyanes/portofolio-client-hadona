'use server';

import { redirect } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function updateCaseStudy(id: string, formData: FormData) {
  const supabase = await createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/case-studies/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Failed to update case study' };
    }

    revalidatePath('/admin/dashboard/case-studies');
    revalidatePath('/studi-kasus/[slug]');
    redirect('/admin/dashboard/case-studies');
  } catch (error: any) {
    return { error: error.message || 'Something went wrong' };
  }
}
