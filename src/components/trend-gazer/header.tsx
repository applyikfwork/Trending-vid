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
    <header className="bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-md border-b border-border/50 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="py-4 flex justify-between items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tighter whitespace-nowrap flex items-center gap-2">
              <span className="text-2xl sm:text-4xl">🔥</span>
              <span>Trend Gazer</span>
              <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <SearchBar />
            <RegionSelector currentRegion={currentRegion} />
            <AnalyticsDashboard videos={videos} currentRegion={currentRegion} />
            <ContestSystem />
            <GamificationSystem />
            <AuthProvider />
            <UserProfile />
            <ThemeToggle />
          </div>
        </div>
        <div>
          <CategoryTabs currentCategory={currentCategory} />
        </div>
      </div>
    </header>
  );
}
