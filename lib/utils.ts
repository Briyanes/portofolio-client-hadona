import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Format date to Indonesian locale
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format date time to Indonesian locale
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Generate meta title if not provided
export function generateMetaTitle(title: string): string {
  return `${title} | Hadona Digital Media`;
}

// Generate meta description from content
export function generateMetaDescription(content: string, maxLength: number = 160): string {
  // Remove HTML tags and extra whitespace
  const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return truncate(text, maxLength);
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Delay function for debouncing
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Rate limiting in-memory store (for development)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number,
  window: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + window });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
}

// Clean up expired rate limit records
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Extract initials from client name for fallback display
 * Examples:
 * - "SnackYum Indonesia" → "SY"
 * - "StyleHub Indonesia" → "SI"
 * - "The Lorry" → "TL"
 * - "Gojek" → "GJ"
 *
 * @param name - Client name (e.g., "SnackYum Indonesia")
 * @returns Initials (max 2 characters, uppercase)
 */
export function getClientInitials(name: string | null | undefined): string {
  if (!name) return '??';

  // Remove common prefixes and suffixes
  const cleanedName = name
    .replace(/^(PT|CV|PT\.|CV\.)\s*/i, '') // Remove PT, CV prefixes
    .replace(/\s+(Indonesia|Tbk|Ltd|Inc|Corp)\.?$/i, '') // Remove suffixes
    .trim();

  // Split by spaces, hyphens, or camelCase
  const words = cleanedName
    .split(/[\s-]+/)
    .filter(word => word.length > 0);

  if (words.length === 0) return '??';
  if (words.length === 1) {
    // For single word, take first 2 characters
    return words[0].slice(0, 2).toUpperCase();
  }

  // Take first letter of first two words
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Generate a consistent color from client name for fallback background
 * Uses string hashing to generate HSL color
 *
 * @param name - Client name
 * @returns HSL color string (e.g., "220 70% 50%")
 */
export function getClientColor(name: string | null | undefined): string {
  if (!name) return '2B46BB'; // Default hadona-primary

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate hue (0-360), saturation (60-80%), lightness (45-55%)
  const h = Math.abs(hash % 360);
  const s = 60 + (Math.abs(hash >> 8) % 20); // 60-80%
  const l = 45 + (Math.abs(hash >> 16) % 10); // 45-55%

  return `${h} ${s}% ${l}%`;
}
