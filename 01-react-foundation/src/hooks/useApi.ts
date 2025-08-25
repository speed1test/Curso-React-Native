import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

// Interfaces for API responses
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface UseApiReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  fetchData: (page?: number) => Promise<void>;
  refresh: () => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

// Custom hook for HTTP requests with pagination
export const useApi = <T>(
  baseUrl: string,
  initialPage: number = 1,
  itemsPerPage: number = 10
): UseApiReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: initialPage,
    limit: itemsPerPage,
    total: 0,
    totalPages: 0,
  });

  // Function to fetch data with pagination
  const fetchData = useCallback(
    async (page: number = pagination.page) => {
      setLoading(true);
      setError(null);

      try {
        // Calculate pagination parameters
        const start = (page - 1) * itemsPerPage;

        // Make HTTP request
        const response = await axios.get(
          `${baseUrl}?_start=${start}&_limit=${itemsPerPage}`
        );

        // Get total count from headers (JSONPlaceholder provides this)
        const totalCount = parseInt(
          response.headers['x-total-count'] || '100',
          10
        );

        const totalPages = Math.ceil(totalCount / itemsPerPage);

        setData(response.data);
        setPagination({
          page,
          limit: itemsPerPage,
          total: totalCount,
          totalPages,
        });
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, itemsPerPage, pagination.page]
  );

  // Refresh current page
  const refresh = useCallback(() => {
    return fetchData(pagination.page);
  }, [fetchData, pagination.page]);

  // Navigation functions
  const nextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      const newPage = pagination.page + 1;
      fetchData(newPage);
    }
  }, [pagination.page, pagination.totalPages, fetchData]);

  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      const newPage = pagination.page - 1;
      fetchData(newPage);
    }
  }, [pagination.page, fetchData]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.totalPages) {
        fetchData(page);
      }
    },
    [pagination.totalPages, fetchData]
  );

  // Load initial data
  useEffect(() => {
    fetchData(initialPage);
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    fetchData,
    refresh,
    nextPage,
    prevPage,
    goToPage,
  };
};
