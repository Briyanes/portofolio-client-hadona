import type { CaseStudy } from '@/lib/types';

interface TestimonialCardProps {
  testimonial: Pick<CaseStudy, 'testimonial' | 'testimonial_author' | 'testimonial_position' | 'client_logo_url'>;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  if (!testimonial.testimonial) return null;

  // Get initials from author name
  const getInitials = (name?: string | null) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
          <blockquote className="text-xl md:text-2xl font-medium text-gray-800 italic mb-8 leading-relaxed">
            "{testimonial.testimonial}"
          </blockquote>

          {/* Author info */}
          <div className="flex items-center gap-4">
            {/* Avatar or Initials */}
            {testimonial.client_logo_url ? (
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-md flex-shrink-0">
                <img
                  src={testimonial.client_logo_url}
                  alt={testimonial.testimonial_author || 'Author'}
                  className="w-full h-full object-contain p-2"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-hadona-primary text-white flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-md">
                {getInitials(testimonial.testimonial_author)}
              </div>
            )}

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
