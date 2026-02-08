/**
 * DataVision International - Careers Components
 * Re-exports all careers-related components and data
 */

// Data exports
export { 
  openPositions,
  departments,
  teamMembers,
  benefits,
  expertSectors,
  hiringProcess,
  studentPrograms
} from './careersData';

// Tab Components
export { default as OverviewTab } from './OverviewTab';
export { default as WhyUsTab } from './WhyUsTab';
export { default as JobsTab } from './JobsTab';
export { default as ProcessTab } from './ProcessTab';
export { default as StudentsTab } from './StudentsTab';
export { default as LifeTab } from './LifeTab';
export { default as ExpertsTab } from './ExpertsTab';
export { default as RegisterTab } from './RegisterTab';

// Navigation structure for the careers page
export const careerNavItems = [
  { id: 'overview', label: 'Overview', type: 'single' },
  { 
    id: 'culture', 
    label: 'Our Culture', 
    type: 'dropdown',
    items: [
      { id: 'why-us', label: 'Why Work Here', desc: 'Our mission and values' },
      { id: 'life', label: 'Life at DataVision', desc: 'Team culture and benefits' },
      { id: 'process', label: 'How We Hire', desc: 'Our hiring process' }
    ]
  },
  { 
    id: 'opportunities', 
    label: 'Find Your Role', 
    type: 'dropdown',
    items: [
      { id: 'jobs', label: 'Open Positions', desc: 'Current job openings' },
      { id: 'students', label: 'Students & Graduates', desc: 'Early career programs' },
      { id: 'experts', label: 'Expert Network', desc: 'Join as a consultant' },
      { id: 'register', label: 'Register as Expert', desc: 'Submit your profile' }
    ]
  }
];

// Valid tab IDs for URL routing
export const validTabIds = [
  'overview', 'why-us', 'life', 'process', 
  'jobs', 'students', 'experts', 'register'
];
