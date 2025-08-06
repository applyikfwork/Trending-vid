'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Music, Clapperboard, Home, Flame } from 'lucide-react';

const categories = [
  { name: 'all', label: 'All', icon: Home },
  { name: 'shorts', label: 'Shorts', icon: Flame },
  { name: 'music', label: 'Music', icon: Music },
  { name: 'movies', label: 'Movies', icon: Clapperboard },
];

export function CategoryTabs({ currentCategory }: { currentCategory: string }) {
  const searchParams = useSearchParams();

  return (
    <div className="border-b">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
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
                'group inline-flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-all',
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
    </div>
  );
}
