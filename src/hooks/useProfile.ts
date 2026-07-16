import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '@/lib/api';
import { StudentProfile } from '@/types';

export function useProfile() {
  return useQuery<StudentProfile>({
    queryKey: ['profile'],
    queryFn: () => studentApi.getProfile().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => studentApi.updateProfile(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
}
