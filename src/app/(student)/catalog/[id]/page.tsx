export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Award, Building } from 'lucide-react';

async function getCourse(id: string) {
  const res = await fetch(`${process.env.API_URL}/courses/${id}/`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  if (!course) notFound();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <span className="text-sm text-muted-foreground font-mono">{course.code}</span>
        <h1 className="text-3xl font-bold mt-1">{course.title}</h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Award className="h-4 w-4" />
          <span>{course.credits} Credits</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Building className="h-4 w-4" />
          <span>{course.department?.name}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span className="capitalize">{course.level}</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-muted-foreground leading-relaxed">{course.description}</p>
      </div>

      {course.syllabus_text_excerpt && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Syllabus Excerpt</h2>
          <p className="text-muted-foreground text-sm bg-muted p-4 rounded-lg">
            {course.syllabus_text_excerpt}
          </p>
        </div>
      )}

      {course.tags?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Topics</h2>
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {course.prerequisite_ids?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Prerequisites</h2>
          <p className="text-sm text-muted-foreground">Course IDs: {course.prerequisite_ids.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
