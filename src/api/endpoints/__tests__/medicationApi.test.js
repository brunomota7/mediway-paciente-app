const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPatch = jest.fn();
const mockDelete = jest.fn();
jest.mock('../../client', () => ({
  api: {
    get: (...a) => mockGet(...a),
    post: (...a) => mockPost(...a),
    patch: (...a) => mockPatch(...a),
    delete: (...a) => mockDelete(...a),
  },
}));

const { medicationApi, medicationFromApi } = require('../medicationApi');

const DTO = {
  medicationId: 5,
  nome: 'Losartana',
  tipo: 'GENERICO',
  nomeReferencia: 'Cozaar',
  descricao: 'Anti-hipertensivo',
  concentracao: '50mg',
  quantidade: '1 comprimido',
  dias: ['SEGUNDA', 'QUARTA'],
  hora: '08:00',
  gaveta: 'Gaveta 1',
  estoque: 30,
  status: 'ATIVO',
};

beforeEach(() => {
  mockGet.mockReset().mockResolvedValue({ data: [] });
  mockPost.mockReset().mockResolvedValue({ data: undefined });
  mockPatch.mockReset().mockResolvedValue({ data: undefined });
  mockDelete.mockReset().mockResolvedValue({ data: undefined });
});

describe('medicationFromApi', () => {
  it('achata e traduz tipo/status/dias', () => {
    const m = medicationFromApi(DTO);
    expect(m).toMatchObject({
      id: 5,
      nome: 'Losartana',
      tipoLabel: 'Genérico',
      status: 'ATIVO',
      statusLabel: 'Ativo',
      dias: ['SEGUNDA', 'QUARTA'],
      diasLabel: 'Segunda, Quarta',
      estoque: 30,
    });
  });

  it('tolera DTO incompleto', () => {
    const m = medicationFromApi({ medicationId: 1 });
    expect(m.dias).toEqual([]);
    expect(m.estoque).toBe(0);
    expect(m.statusLabel).toBe('—');
  });
});

describe('medicationApi', () => {
  it('listMine mapeia o array de GET /medications/me', async () => {
    mockGet.mockResolvedValue({ data: [DTO] });
    const list = await medicationApi.listMine();
    expect(mockGet).toHaveBeenCalledWith('/medications/me');
    expect(list[0].id).toBe(5);
  });

  it('create: POST /medications/user/{patientUserId}', async () => {
    const payload = { nome: 'X', tipo: 'OUTRO', dias: ['SEGUNDA'], hora: '08:00', estoque: 1, status: 'ATIVO', medicineBoxId: 9 };
    await medicationApi.create('user-uuid', payload);
    expect(mockPost).toHaveBeenCalledWith('/medications/user/user-uuid', payload);
  });

  it('setStatus: PATCH /medications/{id}/status?status=', async () => {
    await medicationApi.setStatus(5, 'SUSPENSO');
    expect(mockPatch).toHaveBeenCalledWith('/medications/5/status', null, {
      params: { status: 'SUSPENSO' },
    });
  });

  it('remove: DELETE /medications/{id}', async () => {
    await medicationApi.remove(5);
    expect(mockDelete).toHaveBeenCalledWith('/medications/5');
  });
});
