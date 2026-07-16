import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recommendationsApi } from '@/lib/api';
import { RecommendationsResponse } from '@/types';

const POLL_INTERVAL_MS = 2_000;
const POLL_TIMEOUT_MS = 30_000;

export function useRecommendations() {
  const queryClient = useQueryClient();

  // After a refresh is queued, the Celery task runs asynchronously — poll
  // every 2s (up to 30s) until generated_at changes.
  const [isPolling, setIsPolling] = useState(false);
  const pollStartedAt = useRef(0);
  const generatedAtBeforeRefresh = useRef<string | undefined>(undefined);

  const query = useQuery<RecommendationsResponse>({
    queryKey: ['recommendations'],
    queryFn: () => recommendationsApi.getRecommendations().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    refetchInterval: isPolling ? POLL_INTERVAL_MS : false,
  });

  const generatedAt = query.data?.generated_at;
  useEffect(() => {
    if (!isPolling) return;
    const updated = generatedAt !== generatedAtBeforeRefresh.current;
    const timedOut = Date.now() - pollStartedAt.current > POLL_TIMEOUT_MS;
    if (updated || timedOut) {
      setIsPolling(false);
    }
  }, [isPolling, generatedAt]);

  const refreshMutation = useMutation({
    mutationFn: () => recommendationsApi.refresh().then((r) => r.data),
    onSuccess: () => {
      generatedAtBeforeRefresh.current =
        queryClient.getQueryData<RecommendationsResponse>(['recommendations'])?.generated_at;
      pollStartedAt.current = Date.now();
      setIsPolling(true);
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: ({ id, rating, comment }: { id: number; rating: 1 | -1; comment?: string }) =>
      recommendationsApi.submitFeedback(id, rating, comment).then((r) => r.data),
    onSuccess: (_data, variables) => {
      // Optimistically update the cached recommendations
      queryClient.setQueryData<RecommendationsResponse>(
        ['recommendations'],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            recommendations: old.recommendations.map((rec) =>
              rec.id === variables.id
                ? { ...rec, feedback: { rating: variables.rating } }
                : rec
            ),
          };
        }
      );
    },
  });

  const isRefreshing = refreshMutation.isPending || isPolling;

  return { query, refreshMutation, feedbackMutation, isRefreshing };
}
