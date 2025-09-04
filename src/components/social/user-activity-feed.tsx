'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, ThumbsUp, Heart, MessageSquare, UserPlus, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: 'vote' | 'favorite' | 'follow' | 'comment';
  target: string;
  timestamp: Date;
  metadata?: any;
}

export function UserActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadActivityFeed();
    }
  }, [user]);

  const loadActivityFeed = async () => {
    setLoading(true);
    try {
      // Mock activity data for demonstration
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Alex Chen',
          action: 'vote',
          target: 'Trending Gaming Video',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          metadata: { voteType: 'up' }
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Sarah Johnson',
          action: 'favorite',
          target: 'Music Video Compilation',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Mike Rodriguez',
          action: 'follow',
          target: 'TechReviewer',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
          id: '4',
          userId: 'user4',
          userName: 'Emma Wilson',
          action: 'vote',
          target: 'Latest Movie Trailer',
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          metadata: { voteType: 'down' }
        }
      ];
      
      setActivities(mockActivities);
    } catch (error) {
      console.error('Error loading activity feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action: string, metadata?: any) => {
    switch (action) {
      case 'vote':
        return metadata?.voteType === 'up' ? 
          <ThumbsUp className="w-4 h-4 text-green-500" /> : 
          <ThumbsUp className="w-4 h-4 text-red-500 rotate-180" />;
      case 'favorite':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.action) {
      case 'vote':
        const voteType = activity.metadata?.voteType === 'up' ? 'upvoted' : 'downvoted';
        return `${voteType} "${activity.target}"`;
      case 'favorite':
        return `added "${activity.target}" to favorites`;
      case 'follow':
        return `started following ${activity.target}`;
      case 'comment':
        return `commented on "${activity.target}"`;
      default:
        return `performed an action on "${activity.target}"`;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Community Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Sign in to see activity from users you follow
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Community Activity
            <Badge variant="secondary">{activities.length}</Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={loadActivityFeed}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={activity.userAvatar} />
                  <AvatarFallback>
                    {activity.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{activity.userName}</span>
                    {getActivityIcon(activity.action, activity.metadata)}
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getActivityText(activity)}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-4">
              <Button variant="outline" size="sm">
                Load More Activity
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Activity Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Follow other users to see their activity here
            </p>
            <Button variant="outline" size="sm">
              Find Users to Follow
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}