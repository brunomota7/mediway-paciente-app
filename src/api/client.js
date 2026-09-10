// 📁 src/api/client.js
//
// Cliente HTTP único do app (axios). NÃO guarda estado de sessão: o token é
// fornecido por callbacks que o AuthContext registra em `configureAuthBridge`.
// Isso evita import circular (client <-> AuthContext) e mantém o client testável.
//
// Como escolher a autenticação por requisição (campo extra no config do axios):
//   { auth: 'bearer' }  -> padrão: usa o accessToken de sessão (SCOPE_PACIENTE)
//   { auth: 'none' }     -> rota pública (/auth/register, /auth/login, ...)
//   { auth: 'reset', resetToken } -> fluxo de redefinição de senha (SCOPE_RESET)

import axios from 'axios';
import { API_BASE, REQUEST_TIMEOUT_MS } from '../config/env';
import { toApiError } from './httpError';

let getAccessToken = () => null;
let handleUnauthorized = () => {};

/** Registrado pelo AuthProvider. */
export function configureAuthBridge({ getToken, onUnauthorized } = {}) {
  if (typeof getToken === 'function') getAccessToken = getToken;
  if (typeof onUnauthorized === 'function') handleUnauthorized = onUnauthorized;
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

  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else if (config.headers) delete config.headers.Authorization;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = toApiError(error);
    const mode = error?.config?.auth ?? 'bearer';

    // 401 numa chamada autenticada -> encerra a sessão globalmente.
    if (apiError.isUnauthorized && mode === 'bearer') {
      try {
        handleUnauthorized();
      } catch (_) {
        /* noop */
      }
    }

    if (__DEV__) {
      const method = (error?.config?.method || 'get').toUpperCase();
      const url = error?.config?.url || '';
      // eslint-disable-next-line no-console
      console.warn(`[api] ${method} ${url} -> ${apiError.status || apiError.code}: ${apiError.message}`);
    }

    return Promise.reject(apiError);
  },
);

export default api;
