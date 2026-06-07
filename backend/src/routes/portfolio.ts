import { Router, Request, Response } from 'express';
import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';
import { verifyJWT } from '../middleware/auth.js';
import { PortfolioData } from '../types/index.js';

const router = Router();

const defaultPortfolioData: PortfolioData = {
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

router.get('/', async (req: Request, res: Response) => {
  try {
    // In single-user CMS, return first portfolio or create one
    let portfolio = await Portfolio.findOne().populate('owner', '-passwordHash');

    if (!portfolio) {
      // Create default portfolio if none exists
      const user = await User.findOne();
      if (!user) {
        res.status(404).json({ error: 'No user found. Please seed the database.' });
        return;
      }

      portfolio = await Portfolio.create({
        owner: user._id,
        data: defaultPortfolioData
      });
    }

    res.json(portfolio.data);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/', verifyJWT, async (req: Request, res: Response) => {
  try {
    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      const user = await User.findById(req.user?.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      portfolio = await Portfolio.create({
        owner: user._id,
        data: defaultPortfolioData
      });
    }

    // Deep merge incoming data with existing
    const updatedData = { ...portfolio.data, ...req.body };
    portfolio.data = updatedData;
    await portfolio.save();

    res.json(portfolio.data);
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:section', verifyJWT, async (req: Request, res: Response) => {
  try {
    const { section } = req.params;
    const validSections = [
      'profile',
      'snapshot',
      'researchAreas',
      'teachingSubjects',
      'externalLinks',
      'education',
      'experience',
      'publications',
      'projects',
      'students',
      'patents',
      'talks',
      'memberships',
      'sectionVisibility',
      'aboutText',
      'researchHighlight'
    ];

    if (!validSections.includes(section)) {
      res.status(400).json({ error: 'Invalid section' });
      return;
    }

    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      const user = await User.findById(req.user?.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      portfolio = await Portfolio.create({
        owner: user._id,
        data: defaultPortfolioData
      });
    }

    (portfolio.data as any)[section] = req.body;
    await portfolio.save();

    res.json({
      success: true,
      data: (portfolio.data as any)[section]
    });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
