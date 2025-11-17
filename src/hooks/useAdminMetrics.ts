/**
 * useAdminMetrics Hook
 * Fetches and manages admin dashboard data with caching and error handling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { AdminMetrics, AdminMetricsState } from '../types/admin';
import { fetchAdminMetrics as fetchMockData } from '../data/mockAdminData';

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

interface UseAdminMetricsOptions {
  skip?: boolean;
  cacheStrategy?: 'memory' | 'none';
}

/**
 * Custom hook for fetching and caching admin metrics
 * @param options - Configuration options
 * @returns AdminMetricsState and refetch function
 */
export const useAdminMetrics = (options: UseAdminMetricsOptions = {}) => {
  const { skip = false, cacheStrategy = 'memory' } = options;

  const [state, setState] = useState<AdminMetricsState>({
    data: null,
    loading: true,
    error: null,
    lastFetch: 0,
  });

  const cacheRef = useRef<{ data: AdminMetrics; timestamp: number } | null>(null);

  /**
   * Fetches metrics from API or returns cached data
   */
  const fetchMetrics = useCallback(async () => {
    try {
      // Check cache first
      if (cacheStrategy === 'memory' && cacheRef.current) {
        const isCacheFresh = Date.now() - cacheRef.current.timestamp < CACHE_DURATION_MS;
        if (isCacheFresh) {
          console.log('Returning cached admin metrics');
          setState((prev) => ({
            ...prev,
            data: cacheRef.current!.data,
            loading: false,
            error: null,
          }));
          return;
        }
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Simulate API call with mock data
      const metrics = await fetchMockData();

      // Update cache
      if (cacheStrategy === 'memory') {
        cacheRef.current = {
          data: metrics,
          timestamp: Date.now(),
        };
      }

      setState({
        data: metrics,
        loading: false,
        error: null,
        lastFetch: Date.now(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      console.error('Error fetching admin metrics:', err);
    }
  }, [cacheStrategy]);

  /**
   * Fetch metrics on component mount
   */
  useEffect(() => {
    if (!skip) {
      fetchMetrics();
    }
  }, [skip, fetchMetrics]);

  /**
   * Manually refetch metrics (bypasses cache by default)
   */
  const refetch = useCallback(async () => {
    cacheRef.current = null; // Clear cache
    await fetchMetrics();
  }, [fetchMetrics]);

  /**
   * Clear cached data
   */
  const clearCache = useCallback(() => {
    cacheRef.current = null;
  }, []);

  return {
    ...state,
    refetch,
    clearCache,
    isCached: cacheRef.current !== null,
  };
};

export default useAdminMetrics;
