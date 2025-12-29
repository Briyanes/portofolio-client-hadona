'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteClientLogoButtonProps {
  logoId: string;
  logoName: string;
}

export function DeleteClientLogoButton({ logoId, logoName }: DeleteClientLogoButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Yakin ingin menghapus logo "${logoName}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/client-logos/${logoId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok) {
          alert(`Error: ${result.error || 'Failed to delete client logo'}`);
          return;
        }

        // Success - refresh the page
        router.refresh();
      } catch (error: any) {
        console.error('Delete error:', error);
        alert(`Error: ${error?.message || 'Failed to delete client logo'}`);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`text-red-600 hover:text-red-800 text-sm font-medium bg-transparent border-0 p-0 ${
        isPending ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isPending ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}
