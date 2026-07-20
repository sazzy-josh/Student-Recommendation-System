'use client';

import Link from 'next/link';
import { useEnrollments } from '@/hooks/useEnrollments';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookmarkX, GraduationCap, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function SkeletonCourseCard() {
  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-5 w-20 rounded-full bg-muted" />
      </div>
      <div className="h-5 w-3/4 rounded bg-muted mb-2" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 rounded-full bg-muted" />
        <div className="h-5 w-24 rounded bg-muted" />
      </div>
      <div className="h-3 w-full rounded bg-muted mb-1" />
      <div className="h-3 w-5/6 rounded bg-muted mb-4" />
      <div className="border-t pt-3 flex justify-between">
        <div className="h-7 w-20 rounded-md bg-muted" />
        <div className="h-7 w-24 rounded-md bg-muted" />
      </div>
    </div>
  );
}

export default function MyCoursesPage() {
  const { query, unenrollMutation, enrolledCourseIds } = useEnrollments();
  const { data: enrollments, isLoading, error } = query;

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="h-8 w-48 rounded bg-muted animate-pulse mb-2" />
          <div className="h-4 w-72 rounded bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => <SkeletonCourseCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="text-center py-20 bg-white rounded-xl border shadow-sm">
          <p className="text-muted-foreground mb-4">Failed to load your courses. Please try again.</p>
          <Button onClick={() => query.refetch()} variant="outline" size="sm">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground mt-1">
            {enrollments?.length
              ? `You are enrolled in ${enrollments.length} course${enrollments.length !== 1 ? 's' : ''}.`
              : 'Your enrolled courses will appear here.'}
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">Browse Recommendations</Button>
        </Link>
      </div>

      {!enrollments?.length ? (
        <div className="text-center py-24 bg-white rounded-xl border shadow-sm">
          <GraduationCap className="h-14 w-14 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-semibold mb-1">No courses yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
            Head to your dashboard and click <strong>Enroll</strong> on any recommended course to add it here.
          </p>
          <Link href="/dashboard">
            <Button size="sm">Go to Dashboard</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrollments.map((enrollment) => {
            const course = enrollment.course_detail;
            const isPending = unenrollMutation.isPending && unenrollMutation.variables === course.id;

            return (
              <div
                key={enrollment.id}
                className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs text-muted-foreground font-mono">{course.code}</p>
                  <Badge variant="secondary" className="text-xs">{course.credits} credits</Badge>
                </div>

                <h3 className="text-base font-bold leading-tight mb-1">
                  <Link href={`/catalog/${course.id}`} className="hover:text-primary transition-colors">
                    {course.title}
                  </Link>
                </h3>

                <p className="text-xs text-muted-foreground mb-3">
                  {typeof course.department === 'object' ? course.department.name : course.department}
                </p>

                {course.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {course.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}

                {course.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {course.description}
                  </p>
                )}

                {enrollment.semester && (
                  <p className="text-xs text-muted-foreground mb-3">
                    Semester: <span className="font-medium text-foreground">{enrollment.semester}</span>
                  </p>
                )}

                <div className="mt-auto border-t pt-3 flex items-center justify-between">
                  <button
                    onClick={() => unenrollMutation.mutate(course.id)}
                    disabled={isPending}
                    className={cn(
                      'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors',
                      'text-muted-foreground hover:bg-red-50 hover:text-red-600'
                    )}
                  >
                    {isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <BookmarkX className="h-3.5 w-3.5" />
                    )}
                    Unenroll
                  </button>

                  <Link
                    href={`/catalog/${course.id}`}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Course
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
