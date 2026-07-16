import { Recommendation } from '@/types';
import { RecommendationCard } from './RecommendationCard';

interface RecommendationListProps {
  recommendations: Recommendation[];
  onFeedback: (id: number, rating: 1 | -1) => void;
}

export function RecommendationList({ recommendations, onFeedback }: RecommendationListProps) {
  return (
    <div className="grid gap-4">
      {recommendations.map((rec) => (
        <RecommendationCard key={rec.id} recommendation={rec} onFeedback={onFeedback} />
      ))}
    </div>
  );
}
