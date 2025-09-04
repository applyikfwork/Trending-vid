import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from 'date-fns';
import type { YouTubeVideo } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatViews(views: string | number): string {
  const number = Number(views);
  if (isNaN(number)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
}

export function formatPublishedDate(dateString: string): string {
  try {
    return `${formatDistanceToNow(new Date(dateString))} ago`;
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Calculates a "trending score" for a video based on views, likes, and age.
 * This provides a more nuanced metric than just raw view count.
 */
export function calculateTrendingScore(video: YouTubeVideo): number {
  const views = parseInt(video.statistics.viewCount, 10);
  const likes = parseInt(video.statistics.likeCount || '0', 10);
  const publishedDate = new Date(video.snippet.publishedAt);
  const now = new Date();

  // Age in hours
  const ageInHours = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60);

  if (ageInHours <= 0) return views; // Avoid division by zero for very new videos

  // Heavily weight views per hour (view velocity)
  const viewVelocity = views / ageInHours;

  // Factor in engagement (like-to-view ratio)
  const engagementRatio = views > 0 ? likes / views : 0;

  // Combine metrics: View velocity is the primary driver, engagement is a multiplier.
  // The magic numbers are for balancing the score.
  const score = viewVelocity * (1 + engagementRatio * 5);
  
  // Normalize the score to a more reasonable range, e.g., using a logarithmic scale
  // and a multiplier to make the numbers feel substantial.
  return Math.log10(score + 1) * 100;
}
