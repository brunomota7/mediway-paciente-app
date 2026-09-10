// 📁 src/api/networkStatus.js
//
// Sinal simples de "servidor inalcançável", alimentado pelo interceptor do
// cliente HTTP: fica `true` após um erro de rede/timeout e volta a `false` na
// primeira resposta bem-sucedida. Não é um monitor de conectividade do SO —
// é "a última requisição ao backend falhou por rede".

import { useSyncExternalStore } from 'react';

let serverUnreachable = false;
const listeners = new Set();

function emit() {
  for (const l of listeners) l();
}

export function setServerUnreachable(value) {
  const next = Boolean(value);
  if (next === serverUnreachable) return;
  serverUnreachable = next;
  emit();
}

export function isServerUnreachable() {
  return serverUnreachable;
}

function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Hook de UI: `true` quando a última chamada ao backend falhou por rede. */
export function useServerUnreachable() {
  return useSyncExternalStore(subscribe, isServerUnreachable, isServerUnreachable);
}

export default { setServerUnreachable, isServerUnreachable, useServerUnreachable };
