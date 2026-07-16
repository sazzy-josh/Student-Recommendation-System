import Link from 'next/link';
import { Course } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/catalog/${course.id}`}>
      <div className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-mono text-muted-foreground">{course.code}</span>
          <Badge variant="secondary" className="text-xs">
            <Award className="h-3 w-3 mr-1" />
            {course.credits} cr
          </Badge>
        </div>
        <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
        <div className="flex flex-wrap gap-1">
          {course.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
          {course.department && (
            <Badge variant="outline" className="text-xs">{course.department.name}</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
