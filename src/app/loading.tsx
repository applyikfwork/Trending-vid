import { Header } from '@/components/trend-gazer/header';
import { Footer } from '@/components/trend-gazer/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

function VideoCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden bg-secondary border-0">
      <CardHeader className="p-0">
        <Skeleton className="w-full aspect-video" />
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full mt-1" />
        <Skeleton className="h-3 w-5/6 mt-1" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/3" />
      </CardFooter>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* We pass a placeholder region; it will be correct on client-side hydration */}
      <Header currentRegion="IN" currentCategory="all" />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
