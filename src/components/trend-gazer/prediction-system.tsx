'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useUserStore } from '@/lib/user-store';
import type { YouTubeVideo } from '@/lib/types';
import { TrendingUp, TrendingDown, Zap, Target, Brain, Users, ThumbsUp, ThumbsDown } from 'lucide-react';
import { calculateTrendingScore } from '@/lib/utils';

interface PredictionSystemProps {
  video: YouTubeVideo;
}

interface CommunityVote {
  id: string;
  videoId: string;
  userId: string;
  voteType: 'viral' | 'trending' | 'declining';
  confidence: number;
  timestamp: string;
}

// Mock community votes data (in real app, this would come from backend)
const mockCommunityVotes: CommunityVote[] = [];

export function PredictionSystem({ video }: PredictionSystemProps) {
  const { addPrediction, user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<'viral' | 'trending' | 'declining'>('viral');
  const [confidence, setConfidence] = useState([75]);
  const [hasVoted, setHasVoted] = useState(false);

  // Calculate AI prediction score
  const trendingScore = calculateTrendingScore(video);
  const views = parseInt(video.statistics.viewCount);
  const likes = parseInt(video.statistics.likeCount || '0');
  const publishedHours = (Date.now() - new Date(video.snippet.publishedAt).getTime()) / (1000 * 60 * 60);
  
  // AI prediction logic
  const getAIPrediction = () => {
    const viewVelocity = views / Math.max(publishedHours, 1);
    const engagementRate = views > 0 ? likes / views : 0;
    
    if (viewVelocity > 50000 && engagementRate > 0.02 && publishedHours < 12) {
      return { type: 'viral', confidence: 85, reason: 'High velocity + recent + strong engagement' };
    } else if (trendingScore > 300 && publishedHours < 48) {
      return { type: 'trending', confidence: 70, reason: 'Strong trending score and recent' };
    } else if (publishedHours > 72 && viewVelocity < 1000) {
      return { type: 'declining', confidence: 60, reason: 'Older video with low velocity' };
    }
    
    return { type: 'trending', confidence: 55, reason: 'Moderate trending potential' };
  };

  const aiPrediction = getAIPrediction();
  
  // Get community votes for this video
  const communityVotes = mockCommunityVotes.filter(v => v.videoId === video.id);
  const avgConfidence = communityVotes.length > 0 
    ? communityVotes.reduce((sum, v) => sum + v.confidence, 0) / communityVotes.length 
    : 0;

  const handleSubmitPrediction = () => {
    if (!user) return;

    addPrediction({
      videoId: video.id,
      videoTitle: video.snippet.title,
      predictionType: selectedPrediction,
      confidence: confidence[0],
    });

    // Add to community votes
    const vote: CommunityVote = {
      id: `vote_${Date.now()}`,
      videoId: video.id,
      userId: user.id,
      voteType: selectedPrediction,
      confidence: confidence[0],
      timestamp: new Date().toISOString(),
    };
    mockCommunityVotes.push(vote);
    
    setHasVoted(true);
    setIsOpen(false);
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'viral': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'trending': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getPredictionColor = (type: string) => {
    switch (type) {
      case 'viral': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'trending': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'declining': return 'bg-red-500/10 text-red-600 border-red-200';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Predict
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Trend Prediction
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Info */}
          <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
            <img 
              src={video.snippet.thumbnails.medium.url} 
              alt={video.snippet.title}
              className="w-24 h-14 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-medium line-clamp-2">{video.snippet.title}</h4>
              <p className="text-sm text-muted-foreground">{video.snippet.channelTitle}</p>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>{(views / 1000000).toFixed(1)}M views</span>
                <span>{publishedHours < 24 ? `${Math.round(publishedHours)}h` : `${Math.round(publishedHours/24)}d`} ago</span>
                <span>Score: {trendingScore.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* AI Prediction */}
          <Card className={`border-2 ${getPredictionColor(aiPrediction.type)}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getPredictionIcon(aiPrediction.type)}
                  <span className="font-semibold capitalize">{aiPrediction.type}</span>
                </div>
                <Badge variant="outline">{aiPrediction.confidence}% confidence</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{aiPrediction.reason}</p>
            </CardContent>
          </Card>

          {/* Community Prediction */}
          {communityVotes.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Community Prediction ({communityVotes.length} votes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span>Average Confidence</span>
                  <Badge variant="outline">{avgConfidence.toFixed(0)}%</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Prediction Interface */}
          {!hasVoted && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Your Prediction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedPrediction === 'viral' ? 'default' : 'outline'}
                    onClick={() => setSelectedPrediction('viral')}
                    className="flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Viral
                  </Button>
                  <Button
                    variant={selectedPrediction === 'trending' ? 'default' : 'outline'}
                    onClick={() => setSelectedPrediction('trending')}
                    className="flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Trending
                  </Button>
                  <Button
                    variant={selectedPrediction === 'declining' ? 'default' : 'outline'}
                    onClick={() => setSelectedPrediction('declining')}
                    className="flex items-center gap-2"
                  >
                    <TrendingDown className="w-4 h-4" />
                    Declining
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confidence: {confidence[0]}%</label>
                  <Slider
                    value={confidence}
                    onValueChange={setConfidence}
                    max={100}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>

                <Button onClick={handleSubmitPrediction} className="w-full">
                  Submit Prediction (+15 XP)
                </Button>
              </CardContent>
            </Card>
          )}

          {hasVoted && (
            <div className="text-center py-4 text-green-600">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Prediction submitted! Check back later to see if you were right.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}