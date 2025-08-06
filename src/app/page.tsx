import { Header } from '@/components/trend-gazer/header';
import { VideoGrid } from '@/components/trend-gazer/video-grid';
import { Footer } from '@/components/trend-gazer/footer';
import { getTrendingVideos } from '@/lib/youtube';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

export default async function Home({
  searchParams,
}: {
  searchParams: { region?: string };
}) {
  const region = searchParams.region || 'US';
  
  try {
    const videos = await getTrendingVideos(region);

    return (
      <div className="flex flex-col min-h-screen">
        <Header currentRegion={region} />
        <main className="flex-1 container mx-auto px-4 py-8">
          {videos.length > 0 ? (
            <VideoGrid videos={videos} />
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold">No trending videos found.</h2>
              <p className="text-muted-foreground">Try selecting a different region.</p>
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
          <Alert variant="destructive" className="max-w-2xl mx-auto">
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
