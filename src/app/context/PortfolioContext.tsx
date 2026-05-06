import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { toast } from 'sonner';

export interface ProfileData {
  name: string;
  role: string;
  organization: string;
  tags: string[];
  image: string;
  email: string;
  phone: string;
  office: string;
  cvBase64?: string; // base64-encoded PDF for CV download
}

export interface SnapshotData {
  teachingYears: string;
  researchYears: string;
  publications: string;
  projects: string;
}

export interface ResearchArea {
  id: string;
  name: string;
}

export interface TeachingSubject {
  id: string;
  name: string;
}

export interface ExternalLink {
  id: string;
  platform: string;
  url: string;
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  year: string;
}

export interface Experience {
  id: string;
  position: string;
  organization: string;
  startYear: string;
  endYear: string;
  current: boolean;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  year: string;
  venue: string;
  link: string;
  type: 'journal' | 'conference';
}

export interface Project {
  id: string;
  title: string;
  funding: string;
  duration: string;
  status: 'funded' | 'ongoing';
  link?: string;
}

export interface Student {
  id: string;
  name: string;
  topic: string;
  status: 'completed' | 'ongoing';
  year?: string;
}

export interface Patent {
  id: string;
  title: string;
  number: string;
  year: string;
  status: string;
}

export interface Talk {
  id: string;
  title: string;
  event: string;
  date: string;
  type: string;
}

export interface Membership {
  id: string;
  organization: string;
  role: string;
}

export interface SectionVisibility {
  about: boolean;
  education: boolean;
  research: boolean;
  publications: boolean;
  projects: boolean;
  students: boolean;
  patents: boolean;
  talks: boolean;
  memberships: boolean;
}

interface PortfolioData {
  profile: ProfileData;
  snapshot: SnapshotData;
  researchAreas: ResearchArea[];
  teachingSubjects: TeachingSubject[];
  externalLinks: ExternalLink[];
  education: Education[];
  experience: Experience[];
  publications: Publication[];
  projects: Project[];
  students: Student[];
  patents: Patent[];
  talks: Talk[];
  memberships: Membership[];
  sectionVisibility: SectionVisibility;
  aboutText: string;
  researchHighlight: string;
}

interface PortfolioContextType {
  data: PortfolioData;
  updateProfile: (profile: ProfileData) => void;
  updateSnapshot: (snapshot: SnapshotData) => void;
  updateAbout: (text: string) => void;
  updateResearchHighlight: (text: string) => void;
  addResearchArea: (area: Omit<ResearchArea, 'id'>) => void;
  updateResearchArea: (id: string, area: Omit<ResearchArea, 'id'>) => void;
  deleteResearchArea: (id: string) => void;
  addTeachingSubject: (subject: Omit<TeachingSubject, 'id'>) => void;
  updateTeachingSubject: (id: string, subject: Omit<TeachingSubject, 'id'>) => void;
  deleteTeachingSubject: (id: string) => void;
  addExternalLink: (link: Omit<ExternalLink, 'id'>) => void;
  updateExternalLink: (id: string, link: Omit<ExternalLink, 'id'>) => void;
  deleteExternalLink: (id: string) => void;
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Omit<Education, 'id'>) => void;
  deleteEducation: (id: string) => void;
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Omit<Experience, 'id'>) => void;
  deleteExperience: (id: string) => void;
  addPublication: (pub: Omit<Publication, 'id'>) => void;
  updatePublication: (id: string, pub: Omit<Publication, 'id'>) => void;
  deletePublication: (id: string) => void;
  addProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (id: string, proj: Omit<Project, 'id'>) => void;
  deleteProject: (id: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Omit<Student, 'id'>) => void;
  deleteStudent: (id: string) => void;
  addPatent: (patent: Omit<Patent, 'id'>) => void;
  updatePatent: (id: string, patent: Omit<Patent, 'id'>) => void;
  deletePatent: (id: string) => void;
  addTalk: (talk: Omit<Talk, 'id'>) => void;
  updateTalk: (id: string, talk: Omit<Talk, 'id'>) => void;
  deleteTalk: (id: string) => void;
  addMembership: (member: Omit<Membership, 'id'>) => void;
  updateMembership: (id: string, member: Omit<Membership, 'id'>) => void;
  deleteMembership: (id: string) => void;
  toggleSectionVisibility: (section: keyof SectionVisibility) => void;
  resetData: () => void;
}

const defaultData: PortfolioData = {
  profile: {
    name: 'Dr. Shweta Shah',
    role: 'Associate Professor',
    organization: 'SVNIT Surat',
    tags: ['NavIC', 'Wireless Communication', 'GNSS', 'Satellite Systems'],
    image: 'https://images.unsplash.com/photo-1758685734511-4f49ce9a382b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwcm9mZXNzb3IlMjBwb3J0cmFpdCUyMGFjYWRlbWljfGVufDF8fHx8MTc3NTEyNTkxMHww&ixlib=rb-4.1.0&q=80&w=1080',
    email: 'shweta.shah@svnit.ac.in',
    phone: '+91 261 220 1234',
    office: 'EC Department, Room 301'
  },
  snapshot: {
    teachingYears: '17+',
    researchYears: '10+',
    publications: '45+',
    projects: 'Multiple ISRO'
  },
  researchAreas: [
    { id: '1', name: 'NavIC & GNSS Systems' },
    { id: '2', name: 'Interference Mitigation' },
    { id: '3', name: 'Satellite Communication' },
    { id: '4', name: 'Signal Processing' },
    { id: '5', name: 'Wireless Networks' }
  ],
  teachingSubjects: [
    { id: '1', name: 'Wireless Communication' },
    { id: '2', name: 'Satellite Systems' },
    { id: '3', name: 'Digital Signal Processing' },
    { id: '4', name: 'Communication Networks' },
    { id: '5', name: 'Mobile Computing' }
  ],
  externalLinks: [
    { id: '1', platform: 'Google Scholar', url: 'https://scholar.google.com' },
    { id: '2', platform: 'ORCID', url: 'https://orcid.org' },
    { id: '3', platform: 'ResearchGate', url: 'https://researchgate.net' },
    { id: '4', platform: 'LinkedIn', url: 'https://linkedin.com' }
  ],
  education: [
    { id: '1', degree: 'PhD', field: 'Wireless Communication', institution: 'IIT Bombay', year: '2014' },
    { id: '2', degree: 'M.Tech', field: 'Communication Systems', institution: 'NIT Surat', year: '2008' },
    { id: '3', degree: 'B.E.', field: 'Electronics & Communication', institution: 'Gujarat University', year: '2005' }
  ],
  experience: [
    { id: '1', position: 'Associate Professor', organization: 'SVNIT Surat', startYear: '2018', endYear: '', current: true },
    { id: '2', position: 'Assistant Professor', organization: 'SVNIT Surat', startYear: '2014', endYear: '2018', current: false },
    { id: '3', position: 'Research Scholar', organization: 'IIT Bombay', startYear: '2010', endYear: '2014', current: false }
  ],
  publications: [
    { id: '1', title: 'Interference Mitigation Techniques for NavIC Receivers', authors: 'S. Shah, A. Kumar, R. Patel', year: '2023', venue: 'IEEE Transactions on Aerospace', link: '#', type: 'journal' },
    { id: '2', title: 'Performance Analysis of NavIC Signal in Urban Environments', authors: 'S. Shah, M. Sharma', year: '2023', venue: 'Wireless Networks Journal', link: '#', type: 'journal' },
    { id: '3', title: 'Advanced Signal Processing for GNSS Applications', authors: 'S. Shah, P. Desai, K. Mehta', year: '2022', venue: 'IEEE WCNC Conference', link: '#', type: 'conference' },
    { id: '4', title: 'Multipath Mitigation in Navigation Systems', authors: 'S. Shah, V. Singh', year: '2022', venue: 'IEEE GlobeCom', link: '#', type: 'conference' },
    { id: '5', title: 'Adaptive Beamforming for Satellite Navigation', authors: 'S. Shah, R. Kumar, A. Patel', year: '2021', venue: 'Journal of Navigation', link: '#', type: 'journal' }
  ],
  projects: [
    { id: '1', title: 'NavIC Receiver Development', funding: 'ISRO - ₹25 Lakhs', duration: '2022-2024', status: 'funded', link: '#' },
    { id: '2', title: 'Interference Analysis in GNSS Systems', funding: 'DST - ₹18 Lakhs', duration: '2021-2023', status: 'funded', link: '#' },
    { id: '3', title: 'Next-Gen Satellite Communication', funding: 'ISRO - ₹30 Lakhs', duration: '2023-2025', status: 'ongoing', link: '#' },
    { id: '4', title: 'Urban Navigation Enhancement', funding: 'SERB - ₹15 Lakhs', duration: '2024-2026', status: 'ongoing', link: '#' }
  ],
  students: [
    { id: '1', name: 'Amit Kumar', topic: 'NavIC Signal Processing', status: 'completed', year: '2022' },
    { id: '2', name: 'Priya Sharma', topic: 'Interference Mitigation Techniques', status: 'ongoing' },
    { id: '3', name: 'Rahul Patel', topic: 'Multi-GNSS Integration', status: 'ongoing' },
    { id: '4', name: 'Neha Desai', topic: 'Satellite Communication Protocols', status: 'completed', year: '2021' }
  ],
  patents: [
    { id: '1', title: 'Advanced Navigation Receiver Architecture', number: 'IN 302458', year: '2022', status: 'Granted' },
    { id: '2', title: 'Interference Cancellation Method for GNSS', number: 'IN 315672', year: '2023', status: 'Published' }
  ],
  talks: [
    { id: '1', title: 'Future of NavIC Technology', event: 'National Workshop on GNSS', date: '2023-09', type: 'Keynote' },
    { id: '2', title: 'Satellite Communication Trends', event: 'IEEE COMSNETS', date: '2023-06', type: 'Invited Talk' },
    { id: '3', title: 'Research in Wireless Systems', event: 'SVNIT Research Symposium', date: '2023-03', type: 'Presentation' }
  ],
  memberships: [
    { id: '1', organization: 'IEEE', role: 'Senior Member' },
    { id: '2', organization: 'IETE', role: 'Life Member' },
    { id: '3', organization: 'Indian Science Congress', role: 'Member' }
  ],
  sectionVisibility: {
    about: true,
    education: true,
    research: true,
    publications: true,
    projects: true,
    students: true,
    patents: true,
    talks: true,
    memberships: true
  },
  aboutText: 'Dr. Shweta Shah is an Associate Professor in the Electronics Engineering Department at SVNIT Surat. Her research focuses on satellite navigation systems, particularly NavIC (Indian Regional Navigation Satellite System), wireless communication, and GNSS signal processing. She has extensive experience in interference mitigation, multipath analysis, and advanced receiver design. With over 45 publications in reputed journals and conferences, she has made significant contributions to the field of satellite communications.',
  researchHighlight: 'Leading research in NavIC systems with multiple ISRO-funded projects. Specializing in interference mitigation and signal processing for next-generation navigation receivers.'
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isFirstRender = useRef(true);

  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('portfolioData');
    if (!saved) return defaultData;
    try {
      return JSON.parse(saved) as PortfolioData;
    } catch {
      console.warn('PortfolioContext: corrupted localStorage data, using defaults.');
      return defaultData;
    }
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      localStorage.setItem('portfolioData', JSON.stringify(data));
      return;
    }
    localStorage.setItem('portfolioData', JSON.stringify(data));
    toast.success('Saved ✓', { duration: 2000 });
  }, [data]);

  const resetData = () => {
    localStorage.removeItem('portfolioData');
    toast.success('Reset to defaults — reloading…', { duration: 1500 });
    setTimeout(() => window.location.reload(), 1500);
  };

  const updateProfile = (profile: ProfileData) => {
    setData(prev => ({ ...prev, profile }));
  };

  const updateSnapshot = (snapshot: SnapshotData) => {
    setData(prev => ({ ...prev, snapshot }));
  };

  const updateAbout = (text: string) => {
    setData(prev => ({ ...prev, aboutText: text }));
  };

  const updateResearchHighlight = (text: string) => {
    setData(prev => ({ ...prev, researchHighlight: text }));
  };

  const addResearchArea = (area: Omit<ResearchArea, 'id'>) => {
    const newArea = { ...area, id: Date.now().toString() };
    setData(prev => ({ ...prev, researchAreas: [...prev.researchAreas, newArea] }));
  };

  const updateResearchArea = (id: string, area: Omit<ResearchArea, 'id'>) => {
    setData(prev => ({
      ...prev,
      researchAreas: prev.researchAreas.map(a => a.id === id ? { ...area, id } : a)
    }));
  };

  const deleteResearchArea = (id: string) => {
    setData(prev => ({
      ...prev,
      researchAreas: prev.researchAreas.filter(a => a.id !== id)
    }));
  };

  const addTeachingSubject = (subject: Omit<TeachingSubject, 'id'>) => {
    const newSubject = { ...subject, id: Date.now().toString() };
    setData(prev => ({ ...prev, teachingSubjects: [...prev.teachingSubjects, newSubject] }));
  };

  const updateTeachingSubject = (id: string, subject: Omit<TeachingSubject, 'id'>) => {
    setData(prev => ({
      ...prev,
      teachingSubjects: prev.teachingSubjects.map(s => s.id === id ? { ...subject, id } : s)
    }));
  };

  const deleteTeachingSubject = (id: string) => {
    setData(prev => ({
      ...prev,
      teachingSubjects: prev.teachingSubjects.filter(s => s.id !== id)
    }));
  };

  const addExternalLink = (link: Omit<ExternalLink, 'id'>) => {
    const newLink = { ...link, id: Date.now().toString() };
    setData(prev => ({ ...prev, externalLinks: [...prev.externalLinks, newLink] }));
  };

  const updateExternalLink = (id: string, link: Omit<ExternalLink, 'id'>) => {
    setData(prev => ({
      ...prev,
      externalLinks: prev.externalLinks.map(l => l.id === id ? { ...link, id } : l)
    }));
  };

  const deleteExternalLink = (id: string) => {
    setData(prev => ({
      ...prev,
      externalLinks: prev.externalLinks.filter(l => l.id !== id)
    }));
  };

  const addEducation = (edu: Omit<Education, 'id'>) => {
    const newEdu = { ...edu, id: Date.now().toString() };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, edu: Omit<Education, 'id'>) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...edu, id } : e)
    }));
  };

  const deleteEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
  };

  const addExperience = (exp: Omit<Experience, 'id'>) => {
    const newExp = { ...exp, id: Date.now().toString() };
    setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, exp: Omit<Experience, 'id'>) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...exp, id } : e)
    }));
  };

  const deleteExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
  };

  const addPublication = (pub: Omit<Publication, 'id'>) => {
    const newPub = { ...pub, id: Date.now().toString() };
    setData(prev => ({ ...prev, publications: [...prev.publications, newPub] }));
  };

  const updatePublication = (id: string, pub: Omit<Publication, 'id'>) => {
    setData(prev => ({
      ...prev,
      publications: prev.publications.map(p => p.id === id ? { ...pub, id } : p)
    }));
  };

  const deletePublication = (id: string) => {
    setData(prev => ({
      ...prev,
      publications: prev.publications.filter(p => p.id !== id)
    }));
  };

  const addProject = (proj: Omit<Project, 'id'>) => {
    const newProj = { ...proj, id: Date.now().toString() };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProject = (id: string, proj: Omit<Project, 'id'>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...proj, id } : p)
    }));
  };

  const deleteProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Date.now().toString() };
    setData(prev => ({ ...prev, students: [...prev.students, newStudent] }));
  };

  const updateStudent = (id: string, student: Omit<Student, 'id'>) => {
    setData(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...student, id } : s)
    }));
  };

  const deleteStudent = (id: string) => {
    setData(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id)
    }));
  };

  const addPatent = (patent: Omit<Patent, 'id'>) => {
    const newPatent = { ...patent, id: Date.now().toString() };
    setData(prev => ({ ...prev, patents: [...prev.patents, newPatent] }));
  };

  const updatePatent = (id: string, patent: Omit<Patent, 'id'>) => {
    setData(prev => ({
      ...prev,
      patents: prev.patents.map(p => p.id === id ? { ...patent, id } : p)
    }));
  };

  const deletePatent = (id: string) => {
    setData(prev => ({
      ...prev,
      patents: prev.patents.filter(p => p.id !== id)
    }));
  };

  const addTalk = (talk: Omit<Talk, 'id'>) => {
    const newTalk = { ...talk, id: Date.now().toString() };
    setData(prev => ({ ...prev, talks: [...prev.talks, newTalk] }));
  };

  const updateTalk = (id: string, talk: Omit<Talk, 'id'>) => {
    setData(prev => ({
      ...prev,
      talks: prev.talks.map(t => t.id === id ? { ...talk, id } : t)
    }));
  };

  const deleteTalk = (id: string) => {
    setData(prev => ({
      ...prev,
      talks: prev.talks.filter(t => t.id !== id)
    }));
  };

  const addMembership = (member: Omit<Membership, 'id'>) => {
    const newMember = { ...member, id: Date.now().toString() };
    setData(prev => ({ ...prev, memberships: [...prev.memberships, newMember] }));
  };

  const updateMembership = (id: string, member: Omit<Membership, 'id'>) => {
    setData(prev => ({
      ...prev,
      memberships: prev.memberships.map(m => m.id === id ? { ...member, id } : m)
    }));
  };

  const deleteMembership = (id: string) => {
    setData(prev => ({
      ...prev,
      memberships: prev.memberships.filter(m => m.id !== id)
    }));
  };

  const toggleSectionVisibility = (section: keyof SectionVisibility) => {
    setData(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: !prev.sectionVisibility[section]
      }
    }));
  };

  const value: PortfolioContextType = {
    data,
    updateProfile,
    updateSnapshot,
    updateAbout,
    updateResearchHighlight,
    addResearchArea,
    updateResearchArea,
    deleteResearchArea,
    addTeachingSubject,
    updateTeachingSubject,
    deleteTeachingSubject,
    addExternalLink,
    updateExternalLink,
    deleteExternalLink,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    addPublication,
    updatePublication,
    deletePublication,
    addProject,
    updateProject,
    deleteProject,
    addStudent,
    updateStudent,
    deleteStudent,
    addPatent,
    updatePatent,
    deletePatent,
    addTalk,
    updateTalk,
    deleteTalk,
    addMembership,
    updateMembership,
    deleteMembership,
    toggleSectionVisibility,
    resetData,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
