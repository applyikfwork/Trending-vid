'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useUserStore } from '@/lib/user-store';
import { 
  Trophy, Crown, Star, Target, Users, Calendar, 
  TrendingUp, Zap, Gift, Medal, Award 
} from 'lucide-react';

interface Contest {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'special';
  startDate: string;
  endDate: string;
  participants: number;
  prize: {
    first: string;
    second: string;
    third: string;
  };
  status: 'upcoming' | 'active' | 'ended';
  progress?: number;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  score: number;
  predictions: number;
  accuracy: number;
  badge?: string;
}

const activeContests: Contest[] = [
  {
    id: 'weekly_predictor',
    title: 'Weekly Trend Predictor',
    description: 'Predict which videos will become viral this week. Most accurate predictions win!',
    type: 'weekly',
    startDate: '2025-09-01',
    endDate: '2025-09-08',
    participants: 1247,
    prize: {
      first: '🏆 Legendary Badge + 1000 XP',
      second: '🥈 Epic Badge + 500 XP',
      third: '🥉 Rare Badge + 250 XP'
    },
    status: 'active',
    progress: 65
  },
  {
    id: 'trend_hunter',
    title: 'Trend Hunter Challenge',
    description: 'Find the most trending videos before they explode! Early discovery bonus points.',
    type: 'monthly',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    participants: 3421,
    prize: {
      first: '👑 Crown Badge + 2000 XP',
      second: '🎖️ Hero Badge + 1000 XP',
      third: '⭐ Star Badge + 500 XP'
    },
    status: 'active',
    progress: 23
  },
  {
    id: 'ai_challenger',
    title: 'Beat the AI',
    description: 'Can you predict trends better than our AI? Special challenge for the pros!',
    type: 'special',
    startDate: '2025-09-04',
    endDate: '2025-09-11',
    participants: 892,
    prize: {
      first: '🤖 AI Master Badge + 1500 XP',
      second: '🧠 Genius Badge + 750 XP',
      third: '💡 Smart Badge + 375 XP'
    },
    status: 'active',
    progress: 12
  }
];

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: '1', username: 'TrendMaster3000', avatar: '🎯', score: 9850, predictions: 127, accuracy: 89, badge: '👑' },
  { rank: 2, userId: '2', username: 'ViralSpotter', avatar: '🔍', score: 9234, predictions: 98, accuracy: 92, badge: '🏆' },
  { rank: 3, userId: '3', username: 'PredictionPro', avatar: '🎪', score: 8967, predictions: 156, accuracy: 76, badge: '🥇' },
  { rank: 4, userId: '4', username: 'TrendSeeker', avatar: '🌟', score: 8543, predictions: 89, accuracy: 88, badge: '🎖️' },
  { rank: 5, userId: '5', username: 'ViralHunter', avatar: '🦅', score: 8234, predictions: 134, accuracy: 71, badge: '🏅' },
  { rank: 6, userId: '6', username: 'DataWizard', avatar: '🧙', score: 7891, predictions: 78, accuracy: 94, badge: '⭐' },
  { rank: 7, userId: '7', username: 'TrendNinja', avatar: '🥷', score: 7654, predictions: 145, accuracy: 68, badge: '🎯' },
  { rank: 8, userId: '8', username: 'AlgorithmAce', avatar: '🤖', score: 7432, predictions: 67, accuracy: 91, badge: '💎' },
  { rank: 9, userId: '9', username: 'InsightKing', avatar: '👑', score: 7210, predictions: 123, accuracy: 73, badge: '🔮' },
  { rank: 10, userId: '10', username: 'TrendGuru', avatar: '🧠', score: 6987, predictions: 101, accuracy: 79, badge: '🎪' },
];

export function ContestSystem() {
  const { user } = useUserStore();
  const [selectedTab, setSelectedTab] = useState('contests');

  const getContestStatusColor = (status: Contest['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ended': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return '';
    }
  };

  const getContestTypeIcon = (type: Contest['type']) => {
    switch (type) {
      case 'weekly': return <Calendar className="w-4 h-4" />;
      case 'monthly': return <Trophy className="w-4 h-4" />;
      case 'special': return <Crown className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 2: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
      case 3: return 'text-amber-600 bg-amber-100 dark:bg-amber-900 dark:text-amber-200';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          <span className="hidden sm:inline">Contests</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Trend Prediction Contests & Leaderboards
          </DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contests">Active Contests</TabsTrigger>
            <TabsTrigger value="leaderboard">Global Leaderboard</TabsTrigger>
            <TabsTrigger value="history">Contest History</TabsTrigger>
          </TabsList>

          <TabsContent value="contests" className="space-y-6">
            <div className="grid gap-6">
              {activeContests.map((contest) => (
                <Card key={contest.id} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {getContestTypeIcon(contest.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{contest.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{contest.description}</p>
                        </div>
                      </div>
                      <Badge className={getContestStatusColor(contest.status)}>
                        {contest.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Users className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                        <div className="text-lg font-bold">{contest.participants.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Participants</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Calendar className="w-5 h-5 mx-auto mb-1 text-green-500" />
                        <div className="text-lg font-bold">{new Date(contest.endDate).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">Ends</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Target className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                        <div className="text-lg font-bold">{contest.progress || 0}%</div>
                        <div className="text-xs text-muted-foreground">Progress</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Gift className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                        <div className="text-lg font-bold">3</div>
                        <div className="text-xs text-muted-foreground">Prize Tiers</div>
                      </div>
                    </div>

                    {contest.progress !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Contest Progress</span>
                          <span>{contest.progress}%</span>
                        </div>
                        <Progress value={contest.progress} />
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="font-semibold">Prizes:</h4>
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Medal className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">1st Place:</span>
                          <span>{contest.prize.first}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Medal className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">2nd Place:</span>
                          <span>{contest.prize.second}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Medal className="w-4 h-4 text-amber-600" />
                          <span className="font-medium">3rd Place:</span>
                          <span>{contest.prize.third}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1">
                        <Target className="w-4 h-4 mr-2" />
                        Join Contest
                      </Button>
                      <Button variant="outline">
                        View Rules
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Global Trend Predictors</h3>
              <Badge variant="outline">Updated live</Badge>
            </div>

            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <Card key={entry.userId} className={`${index < 3 ? 'border-2 border-yellow-200 bg-gradient-to-r from-yellow-50/50 to-transparent dark:from-yellow-950/20' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${getRankColor(entry.rank)}`}>
                          #{entry.rank}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{entry.avatar}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{entry.username}</span>
                              {entry.badge && <span className="text-lg">{entry.badge}</span>}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {entry.predictions} predictions • {entry.accuracy}% accuracy
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{entry.score.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {user && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        #{Math.floor(Math.random() * 50) + 11}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{user.avatar}</div>
                        <div>
                          <div className="font-semibold">{user.name} (You)</div>
                          <div className="text-sm text-muted-foreground">
                            {user.totalPredictions} predictions • {user.totalPredictions > 0 ? ((user.correctPredictions / user.totalPredictions) * 100).toFixed(0) : 0}% accuracy
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{user.xp * 2}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Contest History</h3>
              <p className="text-muted-foreground">
                Previous contest results and achievements will appear here as contests conclude.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}