'use client';

import { useEffect, useRef } from 'react';
import { studentApi } from '@/lib/api';

/**
 * Tracks time a student actively spends viewing a course page and records
 * a single interaction event when they leave. Pauses the timer while the
 * tab is hidden so only genuine view time is captured.
 */
export function useInteractionTracker(courseId: number | null) {
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const flushedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!courseId) return;

    flushedRef.current = false;
    accumulatedRef.current = 0;
    isVisibleRef.current = !document.hidden;
    startTimeRef.current = document.hidden ? 0 : Date.now();

    const getElapsed = (): number => {
      let total = accumulatedRef.current;
      if (isVisibleRef.current && startTimeRef.current > 0) {
        total += Math.floor((Date.now() - startTimeRef.current) / 1000);
      }
      return total;
    };

    const flush = () => {
      if (flushedRef.current) return;
      flushedRef.current = true;
      const timeSpent = Math.max(1, getElapsed());
      studentApi.logInteraction(courseId, 1, timeSpent).catch(() => {});
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isVisibleRef.current && startTimeRef.current > 0) {
          accumulatedRef.current += Math.floor((Date.now() - startTimeRef.current) / 1000);
        }
        isVisibleRef.current = false;
        startTimeRef.current = 0;
      } else {
        isVisibleRef.current = true;
        startTimeRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', flush);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', flush);
      flush();
    };
  }, [courseId]);
}
