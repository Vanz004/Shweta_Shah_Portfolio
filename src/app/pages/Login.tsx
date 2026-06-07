import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { Lock, User, ArrowLeft, ShieldAlert } from 'lucide-react';

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const lockoutTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isLockedOut = lockoutRemaining > 0;

  // Countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    lockoutTimer.current = setInterval(() => {
      setLockoutRemaining(prev => {
        if (prev <= 1) {
          clearInterval(lockoutTimer.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(lockoutTimer.current!);
  }, [lockoutRemaining > 0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const next = failedAttempts + 1;
      setFailedAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        setError(`Too many failed attempts. Please wait ${LOCKOUT_SECONDS} seconds.`);
        setLockoutRemaining(LOCKOUT_SECONDS);
        setFailedAttempts(0);
      } else {
        setError(`Invalid credentials. ${MAX_ATTEMPTS - next} attempt${MAX_ATTEMPTS - next !== 1 ? 's' : ''} remaining.`);
      }
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundColor: theme.bg,
        fontFamily: 'Inter, sans-serif',
        transition: 'background-color 300ms ease',
      }}
    >
      {/* Top right */}
      <div className="fixed top-6 right-6 flex items-center gap-4 z-50">
        <ThemeToggle />
      </div>

      {/* Back link */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 flex items-center gap-2"
        style={{
          color: theme.textMuted,
          fontSize: 12,
          letterSpacing: '0.1em',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 200ms ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = theme.textSecondary)}
        onMouseLeave={e => (e.currentTarget.style.color = theme.textMuted)}
      >
        <ArrowLeft size={14} />
        BACK TO PORTFOLIO
      </button>

      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        {/* Title */}
        <div style={{ marginBottom: 48 }}>
          <p
            style={{
              color: theme.textMuted,
              fontSize: 11,
              letterSpacing: '0.2em',
              marginBottom: 8,
            }}
          >
            ADMIN
          </p>
          <h1
            style={{
              color: theme.textPrimary,
              fontSize: 32,
              fontWeight: 300,
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            Dashboard
            <br />
            Login
          </h1>
          <p
            style={{
              color: theme.textMuted,
              fontSize: 10,
              marginTop: 12,
              letterSpacing: '0.05em',
            }}
          >
            Email: admin@portfolio.com | Password: changeme123
          </p>
          <div
            style={{
              width: 32,
              height: 1,
              backgroundColor: theme.accent,
              marginTop: 20,
            }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              style={{
                display: 'block',
                color: theme.textMuted,
                fontSize: 11,
                letterSpacing: '0.15em',
                marginBottom: 8,
              }}
            >
              EMAIL
            </label>
            <div className="relative">
              <User
                size={14}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: theme.textMuted,
                }}
              />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@portfolio.com"
                required
                disabled={isLockedOut}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 36px',
                  backgroundColor: isLockedOut ? theme.bgSidebar : theme.bgHover,
                  border: `1px solid ${theme.divider}`,
                  borderRadius: 2,
                  color: theme.textPrimary,
                  fontSize: 13,
                  outline: 'none',
                  transition: 'border-color 200ms ease',
                  boxSizing: 'border-box',
                  opacity: isLockedOut ? 0.5 : 1,
                }}
                onFocus={e => (e.currentTarget.style.borderColor = theme.accent)}
                onBlur={e => (e.currentTarget.style.borderColor = theme.divider)}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                color: theme.textMuted,
                fontSize: 11,
                letterSpacing: '0.15em',
                marginBottom: 8,
              }}
            >
              PASSWORD
            </label>
            <div className="relative">
              <Lock
                size={14}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: theme.textMuted,
                }}
              />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                required
                disabled={isLockedOut}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 36px',
                  backgroundColor: isLockedOut ? theme.bgSidebar : theme.bgHover,
                  border: `1px solid ${theme.divider}`,
                  borderRadius: 2,
                  color: theme.textPrimary,
                  fontSize: 13,
                  outline: 'none',
                  transition: 'border-color 200ms ease',
                  boxSizing: 'border-box',
                  opacity: isLockedOut ? 0.5 : 1,
                }}
                onFocus={e => (e.currentTarget.style.borderColor = theme.accent)}
                onBlur={e => (e.currentTarget.style.borderColor = theme.divider)}
              />
            </div>
          </div>

          {/* Error / Lockout message */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                color: '#EF4444',
                fontSize: 12,
                letterSpacing: '0.05em',
              }}
            >
              <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                {error}
                {isLockedOut && (
                  <span style={{ fontWeight: 600 }}> ({lockoutRemaining}s)</span>
                )}
              </span>
            </div>
          )}

          <button
            id="login-submit"
            type="submit"
            disabled={isLoading || isLockedOut}
            style={{
              width: '100%',
              padding: '13px',
              backgroundColor: isLockedOut ? theme.divider : theme.accent,
              color: '#FFFFFF',
              fontSize: 12,
              letterSpacing: '0.15em',
              fontWeight: 500,
              border: 'none',
              borderRadius: 2,
              cursor: isLoading || isLockedOut ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'opacity 200ms ease, background-color 200ms ease',
            }}
          >
            {isLockedOut
              ? `LOCKED — WAIT ${lockoutRemaining}s`
              : isLoading
              ? 'LOGGING IN...'
              : 'LOGIN →'}
          </button>
        </form>

        <p
          style={{
            color: theme.textMuted,
            fontSize: 11,
            marginTop: 24,
            textAlign: 'center',
            letterSpacing: '0.05em',
          }}
        >
          Contact the site administrator for access credentials.
        </p>
      </div>
    </div>
  );
}
