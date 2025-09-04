'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Heart, HeartOff } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { voteForVideo, getUserVote, getVideoStats, addToFavorites, removeFromFavorites } from '@/lib/firebase';
import { AuthModal } from '@/components/auth/auth-modal';
import { cn } from '@/lib/utils';

interface VotingControlsProps {
  videoId: string;
  className?: string;
}

interface VideoStats {
  upVotes: number;
  downVotes: number;
}

export function VotingControls({ videoId, className }: VotingControlsProps) {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [videoStats, setVideoStats] = useState<VideoStats>({ upVotes: 0, downVotes: 0 });
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      // Get video stats
      const stats = await getVideoStats(videoId);
      setVideoStats({ upVotes: stats.upVotes || 0, downVotes: stats.downVotes || 0 });

      // Get user vote if authenticated
      if (user) {
        const vote = await getUserVote(user.uid, videoId);
        setUserVote(vote);
      }
    };

    loadData();
  }, [videoId, user]);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (userVote === voteType) {
      return; // Already voted this way
    }

    setLoading(true);
    
    const result = await voteForVideo(user, videoId, voteType);
    
    if (result.success) {
      setUserVote(voteType);
      
      // Update local stats optimistically
      const newStats = { ...videoStats };
      if (userVote) {
        // User is changing their vote
        if (userVote === 'up') {
          newStats.upVotes = Math.max(0, newStats.upVotes - 1);
        } else {
          newStats.downVotes = Math.max(0, newStats.downVotes - 1);
        }
      }
      
      if (voteType === 'up') {
        newStats.upVotes += 1;
      } else {
        newStats.downVotes += 1;
      }
      
      setVideoStats(newStats);
    }
    
    setLoading(false);
  };

  const handleFavorite = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setLoading(true);
    
    if (isFavorite) {
      const result = await removeFromFavorites(user, videoId);
      if (result.success) {
        setIsFavorite(false);
      }
    } else {
      const result = await addToFavorites(user, videoId);
      if (result.success) {
        setIsFavorite(true);
      }
    }
    
    setLoading(false);
  };

  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant={userVote === 'up' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleVote('up')}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{videoStats.upVotes}</span>
        </Button>
        
        <Button
          variant={userVote === 'down' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleVote('down')}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <ThumbsDown className="h-4 w-4" />
          <span>{videoStats.downVotes}</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleFavorite}
          disabled={loading}
          className="flex items-center gap-1"
        >
          {isFavorite ? (
            <Heart className="h-4 w-4 fill-current text-red-500" />
          ) : (
            <HeartOff className="h-4 w-4" />
          )}
        </Button>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />
    </>
  );
}