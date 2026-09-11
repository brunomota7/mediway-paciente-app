const mockGet = jest.fn();
jest.mock('../../client', () => ({ api: { get: (...a) => mockGet(...a) } }));

const { vaccineApi, vaccineFromApi } = require('../vaccineApi');
const { ApiError } = require('../../httpError');

const DTO = {
  vaccineId: 9,
  nome: 'Hepatite B',
  tipoDose: 'PRIMEIRA_DOSE',
  dataVacinou: '2026-02-12T08:30:00',
  lote: 'A123',
  dataFabricacao: '2026-01-01',
  proximaDose: '2026-03-12',
  status: 'APLICADA',
  patientId: 'p-uuid',
};

beforeEach(() => {
  mockGet.mockReset().mockResolvedValue({ data: [] });
});

describe('vaccineFromApi', () => {
  it('traduz tipoDose/status e formata datas', () => {
    const v = vaccineFromApi(DTO);
    expect(v).toMatchObject({
      id: 9,
      nome: 'Hepatite B',
      tipoDoseLabel: 'Primeira dose',
      statusLabel: 'Aplicada',
      dataVacinouLabel: '12/02/2026 08:30',
      dataFabricacaoLabel: '01/01/2026',
      proximaDoseLabel: '12/03/2026',
    });
  });

  it('tolera DTO incompleto', () => {
    const v = vaccineFromApi({ vaccineId: 1 });
    expect(v.tipoDoseLabel).toBe('—');
    expect(v.statusLabel).toBe('—');
    expect(v.dataVacinouLabel).toBe('');
  });
});

describe('vaccineApi', () => {
  it('listMine: GET /vaccine/me e mapeia', async () => {
    mockGet.mockResolvedValue({ data: [DTO] });
    const list = await vaccineApi.listMine();
    expect(mockGet).toHaveBeenCalledWith('/vaccine/me');
    expect(list[0].id).toBe(9);
  });

  it('listMine: resposta não-array vira []', async () => {
    mockGet.mockResolvedValue({ data: {} });
    expect(await vaccineApi.listMine()).toEqual([]);
  });

  it('getById: GET /vaccine/{id} adaptado', async () => {
    mockGet.mockResolvedValue({ data: DTO });
    const v = await vaccineApi.getById(9);
    expect(mockGet).toHaveBeenCalledWith('/vaccine/9');
    expect(v.id).toBe(9);
  });

  it('getById: 404 -> null (B2 corrigido)', async () => {
    mockGet.mockRejectedValue(new ApiError({ status: 404 }));
    expect(await vaccineApi.getById(999)).toBeNull();
  });

  it('getById: 500 agora propaga (não é mais tratado como "não encontrada")', async () => {
    mockGet.mockRejectedValue(new ApiError({ status: 500 }));
    await expect(vaccineApi.getById(999)).rejects.toBeInstanceOf(ApiError);
  });

  it('getById: erro de rede propaga', async () => {
    mockGet.mockRejectedValue(new ApiError({ code: 'NETWORK' }));
    await expect(vaccineApi.getById(1)).rejects.toBeInstanceOf(ApiError);
  });
});
