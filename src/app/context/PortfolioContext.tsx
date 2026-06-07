import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { toast } from 'sonner';
import { portfolioAPI } from '../../api/portfolio';

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
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  funding: string;
  duration: string;
  status: 'funded' | 'ongoing';
  link?: string;
  description?: string;
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

export interface PortfolioData {
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
  loading: boolean;
  error: string | null;
  updateProfile: (profile: ProfileData) => Promise<void>;
  updateSnapshot: (snapshot: SnapshotData) => Promise<void>;
  updateAbout: (text: string) => Promise<void>;
  updateResearchHighlight: (text: string) => Promise<void>;
  addResearchArea: (area: Omit<ResearchArea, 'id'>) => Promise<void>;
  updateResearchArea: (id: string, area: Omit<ResearchArea, 'id'>) => Promise<void>;
  deleteResearchArea: (id: string) => Promise<void>;
  addTeachingSubject: (subject: Omit<TeachingSubject, 'id'>) => Promise<void>;
  updateTeachingSubject: (id: string, subject: Omit<TeachingSubject, 'id'>) => Promise<void>;
  deleteTeachingSubject: (id: string) => Promise<void>;
  addExternalLink: (link: Omit<ExternalLink, 'id'>) => Promise<void>;
  updateExternalLink: (id: string, link: Omit<ExternalLink, 'id'>) => Promise<void>;
  deleteExternalLink: (id: string) => Promise<void>;
  addEducation: (edu: Omit<Education, 'id'>) => Promise<void>;
  updateEducation: (id: string, edu: Omit<Education, 'id'>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  addExperience: (exp: Omit<Experience, 'id'>) => Promise<void>;
  updateExperience: (id: string, exp: Omit<Experience, 'id'>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  addPublication: (pub: Omit<Publication, 'id'>) => Promise<void>;
  updatePublication: (id: string, pub: Omit<Publication, 'id'>) => Promise<void>;
  deletePublication: (id: string) => Promise<void>;
  addProject: (proj: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, proj: Omit<Project, 'id'>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Omit<Student, 'id'>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addPatent: (patent: Omit<Patent, 'id'>) => Promise<void>;
  updatePatent: (id: string, patent: Omit<Patent, 'id'>) => Promise<void>;
  deletePatent: (id: string) => Promise<void>;
  addTalk: (talk: Omit<Talk, 'id'>) => Promise<void>;
  updateTalk: (id: string, talk: Omit<Talk, 'id'>) => Promise<void>;
  deleteTalk: (id: string) => Promise<void>;
  addMembership: (member: Omit<Membership, 'id'>) => Promise<void>;
  updateMembership: (id: string, member: Omit<Membership, 'id'>) => Promise<void>;
  deleteMembership: (id: string) => Promise<void>;
  toggleSectionVisibility: (section: keyof SectionVisibility) => Promise<void>;
  resetData: () => Promise<void>;
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
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<string>('');
  const isVisibleRef = useRef(true);

  // Fetch portfolio on mount and set up polling for real-time updates
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const portfolio = await portfolioAPI.getPortfolio();
        setData(portfolio);
        lastDataRef.current = JSON.stringify(portfolio);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch portfolio:', err);
        setError(err.response?.data?.error || 'Failed to load portfolio');
        setData(defaultData);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchPortfolio();

    // Handle page visibility changes (pause polling when page is hidden)
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    // Set up polling to check for updates every 5 seconds
    const startPolling = () => {
      pollIntervalRef.current = setInterval(async () => {
        if (!isVisibleRef.current) return; // Skip polling if page is hidden

        try {
          const portfolio = await portfolioAPI.getPortfolio();
          const portfolioString = JSON.stringify(portfolio);
          
          // Only update state if data has changed
          if (portfolioString !== lastDataRef.current) {
            setData(portfolio);
            lastDataRef.current = portfolioString;
            console.log('✓ Portfolio updated from backend');
          }
        } catch (err) {
          console.error('Failed to poll portfolio:', err);
        }
      }, 5000); // Poll every 5 seconds
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup polling on unmount
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleError = (err: any) => {
    const message = err.response?.data?.error || 'An error occurred';
    setError(message);
    toast.error(message);
  };

  const updateProfile = async (profile: ProfileData) => {
    const oldData = data;
    setData(prev => ({ ...prev, profile }));
    try {
      await portfolioAPI.updateSection('profile', profile);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updateSnapshot = async (snapshot: SnapshotData) => {
    const oldData = data;
    setData(prev => ({ ...prev, snapshot }));
    try {
      await portfolioAPI.updateSection('snapshot', snapshot);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updateAbout = async (text: string) => {
    const oldData = data;
    setData(prev => ({ ...prev, aboutText: text }));
    try {
      await portfolioAPI.updateSection('aboutText', text);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updateResearchHighlight = async (text: string) => {
    const oldData = data;
    setData(prev => ({ ...prev, researchHighlight: text }));
    try {
      await portfolioAPI.updateSection('researchHighlight', text);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const addResearchArea = async (area: Omit<ResearchArea, 'id'>) => {
    const newArea = { ...area, id: Date.now().toString() };
    const oldData = data;
    setData(prev => ({ ...prev, researchAreas: [...prev.researchAreas, newArea] }));
    try {
      await portfolioAPI.updateSection('researchAreas', data.researchAreas);
      toast.success('Added ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updateResearchArea = async (id: string, area: Omit<ResearchArea, 'id'>) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      researchAreas: prev.researchAreas.map(a => a.id === id ? { ...area, id } : a)
    }));
    try {
      await portfolioAPI.updateSection('researchAreas', data.researchAreas);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const deleteResearchArea = async (id: string) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      researchAreas: prev.researchAreas.filter(a => a.id !== id)
    }));
    try {
      await portfolioAPI.updateSection('researchAreas', data.researchAreas);
      toast.success('Deleted ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const addTeachingSubject = async (subject: Omit<TeachingSubject, 'id'>) => {
    const newSubject = { ...subject, id: Date.now().toString() };
    const oldData = data;
    setData(prev => ({ ...prev, teachingSubjects: [...prev.teachingSubjects, newSubject] }));
    try {
      await portfolioAPI.updateSection('teachingSubjects', data.teachingSubjects);
      toast.success('Added ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updateTeachingSubject = async (id: string, subject: Omit<TeachingSubject, 'id'>) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      teachingSubjects: prev.teachingSubjects.map(s => s.id === id ? { ...subject, id } : s)
    }));
    try {
      await portfolioAPI.updateSection('teachingSubjects', data.teachingSubjects);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const deleteTeachingSubject = async (id: string) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      teachingSubjects: prev.teachingSubjects.filter(s => s.id !== id)
    }));
    try {
      await portfolioAPI.updateSection('teachingSubjects', data.teachingSubjects);
      toast.success('Deleted ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const addExternalLink = async (link: Omit<ExternalLink, 'id'>) => {
    const newLink = { ...link, id: Date.now().toString() };
    const oldData = data;
    setData(prev => ({ ...prev, externalLinks: [...prev.externalLinks, newLink] }));
    try {
      await portfolioAPI.updateSection('externalLinks', data.externalLinks);
      toast.success('Added ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updateExternalLink = async (id: string, link: Omit<ExternalLink, 'id'>) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      externalLinks: prev.externalLinks.map(l => l.id === id ? { ...link, id } : l)
    }));
    try {
      await portfolioAPI.updateSection('externalLinks', data.externalLinks);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const deleteExternalLink = async (id: string) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      externalLinks: prev.externalLinks.filter(l => l.id !== id)
    }));
    try {
      await portfolioAPI.updateSection('externalLinks', data.externalLinks);
      toast.success('Deleted ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const addEducation = async (edu: Omit<Education, 'id'>) => {
    const newEdu = { ...edu, id: Date.now().toString() };
    const oldData = data;
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
    try {
      await portfolioAPI.updateSection('education', data.education);
      toast.success('Added ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updateEducation = async (id: string, edu: Omit<Education, 'id'>) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...edu, id } : e)
    }));
    try {
      await portfolioAPI.updateSection('education', data.education);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const deleteEducation = async (id: string) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
    try {
      await portfolioAPI.updateSection('education', data.education);
      toast.success('Deleted ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const addExperience = async (exp: Omit<Experience, 'id'>) => {
    const newExp = { ...exp, id: Date.now().toString() };
    const oldData = data;
    setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
    try {
      await portfolioAPI.updateSection('experience', data.experience);
      toast.success('Added ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updateExperience = async (id: string, exp: Omit<Experience, 'id'>) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...exp, id } : e)
    }));
    try {
      await portfolioAPI.updateSection('experience', data.experience);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const deleteExperience = async (id: string) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
    try {
      await portfolioAPI.updateSection('experience', data.experience);
      toast.success('Deleted ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const addPublication = async (pub: Omit<Publication, 'id'>) => {
    const newPub = { ...pub, id: Date.now().toString() };
    const oldData = data;
    setData(prev => ({ ...prev, publications: [...prev.publications, newPub] }));
    try {
      await portfolioAPI.updateSection('publications', data.publications);
      toast.success('Added ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updatePublication = async (id: string, pub: Omit<Publication, 'id'>) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      publications: prev.publications.map(p => p.id === id ? { ...pub, id } : p)
    }));
    try {
      await portfolioAPI.updateSection('publications', data.publications);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const deletePublication = async (id: string) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      publications: prev.publications.filter(p => p.id !== id)
    }));
    try {
      await portfolioAPI.updateSection('publications', data.publications);
      toast.success('Deleted ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const addProject = async (proj: Omit<Project, 'id'>) => {
    const newProj = { ...proj, id: Date.now().toString() };
    const oldData = data;
    setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
    try {
      await portfolioAPI.updateSection('projects', data.projects);
      toast.success('Added ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updateProject = async (id: string, proj: Omit<Project, 'id'>) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...proj, id } : p)
    }));
    try {
      await portfolioAPI.updateSection('projects', data.projects);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const deleteProject = async (id: string) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
    try {
      await portfolioAPI.updateSection('projects', data.projects);
      toast.success('Deleted ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Date.now().toString() };
    const oldData = data;
    setData(prev => ({ ...prev, students: [...prev.students, newStudent] }));
    try {
      await portfolioAPI.updateSection('students', data.students);
      toast.success('Added ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updateStudent = async (id: string, student: Omit<Student, 'id'>) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...student, id } : s)
    }));
    try {
      await portfolioAPI.updateSection('students', data.students);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const deleteStudent = async (id: string) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id)
    }));
    try {
      await portfolioAPI.updateSection('students', data.students);
      toast.success('Deleted ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const addPatent = async (patent: Omit<Patent, 'id'>) => {
    const newPatent = { ...patent, id: Date.now().toString() };
    const oldData = data;
    setData(prev => ({ ...prev, patents: [...prev.patents, newPatent] }));
    try {
      await portfolioAPI.updateSection('patents', data.patents);
      toast.success('Added ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updatePatent = async (id: string, patent: Omit<Patent, 'id'>) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      patents: prev.patents.map(p => p.id === id ? { ...patent, id } : p)
    }));
    try {
      await portfolioAPI.updateSection('patents', data.patents);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const deletePatent = async (id: string) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      patents: prev.patents.filter(p => p.id !== id)
    }));
    try {
      await portfolioAPI.updateSection('patents', data.patents);
      toast.success('Deleted ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const addTalk = async (talk: Omit<Talk, 'id'>) => {
    const newTalk = { ...talk, id: Date.now().toString() };
    const oldData = data;
    setData(prev => ({ ...prev, talks: [...prev.talks, newTalk] }));
    try {
      await portfolioAPI.updateSection('talks', data.talks);
      toast.success('Added ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updateTalk = async (id: string, talk: Omit<Talk, 'id'>) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      talks: prev.talks.map(t => t.id === id ? { ...talk, id } : t)
    }));
    try {
      await portfolioAPI.updateSection('talks', data.talks);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const deleteTalk = async (id: string) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      talks: prev.talks.filter(t => t.id !== id)
    }));
    try {
      await portfolioAPI.updateSection('talks', data.talks);
      toast.success('Deleted ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const addMembership = async (member: Omit<Membership, 'id'>) => {
    const newMember = { ...member, id: Date.now().toString() };
    const oldData = data;
    setData(prev => ({ ...prev, memberships: [...prev.memberships, newMember] }));
    try {
      await portfolioAPI.updateSection('memberships', data.memberships);
      toast.success('Added ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const updateMembership = async (id: string, member: Omit<Membership, 'id'>) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      memberships: prev.memberships.map(m => m.id === id ? { ...member, id } : m)
    }));
    try {
      await portfolioAPI.updateSection('memberships', data.memberships);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const deleteMembership = async (id: string) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      memberships: prev.memberships.filter(m => m.id !== id)
    }));
    try {
      await portfolioAPI.updateSection('memberships', data.memberships);
      toast.success('Deleted ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const toggleSectionVisibility = async (section: keyof SectionVisibility) => {
    const oldData = data;
    setData(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: !prev.sectionVisibility[section]
      }
    }));
    try {
      await portfolioAPI.updateSection('sectionVisibility', data.sectionVisibility);
      toast.success('Saved ✓', { duration: 2000 });
    } catch (err) {
      setData(oldData);
      handleError(err);
    }
  };

  const resetData = async () => {
    setData(defaultData);
    toast.success('Reset to defaults', { duration: 1500 });
  };

  const value: PortfolioContextType = {
    data,
    loading,
    error,
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
