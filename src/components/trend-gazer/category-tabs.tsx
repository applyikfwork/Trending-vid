
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Music, Clapperboard, Home, Flame, Gamepad2, Tv, Lightbulb, Newspaper } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const categories = [
  { name: 'all', label: 'All', icon: Home },
  { name: 'shorts', label: 'Shorts', icon: Flame },
  { name: 'music', label: 'Music', icon: Music },
  { name: 'movies', label: 'Movies', icon: Clapperboard },
  { name: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { name: 'sports', label: 'Sports', icon: Tv },
  { name: 'tech', label: 'Tech', icon: Lightbulb },
  { name: 'news', label: 'News', icon: Newspaper },
];

export function CategoryTabs({ currentCategory }: { currentCategory: string }) {
  const searchParams = useSearchParams();

  return (
    <div className="relative border-b">
      <ScrollArea className="max-w-full whitespace-nowrap">
        <nav className="flex space-x-6 pb-px" aria-label="Tabs">
          {categories.map((category) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('category', category.name);
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`?${params.toString()}`}
                scroll={false}
                className={cn(
                  'group inline-flex shrink-0 items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-all',
                  currentCategory === category.name
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                <Icon className={cn("w-5 h-5", currentCategory !== category.name && "text-muted-foreground group-hover:text-foreground")} />
                {category.label}
              </Link>
            );
          })}
        </nav>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
