'use client';

import { useEngineSettings, useUpdateSettings, useRetrain } from '@/hooks/useAnalytics';
import { EngineSettingsForm } from '@/components/admin/EngineSettingsForm';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function SettingsPage() {
  const { data, isLoading } = useEngineSettings();
  const updateSettings = useUpdateSettings();
  const retrain = useRetrain();

  if (isLoading) return <div className="p-6"><LoadingSpinner /></div>;

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Engine Settings</h1>
      {data && (
        <EngineSettingsForm
          defaultValues={data}
          onSave={(values) => updateSettings.mutate(values)}
          onRetrain={() => retrain.mutate()}
          isSaving={updateSettings.isPending}
          isRetraining={retrain.isPending}
          retrained={retrain.isSuccess}
        />
      )}
    </div>
  );
}
