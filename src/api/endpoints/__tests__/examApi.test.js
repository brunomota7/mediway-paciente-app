const mockGet = jest.fn();
jest.mock('../../client', () => ({ api: { get: (...a) => mockGet(...a) } }));

const { examApi, examFromApi } = require('../examApi');

const DTO = {
  examId: 7,
  requestDate: '2026-09-01T09:00:00',
  patient: { name: 'Ana', email: 'a@a.com' },
  exam: {
    examDate: '2026-09-20',
    examTime: '08:00',
    typeExam: 'Hemograma',
    requirements: 'Jejum de 12h',
    status: 'REALIZADO',
    local: 'Lab Central',
  },
};

beforeEach(() => {
  mockGet.mockReset().mockResolvedValue({ data: [] });
});

describe('examFromApi', () => {
  it('achata exam e traduz o status', () => {
    const e = examFromApi(DTO);
    expect(e).toMatchObject({
      id: 7,
      requestDate: '2026-09-01T09:00:00',
      status: 'REALIZADO',
      statusLabel: 'Realizado',
      title: 'Hemograma',
      date: '2026-09-20',
      time: '08:00',
      local: 'Lab Central',
      requirements: 'Jejum de 12h',
    });
  });

  it('tolera DTO incompleto', () => {
    const e = examFromApi({ examId: 1 });
    expect(e.id).toBe(1);
    expect(e.title).toBe('Exame');
    expect(e.statusLabel).toBe('—');
  });
});

describe('examApi', () => {
  it('listMine: GET /exam/me e mapeia', async () => {
    mockGet.mockResolvedValue({ data: [DTO] });
    const list = await examApi.listMine();
    expect(mockGet).toHaveBeenCalledWith('/exam/me');
    expect(list[0]).toMatchObject({ id: 7, statusLabel: 'Realizado' });
  });

  it('getById: GET /exam/{id}', async () => {
    mockGet.mockResolvedValue({ data: DTO });
    const e = await examApi.getById(7);
    expect(mockGet).toHaveBeenCalledWith('/exam/7');
    expect(e.id).toBe(7);
  });
});
