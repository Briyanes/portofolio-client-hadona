import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createSupabaseAdminClient } from '@/lib/admin-auth';
import { revalidatePath } from 'next/cache';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user from session cookie
    const supabase = await createSupabaseAdminClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: adminUser } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete case study
    const { error } = await supabaseAdmin
      .from('case_studies')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    // Revalidate the case studies page
    revalidatePath('/admin/case-studies');
    revalidatePath('/admin/case-studies/[id]');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting case study:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete case study' },
      { status: 500 }
    );
  }
}
