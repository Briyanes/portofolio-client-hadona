import { adminGetAllVideoEmbeds } from '@/lib/supabase-queries';
import { redirect } from 'next/navigation';
import { getAdminUserWithToken } from '@/lib/admin-auth';
import AdminProtectedLayout from '@/components/admin/AdminProtectedLayout';
import Link from 'next/link';
import { DeleteVideoEmbedButton } from '@/components/admin/DeleteVideoEmbedButton';
import type { VideoEmbed } from '@/lib/types';

export const dynamic = 'force-dynamic';

// Helper to get platform icon
function getPlatformIcon(platform: string): string {
  switch (platform) {
    case 'instagram': return 'bi-instagram';
    case 'tiktok': return 'bi-tiktok';
    case 'youtube': return 'bi-youtube';
    default: return 'bi-play-circle';
  }
}

// Helper to get platform badge color
function getPlatformColor(platform: string): string {
  switch (platform) {
    case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    case 'tiktok': return 'bg-black text-white';
    case 'youtube': return 'bg-red-600 text-white';
    default: return 'bg-gray-500 text-white';
  }
}

export default async function VideoEmbedsPage() {
  const auth = await getAdminUserWithToken();

  if (!auth) {
    redirect('/admin/login');
  }

  let videoEmbeds: VideoEmbed[] = [];
  try {
    videoEmbeds = await adminGetAllVideoEmbeds();
  } catch (error) {
    console.error('Error loading video embeds:', error);
  }

  return (
    <AdminProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Video Embeds</h1>
            <p className="text-gray-600 mt-1">Kelola video embed dari Instagram Reels, TikTok, dan YouTube</p>
          </div>
          <Link
            href="/admin/video-embeds/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-hadona-primary text-white rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
          >
            <i className="bi bi-plus-lg"></i>
            Tambah Video
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {videoEmbeds.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Video
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klien
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urutan
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {videoEmbeds.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <i className={`bi ${getPlatformIcon(video.platform)} text-xl text-gray-600`}></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{video.title}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">{video.video_url}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getPlatformColor(video.platform)}`}>
                        <i className={`bi ${getPlatformIcon(video.platform)}`}></i>
                        {video.platform.charAt(0).toUpperCase() + video.platform.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{video.client_name || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {video.is_active && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Aktif
                          </span>
                        )}
                        {video.is_featured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                        {!video.is_active && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Nonaktif
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {video.display_order}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/video-embeds/${video.id}`}
                          className="text-hadona-primary hover:text-hadona-dark transition-colors"
                          title="Edit Video"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <DeleteVideoEmbedButton id={video.id} title={video.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <i className="bi bi-play-circle text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Video</h3>
              <p className="text-gray-600 mb-4">Tambahkan video embed dari Instagram Reels, TikTok, atau YouTube</p>
              <Link
                href="/admin/video-embeds/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-hadona-primary text-white rounded-lg hover:bg-hadona-dark transition-colors font-semibold"
              >
                <i className="bi bi-plus-lg"></i>
                Tambah Video Pertama
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminProtectedLayout>
  );
}
