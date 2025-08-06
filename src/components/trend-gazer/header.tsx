import { RegionSelector } from './region-selector';
import { CategoryTabs } from './category-tabs';

type HeaderProps = {
  currentRegion: string;
  currentCategory: string;
};

export function Header({ currentRegion, currentCategory }: HeaderProps) {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary tracking-tighter whitespace-nowrap">
            <span className="mr-2 text-3xl">🔥</span>
            Trend Gazer
          </h1>
          <RegionSelector currentRegion={currentRegion} />
        </div>
        <CategoryTabs currentCategory={currentCategory} />
      </div>
    </header>
  );
}
