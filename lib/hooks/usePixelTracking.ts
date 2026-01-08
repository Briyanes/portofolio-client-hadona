'use client';

import { useEffect } from 'react';

/**
 * Custom hook to track pixel events
 * Usage: trackEvent('InitiateCheckout', { value: 100, currency: 'IDR' })
 */
export function usePixelTracking() {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window === 'undefined') return;

    // Track Meta/IG Pixel events
    if (window.fbq) {
      window.fbq('track', eventName, parameters);
    }

    // Track Google Analytics events
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  };

  const trackViewContent = (contentName: string, contentType = 'case_study') => {
    trackEvent('ViewContent', {
      content_name: contentName,
      content_type: contentType,
      content_category: 'Portfolio',
    });
  };

  const trackInitiateCheckout = (value?: number, currency = 'IDR') => {
    trackEvent('InitiateCheckout', {
      value,
      currency,
    });
  };

  const trackLead = () => {
    trackEvent('Lead', {});
  };

  return {
    trackEvent,
    trackViewContent,
    trackInitiateCheckout,
    trackLead,
  };
}

// Declare global types
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
  }
}
