import { buildMedicationPayload, validateMedicationForm } from '../MedicationForm';

const base = {
  nome: 'Losartana',
  tipo: 'GENERICO',
  nomeReferencia: '',
  descricao: '',
  concentracao: '',
  quantidade: '',
  dias: ['SEGUNDA', 'QUARTA'],
  hora: '8:00',
  gaveta: '',
  estoque: '30',
};

describe('validateMedicationForm', () => {
  it('sem erros para um form válido', () => {
    expect(validateMedicationForm(base)).toBe('');
  });
  it('exige nome', () => {
    expect(validateMedicationForm({ ...base, nome: 'x' })).toMatch(/nome/i);
  });
  it('exige tipo válido', () => {
    expect(validateMedicationForm({ ...base, tipo: '' })).toMatch(/tipo/i);
  });
  it('exige ao menos um dia', () => {
    expect(validateMedicationForm({ ...base, dias: [] })).toMatch(/dia/i);
  });
  it('exige hora HH:mm', () => {
    expect(validateMedicationForm({ ...base, hora: 'abc' })).toMatch(/horário/i);
  });
  it('estoque inteiro >= 0', () => {
    expect(validateMedicationForm({ ...base, estoque: '-1' })).toMatch(/estoque/i);
    expect(validateMedicationForm({ ...base, estoque: '' })).toMatch(/estoque/i);
  });
});

describe('buildMedicationPayload', () => {
  it('normaliza hora, converte estoque e injeta status ATIVO', () => {
    const p = buildMedicationPayload(base);
    expect(p).toMatchObject({
      nome: 'Losartana',
      tipo: 'GENERICO',
      dias: ['SEGUNDA', 'QUARTA'],
      hora: '08:00',
      estoque: 30,
      status: 'ATIVO',
    });
    // campos vazios viram undefined
    expect(p.nomeReferencia).toBeUndefined();
    expect(p.gaveta).toBeUndefined();
  });
});
