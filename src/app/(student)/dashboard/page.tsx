'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useProfile } from '@/hooks/useProfile';
import { useEnrollments } from '@/hooks/useEnrollments';
import { RecommendationCard } from '@/components/recommendations/RecommendationCard';
import { ColdStartBanner } from '@/components/recommendations/ColdStartBanner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';
import { studentApi } from '@/lib/api';
import { StudentInteraction } from '@/types';
import { RefreshCw, BookOpen, Star, TrendingUp, Clock, GraduationCap, MousePointerClick } from 'lucide-react';

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function computeImplicitScore(clicks: number, timeSeconds: number): number {
  const clickScore = Math.min(clicks, 50) / 50;
  const timeScore = Math.min(timeSeconds, 1800) / 1800;
  return Math.round((0.3 * clickScore + 0.7 * timeScore) * 1000) / 1000;
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 60 ? 'bg-green-500' : pct >= 30 ? 'bg-yellow-500' : 'bg-gray-400';
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 bg-muted rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">{score.toFixed(3)}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-6 w-8 rounded-full bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>
      <div className="h-3 w-20 rounded bg-muted mb-2" />
      <div className="h-5 w-3/4 rounded bg-muted mb-3" />
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 rounded-full bg-muted" />
        <div className="h-5 w-24 rounded bg-muted" />
      </div>
      <div className="h-2 w-full rounded-full bg-muted mb-1" />
      <div className="h-3 w-12 rounded bg-muted mb-4 ml-auto" />
      <div className="h-3 w-full rounded bg-muted mb-1" />
      <div className="h-3 w-5/6 rounded bg-muted mb-4" />
      <div className="flex gap-1 mb-4">
        <div className="h-5 w-14 rounded-full bg-muted" />
        <div className="h-5 w-14 rounded-full bg-muted" />
      </div>
      <div className="border-t pt-3 flex gap-2">
        <div className="h-4 w-14 rounded bg-muted" />
        <div className="h-7 w-7 rounded-md bg-muted" />
        <div className="h-7 w-7 rounded-md bg-muted" />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | undefined;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-xl border p-4 flex items-center gap-4 shadow-sm">
      <div className={`p-2.5 rounded-lg ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-sm font-semibold truncate leading-tight mt-0.5">
          {value ?? <span className="text-muted-foreground italic">—</span>}
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { query, refreshMutation, feedbackMutation, isRefreshing } = useRecommendations();
  const profileQuery = useProfile();
  const { query: enrollmentsQuery, enrollMutation, unenrollMutation, enrolledCourseIds } = useEnrollments();
  const [coldStartDismissed, setColdStartDismissed] = useState(false);

  const { data: myInteractions } = useQuery<StudentInteraction[]>({
    queryKey: ['my-interactions'],
    queryFn: () => studentApi.getInteractions().then((r) => r.data),
    staleTime: 60_000,
  });

  const { data, isLoading, error } = query;
  const profile = profileQuery.data;

  // Derive first name from full_name
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';
  const recCount = data?.recommendations?.length ?? 0;
  const enrolledCount = enrollmentsQuery.data?.length ?? 0;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 rounded bg-muted animate-pulse mb-2" />
          <div className="h-4 w-96 rounded bg-muted animate-pulse" />
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border p-4 flex items-center gap-4 animate-pulse shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-4 w-28 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
        {/* Cards skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="text-center py-20 bg-white rounded-xl border shadow-sm">
          <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="text-muted-foreground mb-4">Failed to load recommendations. Please try again.</p>
          <Button onClick={() => query.refetch()} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Welcome header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here are your personalised course recommendations based on your profile and interests.
          </p>
        </div>
        <Button
          onClick={() => refreshMutation.mutate()}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="flex-shrink-0"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Star}
          label="Recommendations"
          value={recCount}
          accent="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={GraduationCap}
          label="Enrolled Courses"
          value={enrolledCount}
          accent="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={BookOpen}
          label="Your Programme"
          value={profile?.program}
          accent="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={Clock}
          label="Last Updated"
          value={data?.generated_at ? formatRelativeTime(data.generated_at) : undefined}
          accent="bg-violet-50 text-violet-600"
        />
      </div>

      {/* Cold start banner */}
      {data?.is_cold_start && !coldStartDismissed && (
        <ColdStartBanner onDismiss={() => setColdStartDismissed(true)} />
      )}

      {/* Recommendations grid */}
      {recCount > 0 ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Recommended for You
            </h2>
            {data?.recommendations && (
              <Badge variant="secondary" className="text-xs">
                {recCount} course{recCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data!.recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onFeedback={(id, rating) => feedbackMutation.mutate({ id, rating })}
                isEnrolled={enrolledCourseIds.has(rec.course.id)}
                onEnroll={(courseId) => enrollMutation.mutate(courseId)}
                onUnenroll={(courseId) => unenrollMutation.mutate(courseId)}
                enrollPending={enrollMutation.isPending || unenrollMutation.isPending}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border shadow-sm">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-semibold mb-1">No recommendations yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Update your profile with your interests and completed courses to unlock personalised picks.
          </p>
        </div>
      )}

      {/* My Course Activity */}
      {myInteractions && myInteractions.length > 0 && (
        <div className="mt-8 bg-white rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">My Course Activity</h2>
            <span className="ml-auto text-xs text-muted-foreground">
              Influences your CF recommendations
            </span>
          </div>
          <div className="space-y-3">
            {[...myInteractions]
              .sort((a, b) => {
                if (!a.last_accessed) return 1;
                if (!b.last_accessed) return -1;
                return new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime();
              })
              .slice(0, 8)
              .map((row) => (
                <div key={row.id} className="flex items-center gap-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-xs text-muted-foreground mr-1.5">{row.course_code}</span>
                    <span className="font-medium truncate">{row.course_title}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 text-xs text-muted-foreground">
                    <span>{row.clicks} click{row.clicks !== 1 ? 's' : ''}</span>
                    <span>{formatTime(row.time_spent_seconds)}</span>
                  </div>
                  <div className="w-32 flex-shrink-0">
                    <ScoreBar score={computeImplicitScore(row.clicks, row.time_spent_seconds)} />
                  </div>
                </div>
              ))}
          </div>
          {myInteractions.length > 8 && (
            <p className="text-xs text-muted-foreground mt-3">
              Showing 8 of {myInteractions.length} courses
            </p>
          )}
        </div>
      )}
    </div>
  );
}
