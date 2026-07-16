'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, OnboardingFormData } from '@/lib/schemas';
import { studentApi } from '@/lib/api';
import { InterestPicker } from '@/components/auth/InterestPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { program: '', level: 'undergraduate', interests: [] },
  });

  const interests = watch('interests');

  const onSubmit = async (data: OnboardingFormData) => {
    setIsLoading(true);
    setError('');
    try {
      await studentApi.updateProfile(data);
      router.push('/dashboard');
    } catch {
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
      <p className="text-muted-foreground mb-6">Help us personalise your course recommendations</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="program">Program / Degree</Label>
          <Input id="program" placeholder="e.g. MIT, BSc Computer Science" {...register('program')} />
          {errors.program && <p className="text-sm text-destructive">{errors.program.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Level</Label>
          <div className="flex gap-4">
            {(['undergraduate', 'postgraduate'] as const).map((lvl) => (
              <label key={lvl} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={lvl}
                  {...register('level')}
                  className="accent-primary"
                />
                <span className="capitalize">{lvl}</span>
              </label>
            ))}
          </div>
          {errors.level && <p className="text-sm text-destructive">{errors.level.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Academic Interests</Label>
          <p className="text-sm text-muted-foreground">Select all that apply</p>
          <InterestPicker
            value={interests}
            onChange={(vals) => setValue('interests', vals, { shouldValidate: true })}
          />
          {errors.interests && <p className="text-sm text-destructive">{errors.interests.message}</p>}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Get My Recommendations'}
        </Button>
      </form>
    </div>
  );
}
