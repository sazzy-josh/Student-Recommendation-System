'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { StudentInteractionLog } from '@/components/admin/StudentInteractionLog';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function AnalyticsPage() {
  const { data, isLoading, error } = useAnalytics();

  if (isLoading) return <div className="p-6"><LoadingSpinner /></div>;
  if (error || !data) return <div className="p-6 text-muted-foreground">Failed to load analytics.</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      <AnalyticsDashboard data={data} />
      <StudentInteractionLog />
    </div>
  );
}
