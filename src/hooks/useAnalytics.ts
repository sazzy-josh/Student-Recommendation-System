import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { AnalyticsData, EngineSettings } from '@/types';

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
