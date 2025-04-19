'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isUserLoggedIn } from './authEmail'; // Ajuste o caminho conforme necessário

interface AuthContextType {
  loggedIn: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isLoggedIn = await isUserLoggedIn();
        setLoggedIn(isLoggedIn);
      } catch (error) {
        console.error('Erro ao verificar status de autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
