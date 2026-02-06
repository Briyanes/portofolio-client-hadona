'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { CaseStudyVideoEmbed } from '@/lib/types';

interface CaseStudyVideosProps {
  videos: CaseStudyVideoEmbed[];
}

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

// Helper to get platform icon
function getPlatformIcon(platform: string): string {
  switch (platform) {
    case 'instagram': return 'bi-instagram';
    case 'tiktok': return 'bi-tiktok';
    case 'youtube': return 'bi-youtube';
    default: return 'bi-play-circle';
  }
}

// Helper to get platform color
function getPlatformGradient(platform: string): string {
  switch (platform) {
    case 'instagram': return 'from-purple-500 to-pink-500';
    case 'tiktok': return 'from-gray-900 to-gray-700';
    case 'youtube': return 'from-red-600 to-red-500';
    default: return 'from-gray-500 to-gray-400';
  }
}

export function CaseStudyVideos({ videos }: CaseStudyVideosProps) {
  const [activeVideo, setActiveVideo] = useState<CaseStudyVideoEmbed | null>(null);

  if (!videos || videos.length === 0) return null;

  return (
    <section className="animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <i className="bi bi-play-circle-fill text-white text-lg"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Video Showcase</h2>
            <p className="text-sm text-gray-500">Video hasil kampanye</p>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onClick={() => setActiveVideo(video)}
            >
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300">
                {/* Platform Badge */}
                <div className={`absolute top-2 left-2 z-20 px-2 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r ${getPlatformGradient(video.platform)} flex items-center gap-1`}>
                  <i className={`bi ${getPlatformIcon(video.platform)}`}></i>
                </div>

                {/* Thumbnail or Placeholder */}
                {video.thumbnail_url ? (
                  <Image
                    src={video.thumbnail_url}
                    alt={video.title || 'Video thumbnail'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                  />
                ) : (
                  <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${getPlatformGradient(video.platform)} flex items-center justify-center`}>
                    <i className={`bi ${getPlatformIcon(video.platform)} text-4xl text-white/50`}></i>
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <i className="bi bi-play-fill text-xl text-hadona-primary ml-0.5"></i>
                  </div>
                </div>
              </div>

              {/* Video Title */}
              {video.title && (
                <p className="mt-2 text-sm font-medium text-gray-700 line-clamp-2">
                  {video.title}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="relative w-full max-w-[400px] bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <i className="bi bi-x-lg text-lg"></i>
            </button>

            {/* Video Content */}
            {activeVideo.platform === 'youtube' ? (
              // YouTube embed
              <div className="aspect-video">
                <iframe
                  src={getYouTubeEmbedUrl(activeVideo.url) + '?autoplay=1'}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            ) : (
              // Instagram/TikTok - show external link (iframe blocked by CSP)
              <div className="aspect-[9/16] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-gray-800">
                {/* Platform Icon */}
                <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${getPlatformGradient(activeVideo.platform)} flex items-center justify-center mb-6`}>
                  <i className={`bi ${getPlatformIcon(activeVideo.platform)} text-4xl text-white`}></i>
                </div>

                {/* Video Title */}
                {activeVideo.title && (
                  <h3 className="text-xl font-bold text-white text-center mb-6">{activeVideo.title}</h3>
                )}

                {/* Watch on Platform Button */}
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${getPlatformGradient(activeVideo.platform)} text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg`}
                >
                  <i className={`bi ${getPlatformIcon(activeVideo.platform)} text-xl`}></i>
                  Tonton di {activeVideo.platform.charAt(0).toUpperCase() + activeVideo.platform.slice(1)}
                  <i className="bi bi-box-arrow-up-right"></i>
                </a>

                <p className="text-gray-500 text-sm mt-4">
                  Video akan terbuka di tab baru
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
