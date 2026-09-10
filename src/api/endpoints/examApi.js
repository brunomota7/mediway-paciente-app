// 📁 src/api/endpoints/examApi.js
//
// Exames do paciente (/api/v1/exam) — SOMENTE LEITURA (L2).
//   E1  GET /exam/me        -> ExamResponseDTO[]
//   E2  GET /exam/{id}      -> ExamResponseDTO
// Agendar/editar/cancelar exigem ADMIN/CUIDADOR/MÉDICO e não existem aqui.

import { api } from '../client';
import { ConsultationExamStatus } from '../../lib/enums';

/** `ExamResponseDTO` -> modelo plano do app. */
export function examFromApi(dto) {
  const exam = dto?.exam ?? {};
  const status = exam.status ?? null;
  return {
    id: dto?.examId ?? null,
    requestDate: dto?.requestDate ?? null, // datetime ISO
    status,
    statusLabel: status ? ConsultationExamStatus.label(status) : '—',
    title: exam.typeExam ?? 'Exame',
    typeExam: exam.typeExam ?? null,
    date: exam.examDate ?? null, // 'YYYY-MM-DD'
    time: exam.examTime ?? null, // 'HH:mm'
    local: exam.local ?? null,
    requirements: exam.requirements ?? null,
    raw: dto ?? null,
  };
}

export const examApi = {
  listMine: async () => {
    const { data } = await api.get('/exam/me');
    return Array.isArray(data) ? data.map(examFromApi) : [];
  },
  getById: async (id) => {
    const { data } = await api.get(`/exam/${id}`);
    return examFromApi(data);
  },
};

export default examApi;
