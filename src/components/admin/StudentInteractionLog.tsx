'use client';

import { useState } from 'react';
import { useStudents, useStudentInteractions } from '@/hooks/useAnalytics';
import { StudentSummary, StudentInteraction } from '@/types';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Select } from '@/components/ui/select';

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function computeImplicitScore(clicks: number, timeSeconds: number): number {
  const clickScore = Math.min(clicks, 50) / 50;
  const timeScore = Math.min(timeSeconds, 1800) / 1800;
  return Math.round((0.3 * clickScore + 0.7 * timeScore) * 1000) / 1000;
}

function ScoreBadge({ score }: { score: number }) {
  const pct = score * 100;
  const color =
    pct >= 60 ? 'bg-green-100 text-green-800' :
    pct >= 30 ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {score.toFixed(3)}
    </span>
  );
}

interface InteractionTableProps {
  interactions: StudentInteraction[];
}

function InteractionTable({ interactions }: InteractionTableProps) {
  if (interactions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No interactions recorded for this student.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-2 font-medium">Course</th>
            <th className="pb-2 font-medium text-right">Clicks</th>
            <th className="pb-2 font-medium text-right">Time Spent</th>
            <th className="pb-2 font-medium text-right">Implicit Score</th>
            <th className="pb-2 font-medium">Last Accessed</th>
          </tr>
        </thead>
        <tbody>
          {interactions.map((row) => (
            <tr key={row.id} className="border-b last:border-0">
              <td className="py-2.5 pr-4">
                <span className="font-medium">{row.course_code}</span>
                <span className="text-muted-foreground ml-2">{row.course_title}</span>
              </td>
              <td className="py-2.5 text-right tabular-nums">{row.clicks}</td>
              <td className="py-2.5 text-right tabular-nums">{formatTime(row.time_spent_seconds)}</td>
              <td className="py-2.5 text-right">
                <ScoreBadge score={computeImplicitScore(row.clicks, row.time_spent_seconds)} />
              </td>
              <td className="py-2.5 text-muted-foreground">
                {row.last_accessed ? new Date(row.last_accessed).toLocaleString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StudentInteractionLog() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: interactions, isLoading: interactionsLoading } = useStudentInteractions(selectedId);

  const selectedStudent: StudentSummary | undefined = students?.find((s) => s.id === selectedId);

  return (
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Student Interaction Log</h2>
        {selectedStudent && (
          <span className="text-sm text-muted-foreground">
            {selectedStudent.interaction_count} interaction
            {selectedStudent.interaction_count !== 1 ? 's' : ''} recorded
          </span>
        )}
      </div>

      {studentsLoading ? (
        <LoadingSpinner />
      ) : (
        <Select
          className="w-80"
          value={selectedId?.toString() ?? ''}
          onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Select a student...</option>
          {(students ?? []).map((s) => (
            <option key={s.id} value={s.id.toString()}>
              {s.full_name} — {s.email}
            </option>
          ))}
        </Select>
      )}

      {selectedStudent && (
        <div className="flex gap-4 text-sm text-muted-foreground border rounded-lg px-4 py-3 bg-muted/30">
          <span><span className="font-medium text-foreground">Program:</span> {selectedStudent.program || '—'}</span>
          <span><span className="font-medium text-foreground">Level:</span> {selectedStudent.level || '—'}</span>
          <span><span className="font-medium text-foreground">Recommendations:</span> {selectedStudent.recommendation_count}</span>
        </div>
      )}

      {selectedId !== null && (
        interactionsLoading
          ? <div className="py-4"><LoadingSpinner /></div>
          : <InteractionTable interactions={interactions ?? []} />
      )}

      {selectedId === null && (
        <p className="text-sm text-muted-foreground py-2">
          Select a student above to view their course interaction history.
        </p>
      )}
    </div>
  );
}
