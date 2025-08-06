import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Footer } from '@/components/trend-gazer/footer';
import { ThemeToggle } from '@/components/trend-gazer/theme-toggle';

function LoadingHeader() {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="py-4 flex justify-between items-center gap-2 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-primary tracking-tighter whitespace-nowrap">
            <span className="mr-2 text-2xl sm:text-3xl">🔥</span>
            Trend Gazer
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-[140px] sm:w-[180px] h-10">
              <Skeleton className="w-full h-full" />
            </div>
            <ThemeToggle />
          </div>
        </div>
        <div className="border-b">
          <div className="-mb-px flex space-x-6" aria-label="Tabs">
            <div className="group inline-flex items-center gap-2 py-3 px-1 border-b-2 border-primary text-primary font-medium text-sm">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="w-12 h-4" />
            </div>
            <div className="group inline-flex items-center gap-2 py-3 px-1 border-b-2 border-transparent text-muted-foreground font-medium text-sm">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="w-12 h-4" />
            </div>
            <div className="group inline-flex items-center gap-2 py-3 px-1 border-b-2 border-transparent text-muted-foreground font-medium text-sm">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="w-12 h-4" />
            </div>
            <div className="group inline-flex items-center gap-2 py-3 px-1 border-b-2 border-transparent text-muted-foreground font-medium text-sm">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="w-12 h-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

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
      <LoadingHeader />
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
