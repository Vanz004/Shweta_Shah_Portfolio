import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import {
  User, BarChart3, FlaskConical, BookOpen, FileText,
  Briefcase, Users, Award, Mic, Network, LogOut, Eye, Menu, X, RotateCcw
} from 'lucide-react';
import ProfileSection from '../components/dashboard/ProfileSection';
import SnapshotSection from '../components/dashboard/SnapshotSection';
import ResearchSection from '../components/dashboard/ResearchSection';
import TeachingSection from '../components/dashboard/TeachingSection';
import PublicationsSection from '../components/dashboard/PublicationsSection';
import ProjectsSection from '../components/dashboard/ProjectsSection';
import StudentsSection from '../components/dashboard/StudentsSection';
import PatentsSection from '../components/dashboard/PatentsSection';
import TalksSection from '../components/dashboard/TalksSection';
import MembershipsSection from '../components/dashboard/MembershipsSection';

type Section = 'profile' | 'snapshot' | 'research' | 'teaching' | 'publications' | 'projects' | 'students' | 'patents' | 'talks' | 'memberships';

const menuItems = [
  { id: 'profile', label: 'PROFILE', icon: User },
  { id: 'snapshot', label: 'SNAPSHOT', icon: BarChart3 },
  { id: 'research', label: 'RESEARCH', icon: FlaskConical },
  { id: 'teaching', label: 'TEACHING', icon: BookOpen },
  { id: 'publications', label: 'PUBLICATIONS', icon: FileText },
  { id: 'projects', label: 'PROJECTS', icon: Briefcase },
  { id: 'students', label: 'STUDENTS', icon: Users },
  { id: 'patents', label: 'PATENTS', icon: Award },
  { id: 'talks', label: 'TALKS', icon: Mic },
  { id: 'memberships', label: 'MEMBERSHIPS', icon: Network },
];

// ─── Extracted as a top-level component to prevent re-mount on every Dashboard render ───
interface SidebarContentProps {
  activeSection: Section;
  setActiveSection: (s: Section) => void;
  setSidebarOpen: (open: boolean) => void;
  theme: any;
  onNavigate: () => void;
  onLogout: () => void;
  onReset: () => void;
}

function SidebarContent({
  activeSection,
  setActiveSection,
  setSidebarOpen,
  theme,
  onNavigate,
  onLogout,
  onReset,
}: SidebarContentProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: theme.bgSidebar,
        borderRight: `1px solid ${theme.divider}`,
        transition: 'background-color 300ms ease',
      }}
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-6" style={{ borderBottom: `1px solid ${theme.divider}` }}>
        <p style={{ color: theme.textMuted, fontSize: 10, letterSpacing: '0.2em', marginBottom: 6 }}>
          ADMIN DASHBOARD
        </p>
        <p style={{ color: theme.textPrimary, fontSize: 16, fontWeight: 300, letterSpacing: '0.02em' }}>
          Portfolio Manager
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveSection(item.id as Section);
                    setSidebarOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-3"
                  style={{
                    padding: '9px 0',
                    color: isActive ? theme.textPrimary : theme.textSecondary,
                    fontSize: 12,
                    fontWeight: isActive ? 500 : 400,
                    letterSpacing: '0.1em',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'color 200ms ease',
                    borderBottom: isActive ? `1px solid ${theme.textPrimary}` : '1px solid transparent',
                    display: 'inline-flex',
                    width: 'auto',
                  }}
                >
                  <Icon size={14} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="px-6 py-6 space-y-3" style={{ borderTop: `1px solid ${theme.divider}` }}>
        <button
          onClick={onNavigate}
          className="flex items-center gap-3 w-full"
          style={{
            color: theme.textSecondary,
            fontSize: 12,
            letterSpacing: '0.1em',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
            outline: 'none',
            transition: 'color 200ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = theme.textPrimary)}
          onMouseLeave={e => (e.currentTarget.style.color = theme.textSecondary)}
        >
          <Eye size={14} />
          VIEW SITE
        </button>

        {/* Reset to Defaults */}
        {showResetConfirm ? (
          <div>
            <p style={{ color: theme.textMuted, fontSize: 10, letterSpacing: '0.08em', marginBottom: 6 }}>
              CONFIRM RESET?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onReset}
                style={{
                  color: '#EF4444',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  background: 'none',
                  border: `1px solid #EF4444`,
                  borderRadius: 2,
                  cursor: 'pointer',
                  padding: '4px 10px',
                }}
              >
                YES
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                style={{
                  color: theme.textMuted,
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  background: 'none',
                  border: `1px solid ${theme.divider}`,
                  borderRadius: 2,
                  cursor: 'pointer',
                  padding: '4px 10px',
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-3 w-full"
            style={{
              color: theme.textMuted,
              fontSize: 12,
              letterSpacing: '0.1em',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 0',
              outline: 'none',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
            onMouseLeave={e => (e.currentTarget.style.color = theme.textMuted)}
          >
            <RotateCcw size={14} />
            RESET TO DEFAULTS
          </button>
        )}

        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full"
          style={{
            color: '#EF4444',
            fontSize: 12,
            letterSpacing: '0.1em',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
            outline: 'none',
            opacity: 0.8,
            transition: 'opacity 200ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
        >
          <LogOut size={14} />
          LOGOUT
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { resetData } = usePortfolio();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const sidebarProps: SidebarContentProps = {
    activeSection,
    setActiveSection,
    setSidebarOpen,
    theme,
    onNavigate: () => navigate('/'),
    onLogout: handleLogout,
    onReset: resetData,
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: theme.bg,
        fontFamily: 'Inter, sans-serif',
        transition: 'background-color 300ms ease',
      }}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col flex-shrink-0" style={{ width: 240 }}>
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex flex-col h-full z-50" style={{ width: 240 }}>
            <SidebarContent {...sidebarProps} />
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4"
              style={{ color: theme.textSecondary, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </aside>
        </div>
      )}

      {/* Top bar */}
      <div className="fixed top-5 right-6 z-40 flex items-center gap-4">
        <button
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
          style={{ color: theme.textPrimary, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Menu size={20} />
        </button>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <main
        className="flex-1 overflow-y-auto h-screen"
        style={{ backgroundColor: theme.bg }}
      >
        <div className="p-8 lg:p-12 max-w-5xl">
          {activeSection === 'profile' && <ProfileSection />}
          {activeSection === 'snapshot' && <SnapshotSection />}
          {activeSection === 'research' && <ResearchSection />}
          {activeSection === 'teaching' && <TeachingSection />}
          {activeSection === 'publications' && <PublicationsSection />}
          {activeSection === 'projects' && <ProjectsSection />}
          {activeSection === 'students' && <StudentsSection />}
          {activeSection === 'patents' && <PatentsSection />}
          {activeSection === 'talks' && <TalksSection />}
          {activeSection === 'memberships' && <MembershipsSection />}
        </div>
      </main>
    </div>
  );
}
