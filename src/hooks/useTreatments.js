// 📁 src/hooks/useTreatments.js
//
// Tratamentos do paciente autenticado (React Query) — key ['treatments','me'].
// Somente leitura: não há mutations (criar/editar/excluir é ADMIN/MÉDICO/CUIDADOR).

import { useQuery } from '@tanstack/react-query';
import { treatmentApi } from '../api/endpoints/treatmentApi';
import { useAuth } from '../auth/useAuth';

export const treatmentKeys = {
  mine: ['treatments', 'me'],
};

export function useTreatments() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: treatmentKeys.mine,
    queryFn: treatmentApi.listMine,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export default useTreatments;
