'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface DeleteVideoEmbedButtonProps {
  id: string;
  title: string;
}

export function DeleteVideoEmbedButton({ id, title }: DeleteVideoEmbedButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/video-embeds/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to delete');
        }

        toast.success('Video berhasil dihapus');
        router.refresh();
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error(`Error: ${error?.message || 'Terjadi kesalahan saat menghapus data'}`);
      }
    });

    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-600 hover:text-red-800 transition-colors"
        disabled={isPending}
        title="Hapus Video"
      >
        <i className={`bi ${isPending ? 'bi-hourglass-split animate-spin' : 'bi-trash'}`}></i>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <i className="bi bi-exclamation-triangle text-2xl text-red-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Hapus Video?</h3>
                <p className="text-sm text-gray-600">Aksi ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus video <strong>&quot;{title}&quot;</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {isPending ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
