import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { tokenStorage } from '../utils/tokenStorage';
import { User, LoginCredentials, RegisterData } from '../types/user.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch {
      tokenStorage.clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials: LoginCredentials) => {
    const { user: userData, tokens } = await authService.login(credentials);
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    setUser(userData);
  };

  const register = async (data: RegisterData) => {
    const { user: userData, tokens } = await authService.register(data);
    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout(tokenStorage.getRefreshToken() || undefined);
    } finally {
      tokenStorage.clearTokens();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
