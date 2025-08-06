import Image from 'next/image';
import Link from 'next/link';
import { Eye, CalendarDays, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { YouTubeVideo } from '@/lib/types';
import { formatViews, formatPublishedDate } from '@/lib/utils';

type VideoCardProps = {
  video: YouTubeVideo;
  summary?: string | null;
};

export function VideoCard({ video, summary }: VideoCardProps) {
  const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
  const thumbnailUrl = video.snippet.thumbnails.standard?.url || video.snippet.thumbnails.high.url;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={videoUrl} target="_blank" rel="noopener noreferrer" className="relative group block">
          <Image
            src={thumbnailUrl}
            alt={video.snippet.title}
            width={640}
            height={480}
            className="w-full h-auto object-cover aspect-video transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="video thumbnail"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <PlayCircle className="w-16 h-16 text-white/80" />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <CardTitle className="text-base font-bold leading-tight line-clamp-2 mb-2">
          <Link href={videoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            {video.snippet.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-3">{video.snippet.channelTitle}</p>
        
        {summary && (
          <>
            <Separator className="my-3" />
            <div className="space-y-1">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-primary">🤖 AI Highlight</h4>
              <p className="text-sm text-muted-foreground italic line-clamp-3">"{summary}"</p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          <span>{formatViews(video.statistics.viewCount)} views</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>{formatPublishedDate(video.snippet.publishedAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
