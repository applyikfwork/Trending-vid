'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, TrendingUp, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { YouTubeVideo } from '@/lib/types';
import { recommendationEngine } from '@/lib/recommendations';
import { VideoCard } from '../trend-gazer/video-card';
import { AuthModal } from '../auth/auth-modal';

interface VideoRecommendationsProps {
  allVideos: YouTubeVideo[];
}

export function VideoRecommendations({ allVideos }: VideoRecommendationsProps) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (user && allVideos.length > 0) {
      generateRecommendations();
    }
  }, [user, allVideos]);

  const generateRecommendations = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    try {
      const recs = await recommendationEngine.generateRecommendations(user.uid, allVideos);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to trending videos
      setRecommendations(allVideos.slice(0, 6));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI-Powered Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="mb-4">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Personalized for You</h3>
              <p className="text-muted-foreground mb-4">
                Sign in to get AI-powered video recommendations based on your voting history and preferences.
              </p>
            </div>
            <Button onClick={() => setShowAuthModal(true)}>
              Sign In for Recommendations
            </Button>
          </CardContent>
        </Card>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Recommended for You
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              AI-Powered
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateRecommendations}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Generating personalized recommendations...</p>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              Based on your voting history, favorites, and viewing patterns
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((video, index) => (
                <div key={video.id} className="relative">
                  <VideoCard video={video} rank={index + 1} />
                  <Badge 
                    className="absolute -top-2 -right-2 bg-purple-500 text-white"
                    variant="default"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
              ))}
            </div>
            
            {/* Recommendation Insights */}
            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Why these recommendations?
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Based on channels you've upvoted</p>
                <p>• Similar to your favorite video content</p>
                <p>• Matching your engagement patterns</p>
                <p>• Trending in your preferred categories</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start Building Your Profile</h3>
            <p className="text-muted-foreground mb-4">
              Vote on some videos and add favorites to get personalized recommendations!
            </p>
            <Button variant="outline" onClick={generateRecommendations}>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}