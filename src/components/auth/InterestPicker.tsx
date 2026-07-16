'use client';

import { cn } from '@/lib/utils';

const PREDEFINED_INTERESTS = [
  'Machine Learning', 'Deep Learning', 'Databases', 'Networking',
  'Cloud Computing', 'Cybersecurity', 'Data Science', 'Software Engineering',
  'Mobile Development', 'Web Development', 'Computer Vision',
  'Natural Language Processing', 'Algorithms', 'Operating Systems',
  'Distributed Systems', 'DevOps',
];

interface InterestPickerProps {
  value: string[];
  onChange: (interests: string[]) => void;
}

export function InterestPicker({ value, onChange }: InterestPickerProps) {
  const toggle = (interest: string) => {
    if (value.includes(interest)) {
      onChange(value.filter((i) => i !== interest));
    } else {
      onChange([...value, interest]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {PREDEFINED_INTERESTS.map((interest) => {
        const selected = value.includes(interest);
        return (
          <button
            key={interest}
            type="button"
            onClick={() => toggle(interest)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
              selected
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:border-primary hover:text-primary'
            )}
          >
            {interest}
          </button>
        );
      })}
    </div>
  );
}
