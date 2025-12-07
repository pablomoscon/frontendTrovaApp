import { ReactNode, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { useAuthState } from '../hooks/auth/useAuthState';
import {
  selectIsAdmin,
  selectIsAuthenticated,
  selectToken,
} from '../utils/authSelectorsUtils';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, login, logout } = useAuthState();

  // Memoizar el value para que el context no cause re-render infinito
  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      token: selectToken(user),
      isAdmin: selectIsAdmin(user),
      isAuthenticated: selectIsAuthenticated(user),
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
