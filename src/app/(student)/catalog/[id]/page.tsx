export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';
import { CourseDetail, CourseActivity } from '@/types';

async function getCourse(id: string): Promise<CourseDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}/`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

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

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  if (!course) notFound();

  const totalActivities =
    course.modules?.reduce((sum, m) => sum + m.activity_count, 0) ?? 0;
  const totalDuration =
    course.modules?.reduce(
      (sum, m) =>
        sum + m.activities.reduce((s, a) => s + (a.duration_minutes ?? 0), 0),
      0
    ) ?? 0;

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
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building className="h-4 w-4" /> {course.department?.name}
              </div>
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

          {/* Module/activity summary pill */}
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
                        {module.activity_count} activities
                      </span>
                    </div>
                    {module.description && (
                      <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                    )}
                  </div>
                  <ul className="divide-y">
                    {module.activities.map((activity) => {
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
