'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Heart, 
  ThumbsUp, 
  TrendingUp, 
  Trophy, 
  Calendar,
  Eye,
  Star,
  Users,
  Target
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getUserStats, getUserFavorites, getUserVotingHistory, getUserFollowing } from '@/lib/user-stats';

export function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [votingHistory, setVotingHistory] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [userStats, userFavorites, userVotes, userFollowing] = await Promise.all([
        getUserStats(user!.uid),
        getUserFavorites(user!.uid),
        getUserVotingHistory(user!.uid),
        getUserFollowing(user!.uid)
      ]);
      
      setStats(userStats);
      setFavorites(userFavorites);
      setVotingHistory(userVotes);
      setFollowing(userFollowing);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <User className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Please sign in to view your dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.displayName || 'User'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user.metadata.creationTime!).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalVotes || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.upVotes || 0} up, {stats?.downVotes || 0} down
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{favorites.length}</div>
              <p className="text-xs text-muted-foreground">
                Videos saved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Following</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{following.length}</div>
              <p className="text-xs text-muted-foreground">
                Users followed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Influence Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.influenceScore || 0}</div>
              <p className="text-xs text-muted-foreground">
                Community impact
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Engagement Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Vote Activity</span>
                    <span className="text-sm text-muted-foreground">
                      {stats?.totalVotes || 0}/100
                    </span>
                  </div>
                  <Progress value={Math.min((stats?.totalVotes || 0) / 100 * 100, 100)} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Community Engagement</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.min(((stats?.influenceScore || 0) / 1000 * 100), 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={Math.min((stats?.influenceScore || 0) / 1000 * 100, 100)} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Collection Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {favorites.length}/50
                    </span>
                  </div>
                  <Progress value={Math.min(favorites.length / 50 * 100, 100)} />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {votingHistory.slice(0, 10).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <ThumbsUp className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {activity.type === 'up' ? 'Upvoted' : 'Downvoted'} video
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.videoTitle || `Video ${activity.videoId?.slice(0, 8)}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {activity.timestamp?.toDate?.()?.toLocaleDateString() || 'Recent'}
                      </span>
                    </div>
                  ))}
                  
                  {votingHistory.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No activity yet. Start voting on videos to see your history here!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Favorite Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((video, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="aspect-video bg-gray-200 rounded-lg mb-3">
                        {video.thumbnail && (
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>
                      <h3 className="font-medium line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">{video.channel}</p>
                    </div>
                  ))}
                  
                  {favorites.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No favorite videos yet. Heart videos you love to save them here!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Voting History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {votingHistory.map((vote, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={vote.type === 'up' ? 'default' : 'destructive'}>
                          {vote.type === 'up' ? '👍' : '👎'}
                        </Badge>
                        <div>
                          <p className="font-medium">{vote.videoTitle || 'Video'}</p>
                          <p className="text-sm text-muted-foreground">
                            {vote.timestamp?.toDate?.()?.toLocaleString() || 'Unknown time'}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Video
                      </Button>
                    </div>
                  ))}
                  
                  {votingHistory.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No voting history found. Start voting on videos!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Following</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {following.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.totalVotes || 0} votes • {user.followers || 0} followers
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Unfollow
                      </Button>
                    </div>
                  ))}
                  
                  {following.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        You're not following anyone yet. Follow other users to see their activity!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}