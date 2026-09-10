// 📁 src/api/httpError.js
//
// Normalização de erros da Mediway API.
// Toda resposta 4xx/5xx do backend segue o `ErrorResponseDTO`:
//   { timestamp, status, error, message, path }
//
// Aqui convertemos qualquer falha (axios, rede, timeout) num único tipo `ApiError`,
// para que as telas nunca precisem inspecionar o objeto cru do axios.

export class ApiError extends Error {
  constructor({ status, message, path, error, code, cause } = {}) {
    super(message || 'Erro inesperado ao comunicar com o servidor.');
    this.name = 'ApiError';
    /** HTTP status (0 quando não houve resposta). */
    this.status = status ?? 0;
    /** Caminho da rota que falhou, quando informado pelo backend. */
    this.path = path ?? null;
    /** Texto curto do erro (campo `error` do DTO), ex.: "Not Found". */
    this.error = error ?? null;
    /** Código local para falhas sem resposta: 'NETWORK' | 'TIMEOUT'. */
    this.code = code ?? null;
    if (cause) this.cause = cause;
  }

  get isNetwork() {
    return this.code === 'NETWORK';
  }
  get isTimeout() {
    return this.code === 'TIMEOUT';
  }
  get isUnauthorized() {
    return this.status === 401;
  }
  get isForbidden() {
    return this.status === 403;
  }
  get isNotFound() {
    return this.status === 404;
  }
  get isConflict() {
    return this.status === 409;
  }
  get isRateLimited() {
    return this.status === 429;
  }
  get isServer() {
    return this.status >= 500;
  }
}

/** Converte um erro do axios (ou qualquer outro) num `ApiError`. */
export function toApiError(err) {
  if (err instanceof ApiError) return err;

  // Timeout do axios.
  if (err?.code === 'ECONNABORTED') {
    return new ApiError({
      code: 'TIMEOUT',
      message: 'A requisição demorou mais do que o esperado. Tente novamente.',
      cause: err,
    });
  }

  // Requisição enviada, mas sem resposta -> problema de rede/servidor fora do ar.
  if (err?.request && !err?.response) {
    return new ApiError({
      code: 'NETWORK',
      message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
      cause: err,
    });
  }

  const response = err?.response;
  const body = response?.data;

  return new ApiError({
    status: response?.status ?? 0,
    message:
      (body && (body.message || body.error)) ||
      err?.message ||
      'Erro inesperado ao comunicar com o servidor.',
    path: body?.path ?? null,
    error: body?.error ?? null,
    cause: err,
  });
}

export const isNotFound = (e) => e instanceof ApiError && e.isNotFound;
export const isConflict = (e) => e instanceof ApiError && e.isConflict;
export const isRateLimited = (e) => e instanceof ApiError && e.isRateLimited;
export const isUnauthorized = (e) => e instanceof ApiError && e.isUnauthorized;

export default ApiError;
