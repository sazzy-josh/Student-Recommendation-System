import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return 'Unknown time';
  }
}

export function formatScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

export function getRecommendationTypeColor(type: string): string {
  switch (type) {
    case 'HYBRID': return 'bg-purple-100 text-purple-800';
    case 'CF': return 'bg-blue-100 text-blue-800';
    case 'CBF': return 'bg-teal-100 text-teal-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
