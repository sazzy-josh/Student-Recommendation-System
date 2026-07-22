'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStudentDetail, useStudentInteractions, useStudentEnrollments } from '@/hooks/useAnalytics';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, MousePointerClick, Star } from 'lucide-react';

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

function StatCard({ icon: Icon, label, value, accent }: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg ${accent}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xl font-bold leading-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = Number(params.id);

  const { data: student, isLoading: studentLoading } = useStudentDetail(studentId);
  const { data: interactions, isLoading: interactionsLoading } = useStudentInteractions(studentId);
  const { data: enrollments, isLoading: enrollmentsLoading } = useStudentEnrollments(studentId);

  if (studentLoading) {
    return <div className="p-6"><LoadingSpinner /></div>;
  }

  if (!student) {
    return (
      <div className="p-6 text-muted-foreground">Student not found.</div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <Link href="/students">
        <Button variant="ghost" size="sm" className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          All Students
        </Button>
      </Link>

      {/* Profile card */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold flex-shrink-0">
            {student.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{student.full_name}</h1>
            <p className="text-muted-foreground text-sm">{student.email}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <span><span className="text-muted-foreground">Programme:</span> <span className="font-medium">{student.program || '—'}</span></span>
              <span><span className="text-muted-foreground">Level:</span> <span className="font-medium capitalize">{student.level || '—'}</span></span>
              {student.gpa && (
                <span><span className="text-muted-foreground">GPA:</span> <span className="font-medium">{student.gpa}</span></span>
              )}
              <span><span className="text-muted-foreground">Joined:</span> <span className="font-medium">{new Date(student.joined_at).toLocaleDateString()}</span></span>
            </div>
            {student.interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {student.interests.map((interest: string) => (
                  <Badge key={interest} variant="secondary" className="text-xs">{interest}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={MousePointerClick} label="Interactions" value={student.interaction_count} accent="bg-blue-50 text-blue-600" />
        <StatCard icon={BookOpen} label="Enrollments" value={student.enrollment_count} accent="bg-emerald-50 text-emerald-600" />
        <StatCard icon={Star} label="Recommendations" value={student.recommendation_count} accent="bg-amber-50 text-amber-600" />
      </div>

      {/* Enrollments */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-base font-semibold mb-4">Enrolment History</h2>
        {enrollmentsLoading ? (
          <LoadingSpinner />
        ) : !enrollments || enrollments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No enrolments recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Course</th>
                  <th className="pb-2 font-medium">Semester</th>
                  <th className="pb-2 font-medium text-right">Grade</th>
                  <th className="pb-2 font-medium">Completed</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => (
                  <tr key={e.id} className="border-b last:border-0">
                    <td className="py-2.5 pr-4">
                      <span className="font-medium">{e.course_code}</span>
                      <span className="text-muted-foreground ml-2">{e.course_title}</span>
                    </td>
                    <td className="py-2.5 text-muted-foreground">{e.semester || '—'}</td>
                    <td className="py-2.5 text-right font-medium">{e.grade ?? '—'}</td>
                    <td className="py-2.5 text-muted-foreground text-xs">
                      {e.completed_at ? new Date(e.completed_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interaction log */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-base font-semibold mb-4">Course Interaction Log</h2>
        {interactionsLoading ? (
          <LoadingSpinner />
        ) : !interactions || interactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No interactions recorded.</p>
        ) : (
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
                    <td className="py-2.5 text-muted-foreground text-xs">
                      {row.last_accessed ? new Date(row.last_accessed).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
