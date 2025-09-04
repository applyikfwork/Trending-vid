'use client';

import Image from 'next/image';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Eye, ThumbsUp, CalendarDays, Bot, Sparkles, TrendingUp, PlayCircle, Youtube } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { YouTubeVideo } from '@/lib/types';
import { formatViews, formatPublishedDate, calculateTrendingScore } from '@/lib/utils';
import { VideoPlayerDialog } from './video-player-dialog';
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { VotingControls } from '../video/voting-controls';

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
  const trendingScore = calculateTrendingScore(video);

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
        if (!entry.isIntersecting) {
          handleMouseLeave();
        }
      },
      { threshold: 0.2 }
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
      <Dialog>
        <div ref={cardRef}>
            <Card 
              className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 bg-card border-border rounded-xl group"
            >
              <CardHeader 
                className="p-0 cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative aspect-video">
                  {isHovering ? (
                    <iframe
                      className={cn('w-full h-full rounded-t-xl transition-opacity duration-500', isPlayerReady ? 'opacity-100' : 'opacity-0')}
                      src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.id}&modestbranding=1`}
                      title={`Preview of ${video.snippet.title}`}
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      onLoad={onPlayerReady}
                      key={video.id}
                    ></iframe>
                  ) : (
                    <>
                      <Image
                        src={thumbnailUrl}
                        alt={video.snippet.title}
                        width={640}
                        height={480}
                        className="w-full h-auto object-cover aspect-video transition-transform duration-500 group-hover:scale-110 rounded-t-xl"
                        priority={rank <= 4}
                        data-ai-hint="video thumbnail"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl">
                        <PlayCircle className="w-16 h-16 text-white/80 drop-shadow-2xl" />
                      </div>
                    </>
                  )}
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center justify-center backdrop-blur-sm">
                    #{rank}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="destructive" className="absolute top-2 right-2 flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4" />
                          {trendingScore.toFixed(0)}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Trending Score: Based on views, likes & recency.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-1 flex flex-col">
                <CardTitle className="text-base font-bold leading-tight line-clamp-2 mb-2 text-foreground">
                    {video.snippet.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">{video.snippet.channelTitle}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground gap-3">
                  <div className="flex items-center gap-1.5" title="Views">
                    <Eye className="w-4 h-4" />
                    <span className="font-semibold">{formatViews(video.statistics.viewCount)}</span>
                  </div>
                   {video.statistics.likeCount && (
                    <div className="flex items-center gap-1.5" title="Likes">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="font-semibold">{formatViews(video.statistics.likeCount)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5" title="Published date">
                    <CalendarDays className="w-4 h-4" />
                    <span>{formatPublishedDate(video.snippet.publishedAt)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-2 flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2 w-full">
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <PlayCircle /> Watch
                    </Button>
                  </DialogTrigger>
                   {video.summary && (
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm" className="flex-1">
                        <Bot /> Summarize
                      </Button>
                    </DialogTrigger>
                  )}
                </div>
                
                {/* Voting controls */}
                <VotingControls videoId={video.id} className="justify-center" />
              </CardFooter>
            </Card>
        </div>

        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              AI Summary
            </DialogTitle>
            <DialogDescription className="pt-2 text-foreground/90 text-base">
              {video.summary || "No summary available."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
              <Button asChild variant="default" size="sm">
                <Link href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                  <Youtube />
                  Open on YouTube
                </Link>
              </Button>
            </div>
        </DialogContent>
      </Dialog>
    </VideoPlayerDialog>
  );
}
