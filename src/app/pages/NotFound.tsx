import { Link } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

export default function NotFound() {
  const { theme } = useTheme();
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: theme.bg, fontFamily: 'Inter, sans-serif', transition: 'background-color 300ms ease' }}
    >
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.2em', marginBottom: 16 }}>ERROR</p>
        <h1
          style={{
            color: theme.textPrimary,
            fontSize: 'clamp(80px, 12vw, 140px)',
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            marginBottom: 24,
          }}
        >
          404
        </h1>
        <p style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 32, letterSpacing: '0.02em' }}>
          Page not found.
        </p>
        <Link
          to="/"
          style={{
            color: theme.accent,
            fontSize: 12,
            letterSpacing: '0.15em',
            textDecoration: 'none',
            borderBottom: `1px solid ${theme.accent}`,
            paddingBottom: 2,
            transition: 'opacity 200ms ease',
          }}
        >
          RETURN TO PORTFOLIO →
        </Link>
      </div>
    </div>
  );
}
