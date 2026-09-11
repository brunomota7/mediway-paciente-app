// 📁 src/lib/statusColors.js
//
// Cores de badge por status. Usado por consultas e exames (mesmo enum
// `ConsultationAndExmStatus`).

export const CONSULTATION_EXAM_STATUS_COLOR = {
  MARCADO: '#4caf50',
  REMARCADO: '#ff9800',
  REALIZADO: '#2196f3',
  CANCELADO: '#9e9e9e',
  INDEFERIDO: '#e53935',
  NAO_COMPARECEU: '#795548',
};

export const TREATMENT_STATUS_COLOR = {
  ATIVO: '#2e7d32',
  CONCLUIDO: '#1976d2',
  SUSPENSO: '#e53935',
};

const FALLBACK = '#9e9e9e';

/** Cor do badge para um status de consulta/exame. */
export function consultationExamStatusColor(status) {
  return CONSULTATION_EXAM_STATUS_COLOR[status] ?? FALLBACK;
}

/** Cor do badge para o status de um tratamento. */
export function treatmentStatusColor(status) {
  return TREATMENT_STATUS_COLOR[status] ?? FALLBACK;
}

/** `true` para status "em aberto" (aba Marcadas); o resto é histórico. */
export function isUpcomingStatus(status) {
  return status === 'MARCADO' || status === 'REMARCADO';
}

export default { consultationExamStatusColor, treatmentStatusColor, isUpcomingStatus };
