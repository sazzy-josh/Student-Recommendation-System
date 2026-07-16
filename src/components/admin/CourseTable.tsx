'use client';

import { Course } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ban, CheckCircle2, Edit, FileUp } from 'lucide-react';

interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onUploadSyllabus: (course: Course) => void;
  onToggleActive: (course: Course) => void;
}

export function CourseTable({ courses, onEdit, onUploadSyllabus, onToggleActive }: CourseTableProps) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Code</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Department</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Credits</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {courses.map((course) => (
            <tr key={course.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{course.code}</td>
              <td className="px-4 py-3 font-medium max-w-xs truncate">{course.title}</td>
              <td className="px-4 py-3 text-muted-foreground">{course.department?.name || '—'}</td>
              <td className="px-4 py-3">{course.credits}</td>
              <td className="px-4 py-3">
                <Badge variant={course.is_active ? 'default' : 'secondary'}>
                  {course.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(course)} title="Edit course">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUploadSyllabus(course)}
                    title="Upload syllabus"
                  >
                    <FileUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleActive(course)}
                    title={course.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {course.is_active ? (
                      <Ban className="h-3 w-3" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!courses.length && (
        <div className="py-12 text-center text-muted-foreground">No courses found.</div>
      )}
    </div>
  );
}
