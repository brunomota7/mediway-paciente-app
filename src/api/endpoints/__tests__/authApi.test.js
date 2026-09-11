const mockPost = jest.fn();
const mockPut = jest.fn();
jest.mock('../../client', () => ({
  api: { post: (...a) => mockPost(...a), put: (...a) => mockPut(...a) },
}));

const { authApi } = require('../authApi');

beforeEach(() => {
  mockPost.mockReset();
  mockPost.mockResolvedValue({ data: {} });
  mockPut.mockReset().mockResolvedValue({ data: undefined });
});

describe('authApi', () => {
  it('register: injeta role PACIENTE e marca rota pública', async () => {
    await authApi.register({
      name: 'Ana',
      email: 'ana@x.com',
      number: '11999998888',
      password: 'senhaforte1',
    });
    expect(mockPost).toHaveBeenCalledWith(
      '/auth/register',
      {
        name: 'Ana',
        email: 'ana@x.com',
        number: '11999998888',
        password: 'senhaforte1',
        role: 'PACIENTE',
      },
      { auth: 'none' },
    );
  });

  it('login: retorna o corpo da resposta (incl. refreshToken)', async () => {
    mockPost.mockResolvedValue({
      data: { accessToken: 'jwt', refreshToken: 'rt', expiresIn: 172800, roles: ['PACIENTE'] },
    });
    const data = await authApi.login({ email: 'a@a.com', password: 'x' });
    expect(data).toEqual({ accessToken: 'jwt', refreshToken: 'rt', expiresIn: 172800, roles: ['PACIENTE'] });
    expect(mockPost).toHaveBeenCalledWith(
      '/auth/login',
      { email: 'a@a.com', password: 'x' },
      { auth: 'none' },
    );
  });

  it('refresh: POST /auth/refresh (rota pública) -> { accessToken, expiresIn }', async () => {
    mockPost.mockResolvedValue({ data: { accessToken: 'novo', expiresIn: 172800 } });
    const data = await authApi.refresh('rt');
    expect(data).toEqual({ accessToken: 'novo', expiresIn: 172800 });
    expect(mockPost).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'rt' }, { auth: 'none' });
  });

  it('requestReset: envia identifier em rota pública', async () => {
    await authApi.requestReset({ identifier: 'a@a.com' });
    expect(mockPost).toHaveBeenCalledWith(
      '/auth/request-reset',
      { identifier: 'a@a.com' },
      { auth: 'none' },
    );
  });

  it('validateCode: retorna { tokenTemp }', async () => {
    mockPost.mockResolvedValue({ data: { tokenTemp: 'temp-jwt' } });
    const data = await authApi.validateCode({ code: '123456' });
    expect(data).toEqual({ tokenTemp: 'temp-jwt' });
    expect(mockPost).toHaveBeenCalledWith(
      '/auth/validate-code',
      { code: '123456' },
      { auth: 'none' },
    );
  });

  it('resetPassword: usa auth reset + resetToken e não envia o token no corpo', async () => {
    await authApi.resetPassword({ newPassword: 'novasenha1', resetToken: 'temp-jwt' });
    expect(mockPost).toHaveBeenCalledWith(
      '/auth/reset-password',
      { newPassword: 'novasenha1' },
      { auth: 'reset', resetToken: 'temp-jwt' },
    );
  });

  it('changePassword: PUT /auth/change-password (Bearer normal)', async () => {
    await authApi.changePassword({ currentPassword: 'atual123', newPassword: 'novasenha1' });
    expect(mockPut).toHaveBeenCalledWith('/auth/change-password', {
      currentPassword: 'atual123',
      newPassword: 'novasenha1',
    });
  });
});
