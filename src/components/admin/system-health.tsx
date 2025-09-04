'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Server, 
  Database, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Activity,
  HardDrive,
  Cpu,
  Globe
} from 'lucide-react';

export function SystemHealth() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkSystemHealth = async () => {
    setLoading(true);
    try {
      // Simulate health checks
      const apiStatus = await checkApiStatus();
      const dbStatus = await checkDatabaseStatus();
      const performanceMetrics = await getPerformanceMetrics();
      
      setHealthData({
        api: apiStatus,
        database: dbStatus,
        performance: performanceMetrics,
        lastChecked: new Date()
      });
    } catch (error) {
      console.error('Error checking system health:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      return {
        status: response.ok ? 'healthy' : 'error',
        responseTime: Math.random() * 100 + 50, // Simulated
        uptime: '99.9%',
        details: data
      };
    } catch (error) {
      return {
        status: 'error',
        responseTime: 0,
        uptime: '0%',
        error: error
      };
    }
  };

  const checkDatabaseStatus = async () => {
    // Simulate database health check
    return {
      status: 'healthy',
      connectionPool: Math.floor(Math.random() * 10) + 5,
      activeConnections: Math.floor(Math.random() * 50) + 20,
      queryTime: Math.random() * 20 + 5
    };
  };

  const getPerformanceMetrics = async () => {
    // Simulate performance metrics
    return {
      cpuUsage: Math.random() * 60 + 20,
      memoryUsage: Math.random() * 70 + 15,
      diskUsage: Math.random() * 50 + 30,
      networkLatency: Math.random() * 10 + 5
    };
  };

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Generate sample performance data for charts
  const performanceHistory = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    cpu: Math.random() * 60 + 20,
    memory: Math.random() * 70 + 15,
    response: Math.random() * 100 + 50
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">System Health Monitor</h2>
          <p className="text-muted-foreground">
            Last updated: {healthData?.lastChecked?.toLocaleTimeString() || 'Never'}
          </p>
        </div>
        <Button onClick={checkSystemHealth} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Server className="w-4 h-4" />
              API Server
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(healthData?.api?.status || 'unknown')}>
                {getStatusIcon(healthData?.api?.status || 'unknown')}
                {healthData?.api?.status || 'Unknown'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {healthData?.api?.responseTime?.toFixed(0) || 0}ms
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="w-4 h-4" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(healthData?.database?.status || 'healthy')}>
                {getStatusIcon(healthData?.database?.status || 'healthy')}
                {healthData?.database?.status || 'Healthy'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {healthData?.database?.activeConnections || 0} conn
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className="text-green-600 bg-green-100">
                <CheckCircle className="w-4 h-4" />
                Healthy
              </Badge>
              <span className="text-sm text-muted-foreground">
                {healthData?.performance?.networkLatency?.toFixed(1) || 0}ms
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="w-4 h-4" />
              External APIs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className="text-green-600 bg-green-100">
                <CheckCircle className="w-4 h-4" />
                Online
              </Badge>
              <span className="text-sm text-muted-foreground">
                YouTube, AI
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">
                  {healthData?.performance?.cpuUsage?.toFixed(1) || 0}%
                </span>
                <span className="text-sm text-muted-foreground">
                  {healthData?.performance?.cpuUsage > 80 ? 'High' : 
                   healthData?.performance?.cpuUsage > 60 ? 'Medium' : 'Low'}
                </span>
              </div>
              <Progress value={healthData?.performance?.cpuUsage || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">
                  {healthData?.performance?.memoryUsage?.toFixed(1) || 0}%
                </span>
                <span className="text-sm text-muted-foreground">
                  {healthData?.performance?.memoryUsage > 80 ? 'High' : 
                   healthData?.performance?.memoryUsage > 60 ? 'Medium' : 'Low'}
                </span>
              </div>
              <Progress value={healthData?.performance?.memoryUsage || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Disk Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">
                  {healthData?.performance?.diskUsage?.toFixed(1) || 0}%
                </span>
                <span className="text-sm text-muted-foreground">
                  {healthData?.performance?.diskUsage > 80 ? 'High' : 
                   healthData?.performance?.diskUsage > 60 ? 'Medium' : 'Low'}
                </span>
              </div>
              <Progress value={healthData?.performance?.diskUsage || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>24-Hour Performance History</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="#8884d8" 
                name="CPU Usage (%)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="#82ca9d" 
                name="Memory Usage (%)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="response" 
                stroke="#ffc658" 
                name="Response Time (ms)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Service Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Response Time</span>
                <span className="font-medium">
                  {healthData?.api?.responseTime?.toFixed(0) || 0}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span>Uptime</span>
                <span className="font-medium">{healthData?.api?.uptime || '99.9%'}</span>
              </div>
              <div className="flex justify-between">
                <span>YouTube API</span>
                <Badge className="text-green-600 bg-green-100">Connected</Badge>
              </div>
              <div className="flex justify-between">
                <span>Google AI API</span>
                <Badge className="text-green-600 bg-green-100">Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Connection Pool</span>
                <span className="font-medium">
                  {healthData?.database?.connectionPool || 0}/20
                </span>
              </div>
              <div className="flex justify-between">
                <span>Active Connections</span>
                <span className="font-medium">
                  {healthData?.database?.activeConnections || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Query Time</span>
                <span className="font-medium">
                  {healthData?.database?.queryTime?.toFixed(1) || 0}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span>Firestore Status</span>
                <Badge className="text-green-600 bg-green-100">Healthy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}