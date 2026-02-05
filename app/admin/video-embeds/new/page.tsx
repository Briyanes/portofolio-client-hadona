import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUserWithToken, getAdminUserForAction } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import { VideoEmbedForm } from '@/components/admin/VideoEmbedForm';

export const dynamic = 'force-dynamic';

export default async function NewVideoEmbedPage() {
  const auth = await getAdminUserWithToken();

  if (!auth) {
    redirect('/admin/login');
  }

  async function createVideoEmbed(formData: FormData) {
    'use server';

    const auth = await getAdminUserForAction();
    if (!auth) {
      return { error: 'Unauthorized' };
    }

    const title = formData.get('title') as string;
    const video_url = formData.get('video_url') as string;
    const platform = formData.get('platform') as string;
    const client_name = formData.get('client_name') as string;
    const description = formData.get('description') as string;
    const thumbnail_url = formData.get('thumbnail_url') as string;
    const display_order = parseInt(formData.get('display_order') as string) || 0;
    const is_featured = formData.get('is_featured') === 'on';
    const is_active = formData.get('is_active') === 'on';

    if (!title || !video_url || !platform) {
      return { error: 'Judul, URL Video, dan Platform wajib diisi' };
    }

    try {
      const { error } = await supabaseAdmin.from('video_embeds').insert({
        title,
        video_url,
        platform,
        client_name: client_name || null,
        description: description || null,
        thumbnail_url: thumbnail_url || null,
        display_order,
        is_featured,
        is_active,
        created_by: auth.user.id,
      });

      if (error) throw error;

      revalidatePath('/admin/video-embeds');
      revalidatePath('/');
    } catch (error: any) {
      console.error('Error creating video embed:', error);
      return { error: error.message || 'Gagal menyimpan video' };
    }
  }

  return (
    <AdminProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Video Baru</h1>
          <p className="text-gray-600 mt-1">Tambahkan video embed dari Instagram Reels, TikTok, atau YouTube</p>
        </div>

        <VideoEmbedForm onSubmit={createVideoEmbed} />
      </div>
    </AdminProtectedLayout>
  );
}
