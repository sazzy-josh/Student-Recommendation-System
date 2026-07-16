'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, CourseFormData } from '@/lib/schemas';
import { Course, Department } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface CourseFormDialogProps {
  open: boolean;
  course?: Course | null; // null/undefined = create mode
  departments: Department[];
  isSubmitting?: boolean;
  onSubmit: (data: CourseFormData) => void;
  onClose: () => void;
}

export function CourseFormDialog({
  open,
  course,
  departments,
  isSubmitting,
  onSubmit,
  onClose,
}: CourseFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: { tags: [] },
  });

  useEffect(() => {
    if (!open) return;
    reset(
      course
        ? {
            code: course.code,
            title: course.title,
            description: course.description,
            credits: course.credits,
            department_id: course.department?.id,
            level: course.level,
            tags: course.tags || [],
          }
        : { code: '', title: '', description: '', credits: 3, level: '', tags: [] }
    );
  }, [open, course, reset]);

  if (!open) return null;

  const tags = watch('tags') || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{course ? 'Edit Course' : 'Add Course'}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} title="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course code</Label>
              <Input id="code" placeholder="IT801" {...register('code')} />
              {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min={1}
                max={10}
                {...register('credits', { valueAsNumber: true })}
              />
              {errors.credits && <p className="text-sm text-destructive">{errors.credits.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Advanced Machine Learning" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Covers deep learning, ensemble methods..."
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department_id">Department</Label>
              <select
                id="department_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('department_id', { valueAsNumber: true })}
              >
                <option value="">Select...</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.department_id && (
                <p className="text-sm text-destructive">Select a department</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input id="level" placeholder="e.g. 100, 200, postgraduate" {...register('level')} />
              {errors.level && <p className="text-sm text-destructive">{errors.level.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="machine learning, neural networks"
              value={tags.join(', ')}
              onChange={(e) =>
                setValue(
                  'tags',
                  e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : course ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
