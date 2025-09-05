
'use client';

import { RegionSelector } from './region-selector';
import { CategoryTabs } from './category-tabs';
import { ThemeToggle } from './theme-toggle';
import { SearchBar } from './search-bar';
import { Sparkles, Trophy } from 'lucide-react';
import { AnalyticsDashboard } from './analytics-dashboard';
import { GamificationSystem } from './gamification-system';
import { ContestSystem } from './contest-system';
import { AuthProvider } from '../auth/auth-provider';
import type { YouTubeVideo } from '@/lib/types';
import { UserProfile } from './user-profile';
import { Button } from '../ui/button';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

type HeaderProps = {
  currentRegion: string;
  currentCategory: string;
  videos: YouTubeVideo[];
};

export function Header({
  currentRegion,
  currentCategory,
  videos,
}: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="py-4 flex justify-between items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tighter whitespace-nowrap flex items-center gap-2">
              <span className="text-2xl sm:text-4xl">🔥</span>
              <span className="hidden sm:inline">Trend Gazer</span>
              <span className="sm:hidden">TG</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 animate-pulse" />
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <SearchBar />
            </div>
            <RegionSelector currentRegion={currentRegion} />
            <div className="hidden md:flex items-center gap-2">
              <AnalyticsDashboard videos={videos} currentRegion={currentRegion} />
              <ContestSystem />
              <GamificationSystem />
            </div>
            <AuthProvider />
            <UserProfile />
            <ThemeToggle />
            
            {/* Dropdown for smaller screens */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <AnalyticsDashboard videos={videos} currentRegion={currentRegion} />
                  </DropdownMenuItem>
                   <DropdownMenuItem>
                    <ContestSystem />
                  </DropdownMenuItem>
                   <DropdownMenuItem>
                    <GamificationSystem />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="sm:hidden pb-2">
           <SearchBar />
        </div>
        <div>
          <CategoryTabs currentCategory={currentCategory} />
        </div>
      </div>
    </header>
  );
}
