'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Shield, 
  TrendingUp, 
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { getSystemConfig, updateSystemConfig } from '@/lib/firebase-admin';

export function ConfigPanel() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const systemConfig = await getSystemConfig();
      setConfig(systemConfig);
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      await updateSystemConfig(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setConfig({
      trendingAlgorithm: {
        viewWeight: 0.4,
        likeWeight: 0.3,
        recencyWeight: 0.3,
        minViews: 1000
      },
      contentModeration: {
        autoFlag: true,
        flagThreshold: 5,
        requireApproval: false
      },
      rateLimiting: {
        votesPerHour: 100,
        reportsPerDay: 10
      }
    });
  };

  const updateConfig = (section: string, key: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Settings className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">System Configuration</h2>
          <p className="text-muted-foreground">Manage trending algorithms and moderation settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={saveConfig} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Save Confirmation */}
      {saved && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Configuration saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending">Trending Algorithm</TabsTrigger>
          <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
          <TabsTrigger value="limits">Rate Limiting</TabsTrigger>
        </TabsList>

        {/* Trending Algorithm Settings */}
        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Trending Score Weights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label>View Count Weight</Label>
                  <div className="px-4">
                    <Slider
                      value={[config.trendingAlgorithm?.viewWeight * 100 || 40]}
                      onValueChange={(value) => updateConfig('trendingAlgorithm', 'viewWeight', value[0] / 100)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0%</span>
                    <span className="font-medium">
                      {((config.trendingAlgorithm?.viewWeight || 0.4) * 100).toFixed(0)}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Like Ratio Weight</Label>
                  <div className="px-4">
                    <Slider
                      value={[config.trendingAlgorithm?.likeWeight * 100 || 30]}
                      onValueChange={(value) => updateConfig('trendingAlgorithm', 'likeWeight', value[0] / 100)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0%</span>
                    <span className="font-medium">
                      {((config.trendingAlgorithm?.likeWeight || 0.3) * 100).toFixed(0)}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Recency Weight</Label>
                  <div className="px-4">
                    <Slider
                      value={[config.trendingAlgorithm?.recencyWeight * 100 || 30]}
                      onValueChange={(value) => updateConfig('trendingAlgorithm', 'recencyWeight', value[0] / 100)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0%</span>
                    <span className="font-medium">
                      {((config.trendingAlgorithm?.recencyWeight || 0.3) * 100).toFixed(0)}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minViews">Minimum Views Threshold</Label>
                <Input
                  id="minViews"
                  type="number"
                  value={config.trendingAlgorithm?.minViews || 1000}
                  onChange={(e) => updateConfig('trendingAlgorithm', 'minViews', parseInt(e.target.value))}
                  className="w-full max-w-xs"
                />
                <p className="text-sm text-muted-foreground">
                  Videos must have at least this many views to be considered trending
                </p>
              </div>

              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  The weights should add up to 100% for optimal results. Current total: {' '}
                  <Badge variant="outline">
                    {(((config.trendingAlgorithm?.viewWeight || 0) + 
                       (config.trendingAlgorithm?.likeWeight || 0) + 
                       (config.trendingAlgorithm?.recencyWeight || 0)) * 100).toFixed(0)}%
                  </Badge>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Moderation Settings */}
        <TabsContent value="moderation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Moderation Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-flag Content</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically flag content when it receives multiple reports
                  </p>
                </div>
                <Switch
                  checked={config.contentModeration?.autoFlag || false}
                  onCheckedChange={(checked) => updateConfig('contentModeration', 'autoFlag', checked)}
                />
              </div>

              <div className="space-y-3">
                <Label>Flag Threshold</Label>
                <div className="px-4">
                  <Slider
                    value={[config.contentModeration?.flagThreshold || 5]}
                    onValueChange={(value) => updateConfig('contentModeration', 'flagThreshold', value[0])}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full max-w-md"
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground max-w-md">
                  <span>1 report</span>
                  <span className="font-medium">
                    {config.contentModeration?.flagThreshold || 5} reports
                  </span>
                  <span>20 reports</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Number of reports needed to automatically flag content
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Require Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Require admin approval before content is published
                  </p>
                </div>
                <Switch
                  checked={config.contentModeration?.requireApproval || false}
                  onCheckedChange={(checked) => updateConfig('contentModeration', 'requireApproval', checked)}
                />
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Enabling "Require Approval" will significantly slow down content publishing 
                  but provides maximum control over content quality.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate Limiting Settings */}
        <TabsContent value="limits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Rate Limiting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="votesPerHour">Votes per Hour</Label>
                  <Input
                    id="votesPerHour"
                    type="number"
                    value={config.rateLimiting?.votesPerHour || 100}
                    onChange={(e) => updateConfig('rateLimiting', 'votesPerHour', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum votes a user can cast per hour
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportsPerDay">Reports per Day</Label>
                  <Input
                    id="reportsPerDay"
                    type="number"
                    value={config.rateLimiting?.reportsPerDay || 10}
                    onChange={(e) => updateConfig('rateLimiting', 'reportsPerDay', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum reports a user can submit per day
                  </p>
                </div>
              </div>

              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  Rate limiting helps prevent spam and abuse. Set limits based on typical user behavior patterns.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="maintenanceMode" />
                  <Label htmlFor="maintenanceMode" className="text-sm">
                    Enable maintenance mode
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  placeholder="We're currently performing maintenance. Please check back soon!"
                  className="resize-none"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}