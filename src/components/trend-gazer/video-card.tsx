
'use client';

import Image from 'next/image';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Eye, CalendarDays, PlayCircle, Youtube } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { YouTubeVideo } from '@/lib/types';
import { formatViews, formatPublishedDate } from '@/lib/utils';
import { VideoPlayerDialog } from './video-player-dialog';
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DialogTrigger } from '../ui/dialog';

type VideoCardProps = {
  video: YouTubeVideo;
  rank: number;
};

export function VideoCard({ video, rank }: VideoCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const thumbnailUrl = video.snippet.thumbnails.standard?.url || video.snippet.thumbnails.high.url;

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovering(true);
    }, 500); // Delay before showing preview
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setIsHovering(false);
    setIsPlayerReady(false);
  };
  
  const onPlayerReady = useCallback(() => {
    setIsPlayerReady(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the card is not intersecting the viewport, stop the preview.
        if (!entry.isIntersecting) {
          handleMouseLeave();
        }
      },
      { threshold: 0.2 } // Trigger if 20% of the element is visible
    );

    const currentCardRef = cardRef.current;
    if (currentCardRef) {
      observer.observe(currentCardRef);
    }

    return () => {
      if (currentCardRef) {
        observer.unobserve(currentCardRef);
      }
    };
  }, []);

  return (
    <VideoPlayerDialog videoId={video.id} videoTitle={video.snippet.title}>
      <div ref={cardRef}>
          <Card 
            className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-secondary border-0 rounded-xl group"
          >
            <CardHeader 
              className="p-0 cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative aspect-video">
                {isHovering ? (
                  <iframe
                    className={cn('w-full h-full rounded-t-xl transition-opacity duration-300', isPlayerReady ? 'opacity-100' : 'opacity-0')}
                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.id}`}
                    title={`Preview of ${video.snippet.title}`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    onLoad={onPlayerReady}
                    key={video.id} // Add key to force re-render on video change
                  ></iframe>
                ) : (
                  <>
                    <Image
                      src={thumbnailUrl}
                      alt={video.snippet.title}
                      width={640}
                      height={480}
                      className="w-full h-auto object-cover aspect-video transition-transform duration-300 group-hover:scale-105 rounded-t-xl"
                      data-ai-hint="video thumbnail"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl">
                      <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-lg" />
                    </div>
                  </>
                )}
                 <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center justify-center backdrop-blur-sm">
                  #{rank}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
              <CardTitle className="text-base font-semibold leading-tight line-clamp-2 mb-1.5">
                  {video.snippet.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">{video.snippet.channelTitle}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground gap-3">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span className="font-semibold">{formatViews(video.statistics.viewCount)} views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" />
                  <span>{formatPublishedDate(video.snippet.publishedAt)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-2 flex justify-between items-center gap-2">
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <PlayCircle />
                  Watch
                </Button>
              </DialogTrigger>
              <Button asChild variant="secondary" size="sm" className="w-full">
                <Link href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                  <Youtube />
                  YouTube
                </Link>
              </Button>
            </CardFooter>
          </Card>
      </div>
    </VideoPlayerDialog>
  );
}
