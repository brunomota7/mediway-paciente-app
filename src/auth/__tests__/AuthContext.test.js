import { act, create } from 'react-test-renderer';
import { useAuth } from '../useAuth';
import { AuthProvider } from '../AuthContext';

// --- mocks de infraestrutura -------------------------------------------------
const mockStore = new Map();
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn((k, v) => {
    mockStore.set(k, v);
    return Promise.resolve();
  }),
  getItemAsync: jest.fn((k) => Promise.resolve(mockStore.get(k) ?? null)),
  deleteItemAsync: jest.fn((k) => {
    mockStore.delete(k);
    return Promise.resolve();
  }),
}));

const mockApiGet = jest.fn();
jest.mock('../../api/client', () => ({
  api: { get: (...a) => mockApiGet(...a) },
  configureAuthBridge: jest.fn(),
}));

// Captura o valor do contexto para dirigir as ações no teste.
let ctx;
function Probe() {
  ctx = useAuth();
  return null;
}
const render = () => create(<AuthProvider><Probe /></AuthProvider>);

beforeEach(() => {
  mockStore.clear();
  mockApiGet.mockReset();
});

describe('AuthContext', () => {
  it('bootstrap sem sessão -> signedOut', async () => {
    let tree;
    await act(async () => {
      tree = render();
    });
    expect(ctx.status).toBe('signedOut');
    expect(ctx.isAuthenticated).toBe(false);
    await act(async () => tree.unmount());
  });

  it('signIn com cadastro clínico -> signedIn + user', async () => {
    mockApiGet.mockResolvedValue({
      data: {
        patientI: 'p-1',
        personalInfo: { name: 'Ana', roles: ['PACIENTE'] },
        contactInfo: { email: 'ana@x.com' },
        medicalInfo: { statusPatient: 'ESTAVEL', conditionPatient: 'ok' },
      },
    });
    let tree;
    await act(async () => {
      tree = render();
    });
    await act(async () => {
      await ctx.signIn({ accessToken: 'jwt', expiresIn: 172800, roles: ['PACIENTE'] });
    });
    expect(mockApiGet).toHaveBeenCalledWith('/patients/me');
    expect(ctx.status).toBe('signedIn');
    expect(ctx.user).toMatchObject({ id: 'p-1', name: 'Ana', hasMedicalInfo: true });
    expect(JSON.parse(mockStore.get('mediway.session.v1')).accessToken).toBe('jwt');
    await act(async () => tree.unmount());
  });

  it('signIn sem cadastro clínico -> needsOnboarding', async () => {
    mockApiGet.mockResolvedValue({
      data: { patientI: 'p-2', personalInfo: { name: 'Beto' }, medicalInfo: null },
    });
    let tree;
    await act(async () => {
      tree = render();
    });
    await act(async () => {
      await ctx.signIn({ accessToken: 'jwt2', expiresIn: 172800, roles: ['PACIENTE'] });
    });
    expect(ctx.status).toBe('needsOnboarding');
    expect(ctx.isAuthenticated).toBe(true);
    await act(async () => tree.unmount());
  });

  it('signOut limpa a sessão e volta para signedOut', async () => {
    mockApiGet.mockResolvedValue({
      data: { patientI: 'p-3', personalInfo: {}, medicalInfo: { statusPatient: 'ESTAVEL' } },
    });
    let tree;
    await act(async () => {
      tree = render();
    });
    await act(async () => {
      await ctx.signIn({ accessToken: 'jwt3', expiresIn: 172800, roles: ['PACIENTE'] });
    });
    await act(async () => {
      await ctx.signOut();
    });
    expect(ctx.status).toBe('signedOut');
    expect(ctx.user).toBeNull();
    expect(mockStore.get('mediway.session.v1')).toBeUndefined();
    await act(async () => tree.unmount());
  });
});
