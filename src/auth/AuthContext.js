// 📁 src/auth/AuthContext.js
//
// Fonte única da verdade sobre autenticação. Faz o "bootstrap" da sessão ao
// abrir o app e expõe as ações de entrar/sair. A navegação condicional
// (RootNavigator) reage ao campo `status`.
//
// Máquina de estados (`status`):
//   'loading'         -> lendo o SecureStore / consultando /patients/me
//   'signedOut'       -> sem sessão válida  -> AuthStack
//   'needsOnboarding' -> logado, sem cadastro clínico -> OnboardingStack (Fase 2)
//   'signedIn'        -> logado e com cadastro clínico -> AppStack
//
// `reason` acompanha o `signedOut`: 'expired' quando a saída foi automática
// (401 ou token vencido) — a tela de login mostra o aviso (L11).

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';

import { configureAuthBridge } from '../api/client';
import { ApiError } from '../api/httpError';
import { patientApi } from '../api/endpoints/patientApi';
import { clearSession, isExpired, loadSession, saveSession } from './session';

export const AuthContext = createContext(null);

const INITIAL_STATE = {
  status: 'loading',
  accessToken: null,
  roles: [],
  expiresAt: null,
  user: null,
  reason: null,
};

export function AuthProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);

  // Cópias síncronas para os interceptors / listeners (que não são hooks).
  const tokenRef = useRef(null);
  const expiresAtRef = useRef(null);

  const applyToken = useCallback((session) => {
    tokenRef.current = session?.accessToken ?? null;
    expiresAtRef.current = session?.expiresAt ?? null;
    setState((prev) => ({
      ...prev,
      accessToken: session?.accessToken ?? null,
      roles: session?.roles ?? prev.roles,
      expiresAt: session?.expiresAt ?? prev.expiresAt,
    }));
  }, []);

  const signOut = useCallback(async (reason = null) => {
    tokenRef.current = null;
    expiresAtRef.current = null;
    await clearSession();
    setState({ ...INITIAL_STATE, status: 'signedOut', reason });
  }, []);

  const clearReason = useCallback(() => {
    setState((prev) => (prev.reason ? { ...prev, reason: null } : prev));
  }, []);

  /**
   * Com uma sessão local válida, consulta `/patients/me` e define o status.
   * - 401/403 -> sessão inválida no servidor -> signOut('expired')
   * - rede/5xx/timeout -> mantém logado (otimista); `user` fica null
   */
  const resolveSession = useCallback(
    async (session) => {
      applyToken(session);
      try {
        const user = await patientApi.getMe();
        setState((prev) => ({
          ...prev,
          user,
          reason: null,
          status: user.hasMedicalInfo ? 'signedIn' : 'needsOnboarding',
        }));
        return user;
      } catch (err) {
        if (err instanceof ApiError && (err.isUnauthorized || err.isForbidden)) {
          await signOut('expired');
          return null;
        }
        // Falha transitória: segue logado, sem dados de perfil.
        setState((prev) => ({ ...prev, user: null, status: 'signedIn' }));
        return null;
      }
    },
    [applyToken, signOut],
  );

  /** Recebe a resposta de `POST /auth/login` e persiste a sessão. */
  const signIn = useCallback(
    async ({ accessToken, expiresIn, roles }) => {
      const session = await saveSession({ accessToken, expiresIn, roles });
      await resolveSession(session);
      return session;
    },
    [resolveSession],
  );

  /** Re-consulta `/patients/me` (ex.: após concluir o onboarding na Fase 2). */
  const refreshMe = useCallback(async () => {
    if (!tokenRef.current) return null;
    return resolveSession({
      accessToken: tokenRef.current,
      expiresAt: expiresAtRef.current,
      roles: state.roles,
    });
  }, [resolveSession, state.roles]);

  const setUser = useCallback((user) => {
    setState((prev) => ({ ...prev, user }));
  }, []);

  const setStatus = useCallback((status) => {
    setState((prev) => ({ ...prev, status }));
  }, []);

  // Liga o cliente HTTP à sessão: leitura do token + logout automático em 401.
  useEffect(() => {
    configureAuthBridge({
      getToken: () => tokenRef.current,
      onUnauthorized: (reason) => {
        signOut(reason || 'expired');
      },
    });
  }, [signOut]);

  // Token vencido enquanto o app estava em background -> desloga ao voltar.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next !== 'active') return;
      if (tokenRef.current && expiresAtRef.current && Date.now() >= expiresAtRef.current) {
        signOut('expired');
      }
    });
    return () => sub.remove();
  }, [signOut]);

  // Bootstrap: roda uma vez ao montar.
  useEffect(() => {
    let alive = true;
    (async () => {
      const session = await loadSession();
      if (!alive) return;

      if (!session || isExpired(session)) {
        if (session) {
          await clearSession();
          setState({ ...INITIAL_STATE, status: 'signedOut', reason: 'expired' });
        } else {
          setState({ ...INITIAL_STATE, status: 'signedOut' });
        }
        return;
      }
      await resolveSession(session);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated:
        state.status === 'signedIn' || state.status === 'needsOnboarding',
      signIn,
      signOut,
      refreshMe,
      setUser,
      setStatus,
      clearReason,
    }),
    [state, signIn, signOut, refreshMe, setUser, setStatus, clearReason],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
