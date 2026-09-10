// 📁 src/api/endpoints/vaccineApi.js
//
// Vacinas do paciente (/api/v1/vaccine) — SOMENTE LEITURA (L1).
//   V1  GET /vaccine/me        -> VaccineResponseDTO[]
//   V2  GET /vaccine/{id}      -> VaccineResponseDTO
// Registrar/editar/excluir exigem ADMIN/CUIDADOR/MÉDICO e não existem aqui.
//
// B2: quando o id não existe, a API hoje devolve 500 (não 404) — tratamos
// 500/404 no getById como "não encontrada" (null).

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

  /** Devolve `null` se a vacina não existe (500 ou 404 — ver B2). */
  getById: async (id) => {
    try {
      const { data } = await api.get(`/vaccine/${id}`);
      return vaccineFromApi(data);
    } catch (err) {
      if (err instanceof ApiError && (err.isServer || err.isNotFound)) return null;
      throw err;
    }
  },
};

export default vaccineApi;
