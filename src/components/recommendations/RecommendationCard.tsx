'use client';

import { Recommendation } from '@/types';
import { cn, getRecommendationTypeColor, formatScore } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, BookmarkCheck, BookmarkPlus, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onFeedback: (id: number, rating: 1 | -1) => void;
  isEnrolled?: boolean;
  onEnroll?: (courseId: number) => void;
  onUnenroll?: (courseId: number) => void;
  enrollPending?: boolean;
}

export function RecommendationCard({
  recommendation,
  onFeedback,
  isEnrolled = false,
  onEnroll,
  onUnenroll,
  enrollPending = false,
}: RecommendationCardProps) {
  const { id, rank, score, recommendation_type, rationale, course, feedback } = recommendation;
  const hasFeedback = feedback != null;
  const userRating = feedback?.rating;

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-1 rounded-full">
          #{rank}
        </span>
        <Badge className={cn('text-xs', getRecommendationTypeColor(recommendation_type))}>
          {recommendation_type}
        </Badge>
      </div>

      <div className="mb-3">
        <p className="text-xs text-muted-foreground font-mono mb-1">{course.code}</p>
        <h3 className="text-lg font-bold leading-tight">
          <Link href={`/catalog/${course.id}`} className="hover:text-primary transition-colors">
            {course.title}
          </Link>
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary">{course.credits} credits</Badge>
          <span className="text-xs text-muted-foreground">{course.department}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Relevance</span>
          <span>{formatScore(score)}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${Math.round(score * 100)}%` }}
          />
        </div>
      </div>

      {rationale && (
        <p className="text-xs italic text-muted-foreground mb-4">{rationale}</p>
      )}

      {course.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      )}

      <div className="mt-auto border-t pt-3 flex items-center gap-2">
        {/* Enroll / Unenroll */}
        <button
          onClick={() => isEnrolled ? onUnenroll?.(course.id) : onEnroll?.(course.id)}
          disabled={enrollPending}
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors mr-auto',
            isEnrolled
              ? 'bg-emerald-50 text-emerald-700 hover:bg-red-50 hover:text-red-600'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          )}
          title={isEnrolled ? 'Unenroll from this course' : 'Enroll in this course'}
        >
          {enrollPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isEnrolled ? (
            <BookmarkCheck className="h-3.5 w-3.5" />
          ) : (
            <BookmarkPlus className="h-3.5 w-3.5" />
          )}
          {isEnrolled ? 'Enrolled' : 'Enroll'}
        </button>

        {/* Feedback */}
        <span className="text-xs text-muted-foreground">Helpful?</span>
        <button
          onClick={() => !hasFeedback && onFeedback(id, 1)}
          disabled={hasFeedback}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            hasFeedback && userRating === 1
              ? 'bg-green-100 text-green-700'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            hasFeedback && userRating !== 1 ? 'opacity-50 cursor-not-allowed' : ''
          )}
          title="Helpful"
        >
          <ThumbsUp className="h-4 w-4" />
        </button>
        <button
          onClick={() => !hasFeedback && onFeedback(id, -1)}
          disabled={hasFeedback}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            hasFeedback && userRating === -1
              ? 'bg-red-100 text-red-700'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            hasFeedback && userRating !== -1 ? 'opacity-50 cursor-not-allowed' : ''
          )}
          title="Not helpful"
        >
          <ThumbsDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
