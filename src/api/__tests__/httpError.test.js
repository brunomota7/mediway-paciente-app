import {
  ApiError,
  toApiError,
  isNotFound,
  isConflict,
  isRateLimited,
  isUnauthorized,
} from '../httpError';

describe('ApiError getters', () => {
  it('classifica por status', () => {
    expect(new ApiError({ status: 401 }).isUnauthorized).toBe(true);
    expect(new ApiError({ status: 403 }).isForbidden).toBe(true);
    expect(new ApiError({ status: 404 }).isNotFound).toBe(true);
    expect(new ApiError({ status: 409 }).isConflict).toBe(true);
    expect(new ApiError({ status: 429 }).isRateLimited).toBe(true);
    expect(new ApiError({ status: 500 }).isServer).toBe(true);
    expect(new ApiError({ status: 503 }).isServer).toBe(true);
  });
  it('classifica por code', () => {
    expect(new ApiError({ code: 'NETWORK' }).isNetwork).toBe(true);
    expect(new ApiError({ code: 'TIMEOUT' }).isTimeout).toBe(true);
  });
  it('mensagem padrão quando ausente', () => {
    expect(new ApiError({}).message).toMatch(/inesperado/i);
  });
});

describe('toApiError', () => {
  it('repassa um ApiError inalterado', () => {
    const e = new ApiError({ status: 404 });
    expect(toApiError(e)).toBe(e);
  });

  it('ECONNABORTED -> TIMEOUT', () => {
    const e = toApiError({ code: 'ECONNABORTED', message: 'timeout of 15000ms exceeded' });
    expect(e).toBeInstanceOf(ApiError);
    expect(e.isTimeout).toBe(true);
  });

  it('request sem response -> NETWORK', () => {
    const e = toApiError({ request: {}, message: 'Network Error' });
    expect(e.isNetwork).toBe(true);
  });

  it('response com ErrorResponseDTO -> status/message/path', () => {
    const e = toApiError({
      response: {
        status: 409,
        data: {
          status: 409,
          error: 'Conflict',
          message: 'numeroSerie já está em uso',
          path: '/api/v1/medicine-box/register/x',
        },
      },
    });
    expect(e.status).toBe(409);
    expect(e.isConflict).toBe(true);
    expect(e.message).toBe('numeroSerie já está em uso');
    expect(e.path).toBe('/api/v1/medicine-box/register/x');
    expect(e.error).toBe('Conflict');
  });

  it('response sem body usa err.message', () => {
    const e = toApiError({ response: { status: 500, data: undefined }, message: 'Request failed' });
    expect(e.status).toBe(500);
    expect(e.message).toBe('Request failed');
  });
});

describe('helpers', () => {
  it('is* narram só ApiError', () => {
    expect(isNotFound(new ApiError({ status: 404 }))).toBe(true);
    expect(isConflict(new ApiError({ status: 409 }))).toBe(true);
    expect(isRateLimited(new ApiError({ status: 429 }))).toBe(true);
    expect(isUnauthorized(new ApiError({ status: 401 }))).toBe(true);
    expect(isNotFound(new Error('x'))).toBe(false);
  });
});
