// 📁 src/lib/enums.js
//
// Mapas enum-da-API <-> rótulo em português para a UI.
// Fonte dos valores: FASES_INTEGRACAO_API.md §1.1

/**
 * @param {[string, string][]} pairs  lista de [valorDaAPI, rótuloPtBR]
 */
function makeEnum(pairs) {
  const labelByValue = {};
  const valueByLabel = {};
  for (const [value, label] of pairs) {
    labelByValue[value] = label;
    valueByLabel[label.toLowerCase()] = value;
  }
  return {
    /** valores aceitos pela API, na ordem de exibição */
    values: pairs.map(([v]) => v),
    /** pronto para <Picker>: [{ value, label }] */
    options: pairs.map(([value, label]) => ({ value, label })),
    /** valor da API -> rótulo (devolve o próprio valor se desconhecido) */
    label: (value) => labelByValue[value] ?? value ?? '',
    /** rótulo -> valor da API (case-insensitive; `null` se desconhecido) */
    value: (label) => valueByLabel[String(label).toLowerCase()] ?? null,
    /** `true` se o valor é aceito pela API */
    isValid: (value) => Object.prototype.hasOwnProperty.call(labelByValue, value),
  };
}

export const Gender = makeEnum([
  ['MASCULINO', 'Masculino'],
  ['FEMININO', 'Feminino'],
  ['NAO_INFORMADO', 'Não informado'],
]);

export const ConditionStatusPatient = makeEnum([
  ['NECESSITA_DE_ATENCAO', 'Necessita de atenção'],
  ['EM_ACOMPANHAMENTO', 'Em acompanhamento'],
  ['ESTAVEL', 'Estável'],
  ['REABILITACAO', 'Reabilitação'],
]);

export const MedicationType = makeEnum([
  ['GENERICO', 'Genérico'],
  ['SIMILAR', 'Similar'],
  ['REFERENCIA', 'Referência'],
  ['FITOTERAPICO', 'Fitoterápico'],
  ['MANIPULADO', 'Manipulado'],
  ['OUTRO', 'Outro'],
]);

export const MedicationStatus = makeEnum([
  ['ATIVO', 'Ativo'],
  ['SUSPENSO', 'Suspenso'],
]);

export const WeekDay = makeEnum([
  ['SEGUNDA', 'Segunda'],
  ['TERCA', 'Terça'],
  ['QUARTA', 'Quarta'],
  ['QUINTA', 'Quinta'],
  ['SEXTA', 'Sexta'],
  ['SABADO', 'Sábado'],
  ['DOMINGO', 'Domingo'],
]);

export const ConsultationExamStatus = makeEnum([
  ['MARCADO', 'Marcado'],
  ['REALIZADO', 'Realizado'],
  ['CANCELADO', 'Cancelado'],
  ['REMARCADO', 'Remarcado'],
  ['INDEFERIDO', 'Indeferido'],
  ['NAO_COMPARECEU', 'Não compareceu'],
]);

export const VaccineStatus = makeEnum([
  ['APLICADA', 'Aplicada'],
  ['AGENDADA', 'Agendada'],
  ['ATRASADA', 'Atrasada'],
]);

export const VaccineDoseType = makeEnum([
  ['UNICA_DOSE', 'Dose única'],
  ['PRIMEIRA_DOSE', 'Primeira dose'],
  ['SEGUNDA_DOSE', 'Segunda dose'],
  ['REFORCO', 'Reforço'],
]);

export default {
  Gender,
  ConditionStatusPatient,
  MedicationType,
  MedicationStatus,
  WeekDay,
  ConsultationExamStatus,
  VaccineStatus,
  VaccineDoseType,
};
