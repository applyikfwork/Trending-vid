import { RegionSelector } from './region-selector';

type HeaderProps = {
  currentRegion: string;
};

export function Header({ currentRegion }: HeaderProps) {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary tracking-tighter">
          <span className="mr-2">🔥</span>
          Trend Gazer
        </h1>
        <RegionSelector currentRegion={currentRegion} />
      </div>
    </header>
  );
}
