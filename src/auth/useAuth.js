// 📁 src/auth/useAuth.js

import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Acesso à sessão: `{ status, accessToken, roles, user, isAuthenticated,
 * signIn, signOut, setUser, setStatus }`.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth() precisa estar dentro de <AuthProvider>.');
  }
  return ctx;
}

export default useAuth;
