
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export function EnhancedLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl">🔥</span>
          <h2 className="text-2xl font-bold">Loading Trending Videos</h2>
          <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
        </div>
        <p className="text-muted-foreground">Fetching the hottest content for you...</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-0">
              <Skeleton className="w-full h-48" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
