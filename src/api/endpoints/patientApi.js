// 📁 src/api/endpoints/patientApi.js
//
// Perfil do paciente (/api/v1/patients). Ver FASES_INTEGRACAO_API.md §2.2.
//   P1  GET  /patients/me           -> PatientResponseInfosDTO
//   P2  POST /patients/add-infos    -> 201 (onboarding clínico obrigatório)
//   P3  PUT  /patients/update-infos -> 200 (parcial: só os campos enviados)

import { api } from '../client';

/**
 * Adapter `PatientResponseInfosDTO` -> modelo plano do app.
 * B1 (corrigido): o backend passou a devolver `patientId`; `patientI` (chave
 * legada, typo) fica só como fallback defensivo por 1 ciclo.
 */
export function patientFromApi(dto) {
  const personal = dto?.personalInfo ?? {};
  const contact = dto?.contactInfo ?? {};
  const medical = dto?.medicalInfo ?? {};
  return {
    id: dto?.patientId ?? dto?.patientI ?? null,
    name: personal.name ?? null,
    dateOfBirth: personal.dateOfBirth ?? null,
    age: personal.age ?? null,
    gender: personal.gender ?? null,
    roles: Array.isArray(personal.roles) ? personal.roles : [],
    email: contact.email ?? null,
    number: contact.number ?? null,
    conditionPatient: medical.conditionPatient ?? null,
    statusPatient: medical.statusPatient ?? null,
    hasMedicalInfo: Boolean(
      medical && (medical.statusPatient || medical.conditionPatient),
    ),
    raw: dto ?? null,
  };
}

export const patientApi = {
  /** P1 — perfil do paciente autenticado, já adaptado. */
  getMe: async () => {
    const { data } = await api.get('/patients/me');
    return patientFromApi(data);
  },

  /** P2 — completa o cadastro clínico. Campos todos obrigatórios. `201` sem corpo. */
  addInfos: ({ dateOfBirth, conditionPatient, statusPatient, gender }) =>
    api.post('/patients/add-infos', {
      dateOfBirth,
      conditionPatient,
      statusPatient,
      gender,
    }),

  /**
   * P3 — atualização parcial. `partial` aceita apenas:
   * { name?, email?, number?, dateOfBirth?, conditionPatient?, gender? }.
   * `statusPatient` NÃO é editável pelo paciente. `200` sem corpo.
   */
  updateInfos: (partial) => api.put('/patients/update-infos', partial),
};

export default patientApi;
