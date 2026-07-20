'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '@/lib/api';
import { Enrollment } from '@/types';

export function useEnrollments() {
  const queryClient = useQueryClient();

  const query = useQuery<Enrollment[]>({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const res = await studentApi.getEnrollments();
      return res.data;
    },
  });

  const enrollMutation = useMutation({
    mutationFn: (courseId: number) => studentApi.addEnrollment(courseId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['enrollments'] }),
  });

  const unenrollMutation = useMutation({
    mutationFn: (courseId: number) => studentApi.removeEnrollment(courseId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['enrollments'] }),
  });

  const enrolledCourseIds = new Set(query.data?.map((e) => e.course_detail.id) ?? []);

  return { query, enrollMutation, unenrollMutation, enrolledCourseIds };
}
