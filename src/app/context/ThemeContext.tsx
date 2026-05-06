import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemeColors {
  bg: string;
  bgCard: string;
  bgSidebar: string;
  bgHover: string;
  bgInput: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  divider: string;
  accent: string;
  accentGreen: string;
}

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  theme: ThemeColors;
}

const darkTheme: ThemeColors = {
  bg: '#0B0B0C',
  bgCard: '#111113',
  bgSidebar: '#0D0D0F',
  bgHover: '#1A1A1D',
  bgInput: '#1F2937',
  textPrimary: '#E5E7EB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  divider: '#1F2937',
  accent: '#8B5CF6',
  accentGreen: '#22C55E',
};

const lightTheme: ThemeColors = {
  bg: '#FFFFFF',
  bgCard: '#FAFAFA',
  bgSidebar: '#F9FAFB',
  bgHover: '#F3F4F6',
  bgInput: '#F9FAFB',
  textPrimary: '#0F172A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  divider: '#E5E7EB',
  accent: '#8B5CF6',
  accentGreen: '#22C55E',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('portfolioTheme');
    return saved !== null ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('portfolioTheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
