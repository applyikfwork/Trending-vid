'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const regions = [
  { value: 'US', label: '🇺🇸 United States' },
  { value: 'IN', label: '🇮🇳 India' },
  { value: 'GB', label: '🇬🇧 Great Britain' },
  { value: 'JP', label: '🇯🇵 Japan' },
  { value: 'KR', label: '🇰🇷 South Korea' },
  { value: 'BR', label: '🇧🇷 Brazil' },
  { value: 'CA', label: '🇨🇦 Canada' },
  { value: 'DE', label: '🇩🇪 Germany' },
  { value: 'FR', label: '🇫🇷 France' },
  { value: 'AU', label: '🇦🇺 Australia' },
];

export function RegionSelector({ currentRegion }: { currentRegion: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRegionChange = (newRegion: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('region', newRegion);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const currentRegionLabel = regions.find(r => r.value === currentRegion)?.label || currentRegion;

  return (
    <Select onValueChange={handleRegionChange} defaultValue={currentRegion}>
      <SelectTrigger className="w-[140px] sm:w-[180px] bg-secondary border-secondary focus:ring-primary">
        <SelectValue placeholder="Select region" >{currentRegionLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {regions.map((region) => (
          <SelectItem key={region.value} value={region.value}>
            {region.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
