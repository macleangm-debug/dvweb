/**
 * Survey360 Product Data
 * Contains all content for the Survey360 product pages
 */

// Brand colors for Survey360
export const survey360Brand = {
  primary: '#0d9488', // Teal
  secondary: '#14b8a6',
  accent: '#2dd4bf',
  dark: '#0f766e',
  light: '#ccfbf1'
};

// Key statistics
export const survey360Stats = [
  { value: '500+', label: 'Organizations', desc: 'Trust Survey360' },
  { value: '2M+', label: 'Responses', desc: 'Collected monthly' },
  { value: '99.9%', label: 'Uptime', desc: 'Platform reliability' },
  { value: '50+', label: 'Countries', desc: 'Global reach' }
];

// Main features
export const survey360Features = [
  {
    id: 'builder',
    title: 'Intuitive Survey Builder',
    description: 'Create professional surveys in minutes with our drag-and-drop builder. No coding required.',
    icon: 'Layers',
    details: [
      '10 question types (text, choice, rating, date, etc.)',
      'Smart skip logic and branching',
      'Custom branding with logo and colors',
      'Multi-language support',
      'Pre-built templates library'
    ]
  },
  {
    id: 'distribution',
    title: 'Flexible Distribution',
    description: 'Reach your audience through multiple channels with ease.',
    icon: 'Share2',
    details: [
      'Public shareable links',
      'QR code generation',
      'Website embed codes',
      'Email invitations',
      'Social media sharing'
    ]
  },
  {
    id: 'collection',
    title: 'Real-Time Collection',
    description: 'Watch responses come in live with our real-time dashboard.',
    icon: 'Activity',
    details: [
      'Live response tracking',
      'Automatic data validation',
      'Response limits and deadlines',
      'Duplicate prevention',
      'Mobile-optimized forms'
    ]
  },
  {
    id: 'analytics',
    title: 'Powerful Analytics',
    description: 'Transform raw data into actionable insights instantly.',
    icon: 'BarChart3',
    details: [
      'Visual charts and graphs',
      'Cross-tabulation analysis',
      'Filter and segment data',
      'Trend analysis',
      'Custom reports'
    ]
  },
  {
    id: 'export',
    title: 'Easy Data Export',
    description: 'Export your data in multiple formats for further analysis.',
    icon: 'Download',
    details: [
      'CSV and Excel export',
      'PDF reports',
      'API access for integrations',
      'Scheduled exports',
      'Data backup'
    ]
  },
  {
    id: 'security',
    title: 'Enterprise Security',
    description: 'Your data is protected with industry-leading security measures.',
    icon: 'Shield',
    details: [
      'End-to-end encryption',
      'GDPR compliance',
      'Role-based access control',
      'Audit trails',
      'Data anonymization'
    ]
  }
];

// Question types supported
export const questionTypes = [
  { name: 'Short Text', icon: 'Type', desc: 'Single line text input' },
  { name: 'Long Text', icon: 'AlignLeft', desc: 'Multi-line paragraph' },
  { name: 'Single Choice', icon: 'CircleDot', desc: 'Radio button selection' },
  { name: 'Multiple Choice', icon: 'CheckSquare', desc: 'Checkbox selection' },
  { name: 'Dropdown', icon: 'ChevronDown', desc: 'Select from list' },
  { name: 'Date', icon: 'Calendar', desc: 'Date picker' },
  { name: 'Number', icon: 'Hash', desc: 'Numeric input' },
  { name: 'Email', icon: 'Mail', desc: 'Email validation' },
  { name: 'Phone', icon: 'Phone', desc: 'Phone number' },
  { name: 'Rating', icon: 'Star', desc: 'Star rating scale' }
];

// How it works steps
export const howItWorks = [
  {
    step: 1,
    title: 'Create Your Survey',
    description: 'Use our intuitive drag-and-drop builder to design your survey. Choose from 10 question types and customize the look with your brand colors.',
    icon: 'PenTool'
  },
  {
    step: 2,
    title: 'Add Logic & Branching',
    description: 'Make your survey smart with skip logic. Show or hide questions based on previous answers for a personalized experience.',
    icon: 'GitBranch'
  },
  {
    step: 3,
    title: 'Distribute & Collect',
    description: 'Share your survey via link, QR code, or embed it on your website. Watch responses come in real-time.',
    icon: 'Send'
  },
  {
    step: 4,
    title: 'Analyze & Export',
    description: 'Visualize your results with charts and graphs. Export data to CSV, Excel, or access via API for deeper analysis.',
    icon: 'TrendingUp'
  }
];

// Testimonials
export const testimonials = [
  {
    quote: "Survey360 transformed how we collect feedback. The interface is intuitive and our response rates increased by 40%.",
    author: "Dr. Sarah Mwangi",
    role: "Research Director",
    organization: "Tanzania Health Institute",
    avatar: null
  },
  {
    quote: "The skip logic feature saves us hours of manual filtering. It's exactly what we needed for our M&E work.",
    author: "James Okonkwo",
    role: "Program Manager",
    organization: "UNICEF East Africa",
    avatar: null
  },
  {
    quote: "Finally, a survey tool that works offline! Our field teams can collect data anywhere, even without internet.",
    author: "Maria Santos",
    role: "Field Operations Lead",
    organization: "World Food Programme",
    avatar: null
  }
];

// Pricing plans
export const pricingPlans = [
  {
    id: 'survey360_monthly',
    name: 'Monthly',
    price: 99,
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      'Up to 5 active surveys',
      '1,000 responses/month',
      'Basic analytics',
      '10 question types',
      'Email support',
      'CSV export'
    ],
    popular: false
  },
  {
    id: 'survey360_annual',
    name: 'Annual',
    price: 990,
    period: '/year',
    description: 'Best value for teams',
    features: [
      'Unlimited surveys',
      '10,000 responses/month',
      'Advanced analytics',
      'Skip logic & branching',
      'Priority support',
      'API access',
      'Custom branding',
      'Team collaboration'
    ],
    popular: true,
    savings: 'Save $198/year'
  },
  {
    id: 'survey360_enterprise',
    name: 'Enterprise',
    price: null,
    period: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited everything',
      'Dedicated account manager',
      'Custom integrations',
      'On-premise option',
      'SLA guarantee',
      'Training & onboarding',
      'Advanced security',
      'White-label option'
    ],
    popular: false
  }
];

// FAQ items
export const faqItems = [
  {
    question: 'How do I get started with Survey360?',
    answer: 'Getting started is easy! Sign up for a free trial, create your first survey using our drag-and-drop builder, and share it with your audience. No credit card required to start.'
  },
  {
    question: 'Can I use Survey360 offline?',
    answer: 'Yes! Our mobile app supports offline data collection. Responses are stored securely on the device and automatically sync when internet connection is restored.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use end-to-end encryption, store data in secure data centers, and comply with GDPR and other data protection regulations. Your data belongs to you.'
  },
  {
    question: 'Can I customize the look of my surveys?',
    answer: 'Yes! You can add your logo, choose brand colors, customize thank you messages, and even use custom CSS for advanced styling.'
  },
  {
    question: 'What export formats are supported?',
    answer: 'Survey360 supports CSV, Excel (.xlsx), PDF reports, and JSON via API. Enterprise plans also support SPSS and Stata formats.'
  },
  {
    question: 'Can multiple team members collaborate?',
    answer: 'Yes! Annual and Enterprise plans include team collaboration features. You can invite team members and assign different permission levels.'
  },
  {
    question: 'Do you offer discounts for NGOs?',
    answer: 'Yes, we offer special pricing for non-profits, NGOs, and educational institutions. Contact our sales team for details.'
  },
  {
    question: 'How do I contact support?',
    answer: 'Email us at support@survey360.io or use the in-app chat. Annual and Enterprise customers get priority support with faster response times.'
  }
];

// Use cases
export const useCases = [
  {
    id: 'research',
    title: 'Academic Research',
    description: 'Conduct surveys for dissertations, studies, and academic projects with robust data collection.',
    icon: 'GraduationCap',
    examples: ['Student feedback', 'Research studies', 'Thesis surveys']
  },
  {
    id: 'ngo',
    title: 'NGO & Development',
    description: 'Monitor and evaluate programs, collect beneficiary feedback, and report to donors.',
    icon: 'Heart',
    examples: ['Baseline surveys', 'Impact assessments', 'Beneficiary tracking']
  },
  {
    id: 'hr',
    title: 'HR & Employee',
    description: 'Measure employee satisfaction, conduct 360 reviews, and gather workplace feedback.',
    icon: 'Users',
    examples: ['Employee engagement', 'Exit interviews', 'Training feedback']
  },
  {
    id: 'customer',
    title: 'Customer Feedback',
    description: 'Understand your customers better with NPS, satisfaction, and product feedback surveys.',
    icon: 'MessageSquare',
    examples: ['NPS surveys', 'Product feedback', 'Support satisfaction']
  },
  {
    id: 'market',
    title: 'Market Research',
    description: 'Gather market intelligence, test concepts, and understand consumer preferences.',
    icon: 'TrendingUp',
    examples: ['Brand awareness', 'Product testing', 'Competitor analysis']
  },
  {
    id: 'events',
    title: 'Events & Training',
    description: 'Collect registrations, gather feedback, and evaluate event success.',
    icon: 'Calendar',
    examples: ['Event registration', 'Post-event feedback', 'Training evaluation']
  }
];

// Navigation structure
export const survey360NavItems = [
  { id: 'overview', label: 'Overview', type: 'single' },
  { id: 'features', label: 'Features', type: 'single' },
  { id: 'how-it-works', label: 'How It Works', type: 'single' },
  { id: 'use-cases', label: 'Use Cases', type: 'single' },
  { id: 'testimonials', label: 'Testimonials', type: 'single' },
  { id: 'pricing', label: 'Pricing', type: 'single' },
  { id: 'faq', label: 'FAQ', type: 'single' }
];

export const validSurvey360TabIds = [
  'overview', 'features', 'how-it-works', 'use-cases', 
  'testimonials', 'pricing', 'faq'
];
