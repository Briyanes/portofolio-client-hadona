import { redirect, notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminUserWithToken, getAdminUserForAction } from '@/lib/admin-auth';
import { adminGetVideoEmbedById } from '@/lib/supabase-queries';
import { supabaseAdmin } from '@/lib/supabase-admin';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import { VideoEmbedForm } from '@/components/admin/VideoEmbedForm';

export const dynamic = 'force-dynamic';

interface EditVideoEmbedPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVideoEmbedPage({ params }: EditVideoEmbedPageProps) {
  const auth = await getAdminUserWithToken();

  if (!auth) {
    redirect('/admin/login');
  }

  const { id } = await params;

  let videoEmbed;
  try {
    videoEmbed = await adminGetVideoEmbedById(id);
  } catch (error) {
    console.error('Error loading video embed:', error);
    notFound();
  }

  if (!videoEmbed) {
    notFound();
  }

  async function updateVideoEmbed(formData: FormData) {
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
      const { error } = await supabaseAdmin
        .from('video_embeds')
        .update({
          title,
          video_url,
          platform,
          client_name: client_name || null,
          description: description || null,
          thumbnail_url: thumbnail_url || null,
          display_order,
          is_featured,
          is_active,
          updated_by: auth.user.id,
        })
        .eq('id', id);

      if (error) throw error;

      revalidatePath('/admin/video-embeds');
      revalidatePath('/');

      return { success: true };
    } catch (error: any) {
      console.error('Error updating video embed:', error);
      return { error: error.message || 'Gagal memperbarui video' };
    }
  }

  return (
    <AdminProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Video</h1>
          <p className="text-gray-600 mt-1">Perbarui informasi video embed</p>
        </div>

        <VideoEmbedForm
          initialData={{
            title: videoEmbed.title,
            video_url: videoEmbed.video_url,
            platform: videoEmbed.platform,
            client_name: videoEmbed.client_name || undefined,
            description: videoEmbed.description || undefined,
            thumbnail_url: videoEmbed.thumbnail_url || undefined,
            display_order: videoEmbed.display_order,
            is_featured: videoEmbed.is_featured,
            is_active: videoEmbed.is_active,
          }}
          onSubmit={updateVideoEmbed}
        />
      </div>
    </AdminProtectedLayout>
  );
}
