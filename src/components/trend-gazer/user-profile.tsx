'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/lib/user-store';
import { User, Trophy, Target, Flame, Star, Calendar, TrendingUp, Eye } from 'lucide-react';

export function UserProfile() {
  const { user, initializeUser, watchlist, predictions } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  if (!user) return null;

  const accuracyRate = user.totalPredictions > 0 
    ? (user.correctPredictions / user.totalPredictions * 100).toFixed(1)
    : 0;

  const xpProgress = (user.xp % 100);
  const nextLevelXP = 100;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {user.avatar}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-semibold">Level {user.level}</div>
            <div className="text-xs text-muted-foreground">{user.xp} XP</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl">
              {user.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">Trend Explorer since {new Date(user.joinDate).toLocaleDateString()}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Level</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.level}</div>
                  <div className="text-xs text-muted-foreground">
                    {xpProgress}/{nextLevelXP} XP to next level
                  </div>
                  <Progress value={xpProgress} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Streak</CardTitle>
                  <Flame className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">{user.streak}</div>
                  <p className="text-xs text-muted-foreground">days in a row</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                  <Target className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{accuracyRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {user.correctPredictions}/{user.totalPredictions} correct
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-lg font-semibold">{predictions.length}</div>
                <div className="text-xs text-muted-foreground">Predictions Made</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Eye className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-lg font-semibold">{watchlist.length}</div>
                <div className="text-xs text-muted-foreground">Videos Saved</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-lg font-semibold">{user.badges.length}</div>
                <div className="text-xs text-muted-foreground">Badges Earned</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <div className="text-lg font-semibold">{user.xp}</div>
                <div className="text-xs text-muted-foreground">Total XP</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="badges">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {user.badges.length > 0 ? user.badges.map((badge) => (
                <Card key={badge.id} className={`border-2 ${
                  badge.rarity === 'legendary' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950' :
                  badge.rarity === 'epic' ? 'border-purple-500 bg-purple-50 dark:bg-purple-950' :
                  badge.rarity === 'rare' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' :
                  'border-gray-300'
                }`}>
                  <CardHeader className="text-center pb-2">
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <CardTitle className="text-sm">{badge.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-center">
                    <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                    <Badge variant={badge.rarity === 'legendary' ? 'default' : 'secondary'}>
                      {badge.rarity}
                    </Badge>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No badges earned yet. Keep exploring trends to unlock achievements!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="watchlist">
            <div className="space-y-4">
              {watchlist.length > 0 ? watchlist.slice(0, 10).map((item) => (
                <div key={item.video.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img 
                    src={item.video.snippet.thumbnails.medium.url} 
                    alt={item.video.snippet.title}
                    className="w-24 h-14 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-2">{item.video.snippet.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.video.snippet.channelTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {item.watched && (
                    <Badge variant="secondary">Watched</Badge>
                  )}
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your watchlist is empty. Start saving interesting videos!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="predictions">
            <div className="space-y-4">
              {predictions.length > 0 ? predictions.slice(0, 10).map((prediction) => (
                <div key={prediction.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{prediction.videoTitle}</h4>
                    <Badge variant={
                      prediction.correct === true ? 'default' :
                      prediction.correct === false ? 'destructive' :
                      'secondary'
                    }>
                      {prediction.correct === true ? 'Correct' :
                       prediction.correct === false ? 'Incorrect' :
                       'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Predicted: {prediction.predictionType}</span>
                    <span>Confidence: {prediction.confidence}%</span>
                    <span>{new Date(prediction.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No predictions made yet. Start predicting trends to build your accuracy score!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}