'use server';

import { getAdminUserForAction } from '@/lib/admin-auth';
import { revalidatePath } from 'next/cache';

export async function updateCaseStudy(id: string, formData: FormData) {
  const auth = await getAdminUserForAction();

  if (!auth) {
    return { error: 'Unauthorized' };
  }

  const { accessToken } = auth;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/case-studies/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Failed to update case study' };
    }

    // Revalidate paths
    revalidatePath('/admin/case-studies');
    revalidatePath(`/admin/case-studies/${id}`);

    return { success: true };
  } catch (error: any) {
    console.error('Update error:', error);
    return { error: error.message || 'Something went wrong' };
  }
}
