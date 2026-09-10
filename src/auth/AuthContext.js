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
// Fase 1: o bootstrap e o login chamam `GET /patients/me` para distinguir
// `signedIn` de `needsOnboarding` e carregar `user`. O adapter aqui é mínimo;
// a Fase 2 move isso para `api/endpoints/patientApi.js` + `patientFromApi`.

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { api, configureAuthBridge } from '../api/client';
import { ApiError } from '../api/httpError';
import { clearSession, isExpired, loadSession, saveSession } from './session';

export const AuthContext = createContext(null);

const INITIAL_STATE = {
  status: 'loading',
  accessToken: null,
  roles: [],
  expiresAt: null,
  user: null,
};

/** Adapter mínimo de `PatientResponseInfosDTO` -> modelo do app (Fase 2 amplia). */
function adaptMe(dto) {
  const personal = dto?.personalInfo ?? {};
  const contact = dto?.contactInfo ?? {};
  const medical = dto?.medicalInfo ?? {};
  return {
    id: dto?.patientI ?? dto?.patientId ?? null, // B1: typo conhecido do backend
    name: personal.name ?? null,
    email: contact.email ?? null,
    number: contact.number ?? null,
    dateOfBirth: personal.dateOfBirth ?? null,
    age: personal.age ?? null,
    gender: personal.gender ?? null,
    roles: Array.isArray(personal.roles) ? personal.roles : [],
    conditionPatient: medical.conditionPatient ?? null,
    statusPatient: medical.statusPatient ?? null,
    hasMedicalInfo: Boolean(
      medical && (medical.statusPatient || medical.conditionPatient),
    ),
  };
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);

  // Cópia síncrona do token para o interceptor do axios (que não é um hook).
  const tokenRef = useRef(null);

  const applyToken = useCallback((session) => {
    tokenRef.current = session?.accessToken ?? null;
    setState((prev) => ({
      ...prev,
      accessToken: session?.accessToken ?? null,
      roles: session?.roles ?? prev.roles,
      expiresAt: session?.expiresAt ?? prev.expiresAt,
    }));
  }, []);

  const signOut = useCallback(async () => {
    tokenRef.current = null;
    await clearSession();
    setState({ ...INITIAL_STATE, status: 'signedOut' });
  }, []);

  /**
   * Com uma sessão local válida, consulta `/patients/me` e define o status.
   * - 401/403 -> sessão inválida no servidor -> signOut
   * - rede/5xx/timeout -> mantém logado (otimista); `user` fica null
   */
  const resolveSession = useCallback(
    async (session) => {
      applyToken(session);
      try {
        const { data } = await api.get('/patients/me');
        const user = adaptMe(data);
        setState((prev) => ({
          ...prev,
          user,
          status: user.hasMedicalInfo ? 'signedIn' : 'needsOnboarding',
        }));
        return user;
      } catch (err) {
        if (err instanceof ApiError && (err.isUnauthorized || err.isForbidden)) {
          await signOut();
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
      expiresAt: state.expiresAt,
      roles: state.roles,
    });
  }, [resolveSession, state.expiresAt, state.roles]);

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
        setState({ ...INITIAL_STATE, status: 'signedOut' });
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
    }),
    [state, signIn, signOut, refreshMe, setUser, setStatus],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
