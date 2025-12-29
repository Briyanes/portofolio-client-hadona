'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteTestimonialButtonProps {
  testimonialId: string;
  testimonialTitle: string;
}

export function DeleteTestimonialButton({ testimonialId, testimonialTitle }: DeleteTestimonialButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Yakin ingin menghapus testimoni dari "${testimonialTitle}"?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete testimonial');
      }

      router.refresh();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Error: ${error.message || 'Gagal menghapus testimoni'}`);
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
