import {
  Gender,
  ConsultationExamStatus,
  MedicationStatus,
  VaccineDoseType,
  WeekDay,
} from '../enums';

describe('lib/enums', () => {
  it('label(): valor da API -> rótulo pt-BR', () => {
    expect(Gender.label('MASCULINO')).toBe('Masculino');
    expect(ConsultationExamStatus.label('NAO_COMPARECEU')).toBe('Não compareceu');
    expect(VaccineDoseType.label('UNICA_DOSE')).toBe('Dose única');
  });

  it('label(): devolve o próprio valor quando desconhecido', () => {
    expect(Gender.label('XPTO')).toBe('XPTO');
    expect(Gender.label(undefined)).toBe('');
  });

  it('value(): rótulo -> valor da API (case-insensitive)', () => {
    expect(Gender.value('feminino')).toBe('FEMININO');
    expect(MedicationStatus.value('Suspenso')).toBe('SUSPENSO');
    expect(Gender.value('inexistente')).toBeNull();
  });

  it('options(): pronto para Picker', () => {
    expect(WeekDay.options).toContainEqual({ value: 'SEGUNDA', label: 'Segunda' });
    expect(WeekDay.options).toHaveLength(7);
  });

  it('values() na ordem declarada', () => {
    expect(MedicationStatus.values).toEqual(['ATIVO', 'SUSPENSO']);
  });

  it('isValid()', () => {
    expect(ConsultationExamStatus.isValid('MARCADO')).toBe(true);
    expect(ConsultationExamStatus.isValid('marcado')).toBe(false);
    expect(ConsultationExamStatus.isValid('NADA')).toBe(false);
  });
});
