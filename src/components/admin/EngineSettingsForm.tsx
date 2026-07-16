'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { engineSettingsSchema, EngineSettingsFormData } from '@/lib/schemas';
import { EngineSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, Save } from 'lucide-react';

interface EngineSettingsFormProps {
  defaultValues: EngineSettings;
  onSave: (values: EngineSettingsFormData) => void;
  onRetrain: () => void;
  isSaving: boolean;
  isRetraining: boolean;
  retrained: boolean;
}

export function EngineSettingsForm({
  defaultValues, onSave, onRetrain, isSaving, isRetraining, retrained,
}: EngineSettingsFormProps) {
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm<EngineSettingsFormData>({
    resolver: zodResolver(engineSettingsSchema),
    defaultValues: {
      hybrid_weight: defaultValues.hybrid_weight,
      top_n: defaultValues.top_n,
      cold_start_threshold: defaultValues.cold_start_threshold,
    },
  });

  const hybridWeight = watch('hybrid_weight');
  const cfPct = Math.round(hybridWeight * 100);
  const cbfPct = 100 - cfPct;

  return (
    <form onSubmit={handleSubmit(onSave)} className="bg-white rounded-xl border p-6 space-y-6">
      <div className="space-y-3">
        <Label>
          Hybrid Weight (W)
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            W = {hybridWeight.toFixed(2)} → {cfPct}% peer behaviour, {cbfPct}% course content
          </span>
        </Label>
        <Controller
          name="hybrid_weight"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={field.value}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 (Pure CBF)</span>
                <span>1 (Pure CF)</span>
              </div>
            </div>
          )}
        />
        {errors.hybrid_weight && <p className="text-sm text-destructive">{errors.hybrid_weight.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="top_n">Top N Recommendations (1–20)</Label>
        <Input
          id="top_n"
          type="number"
          min="1"
          max="20"
          {...register('top_n', { valueAsNumber: true })}
        />
        {errors.top_n && <p className="text-sm text-destructive">{errors.top_n.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cold_start_threshold">Cold-Start Threshold (interactions)</Label>
        <Input
          id="cold_start_threshold"
          type="number"
          min="1"
          max="20"
          {...register('cold_start_threshold', { valueAsNumber: true })}
        />
        <p className="text-xs text-muted-foreground">
          Students with fewer than this many interactions get pure CBF recommendations.
        </p>
        {errors.cold_start_threshold && <p className="text-sm text-destructive">{errors.cold_start_threshold.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onRetrain}
          disabled={isRetraining}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRetraining ? 'animate-spin' : ''}`} />
          {isRetraining ? 'Retraining...' : retrained ? 'Retrained!' : 'Re-train Model'}
        </Button>
      </div>
    </form>
  );
}
