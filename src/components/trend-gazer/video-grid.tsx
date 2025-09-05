
'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { YouTubeVideo } from '@/lib/types';
import { EnhancedVideoCard } from './enhanced-video-card';
import { VideoFilters } from './video-filters';
import { calculateTrendingScore } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

type VideoGridProps = {
  videos: YouTubeVideo[];
  currentRegion?: string;
  currentCategory?: string;
};

type SortOption = 'trending' | 'views' | 'recent' | 'likes';

export function VideoGrid({ videos, currentRegion = 'US', currentCategory = 'all' }: VideoGridProps) {
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [viewFilter, setViewFilter] = useState<string>('all');
  const searchQuery = searchParams.get('search') || '';

  const filteredAndSortedVideos = useMemo(() => {
    let filteredVideos = videos;

    // Search filter
    if (searchQuery) {
      filteredVideos = filteredVideos.filter(video =>
        video.snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.snippet.channelTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.snippet.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // View count filter
    if (viewFilter !== 'all') {
      const viewThreshold = parseInt(viewFilter);
      filteredVideos = filteredVideos.filter(video =>
        parseInt(video.statistics.viewCount) >= viewThreshold
      );
    }

    // Sort videos
    filteredVideos.sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return calculateTrendingScore(b) - calculateTrendingScore(a);
        case 'views':
          return parseInt(b.statistics.viewCount) - parseInt(a.statistics.viewCount);
        case 'recent':
          return new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime();
        case 'likes':
          return parseInt(b.statistics.likeCount || '0') - parseInt(a.statistics.likeCount || '0');
        default:
          return 0;
      }
    });

    return filteredVideos;
  }, [videos, searchQuery, sortBy, viewFilter]);

  if (filteredAndSortedVideos.length === 0 && searchQuery) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">No Results Found</h2>
        <p className="text-muted-foreground text-lg">
          No videos match your search for "{searchQuery}"
        </p>
        <p className="text-muted-foreground mt-2">
          Try different keywords or browse by category
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <VideoFilters 
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewFilter={viewFilter}
        setViewFilter={setViewFilter}
        totalVideos={filteredAndSortedVideos.length}
        searchQuery={searchQuery}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <AnimatePresence>
          {filteredAndSortedVideos.map((video, index) => (
            <motion.div
              key={video.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <EnhancedVideoCard 
                video={video} 
                rank={index + 1} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
