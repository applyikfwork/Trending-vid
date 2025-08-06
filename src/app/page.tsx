import { Header } from '@/components/trend-gazer/header';
import { VideoGrid } from '@/components/trend-gazer/video-grid';
import { Footer } from '@/components/trend-gazer/footer';
import { getTrendingVideos } from '@/lib/youtube';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { summarizeTrendingVideos } from '@/ai/flows/summarize-trending-videos';
import type { YouTubeVideo } from '@/lib/types';

export const revalidate = 3600; // Revalidate every hour

async function getSummaries(videos: YouTubeVideo[]) {
  if (!videos || videos.length === 0) {
    return {};
  }
  try {
    const summaryInput = {
      videos: videos.map(video => ({
        id: video.id,
        title: video.snippet.title,
        channelName: video.snippet.channelTitle,
        description: video.snippet.description,
        views: video.statistics.viewCount,
        publishedDate: video.snippet.publishedAt,
      })),
    };
    const summaryResult = await summarizeTrendingVideos(summaryInput);

    // Convert array of summaries to a map for easy lookup
    return summaryResult.summaries.reduce((acc, s) => {
      acc[s.videoId] = s.summary;
      return acc;
    }, {} as Record<string, string>);

  } catch (error) {
    console.error('AI summary failed:', error);
    // Return empty object on error so the page can still render
    return {};
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { region?: string };
}) {
  const region = searchParams.region || 'IN';
  
  try {
    const videos = await getTrendingVideos(region);
    const summaries = await getSummaries(videos);

    return (
      <div className="flex flex-col min-h-screen">
        <Header currentRegion={region} />
        <main className="flex-1 container mx-auto px-4 py-8">
          {videos.length > 0 ? (
            <VideoGrid videos={videos} summaries={summaries} />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold tracking-tight">No Trending Videos Found</h2>
              <p className="text-muted-foreground mt-2">
                There are no trending videos for this region at the moment.
                <br />
                Please try selecting a different region.
              </p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return (
      <div className="flex flex-col min-h-screen">
        <Header currentRegion={region} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto bg-transparent border-destructive/50">
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
