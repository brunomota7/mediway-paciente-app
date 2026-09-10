// 📁 src/auth/session.js
//
// Sessão persistida no armazenamento seguro do dispositivo (Keychain no iOS,
// Keystore no Android) via expo-secure-store.
//
// Formato guardado (JSON):
//   { accessToken: string, expiresAt: number (epoch ms), roles: string[] }
//
// O `tokenTemp` (SCOPE_RESET) do fluxo de redefinição de senha NÃO é guardado
// aqui — ele vive apenas em memória durante o fluxo (ver Fase 1).

import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'mediway.session.v1';

/** Salva a sessão a partir da resposta de `POST /auth/login`. */
export async function saveSession({ accessToken, expiresIn, roles }) {
  const expiresAt = Date.now() + (Number(expiresIn) || 0) * 1000;
  const session = { accessToken, expiresAt, roles: Array.isArray(roles) ? roles : [] };
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  return session;
}

/** Lê a sessão guardada (ou `null` se não houver / estiver corrompida). */
export async function loadSession() {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.accessToken !== 'string' || !parsed.accessToken) {
      return null;
    }
    return {
      accessToken: parsed.accessToken,
      expiresAt: Number(parsed.expiresAt) || 0,
      roles: Array.isArray(parsed.roles) ? parsed.roles : [],
    };
  } catch (_) {
    return null;
  }
}

/** Apaga a sessão (logout / 401 / token expirado). */
export async function clearSession() {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch (_) {
    /* noop */
  }
}

/**
 * `true` se o token já expirou (ou expira dentro de `skewMs`).
 * A API não tem refresh token — expirado significa "precisa logar de novo".
 */
export function isExpired(session, skewMs = 30_000) {
  if (!session || !session.expiresAt) return true;
  return Date.now() >= session.expiresAt - skewMs;
}

export default { saveSession, loadSession, clearSession, isExpired };
