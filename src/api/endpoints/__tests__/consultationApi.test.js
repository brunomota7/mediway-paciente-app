const mockGet = jest.fn();
jest.mock('../../client', () => ({ api: { get: (...a) => mockGet(...a) } }));

const { consultationApi, consultationFromApi } = require('../consultationApi');

const DTO = {
  consultationId: 12,
  status: 'MARCADO',
  patient: { name: 'Ana', email: 'a@a.com', number: '11' },
  doctor: { name: 'Dr. House', specialty: 'Cardiologia' },
  details: {
    consultationDate: '2026-10-01',
    consultationTime: '14:30',
    localConsultation: 'Clínica Central',
    description: 'Revisão anual',
    requirements: 'Jejum',
  },
};

beforeEach(() => {
  mockGet.mockReset().mockResolvedValue({ data: [] });
});

describe('consultationFromApi', () => {
  it('achata details/doctor e traduz o status', () => {
    const c = consultationFromApi(DTO);
    expect(c).toMatchObject({
      id: 12,
      status: 'MARCADO',
      statusLabel: 'Marcado',
      title: 'Consulta • Cardiologia',
      doctorName: 'Dr. House',
      date: '2026-10-01',
      time: '14:30',
      local: 'Clínica Central',
      description: 'Revisão anual',
      requirements: 'Jejum',
    });
  });

  it('tolera DTO incompleto', () => {
    const c = consultationFromApi({ consultationId: 1 });
    expect(c.id).toBe(1);
    expect(c.title).toBe('Consulta');
    expect(c.statusLabel).toBe('—');
  });
});

describe('consultationApi', () => {
  it('listMine: GET /consultation/me e mapeia o array', async () => {
    mockGet.mockResolvedValue({ data: [DTO, { consultationId: 2, status: 'REALIZADO', details: {} }] });
    const list = await consultationApi.listMine();
    expect(mockGet).toHaveBeenCalledWith('/consultation/me');
    expect(list).toHaveLength(2);
    expect(list[1]).toMatchObject({ id: 2, statusLabel: 'Realizado' });
  });

  it('listMine: resposta não-array vira []', async () => {
    mockGet.mockResolvedValue({ data: null });
    expect(await consultationApi.listMine()).toEqual([]);
  });

  it('getById: GET /consultation/{id} adaptado', async () => {
    mockGet.mockResolvedValue({ data: DTO });
    const c = await consultationApi.getById(12);
    expect(mockGet).toHaveBeenCalledWith('/consultation/12');
    expect(c.id).toBe(12);
  });
});
