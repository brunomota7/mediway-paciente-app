const mockGet = jest.fn();
jest.mock('../../client', () => ({ api: { get: (...a) => mockGet(...a) } }));

const { treatmentApi, treatmentFromApi } = require('../treatmentApi');

const DTO = {
  treatmentId: 4,
  patientUserId: 'pat-uuid',
  nome: 'Fisioterapia motora',
  descricao: '2x por semana',
  dataInicio: '2026-09-01',
  dataFim: '2026-12-01',
  status: 'ATIVO',
  createdAt: '2026-09-10T08:00:00',
};

beforeEach(() => {
  mockGet.mockReset().mockResolvedValue({ data: DTO });
});

describe('treatmentFromApi', () => {
  it('achata, traduz status e formata datas', () => {
    expect(treatmentFromApi(DTO)).toMatchObject({
      id: 4,
      patientUserId: 'pat-uuid',
      nome: 'Fisioterapia motora',
      status: 'ATIVO',
      statusLabel: 'Ativo',
      dataInicioLabel: '01/09/2026',
      dataFimLabel: '01/12/2026',
    });
  });
  it('tolera DTO incompleto', () => {
    const t = treatmentFromApi({ treatmentId: 1 });
    expect(t.id).toBe(1);
    expect(t.statusLabel).toBe('—');
    expect(t.dataFimLabel).toBe('');
  });
});

describe('treatmentApi', () => {
  it('listMine: GET /treatment/me -> array adaptado', async () => {
    mockGet.mockResolvedValueOnce({ data: [DTO, DTO] });
    const list = await treatmentApi.listMine();
    expect(mockGet).toHaveBeenCalledWith('/treatment/me');
    expect(list).toHaveLength(2);
  });
  it('listMine: tolera resposta não-array', async () => {
    mockGet.mockResolvedValueOnce({ data: null });
    expect(await treatmentApi.listMine()).toEqual([]);
  });

  it('getById: GET /treatment/{id}', async () => {
    const t = await treatmentApi.getById(4);
    expect(mockGet).toHaveBeenCalledWith('/treatment/4');
    expect(t.id).toBe(4);
  });
});
