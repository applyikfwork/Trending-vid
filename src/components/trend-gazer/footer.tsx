import Link from "next/link";
import { Youtube, Gem, Github, Heart, Coffee, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-secondary/80 to-background/50 border-t mt-auto backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2 justify-center md:justify-start">
              <span className="text-3xl">🔥</span>
              Trend Gazer
              <Sparkles className="w-5 h-5 text-purple-500" />
            </h3>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">
              Discover the pulse of YouTube trends worldwide with AI-powered insights and real-time analytics.
            </p>
            <div className="flex gap-2 mt-4 justify-center md:justify-start">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Youtube className="w-3 h-3" />
                <span className="text-xs">YouTube API v3</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Gem className="w-3 h-3" />
                <span className="text-xs">AI Powered</span>
              </Badge>
            </div>
          </div>

          {/* Features Section */}
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>🌍 Global trending videos</li>
              <li>🤖 AI-powered summaries</li>
              <li>📊 Real-time analytics</li>
              <li>🔍 Advanced search & filters</li>
              <li>📱 Responsive design</li>
              <li>⚡ Lightning fast performance</li>
            </ul>
          </div>

          {/* Stats & Info */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-foreground mb-4">Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-end gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live & Updated</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>25+ Regions Supported</p>
                <p>50+ Videos per Category</p>
                <p>Real-time Data Sync</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-6 border-t border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs text-muted-foreground/80">
                &copy; {new Date().getFullYear()} Trend Gazer. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground/80 mt-1 flex items-center justify-center sm:justify-start gap-1">
                Made with <Heart className="w-3 h-3 text-red-500" /> by Jitender Prajapat
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground/80">
              <span className="flex items-center gap-1">
                <Coffee className="w-3 h-3" />
                Powered by Next.js 15
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Enhanced with AI
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
