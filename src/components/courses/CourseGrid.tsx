import { Course } from '@/types';
import { CourseCard } from './CourseCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { BookOpen } from 'lucide-react';

export function CourseGrid({ courses }: { courses: Course[] }) {
  if (!courses.length) {
    return <EmptyState icon={BookOpen} title="No courses found" description="Try adjusting your search or filters." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
