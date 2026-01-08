'use client';

import React, { useState } from 'react';

interface CaseStudyThumbnailProps {
  src: string;
  alt: string;
}

export function CaseStudyThumbnail({ src, alt }: CaseStudyThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
