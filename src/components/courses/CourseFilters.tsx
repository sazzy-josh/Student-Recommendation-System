'use client';

import { Department } from '@/types';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useState } from 'react';

interface CourseFiltersProps {
  departments: Department[];
  selectedDepartment: string;
  selectedLevel: string;
  onDepartmentChange: (value: string) => void;
  onLevelChange: (value: string) => void;
}

export function CourseFilters({
  departments, selectedDepartment, selectedLevel,
  onDepartmentChange, onLevelChange,
}: CourseFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {(selectedDepartment || selectedLevel) && (
          <span className="ml-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
            {(selectedDepartment ? 1 : 0) + (selectedLevel ? 1 : 0)}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-50">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => onDepartmentChange(e.target.value)}
                className="mt-1 w-full text-sm border rounded-md px-2 py-1.5"
              >
                <option value="">All departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Level</label>
              <div className="mt-1 space-y-1">
                {['', 'undergraduate', 'postgraduate'].map((lvl) => (
                  <label key={lvl} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      value={lvl}
                      checked={selectedLevel === lvl}
                      onChange={() => onLevelChange(lvl)}
                      className="accent-primary"
                    />
                    {lvl || 'All levels'}
                  </label>
                ))}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => { onDepartmentChange(''); onLevelChange(''); setOpen(false); }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
