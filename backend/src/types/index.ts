export interface ProfileData {
  name: string;
  role: string;
  organization: string;
  tags: string[];
  image: string;
  email: string;
  phone: string;
  office: string;
  cvBase64?: string;
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

export interface JWTPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
