import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Linkedin, BookOpen, X } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'timeline', label: 'TIMELINE' },
  { id: 'research', label: 'RESEARCH' },
  { id: 'publications', label: 'PUBLICATIONS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'students', label: 'STUDENTS' },
  { id: 'patents', label: 'PATENTS' },
  { id: 'talks', label: 'TALKS' },
  { id: 'contact', label: 'CONTACT' },
];

interface PortfolioSidebarProps {
  activeSection: string;
  onNavigate: (id: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function PortfolioSidebar({
  activeSection,
  onNavigate,
  mobileOpen = false,
  onMobileClose,
}: PortfolioSidebarProps) {
  const { theme, isDark } = useTheme();
  const { data } = usePortfolio();

  const sidebarContent = (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: theme.bgSidebar,
        borderRight: `1px solid ${theme.divider}`,
        width: 240,
        transition: 'background-color 300ms ease',
      }}
    >
      {/* Navigation — no profile header */}
      <nav
        className="flex-1 px-6 py-8 overflow-y-auto sidebar-nav"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        <style>{`.sidebar-nav::-webkit-scrollbar { display: none; }`}</style>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onNavigate(item.id);
                    onMobileClose?.();
                  }}
                  className="block w-full text-left relative group"
                  style={{
                    padding: '8px 0',
                    color: isActive ? theme.textPrimary : theme.textSecondary,
                    fontSize: 12,
                    fontWeight: isActive ? 500 : 400,
                    letterSpacing: '0.12em',
                    transition: 'color 200ms ease',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      paddingBottom: 2,
                      borderBottom: isActive
                        ? `1px solid ${theme.textPrimary}`
                        : '1px solid transparent',
                      transition: 'border-color 200ms ease',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}

          {/* Download CV */}
          <li className="pt-4" style={{ borderTop: `1px solid ${theme.divider}` }}>
            {data.profile.cvBase64 ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const byteString = atob(data.profile.cvBase64!.split(',')[1] ?? data.profile.cvBase64!);
                  const ab = new ArrayBuffer(byteString.length);
                  const ia = new Uint8Array(ab);
                  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                  const blob = new Blob([ab], { type: 'application/pdf' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${data.profile.name.replace(/\s+/g, '_')}_CV.pdf`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{
                  display: 'block',
                  padding: '8px 0',
                  color: theme.accent,
                  fontSize: 12,
                  fontWeight: 400,
                  letterSpacing: '0.12em',
                  textDecoration: 'none',
                  transition: 'opacity 200ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                DOWNLOAD CV ↗
              </a>
            ) : (
              <span
                title="CV not uploaded yet — login to the dashboard to upload your CV"
                style={{
                  display: 'block',
                  padding: '8px 0',
                  color: theme.textMuted,
                  fontSize: 12,
                  fontWeight: 400,
                  letterSpacing: '0.12em',
                  cursor: 'default',
                  opacity: 0.5,
                }}
              >
                DOWNLOAD CV ↗
              </span>
            )}
          </li>
        </ul>
      </nav>

      {/* Social Icons */}
      <div
        className="px-6 py-6"
        style={{ borderTop: `1px solid ${theme.divider}` }}
      >
        <div className="flex items-center gap-4 mb-4">
          <a
            href={data.externalLinks.find(l => l.platform === 'LinkedIn')?.url || 'https://linkedin.com'}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            style={{ color: theme.textSecondary, transition: 'color 200ms ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = theme.textPrimary)}
            onMouseLeave={e => (e.currentTarget.style.color = theme.textSecondary)}
          >
            <Linkedin size={16} />
          </a>
          <a
            href={data.externalLinks.find(l => l.platform === 'Google Scholar')?.url || 'https://scholar.google.com'}
            target="_blank"
            rel="noopener noreferrer"
            title="Google Scholar"
            style={{ color: theme.textSecondary, transition: 'color 200ms ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = theme.textPrimary)}
            onMouseLeave={e => (e.currentTarget.style.color = theme.textSecondary)}
          >
            <BookOpen size={16} />
          </a>
          <a
            href={`mailto:${data.profile.email}`}
            title="Email"
            style={{ color: theme.textSecondary, transition: 'color 200ms ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = theme.textPrimary)}
            onMouseLeave={e => (e.currentTarget.style.color = theme.textSecondary)}
          >
            <Mail size={16} />
          </a>
        </div>
        <p style={{ color: theme.textMuted, fontSize: 11, letterSpacing: '0.05em' }}>
          © {data.profile.name}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-full z-40"
        style={{ width: 240 }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={onMobileClose}
          />
          <aside className="relative flex flex-col h-full z-50" style={{ width: 240 }}>
            {sidebarContent}
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4"
              style={{ color: theme.textSecondary, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </aside>
        </div>
      )}
    </>
  );
}