import type { CaseStudy } from '@/lib/types';
import { ClientLogo } from './ClientLogo';

interface TestimonialCardProps {
  testimonial: Pick<CaseStudy, 'testimonial' | 'testimonial_author' | 'testimonial_position' | 'client_logo_url'>;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  if (!testimonial.testimonial) return null;

  return (
    <section className="mb-16 animate-scale-in">
      <div className="bg-gradient-to-br from-hadona-primary/10 to-hadona-light/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
        {/* Large quote icon background */}
        <div className="absolute top-4 left-4 text-hadona-primary/10 text-9xl font-serif leading-none">
          "
        </div>

        <div className="relative z-10">
          {/* Quote icon */}
          <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-6">
            <i className="bi bi-quote text-3xl text-hadona-primary"></i>
          </div>

          {/* Testimonial text */}
          <blockquote className="text-lg md:text-xl font-medium text-gray-800 italic mb-8 leading-relaxed">
            "{testimonial.testimonial}"
          </blockquote>

          {/* Author info */}
          <div className="flex items-center gap-4">
            {/* Avatar with fallback */}
            <ClientLogo
              src={testimonial.client_logo_url}
              clientName={testimonial.testimonial_author || 'Klien'}
              size="lg"
              variant="circle"
              className="w-14 h-14"
            />

            {/* Author details */}
            <div>
              <p className="text-lg font-bold text-gray-900">
                {testimonial.testimonial_author || 'Klien'}
              </p>
              {testimonial.testimonial_position && (
                <p className="text-sm text-gray-600">
                  {testimonial.testimonial_position}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
