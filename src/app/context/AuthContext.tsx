import React, { createContext, useContext, useState, ReactNode } from 'react';

// Credentials can be overridden via Vercel environment variables at build time.
// NOTE: VITE_ env vars are embedded in the JS bundle and are not truly secret.
// They are acceptable for a personal portfolio with no sensitive backend.
const ADMIN_USER = import.meta.env.VITE_ADMIN_USERNAME ?? 'admin';
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD ?? 'shweta@svnit';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
