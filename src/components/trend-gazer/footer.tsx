import Link from "next/link";
import { Youtube, Gem } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              Trend Gazer
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Explore the pulse of YouTube trends worldwide.
            </p>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <p className="text-sm font-semibold">Sources:</p>
            <Link href="https://developers.google.com/youtube/v3" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Youtube className="w-5 h-5" />
              <span className="font-medium">YouTube Data API</span>
            </Link>
            <span className="text-border">|</span>
            <Link href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Gem className="w-5 h-5" />
               <span className="font-medium">Gemini</span>
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground/80 border-t border-border pt-4">
          <p>&copy; {new Date().getFullYear()} Trend Gazer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
