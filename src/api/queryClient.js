// 📁 src/api/queryClient.js
//
// Instância única do React Query. As telas/hooks das próximas fases usam
// `useQuery`/`useMutation` com este client (provido no App.js).

import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './httpError';

/** Não faz sentido repetir erros de autorização/validação/regra de negócio. */
function shouldRetry(failureCount, error) {
  if (error instanceof ApiError) {
    if (
      error.isUnauthorized ||
      error.isForbidden ||
      error.isNotFound ||
      error.isConflict ||
      error.isRateLimited
    ) {
      return false;
    }
  }
  return failureCount < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
