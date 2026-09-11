const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockDelete = jest.fn();
jest.mock('../../client', () => ({
  api: {
    get: (...a) => mockGet(...a),
    post: (...a) => mockPost(...a),
    put: (...a) => mockPut(...a),
    delete: (...a) => mockDelete(...a),
  },
}));

const {
  medicineBoxApi,
  medicineBoxFromApi,
  medicineBoxConflictCode,
  MEDICINE_BOX_CONFLICT,
} = require('../medicineBoxApi');
const { ApiError } = require('../../httpError');

const DTO = {
  medicineBoxId: 1,
  nome: 'Caixa da sala',
  numeroSerie: 'MDW-2026-000123',
  externalId: 'ext-uuid',
  gavetas: [
    {
      nome: 'Gaveta 1',
      medicamentos: [
        { medicationId: 10, nome: 'Losartana', tipo: 'GENERICO', dias: ['SEGUNDA'], hora: '08:00', estoque: 30, status: 'ATIVO' },
      ],
    },
    { nome: 'Gaveta 2', medicamentos: [] },
  ],
};

beforeEach(() => {
  mockGet.mockReset().mockResolvedValue({ data: DTO });
  mockPost.mockReset().mockResolvedValue({ data: DTO });
  mockPut.mockReset().mockResolvedValue({ data: undefined });
  mockDelete.mockReset().mockResolvedValue({ data: undefined });
});

describe('medicineBoxFromApi', () => {
  it('adapta gavetas e medicamentos, calcula medicationCount', () => {
    const box = medicineBoxFromApi(DTO);
    expect(box).toMatchObject({
      id: 1,
      nome: 'Caixa da sala',
      numeroSerie: 'MDW-2026-000123',
      externalId: 'ext-uuid',
      medicationCount: 1,
    });
    expect(box.gavetas).toHaveLength(2);
    expect(box.gavetas[0].medicamentos[0].id).toBe(10);
    expect(box.gavetas[0].medicamentos[0].statusLabel).toBe('Ativo');
  });
});

describe('medicineBoxApi', () => {
  it('getMine: GET /medicine-box/me adaptado', async () => {
    const box = await medicineBoxApi.getMine();
    expect(mockGet).toHaveBeenCalledWith('/medicine-box/me');
    expect(box.id).toBe(1);
  });

  it('getMine: 404 -> null (paciente sem caixa)', async () => {
    mockGet.mockRejectedValue(new ApiError({ status: 404 }));
    expect(await medicineBoxApi.getMine()).toBeNull();
  });

  it('getMine: outros erros propagam', async () => {
    mockGet.mockRejectedValue(new ApiError({ status: 500 }));
    await expect(medicineBoxApi.getMine()).rejects.toBeInstanceOf(ApiError);
  });

  it('register: POST /medicine-box/register/{patientId}', async () => {
    const payload = { numeroSerie: 'S1', gavetas: [{ nome: 'G1', medicamentos: [{}] }] };
    const box = await medicineBoxApi.register('pat-uuid', payload);
    expect(mockPost).toHaveBeenCalledWith('/medicine-box/register/pat-uuid', payload);
    expect(box.id).toBe(1);
  });

  it('rename: PUT /medicine-box/me?nome=', async () => {
    await medicineBoxApi.rename('Nova');
    expect(mockPut).toHaveBeenCalledWith('/medicine-box/me', null, { params: { nome: 'Nova' } });
  });

  it('deleteMedication: DELETE /medicine-box/me/medication/{id}', async () => {
    await medicineBoxApi.deleteMedication(10);
    expect(mockDelete).toHaveBeenCalledWith('/medicine-box/me/medication/10');
  });

  it('clearGaveta: DELETE /medicine-box/me/gaveta?gaveta=', async () => {
    await medicineBoxApi.clearGaveta('Gaveta 1');
    expect(mockDelete).toHaveBeenCalledWith('/medicine-box/me/gaveta', {
      params: { gaveta: 'Gaveta 1' },
    });
  });
});

describe('medicineBoxConflictCode (B4)', () => {
  it('lê o campo `error` do 409', () => {
    expect(
      medicineBoxConflictCode(new ApiError({ status: 409, error: 'SERIAL_DUPLICATED' })),
    ).toBe(MEDICINE_BOX_CONFLICT.SERIAL_DUPLICATED);
    expect(
      medicineBoxConflictCode(new ApiError({ status: 409, error: 'BOX_ALREADY_EXISTS' })),
    ).toBe(MEDICINE_BOX_CONFLICT.BOX_ALREADY_EXISTS);
  });
  it('sem `error`, faz fallback pela mensagem', () => {
    expect(
      medicineBoxConflictCode(new ApiError({ status: 409, message: 'numero de série já usado' })),
    ).toBe(MEDICINE_BOX_CONFLICT.SERIAL_DUPLICATED);
    expect(
      medicineBoxConflictCode(new ApiError({ status: 409, message: 'já possui caixa' })),
    ).toBe(MEDICINE_BOX_CONFLICT.BOX_ALREADY_EXISTS);
  });
  it('não-conflito -> null', () => {
    expect(medicineBoxConflictCode(new ApiError({ status: 500 }))).toBeNull();
    expect(medicineBoxConflictCode(new Error('x'))).toBeNull();
  });
});
