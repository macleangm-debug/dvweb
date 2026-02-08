/**
 * DataVision International - Careers Page Data
 * Static data for positions, benefits, team members, and expert sectors
 */

import { 
  DollarSign, Heart, GraduationCap, Plane, Clock, Coffee, TrendingUp, Users 
} from 'lucide-react';

export const openPositions = [
  {
    id: 1,
    title: 'Senior Research Analyst',
    department: 'Research & Analytics',
    location: 'Dar es Salaam',
    type: 'Full-time',
    experience: '5+ years',
    posted: '2 days ago',
    description: 'Lead complex research projects across multiple sectors, managing teams of analysts and ensuring delivery of high-quality insights.',
    requirements: ['Masters degree in Statistics, Economics, or related field', '5+ years in research/consulting', 'Advanced data analysis skills', 'Team leadership experience'],
    featured: true
  },
  {
    id: 2,
    title: 'Data Scientist',
    department: 'Data Analytics',
    location: 'Dar es Salaam',
    type: 'Full-time',
    experience: '3+ years',
    posted: '1 week ago',
    description: 'Apply machine learning and statistical modeling to solve complex development challenges across Africa.',
    requirements: ['Masters/PhD in Data Science, Statistics, or related field', 'Proficiency in Python, R', 'Experience with ML frameworks', 'Strong communication skills'],
    featured: true
  },
  {
    id: 3,
    title: 'M&E Specialist',
    department: 'Monitoring & Evaluation',
    location: 'Dar es Salaam / Remote',
    type: 'Full-time',
    experience: '4+ years',
    posted: '3 days ago',
    description: 'Design and implement M&E frameworks for donor-funded programs across East Africa.',
    requirements: ['Bachelors degree minimum', '4+ years M&E experience', 'Knowledge of donor requirements', 'Field research experience'],
    featured: false
  },
  {
    id: 4,
    title: 'Field Operations Manager',
    department: 'Operations',
    location: 'Dar es Salaam',
    type: 'Full-time',
    experience: '5+ years',
    posted: '5 days ago',
    description: 'Oversee large-scale data collection operations, managing field teams across Tanzania.',
    requirements: ['Bachelors degree', '5+ years field operations experience', 'Team management skills', 'Valid drivers license'],
    featured: false
  },
  {
    id: 5,
    title: 'Graduate Research Associate',
    department: 'Research & Analytics',
    location: 'Dar es Salaam',
    type: 'Full-time',
    experience: '0-2 years',
    posted: '1 week ago',
    description: 'Join our graduate program and develop your research skills while working on impactful projects.',
    requirements: ['Recent graduate (within 2 years)', 'Strong academic record', 'Analytical mindset', 'Fluent in English and Swahili'],
    featured: false
  },
  {
    id: 6,
    title: 'Software Developer',
    department: 'Technology',
    location: 'Dar es Salaam / Remote',
    type: 'Full-time',
    experience: '3+ years',
    posted: '4 days ago',
    description: 'Build and maintain our suite of data collection and analytics software products.',
    requirements: ['Bachelors in Computer Science or related', '3+ years development experience', 'React, Python, Mobile development', 'Experience with databases'],
    featured: true
  }
];

export const departments = [
  { name: 'All Departments', count: openPositions.length },
  { name: 'Research & Analytics', count: 2 },
  { name: 'Data Analytics', count: 1 },
  { name: 'Monitoring & Evaluation', count: 1 },
  { name: 'Operations', count: 1 },
  { name: 'Technology', count: 1 }
];

export const teamMembers = [
  {
    name: 'Dr. Sarah Mwangi',
    role: 'Director of Research',
    quote: 'At DataVision, every project is an opportunity to create real impact. Our work directly influences policies that affect millions of lives.',
    years: 8
  },
  {
    name: 'James Kimathi',
    role: 'Senior Data Scientist',
    quote: 'The diversity of projects keeps me challenged and growing. One month Im analyzing agricultural data, the next Im building healthcare dashboards.',
    years: 4
  },
  {
    name: 'Amina Hassan',
    role: 'M&E Specialist',
    quote: 'What I love most is the mentorship culture. Senior colleagues genuinely invest in your development.',
    years: 3
  }
];

export const benefits = [
  { icon: DollarSign, title: 'Competitive Compensation', desc: 'Market-leading salaries with performance bonuses' },
  { icon: Heart, title: 'Health Insurance', desc: 'Comprehensive medical coverage for you and family' },
  { icon: GraduationCap, title: 'Learning & Development', desc: 'Annual training budget and conference attendance' },
  { icon: Plane, title: 'Travel Opportunities', desc: 'Work across East Africa on diverse projects' },
  { icon: Clock, title: 'Flexible Work', desc: 'Hybrid arrangements and flexible hours' },
  { icon: Coffee, title: 'Work-Life Balance', desc: 'Generous leave policy and wellness programs' },
  { icon: TrendingUp, title: 'Career Growth', desc: 'Clear progression paths and promotions' },
  { icon: Users, title: 'Collaborative Culture', desc: 'Supportive team environment and mentorship' }
];

export const expertSectors = [
  { 
    id: 'agriculture',
    name: 'Agriculture & Food Security',
    icon: '🌾',
    description: 'Agricultural economics, value chain analysis, food systems, climate-smart agriculture',
    skills: ['Agricultural surveys', 'Value chain analysis', 'Food security assessments', 'Agri-finance research']
  },
  { 
    id: 'health',
    name: 'Health & Pharmaceuticals',
    icon: '🏥',
    description: 'Public health, healthcare systems, pharmaceutical research, health economics',
    skills: ['Health facility assessments', 'Disease surveillance', 'Health economics', 'Clinical research']
  },
  { 
    id: 'education',
    name: 'Education & Training',
    icon: '📚',
    description: 'Education policy, curriculum development, learning outcomes, EdTech',
    skills: ['Learning assessments', 'Teacher training evaluation', 'Education policy analysis', 'School surveys']
  },
  { 
    id: 'wash',
    name: 'Water, Sanitation & Hygiene',
    icon: '💧',
    description: 'WASH infrastructure, water quality, sanitation programs, hygiene behavior',
    skills: ['WASH surveys', 'Water quality testing', 'Sanitation mapping', 'Behavior change research']
  },
  { 
    id: 'governance',
    name: 'Governance & Public Policy',
    icon: '🏛️',
    description: 'Public administration, policy analysis, institutional assessments, governance reforms',
    skills: ['Policy analysis', 'Institutional assessments', 'Public expenditure reviews', 'Governance indicators']
  },
  { 
    id: 'energy',
    name: 'Energy & Environment',
    icon: '⚡',
    description: 'Renewable energy, environmental impact, climate change, natural resources',
    skills: ['Energy access surveys', 'Environmental assessments', 'Climate vulnerability', 'Resource mapping']
  },
  { 
    id: 'finance',
    name: 'Financial Services & Inclusion',
    icon: '💰',
    description: 'Financial inclusion, microfinance, banking, fintech, economic development',
    skills: ['Financial diaries', 'Market research', 'Impact evaluation', 'Fintech assessments']
  },
  { 
    id: 'gender',
    name: 'Gender & Social Development',
    icon: '⚖️',
    description: 'Gender analysis, social protection, youth development, vulnerable populations',
    skills: ['Gender assessments', 'Social protection surveys', 'Youth studies', 'Inclusion research']
  },
  { 
    id: 'data',
    name: 'Data Science & Analytics',
    icon: '📊',
    description: 'Statistical modeling, machine learning, data visualization, big data',
    skills: ['Statistical analysis', 'Machine learning', 'GIS & mapping', 'Dashboard development']
  },
  { 
    id: 'me',
    name: 'Monitoring & Evaluation',
    icon: '📈',
    description: 'M&E frameworks, impact evaluation, theory of change, results measurement',
    skills: ['M&E design', 'Impact evaluation', 'Logical frameworks', 'Results-based management']
  }
];

export const hiringProcess = [
  { step: 1, title: 'Application', desc: 'Submit your CV and cover letter through our online portal', duration: '~15 min' },
  { step: 2, title: 'Initial Screening', desc: 'Our HR team reviews your application', duration: '1-2 weeks' },
  { step: 3, title: 'Technical Assessment', desc: 'Complete a role-specific technical test', duration: '3-5 days' },
  { step: 4, title: 'Panel Interview', desc: 'Meet with the hiring manager and team members', duration: '1-2 hours' },
  { step: 5, title: 'Final Interview', desc: 'Discussion with senior leadership', duration: '1 hour' },
  { step: 6, title: 'Offer', desc: 'Receive and review your offer package', duration: '1-2 weeks' }
];

export const studentPrograms = [
  {
    title: 'Graduate Associate Program',
    duration: '24 months',
    description: 'A comprehensive rotational program for recent graduates to develop expertise across multiple departments.',
    features: ['Structured mentorship', 'Cross-departmental rotations', 'Professional development workshops', 'Pathway to permanent roles']
  },
  {
    title: 'Research Internship',
    duration: '3-6 months',
    description: 'Hands-on research experience supporting our project teams on active engagements.',
    features: ['Real project exposure', 'Skills training', 'Certificate of completion', 'Potential conversion to full-time']
  },
  {
    title: 'Data Fellowship',
    duration: '6 months',
    description: 'Intensive program for data enthusiasts to develop analytics and visualization skills.',
    features: ['Python & R training', 'Dashboard development', 'Machine learning basics', 'Portfolio building']
  }
];
