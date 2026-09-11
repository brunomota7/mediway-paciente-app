// 📁 src/api/endpoints/vaccineApi.js
//
// Vacinas do paciente (/api/v1/vaccine) — SOMENTE LEITURA por design (#9).
//   V1  GET /vaccine/me        -> VaccineResponseDTO[]
//   V2  GET /vaccine/{id}      -> VaccineResponseDTO (404 -> null)
// Registrar/editar/excluir exigem ADMIN/CUIDADOR/MÉDICO e não existem aqui.
//
// B2 (corrigido): o id inexistente agora devolve 404 (antes vinha 500). `500`
// volta a significar erro de servidor de verdade — não é mais tratado como
// "não encontrada".

import { api } from '../client';
import { ApiError } from '../httpError';
import { VaccineDoseType, VaccineStatus } from '../../lib/enums';
import { toBrDate, toBrDateTime } from '../../lib/datetime';

/** `VaccineResponseDTO` -> modelo plano do app. */
export function vaccineFromApi(dto) {
  const status = dto?.status ?? null;
  const tipoDose = dto?.tipoDose ?? null;
  return {
    id: dto?.vaccineId ?? null,
    nome: dto?.nome ?? null,
    tipoDose,
    tipoDoseLabel: tipoDose ? VaccineDoseType.label(tipoDose) : '—',
    status,
    statusLabel: status ? VaccineStatus.label(status) : '—',
    dataVacinou: dto?.dataVacinou ?? null,
    dataVacinouLabel: dto?.dataVacinou ? toBrDateTime(dto.dataVacinou) : '',
    lote: dto?.lote ?? null,
    dataFabricacao: dto?.dataFabricacao ?? null,
    dataFabricacaoLabel: dto?.dataFabricacao ? toBrDate(dto.dataFabricacao) : '',
    proximaDose: dto?.proximaDose ?? null,
    proximaDoseLabel: dto?.proximaDose ? toBrDate(dto.proximaDose) : '',
    patientId: dto?.patientId ?? null,
    raw: dto ?? null,
  };
}

export const vaccineApi = {
  listMine: async () => {
    const { data } = await api.get('/vaccine/me');
    return Array.isArray(data) ? data.map(vaccineFromApi) : [];
  },

  /** Devolve `null` se a vacina não existe (404 — B2 corrigido). */
  getById: async (id) => {
    try {
      const { data } = await api.get(`/vaccine/${id}`);
      return vaccineFromApi(data);
    } catch (err) {
      if (err instanceof ApiError && err.isNotFound) return null;
      throw err;
    }
  },
};

export default vaccineApi;
