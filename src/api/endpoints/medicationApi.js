// 📁 src/api/endpoints/medicationApi.js
//
// Medicações do paciente (/api/v1/medications). Ver FASES_INTEGRACAO_API.md §2.5.
//   M1  GET    /medications/me                 -> MedicationResponseDTO[]
//   M2  GET    /medications/{id}               -> MedicationResponseDTO
//   M3  POST   /medications/user/{patientUserId} -> 201 (add avulsa a caixa existente)
//   M4  PATCH  /medications/{id}/status?status= -> 204 (ATIVO | SUSPENSO)
//   M5  DELETE /medications/{id}               -> 204
// Não existe PUT de edição completa (L4): editar = suspender/reativar/excluir.

import { api } from '../client';
import { MedicationStatus, MedicationType, WeekDay } from '../../lib/enums';

/** `MedicationResponseDTO` -> modelo plano do app. */
export function medicationFromApi(dto) {
  const dias = Array.isArray(dto?.dias) ? dto.dias : [];
  const status = dto?.status ?? null;
  const tipo = dto?.tipo ?? null;
  return {
    id: dto?.medicationId ?? null,
    nome: dto?.nome ?? null,
    tipo,
    tipoLabel: tipo ? MedicationType.label(tipo) : null,
    nomeReferencia: dto?.nomeReferencia ?? null,
    descricao: dto?.descricao ?? null,
    concentracao: dto?.concentracao ?? null,
    quantidade: dto?.quantidade ?? null,
    dias,
    diasLabel: dias.map((d) => WeekDay.label(d)).join(', '),
    hora: dto?.hora ?? null,
    gaveta: dto?.gaveta ?? null,
    estoque: dto?.estoque ?? 0,
    status,
    statusLabel: status ? MedicationStatus.label(status) : '—',
    raw: dto ?? null,
  };
}

export const medicationApi = {
  listMine: async () => {
    const { data } = await api.get('/medications/me');
    return Array.isArray(data) ? data.map(medicationFromApi) : [];
  },

  getById: async (id) => {
    const { data } = await api.get(`/medications/${id}`);
    return medicationFromApi(data);
  },

  /**
   * M3 — adiciona uma medicação a uma caixa já existente.
   * `payload` = { nome, tipo, nomeReferencia?, descricao?, concentracao?,
   *   quantidade?, dias[], hora, gaveta?, estoque, status, medicineBoxId }
   */
  create: (patientUserId, payload) =>
    api.post(`/medications/user/${patientUserId}`, payload),

  /** M4 — ATIVO | SUSPENSO (query param, sem corpo). */
  setStatus: (id, status) =>
    api.patch(`/medications/${id}/status`, null, { params: { status } }),

  /** M5 */
  remove: (id) => api.delete(`/medications/${id}`),
};

export default medicationApi;
