// 📁 src/api/endpoints/medicineBoxApi.js
//
// Caixa de medicamentos / CEM (/api/v1/medicine-box). Ver FASES_INTEGRACAO_API.md §2.6.
//   X1  GET    /medicine-box/me                     -> MedicineBoxResponseDTO (ou 404 se não tiver)
//   X2  POST   /medicine-box/register/{patientId}   -> 201 MedicineBoxResponseDTO (409: ver `error`)
//   X3  PUT    /medicine-box/me?nome=               -> 204 (renomeia)
//   X4  DELETE /medicine-box/me/medication/{id}     -> 204
//   X5  DELETE /medicine-box/me/gaveta?gaveta=      -> 204 (esvazia a gaveta)
//
// Regra: 1 caixa por paciente. `numeroSerie` é digitado pela pessoa.
//
// B4 (corrigido): o `409` do register agora traz `error` estável no corpo —
// `BOX_ALREADY_EXISTS` (já tem caixa) ou `SERIAL_DUPLICATED` (nº de série em
// uso). O `ApiError` expõe isso em `.error`.

import { api } from '../client';
import { ApiError } from '../httpError';
import { medicationFromApi } from './medicationApi';

export const MEDICINE_BOX_CONFLICT = {
  BOX_ALREADY_EXISTS: 'BOX_ALREADY_EXISTS',
  SERIAL_DUPLICATED: 'SERIAL_DUPLICATED',
};

/** Lê o `error` do `409` do register (B4). Devolve `null` se não for conflito. */
export function medicineBoxConflictCode(err) {
  if (!(err instanceof ApiError) || !err.isConflict) return null;
  if (err.error) return err.error;
  // fallback defensivo enquanto algum ambiente não devolve `error`
  const msg = String(err.message || '').toLowerCase();
  if (msg.includes('serie') || msg.includes('série')) return MEDICINE_BOX_CONFLICT.SERIAL_DUPLICATED;
  return MEDICINE_BOX_CONFLICT.BOX_ALREADY_EXISTS;
}

/** `MedicineBoxResponseDTO` -> modelo plano do app. */
export function medicineBoxFromApi(dto) {
  const gavetas = Array.isArray(dto?.gavetas) ? dto.gavetas : [];
  const adaptedGavetas = gavetas.map((g) => ({
    nome: g?.nome ?? null,
    medicamentos: Array.isArray(g?.medicamentos)
      ? g.medicamentos.map(medicationFromApi)
      : [],
  }));
  return {
    id: dto?.medicineBoxId ?? null,
    nome: dto?.nome ?? null,
    numeroSerie: dto?.numeroSerie ?? null,
    externalId: dto?.externalId ?? null,
    gavetas: adaptedGavetas,
    medicationCount: adaptedGavetas.reduce((n, g) => n + g.medicamentos.length, 0),
    raw: dto ?? null,
  };
}

export const medicineBoxApi = {
  /** X1 — caixa do paciente, ou `null` se ele ainda não tem caixa (404). */
  getMine: async () => {
    try {
      const { data } = await api.get('/medicine-box/me');
      return medicineBoxFromApi(data);
    } catch (err) {
      if (err instanceof ApiError && err.isNotFound) return null;
      throw err;
    }
  },

  /**
   * X2 — cadastra a caixa + gavetas + medicamentos numa chamada.
   * `payload` = { numeroSerie, nome?, gavetas: [{ nome, medicamentos: [{...}] }] }
   */
  register: async (patientId, payload) => {
    const { data } = await api.post(`/medicine-box/register/${patientId}`, payload);
    return medicineBoxFromApi(data);
  },

  /** X3 — renomeia a caixa do paciente autenticado. */
  rename: (nome) => api.put('/medicine-box/me', null, { params: { nome } }),

  /** X4 — remove um medicamento da caixa. */
  deleteMedication: (medicationId) =>
    api.delete(`/medicine-box/me/medication/${medicationId}`),

  /** X5 — esvazia uma gaveta (remove todos os medicamentos dela). */
  clearGaveta: (gaveta) =>
    api.delete('/medicine-box/me/gaveta', { params: { gaveta } }),
};

export default medicineBoxApi;
