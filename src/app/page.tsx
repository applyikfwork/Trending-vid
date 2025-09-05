
import { Header } from '@/components/trend-gazer/header';
import { VideoGrid } from '@/components/trend-gazer/video-grid';
import { Footer } from '@/components/trend-gazer/footer';
import { getTrendingVideos, getTrendingShorts } from '@/lib/youtube';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import type { YouTubeVideo } from '@/lib/types';
import { summarizeTrendingVideos } from '@/ai/flows/summarize-trending-videos';

export const revalidate = 3600; // Revalidate every hour

const videoCategoryIds: Record<string, string> = {
  all: '0',
  music: '10',
  movies: '1',
  shorts: 'shorts', // Special key for shorts
};

async function getVideosWithSummaries(
  videos: YouTubeVideo[]
): Promise<YouTubeVideo[]> {
  if (!videos.length) {
    return [];
  }
  
  // Check if GEMINI_API_KEY is available
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    console.warn('GEMINI_API_KEY not found. Video summaries will be disabled. Add your API key in the Secrets tool.');
    return videos;
  }
  
  try {
    const { summaries } = await summarizeTrendingVideos({
      videos: videos.map((v) => ({
        id: v.id,
        title: v.snippet.title,
        channelName: v.snippet.channelTitle,
        description: v.snippet.description,
        views: v.statistics.viewCount,
        publishedDate: v.snippet.publishedAt,
      })),
    });

    const summaryMap = new Map(summaries.map((s) => [s.videoId, s.summary]));

    return videos.map((video) => ({
      ...video,
      summary: summaryMap.get(video.id),
    }));
  } catch (e) {
    console.error('Failed to get video summaries:', e);
    // Return videos without summaries if AI flow fails
    return videos;
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { region?: string; category?: string };
}) {
  const region = searchParams.region || 'US';
  const category = searchParams.category || 'all';
  const categoryId = videoCategoryIds[category] || '0';

  try {
    const rawVideos =
      category === 'shorts'
        ? await getTrendingShorts(region)
        : await getTrendingVideos(region, categoryId);

    const videos = await getVideosWithSummaries(rawVideos);

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        <Header currentRegion={region} currentCategory={category} videos={videos} />
        <main className="flex-1 container mx-auto px-4 py-8">
          {videos.length > 0 ? (
            <VideoGrid videos={videos} currentRegion={region} currentCategory={category} />
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📺</div>
              <h2 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                No Trending Videos Found
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                There are no trending videos for this category and region at the moment.
              </p>
              <p className="text-muted-foreground mt-2">
                Please try selecting different options or check back later.
              </p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return (
      <div className="flex flex-col min-h-screen">
        <Header currentRegion={region} currentCategory={category} videos={[]} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert
            variant="destructive"
            className="max-w-2xl mx-auto bg-transparent border-destructive/50"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Fetching Videos</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }
}
