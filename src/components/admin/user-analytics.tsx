'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, TrendingUp, Clock, Target } from 'lucide-react';

interface UserAnalyticsProps {
  analytics: any;
}

export function UserAnalytics({ analytics }: UserAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('7d');

  const behaviorData = analytics?.topActions?.map(([action, count]: [string, number]) => ({
    behavior: action.replace('_', ' '),
    frequency: count,
    percentage: analytics.totalActivities > 0 ? (count / analytics.totalActivities * 100).toFixed(1) : 0
  })) || [];

  const engagementData = [
    { time: '00:00', engaged: 45, casual: 25 },
    { time: '06:00', engaged: 32, casual: 48 },
    { time: '12:00', engaged: 78, casual: 65 },
    { time: '18:00', engaged: 95, casual: 82 },
    { time: '24:00', engaged: 52, casual: 35 },
  ];

  const userSegments = [
    { 
      name: 'Power Users', 
      count: Math.floor((analytics?.activeUsers || 0) * 0.15),
      description: '15+ actions per day',
      color: 'bg-green-100 text-green-800'
    },
    { 
      name: 'Regular Users', 
      count: Math.floor((analytics?.activeUsers || 0) * 0.45),
      description: '5-14 actions per day',
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      name: 'Casual Users', 
      count: Math.floor((analytics?.activeUsers || 0) * 0.40),
      description: '1-4 actions per day',
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Behavior Analytics</h2>
        <div className="flex gap-2">
          {['1d', '7d', '30d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === '1d' ? '24h' : range === '7d' ? '7 days' : '30 days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.totalActivities || 0} total actions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Avg Actions/User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.avgActionsPerUser?.toFixed(1) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Per active user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.activeUsers && analytics.totalActivities > 0 
                ? ((analytics.activeUsers / analytics.totalActivities) * 100).toFixed(1) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              User participation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Peak Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18:00</div>
            <p className="text-xs text-muted-foreground">
              Most active hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Segments */}
      <Card>
        <CardHeader>
          <CardTitle>User Segments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userSegments.map((segment, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{segment.name}</h3>
                  <Badge className={segment.color}>{segment.count}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{segment.description}</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ 
                      width: `${analytics?.activeUsers > 0 ? (segment.count / analytics.activeUsers) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Behavior Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top User Behaviors</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={behaviorData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="behavior" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="frequency" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="engaged" 
                  stroke="#8884d8" 
                  name="Engaged Users"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="casual" 
                  stroke="#82ca9d" 
                  name="Casual Users"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent User Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics?.activities?.slice(0, 20).map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {activity.userId?.slice(-4) || 'USER'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{activity.action.replace('_', ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.metadata?.videoId ? `Video: ${activity.metadata.videoId.slice(0, 8)}...` : 'System action'}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.timestamp?.toDate?.()?.toLocaleString() || 'Unknown time'}
                </span>
              </div>
            )) || (
              <p className="text-muted-foreground text-center py-8">No activities found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}