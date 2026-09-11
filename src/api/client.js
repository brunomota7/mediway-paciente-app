// 📁 src/api/client.js
//
// Cliente HTTP único do app (axios). NÃO guarda estado de sessão: o token é
// fornecido por callbacks que o AuthContext registra em `configureAuthBridge`.
// Isso evita import circular (client <-> AuthContext) e mantém o client testável.
//
// Como escolher a autenticação por requisição (campo extra no config do axios):
//   { auth: 'bearer' }  -> padrão: usa o accessToken de sessão (SCOPE_PACIENTE)
//   { auth: 'bearer', accessToken } -> força um token específico
//   { auth: 'none' }     -> rota pública (/auth/register, /auth/login, ...)
//   { auth: 'reset', resetToken } -> fluxo de redefinição de senha (SCOPE_RESET)
//
// Robustez:
//   - timeout padrão (REQUEST_TIMEOUT_MS)
//   - 1 retry automático para GET em falha de rede/timeout/5xx
//   - 401 em chamada autenticada -> tenta `POST /auth/refresh` e reexecuta a
//     requisição; só desloga globalmente (motivo 'expired') se o refresh falhar
//   - sinaliza `networkStatus` (faixa "sem conexão")

import axios from 'axios';
import { API_BASE, REQUEST_TIMEOUT_MS } from '../config/env';
import { toApiError } from './httpError';
import { setServerUnreachable } from './networkStatus';

let getAccessToken = () => null;
let handleUnauthorized = () => {};
let refreshSession = async () => null; // -> novo accessToken | null

/** Registrado pelo AuthProvider. */
export function configureAuthBridge({ getToken, onUnauthorized, onRefresh } = {}) {
  if (typeof getToken === 'function') getAccessToken = getToken;
  if (typeof onUnauthorized === 'function') handleUnauthorized = onUnauthorized;
  if (typeof onRefresh === 'function') refreshSession = onRefresh;
}

export const api = axios.create({
  baseURL: API_BASE,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const mode = config.auth ?? 'bearer';

  if (mode === 'none') {
    if (config.headers) delete config.headers.Authorization;
    return config;
  }

  if (mode === 'reset') {
    if (config.resetToken) {
      config.headers.Authorization = `Bearer ${config.resetToken}`;
    }
    return config;
  }

  const token = config.accessToken || getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else if (config.headers) delete config.headers.Authorization;
  return config;
});

const MAX_GET_RETRIES = 1;

function shouldRetry(apiError, config) {
  if (!config || String(config.method || 'get').toLowerCase() !== 'get') return false;
  if ((config.__retryCount ?? 0) >= MAX_GET_RETRIES) return false;
  return apiError.isNetwork || apiError.isTimeout || apiError.isServer;
}

// Uma única tentativa de refresh em voo, compartilhada por todas as requisições
// que tomaram 401 ao mesmo tempo.
let inFlightRefresh = null;
function runRefreshOnce() {
  if (!inFlightRefresh) {
    inFlightRefresh = Promise.resolve()
      .then(() => refreshSession())
      .catch(() => null)
      .finally(() => {
        setTimeout(() => {
          inFlightRefresh = null;
        }, 0);
      });
  }
  return inFlightRefresh;
}

api.interceptors.response.use(
  (response) => {
    setServerUnreachable(false);
    return response;
  },
  async (error) => {
    const apiError = toApiError(error);
    const config = error?.config;
    const mode = config?.auth ?? 'bearer';

    if (apiError.isNetwork || apiError.isTimeout) setServerUnreachable(true);

    // Retry idempotente para GET.
    if (shouldRetry(apiError, config)) {
      config.__retryCount = (config.__retryCount ?? 0) + 1;
      const delay = 400 * config.__retryCount;
      await new Promise((r) => setTimeout(r, delay));
      return api(config);
    }

    // 401 numa chamada autenticada -> tenta renovar via refresh token antes de deslogar.
    if (apiError.isUnauthorized && mode === 'bearer' && config && !config.__didAuthRefresh) {
      const newToken = await runRefreshOnce();
      if (newToken) {
        config.__didAuthRefresh = true;
        config.accessToken = newToken;
        return api(config);
      }
      try {
        handleUnauthorized('expired');
      } catch (_) {
        /* noop */
      }
    }

    if (__DEV__) {
      const method = String(config?.method || 'get').toUpperCase();
      const url = config?.url || '';
      // eslint-disable-next-line no-console
      console.warn(`[api] ${method} ${url} -> ${apiError.status || apiError.code}: ${apiError.message}`);
    }

    return Promise.reject(apiError);
  },
);

export default api;
