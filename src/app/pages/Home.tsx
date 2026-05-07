import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioSidebar } from '../components/PortfolioSidebar';
import { ThemeToggle } from '../components/ThemeToggle';
import { Menu, ExternalLink, Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
import profilePhoto from 'figma:asset/cd30d220551f0df420a8137c435792a43096558f.png';

const PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1773161960044-4636c76b22fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBuYXZpZ2F0aW9uJTIwcmVzZWFyY2glMjBhbnRlbm5hJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzUxMzU1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1573842346889-8efc9f2abb82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGNvbW11bmljYXRpb24lMjBzaWduYWwlMjBsYWJvcmF0b3J5JTIwcmVzZWFyY2h8ZW58MXx8fHwxNzc1MTM1NTg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1761546571631-a4d61b55cd2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGVuZ2luZWVyaW5nJTIwYWNhZGVtaWMlMjByZXNlYXJjaCUyMGRlc2t8ZW58MXx8fHwxNzc1MTM1NTg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1758872014553-f0deb7b12d58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMG5hdmlnYXRpb24lMjBjaXR5JTIwR1BTJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzUxMzU1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
];

const SECTION_IDS = ['home', 'about', 'timeline', 'research', 'publications', 'projects', 'students', 'patents', 'talks', 'contact'];

const PREVIEW_COUNT = 4;

/* ─── Section Header with Expand Arrow ─── */
function SectionHeader({
  label,
  theme,
  expanded,
  onToggle,
  count,
  previewCount,
}: {
  label: string;
  theme: any;
  expanded: boolean;
  onToggle: () => void;
  count?: number;
  previewCount?: number;
}) {
  const showArrow = count !== undefined && count > (previewCount ?? PREVIEW_COUNT);
  return (
    <div className="flex items-center gap-4 mb-12">
      <span
        style={{
          color: theme.textSecondary,
          fontSize: 12,
          letterSpacing: '0.18em',
          fontWeight: 400,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, backgroundColor: theme.divider }} />
      {showArrow && (
        <button
          onClick={onToggle}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: theme.textMuted,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 6px',
            transition: 'color 200ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = theme.accent)}
          onMouseLeave={e => (e.currentTarget.style.color = theme.textMuted)}
          title={expanded ? 'Show less' : 'Show all'}
        >
          <span style={{ fontSize: 10, letterSpacing: '0.1em' }}>
            {expanded ? 'LESS' : `+${count - (previewCount ?? PREVIEW_COUNT)} MORE`}
          </span>
          <ChevronDown
            size={14}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 300ms ease',
            }}
          />
        </button>
      )}
    </div>
  );
}

/* ─── Simple Section Label (no expand) ─── */
function SectionLabel({ label, theme }: { label: string; theme: any }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <span
        style={{
          color: theme.textSecondary,
          fontSize: 12,
          letterSpacing: '0.18em',
          fontWeight: 400,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, backgroundColor: theme.divider }} />
    </div>
  );
}

export default function Home() {
  const { theme } = useTheme();
  const { data } = usePortfolio();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Year filter for timeline
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Expand states per section
  const [pubExpanded, setPubExpanded] = useState(false);
  const [studentsExpanded, setStudentsExpanded] = useState(false);
  const [patentsExpanded, setPatentsExpanded] = useState(false);
  const [talksExpanded, setTalksExpanded] = useState(false);
  const [researchExpanded, setResearchExpanded] = useState(false);

  const handleScroll = () => {
    if (!mainRef.current) return;
    const scrollTop = mainRef.current.scrollTop;
    let current = 'home';
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el && el.offsetTop - 120 <= scrollTop) {
        current = id;
      }
    }
    setActiveSection(current);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && mainRef.current) {
      mainRef.current.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    }
  };

  const nameParts = data.profile.name.replace('Dr. ', '').split(' ');
  const firstName = nameParts[0] || 'SHWETA';
  const lastName = nameParts.slice(1).join(' ') || 'SHAH';

  /* ─── Timeline year computation ─── */
  const allYears = React.useMemo(() => {
    const years = new Set<string>();
    data.experience.forEach(exp => {
      years.add(exp.startYear);
      if (!exp.current && exp.endYear) years.add(exp.endYear);
    });
    data.education.forEach(edu => {
      years.add(edu.year);
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [data.experience, data.education]);

  const filteredExperience = React.useMemo(() => {
    if (!selectedYear) return data.experience;
    return data.experience.filter(exp => {
      const start = Number(exp.startYear);
      const end = exp.current ? new Date().getFullYear() : Number(exp.endYear);
      const y = Number(selectedYear);
      return y >= start && y <= end;
    });
  }, [data.experience, selectedYear]);

  const filteredEducation = React.useMemo(() => {
    if (!selectedYear) return data.education;
    return data.education.filter(edu => edu.year === selectedYear);
  }, [data.education, selectedYear]);

  /* ─── Displayed items (with expand) ─── */
  const displayedPublications = pubExpanded ? data.publications : data.publications.slice(0, PREVIEW_COUNT);
  const displayedStudents = studentsExpanded ? data.students : data.students.slice(0, PREVIEW_COUNT);
  const displayedPatents = patentsExpanded ? data.patents : data.patents.slice(0, PREVIEW_COUNT);
  const displayedTalks = talksExpanded ? data.talks : data.talks.slice(0, PREVIEW_COUNT);
  const displayedResearchAreas = researchExpanded ? data.researchAreas : data.researchAreas.slice(0, 8);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: theme.bg, fontFamily: 'Inter, sans-serif', transition: 'background-color 300ms ease' }}
    >
      {/* Sidebar */}
      <PortfolioSidebar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Fixed top-right controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
          style={{ color: theme.textPrimary, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Menu size={22} />
        </button>
        <ThemeToggle />
      </div>

      {/* Scrollable Main Content */}
      <main
        ref={mainRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto h-screen lg:ml-[240px] portfolio-main"
        style={{ scrollBehavior: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        <style>{`.portfolio-main::-webkit-scrollbar { display: none; }`}</style>

        <div className="max-w-5xl mx-auto px-8 lg:px-16">

          {/* ─── HERO SECTION ─── */}
          <section
            id="home"
            className="flex flex-col lg:flex-row items-start pt-10 sm:pt-16 lg:pt-24"
            style={{ minHeight: '100vh', paddingBottom: 64 }}
          >
            {/* Left: Name block */}
            <div className="flex-1 lg:flex-[1.2]">
              <p
                style={{
                  color: theme.textMuted,
                  fontSize: 13,
                  letterSpacing: '0.18em',
                  marginBottom: 8,
                }}
              >
                DR.
              </p>
              <h1
                style={{
                  color: theme.textPrimary,
                  fontSize: 'clamp(59px, 8.4vw, 101px)',
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  transition: 'color 300ms ease',
                }}
              >
                {firstName}
                <br />
                {lastName}
              </h1>
              <div
                style={{
                  width: 48,
                  height: 1,
                  backgroundColor: theme.divider,
                  margin: '24px 0',
                }}
              />
              <p
                style={{
                  color: theme.textSecondary,
                  fontSize: 15,
                  letterSpacing: '0.05em',
                  marginBottom: 16,
                }}
              >
                {data.profile.role} / {data.profile.organization}
              </p>
              <div className="flex flex-wrap gap-2 mb-10">
                {data.profile.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      color: theme.textMuted,
                      fontSize: 12,
                      letterSpacing: '0.1em',
                      padding: '4px 10px',
                      border: `1px solid ${theme.divider}`,
                      borderRadius: 2,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>
                For academic inquiries, email me at
              </p>
              <a
                href={`mailto:${data.profile.email}`}
                style={{
                  color: theme.textSecondary,
                  fontSize: 14,
                  textDecoration: 'none',
                  borderBottom: `1px solid ${theme.divider}`,
                  paddingBottom: 1,
                  transition: 'color 200ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = theme.textPrimary)}
                onMouseLeave={e => (e.currentTarget.style.color = theme.textSecondary)}
              >
                {data.profile.email}
              </a>
            </div>

            {/* Right: About snapshot */}
            <div
              className="flex-1 mt-12 lg:mt-0 lg:ml-16"
              style={{ maxWidth: 400 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span
                  style={{
                    color: theme.textSecondary,
                    fontSize: 12,
                    letterSpacing: '0.18em',
                    fontWeight: 400,
                  }}
                >
                  ABOUT ME
                </span>
                <div style={{ flex: 1, height: 1, backgroundColor: theme.divider }} />
              </div>
              <div
                style={{
                  color: theme.textSecondary,
                  fontSize: 14,
                  lineHeight: 1.8,
                  letterSpacing: '0.01em',
                }}
              >
                {data.aboutText.split('. ').slice(0, 3).map((sentence, i) => (
                  <p key={i} style={{ marginBottom: 12 }}>{sentence}{i < 2 ? '.' : ''}</p>
                ))}
              </div>
              <div
                className="grid grid-cols-3 gap-4"
                style={{
                  marginTop: 32,
                  paddingTop: 24,
                  borderTop: `1px solid ${theme.divider}`,
                }}
              >
                <div>
                  <p style={{ color: theme.textPrimary, fontSize: 23, fontWeight: 300 }}>
                    {data.snapshot.teachingYears}
                  </p>
                  <p style={{ color: theme.textMuted, fontSize: 12, letterSpacing: '0.08em', marginTop: 2 }}>
                    TEACHING
                  </p>
                </div>
                <div>
                  <p style={{ color: theme.textPrimary, fontSize: 23, fontWeight: 300 }}>
                    {data.snapshot.publications}
                  </p>
                  <p style={{ color: theme.textMuted, fontSize: 12, letterSpacing: '0.08em', marginTop: 2 }}>
                    PAPERS
                  </p>
                </div>
                <div>
                  <p style={{ color: theme.accent, fontSize: 23, fontWeight: 300 }}>
                    ISRO
                  </p>
                  <p style={{ color: theme.textMuted, fontSize: 12, letterSpacing: '0.08em', marginTop: 2 }}>
                    FUNDED
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── ABOUT SECTION ─── */}
          {data.sectionVisibility.about && (
            <section id="about" style={{ paddingBottom: 96 }}>
              <SectionLabel label="ABOUT" theme={theme} />
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <div
                    style={{
                      width: 220,
                      height: 280,
                      borderRadius: 16,
                      overflow: 'hidden',
                      border: `1px solid ${theme.divider}`,
                    }}
                  >
                    <img
                      src={data.profile.image}
                      alt={data.profile.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'grayscale(100%)',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>
                {/* Text */}
                <div style={{ maxWidth: 560 }}>
                  <p
                    style={{
                      color: theme.textSecondary,
                      fontSize: 15,
                      lineHeight: 2,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {data.aboutText}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ─── TIMELINE SECTION ─── */}
          <section id="timeline" style={{ paddingBottom: 96 }}>
            <SectionLabel label="TIMELINE" theme={theme} />

            {/* Year filter buttons */}
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => setSelectedYear(null)}
                style={{
                  padding: '5px 14px',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  border: `1px solid ${!selectedYear ? theme.accent : theme.divider}`,
                  color: !selectedYear ? theme.accent : theme.textMuted,
                  background: 'none',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                ALL
              </button>
              {allYears.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year === selectedYear ? null : year)}
                  style={{
                    padding: '5px 14px',
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    border: `1px solid ${selectedYear === year ? theme.accent : theme.divider}`,
                    color: selectedYear === year ? theme.accent : theme.textMuted,
                    background: 'none',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Two-column: Education (left) | line | Experience (right) */}
            <div className="relative flex gap-0">
              {/* Left column: EDUCATION */}
              <div className="flex-1 pr-8">
                <p
                  style={{
                    color: theme.textMuted,
                    fontSize: 12,
                    letterSpacing: '0.15em',
                    marginBottom: 28,
                    textAlign: 'right',
                  }}
                >
                  EDUCATION
                </p>
                {filteredEducation.length === 0 ? (
                  <p style={{ color: theme.textMuted, fontSize: 13, textAlign: 'right', opacity: 0.5 }}>
                    No entries for this year
                  </p>
                ) : (
                  <ul className="space-y-10">
                    {filteredEducation.map((edu) => (
                      <li key={edu.id} className="relative flex flex-col items-end text-right">
                        <p
                          style={{
                            color: theme.accent,
                            fontSize: 12,
                            letterSpacing: '0.1em',
                            marginBottom: 4,
                          }}
                        >
                          {edu.year}
                        </p>
                        <p style={{ color: theme.textPrimary, fontSize: 15, fontWeight: 500, marginBottom: 2 }}>
                          {edu.degree}, {edu.field}
                        </p>
                        <p style={{ color: theme.textSecondary, fontSize: 14 }}>
                          {edu.institution}
                        </p>
                        {/* Dot on right edge */}
                        <div
                          style={{
                            position: 'absolute',
                            right: -12,
                            top: 6,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: theme.divider,
                            border: `2px solid ${theme.textMuted}`,
                            zIndex: 2,
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Center vertical line */}
              <div
                style={{
                  width: 1,
                  backgroundColor: theme.divider,
                  flexShrink: 0,
                  alignSelf: 'stretch',
                  marginTop: 44,
                }}
              />

              {/* Right column: EXPERIENCE */}
              <div className="flex-1 pl-8">
                <p
                  style={{
                    color: theme.textMuted,
                    fontSize: 12,
                    letterSpacing: '0.15em',
                    marginBottom: 28,
                  }}
                >
                  EXPERIENCE
                </p>
                {filteredExperience.length === 0 ? (
                  <p style={{ color: theme.textMuted, fontSize: 13, opacity: 0.5 }}>
                    No entries for this year
                  </p>
                ) : (
                  <ul className="space-y-10">
                    {filteredExperience.map((exp, i) => (
                      <li key={exp.id} className="relative">
                        {/* Dot on left edge */}
                        <div
                          style={{
                            position: 'absolute',
                            left: -12,
                            top: 6,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: i === 0 ? theme.accent : theme.divider,
                            border: `2px solid ${i === 0 ? theme.accent : theme.textMuted}`,
                            zIndex: 2,
                            transition: 'transform 200ms ease',
                            cursor: 'default',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.4)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                        <p
                          style={{
                            color: theme.accent,
                            fontSize: 12,
                            letterSpacing: '0.1em',
                            marginBottom: 4,
                          }}
                        >
                          {exp.startYear} — {exp.current ? 'PRESENT' : exp.endYear}
                        </p>
                        <p style={{ color: theme.textPrimary, fontSize: 15, fontWeight: 500, marginBottom: 2 }}>
                          {exp.position}
                        </p>
                        <p style={{ color: theme.textSecondary, fontSize: 14 }}>
                          {exp.organization}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* ─── RESEARCH SECTION ─── */}
          {data.sectionVisibility.research && (
            <section id="research" style={{ paddingBottom: 96 }}>
              <SectionHeader
                label="RESEARCH"
                theme={theme}
                expanded={researchExpanded}
                onToggle={() => setResearchExpanded(v => !v)}
                count={data.researchAreas.length}
                previewCount={8}
              />
              <div style={{ maxWidth: 700, marginBottom: 40 }}>
                <p
                  style={{
                    color: theme.textSecondary,
                    fontSize: 15,
                    lineHeight: 2,
                    letterSpacing: '0.01em',
                    marginBottom: 32,
                  }}
                >
                  {data.researchHighlight}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {displayedResearchAreas.map((area) => (
                  <span
                    key={area.id}
                    style={{
                      color: theme.textSecondary,
                      fontSize: 13,
                      letterSpacing: '0.08em',
                      padding: '8px 16px',
                      border: `1px solid ${theme.divider}`,
                      borderRadius: 2,
                      transition: 'all 200ms ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = theme.accent;
                      e.currentTarget.style.color = theme.textPrimary;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = theme.divider;
                      e.currentTarget.style.color = theme.textSecondary;
                    }}
                  >
                    {area.name}
                  </span>
                ))}
              </div>
              {!researchExpanded && data.researchAreas.length > 8 && (
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                  <button
                    onClick={() => setResearchExpanded(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: theme.textMuted,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      letterSpacing: '0.1em',
                      transition: 'color 200ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = theme.accent)}
                    onMouseLeave={e => (e.currentTarget.style.color = theme.textMuted)}
                  >
                    EXPAND <ChevronDown size={14} />
                  </button>
                </div>
              )}
            </section>
          )}

          {/* ─── PUBLICATIONS SECTION ─── */}
          {data.sectionVisibility.publications && (
            <section id="publications" style={{ paddingBottom: 96 }}>
              <SectionHeader
                label="PUBLICATIONS"
                theme={theme}
                expanded={pubExpanded}
                onToggle={() => setPubExpanded(v => !v)}
                count={data.publications.length}
                previewCount={PREVIEW_COUNT}
              />

              {/* Alternating L/R layout with center line */}
              <div className="relative">
                {/* Center vertical line */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: 1,
                    backgroundColor: theme.divider,
                    transform: 'translateX(-50%)',
                  }}
                />

                <ul className="space-y-0">
                  {displayedPublications.map((pub, i) => {
                    const isLeft = i % 2 === 0;
                    return (
                      <li
                        key={pub.id}
                        className="relative flex"
                        style={{ paddingTop: 32, paddingBottom: 32 }}
                      >
                        {/* Left slot */}
                        <div
                          className="flex-1"
                          style={{
                            paddingRight: 40,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isLeft ? 'flex-end' : 'flex-start',
                            textAlign: isLeft ? 'right' : 'left',
                            opacity: isLeft ? 1 : 0,
                            pointerEvents: isLeft ? 'auto' : 'none',
                          }}
                        >
                          {isLeft && <PubCard pub={pub} i={i} theme={theme} align="right" />}
                        </div>

                        {/* Center dot */}
                        <div
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: theme.accent,
                            border: `2px solid ${theme.bg}`,
                            zIndex: 2,
                            boxShadow: `0 0 0 1px ${theme.accent}`,
                          }}
                        />

                        {/* Right slot */}
                        <div
                          className="flex-1"
                          style={{
                            paddingLeft: 40,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isLeft ? 'flex-start' : 'flex-start',
                            textAlign: 'left',
                            opacity: !isLeft ? 1 : 0,
                            pointerEvents: !isLeft ? 'auto' : 'none',
                          }}
                        >
                          {!isLeft && <PubCard pub={pub} i={i} theme={theme} align="left" />}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Expand arrow at bottom */}
              {!pubExpanded && data.publications.length > PREVIEW_COUNT && (
                <div style={{ marginTop: 32, textAlign: 'center' }}>
                  <button
                    onClick={() => setPubExpanded(true)}
                    style={{
                      background: 'none',
                      border: `1px solid ${theme.divider}`,
                      cursor: 'pointer',
                      color: theme.textMuted,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      letterSpacing: '0.12em',
                      padding: '8px 20px',
                      borderRadius: 2,
                      transition: 'all 200ms ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = theme.accent;
                      e.currentTarget.style.borderColor = theme.accent;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = theme.textMuted;
                      e.currentTarget.style.borderColor = theme.divider;
                    }}
                  >
                    SHOW ALL {data.publications.length} PUBLICATIONS
                    <ChevronDown size={13} />
                  </button>
                </div>
              )}
            </section>
          )}

          {/* ─── PROJECTS SECTION ─── */}
          {data.sectionVisibility.projects && (
            <section id="projects" style={{ paddingBottom: 96 }}>
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4 flex-1">
                  <span
                    style={{
                      color: theme.textSecondary,
                      fontSize: 12,
                      letterSpacing: '0.18em',
                      fontWeight: 400,
                    }}
                  >
                    PROJECTS
                  </span>
                  <div style={{ flex: 1, height: 1, backgroundColor: theme.divider }} />
                </div>
                <span
                  style={{
                    color: theme.textMuted,
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    marginLeft: 16,
                    whiteSpace: 'nowrap',
                  }}
                >
                  /svnit
                </span>
              </div>

              <div className="space-y-20">
                {data.projects.map((proj, i) => {
                  const isEven = i % 2 === 0;
                  const CardWrapper = proj.link ? 'a' : 'div';
                  return (
                    <CardWrapper
                      key={proj.id}
                      className={`flex flex-col lg:flex-row gap-8 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}
                      {...(proj.link ? { href: proj.link, target: '_blank', rel: 'noopener noreferrer' } : {})}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="flex-1 w-full">
                        <img
                          src={PROJECT_IMAGES[i % PROJECT_IMAGES.length]}
                          alt={proj.title}
                          className="w-full object-cover"
                          style={{
                            height: 280,
                            borderRadius: 4,
                            filter: 'brightness(0.85)',
                            transition: 'transform 300ms ease, filter 300ms ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.filter = 'brightness(1)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.filter = 'brightness(0.85)';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          style={{
                            color: theme.textMuted,
                            fontSize: 12,
                            letterSpacing: '0.08em',
                            marginBottom: 12,
                          }}
                        >
                          ( {String(i + 1).padStart(2, '0')} )
                        </p>
                        <h3
                          style={{
                            color: theme.textPrimary,
                            fontSize: 21,
                            fontWeight: 300,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            marginBottom: 8,
                            lineHeight: 1.3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          {proj.title}
                          {proj.link && <ExternalLink size={18} style={{ color: theme.textMuted }} />}
                        </h3>
                        <p
                          style={{
                            color: theme.textSecondary,
                            fontSize: 14,
                            marginBottom: 16,
                          }}
                        >
                          {proj.funding} / {proj.duration}
                        </p>
                        <span
                          style={{
                            color: proj.status === 'ongoing' ? theme.accentGreen : theme.accent,
                            fontSize: 11,
                            letterSpacing: '0.12em',
                            padding: '4px 10px',
                            border: `1px solid ${proj.status === 'ongoing' ? theme.accentGreen : theme.accent}`,
                            borderRadius: 2,
                          }}
                        >
                          {proj.status.toUpperCase()}
                        </span>
                      </div>
                    </CardWrapper>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── STUDENTS SECTION ─── */}
          {data.sectionVisibility.students && (
            <section id="students" style={{ paddingBottom: 96 }}>
              <SectionHeader
                label="PHD STUDENTS"
                theme={theme}
                expanded={studentsExpanded}
                onToggle={() => setStudentsExpanded(v => !v)}
                count={data.students.length}
                previewCount={PREVIEW_COUNT}
              />
              <ul>
                {displayedStudents.map((student, i) => (
                  <li
                    key={student.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      paddingTop: 20,
                      paddingBottom: 20,
                      borderBottom: `1px solid ${theme.divider}`,
                    }}
                  >
                    <span
                      style={{
                        color: theme.textMuted,
                        fontSize: 12,
                        letterSpacing: '0.05em',
                        width: 40,
                        flexShrink: 0,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <p style={{ color: theme.textPrimary, fontSize: 15, fontWeight: 500, minWidth: 160 }}>
                        {student.name}
                      </p>
                      <p style={{ color: theme.textSecondary, fontSize: 14, flex: 1 }}>
                        {student.topic}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {student.year && (
                        <span style={{ color: theme.textMuted, fontSize: 12 }}>{student.year}</span>
                      )}
                      <span
                        style={{
                          fontSize: 10,
                          letterSpacing: '0.1em',
                          padding: '3px 8px',
                          border: `1px solid ${student.status === 'completed' ? theme.accentGreen : theme.accent}`,
                          color: student.status === 'completed' ? theme.accentGreen : theme.accent,
                          borderRadius: 2,
                        }}
                      >
                        {student.status.toUpperCase()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              {!studentsExpanded && data.students.length > PREVIEW_COUNT && (
                <ExpandButton onClick={() => setStudentsExpanded(true)} count={data.students.length} theme={theme} label="STUDENTS" />
              )}
            </section>
          )}

          {/* ─── PATENTS SECTION ─── */}
          {data.sectionVisibility.patents && (
            <section id="patents" style={{ paddingBottom: 96 }}>
              <SectionHeader
                label="PATENTS"
                theme={theme}
                expanded={patentsExpanded}
                onToggle={() => setPatentsExpanded(v => !v)}
                count={data.patents.length}
                previewCount={PREVIEW_COUNT}
              />
              <div
                className="grid gap-6"
                style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
              >
                {displayedPatents.map((patent, i) => (
                  <div
                    key={patent.id}
                    style={{
                      padding: '20px 24px',
                      border: `1px solid ${theme.divider}`,
                      borderRadius: 4,
                      transition: 'border-color 200ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = theme.accent)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = theme.divider)}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span
                        style={{
                          color: theme.textMuted,
                          fontSize: 12,
                          letterSpacing: '0.05em',
                          flexShrink: 0,
                        }}
                      >
                        ({String(i + 1).padStart(2, '0')})
                      </span>
                      <span
                        style={{
                          color: theme.accentGreen,
                          fontSize: 10,
                          letterSpacing: '0.1em',
                          padding: '2px 8px',
                          border: `1px solid ${theme.accentGreen}`,
                          borderRadius: 2,
                          flexShrink: 0,
                        }}
                      >
                        {patent.status.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ color: theme.textPrimary, fontSize: 14, fontWeight: 500, marginBottom: 10, lineHeight: 1.5 }}>
                      {patent.title}
                    </p>
                    <div className="flex items-center gap-3">
                      <span style={{ color: theme.accent, fontSize: 12, letterSpacing: '0.05em' }}>
                        {patent.number}
                      </span>
                      <span style={{ color: theme.textMuted, fontSize: 12 }}>·</span>
                      <span style={{ color: theme.textMuted, fontSize: 12 }}>{patent.year}</span>
                    </div>
                  </div>
                ))}
              </div>
              {!patentsExpanded && data.patents.length > PREVIEW_COUNT && (
                <ExpandButton onClick={() => setPatentsExpanded(true)} count={data.patents.length} theme={theme} label="PATENTS" />
              )}
            </section>
          )}

          {/* ─── TALKS SECTION ─── */}
          {data.sectionVisibility.talks && (
            <section id="talks" style={{ paddingBottom: 96 }}>
              <SectionHeader
                label="TALKS & WORKSHOPS"
                theme={theme}
                expanded={talksExpanded}
                onToggle={() => setTalksExpanded(v => !v)}
                count={data.talks.length}
                previewCount={PREVIEW_COUNT}
              />
              <div
                className="grid gap-6"
                style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
              >
                {displayedTalks.map((talk, i) => (
                  <div
                    key={talk.id}
                    style={{
                      padding: '20px 24px',
                      border: `1px solid ${theme.divider}`,
                      borderRadius: 4,
                      transition: 'border-color 200ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = theme.accent)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = theme.divider)}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span
                        style={{
                          color: theme.accent,
                          fontSize: 12,
                          letterSpacing: '0.05em',
                        }}
                      >
                        {talk.date}
                      </span>
                      <span
                        style={{
                          color: theme.textMuted,
                          fontSize: 10,
                          letterSpacing: '0.08em',
                          padding: '2px 8px',
                          border: `1px solid ${theme.divider}`,
                          borderRadius: 2,
                          flexShrink: 0,
                        }}
                      >
                        {talk.type.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ color: theme.textPrimary, fontSize: 14, fontWeight: 500, marginBottom: 8, lineHeight: 1.5 }}>
                      {talk.title}
                    </p>
                    <p style={{ color: theme.textSecondary, fontSize: 13 }}>
                      {talk.event}
                    </p>
                  </div>
                ))}
              </div>
              {!talksExpanded && data.talks.length > PREVIEW_COUNT && (
                <ExpandButton onClick={() => setTalksExpanded(true)} count={data.talks.length} theme={theme} label="TALKS" />
              )}
            </section>
          )}

          {/* ─── CONTACT + MEMBERSHIPS ─── */}
          <section id="contact" style={{ paddingBottom: 96 }}>
            <SectionLabel label="CONTACT" theme={theme} />

            {/* Tagline */}
            <p
              style={{
                color: theme.textSecondary,
                fontSize: 15,
                lineHeight: 1.9,
                marginBottom: 40,
                maxWidth: 520,
                letterSpacing: '0.01em',
              }}
            >
              For academic collaborations, research inquiries,
              or speaking invitations — reach out directly.
            </p>

            {/* Contact row */}
            <div
              className="flex flex-col sm:flex-row flex-wrap gap-x-10 gap-y-4"
              style={{
                paddingBottom: 36,
                borderBottom: `1px solid ${theme.divider}`,
                marginBottom: 40,
              }}
            >
              <a
                href={`mailto:${data.profile.email}`}
                className="flex items-center gap-2"
                style={{ textDecoration: 'none', transition: 'color 200ms ease', color: theme.textSecondary }}
                onMouseEnter={e => (e.currentTarget.style.color = theme.textPrimary)}
                onMouseLeave={e => (e.currentTarget.style.color = theme.textSecondary)}
              >
                <Mail size={13} style={{ color: theme.accent, flexShrink: 0 }} />
                <span style={{ fontSize: 14 }}>{data.profile.email}</span>
              </a>
              <div className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
                <Phone size={13} style={{ color: theme.accent, flexShrink: 0 }} />
                <span style={{ fontSize: 14 }}>{data.profile.phone}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
                <MapPin size={13} style={{ color: theme.accent, flexShrink: 0 }} />
                <span style={{ fontSize: 14 }}>{data.profile.office}</span>
              </div>
            </div>

            {/* Bottom two-column: Links + Memberships */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

              {/* Profiles & Links */}
              <div className="flex-1">
                <p
                  style={{
                    color: theme.textMuted,
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    marginBottom: 18,
                  }}
                >
                  PROFILES & LINKS
                </p>
                <div className="flex flex-wrap gap-3">
                  {data.externalLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                      style={{
                        color: theme.textSecondary,
                        fontSize: 13,
                        textDecoration: 'none',
                        padding: '6px 14px',
                        border: `1px solid ${theme.divider}`,
                        borderRadius: 2,
                        transition: 'all 200ms ease',
                        letterSpacing: '0.02em',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = theme.textPrimary;
                        e.currentTarget.style.borderColor = theme.accent;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = theme.textSecondary;
                        e.currentTarget.style.borderColor = theme.divider;
                      }}
                    >
                      {link.platform}
                      <ExternalLink size={10} style={{ color: theme.accent }} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Memberships */}
              {data.sectionVisibility.memberships && data.memberships.length > 0 && (
                <div style={{ minWidth: 260 }}>
                  <p
                    style={{
                      color: theme.textMuted,
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      marginBottom: 18,
                    }}
                  >
                    MEMBERSHIPS
                  </p>
                  <div>
                    {data.memberships.map((m, idx) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between gap-8"
                        style={{
                          paddingTop: 10,
                          paddingBottom: 10,
                          borderBottom: idx < data.memberships.length - 1
                            ? `1px solid ${theme.divider}`
                            : 'none',
                        }}
                      >
                        <span
                          style={{
                            color: theme.textPrimary,
                            fontSize: 13,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {m.organization}
                        </span>
                        <span
                          style={{
                            color: theme.textMuted,
                            fontSize: 12,
                            letterSpacing: '0.06em',
                          }}
                        >
                          {m.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: 64,
                paddingTop: 32,
                borderTop: `1px solid ${theme.divider}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <p style={{ color: theme.textMuted, fontSize: 12 }}>
                © {data.profile.name} · {data.profile.organization}
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

/* ─── Publication Card (reusable) ─── */
function PubCard({ pub, i, theme, align }: { pub: any; i: number; theme: any; align: 'left' | 'right' }) {
  return (
    <div style={{ maxWidth: 340 }}>
      <p
        style={{
          color: theme.textPrimary,
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 8,
          lineHeight: 1.5,
          textAlign: align,
        }}
      >
        {pub.title}
      </p>
      <p style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 6, textAlign: align }}>
        {pub.authors}
      </p>
      <div
        className="flex flex-wrap items-center gap-2"
        style={{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}
      >
        <span style={{ color: theme.textMuted, fontSize: 12 }}>{pub.venue}</span>
        <span style={{ color: theme.divider, fontSize: 12 }}>·</span>
        <span style={{ color: theme.accent, fontSize: 12 }}>{pub.year}</span>
        <span
          style={{
            color: theme.textMuted,
            fontSize: 11,
            letterSpacing: '0.08em',
            padding: '2px 6px',
            border: `1px solid ${theme.divider}`,
            borderRadius: 2,
          }}
        >
          {pub.type.toUpperCase()}
        </span>
        {pub.link && pub.link !== '#' && (
          <a
            href={pub.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: theme.accent,
              fontSize: 12,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            View <ExternalLink size={9} />
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Expand Button ─── */
function ExpandButton({
  onClick,
  count,
  theme,
  label,
}: {
  onClick: () => void;
  count: number;
  theme: any;
  label: string;
}) {
  return (
    <div style={{ marginTop: 28, textAlign: 'center' }}>
      <button
        onClick={onClick}
        style={{
          background: 'none',
          border: `1px solid ${theme.divider}`,
          cursor: 'pointer',
          color: theme.textMuted,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 11,
          letterSpacing: '0.12em',
          padding: '8px 20px',
          borderRadius: 2,
          transition: 'all 200ms ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = theme.accent;
          (e.currentTarget as HTMLButtonElement).style.borderColor = theme.accent;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = theme.textMuted;
          (e.currentTarget as HTMLButtonElement).style.borderColor = theme.divider;
        }}
      >
        SHOW ALL {count} {label}
        <ChevronDown size={13} />
      </button>
    </div>
  );
}