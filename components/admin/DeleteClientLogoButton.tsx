'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteClientLogoButtonProps {
  logoId: string;
  logoName: string;
}

export function DeleteClientLogoButton({ logoId, logoName }: DeleteClientLogoButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Yakin ingin menghapus logo "${logoName}"?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/client-logos/${logoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete client logo');
      }

      router.refresh();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Error: ${error.message || 'Gagal menghapus logo'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
    >
      {isDeleting ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}
