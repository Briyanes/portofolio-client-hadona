'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    </section>
  );
}
