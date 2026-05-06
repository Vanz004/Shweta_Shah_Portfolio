import React from 'react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center cursor-pointer outline-none focus:outline-none"
      style={{
        width: 52,
        height: 28,
        borderRadius: 14,
        backgroundColor: isDark ? '#374151' : '#D1D5DB',
        transition: 'background-color 300ms ease',
        border: `1px solid ${isDark ? '#4B5563' : '#9CA3AF'}`,
      }}
      aria-label="Toggle theme"
    >
      <span
        style={{
          position: 'absolute',
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: isDark ? '#E5E7EB' : '#0F172A',
          top: 3,
          left: isDark ? 28 : 3,
          transition: 'left 300ms ease, background-color 300ms ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
        }}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
