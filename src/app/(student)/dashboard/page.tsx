'use client';

import { useState } from 'react';
import { useRecommendations } from '@/hooks/useRecommendations';
import { RecommendationList } from '@/components/recommendations/RecommendationList';
import { ColdStartBanner } from '@/components/recommendations/ColdStartBanner';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { query, refreshMutation, feedbackMutation, isRefreshing } = useRecommendations();
  const [coldStartDismissed, setColdStartDismissed] = useState(false);

  const { data, isLoading, error } = query;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Recommendations</h1>
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load recommendations. Please try again.</p>
          <Button onClick={() => query.refetch()} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your Recommendations</h1>
          {data?.generated_at && (
            <p className="text-sm text-muted-foreground mt-1">
              Last updated {formatRelativeTime(data.generated_at)}
            </p>
          )}
        </div>
        <Button
          onClick={() => refreshMutation.mutate()}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {data?.is_cold_start && !coldStartDismissed && (
        <ColdStartBanner onDismiss={() => setColdStartDismissed(true)} />
      )}

      {data?.recommendations && (
        <RecommendationList
          recommendations={data.recommendations}
          onFeedback={(id, rating) => feedbackMutation.mutate({ id, rating })}
        />
      )}

      {data?.recommendations?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No recommendations yet. Update your profile to get started.</p>
        </div>
      )}
    </div>
  );
}
