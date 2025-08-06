import Image from 'next/image';
import Link from 'next/link';
import { Eye, CalendarDays, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { YouTubeVideo } from '@/lib/types';
import { formatViews, formatPublishedDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type VideoCardProps = {
  video: YouTubeVideo;
  summary?: string | null;
};

export function VideoCard({ video, summary }: VideoCardProps) {
  const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
  const thumbnailUrl = video.snippet.thumbnails.standard?.url || video.snippet.thumbnails.high.url;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-secondary border-0 rounded-xl">
      <CardHeader className="p-0">
        <Link href={videoUrl} target="_blank" rel="noopener noreferrer" className="relative group block">
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
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <CardTitle className="text-base font-semibold leading-tight line-clamp-2 mb-1.5">
          <Link href={videoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            {video.snippet.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-4">{video.snippet.channelTitle}</p>
        
        <div className="flex-grow" />

        {summary && (
            <div className="space-y-2 mt-auto bg-black/20 p-3 rounded-lg">
              <Badge variant="destructive" className="text-xs font-bold tracking-wider uppercase bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                🤖 AI Highlight
              </Badge>
              <p className="text-sm text-muted-foreground italic line-clamp-3">"{summary}"</p>
            </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Eye className="w-4 h-4" />
          <span className="font-semibold">{formatViews(video.statistics.viewCount)} views</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4" />
          <span>{formatPublishedDate(video.snippet.publishedAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
