'use client';

import { useState } from 'react';
import { useStudents } from '@/hooks/useAnalytics';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Search, ChevronRight, Users } from 'lucide-react';
import { StudentSummary } from '@/types';

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const { data: students, isLoading } = useStudents();
  const router = useRouter();

  const filtered = (students ?? []).filter((s) =>
    !search ||
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.program.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          {students && (
            <p className="text-sm text-muted-foreground mt-1">
              {students.length} registered student{students.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email or programme..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-white">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
          <p className="text-muted-foreground text-sm">
            {search ? 'No students match your search.' : 'No students registered yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Programme</th>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium text-right">Interactions</th>
                <th className="px-4 py-3 font-medium text-right">Recommendations</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((student: StudentSummary) => (
                <tr
                  key={student.id}
                  className="border-t hover:bg-muted/20 cursor-pointer transition-colors"
                  onClick={() => router.push(`/students/${student.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {initials(student.full_name)}
                      </div>
                      <div>
                        <p className="font-medium leading-tight">{student.full_name}</p>
                        <p className="text-muted-foreground text-xs">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{student.program || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{student.level || '—'}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{student.interaction_count}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{student.recommendation_count}</td>
                  <td className="px-4 py-3 text-right">
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
