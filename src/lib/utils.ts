import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from 'date-fns';

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
