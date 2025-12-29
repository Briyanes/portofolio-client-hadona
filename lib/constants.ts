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

// Agency Information
export const AGENCY_INFO = {
  name: 'Hadona Digital Media',
  tagline: 'Transform Your Digital Presence',
  sinceYear: 2020,
  description: 'Hadona Digital Media adalah agensi digital marketing yang berfokus pada hasil nyata. Kami membantu bisnis berkembang melalui strategi digital yang terukur dan efektif.',
  vision: 'Menjadi mitra digital marketing terpercaya untuk bisnis di Indonesia',
  mission: [
    'Memberikan hasil nyata yang terukur',
    'Membangun partnership jangka panjang',
    'Inovasi berkelanjutan dalam strategi digital',
  ],
  values: [
    {
      icon: 'bi-graph-up',
      title: 'Result-Oriented',
      desc: 'Fokus pada ROI dan metrik bisnis',
    },
    {
      icon: 'bi-lightbulb',
      title: 'Inovatif',
      desc: 'Selalu mencari pendekatan baru',
    },
    {
      icon: 'bi-handshake',
      title: 'Partnership',
      desc: 'Mitra jangka panjang sukses Anda',
    },
    {
      icon: 'bi-shield-check',
      title: 'Transparan',
      desc: 'Laporan dan komunikasi terbuka',
    },
  ],
  teamSize: '25+',
  projectsCompleted: '500+',
  yearsExperience: new Date().getFullYear() - 2020,
} as const;

// Agency Services
export const AGENCY_SERVICES = [
  {
    id: 'paid-ads',
    icon: 'bi-graph-up-arrow',
    title: 'Digital Paid-Ads',
    description:
      'Kampanye iklan berbayar di Meta & Google dengan strategi berbasis data untuk maksimalkan ROI',
    color: '#2B46BB',
    features: [
      'Facebook Ads',
      'Instagram Ads',
      'Google Ads',
      'TikTok Ads',
    ],
  },
  {
    id: 'social-media',
    icon: 'bi-instagram',
    title: 'Social Media',
    description:
      'Pengelolaan konten social media untuk bangun brand awareness dan engagement yang kuat',
    color: '#4A6AE8',
    features: [
      'Content Creation',
      'Community Management',
      'Analytics & Reports',
      'Social Strategy',
    ],
  },
  {
    id: 'seo',
    icon: 'bi-search',
    title: 'SEO',
    description:
      'Optimasi mesin pencari untuk ranking organik yang lebih tinggi dan traffic jangka panjang',
    color: '#EDD947',
    features: [
      'On-Page SEO',
      'Technical SEO',
      'Local SEO',
      'Content Strategy',
    ],
  },
  {
    id: 'kol-management',
    icon: 'bi-people',
    title: 'KOL Management',
    description:
      'Kerjasama dengan Key Opinion Leader dan influencer untuk amplifikasi brand reach',
    color: '#1E3190',
    features: [
      'Influencer Selection',
      'Campaign Management',
      'Performance Tracking',
      'Relationship Management',
    ],
  },
  {
    id: 'graphic-design',
    icon: 'bi-palette',
    title: 'Graphic Design',
    description:
      'Desain grafis profesional untuk kebutuhan marketing dan branding bisnis Anda',
    color: '#0F1A5C',
    features: [
      'Social Media Design',
      'Ad Creative',
      'Logo & Branding',
      'Marketing Materials',
    ],
  },
  {
    id: 'brand-marketing',
    icon: 'bi-badge-ad',
    title: 'Brand Marketing',
    description:
      'Strategi pemasaran brand untuk bangun identitas dan awareness di pasar digital',
    color: '#2B46BB',
    features: [
      'Brand Strategy',
      'Positioning',
      'Brand Guidelines',
      'Campaign Integration',
    ],
  },
  {
    id: 'web-development',
    icon: 'bi-code-slash',
    title: 'Web Development',
    description:
      'Pembuatan website yang cepat, responsif, dan optimized untuk conversion',
    color: '#4A6AE8',
    features: [
      'Landing Pages',
      'Company Profile',
      'E-Commerce',
      'Maintenance',
    ],
  },
  {
    id: 'campaign-content',
    icon: 'bi-calendar-event',
    title: 'Campaign Content',
    description:
      'Pembuatan konten kampanye yang kreatif dan efektif untuk iklan digital',
    color: '#EDD947',
    features: [
      'Ad Copywriting',
      'Visual Content',
      'Video Production',
      'A/B Testing',
    ],
  },
] as const;
