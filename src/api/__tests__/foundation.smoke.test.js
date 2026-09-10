/**
 * Smoke test da Fase 0: garante que os módulos-base carregam e se conectam
 * (sem depender de rede nem de módulos nativos reais).
 */

jest.mock('expo-secure-store', () => {
  const store = new Map();
  return {
    setItemAsync: jest.fn((k, v) => { store.set(k, v); return Promise.resolve(); }),
    getItemAsync: jest.fn((k) => Promise.resolve(store.get(k) ?? null)),
    deleteItemAsync: jest.fn((k) => { store.delete(k); return Promise.resolve(); }),
  };
});

jest.mock('expo-constants', () => ({ expoConfig: { extra: { apiUrl: 'http://example.test:8080' } } }));

describe('Fase 0 — fundação', () => {
  it('config/env resolve API_BASE com prefixo /api/v1', () => {
    const { API_BASE, API_URL } = require('../../config/env');
    expect(API_URL).toBe('http://example.test:8080');
    expect(API_BASE).toBe('http://example.test:8080/api/v1');
  });

  it('api/client cria instância axios com baseURL e helpers de auth-bridge', () => {
    const mod = require('../client');
    expect(mod.api.defaults.baseURL).toBe('http://example.test:8080/api/v1');
    expect(typeof mod.configureAuthBridge).toBe('function');
  });

  it('httpError classifica status', () => {
    const { ApiError } = require('../httpError');
    expect(new ApiError({ status: 401 }).isUnauthorized).toBe(true);
    expect(new ApiError({ status: 409 }).isConflict).toBe(true);
    expect(new ApiError({ code: 'NETWORK' }).isNetwork).toBe(true);
  });

  it('queryClient não repete 401/409', () => {
    const { queryClient } = require('../queryClient');
    const { ApiError } = require('../httpError');
    const retry = queryClient.getDefaultOptions().queries.retry;
    expect(retry(0, new ApiError({ status: 401 }))).toBe(false);
    expect(retry(0, new ApiError({ status: 500 }))).toBe(true);
    expect(retry(5, new ApiError({ status: 500 }))).toBe(false);
  });

  it('auth/session salva, lê e expira', async () => {
    jest.resetModules();
    const { saveSession, loadSession, clearSession, isExpired } = require('../../auth/session');
    await saveSession({ accessToken: 'tok', expiresIn: 3600, roles: ['PACIENTE'] });
    const s = await loadSession();
    expect(s.accessToken).toBe('tok');
    expect(s.roles).toEqual(['PACIENTE']);
    expect(isExpired(s)).toBe(false);
    expect(isExpired({ accessToken: 'x', expiresAt: Date.now() - 1000 })).toBe(true);
    await clearSession();
    expect(await loadSession()).toBeNull();
  });
});
