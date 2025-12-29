'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getClientInitials, getClientColor, cn } from '@/lib/utils';

interface ClientLogoProps {
  /** Logo URL from database */
  src: string | null | undefined;
  /** Client name for alt text and fallback */
  clientName: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show as circle or rounded rectangle */
  variant?: 'circle' | 'rounded' | 'square';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
};

const variantClasses = {
  circle: 'rounded-full',
  rounded: 'rounded-lg',
  square: 'rounded-md',
};

/**
 * ClientLogo Component
 *
 * Displays client logo with automatic fallback to initials if image fails to load.
 * Uses Next.js Image component with error boundary pattern.
 *
 * @example
 * <ClientLogo
 *   src={caseStudy.client_logo_url}
 *   clientName="SnackYum Indonesia"
 *   size="md"
 *   variant="rounded"
 * />
 */
export function ClientLogo({
  src,
  clientName,
  size = 'md',
  className,
  variant = 'rounded',
}: ClientLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If no src provided or previous error, show fallback
  const shouldShowFallback = !src || imageError;

  const initials = getClientInitials(clientName);
  const color = getClientColor(clientName);

  if (shouldShowFallback) {
    // Fallback: Display client initials
    return (
      <div
        className={cn(
          sizeClasses[size],
          variantClasses[variant],
          'flex items-center justify-center font-bold text-white shadow-lg flex-shrink-0',
          className
        )}
        style={{
          background: `linear-gradient(135deg, hsl(${color}), hsl(${color}) 150%)`,
        }}
        title={clientName}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        'overflow-hidden bg-gray-50 shadow-inner flex-shrink-0 relative',
        isLoading && 'animate-pulse bg-gray-200',
        className
      )}
    >
      <Image
        src={src}
        alt={clientName}
        fill
        className="object-contain p-1.5"
        sizes="(max-width: 768px) 32px, 48px"
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        onLoad={() => {
          setIsLoading(false);
        }}
      />
    </div>
  );
}
