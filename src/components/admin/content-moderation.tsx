'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle, Eye, Flag, Search } from 'lucide-react';

interface ContentModerationProps {
  reports: any[];
  onReportUpdate: () => void;
}

export function ContentModeration({ reports, onReportUpdate }: ContentModerationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.videoId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleReportAction = async (reportId: string, action: 'approve' | 'reject') => {
    try {
      // Update report status in database
      // await updateReportStatus(reportId, action === 'approve' ? 'resolved' : 'dismissed');
      onReportUpdate();
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason.toLowerCase()) {
      case 'inappropriate': return 'bg-red-100 text-red-800';
      case 'spam': return 'bg-orange-100 text-orange-800';
      case 'misinformation': return 'bg-purple-100 text-purple-800';
      case 'copyright': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-xl font-semibold">Content Moderation</h2>
          <p className="text-muted-foreground">Review and manage reported content</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {reports.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Dismissed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {reports.filter(r => r.status === 'dismissed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Content Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-8">
              <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">No reports found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report, index) => (
                <div key={report.id || index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status || 'pending'}
                        </Badge>
                        <Badge className={getReasonColor(report.reason)}>
                          {report.reason || 'Unknown'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {report.timestamp?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="font-medium">
                          Video ID: {report.videoId || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Reported by: {report.reportedBy || 'Anonymous'}
                        </p>
                        {report.description && (
                          <p className="text-sm bg-gray-50 p-2 rounded">
                            "{report.description}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Report Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Video ID</label>
                              <p className="text-sm text-muted-foreground">{report.videoId}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Reason</label>
                              <p className="text-sm text-muted-foreground">{report.reason}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Description</label>
                              <p className="text-sm text-muted-foreground">
                                {report.description || 'No description provided'}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Reported By</label>
                              <p className="text-sm text-muted-foreground">{report.reportedBy}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Timestamp</label>
                              <p className="text-sm text-muted-foreground">
                                {report.timestamp?.toDate?.()?.toLocaleString() || 'Unknown'}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {report.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleReportAction(report.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReportAction(report.id, 'reject')}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Moderation Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Moderation Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Approve</strong> reports that violate community guidelines. 
                This will flag the content for review and potential removal.
              </AlertDescription>
            </Alert>
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Dismiss</strong> false reports or content that doesn't 
                violate guidelines. This helps maintain community trust.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}