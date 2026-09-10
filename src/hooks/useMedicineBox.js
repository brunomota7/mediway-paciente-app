// 📁 src/hooks/useMedicineBox.js
//
// Caixa de medicamentos do paciente (React Query) — key ['medicineBox','me'].
// `data === null`  -> o paciente ainda não tem caixa (estado vazio, não é erro).
// As mutations invalidam também ['medications','me'].

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { medicineBoxApi } from '../api/endpoints/medicineBoxApi';
import { useAuth } from '../auth/useAuth';

export const medicineBoxKeys = {
  mine: ['medicineBox', 'me'],
};
const medsKey = ['medications', 'me'];

export function useMedicineBox() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: medicineBoxKeys.mine,
    queryFn: medicineBoxApi.getMine,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

function useInvalidateBox() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: medicineBoxKeys.mine }),
      queryClient.invalidateQueries({ queryKey: medsKey }),
    ]);
}

/** X2 — cadastra a caixa (numeroSerie + gavetas + medicamentos). */
export function useRegisterMedicineBox() {
  const invalidate = useInvalidateBox();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (payload) => medicineBoxApi.register(user?.id, payload),
    onSuccess: invalidate,
  });
}

/** X3 — renomeia a caixa. */
export function useRenameMedicineBox() {
  const invalidate = useInvalidateBox();
  return useMutation({
    mutationFn: (nome) => medicineBoxApi.rename(nome),
    onSuccess: invalidate,
  });
}

/** X4 — remove um medicamento da caixa. */
export function useDeleteBoxMedication() {
  const invalidate = useInvalidateBox();
  return useMutation({
    mutationFn: (medicationId) => medicineBoxApi.deleteMedication(medicationId),
    onSuccess: invalidate,
  });
}

/** X5 — esvazia uma gaveta. */
export function useClearGaveta() {
  const invalidate = useInvalidateBox();
  return useMutation({
    mutationFn: (gaveta) => medicineBoxApi.clearGaveta(gaveta),
    onSuccess: invalidate,
  });
}

export default useMedicineBox;
