'use client';

import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { InterestPicker } from '@/components/auth/InterestPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { PROGRAMS } from '@/lib/constants';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [program, setProgram] = useState('');
  const [level, setLevel] = useState('undergraduate');
  const [gpa, setGpa] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setProgram(profile.program || '');
      setLevel(profile.level || 'undergraduate');
      setGpa(profile.gpa || '');
      setInterests(profile.interests || []);
    }
  }, [profile]);

  if (isLoading) return <div className="p-6"><LoadingSpinner /></div>;

  const handleSave = async () => {
    await updateProfile.mutateAsync({ program, level, gpa: gpa ? parseFloat(gpa) : null, interests });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-xl border p-6 mb-6 space-y-4">
        <h2 className="text-lg font-semibold">Academic Information</h2>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={profile?.email || ''} disabled className="bg-muted" />
        </div>

        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input value={profile?.full_name || ''} disabled className="bg-muted" />
        </div>

        <div className="space-y-2">
          <Label>Program</Label>
          <Select value={program} onChange={(e) => setProgram(e.target.value)}>
            <option value="">— Select your program —</option>
            {PROGRAMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Level</Label>
          <div className="flex gap-4">
            {(['undergraduate', 'postgraduate'] as const).map((lvl) => (
              <label key={lvl} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={lvl}
                  checked={level === lvl}
                  onChange={() => setLevel(lvl)}
                  className="accent-primary"
                />
                <span className="capitalize">{lvl}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>GPA (optional)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            placeholder="e.g. 3.75"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Academic Interests</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Your interests directly affect your course recommendations.
        </p>
        <InterestPicker value={interests} onChange={setInterests} />
      </div>

      <Button
        onClick={handleSave}
        disabled={updateProfile.isPending}
        className="w-full"
      >
        {updateProfile.isPending ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
      </Button>
    </div>
  );
}
