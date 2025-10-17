// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, logout, getCurrentUserData, isAuthenticated } from '../api/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated()) {
        try {
          const userData = getCurrentUserData();
          setUser(userData);
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const response = await login({ username, password });
      setUser(response.user);
    } catch (error) {
      throw error; // Re-lança o erro para ser tratado no componente
    }
  };

  const signOut = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}