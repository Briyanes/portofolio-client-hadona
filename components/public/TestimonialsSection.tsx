'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';

interface Testimonial {
  id: string;
  slug: string;
  testimonial: string;
  testimonial_author: string;
  testimonial_position: string | null;
  client_name: string;
  client_logo_url: string | null;
  thumbnail_url: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  layout?: 'grid' | 'carousel';
  limit?: number;
}

export function TestimonialsSection({
  testimonials,
  layout = 'carousel',
  limit = 6,
}: TestimonialsSectionProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const displayTestimonials = testimonials.slice(0, limit);

  // Duplicate testimonials for seamless infinite loop
  const duplicatedTestimonials = [...displayTestimonials, ...displayTestimonials, ...displayTestimonials];

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const scrollSpeed = 2;
    sliderRef.current.scrollLeft -= e.movementX * scrollSpeed;
  };

  // Touch drag for mobile
  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;

    const touch = e.touches[0];
    const startX = touch.clientX;
    const currentScroll = sliderRef.current.scrollLeft;

    // Simple horizontal scroll
    sliderRef.current.scrollLeft = currentScroll;
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (displayTestimonials.length === 0) return null;

  return (
    <section className="animate-fade-in">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 bg-hadona-yellow/20 text-gray-900
                        rounded-full text-sm font-bold mb-4">
          TESTIMONIAL
        </span>
        <h2 className="text-section-title text-gray-900 mb-6">
          Apa Kata Klien Kami
        </h2>
        <p className="text-body text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Dengarkan langsung dari mereka yang telah merasakan hasil kerja sama dengan Hadona
        </p>
      </div>

      {/* Testimonials Slider */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => !isDragging && setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade Edge - Left */}
        <div className="absolute inset-y-0 left-0 w-24 slider-fade-left z-10 pointer-events-none"></div>

        {/* Slider Track */}
        <div
          ref={sliderRef}
          className={`flex gap-6 md:gap-8 animate-scroll-testimonial slider-track ${
            isPaused ? 'pause-animation' : ''
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <Link
              key={`${testimonial.id}-${index}`}
              href={`/studi-kasus/${testimonial.slug}`}
              className="group flex-shrink-0 w-[350px] md:w-[400px]"
            >
              <div
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl
                           transition-all duration-300 border border-gray-100
                           hover:border-hadona-primary/30 h-full flex flex-col
                           relative overflow-hidden"
              >
                {/* Quote icon background */}
                <div className="absolute top-4 right-4 text-hadona-primary/5 text-9xl
                              font-serif leading-none -z-0">
                  &quot;
                </div>

                {/* Quote icon */}
                <div className="relative z-10 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-hadona-primary/10
                                  to-hadona-light/10 flex items-center justify-center
                                  group-hover:scale-110 transition-transform duration-300"
                  >
                    <i className="bi bi-quote text-2xl text-hadona-primary"></i>
                  </div>
                </div>

                {/* Testimonial text */}
                <blockquote className="relative z-10 text-base md:text-lg text-gray-700 italic
                                      mb-4 leading-relaxed flex-1 line-clamp-4">
                  &quot;{testimonial.testimonial}&quot;
                </blockquote>

                {/* Author info */}
                <div className="relative z-10 flex items-center gap-3 pt-4 border-t
                                      border-gray-100 group-hover:border-hadona-primary/20
                                      transition-colors duration-300">
                  {/* Avatar or Initials */}
                  {testimonial.client_logo_url ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden
                                  bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0
                                  group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={testimonial.client_logo_url}
                        alt={testimonial.testimonial_author || testimonial.client_name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-hadona-primary
                                  to-hadona-light text-white flex items-center justify-center
                                  text-base font-bold flex-shrink-0
                                  group-hover:scale-110 transition-transform duration-300">
                      {getInitials(testimonial.testimonial_author)}
                    </div>
                  )}

                  {/* Author details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {testimonial.testimonial_author || testimonial.client_name}
                    </p>
                    {testimonial.testimonial_position && (
                      <p className="text-xs text-gray-600 truncate">
                        {testimonial.testimonial_position}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 truncate mt-0.5">{testimonial.client_name}</p>
                  </div>

                  {/* Arrow icon */}
                  <div className="text-hadona-primary opacity-0 group-hover:opacity-100
                                group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                    <i className="bi bi-arrow-right text-lg"></i>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Fade Edge - Right */}
        <div className="absolute inset-y-0 right-0 w-24 slider-fade-right z-10 pointer-events-none"></div>
      </div>

      {/* View All Link */}
      <div className="text-center mt-12">
        <Link
          href="https://hadona.id/testimonials"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white
                   text-hadona-primary font-bold rounded-xl border-2
                   border-hadona-primary hover:bg-hadona-primary/5
                   transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
        >
          <span>Lihat Semua Testimonial</span>
          <i className="bi bi-box-arrow-up-right text-lg"></i>
        </Link>
      </div>
    </section>
  );
}
