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
// (401 sem refresh possível, ou token vencido sem refresh token) — a tela de
// login mostra o aviso (L11).
//
// Sessão renovável: `login` devolve um `refreshToken` (30 dias). Em `401` o
// cliente HTTP chama `tryRefresh` (via bridge) e só desloga se ele falhar.

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
import { authApi } from '../api/endpoints/authApi';
import { patientApi } from '../api/endpoints/patientApi';
import {
  clearSession,
  isExpired,
  loadSession,
  saveSession,
  updateAccessToken,
} from './session';

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
  const refreshTokenRef = useRef(null);
  const rolesRef = useRef([]);
  const expiresAtRef = useRef(null);

  const applyToken = useCallback((session) => {
    tokenRef.current = session?.accessToken ?? null;
    expiresAtRef.current = session?.expiresAt ?? null;
    if (session?.refreshToken !== undefined) {
      refreshTokenRef.current = session.refreshToken;
    }
    if (session?.roles) rolesRef.current = session.roles;
    setState((prev) => ({
      ...prev,
      accessToken: session?.accessToken ?? null,
      roles: session?.roles ?? prev.roles,
      expiresAt: session?.expiresAt ?? prev.expiresAt,
    }));
  }, []);

  const signOut = useCallback(async (reason = null) => {
    tokenRef.current = null;
    refreshTokenRef.current = null;
    rolesRef.current = [];
    expiresAtRef.current = null;
    await clearSession();
    setState({ ...INITIAL_STATE, status: 'signedOut', reason });
  }, []);

  const clearReason = useCallback(() => {
    setState((prev) => (prev.reason ? { ...prev, reason: null } : prev));
  }, []);

  /**
   * Troca o refreshToken por um novo accessToken. Devolve o novo token
   * (string) ou `null` se não houver refreshToken / ele estiver inválido.
   */
  const tryRefresh = useCallback(async () => {
    const rt = refreshTokenRef.current;
    if (!rt) return null;
    try {
      const data = await authApi.refresh(rt); // { accessToken, expiresIn }
      const session = await updateAccessToken(data, {
        refreshToken: rt,
        roles: rolesRef.current,
      });
      applyToken(session);
      return session.accessToken;
    } catch (_) {
      return null;
    }
  }, [applyToken]);

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
    async ({ accessToken, refreshToken, expiresIn, roles }) => {
      const session = await saveSession({ accessToken, refreshToken, expiresIn, roles });
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
      roles: rolesRef.current,
    });
  }, [resolveSession]);

  const setUser = useCallback((user) => {
    setState((prev) => ({ ...prev, user }));
  }, []);

  const setStatus = useCallback((status) => {
    setState((prev) => ({ ...prev, status }));
  }, []);

  // Liga o cliente HTTP à sessão: leitura do token + refresh + logout automático.
  useEffect(() => {
    configureAuthBridge({
      getToken: () => tokenRef.current,
      onRefresh: tryRefresh,
      onUnauthorized: (reason) => {
        signOut(reason || 'expired');
      },
    });
  }, [signOut, tryRefresh]);

  // Token vencido enquanto o app estava em background -> tenta renovar; se não
  // der, desloga ao voltar.
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (next) => {
      if (next !== 'active') return;
      if (tokenRef.current && expiresAtRef.current && Date.now() >= expiresAtRef.current) {
        const renewed = await tryRefresh();
        if (!renewed) signOut('expired');
      }
    });
    return () => sub.remove();
  }, [signOut, tryRefresh]);

  // Bootstrap: roda uma vez ao montar.
  useEffect(() => {
    let alive = true;
    (async () => {
      const session = await loadSession();
      if (!alive) return;

      if (!session) {
        setState({ ...INITIAL_STATE, status: 'signedOut' });
        return;
      }

      if (isExpired(session)) {
        // access token venceu — tenta o refresh token antes de deslogar
        refreshTokenRef.current = session.refreshToken ?? null;
        rolesRef.current = session.roles ?? [];
        const newToken = await tryRefresh();
        if (!alive) return;
        if (newToken) {
          await resolveSession({
            accessToken: newToken,
            expiresAt: expiresAtRef.current,
            roles: rolesRef.current,
          });
        } else {
          await clearSession();
          setState({ ...INITIAL_STATE, status: 'signedOut', reason: 'expired' });
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
