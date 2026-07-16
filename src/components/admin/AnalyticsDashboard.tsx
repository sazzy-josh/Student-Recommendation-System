'use client';

import { AnalyticsData } from '@/types';
import { MetricCard } from './MetricCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const { summary, accuracy, top_recommended_courses } = data;

  const accuracyChartData = [
    { metric: 'MAE', value: accuracy.mae },
    { metric: 'RMSE', value: accuracy.rmse },
    { metric: 'F1', value: accuracy.f1_score },
    { metric: 'Precision', value: accuracy.precision },
    { metric: 'Recall', value: accuracy.recall },
  ];

  return (
    <div className="space-y-6">
      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard label="Total Students" value={summary.total_students} />
        <MetricCard label="Active (30d)" value={summary.active_students_30d} />
        <MetricCard label="Recommendations" value={summary.total_recommendations_generated.toLocaleString()} />
        <MetricCard
          label="Positive Feedback"
          value={`${Math.round(summary.positive_feedback_rate * 100)}%`}
        />
        <MetricCard
          label="Click-Through Rate"
          value={`${Math.round(summary.average_click_through_rate * 100)}%`}
        />
      </div>

      {/* Accuracy metrics */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Model Accuracy Metrics</h2>
        <div className="grid grid-cols-5 gap-4 mb-6">
          {accuracyChartData.map(({ metric, value }) => (
            <div key={metric} className="text-center">
              <p className="text-2xl font-bold">{value.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{metric}</p>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={accuracyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(221.2 83.2% 53.3%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top recommended courses */}
      {top_recommended_courses?.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Top Recommended Courses</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={top_recommended_courses.slice(0, 10).map((c) => ({
                name: c.title.length > 20 ? `${c.title.slice(0, 20)}…` : c.title,
                count: c.recommendation_count,
              }))}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(221.2 83.2% 53.3%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
