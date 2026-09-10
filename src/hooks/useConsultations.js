// 📁 src/hooks/useConsultations.js
//
// Consultas do paciente autenticado (React Query) — key ['consultations','me'].
// Somente leitura: não há mutations.

import { useQuery } from '@tanstack/react-query';
import { consultationApi } from '../api/endpoints/consultationApi';
import { useAuth } from '../auth/useAuth';

export const consultationKeys = {
  mine: ['consultations', 'me'],
};

export function useConsultations() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: consultationKeys.mine,
    queryFn: consultationApi.listMine,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export default useConsultations;
