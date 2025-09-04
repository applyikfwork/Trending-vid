'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { VideoCardSkeleton } from './loading-skeleton';
import { EnhancedVideoCard } from './enhanced-video-card';
import type { YouTubeVideo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface InfiniteScrollProps {
  initialVideos: YouTubeVideo[];
  currentRegion: string;
  currentCategory: string;
  searchQuery?: string;
}

export function InfiniteScroll({ 
  initialVideos, 
  currentRegion, 
  currentCategory, 
  searchQuery = '' 
}: InfiniteScrollProps) {
  const [videos, setVideos] = useState(initialVideos);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadMoreVideos = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call - in real app, this would fetch more videos
      // For demo purposes, we'll duplicate existing videos with modified IDs
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const newVideos = initialVideos.slice(0, 20).map((video, index) => ({
        ...video,
        id: `${video.id}_page_${page}_${index}`,
        snippet: {
          ...video.snippet,
          title: `${video.snippet.title} (Page ${page + 1})`
        }
      }));

      setVideos(prev => [...prev, ...newVideos]);
      setPage(prev => prev + 1);

      // Stop loading after 5 pages for demo
      if (page >= 5) {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to load more videos. Please try again.');
      console.error('Error loading more videos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, initialVideos, page]);

  const { elementRef } = useIntersectionObserver({
    onIntersect: loadMoreVideos,
    enabled: !isLoading && hasMore,
  });

  const retryLoad = () => {
    setError(null);
    loadMoreVideos();
  };

  // Reset when search or filters change
  useEffect(() => {
    setVideos(initialVideos);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [initialVideos, currentRegion, currentCategory, searchQuery]);

  const filteredVideos = searchQuery 
    ? videos.filter(video =>
        video.snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.snippet.channelTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.snippet.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : videos;

  return (
    <div className="space-y-8">
      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video, index) => (
          <EnhancedVideoCard 
            key={video.id} 
            video={video} 
            rank={index + 1} 
          />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <VideoCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={retryLoad} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {/* Load More Trigger */}
      <div ref={elementRef} className="h-10" />

      {/* End of Content */}
      {!hasMore && !isLoading && (
        <div className="text-center py-12 border-t border-border/50">
          <div className="text-muted-foreground mb-4">
            🎉 You've reached the end of trending videos!
          </div>
          <p className="text-sm text-muted-foreground">
            Check back later for more trending content or explore different categories.
          </p>
        </div>
      )}

      {/* Loading More Indicator */}
      {isLoading && hasMore && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-muted-foreground">Loading more videos...</span>
        </div>
      )}
    </div>
  );
}