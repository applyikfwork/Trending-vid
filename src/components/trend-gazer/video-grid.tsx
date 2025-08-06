import type { YouTubeVideo } from '@/lib/types';
import { VideoCard } from './video-card';

type VideoGridProps = {
  videos: YouTubeVideo[];
  summaries: Record<string, string>;
};

export function VideoGrid({ videos, summaries }: VideoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} summary={summaries[video.id]} />
      ))}
    </div>
  );
}
