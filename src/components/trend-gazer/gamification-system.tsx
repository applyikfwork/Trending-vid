'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserStore, type Badge as UserBadge } from '@/lib/user-store';
import { 
  Trophy, Target, Flame, Zap, Star, Crown, Gem, 
  TrendingUp, Eye, Calendar, Award, Gift, Clock
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  target: number;
  current: number;
  reward: {
    xp: number;
    badge?: UserBadge;
  };
  icon: string;
  timeLimit?: string;
}

const dailyChallenges: Challenge[] = [
  {
    id: 'daily_predictions',
    title: 'Trend Prophet',
    description: 'Make 3 trend predictions today',
    type: 'daily',
    target: 3,
    current: 0,
    reward: { xp: 50 },
    icon: '🔮',
    timeLimit: '23h 45m'
  },
  {
    id: 'daily_watchlist',
    title: 'Curator',
    description: 'Save 5 videos to your watchlist',
    type: 'daily',
    target: 5,
    current: 0,
    reward: { xp: 30 },
    icon: '📚',
    timeLimit: '23h 45m'
  },
  {
    id: 'daily_explore',
    title: 'Explorer',
    description: 'Check trends in 3 different regions',
    type: 'daily',
    target: 3,
    current: 0,
    reward: { xp: 40 },
    icon: '🌍',
    timeLimit: '23h 45m'
  }
];

const weeklyChallenge: Challenge = {
  id: 'weekly_accuracy',
  title: 'Master Predictor',
  description: 'Achieve 80% prediction accuracy this week',
  type: 'weekly',
  target: 80,
  current: 65,
  reward: { 
    xp: 200,
    badge: {
      id: 'master_predictor',
      name: 'Master Predictor',
      description: 'Achieved 80% weekly accuracy',
      icon: '🎯',
      earnedAt: '',
      rarity: 'epic'
    }
  },
  icon: '🎯',
  timeLimit: '4d 12h'
};

const achievements: Challenge[] = [
  {
    id: 'first_viral_prediction',
    title: 'Crystal Ball',
    description: 'Successfully predict your first viral video',
    type: 'achievement',
    target: 1,
    current: 0,
    reward: {
      xp: 100,
      badge: {
        id: 'crystal_ball',
        name: 'Crystal Ball',
        description: 'Predicted first viral video',
        icon: '🔮',
        earnedAt: '',
        rarity: 'rare'
      }
    },
    icon: '🔮'
  },
  {
    id: 'streak_master',
    title: 'Dedication',
    description: 'Maintain a 30-day streak',
    type: 'achievement',
    target: 30,
    current: 0,
    reward: {
      xp: 300,
      badge: {
        id: 'streak_master',
        name: 'Streak Master',
        description: '30-day visiting streak',
        icon: '🔥',
        earnedAt: '',
        rarity: 'legendary'
      }
    },
    icon: '🔥'
  },
  {
    id: 'trend_spotter',
    title: 'Early Bird',
    description: 'Spot 10 videos before they hit 1M views',
    type: 'achievement',
    target: 10,
    current: 0,
    reward: {
      xp: 250,
      badge: {
        id: 'trend_spotter',
        name: 'Trend Spotter',
        description: 'Spotted trends early',
        icon: '🦅',
        earnedAt: '',
        rarity: 'epic'
      }
    },
    icon: '🦅'
  }
];

export function GamificationSystem() {
  const { user, earnBadge, addXP } = useUserStore();
  const [selectedTab, setSelectedTab] = useState('daily');

  const completeChallenge = (challenge: Challenge) => {
    addXP(challenge.reward.xp);
    if (challenge.reward.badge) {
      earnBadge({
        ...challenge.reward.badge,
        earnedAt: new Date().toISOString()
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getChallengeIcon = (type: Challenge['type']) => {
    switch (type) {
      case 'daily': return <Calendar className="w-4 h-4" />;
      case 'weekly': return <Clock className="w-4 h-4" />;
      case 'achievement': return <Trophy className="w-4 h-4" />;
    }
  };

  if (!user) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Trophy className="w-4 h-4" />
          <span className="ml-2 hidden sm:inline">Challenges</span>
          {/* Notification dot for available challenges */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Challenges & Achievements
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{user.streak}</div>
                <p className="text-xs text-muted-foreground">days in a row</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-500" />
                  Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">{user.level}</div>
                <Progress value={(user.xp % 100)} className="mt-1" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" />
                  Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {user.totalPredictions > 0 
                    ? ((user.correctPredictions / user.totalPredictions) * 100).toFixed(0)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">prediction rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Challenge Tabs */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button 
              variant={selectedTab === 'daily' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTab('daily')}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Daily
            </Button>
            <Button 
              variant={selectedTab === 'weekly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTab('weekly')}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Weekly
            </Button>
            <Button 
              variant={selectedTab === 'achievements' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTab('achievements')}
              className="flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Achievements
            </Button>
          </div>

          {/* Daily Challenges */}
          {selectedTab === 'daily' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Daily Challenges</h3>
                <Badge variant="outline">Reset in 23h 45m</Badge>
              </div>
              <div className="grid gap-4">
                {dailyChallenges.map((challenge) => (
                  <Card key={challenge.id} className="relative overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <span className="text-xl">{challenge.icon}</span>
                          {challenge.title}
                        </CardTitle>
                        <Badge variant="outline">+{challenge.reward.xp} XP</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Progress: {challenge.current}/{challenge.target}</span>
                        <span className="text-xs text-muted-foreground">{challenge.timeLimit}</span>
                      </div>
                      <Progress value={(challenge.current / challenge.target) * 100} />
                      {challenge.current >= challenge.target && (
                        <Button 
                          size="sm" 
                          className="mt-2 w-full" 
                          onClick={() => completeChallenge(challenge)}
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          Claim Reward
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Challenge */}
          {selectedTab === 'weekly' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Weekly Challenge</h3>
                <Badge variant="outline">Reset in {weeklyChallenge.timeLimit}</Badge>
              </div>
              <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{weeklyChallenge.icon}</span>
                      {weeklyChallenge.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">+{weeklyChallenge.reward.xp} XP</Badge>
                      {weeklyChallenge.reward.badge && (
                        <Badge 
                          variant="outline" 
                          className={`bg-gradient-to-r ${getRarityColor(weeklyChallenge.reward.badge.rarity)} text-white border-0`}
                        >
                          Epic Badge
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{weeklyChallenge.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span>Progress: {weeklyChallenge.current}%/{weeklyChallenge.target}%</span>
                    <span className="text-sm text-muted-foreground">{weeklyChallenge.timeLimit} remaining</span>
                  </div>
                  <Progress value={weeklyChallenge.current} />
                  {weeklyChallenge.reward.badge && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{weeklyChallenge.reward.badge.icon}</span>
                        <div>
                          <div className="font-medium">{weeklyChallenge.reward.badge.name}</div>
                          <div className="text-sm text-muted-foreground">{weeklyChallenge.reward.badge.description}</div>
                        </div>
                        <Badge 
                          className={`bg-gradient-to-r ${getRarityColor(weeklyChallenge.reward.badge.rarity)} text-white border-0 ml-auto`}
                        >
                          {weeklyChallenge.reward.badge.rarity}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Achievements */}
          {selectedTab === 'achievements' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Lifetime Achievements</h3>
              <div className="grid gap-4">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className="relative overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <span className="text-xl">{achievement.icon}</span>
                          {achievement.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">+{achievement.reward.xp} XP</Badge>
                          {achievement.reward.badge && (
                            <Badge 
                              className={`bg-gradient-to-r ${getRarityColor(achievement.reward.badge.rarity)} text-white border-0`}
                            >
                              {achievement.reward.badge.rarity}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Progress: {achievement.current}/{achievement.target}</span>
                        <span className="text-xs text-green-600">
                          {((achievement.current / achievement.target) * 100).toFixed(0)}% Complete
                        </span>
                      </div>
                      <Progress value={(achievement.current / achievement.target) * 100} />
                      {achievement.reward.badge && (
                        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{achievement.reward.badge.icon}</span>
                            <div>
                              <div className="font-medium">{achievement.reward.badge.name}</div>
                              <div className="text-sm text-muted-foreground">{achievement.reward.badge.description}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}