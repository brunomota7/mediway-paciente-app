// 📁 src/auth/AuthContext.js
//
// Fonte única da verdade sobre autenticação. Faz o "bootstrap" da sessão ao
// abrir o app e expõe as ações de entrar/sair. A navegação condicional
// (RootNavigator) reage ao campo `status`.
//
// Máquina de estados (`status`):
//   'loading'         -> lendo o SecureStore (tela de carregamento)
//   'signedOut'       -> sem sessão válida  -> AuthStack
//   'needsOnboarding' -> logado, sem cadastro clínico -> OnboardingStack  (Fase 2)
//   'signedIn'        -> logado e pronto -> AppStack
//
// Fase 0: o bootstrap considera "logado" a simples presença de um token não
// expirado. A partir da Fase 1/2 ele também chama `GET /patients/me` para
// distinguir `signedIn` de `needsOnboarding` e carregar `user`.

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { configureAuthBridge } from '../api/client';
import { clearSession, isExpired, loadSession, saveSession } from './session';

export const AuthContext = createContext(null);

const INITIAL_STATE = {
  status: 'loading',
  accessToken: null,
  roles: [],
  expiresAt: null,
  user: null, // preenchido a partir da Fase 2 (GET /patients/me)
};

export function AuthProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);

  // Cópia síncrona do token para o interceptor do axios (que não é um hook).
  const tokenRef = useRef(null);

  const applySession = useCallback((session, nextStatus) => {
    tokenRef.current = session?.accessToken ?? null;
    setState((prev) => ({
      ...prev,
      status: nextStatus,
      accessToken: session?.accessToken ?? null,
      roles: session?.roles ?? [],
      expiresAt: session?.expiresAt ?? null,
      user: nextStatus === 'signedOut' ? null : prev.user,
    }));
  }, []);

  const signOut = useCallback(async () => {
    tokenRef.current = null;
    await clearSession();
    setState({ ...INITIAL_STATE, status: 'signedOut' });
  }, []);

  /** Recebe a resposta de `POST /auth/login` e persiste a sessão. */
  const signIn = useCallback(
    async ({ accessToken, expiresIn, roles }) => {
      const session = await saveSession({ accessToken, expiresIn, roles });
      // Fase 2: buscar /patients/me aqui e decidir 'needsOnboarding' vs 'signedIn'.
      applySession(session, 'signedIn');
      return session;
    },
    [applySession],
  );

  /** Usado pelas próximas fases após `GET /patients/me`. */
  const setUser = useCallback((user) => {
    setState((prev) => ({ ...prev, user }));
  }, []);

  /** Troca explícita de status (ex.: 'needsOnboarding' -> 'signedIn' na Fase 2). */
  const setStatus = useCallback((status) => {
    setState((prev) => ({ ...prev, status }));
  }, []);

  // Liga o cliente HTTP à sessão: leitura do token + logout automático em 401.
  useEffect(() => {
    configureAuthBridge({
      getToken: () => tokenRef.current,
      onUnauthorized: () => {
        signOut();
      },
    });
  }, [signOut]);

  // Bootstrap: roda uma vez ao montar.
  useEffect(() => {
    let alive = true;
    (async () => {
      const session = await loadSession();
      if (!alive) return;

      if (!session || isExpired(session)) {
        if (session) await clearSession();
        applySession(null, 'signedOut');
        return;
      }

      // Fase 0: token válido presente já basta.
      applySession(session, 'signedIn');
    })();
    return () => {
      alive = false;
    };
  }, [applySession]);

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated:
        state.status === 'signedIn' || state.status === 'needsOnboarding',
      signIn,
      signOut,
      setUser,
      setStatus,
    }),
    [state, signIn, signOut, setUser, setStatus],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
