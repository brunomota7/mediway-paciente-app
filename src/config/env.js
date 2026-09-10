// 📁 src/config/env.js
//
// Resolução da URL da Mediway API, por ordem de prioridade:
//   1. process.env.EXPO_PUBLIC_API_URL  (arquivo .env / variável de ambiente do Expo)
//   2. app.json -> expo.extra.apiUrl
//   3. Fallback de desenvolvimento (emulador Android)
//
// Referência de valores por plataforma (ver FASES_INTEGRACAO_API.md §5):
//   - Emulador Android .......... http://10.0.2.2:8080
//   - Simulador iOS ............. http://localhost:8080
//   - Dispositivo físico ........ http://<IP-DA-MAQUINA-NA-LAN>:8080
//   - Homologação / produção ... https://<host>

import Constants from 'expo-constants';

const FALLBACK_DEV_URL = 'http://10.0.2.2:8080';

const extra =
  Constants?.expoConfig?.extra ??
  Constants?.manifest2?.extra?.expoClient?.extra ??
  Constants?.manifest?.extra ??
  {};

const envUrl =
  typeof process.env.EXPO_PUBLIC_API_URL === 'string'
    ? process.env.EXPO_PUBLIC_API_URL.trim()
    : '';

/** URL base do backend, SEM o sufixo `/api/v1`. */
export const API_URL = (envUrl || extra.apiUrl || FALLBACK_DEV_URL).replace(/\/+$/, '');

/** URL base já com o prefixo de versão da API. Use isto no cliente HTTP. */
export const API_BASE = `${API_URL}/api/v1`;

/** Timeout padrão (ms) das requisições HTTP. */
export const REQUEST_TIMEOUT_MS = 15000;

/** `true` quando a URL final aponta para um host de desenvolvimento. */
export const IS_LOCAL_API = /localhost|127\.0\.0\.1|10\.0\.2\.2|192\.168\.|10\.\d+\.\d+\.\d+/.test(
  API_URL,
);

/** `true` se a URL usa HTTP simples (cleartext). */
export const IS_CLEARTEXT = /^http:\/\//i.test(API_URL);

// Cleartext só é aceitável em dev/local. Builds de release do Android bloqueiam
// HTTP por padrão (sem `usesCleartextTraffic`), então produção precisa de HTTPS
// via EXPO_PUBLIC_API_URL. Avisa em DEV quando a URL parece "de produção" e HTTP.
const IS_TEST =
  typeof process !== 'undefined' &&
  (process.env?.JEST_WORKER_ID !== undefined || process.env?.NODE_ENV === 'test');

if (typeof __DEV__ !== 'undefined' && __DEV__ && !IS_TEST && IS_CLEARTEXT && !IS_LOCAL_API) {
  // eslint-disable-next-line no-console
  console.warn(
    `[env] API_URL usa HTTP em host não-local (${API_URL}). Builds de release exigem HTTPS.`,
  );
}

export default { API_URL, API_BASE, REQUEST_TIMEOUT_MS, IS_LOCAL_API, IS_CLEARTEXT };
