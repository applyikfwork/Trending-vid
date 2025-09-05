'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  BarChart3, Globe, TrendingUp, Users, Clock, Zap, 
  Trophy, Target, Brain, Map 
} from 'lucide-react';
import type { YouTubeVideo } from '@/lib/types';

interface AnalyticsDashboardProps {
  videos: YouTubeVideo[];
  currentRegion: string;
}

// Mock data for global trends
const globalTrendData = [
  { country: 'US', trending: 85, viral: 65, color: '#8884d8' },
  { country: 'IN', trending: 92, viral: 78, color: '#82ca9d' },
  { country: 'GB', trending: 76, viral: 58, color: '#ffc658' },
  { country: 'BR', trending: 81, viral: 62, color: '#ff7c7c' },
  { country: 'DE', trending: 73, viral: 55, color: '#8dd1e1' },
  { country: 'JP', trending: 88, viral: 71, color: '#d084d0' },
];

const timeSeriesData = [
  { time: '00:00', viral: 12, trending: 45, declining: 8 },
  { time: '04:00', viral: 18, trending: 52, declining: 12 },
  { time: '08:00', viral: 29, trending: 68, declining: 15 },
  { time: '12:00', viral: 45, trending: 82, declining: 18 },
  { time: '16:00', viral: 52, trending: 95, declining: 22 },
  { time: '20:00', viral: 38, trending: 76, declining: 19 },
];

const categoryData = [
  { name: 'Music', value: 35, color: '#8884d8' },
  { name: 'Gaming', value: 25, color: '#82ca9d' },
  { name: 'Entertainment', value: 20, color: '#ffc658' },
  { name: 'Sports', value: 12, color: '#ff7c7c' },
  { name: 'News', value: 8, color: '#8dd1e1' },
];

export function AnalyticsDashboard({ videos, currentRegion }: AnalyticsDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Calculate analytics from current videos
  const totalViews = videos.reduce((sum, v) => sum + parseInt(v.statistics.viewCount), 0);
  const avgViewsPerVideo = videos.length > 0 ? totalViews / videos.length : 0;
  const topPerformer = videos.length > 0 ? videos.reduce((top, current) => 
    parseInt(current.statistics.viewCount) > parseInt(top.statistics.viewCount) ? current : top
  ) : null;

  // Mock creator leaderboard
  const creatorLeaderboard = videos
    .reduce((acc, video) => {
      const channel = video.snippet.channelTitle;
      if (!acc[channel]) {
        acc[channel] = { name: channel, videos: 0, totalViews: 0 };
      }
      acc[channel].videos++;
      acc[channel].totalViews += parseInt(video.statistics.viewCount);
      return acc;
    }, {} as Record<string, { name: string; videos: number; totalViews: number }>);

  const sortedCreators = Object.values(creatorLeaderboard)
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 10);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Analytics</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Trend Analytics Dashboard
          </DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="creators">Creators</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(totalViews / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Views</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(avgViewsPerVideo / 1000000).toFixed(2)}M
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Per video
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Video</CardTitle>
                  <Trophy className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {topPerformer ? (parseInt(topPerformer.statistics.viewCount) / 1000000).toFixed(1) + 'M' : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {topPerformer?.snippet.title || 'No videos available'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Region</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentRegion}</div>
                  <p className="text-xs text-muted-foreground">
                    {videos.length} trending videos
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Trending Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  24h Trend Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="viral" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="trending" 
                      stackId="1"
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Like Ratio</span>
                    <Badge variant="outline">3.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Comments per 1M views</span>
                    <Badge variant="outline">15.2K</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Share Rate</span>
                    <Badge variant="outline">0.8%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Viral Probability</span>
                    <Badge variant="outline" className="text-green-600">High</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="global" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Global Trending Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={globalTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="trending" fill="#8884d8" name="Trending Score" />
                    <Bar dataKey="viral" fill="#82ca9d" name="Viral Activity" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Leaders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {globalTrendData.slice(0, 5).map((region, index) => (
                      <div key={region.country} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-bold text-muted-foreground">#{index + 1}</div>
                          <div>
                            <div className="font-medium">{region.country}</div>
                            <div className="text-sm text-muted-foreground">
                              {region.trending} trending score
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{region.viral}% viral</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cross-Platform Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>YouTube</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full w-[85%]"></div>
                        </div>
                        <span className="text-sm">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>TikTok</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-black h-2 rounded-full w-[78%]"></div>
                        </div>
                        <span className="text-sm">78%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Instagram</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-pink-500 h-2 rounded-full w-[72%]"></div>
                        </div>
                        <span className="text-sm">72%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Twitter</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full w-[65%]"></div>
                        </div>
                        <span className="text-sm">65%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="creators" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Top Trending Creators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedCreators.map((creator, index) => (
                    <div key={creator.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`text-lg font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{creator.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {creator.videos} videos trending
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{(creator.totalViews / 1000000).toFixed(1)}M</div>
                        <div className="text-xs text-muted-foreground">total views</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI Prediction Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">73%</div>
                    <div className="text-sm text-muted-foreground">Overall Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">89%</div>
                    <div className="text-sm text-muted-foreground">Viral Predictions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">67%</div>
                    <div className="text-sm text-muted-foreground">Trend Predictions</div>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="viral" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Viral Accuracy"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="trending" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      name="Trending Accuracy"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
