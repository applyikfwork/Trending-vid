import { Header } from '@/components/trend-gazer/header';
import { VideoGrid } from '@/components/trend-gazer/video-grid';
import { Footer } from '@/components/trend-gazer/footer';
import { getTrendingVideos, getTrendingShorts } from '@/lib/youtube';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';
import { regions } from '@/lib/regions';

export const revalidate = 300; // Revalidate every 5 minutes

const videoCategoryIds: Record<string, string> = {
  all: '0',
  music: '10',
  movies: '1',
  shorts: 'shorts',
};

const categoryLabels: Record<string, string> = {
  all: 'All',
  music: 'Music',
  movies: 'Movies',
  shorts: 'Shorts',
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { region?: string; category?: string };
}): Promise<Metadata> {
  const region = searchParams.region || 'IN';
  const category = searchParams.category || 'all';

  const regionLabel = regions.find((r) => r.value === region)?.label.split(' ').slice(1).join(' ') || 'India';
  const categoryLabel = categoryLabels[category] || 'All';
  
  let title = `Trending ${categoryLabel} Videos in ${regionLabel}`;
  if (category === 'all') {
    title = `Top Trending YouTube Videos in ${regionLabel}`;
  }
  if (category === 'shorts') {
    title = `Trending YouTube Shorts in ${regionLabel}`;
  }
  
  const description = `Watch the latest and most popular trending YouTube videos in ${regionLabel} for the ${categoryLabel} category. Updated hourly.`;
  const imageUrl = "https://placehold.co/1200x630.png";

  const pageUrl = new URL('https://trending-vid.netlify.app');
  pageUrl.searchParams.set('region', region);
  pageUrl.searchParams.set('category', category);


  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: pageUrl,
      siteName: 'Trend Gazer',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Trending videos on Trend Gazer',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}


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

    const regionLabel = regions.find(r => r.value === region)?.label.split(' ').slice(1).join(' ') || 'India';
    const categoryLabel = categoryLabels[category] || 'All';

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': `Trending ${categoryLabel} Videos in ${regionLabel}`,
      'description': `A list of the top trending YouTube videos for the category ${categoryLabel} in ${regionLabel}.`,
      'itemListElement': videos.map((video, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'VideoObject',
          'name': video.snippet.title,
          'description': video.snippet.description,
          'thumbnailUrl': video.snippet.thumbnails.high.url,
          'uploadDate': video.snippet.publishedAt,
          'duration': video.contentDetails?.duration, 
          'contentUrl': `https://www.youtube.com/watch?v=${video.id}`,
          'embedUrl': `https://www.youtube.com/embed/${video.id}`,
          'interactionStatistic': {
            '@type': 'InteractionCounter',
            'interactionType': { '@type': 'http://schema.org/WatchAction' },
            'userInteractionCount': parseInt(video.statistics.viewCount, 10)
          },
          'author': {
            '@type': 'Person',
            'name': video.snippet.channelTitle
          }
        }
      })),
    };

    return (
      <div className="flex flex-col min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
