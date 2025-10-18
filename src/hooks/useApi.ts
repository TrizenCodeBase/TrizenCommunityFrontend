import { useState, useEffect, useCallback } from 'react';

// Generic API hook interface
interface UseApiState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}

interface UseApiOptions {
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
}

// Generic API hook
export function useApi<T>(
    apiFunction: (...args: any[]) => Promise<T>,
    options: UseApiOptions = {}
) {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        isLoading: false,
        error: null,
    });

    const { immediate = false, onSuccess, onError } = options;

    const execute = useCallback(
        async (...args: any[]) => {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            try {
                const data = await apiFunction(...args);
                setState({ data, isLoading: false, error: null });

                if (onSuccess) {
                    onSuccess(data);
                }

                return data;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An error occurred';
                setState({ data: null, isLoading: false, error: errorMessage });

                if (onError) {
                    onError(error as Error);
                }

                throw error;
            }
        },
        [apiFunction, onSuccess, onError]
    );

    const reset = useCallback(() => {
        setState({ data: null, isLoading: false, error: null });
    }, []);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [immediate, execute]);

    return {
        ...state,
        execute,
        reset,
    };
}

// Hook for paginated data
export function usePaginatedApi<T>(
    apiFunction: (page: number, limit: number, ...args: any[]) => Promise<{
        data: T[];
        pagination: {
            current: number;
            pages: number;
            total: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>,
    initialPage: number = 1,
    initialLimit: number = 10
) {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [allData, setAllData] = useState<T[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(
        async (newPage?: number, newLimit?: number, ...args: any[]) => {
            const currentPage = newPage ?? page;
            const currentLimit = newLimit ?? limit;

            setIsLoading(true);
            setError(null);

            try {
                const response = await apiFunction(currentPage, currentLimit, ...args);

                if (currentPage === 1) {
                    setAllData(response.data);
                } else {
                    setAllData(prev => [...prev, ...response.data]);
                }

                setPagination(response.pagination);
                setPage(currentPage);
                setLimit(currentLimit);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An error occurred';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        },
        [apiFunction, page, limit]
    );

    const loadMore = useCallback(() => {
        if (pagination?.hasNext && !isLoading) {
            fetchData(page + 1);
        }
    }, [fetchData, page, pagination?.hasNext, isLoading]);

    const refresh = useCallback((...args: any[]) => {
        setAllData([]);
        setPage(1);
        fetchData(1, limit, ...args);
    }, [fetchData, limit]);

    const reset = useCallback(() => {
        setAllData([]);
        setPage(initialPage);
        setLimit(initialLimit);
        setPagination(null);
        setError(null);
    }, [initialPage, initialLimit]);

    return {
        data: allData,
        pagination,
        isLoading,
        error,
        fetchData,
        loadMore,
        refresh,
        reset,
        hasMore: pagination?.hasNext || false,
    };
}

// Hook for form submission
export function useFormSubmit<T>(
    submitFunction: (data: T) => Promise<any>,
    options: {
        onSuccess?: (data: any) => void;
        onError?: (error: Error) => void;
        resetOnSuccess?: boolean;
    } = {}
) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { onSuccess, onError, resetOnSuccess = false } = options;

    const submit = useCallback(
        async (data: T) => {
            setIsSubmitting(true);
            setError(null);
            setSuccess(false);

            try {
                const result = await submitFunction(data);
                setSuccess(true);

                if (onSuccess) {
                    onSuccess(result);
                }

                if (resetOnSuccess) {
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);
                }

                return result;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Submission failed';
                setError(errorMessage);

                if (onError) {
                    onError(err as Error);
                }

                throw err;
            } finally {
                setIsSubmitting(false);
            }
        },
        [submitFunction, onSuccess, onError, resetOnSuccess]
    );

    const reset = useCallback(() => {
        setError(null);
        setSuccess(false);
        setIsSubmitting(false);
    }, []);

    return {
        submit,
        isSubmitting,
        error,
        success,
        reset,
    };
}

// Hook for local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (error) {
                console.error(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue] as const;
}

// Hook for debounced values
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

