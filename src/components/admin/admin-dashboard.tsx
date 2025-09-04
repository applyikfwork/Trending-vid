'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Settings,
  Eye,
  ThumbsUp,
  MessageSquare,
  RefreshCw,
  BarChart3,
  Shield,
  Database
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { isAdmin } from '@/lib/admin';
import { getSystemMetrics, getUserAnalytics, getContentReports, logUserActivity } from '@/lib/firebase-admin';
import { RealtimeMetrics } from './realtime-metrics';
import { UserAnalytics } from './user-analytics';
import { ContentModeration } from './content-moderation';
import { SystemHealth } from './system-health';
import { ConfigPanel } from './config-panel';

export function AdminDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user && isAdmin(user.email)) {
      loadDashboardData();
      logUserActivity(user.uid, 'admin_dashboard_view');
      
      // Set up real-time updates
      const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, analyticsData, reportsData] = await Promise.all([
        getSystemMetrics(),
        getUserAnalytics('7d'),
        getContentReports()
      ]);
      
      setMetrics(metricsData);
      setAnalytics(analyticsData);
      setReports(reportsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAdmin(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              You don't have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading && !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Welcome back, {user.displayName || user.email}
              </p>
            </div>
            <Button onClick={loadDashboardData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.activeUsers || 0} active in last 7 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalVotes || 0}</div>
              <p className="text-xs text-muted-foreground">
                {metrics?.totalUpVotes || 0} up, {metrics?.totalDownVotes || 0} down
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.dailyActivity || 0}</div>
              <p className="text-xs text-muted-foreground">
                Actions in last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Content Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Pending moderation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="health">System Health</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <RealtimeMetrics metrics={metrics} analytics={analytics} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <UserAnalytics analytics={analytics} />
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <ContentModeration reports={reports} onReportUpdate={loadDashboardData} />
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <SystemHealth />
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <ConfigPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}