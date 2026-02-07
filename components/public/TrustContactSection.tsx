import Link from 'next/link';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/lib/constants';

export function TrustContactSection() {
  return (
    <section className="section-container py-6 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Trust & Security */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Trust & Security</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                <i className="bi bi-shield-check text-emerald-500 text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Secure & Private</p>
                <p className="text-xs text-gray-500">Your data is processed securely</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                <i className="bi bi-cloud-check text-blue-500 text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Reliable Service</p>
                <p className="text-xs text-gray-500">Built for performance & uptime</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
                <i className="bi bi-building text-indigo-500 text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Powered by Hadona Digital Media</p>
                <p className="text-xs text-gray-500">Trusted digital marketing agency</p>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help? */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Need Help?</h3>
          <div className="space-y-4">
            <Link
              href={`mailto:${CONTACT_INFO.email}`}
              className="flex items-start gap-3 group"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                <i className="bi bi-envelope text-blue-500 text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 group-hover:text-hadona-primary transition-colors">Email Support</p>
                <p className="text-xs text-gray-500">{CONTACT_INFO.email}</p>
              </div>
            </Link>
            <Link
              href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                <i className="bi bi-whatsapp text-green-500 text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 group-hover:text-green-600 transition-colors">WhatsApp</p>
                <p className="text-xs text-gray-500">+62 851 5800 0123</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Follow Us */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Follow Us</h3>
          <div className="space-y-4">
            <Link
              href={SOCIAL_LINKS.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center">
                <i className="bi bi-instagram text-pink-500 text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 group-hover:text-pink-500 transition-colors">Social Media</p>
                <p className="text-xs text-gray-500">{SOCIAL_LINKS.instagram.label}</p>
              </div>
            </Link>
            <Link
              href={SOCIAL_LINKS.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                <i className="bi bi-linkedin text-blue-600 text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">LinkedIn</p>
                <p className="text-xs text-gray-500">{SOCIAL_LINKS.linkedin.label}</p>
              </div>
            </Link>
            <Link
              href={SOCIAL_LINKS.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                <i className="bi bi-facebook text-blue-500 text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-500 transition-colors">Facebook</p>
                <p className="text-xs text-gray-500">{SOCIAL_LINKS.facebook.label}</p>
              </div>
            </Link>
            <Link
              href={SOCIAL_LINKS.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="bi bi-tiktok text-gray-800 text-lg"></i>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 group-hover:text-gray-700 transition-colors">TikTok</p>
                <p className="text-xs text-gray-500">{SOCIAL_LINKS.tiktok.label}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
