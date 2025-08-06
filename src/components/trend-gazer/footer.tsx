import Link from "next/link";
import { Youtube, Gem } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2 justify-center md:justify-start">
              <span className="text-2xl">🔥</span>
              Trend Gazer
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Explore the pulse of YouTube trends worldwide.
            </p>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground/80 border-t border-border pt-4">
          <p>&copy; {new Date().getFullYear()} Trend Gazer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
