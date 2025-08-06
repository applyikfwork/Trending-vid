import { Header } from '@/components/trend-gazer/header';
import { VideoGrid } from '@/components/trend-gazer/video-grid';
import { Footer } from '@/components/trend-gazer/footer';
import { getTrendingVideos, getTrendingShorts } from '@/lib/youtube';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

const videoCategoryIds: Record<string, string> = {
  all: '0',
  music: '10',
  movies: '1',
};

export default async function Home({
  searchParams,
}: {
  searchParams: { region?: string; category?: string };
}) {
  const region = searchParams.region || 'IN';
  const category = searchParams.category || 'all';
  const categoryId = videoCategoryIds[category] || '0';

  try {
    const videos =
      category === 'shorts'
        ? await getTrendingShorts(region)
        : await getTrendingVideos(region, categoryId);

    return (
      <div className="flex flex-col min-h-screen">
        <Header currentRegion={region} currentCategory={category} />
        <main className="flex-1 container mx-auto px-4 py-8">
          {videos.length > 0 ? (
            <VideoGrid videos={videos} />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold tracking-tight">No Trending Videos Found</h2>
              <p className="text-muted-foreground mt-2">
                There are no trending videos for this category and region at the moment.
                <br />
                Please try selecting different options.
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
        <Header currentRegion={region} currentCategory={category} />
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
