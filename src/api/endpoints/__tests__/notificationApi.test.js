const mockGet = jest.fn();
const mockPatch = jest.fn();
const mockDelete = jest.fn();
jest.mock('../../client', () => ({
  api: {
    get: (...a) => mockGet(...a),
    patch: (...a) => mockPatch(...a),
    delete: (...a) => mockDelete(...a),
  },
}));

const { notificationApi, notificationFromApi } = require('../notificationApi');

const DTO = {
  id: 9,
  title: 'Consulta amanhã',
  message: 'Cardiologista às 14h',
  type: 'CONSULTA',
  read: false,
  createdAt: '2026-09-10T09:00:00',
};

beforeEach(() => {
  mockGet.mockReset().mockResolvedValue({ data: [DTO] });
  mockPatch.mockReset().mockResolvedValue({ data: undefined });
  mockDelete.mockReset().mockResolvedValue({ data: undefined });
});

describe('notificationFromApi', () => {
  it('adapta e traduz o tipo', () => {
    expect(notificationFromApi(DTO)).toMatchObject({
      id: 9,
      title: 'Consulta amanhã',
      type: 'CONSULTA',
      typeLabel: 'Consulta',
      read: false,
      createdAtLabel: '10/09/2026 09:00',
    });
  });
  it('read vira boolean e tipo ausente -> Geral', () => {
    const n = notificationFromApi({ id: 1, read: undefined });
    expect(n.read).toBe(false);
    expect(n.typeLabel).toBe('Geral');
  });
});

describe('notificationApi', () => {
  it('listMine: GET /notifications/me?unreadOnly=', async () => {
    await notificationApi.listMine({ unreadOnly: true });
    expect(mockGet).toHaveBeenCalledWith('/notifications/me', { params: { unreadOnly: true } });
  });

  it('listMine: default unreadOnly=false + tolera não-array', async () => {
    mockGet.mockResolvedValueOnce({ data: null });
    const r = await notificationApi.listMine();
    expect(mockGet).toHaveBeenCalledWith('/notifications/me', { params: { unreadOnly: false } });
    expect(r).toEqual([]);
  });

  it('markRead: PATCH /notifications/{id}/read', async () => {
    await notificationApi.markRead(9);
    expect(mockPatch).toHaveBeenCalledWith('/notifications/9/read');
  });

  it('remove: DELETE /notifications/{id}', async () => {
    await notificationApi.remove(9);
    expect(mockDelete).toHaveBeenCalledWith('/notifications/9');
  });
});
