'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface PixelTrackingProps {
  metaPixelId?: string | null;
  igPixelId?: string | null;
  gtagId?: string | null;
  gtmId?: string | null;
  isMetaEnabled?: boolean;
  isIgEnabled?: boolean;
  isGtagEnabled?: boolean;
  isGtmEnabled?: boolean;
}

export function PixelTracking({
  metaPixelId,
  igPixelId,
  gtagId,
  gtmId,
  isMetaEnabled,
  isIgEnabled,
  isGtagEnabled,
  isGtmEnabled,
}: PixelTrackingProps) {
  // Track page view on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Track PageView for Meta/IG Pixel
      if (isMetaEnabled && metaPixelId) {
        if (window.fbq) {
          window.fbq('track', 'PageView');
        }
      }
    }
  }, [isMetaEnabled, metaPixelId]);

  // Track ViewContent event
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleViewContent = () => {
        if (isMetaEnabled && metaPixelId && window.fbq) {
          window.fbq('track', 'ViewContent', {
            content_name: 'Case Study',
            content_category: 'Portfolio',
          });
        }
      };

      // Check if we're on a case study detail page
      if (window.location.pathname.match(/^\/studi-kasus\/[^/]+$/)) {
        handleViewContent();
      }
    }
  }, [isMetaEnabled, metaPixelId]);

  return (
    <>
      {/* Meta Pixel */}
      {isMetaEnabled && metaPixelId && (
        <>
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {/* Instagram Pixel (same as Meta Pixel) */}
      {isIgEnabled && igPixelId && igPixelId !== metaPixelId && (
        <>
          <Script id="ig-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${igPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        </>
      )}

      {/* Google Analytics (GA4) */}
      {isGtagEnabled && gtagId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtagId}');
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager (GTM) */}
      {isGtmEnabled && gtmId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      )}
    </>
  );
}

// Declare global fbq type
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}
