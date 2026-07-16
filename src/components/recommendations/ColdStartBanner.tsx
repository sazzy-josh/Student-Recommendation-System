'use client';

import { Info, X } from 'lucide-react';

export function ColdStartBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 text-sm text-blue-800">
        <strong>You&apos;re seeing interest-based suggestions.</strong>{' '}
        Complete more courses or update your profile to unlock peer-based recommendations.
      </div>
      <button onClick={onDismiss} className="text-blue-400 hover:text-blue-600 flex-shrink-0">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
