import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCaseStudyBySlug, getRelatedCaseStudies } from '@/lib/supabase-queries';
import { CaseStudyHero } from '@/components/public/CaseStudyHero';
import { ContentSection } from '@/components/public/ContentSection';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const caseStudy = await getCaseStudyBySlug(slug);

    return {
      title: caseStudy.meta_title || caseStudy.title,
      description: caseStudy.meta_description || caseStudy.results?.substring(0, 160) || `Studi kasus ${caseStudy.title} oleh Hadona Digital Media`,
      keywords: caseStudy.meta_keywords || [caseStudy.title, 'Studi Kasus', 'Digital Marketing', 'Hadona Digital Media'],
      openGraph: {
        title: caseStudy.title,
        description: caseStudy.meta_description || caseStudy.results?.substring(0, 160) || '',
        images: caseStudy.thumbnail_url ? [caseStudy.thumbnail_url] : [],
        type: 'article',
      },
    };
  } catch {
    return {
      title: 'Studi Kasus Tidak Ditemukan',
    };
  }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const caseStudy = await getCaseStudyBySlug(slug);

    // Get related case studies
    const relatedCaseStudies = caseStudy.category_id
      ? await getRelatedCaseStudies(caseStudy.category_id, caseStudy.id, 3)
      : [];

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="responsive-container mx-auto px-4 py-8 md:py-12 lg:py-16">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-hadona-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/#studi-kasus" className="hover:text-hadona-primary transition-colors">
                  Studi Kasus
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium truncate max-w-[200px]">
                {caseStudy.title}
              </li>
            </ol>
          </nav>

          {/* Hero Section */}
          <CaseStudyHero caseStudy={caseStudy} />

          {/* Challenge Section */}
          {caseStudy.challenge && (
            <ContentSection
              title="Tantangan"
              content={caseStudy.challenge}
              icon="bi-exclamation-triangle"
              color="#DC2626"
              className="mt-12"
            />
          )}

          {/* Strategy Section */}
          {caseStudy.strategy && (
            <ContentSection
              title="Strategi"
              content={caseStudy.strategy}
              icon="bi-lightbulb"
              color="#F59E0B"
              className="mt-12"
            />
          )}

          {/* Results Section */}
          {caseStudy.results && (
            <ContentSection
              title="Hasil"
              content={caseStudy.results}
              icon="bi-trophy"
              color="#10B981"
              className="mt-12"
            />
          )}

          {/* Gallery Section */}
          {caseStudy.gallery_urls && caseStudy.gallery_urls.length > 0 && (
            <section className="mt-12 animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Galeri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseStudy.gallery_urls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image
                      src={url}
                      alt={`${caseStudy.title} - Gambar ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Testimonial Section */}
          {caseStudy.testimonial && (
            <section className="mt-12 animate-fade-in">
              <div className="bg-gradient-to-br from-hadona-primary to-hadona-dark rounded-2xl p-8 md:p-12 text-white">
                <div className="max-w-4xl mx-auto text-center">
                  <i className="bi bi-quote text-5xl mb-6 opacity-50"></i>
                  <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
                    "{caseStudy.testimonial}"
                  </blockquote>
                  <cite className="not-italic">
                    <div className="font-bold text-lg">{caseStudy.testimonial_author}</div>
                    {caseStudy.testimonial_position && (
                      <div className="text-hadona-primary-light">{caseStudy.testimonial_position}</div>
                    )}
                    <div className="text-sm text-gray-300 mt-1">{caseStudy.client_name}</div>
                  </cite>
                </div>
              </div>
            </section>
          )}

          {/* Social Links */}
          <section className="mt-12 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Lihat Lebih Lanjut
            </h2>
            <div className="flex flex-wrap gap-4">
              {caseStudy.website_url && (
                <a
                  href={caseStudy.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-gray-900"
                >
                  <i className="bi bi-globe text-hadona-primary"></i>
                  Kunjungi Website
                </a>
              )}
              {caseStudy.instagram_url && (
                <a
                  href={caseStudy.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
                >
                  <i className="bi bi-instagram"></i>
                  Instagram
                </a>
              )}
              {caseStudy.facebook_url && (
                <a
                  href={caseStudy.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
                >
                  <i className="bi bi-facebook"></i>
                  Facebook
                </a>
              )}
            </div>
          </section>

          {/* Related Case Studies */}
          {relatedCaseStudies.length > 0 && (
            <section className="mt-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Studi Kasus Lainnya
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedCaseStudies.map((related) => (
                  <Link
                    key={related.id}
                    href={`/studi-kasus/${related.slug}`}
                    className="group"
                  >
                    <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden h-full">
                      {related.thumbnail_url && (
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={related.thumbnail_url}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        {related.category && (
                          <span className="inline-block px-3 py-1 bg-hadona-primary/10 text-hadona-primary rounded-full text-xs font-semibold mb-3">
                            {related.category.name}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-hadona-primary transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {related.client_name}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="mt-16 animate-fade-in">
            <div className="bg-gradient-to-br from-hadona-primary to-hadona-dark rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ingin Hasil Seperti Ini?
              </h2>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
                Mari diskusikan bagaimana Hadona Digital Media dapat membantu bisnis Anda mencapai tujuan digital marketing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://hadona.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-hadona-primary rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <i className="bi bi-whatsapp text-xl"></i>
                  Konsultasi Gratis
                </a>
                <Link
                  href="/#studi-kasus"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-hadona-primary transition-colors"
                >
                  <i className="bi bi-arrow-left"></i>
                  Lihat Semua Studi Kasus
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading case study:', error);
    notFound();
  }
}
