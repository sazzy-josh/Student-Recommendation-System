'use client';

import { useCallback, useState } from 'react';
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  usePartialUpdateCourse,
  useDepartments,
} from '@/hooks/useCourses';
import { CourseTable } from '@/components/admin/CourseTable';
import { CourseFormDialog } from '@/components/admin/CourseFormDialog';
import { SyllabusUpload } from '@/components/courses/SyllabusUpload';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Toast } from '@/components/shared/Toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Course } from '@/types';
import { CourseFormData } from '@/lib/schemas';

export default function AdminCoursesPage() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [syllabusCourse, setSyllabusCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { data, isLoading } = useCourses(search ? { search } : {});
  const { data: departments } = useDepartments();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const partialUpdateCourse = usePartialUpdateCourse();

  const dismissToast = useCallback(() => setToast(null), []);

  const openCreate = () => {
    setEditingCourse(null);
    setFormOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setFormOpen(true);
  };

  const handleSubmit = (formData: CourseFormData) => {
    const onSuccess = () => setFormOpen(false);
    if (editingCourse) {
      updateCourse.mutate({ id: editingCourse.id, data: formData }, { onSuccess });
    } else {
      createCourse.mutate(formData, { onSuccess });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingCourse) return;
    partialUpdateCourse.mutate(
      { id: deletingCourse.id, data: { is_active: false } },
      {
        onSuccess: () => {
          setToast(`"${deletingCourse.title}" has been removed.`);
          setDeletingCourse(null);
        },
      }
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <CourseTable
          courses={data?.results || []}
          onEdit={openEdit}
          onUploadSyllabus={setSyllabusCourse}
          onToggleActive={(course) =>
            partialUpdateCourse.mutate({ id: course.id, data: { is_active: !course.is_active } })
          }
          onDelete={setDeletingCourse}
        />
      )}

      <CourseFormDialog
        open={formOpen}
        course={editingCourse}
        departments={departments || []}
        isSubmitting={createCourse.isPending || updateCourse.isPending}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />

      <SyllabusUpload
        open={!!syllabusCourse}
        course={syllabusCourse}
        onClose={() => setSyllabusCourse(null)}
      />

      <ConfirmDialog
        open={!!deletingCourse}
        title="Delete course?"
        description={`"${deletingCourse?.title}" will be deactivated and removed from recommendations. This can be re-activated later.`}
        confirmLabel="Delete"
        isLoading={partialUpdateCourse.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingCourse(null)}
      />

      {toast && <Toast message={toast} onClose={dismissToast} />}
    </div>
  );
}
