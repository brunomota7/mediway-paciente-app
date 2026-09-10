// 📁 src/api/endpoints/authApi.js
//
// Endpoints globais de autenticação (/api/v1/auth). Ver FASES_INTEGRACAO_API.md §2.1.
// Todas as rotas são públicas (auth: 'none'), exceto `resetPassword`, que usa o
// tokenTemp (SCOPE_RESET) devolvido por `validateCode` (auth: 'reset').

import { api } from '../client';

export const authApi = {
  /** A1 — POST /auth/register. Cria o usuário paciente. Resposta 201 sem corpo. */
  register: ({ name, email, number, password }) =>
    api.post(
      '/auth/register',
      { name, email, number, password, role: 'PACIENTE' },
      { auth: 'none' },
    ),

  /** A2 — POST /auth/login. Devolve { accessToken, expiresIn, roles }. */
  login: async ({ email, password }) => {
    const { data } = await api.post(
      '/auth/login',
      { email, password },
      { auth: 'none' },
    );
    return data;
  },

  /** A3 — POST /auth/request-reset. Envia o código de 6 dígitos (rate limit 5/h por IP). */
  requestReset: ({ identifier }) =>
    api.post('/auth/request-reset', { identifier }, { auth: 'none' }),

  /** A4 — POST /auth/validate-code. Devolve { tokenTemp } (rate limit 5/min por IP). */
  validateCode: async ({ code }) => {
    const { data } = await api.post(
      '/auth/validate-code',
      { code },
      { auth: 'none' },
    );
    return data;
  },

  /** A5 — POST /auth/reset-password. Bearer = tokenTemp. Resposta 200 sem corpo. */
  resetPassword: ({ newPassword, resetToken }) =>
    api.post(
      '/auth/reset-password',
      { newPassword },
      { auth: 'reset', resetToken },
    ),
};

export default authApi;
