// 📁 src/api/endpoints/consultationApi.js
//
// Consultas do paciente (/api/v1/consultation) — SOMENTE LEITURA (L2).
//   C1  GET /consultation/me            -> ConsultationResponseDTO[]
//   C2  GET /consultation/{id}          -> ConsultationResponseDTO
// Agendar/editar/cancelar exigem ADMIN/MÉDICO/CUIDADOR e não existem aqui.

import { api } from '../client';
import { ConsultationExamStatus } from '../../lib/enums';

/** `ConsultationResponseDTO` -> modelo plano do app. */
export function consultationFromApi(dto) {
  const details = dto?.details ?? {};
  const doctor = dto?.doctor ?? {};
  const status = dto?.status ?? null;
  return {
    id: dto?.consultationId ?? null,
    status,
    statusLabel: status ? ConsultationExamStatus.label(status) : '—',
    title: doctor.specialty ? `Consulta • ${doctor.specialty}` : 'Consulta',
    doctorName: doctor.name ?? null,
    doctorSpecialty: doctor.specialty ?? null,
    date: details.consultationDate ?? null, // 'YYYY-MM-DD'
    time: details.consultationTime ?? null, // 'HH:mm'
    local: details.localConsultation ?? null,
    description: details.description ?? null,
    requirements: details.requirements ?? null,
    raw: dto ?? null,
  };
}

export const consultationApi = {
  listMine: async () => {
    const { data } = await api.get('/consultation/me');
    return Array.isArray(data) ? data.map(consultationFromApi) : [];
  },
  getById: async (id) => {
    const { data } = await api.get(`/consultation/${id}`);
    return consultationFromApi(data);
  },
};

export default consultationApi;
