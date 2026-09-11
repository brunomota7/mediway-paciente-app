const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
jest.mock('../../client', () => ({
  api: {
    get: (...a) => mockGet(...a),
    post: (...a) => mockPost(...a),
    put: (...a) => mockPut(...a),
  },
}));

const { patientApi, patientFromApi } = require('../patientApi');

const DTO = {
  patientId: 'uuid-123', // B1 corrigido: agora vem `patientId`
  patientI: 'uuid-123', // chave legada, mantida 1 ciclo
  personalInfo: { name: 'Ana Lima', dateOfBirth: '1990-05-20', age: 36, gender: 'FEMININO', roles: ['PACIENTE'] },
  contactInfo: { email: 'ana@x.com', number: '11999998888' },
  medicalInfo: { conditionPatient: 'Hipertensão', statusPatient: 'EM_ACOMPANHAMENTO' },
};

beforeEach(() => {
  mockGet.mockReset().mockResolvedValue({ data: {} });
  mockPost.mockReset().mockResolvedValue({ data: undefined });
  mockPut.mockReset().mockResolvedValue({ data: undefined });
});

describe('patientFromApi', () => {
  it('achata o DTO e prefere patientId (fallback patientI)', () => {
    const p = patientFromApi(DTO);
    expect(p).toMatchObject({
      id: 'uuid-123',
      name: 'Ana Lima',
      dateOfBirth: '1990-05-20',
      age: 36,
      gender: 'FEMININO',
      email: 'ana@x.com',
      number: '11999998888',
      conditionPatient: 'Hipertensão',
      statusPatient: 'EM_ACOMPANHAMENTO',
      hasMedicalInfo: true,
    });
  });

  it('hasMedicalInfo=false quando não há medicalInfo', () => {
    expect(patientFromApi({ patientI: 'x', personalInfo: {}, medicalInfo: null }).hasMedicalInfo).toBe(false);
    expect(patientFromApi({ patientI: 'x' }).hasMedicalInfo).toBe(false);
  });

  it('é tolerante a DTO nulo', () => {
    const p = patientFromApi(null);
    expect(p.id).toBeNull();
    expect(p.roles).toEqual([]);
    expect(p.hasMedicalInfo).toBe(false);
  });

  it('usa a chave legada patientI quando patientId ainda não veio', () => {
    expect(patientFromApi({ patientI: 'legacy-id' }).id).toBe('legacy-id');
  });
});

describe('patientApi', () => {
  it('getMe: GET /patients/me e devolve adaptado', async () => {
    mockGet.mockResolvedValue({ data: DTO });
    const p = await patientApi.getMe();
    expect(mockGet).toHaveBeenCalledWith('/patients/me');
    expect(p.id).toBe('uuid-123');
    expect(p.hasMedicalInfo).toBe(true);
  });

  it('addInfos: POST /patients/add-infos com os 4 campos', async () => {
    await patientApi.addInfos({
      dateOfBirth: '1990-05-20',
      conditionPatient: 'Hipertensão',
      statusPatient: 'ESTAVEL',
      gender: 'FEMININO',
    });
    expect(mockPost).toHaveBeenCalledWith('/patients/add-infos', {
      dateOfBirth: '1990-05-20',
      conditionPatient: 'Hipertensão',
      statusPatient: 'ESTAVEL',
      gender: 'FEMININO',
    });
  });

  it('updateInfos: PUT /patients/update-infos com o parcial recebido', async () => {
    await patientApi.updateInfos({ number: '11888887777' });
    expect(mockPut).toHaveBeenCalledWith('/patients/update-infos', { number: '11888887777' });
  });
});
