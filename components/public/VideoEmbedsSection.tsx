'use client';

import { useState, useRef } from 'react';
import type { VideoEmbed } from '@/lib/types';

interface VideoEmbedsSectionProps {
  videos: VideoEmbed[];
  showTitle?: boolean;
}

// Helper function to convert video URL to embed URL
function getEmbedUrl(url: string, platform: string): string {
  if (!url) return '';
  
  if (platform === 'instagram') {
    // Instagram: add /embed/ if not present
    if (url.includes('/embed/')) return url;
    return url.replace(/\/?$/, '/embed/');
  }
  
  if (platform === 'tiktok') {
    // TikTok: extract video ID and create embed URL
    const match = url.match(/video\/(\d+)/);
    if (match) {
      return `https://www.tiktok.com/embed/v2/${match[1]}`;
    }
    return url;
  }
  
  if (platform === 'youtube') {
    // YouTube: convert watch URL to embed URL
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

export function VideoEmbedsSection({
  videos,
  showTitle = true,
}: VideoEmbedsSectionProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoEmbed | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Duplicate videos for seamless infinite loop
  const duplicatedVideos = [...videos, ...videos, ...videos];

  // Drag functionality
  const handleMouseDown = () => {
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const scrollSpeed = 2;
    sliderRef.current.scrollLeft -= e.movementX * scrollSpeed;
  };

  // Touch drag for mobile
  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  if (videos.length === 0) return null;

  return (
    <section className="animate-fade-in">
      {showTitle && (
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 bg-hadona-primary/10 text-hadona-primary rounded-full text-sm font-bold mb-4">
            VIDEO SHOWCASE
          </span>
          <h2 className="text-section-title text-gray-900 mb-4">
            Hasil Kerja Kami
          </h2>
          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            Lihat video hasil kampanye digital marketing dari berbagai klien kami
          </p>
        </div>
      )}

      {/* Video Carousel */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => !isDragging && setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade Edge - Left */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-24 slider-fade-left z-10 pointer-events-none"></div>

        {/* Slider Track */}
        <div
          ref={sliderRef}
          className={`flex gap-4 md:gap-6 animate-scroll-video slider-track ${
            isPaused ? 'pause-animation' : ''
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {duplicatedVideos.map((video, index) => (
            <div
              key={`${video.id}-${index}`}
              className="group flex-shrink-0 w-[260px] md:w-[300px]"
            >
              <div
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-hadona-primary/30"
              >
                {/* Video Thumbnail/Preview */}
                <div 
                  className="relative aspect-[9/16] bg-gray-900 cursor-pointer"
                  onClick={() => setActiveVideo(video)}
                >
                  {/* Platform Badge */}
                  <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r ${getPlatformGradient(video.platform)} flex items-center gap-1.5`}>
                    <i className={`bi ${getPlatformIcon(video.platform)}`}></i>
                    {video.platform.charAt(0).toUpperCase() + video.platform.slice(1)}
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <i className="bi bi-play-fill text-3xl text-hadona-primary ml-1"></i>
                    </div>
                  </div>

                  {/* Thumbnail or Placeholder */}
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getPlatformGradient(video.platform)} flex items-center justify-center`}>
                      <div className="text-center">
                        <i className={`bi ${getPlatformIcon(video.platform)} text-6xl text-white/50 mb-2`}></i>
                        <p className="text-white/50 text-xs font-medium px-4">{video.title}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2 mb-1">
                    {video.title}
                  </h3>
                  {video.client_name && (
                    <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                      <i className="bi bi-building"></i>
                      {video.client_name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fade Edge - Right */}
        <div className="absolute inset-y-0 right-0 w-16 md:w-24 slider-fade-right z-10 pointer-events-none"></div>
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
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            {/* Video Content */}
            {activeVideo.platform === 'youtube' ? (
              // YouTube embed works well
              <div className="aspect-video">
                <iframe
                  src={getEmbedUrl(activeVideo.video_url, activeVideo.platform)}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            ) : (
              // Instagram/TikTok - show link instead of blocked iframe
              <div className="aspect-[9/16] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-gray-800">
                {/* Platform Icon */}
                <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${getPlatformGradient(activeVideo.platform)} flex items-center justify-center mb-6`}>
                  <i className={`bi ${getPlatformIcon(activeVideo.platform)} text-4xl text-white`}></i>
                </div>

                {/* Video Title */}
                <h3 className="text-xl font-bold text-white text-center mb-2">{activeVideo.title}</h3>
                {activeVideo.client_name && (
                  <p className="text-gray-400 mb-6">{activeVideo.client_name}</p>
                )}

                {/* Watch on Platform Button */}
                <a
                  href={activeVideo.video_url}
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
