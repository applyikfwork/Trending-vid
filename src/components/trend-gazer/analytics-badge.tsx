'use client';

import { TrendingUp, Eye, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

export function AnalyticsBadge() {
  const [stats, setStats] = useState({
    totalViews: '2.1B',
    activeRegions: 25,
    updateTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        updateTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex items-center gap-2">
      <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border-primary/20">
        <TrendingUp className="w-3 h-3" />
        <span className="text-xs font-semibold">Live</span>
      </Badge>
      <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1 text-xs">
        <Eye className="w-3 h-3" />
        {stats.totalViews}
      </Badge>
      <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-1 text-xs">
        <Clock className="w-3 h-3" />
        {stats.updateTime}
      </Badge>
    </div>
  );
}