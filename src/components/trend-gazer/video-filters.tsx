'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SortAsc, Filter, Eye, Clock, TrendingUp, ThumbsUp } from 'lucide-react';

type SortOption = 'trending' | 'views' | 'recent' | 'likes';

type VideoFiltersProps = {
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  viewFilter: string;
  setViewFilter: (filter: string) => void;
  totalVideos: number;
  searchQuery: string;
};

const sortOptions = [
  { value: 'trending', label: 'Trending Score', icon: TrendingUp },
  { value: 'views', label: 'Most Viewed', icon: Eye },
  { value: 'recent', label: 'Most Recent', icon: Clock },
  { value: 'likes', label: 'Most Liked', icon: ThumbsUp },
];

const viewFilterOptions = [
  { value: 'all', label: 'All Videos' },
  { value: '1000000', label: '1M+ views' },
  { value: '10000000', label: '10M+ views' },
  { value: '100000000', label: '100M+ views' },
];

export function VideoFilters({ 
  sortBy, 
  setSortBy, 
  viewFilter, 
  setViewFilter, 
  totalVideos, 
  searchQuery 
}: VideoFiltersProps) {
  const currentSortOption = sortOptions.find(option => option.value === sortBy);
  const CurrentSortIcon = currentSortOption?.icon || SortAsc;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <CurrentSortIcon className="w-4 h-4 text-primary" />
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-[180px] bg-background/60">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={viewFilter} onValueChange={setViewFilter}>
            <SelectTrigger className="w-[140px] bg-background/60">
              <SelectValue placeholder="Filter views" />
            </SelectTrigger>
            <SelectContent>
              {viewFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {searchQuery && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <span className="text-xs">Search:</span>
            <span className="font-semibold">{searchQuery}</span>
          </Badge>
        )}
        <Badge variant="outline" className="flex items-center gap-1">
          <span className="text-xs">{totalVideos} videos</span>
        </Badge>
      </div>
    </div>
  );
}