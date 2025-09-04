'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, ThumbsUp, Activity } from 'lucide-react';

interface RealtimeMetricsProps {
  metrics: any;
  analytics: any;
}

export function RealtimeMetrics({ metrics, analytics }: RealtimeMetricsProps) {
  const engagementData = [
    { name: 'Votes', value: metrics?.totalVotes || 0, color: '#8884d8' },
    { name: 'Views', value: metrics?.totalVideos || 0, color: '#82ca9d' },
    { name: 'Users', value: metrics?.totalUsers || 0, color: '#ffc658' },
  ];

  const activityData = analytics?.topActions?.map(([action, count]: [string, number]) => ({
    action: action.replace('_', ' ').toUpperCase(),
    count
  })) || [];

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    activity: Math.floor(Math.random() * 100) + 20
  }));

  return (
    <div className="space-y-6">
      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics?.activities?.slice(0, 10).map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">
                    {activity.action.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.timestamp?.toDate?.()?.toLocaleTimeString() || 'Just now'}
                </span>
              </div>
            )) || (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
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
            <CardTitle>Top User Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="action" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 24-Hour Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>24-Hour Activity Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="activity" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* System Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">User Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">
                  {((metrics?.engagementRate || 0) * 100).toFixed(1)}%
                </span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <Progress value={(metrics?.engagementRate || 0) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Average votes per user
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Users (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">
                  {analytics?.activeUsers || 0}
                </span>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <Progress 
                value={metrics?.totalUsers > 0 ? (analytics?.activeUsers / metrics.totalUsers) * 100 : 0} 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground">
                Of {metrics?.totalUsers || 0} total users
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Vote Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">
                  {metrics?.totalDownVotes > 0 
                    ? (metrics.totalUpVotes / metrics.totalDownVotes).toFixed(1) 
                    : metrics?.totalUpVotes || 0}:1
                </span>
                <ThumbsUp className="w-5 h-5 text-yellow-500" />
              </div>
              <Progress 
                value={metrics?.totalVotes > 0 ? (metrics.totalUpVotes / metrics.totalVotes) * 100 : 0} 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground">
                Up votes to down votes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}