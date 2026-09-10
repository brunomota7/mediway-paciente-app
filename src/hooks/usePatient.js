// 📁 src/hooks/usePatient.js
//
// Dados do perfil do paciente (React Query) — key ['patient','me'].
// A fonte é `GET /patients/me`; a sessão (AuthContext.user) serve de dado
// inicial para a tela não piscar.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { patientApi } from '../api/endpoints/patientApi';
import { useAuth } from '../auth/useAuth';

export const patientKeys = {
  me: ['patient', 'me'],
};

/** Perfil do paciente autenticado. */
export function usePatient() {
  const { isAuthenticated, user } = useAuth();
  return useQuery({
    queryKey: patientKeys.me,
    queryFn: patientApi.getMe,
    enabled: isAuthenticated,
    initialData: user ?? undefined,
    staleTime: 60_000,
  });
}

/** P3 — atualização parcial do perfil. Revalida a query e o AuthContext. */
export function useUpdatePatient() {
  const queryClient = useQueryClient();
  const { refreshMe } = useAuth();
  return useMutation({
    mutationFn: (partial) => patientApi.updateInfos(partial),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: patientKeys.me });
      await refreshMe();
    },
  });
}

/** P2 — onboarding clínico. Ao concluir, `refreshMe` muda o status para signedIn. */
export function useAddPatientInfos() {
  const queryClient = useQueryClient();
  const { refreshMe } = useAuth();
  return useMutation({
    mutationFn: (infos) => patientApi.addInfos(infos),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: patientKeys.me });
      await refreshMe();
    },
  });
}

export default usePatient;
