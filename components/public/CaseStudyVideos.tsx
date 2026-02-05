'use client';

import { useState } from 'react';
import type { CaseStudyVideoEmbed } from '@/lib/types';

interface CaseStudyVideosProps {
  videos: CaseStudyVideoEmbed[];
}

// Helper function to convert video URL to embed URL
function getEmbedUrl(url: string, platform: string): string {
  if (!url) return '';
  
  if (platform === 'instagram') {
    if (url.includes('/embed/')) return url;
    return url.replace(/\/?$/, '/embed/');
  }
  
  if (platform === 'tiktok') {
    const match = url.match(/video\/(\d+)/);
    if (match) {
      return `https://www.tiktok.com/embed/v2/${match[1]}`;
    }
    return url;
  }
  
  if (platform === 'youtube') {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
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
                  <img
                    src={video.thumbnail_url}
                    alt={video.title || 'Video thumbnail'}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <i className="bi bi-x-lg text-lg"></i>
            </button>

            {/* Platform Badge in Modal */}
            <div className={`absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full text-white text-sm font-bold bg-gradient-to-r ${getPlatformGradient(activeVideo.platform)} flex items-center gap-1.5`}>
              <i className={`bi ${getPlatformIcon(activeVideo.platform)}`}></i>
              {activeVideo.platform.charAt(0).toUpperCase() + activeVideo.platform.slice(1)}
            </div>

            {/* Video Embed */}
            <div className="aspect-[9/16] bg-black">
              {activeVideo.platform === 'youtube' ? (
                <iframe
                  src={getEmbedUrl(activeVideo.url, activeVideo.platform) + '?autoplay=1'}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeVideo.platform === 'tiktok' ? (
                <iframe
                  src={getEmbedUrl(activeVideo.url, activeVideo.platform)}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <iframe
                  src={getEmbedUrl(activeVideo.url, activeVideo.platform)}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Video Title in Modal */}
            {activeVideo.title && (
              <div className="p-4 bg-gray-900">
                <h3 className="text-white font-semibold">{activeVideo.title}</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
