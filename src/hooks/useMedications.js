// 📁 src/hooks/useMedications.js
//
// Medicações do paciente (React Query) — key ['medications','me'].
// As mutations invalidam também ['medicineBox','me'] (a caixa contém as gavetas
// com os mesmos medicamentos).

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { medicationApi } from '../api/endpoints/medicationApi';
import { useAuth } from '../auth/useAuth';

export const medicationKeys = {
  mine: ['medications', 'me'],
};
const boxKey = ['medicineBox', 'me'];

export function useMedications() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: medicationKeys.mine,
    queryFn: medicationApi.listMine,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

function useInvalidateMeds() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: medicationKeys.mine }),
      queryClient.invalidateQueries({ queryKey: boxKey }),
    ]);
}

/** M3 — adiciona medicação a uma caixa existente. `patientUserId` = UUID do paciente. */
export function useCreateMedication() {
  const invalidate = useInvalidateMeds();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (payload) => medicationApi.create(user?.id, payload),
    onSuccess: invalidate,
  });
}

/** M4 — ATIVO | SUSPENSO. */
export function useSetMedicationStatus() {
  const invalidate = useInvalidateMeds();
  return useMutation({
    mutationFn: ({ id, status }) => medicationApi.setStatus(id, status),
    onSuccess: invalidate,
  });
}

/** M5 */
export function useRemoveMedication() {
  const invalidate = useInvalidateMeds();
  return useMutation({
    mutationFn: (id) => medicationApi.remove(id),
    onSuccess: invalidate,
  });
}

export default useMedications;
