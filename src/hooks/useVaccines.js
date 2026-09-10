// 📁 src/hooks/useVaccines.js
//
// Vacinas do paciente autenticado (React Query) — key ['vaccines','me'].
// Somente leitura: não há mutations.

import { useQuery } from '@tanstack/react-query';
import { vaccineApi } from '../api/endpoints/vaccineApi';
import { useAuth } from '../auth/useAuth';

export const vaccineKeys = {
  mine: ['vaccines', 'me'],
};

export function useVaccines() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: vaccineKeys.mine,
    queryFn: vaccineApi.listMine,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export default useVaccines;
