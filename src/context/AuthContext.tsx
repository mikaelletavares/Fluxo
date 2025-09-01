import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  birthDate?: string;
  photoURL?: string;
} 

type LoginCredentials = Parameters<typeof authService.login>[0];
type RegisterData = Parameters<typeof authService.register>[0];

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null; 
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listener para mudanças de autenticação do Firebase
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const userProfile = await authService.login(credentials);
      setUser(userProfile);
    } catch (err: any) {
      const errorMessage = err.message || 'Falha no login. Tente novamente.';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const userProfile = await authService.register(data);
      setUser(userProfile);
    } catch (err: any) {
      const errorMessage = err.message || 'Falha no cadastro. Tente novamente.';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err: any) {
      console.error('Erro ao fazer logout:', err);
      setError('Erro ao fazer logout');
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, error, login, register, logout }}
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