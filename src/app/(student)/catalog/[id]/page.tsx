'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { coursesApi } from '@/lib/api';
import { CourseDetail, CourseActivity } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Award,
  Building,
  Clock,
  FileText,
  Link2,
  ClipboardList,
  HelpCircle,
  ChevronLeft,
  AlertCircle,
} from 'lucide-react';

const ACTIVITY_ICONS: Record<CourseActivity['activity_type'], typeof FileText> = {
  page: FileText,
  quiz: HelpCircle,
  assignment: ClipboardList,
  url: Link2,
};

const ACTIVITY_COLORS: Record<CourseActivity['activity_type'], string> = {
  page: 'text-blue-600 bg-blue-50',
  quiz: 'text-purple-600 bg-purple-50',
  assignment: 'text-orange-600 bg-orange-50',
  url: 'text-green-600 bg-green-50',
};

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

function LoadingState() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Skeleton className="h-4 w-32 mb-6" />
      <div className="bg-white rounded-xl border p-6 mb-6">
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-9 w-2/3 mb-4" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border overflow-hidden">
              <div className="px-5 py-4 border-b">
                <Skeleton className="h-5 w-48 mb-1" />
                <Skeleton className="h-3 w-64" />
              </div>
              {[0, 1, 2].map((j) => (
                <div key={j} className="flex items-center gap-3 px-5 py-3 border-b last:border-0">
                  <Skeleton className="h-7 w-7 rounded-md flex-shrink-0" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-5">
            <Skeleton className="h-5 w-32 mb-3" />
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-5/6 mb-1" />
            <Skeleton className="h-3 w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: course, isLoading, error, refetch } = useQuery<CourseDetail>({
    queryKey: ['course', id],
    queryFn: async () => {
      const res = await coursesApi.get(id);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <LoadingState />;

  if (error || !course) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Catalog
        </Link>
        <div className="bg-white rounded-xl border p-10 text-center shadow-sm">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4 opacity-60" />
          <h2 className="text-lg font-semibold mb-2">Course not found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This course may not exist or is temporarily unavailable.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
            <Link href="/catalog">
              <Button size="sm">Browse Catalog</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalActivities =
    course.modules?.reduce((sum, m) => sum + (m.activity_count ?? m.activities?.length ?? 0), 0) ?? 0;
  const totalDuration =
    course.modules?.reduce(
      (sum, m) =>
        sum + (m.activities ?? []).reduce((s, a) => s + (a.duration_minutes ?? 0), 0),
      0
    ) ?? 0;

  const deptName = typeof course.department === 'object' ? course.department?.name : course.department;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs font-mono text-muted-foreground">{course.code}</span>
            <h1 className="text-3xl font-bold mt-1 mb-3">{course.title}</h1>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Award className="h-4 w-4" /> {course.credits} Credits
              </div>
              {deptName && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" /> {deptName}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span className="capitalize">{course.level}</span>
              </div>
              {totalDuration > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> {totalDuration} min
                </div>
              )}
            </div>
          </div>

          {course.modules?.length > 0 && (
            <div className="text-right text-sm">
              <p className="font-semibold">{course.modules.length} modules</p>
              <p className="text-muted-foreground">{totalActivities} activities</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: modules / description */}
        <div className="lg:col-span-2 space-y-4">
          {course.modules?.length > 0 ? (
            <>
              <h2 className="text-lg font-semibold">Course Content</h2>
              {course.modules.map((module) => (
                <div key={module.id} className="bg-white rounded-xl border overflow-hidden">
                  <div className="px-5 py-4 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{module.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {module.activity_count ?? module.activities?.length ?? 0} activities
                      </span>
                    </div>
                    {module.description && (
                      <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                    )}
                  </div>
                  <ul className="divide-y">
                    {(module.activities ?? []).map((activity) => {
                      const Icon = ACTIVITY_ICONS[activity.activity_type];
                      const colorClass = ACTIVITY_COLORS[activity.activity_type];
                      return (
                        <li
                          key={activity.id}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors"
                        >
                          <span className={`p-1.5 rounded-md ${colorClass}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="flex-1 text-sm">{activity.title}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {activity.activity_type}
                            </Badge>
                            {activity.duration_minutes && (
                              <span className="text-xs text-muted-foreground">
                                {activity.duration_minutes}m
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </>
          ) : (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
              {course.syllabus_text_excerpt && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{course.syllabus_text_excerpt}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold mb-3">About this Course</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
          </div>

          {course.tags?.length > 0 && (
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold mb-3">Topics</h3>
              <div className="flex flex-wrap gap-1.5">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {course.prerequisites?.length > 0 && (
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold mb-3">Prerequisites</h3>
              <ul className="space-y-2">
                {course.prerequisites.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/catalog/${p.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      <span className="font-mono text-xs text-muted-foreground mr-1">{p.code}</span>
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
