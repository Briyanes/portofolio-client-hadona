// App Constants
export const APP_NAME = 'Hadona Portfolio';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://portofolio.hadona.id';

// Contact Information (CENTRALIZED)
export const CONTACT_INFO = {
  whatsapp: '6285158000123',
  email: 'hi@hadona.id',
  website: 'https://hadona.id',
  phone: '+62818 0575 7585',
} as const;

// Helper to format WhatsApp URL
export const getWhatsAppURL = (message?: string) => {
  const encodedMessage = message
    ? encodeURIComponent(message)
    : 'Halo Hadona, saya tertarik dengan studi kasus yang saya lihat di portfolio';
  return `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodedMessage}`;
};

// Brand Colors
export const BRAND_COLORS = {
  primary: '#2B46BB',
  dark: '#1E3190',
  light: '#4A6AE8',
  bgDark: '#0F1A5C',
  bgDarker: '#0A1240',
  yellow: '#EDD947',
  yellowDark: '#E5D03D',
} as const;

// File Upload Limits
export const UPLOAD_LIMITS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxGalleryImages: 10,
} as const;

// Image Size Recommendations
export const IMAGE_SIZES = {
  clientLogo: { width: 500, height: 500 },
  thumbnail: { width: 1200, height: 630 },
  heroImage: { width: 1920, height: 1080 },
  gallery: { width: 1920, height: 1080 },
} as const;

// Pagination
export const PAGINATION = {
  adminPerPage: 10,
  publicPerPage: 12,
} as const;

// Rate Limiting (requests per duration)
export const RATE_LIMITS = {
  api: { limit: 100, window: 300000 }, // 100 req / 5 min
  upload: { limit: 10, window: 60000 }, // 10 req / 1 min
  auth: { limit: 5, window: 60000 }, // 5 req / 1 min
} as const;
