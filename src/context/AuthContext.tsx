import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth.service'; 

type LoginCredentials = Parameters<typeof authService.login>[0];

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null; 
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Falha ao carregar dados de autenticação', err);
      localStorage.clear();
    } finally {
      setIsLoading(false); 
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, token } = await authService.login(credentials);
      setUser(user);
      setAccessToken(token);
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Falha no login. Tente novamente.';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isAuthenticated, isLoading, error, login, logout }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};