// 📁 src/hooks/useExams.js
//
// Exames do paciente autenticado (React Query) — key ['exams','me'].
// Somente leitura: não há mutations.

import { useQuery } from '@tanstack/react-query';
import { examApi } from '../api/endpoints/examApi';
import { useAuth } from '../auth/useAuth';

export const examKeys = {
  mine: ['exams', 'me'],
};

export function useExams() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: examKeys.mine,
    queryFn: examApi.listMine,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export default useExams;
