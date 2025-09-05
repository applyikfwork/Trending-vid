
'use client';

import Image from 'next/image';
import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Eye, ThumbsUp, CalendarDays, Bot, Sparkles, TrendingUp, PlayCircle, 
  Youtube, Heart, Plus, Target, Zap, TrendingDown, Brain, Users, 
  ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { YouTubeVideo } from '@/lib/types';
import { formatViews, formatPublishedDate, calculateTrendingScore } from '@/lib/utils';
import { VideoPlayerDialog } from './video-player-dialog';
import { Button } from '../ui/button';
import { WatchlistButton } from './watchlist-button';
import { PredictionSystem } from './prediction-system';
import { VotingControls } from '../video/voting-controls';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

type VideoCardProps = {
  video: YouTubeVideo;
  rank: number;
};

// Enhanced prediction and sentiment analysis
const getViralPotential = (video: YouTubeVideo) => {
  const views = parseInt(video.statistics.viewCount);
  const likes = parseInt(video.statistics.likeCount || '0');
  const publishedHours = (Date.now() - new Date(video.snippet.publishedAt).getTime()) / (1000 * 60 * 60);
  
  const viewVelocity = views / Math.max(publishedHours, 1);
  const engagementRate = views > 0 ? likes / views : 0;
  
  if (viewVelocity > 100000 && engagementRate > 0.03) return { level: 'high', score: 95, trend: 'up' };
  if (viewVelocity > 50000 && engagementRate > 0.02) return { level: 'medium', score: 75, trend: 'up' };
  if (viewVelocity > 10000) return { level: 'medium', score: 60, trend: 'stable' };
  if (publishedHours > 72) return { level: 'low', score: 30, trend: 'down' };
  return { level: 'low', score: 45, trend: 'stable' };
};

const getSentimentColor = (video: YouTubeVideo) => {
  const likes = parseInt(video.statistics.likeCount || '0');
  const views = parseInt(video.statistics.viewCount);
  const ratio = views > 0 ? likes / views : 0;
  
  if (ratio > 0.04) return 'bg-green-500/10 border-green-200';
  if (ratio > 0.02) return 'bg-blue-500/10 border-blue-200';
  if (ratio > 0.01) return 'bg-yellow-500/10 border-yellow-200';
  return 'bg-red-500/10 border-red-200';
};

const getEngagementPrediction = (video: YouTubeVideo) => {
  const views = parseInt(video.statistics.viewCount);
  const likes = parseInt(video.statistics.likeCount || '0');
  const publishedHours = (Date.now() - new Date(video.snippet.publishedAt).getTime()) / (1000 * 60 * 60);
  
  const hourlyViews = views / Math.max(publishedHours, 1);
  const projectedViews24h = hourlyViews * 24;
  const projectedLikes24h = (likes / Math.max(publishedHours, 1)) * 24;
  
  return {
    views24h: projectedViews24h,
    likes24h: projectedLikes24h,
    growthRate: hourlyViews > 10000 ? 'high' : hourlyViews > 1000 ? 'medium' : 'low'
  };
};

export function EnhancedVideoCard({ video, rank }: VideoCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const [clientReady, setClientReady] = useState(false);
  const [viralPotential, setViralPotential] = useState({ level: 'low', score: 0, trend: 'stable' });
  const [engagementPrediction, setEngagementPrediction] = useState({ views24h: 0, likes24h: 0, growthRate: 'low' });

  const thumbnailUrl = video.snippet.thumbnails.standard?.url || video.snippet.thumbnails.high.url;
  const trendingScore = calculateTrendingScore(video);
  const sentimentClass = getSentimentColor(video);

  useEffect(() => {
    setClientReady(true);
    setViralPotential(getViralPotential(video));
    setEngagementPrediction(getEngagementPrediction(video));
  }, [video]);


  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovering(true);
    }, 500);
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

  const getTrendIcon = () => {
    switch (viralPotential.trend) {
      case 'up': return <ArrowUp className="w-3 h-3 text-green-500" />;
      case 'down': return <ArrowDown className="w-3 h-3 text-red-500" />;
      default: return <Minus className="w-3 h-3 text-yellow-500" />;
    }
  };

  const getViralPotentialColor = () => {
    switch (viralPotential.level) {
      case 'high': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
      default: return 'text-red-600 bg-red-100 dark:bg-red-900';
    }
  };

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
          <Card className={cn(
            "flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 rounded-xl group relative",
            sentimentClass
          )}>
            <CardHeader 
              className="p-0 cursor-pointer relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative aspect-video">
                {/* Trending indicators overlay */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                  <div className="bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                    <span className="text-yellow-400">#</span>{rank}
                  </div>
                  {clientReady && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={cn(
                            "px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
                            getViralPotentialColor()
                          )}>
                            {getTrendIcon()}
                            {viralPotential.score}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Viral Potential: {viralPotential.level} ({viralPotential.score}%)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                {/* Trending score badge */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="destructive" className="absolute top-2 right-2 flex items-center gap-1 z-10">
                        <TrendingUp className="w-3 h-3" />
                        {trendingScore.toFixed(0)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Trending Score: Based on views, engagement & recency</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Video preview or thumbnail */}
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
                      className="w-full h-auto object-cover aspect-video transition-transform duration-500 group-hover:scale-105 rounded-t-xl"
                      priority={rank <= 4}
                      data-ai-hint="video thumbnail"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl">
                      <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-2xl animate-pulse" />
                    </div>
                  </>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 flex-1 flex flex-col space-y-3">
              <CardTitle className="text-base font-bold leading-tight line-clamp-2 text-foreground">
                {video.snippet.title}
              </CardTitle>
              
              <p className="text-sm text-muted-foreground font-medium">{video.snippet.channelTitle}</p>

              {/* Engagement metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  <span className="font-semibold">{formatViews(video.statistics.viewCount)}</span>
                </div>
                {video.statistics.likeCount && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <ThumbsUp className="w-3 h-3" />
                    <span className="font-semibold">{formatViews(video.statistics.likeCount)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarDays className="w-3 h-3" />
                  <span>{formatPublishedDate(video.snippet.publishedAt)}</span>
                </div>
                {clientReady && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Brain className="w-3 h-3" />
                    <span>{engagementPrediction.growthRate}</span>
                  </div>
                )}
              </div>

              {/* AI Predictions */}
              {clientReady && (
                <div className="space-y-2 p-2 bg-muted/30 rounded-lg">
                  <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    24h Predictions
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Views: </span>
                      <span className="font-semibold">{formatViews(engagementPrediction.views24h)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Likes: </span>
                      <span className="font-semibold">{formatViews(engagementPrediction.likes24h)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="p-4 pt-2 flex flex-col gap-2">
              {/* Action buttons */}
              <div className="flex gap-2 w-full mb-2">
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    <PlayCircle className="w-4 h-4" />
                    Watch
                  </Button>
                </DialogTrigger>
                <WatchlistButton video={video} />
                <PredictionSystem video={video} />
              </div>

              {/* Voting controls */}
              <VotingControls videoId={video.id} className="justify-center" />

              {/* AI Summary button */}
              {video.summary && (
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm" className="w-full">
                    <Sparkles className="w-4 h-4" />
                    AI Summary
                  </Button>
                </DialogTrigger>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* AI Summary Dialog */}
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              AI Summary & Insights
            </DialogTitle>
            <DialogDescription className="pt-2 text-foreground/90 text-base">
              {video.summary || "No summary available."}
            </DialogDescription>
          </DialogHeader>
          
          {/* Additional insights */}
          {clientReady && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-bold text-primary">{viralPotential.score}%</div>
                  <div className="text-xs text-muted-foreground">Viral Potential</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{engagementPrediction.growthRate}</div>
                  <div className="text-xs text-muted-foreground">Growth Rate</div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-4 h-4" />
                    YouTube
                  </Link>
                </Button>
                <WatchlistButton video={video} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </VideoPlayerDialog>
  );
}
