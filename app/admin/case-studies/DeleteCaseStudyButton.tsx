'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteCaseStudyButtonProps {
  caseStudyId: string;
  caseStudyTitle: string;
}

export function DeleteCaseStudyButton({ caseStudyId, caseStudyTitle }: DeleteCaseStudyButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Yakin ingin menghapus studi kasus "${caseStudyTitle}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/case-studies/${caseStudyId}/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (!response.ok) {
          alert(`Error: ${result.error || 'Failed to delete'}`);
          return;
        }

        // Success - refresh the page
        router.refresh();
      } catch (error: any) {
        console.error('Delete error:', error);
        alert(`Error: ${error?.message || 'Failed to delete'}`);
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
