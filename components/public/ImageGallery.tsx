'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = useCallback(() => {
    if (selectedImageIndex === null || !images) return;
    const newIndex = selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1;
    setSelectedImageIndex(newIndex);
  }, [selectedImageIndex, images]);

  const goToNext = useCallback(() => {
    if (selectedImageIndex === null || !images) return;
    const newIndex = selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1;
    setSelectedImageIndex(newIndex);
  }, [selectedImageIndex, images]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, goToPrevious, goToNext]);

  if (!images || images.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-hadona-primary/10 flex items-center justify-center">
          <i className="bi bi-images text-2xl text-hadona-primary"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Galeri</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => openModal(index)}
          >
            <Image
              src={image}
              alt={`Gallery image ${index + 1}`}
              fill
              className={`object-cover transition-transform duration-500 ${
                hoveredIndex === index ? 'scale-110' : 'scale-100'
              }`}
              loading="lazy"
            />

            {/* Overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
              hoveredIndex === index ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-white">
                  <i className="bi bi-zoom-in text-xl"></i>
                  <span className="text-sm font-medium">Klik untuk memperbesar</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Full-Size Image */}
      <Modal
        isOpen={selectedImageIndex !== null}
        onClose={closeModal}
        size="xl"
        showCloseButton={true}
      >
        {selectedImageIndex !== null && (
          <div className="relative">
            {/* Image Counter */}
            <div className="text-center text-sm text-gray-500 mb-4">
              {selectedImageIndex + 1} dari {images.length}
            </div>

            {/* Image */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={images[selectedImageIndex]}
                alt={`Gallery image ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-4 p-2 text-white hover:text-hadona-primary transition-colors"
                  aria-label="Previous image"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  onClick={goToNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-4 p-2 text-white hover:text-hadona-primary transition-colors"
                  aria-label="Next image"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
