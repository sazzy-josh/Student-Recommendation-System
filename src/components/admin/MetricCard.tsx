interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ label, value, description }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}
