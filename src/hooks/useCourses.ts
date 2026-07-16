import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { Course, Department, PaginatedResponse } from '@/types';

export function useCourses(params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<Course>>({
    queryKey: ['courses', params],
    queryFn: () => coursesApi.list(params).then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCourse(id: number) {
  return useQuery<Course>({
    queryKey: ['course', id],
    queryFn: () => coursesApi.get(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: () => coursesApi.getDepartments().then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => coursesApi.create(data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      coursesApi.update(id, data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  });
}

export function usePartialUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      coursesApi.partialUpdate(id, data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  });
}
