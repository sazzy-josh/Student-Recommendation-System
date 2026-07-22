import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { AnalyticsData, EngineSettings, StudentSummary, StudentInteraction, StudentDetail, AdminEnrollment } from '@/types';

export function useAnalytics() {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: () => adminApi.getAnalytics().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useEngineSettings() {
  return useQuery<EngineSettings>({
    queryKey: ['engine-settings'],
    queryFn: () => adminApi.getSettings().then((r) => r.data),
  });
}

export function useUpdateSettings() {
  return useMutation({
    mutationFn: (data: unknown) => adminApi.updateSettings(data).then((r) => r.data),
  });
}

export function useRetrain() {
  return useMutation({
    mutationFn: () => adminApi.retrain().then((r) => r.data),
  });
}

export function useStudents() {
  return useQuery<StudentSummary[]>({
    queryKey: ['admin-students'],
    queryFn: () => adminApi.getStudents().then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  });
}

export function useStudentInteractions(studentId: number | null) {
  return useQuery<StudentInteraction[]>({
    queryKey: ['student-interactions', studentId],
    queryFn: () => adminApi.getStudentInteractions(studentId!).then((r) => r.data),
    enabled: studentId !== null,
  });
}

export function useStudentDetail(studentId: number | null) {
  return useQuery<StudentDetail>({
    queryKey: ['student-detail', studentId],
    queryFn: () => adminApi.getStudentDetail(studentId!).then((r) => r.data),
    enabled: studentId !== null,
  });
}

export function useStudentEnrollments(studentId: number | null) {
  return useQuery<AdminEnrollment[]>({
    queryKey: ['student-enrollments', studentId],
    queryFn: () => adminApi.getStudentEnrollments(studentId!).then((r) => r.data),
    enabled: studentId !== null,
  });
}
