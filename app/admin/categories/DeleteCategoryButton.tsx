'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
}

export function DeleteCategoryButton({ categoryId, categoryName }: DeleteCategoryButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Yakin ingin menghapus kategori "${categoryName}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || 'Failed to delete');
          return;
        }

        toast.success('Kategori berhasil dihapus');
        router.refresh();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete');
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
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
