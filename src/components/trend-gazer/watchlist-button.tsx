'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Check } from 'lucide-react';
import { useUserStore } from '@/lib/user-store';
import type { YouTubeVideo } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WatchlistButtonProps {
  video: YouTubeVideo;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function WatchlistButton({ video, variant = 'outline', size = 'sm' }: WatchlistButtonProps) {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useUserStore();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isInWatchlist = watchlist.some(item => item.video.id === video.id);

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
    
    if (isInWatchlist) {
      removeFromWatchlist(video.id);
    } else {
      addToWatchlist(video);
    }
  };

  return (
    <Button
      variant={isInWatchlist ? 'default' : variant}
      size={size}
      onClick={handleToggle}
      className={cn(
        'transition-all duration-200',
        isAnimating && 'scale-110',
        isInWatchlist && 'bg-red-500 hover:bg-red-600 text-white'
      )}
    >
      {isInWatchlist ? (
        <>
          <Check className="w-4 h-4" />
          Saved
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          Save
        </>
      )}
    </Button>
  );
}