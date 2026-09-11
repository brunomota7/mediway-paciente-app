// 📁 src/api/endpoints/treatmentApi.js
//
// Tratamentos do paciente (/api/v1/treatment) — SOMENTE LEITURA (o paciente não
// cria/edita/exclui; isso é ADMIN/MÉDICO/CUIDADOR).
//   T1  GET /treatment/me          -> [TreatmentResponseDTO]
//   T2  GET /treatment/{id}        -> TreatmentResponseDTO

import { api } from '../client';
import { TreatmentStatus } from '../../lib/enums';
import { toBrDate, toBrDateTime } from '../../lib/datetime';

/** `TreatmentResponseDTO` -> modelo plano do app. */
export function treatmentFromApi(dto) {
  const status = dto?.status ?? null;
  return {
    id: dto?.treatmentId ?? null,
    patientUserId: dto?.patientUserId ?? null,
    nome: dto?.nome ?? '',
    descricao: dto?.descricao ?? '',
    status,
    statusLabel: status ? TreatmentStatus.label(status) : '—',
    dataInicio: dto?.dataInicio ?? null,
    dataInicioLabel: dto?.dataInicio ? toBrDate(dto.dataInicio) : '',
    dataFim: dto?.dataFim ?? null,
    dataFimLabel: dto?.dataFim ? toBrDate(dto.dataFim) : '',
    createdAt: dto?.createdAt ?? null,
    createdAtLabel: dto?.createdAt ? toBrDateTime(dto.createdAt) : '',
    raw: dto ?? null,
  };
}

export const treatmentApi = {
  /** T1 — tratamentos do paciente autenticado. */
  listMine: async () => {
    const { data } = await api.get('/treatment/me');
    return Array.isArray(data) ? data.map(treatmentFromApi) : [];
  },

  /** T2 */
  getById: async (id) => {
    const { data } = await api.get(`/treatment/${id}`);
    return treatmentFromApi(data);
  },
};

export default treatmentApi;
