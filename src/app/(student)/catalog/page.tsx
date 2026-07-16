'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCourses, useDepartments } from '@/hooks/useCourses';
import { CourseGrid } from '@/components/courses/CourseGrid';
import { CourseFilters } from '@/components/courses/CourseFilters';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// useSearchParams() must be wrapped in a Suspense boundary for production builds
export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-6"><LoadingSpinner /></div>}>
      <CatalogContent />
    </Suspense>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const department = searchParams.get('department') || '';
  const level = searchParams.get('level') || '';

  const queryParams: Record<string, unknown> = { page };
  if (debouncedSearch) queryParams.search = debouncedSearch;
  if (department) queryParams.department = department;
  if (level) queryParams.level = level;

  const { data, isLoading } = useCourses(queryParams);
  const { data: departments } = useDepartments();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Course Catalog</h1>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <CourseFilters
          departments={departments || []}
          selectedDepartment={department}
          selectedLevel={level}
          onDepartmentChange={(v) => updateParam('department', v)}
          onLevelChange={(v) => updateParam('level', v)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <CourseGrid courses={data?.results || []} />
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              {data?.count || 0} courses found
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data?.previous}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!data?.next}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
