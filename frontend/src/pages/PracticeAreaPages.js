import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, BarChart3, Users, Globe, Target,
  BookOpen, Droplets, Heart, Sprout, Building2, Shield, TrendingUp,
  Briefcase, Scale, Lightbulb, Zap, MapPin, Award, Home, Truck,
  Baby, HandHeart, Utensils, AlertTriangle, GraduationCap, Factory
} from 'lucide-react';

// Shared Components for Practice Area Pages
const PracticeHero = ({ icon: Icon, color, title, tagline, description }) => (
  <section className="bg-[#0a1628] text-white py-24 lg:py-32 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 20% 30%, ${color}40 0%, transparent 50%), 
                          radial-gradient(circle at 80% 70%, ${color}30 0%, transparent 40%)`
      }} />
    </div>
    <div className="container mx-auto px-6 lg:px-12 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: color + '20' }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
            <span className="text-sm font-medium" style={{ color }}>{tagline}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            {title}
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link 
              to="/contact" 
              className="text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:opacity-90 transition-all"
              style={{ backgroundColor: color }}
            >
              Discuss Your Project
            </Link>
            <Link 
              to="/projects" 
              className="border-2 border-white/30 text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-white/10 transition-all"
            >
              View Projects
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex justify-center">
          <motion.div 
            className="w-64 h-64 rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: color + '20' }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Icon className="w-32 h-32" style={{ color }} />
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const ExpertiseSection = ({ color, areas }) => (
  <section className="py-24">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="text-center mb-16">
        <p className="font-semibold uppercase tracking-wider mb-4 text-sm" style={{ color }}>Our Expertise</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628]">
          What We Deliver
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 border border-[#e2e8f0] hover:shadow-lg transition-all group"
            style={{ borderLeftWidth: '4px', borderLeftColor: color }}
          >
            <area.icon className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" style={{ color }} />
            <h3 className="text-lg font-bold text-[#0a1628] mb-2">{area.title}</h3>
            <p className="text-[#64748b] text-sm">{area.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CaseStudiesSection = ({ color, studies }) => (
  <section className="py-24 bg-[#f8fafc]">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="text-center mb-16">
        <p className="font-semibold uppercase tracking-wider mb-4 text-sm" style={{ color }}>Impact Stories</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628]">
          Featured Projects
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {studies.map((study, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all"
          >
            <div 
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white mb-4"
              style={{ backgroundColor: color }}
            >
              {study.type}
            </div>
            <h3 className="text-xl font-bold text-[#0a1628] mb-3">{study.title}</h3>
            <p className="text-[#64748b] text-sm mb-4">{study.description}</p>
            <div className="flex flex-wrap gap-3">
              {study.metrics.map((metric, i) => (
                <div key={i} className="px-3 py-2 bg-[#f8fafc] rounded-lg text-sm">
                  <span className="font-bold" style={{ color }}>{metric.value}</span>
                  <span className="text-[#64748b] ml-1">{metric.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const StatsSection = ({ color, stats }) => (
  <section className="py-16" style={{ backgroundColor: color }}>
    <div className="container mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center text-white"
          >
            <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
            <div className="text-white/80 text-sm uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const MethodologySection = ({ color, steps }) => (
  <section className="py-24">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="text-center mb-16">
        <p className="font-semibold uppercase tracking-wider mb-4 text-sm" style={{ color }}>Our Approach</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628]">
          Research Methodology
        </h2>
      </div>
      <div className="relative">
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#e2e8f0] -translate-y-1/2" />
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              <div 
                className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: color }}
              >
                {index + 1}
              </div>
              <h3 className="text-lg font-bold text-[#0a1628] mb-2">{step.title}</h3>
              <p className="text-[#64748b] text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const CTASection = ({ color, title, description }) => (
  <section className="py-24 bg-[#0a1628] text-white">
    <div className="container mx-auto px-6 lg:px-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
      <p className="text-white/80 max-w-2xl mx-auto mb-8">{description}</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link 
          to="/contact" 
          className="text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:opacity-90 transition-all"
          style={{ backgroundColor: color }}
        >
          Start a Conversation
        </Link>
        <Link 
          to="/services" 
          className="border-2 border-white/30 text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-white/10 transition-all"
        >
          View All Services
        </Link>
      </div>
    </div>
  </section>
);

// ==================== AGRICULTURE PAGE ====================
export const AgriculturePage = () => {
  const expertiseAreas = [
    { icon: Sprout, title: "Food Security Assessment", description: "Comprehensive household surveys measuring food access, availability, and utilization indicators." },
    { icon: TrendingUp, title: "Agricultural Productivity", description: "Crop yield analysis, farming practices evaluation, and input utilization studies." },
    { icon: Target, title: "Value Chain Analysis", description: "Market linkage assessments, price monitoring, and supply chain optimization research." },
    { icon: Users, title: "Farmer Livelihoods", description: "Income diversification studies, resilience assessments, and rural livelihood mapping." },
    { icon: Globe, title: "Climate-Smart Agriculture", description: "Adaptation strategy evaluation, environmental impact studies, and sustainable practices research." },
    { icon: BarChart3, title: "Impact Evaluation", description: "Rigorous evaluation of agricultural programs, interventions, and policy effectiveness." },
  ];

  const caseStudies = [
    {
      type: "Baseline Survey",
      title: "Smallholder Farmer Productivity Assessment",
      description: "Comprehensive baseline study of 8,000+ farming households across 18 districts, measuring agricultural productivity, market access, and food security indicators.",
      metrics: [{ value: "8,000+", label: "Households" }, { value: "18", label: "Districts" }, { value: "6", label: "Crops" }]
    },
    {
      type: "Impact Evaluation",
      title: "Irrigation Scheme Effectiveness Study",
      description: "Mixed-methods evaluation of small-scale irrigation investments, measuring changes in crop yields, household income, and water resource management.",
      metrics: [{ value: "45%", label: "Yield Increase" }, { value: "2,500", label: "Farmers" }, { value: "12", label: "Schemes" }]
    },
    {
      type: "Market Research",
      title: "Agricultural Value Chain Mapping",
      description: "Detailed analysis of cassava and maize value chains from farm gate to consumer, identifying bottlenecks and market opportunities.",
      metrics: [{ value: "500+", label: "Interviews" }, { value: "4", label: "Regions" }, { value: "2", label: "Value Chains" }]
    },
    {
      type: "Monitoring Survey",
      title: "Climate Adaptation Practices Study",
      description: "Longitudinal survey tracking adoption of climate-smart agricultural practices and their impact on resilience and productivity.",
      metrics: [{ value: "3,200", label: "Farmers" }, { value: "3", label: "Years" }, { value: "15", label: "Practices" }]
    },
  ];

  const stats = [
    { value: "50+", label: "Agriculture Projects" },
    { value: "25,000+", label: "Farmers Surveyed" },
    { value: "15+", label: "Crop Types" },
    { value: "20+", label: "Districts Covered" },
  ];

  const methodology = [
    { title: "Sampling Design", description: "Stratified random sampling ensuring representative coverage of farming systems" },
    { title: "Data Collection", description: "CAPI-based surveys with GPS mapping of farms and agricultural assets" },
    { title: "Quality Assurance", description: "Real-time monitoring, back-checks, and crop cutting exercises for yield verification" },
    { title: "Analysis & Reporting", description: "Statistical analysis with policy-relevant recommendations for agricultural development" },
  ];

  return (
    <div className="pt-20">
      <PracticeHero
        icon={Sprout}
        color="#2a9d8f"
        title="Agriculture & Food Security"
        tagline="Practice Area"
        description="Comprehensive research and evaluation services supporting agricultural development, food security programming, and rural livelihoods across Tanzania and the broader East African region."
      />
      <StatsSection color="#2a9d8f" stats={stats} />
      <ExpertiseSection color="#2a9d8f" areas={expertiseAreas} />
      <CaseStudiesSection color="#2a9d8f" studies={caseStudies} />
      <MethodologySection color="#2a9d8f" steps={methodology} />
      <CTASection
        color="#2a9d8f"
        title="Ready to Strengthen Agricultural Programs?"
        description="Our agriculture research expertise helps organizations design evidence-based interventions that improve food security and farmer livelihoods."
      />
    </div>
  );
};

// ==================== EDUCATION PAGE ====================
export const EducationPage = () => {
  const expertiseAreas = [
    { icon: BookOpen, title: "Learning Assessments", description: "Early grade reading and numeracy assessments measuring student learning outcomes." },
    { icon: Users, title: "Teacher Effectiveness", description: "Classroom observation, teacher competency testing, and professional development evaluation." },
    { icon: Building2, title: "School Infrastructure", description: "Facility assessments, resource mapping, and educational environment studies." },
    { icon: Target, title: "Program Evaluation", description: "Rigorous evaluation of education interventions, curricula, and policy reforms." },
    { icon: BarChart3, title: "Education Statistics", description: "EMIS support, enrollment tracking, and education sector performance analysis." },
    { icon: Shield, title: "School Safety", description: "Violence prevention research, child protection assessments, and safe school environment studies." },
  ];

  const caseStudies = [
    {
      type: "National Assessment",
      title: "Early Grade Reading Assessment (EGRA)",
      description: "Large-scale assessment of reading skills among primary school students across all regions, informing national literacy policy and teacher training programs.",
      metrics: [{ value: "50,000", label: "Students" }, { value: "1,200", label: "Schools" }, { value: "26", label: "Regions" }]
    },
    {
      type: "Impact Evaluation",
      title: "Teacher Training Program Evaluation",
      description: "Mixed-methods evaluation of in-service teacher training program, measuring changes in classroom practices and student learning outcomes.",
      metrics: [{ value: "800", label: "Teachers" }, { value: "16,000", label: "Students" }, { value: "3", label: "Years" }]
    },
    {
      type: "School Survey",
      title: "Education Resource Mapping",
      description: "Comprehensive survey of school infrastructure, teaching materials, and human resources across primary and secondary schools.",
      metrics: [{ value: "2,500", label: "Schools" }, { value: "15", label: "Districts" }, { value: "85", label: "Indicators" }]
    },
    {
      type: "Safety Assessment",
      title: "School Violence Prevention Study",
      description: "Research on violence against children in schools, identifying risk factors and evaluating prevention interventions.",
      metrics: [{ value: "5,000", label: "Students" }, { value: "200", label: "Schools" }, { value: "8", label: "Regions" }]
    },
  ];

  const stats = [
    { value: "100+", label: "Education Projects" },
    { value: "100,000+", label: "Students Assessed" },
    { value: "5,000+", label: "Schools Surveyed" },
    { value: "26", label: "Regions Covered" },
  ];

  const methodology = [
    { title: "Assessment Design", description: "Curriculum-aligned instruments developed with education experts and validated locally" },
    { title: "Enumerator Training", description: "Intensive training on child-friendly assessment administration and ethical protocols" },
    { title: "Field Implementation", description: "Standardized administration ensuring reliable and comparable results across schools" },
    { title: "Policy Translation", description: "Findings translated into actionable recommendations for education stakeholders" },
  ];

  return (
    <div className="pt-20">
      <PracticeHero
        icon={BookOpen}
        color="#e9c46a"
        title="Education"
        tagline="Practice Area"
        description="Evidence-driven education research supporting improved learning outcomes, effective teaching, and equitable access to quality education across Tanzania."
      />
      <StatsSection color="#e9c46a" stats={stats} />
      <ExpertiseSection color="#e9c46a" areas={expertiseAreas} />
      <CaseStudiesSection color="#e9c46a" studies={caseStudies} />
      <MethodologySection color="#e9c46a" steps={methodology} />
      <CTASection
        color="#e9c46a"
        title="Ready to Improve Education Outcomes?"
        description="Our education research expertise helps organizations understand learning challenges and design effective interventions."
      />
    </div>
  );
};

// ==================== HEALTH PAGE ====================
export const HealthPage = () => {
  const expertiseAreas = [
    { icon: Heart, title: "Health Facility Assessment", description: "Service availability, readiness assessments, and quality of care evaluations." },
    { icon: Users, title: "Community Health", description: "CHW program evaluation, health-seeking behavior studies, and community engagement research." },
    { icon: Target, title: "Disease Surveillance", description: "Prevalence studies, outbreak investigations, and epidemiological surveys." },
    { icon: BarChart3, title: "Health Systems Research", description: "Health financing, workforce studies, and supply chain assessments." },
    { icon: Shield, title: "Maternal & Child Health", description: "Antenatal care coverage, immunization surveys, and nutrition assessments." },
    { icon: Lightbulb, title: "Health Innovation", description: "mHealth evaluations, telemedicine studies, and digital health intervention research." },
  ];

  const caseStudies = [
    {
      type: "Facility Survey",
      title: "Service Availability and Readiness Assessment",
      description: "Comprehensive assessment of health facilities measuring service availability, infrastructure, equipment, and staffing across all levels of care.",
      metrics: [{ value: "800", label: "Facilities" }, { value: "200+", label: "Indicators" }, { value: "20", label: "Regions" }]
    },
    {
      type: "Impact Evaluation",
      title: "Community Health Worker Program Evaluation",
      description: "Rigorous evaluation of CHW program effectiveness in improving maternal and child health outcomes at community level.",
      metrics: [{ value: "5,000", label: "Households" }, { value: "500", label: "CHWs" }, { value: "12", label: "Districts" }]
    },
    {
      type: "Coverage Survey",
      title: "Immunization Coverage Assessment",
      description: "Population-based survey measuring vaccination coverage, drop-out rates, and barriers to immunization uptake.",
      metrics: [{ value: "3,500", label: "Children" }, { value: "15", label: "Districts" }, { value: "12", label: "Antigens" }]
    },
    {
      type: "Health Systems",
      title: "Healthcare Financing Study",
      description: "Analysis of out-of-pocket expenditure, health insurance coverage, and financial protection in healthcare access.",
      metrics: [{ value: "4,000", label: "Households" }, { value: "10", label: "Regions" }, { value: "3", label: "Years" }]
    },
  ];

  const stats = [
    { value: "75+", label: "Health Projects" },
    { value: "2,000+", label: "Facilities Assessed" },
    { value: "50,000+", label: "Households Surveyed" },
    { value: "25", label: "Health Indicators" },
  ];

  const methodology = [
    { title: "Protocol Development", description: "Standardized tools aligned with WHO guidelines and national health information systems" },
    { title: "Clinical Training", description: "Enumerators trained on health terminology, facility protocols, and biomarker collection" },
    { title: "Quality Protocols", description: "Supervisor oversight, data verification, and clinical validation procedures" },
    { title: "Health Analytics", description: "Epidemiological analysis and health systems performance measurement" },
  ];

  return (
    <div className="pt-20">
      <PracticeHero
        icon={Heart}
        color="#e63946"
        title="Health"
        tagline="Practice Area"
        description="Comprehensive health research supporting improved service delivery, disease prevention, and health system strengthening across Tanzania."
      />
      <StatsSection color="#e63946" stats={stats} />
      <ExpertiseSection color="#e63946" areas={expertiseAreas} />
      <CaseStudiesSection color="#e63946" studies={caseStudies} />
      <MethodologySection color="#e63946" steps={methodology} />
      <CTASection
        color="#e63946"
        title="Ready to Strengthen Health Systems?"
        description="Our health research expertise helps organizations improve service delivery and health outcomes for communities."
      />
    </div>
  );
};

// ==================== WASH PAGE ====================
export const WASHPage = () => {
  const expertiseAreas = [
    { icon: Droplets, title: "Water Point Mapping", description: "GPS-based inventory and functionality assessment of water infrastructure." },
    { icon: Target, title: "Coverage Surveys", description: "Population-based surveys measuring access to safe water and improved sanitation." },
    { icon: BarChart3, title: "Service Level Monitoring", description: "JMP-aligned indicators tracking progress toward WASH SDG targets." },
    { icon: Users, title: "Hygiene Behavior", description: "KAP studies measuring hygiene practices, handwashing, and sanitation behaviors." },
    { icon: Building2, title: "Infrastructure Verification", description: "Physical verification and condition assessment of WASH facilities." },
    { icon: Shield, title: "Water Quality Testing", description: "Field-based water quality assessments and contamination source identification." },
  ];

  const caseStudies = [
    {
      type: "National Inventory",
      title: "Water Point Data Verification",
      description: "Four-year national project mapping and verifying all water points across Tanzania, creating the most comprehensive water infrastructure database in the country.",
      metrics: [{ value: "129,949", label: "Water Points" }, { value: "124", label: "Enumerators" }, { value: "26", label: "Regions" }]
    },
    {
      type: "Coverage Survey",
      title: "Rural WASH Access Assessment",
      description: "Population-based survey measuring household access to water, sanitation, and hygiene facilities in rural communities.",
      metrics: [{ value: "6,000", label: "Households" }, { value: "20", label: "Districts" }, { value: "3", label: "JMP Indicators" }]
    },
    {
      type: "Impact Evaluation",
      title: "Sanitation Marketing Program Evaluation",
      description: "Evaluation of demand-driven sanitation program measuring latrine adoption, usage, and sustainability.",
      metrics: [{ value: "2,500", label: "Households" }, { value: "8", label: "Districts" }, { value: "2", label: "Years" }]
    },
    {
      type: "Institutional WASH",
      title: "School WASH Assessment",
      description: "Assessment of water, sanitation, and hygiene facilities in primary and secondary schools, informing infrastructure investments.",
      metrics: [{ value: "1,500", label: "Schools" }, { value: "15", label: "Districts" }, { value: "50", label: "Indicators" }]
    },
  ];

  const stats = [
    { value: "130,000+", label: "Water Points Mapped" },
    { value: "50+", label: "WASH Projects" },
    { value: "26", label: "Regions Covered" },
    { value: "4", label: "Years of National Mapping" },
  ];

  const methodology = [
    { title: "GPS Mapping", description: "High-precision location capture with standardized infrastructure assessment forms" },
    { title: "Functionality Testing", description: "On-site verification of water point functionality and service delivery" },
    { title: "Community Engagement", description: "Water committee interviews and user satisfaction assessments" },
    { title: "Database Integration", description: "Data integration with national WASH MIS and sector dashboards" },
  ];

  return (
    <div className="pt-20">
      <PracticeHero
        icon={Droplets}
        color="#0ea5e9"
        title="Water, Sanitation & Hygiene"
        tagline="Practice Area"
        description="Industry-leading WASH research and data services supporting improved water access, sanitation coverage, and hygiene practices across Tanzania."
      />
      <StatsSection color="#0ea5e9" stats={stats} />
      <ExpertiseSection color="#0ea5e9" areas={expertiseAreas} />
      <CaseStudiesSection color="#0ea5e9" studies={caseStudies} />
      <MethodologySection color="#0ea5e9" steps={methodology} />
      <CTASection
        color="#0ea5e9"
        title="Ready to Improve WASH Services?"
        description="Our WASH expertise helps organizations plan, monitor, and evaluate water and sanitation programs."
      />
    </div>
  );
};

// ==================== GOVERNANCE PAGE (NEW) ====================
export const GovernancePage = () => {
  const expertiseAreas = [
    { icon: Scale, title: "Public Finance", description: "Budget tracking, expenditure analysis, and public financial management assessments." },
    { icon: Building2, title: "Institutional Assessment", description: "Organizational capacity evaluation and governance structure analysis." },
    { icon: Users, title: "Citizen Engagement", description: "Civic participation surveys, accountability mechanisms, and voice research." },
    { icon: Shield, title: "Anti-Corruption", description: "Integrity assessments, transparency studies, and corruption perception surveys." },
    { icon: Target, title: "Policy Analysis", description: "Policy implementation monitoring, regulatory impact assessment, and reform evaluation." },
    { icon: BarChart3, title: "Service Delivery", description: "Public service quality monitoring and citizen satisfaction surveys." },
  ];

  const caseStudies = [
    {
      type: "Governance Survey",
      title: "Local Government Performance Assessment",
      description: "Comprehensive assessment of local government service delivery, fiscal management, and citizen satisfaction across districts.",
      metrics: [{ value: "50", label: "Districts" }, { value: "5,000", label: "Citizens" }, { value: "100+", label: "Indicators" }]
    },
    {
      type: "Budget Tracking",
      title: "Social Sector Expenditure Review",
      description: "Analysis of budget allocation and actual expenditure in health and education sectors at national and local levels.",
      metrics: [{ value: "3", label: "Years" }, { value: "25", label: "Regions" }, { value: "2", label: "Sectors" }]
    },
  ];

  const stats = [
    { value: "25+", label: "Governance Projects" },
    { value: "50+", label: "Districts Assessed" },
    { value: "10,000+", label: "Citizens Surveyed" },
    { value: "5", label: "National Assessments" },
  ];

  const methodology = [
    { title: "Framework Design", description: "Assessment frameworks aligned with governance indicators and standards" },
    { title: "Stakeholder Mapping", description: "Comprehensive stakeholder analysis and engagement strategies" },
    { title: "Mixed Methods", description: "Quantitative surveys combined with qualitative governance analysis" },
    { title: "Policy Dialogue", description: "Findings presented through policy briefs and stakeholder dialogues" },
  ];

  return (
    <div className="pt-20">
      <PracticeHero
        icon={Scale}
        color="#8b5cf6"
        title="Governance & Public Finance"
        tagline="Practice Area"
        description="Evidence-based governance research supporting accountability, transparency, and effective public service delivery."
      />
      <StatsSection color="#8b5cf6" stats={stats} />
      <ExpertiseSection color="#8b5cf6" areas={expertiseAreas} />
      <CaseStudiesSection color="#8b5cf6" studies={caseStudies} />
      <MethodologySection color="#8b5cf6" steps={methodology} />
      <CTASection
        color="#8b5cf6"
        title="Ready to Strengthen Governance?"
        description="Our governance expertise helps organizations improve accountability and public service delivery."
      />
    </div>
  );
};

// ==================== ECONOMIC DEVELOPMENT PAGE (NEW) ====================
export const EconomicDevelopmentPage = () => {
  const expertiseAreas = [
    { icon: TrendingUp, title: "Enterprise Development", description: "SME surveys, business environment assessments, and entrepreneurship research." },
    { icon: Briefcase, title: "Employment Studies", description: "Labor market analysis, skills gap assessments, and workforce development research." },
    { icon: Users, title: "Financial Inclusion", description: "Access to finance surveys, microfinance evaluations, and savings behavior studies." },
    { icon: Globe, title: "Trade & Markets", description: "Market systems analysis, trade facilitation studies, and cross-border commerce research." },
    { icon: Target, title: "Program Evaluation", description: "Impact evaluation of economic development programs and livelihood interventions." },
    { icon: BarChart3, title: "Poverty Analysis", description: "Household economic surveys, poverty mapping, and vulnerability assessments." },
  ];

  const caseStudies = [
    {
      type: "Enterprise Survey",
      title: "Small Business Performance Study",
      description: "Comprehensive survey of micro and small enterprises measuring business performance, constraints, and growth potential.",
      metrics: [{ value: "3,000", label: "Enterprises" }, { value: "12", label: "Districts" }, { value: "8", label: "Sectors" }]
    },
    {
      type: "Impact Evaluation",
      title: "Youth Employment Program Evaluation",
      description: "Rigorous evaluation of vocational training and job placement program for youth, tracking employment outcomes.",
      metrics: [{ value: "2,000", label: "Youth" }, { value: "80%", label: "Employment Rate" }, { value: "3", label: "Years" }]
    },
  ];

  const stats = [
    { value: "40+", label: "Economic Projects" },
    { value: "10,000+", label: "Enterprises Surveyed" },
    { value: "15", label: "Sectors Covered" },
    { value: "20+", label: "Districts Reached" },
  ];

  const methodology = [
    { title: "Sampling Strategy", description: "Business registry-based sampling with stratification by sector and size" },
    { title: "Enterprise Surveys", description: "Standardized instruments capturing business performance and constraints" },
    { title: "Economic Analysis", description: "Cost-benefit analysis, return on investment, and economic impact modeling" },
    { title: "Market Intelligence", description: "Actionable insights for market development and enterprise support" },
  ];

  return (
    <div className="pt-20">
      <PracticeHero
        icon={TrendingUp}
        color="#f59e0b"
        title="Economic Development"
        tagline="Practice Area"
        description="Research supporting enterprise development, employment creation, and inclusive economic growth across Tanzania."
      />
      <StatsSection color="#f59e0b" stats={stats} />
      <ExpertiseSection color="#f59e0b" areas={expertiseAreas} />
      <CaseStudiesSection color="#f59e0b" studies={caseStudies} />
      <MethodologySection color="#f59e0b" steps={methodology} />
      <CTASection
        color="#f59e0b"
        title="Ready to Drive Economic Growth?"
        description="Our economic development expertise helps organizations design effective programs for enterprise and employment."
      />
    </div>
  );
};

// ==================== ENVIRONMENT & CLIMATE PAGE (NEW) ====================
export const EnvironmentPage = () => {
  const expertiseAreas = [
    { icon: Globe, title: "Climate Vulnerability", description: "Community-level climate risk assessments and adaptation capacity analysis." },
    { icon: Sprout, title: "Natural Resources", description: "Forest monitoring, land use surveys, and biodiversity assessments." },
    { icon: Zap, title: "Clean Energy", description: "Energy access surveys, renewable energy adoption studies, and fuel use assessments." },
    { icon: Target, title: "Environmental Impact", description: "Project-level environmental and social impact assessments." },
    { icon: Users, title: "Community Resilience", description: "Resilience measurement, adaptive capacity, and disaster preparedness surveys." },
    { icon: BarChart3, title: "Carbon & Emissions", description: "Carbon footprint studies, emissions monitoring, and climate finance tracking." },
  ];

  const caseStudies = [
    {
      type: "Climate Study",
      title: "Community Climate Vulnerability Assessment",
      description: "Multi-district assessment of climate risks, adaptive capacity, and community resilience to climate shocks.",
      metrics: [{ value: "3,000", label: "Households" }, { value: "10", label: "Districts" }, { value: "5", label: "Climate Risks" }]
    },
    {
      type: "Energy Survey",
      title: "Rural Energy Access Assessment",
      description: "Household survey measuring energy access, fuel consumption patterns, and willingness to pay for clean energy.",
      metrics: [{ value: "4,000", label: "Households" }, { value: "15", label: "Districts" }, { value: "3", label: "Energy Sources" }]
    },
  ];

  const stats = [
    { value: "20+", label: "Environment Projects" },
    { value: "10,000+", label: "Households Surveyed" },
    { value: "15", label: "Districts Covered" },
    { value: "5", label: "Climate Zones" },
  ];

  const methodology = [
    { title: "Risk Assessment", description: "Standardized climate vulnerability and capacity assessment frameworks" },
    { title: "Spatial Analysis", description: "GIS-based mapping of environmental resources and climate risks" },
    { title: "Community Methods", description: "Participatory assessments and community-based monitoring approaches" },
    { title: "Integration", description: "Linking environmental data with socioeconomic and livelihood indicators" },
  ];

  return (
    <div className="pt-20">
      <PracticeHero
        icon={Globe}
        color="#10b981"
        title="Environment & Climate"
        tagline="Practice Area"
        description="Research supporting climate adaptation, environmental sustainability, and community resilience in Tanzania."
      />
      <StatsSection color="#10b981" stats={stats} />
      <ExpertiseSection color="#10b981" areas={expertiseAreas} />
      <CaseStudiesSection color="#10b981" studies={caseStudies} />
      <MethodologySection color="#10b981" steps={methodology} />
      <CTASection
        color="#10b981"
        title="Ready to Address Climate Challenges?"
        description="Our environment expertise helps organizations understand climate risks and build community resilience."
      />
    </div>
  );
};

// ==================== PRACTICE AREAS HUB PAGE ====================
export const PracticeAreasHubPage = () => {
  const areas = [
    { 
      id: 'agriculture', 
      icon: Sprout, 
      title: 'Agriculture & Food Security', 
      color: '#2a9d8f',
      path: '/practice-areas/agriculture',
      description: 'Food security assessments, agricultural productivity studies, value chain analysis, and climate-smart agriculture research.',
      stats: '50+ Projects'
    },
    { 
      id: 'education', 
      icon: BookOpen, 
      title: 'Education', 
      color: '#e9c46a',
      path: '/practice-areas/education',
      description: 'Learning assessments, teacher effectiveness studies, school safety research, and education program evaluations.',
      stats: '100+ Projects'
    },
    { 
      id: 'health', 
      icon: Heart, 
      title: 'Health', 
      color: '#e63946',
      path: '/practice-areas/health',
      description: 'Health facility assessments, disease surveillance, community health research, and health systems strengthening.',
      stats: '75+ Projects'
    },
    { 
      id: 'wash', 
      icon: Droplets, 
      title: 'WASH', 
      color: '#0ea5e9',
      path: '/practice-areas/wash',
      description: 'Water point mapping, coverage surveys, hygiene behavior studies, and infrastructure verification.',
      stats: '130K+ Water Points'
    },
    { 
      id: 'governance', 
      icon: Scale, 
      title: 'Governance & Public Finance', 
      color: '#8b5cf6',
      path: '/practice-areas/governance',
      description: 'Public expenditure tracking, institutional assessments, citizen engagement, and service delivery monitoring.',
      stats: '25+ Projects'
    },
    { 
      id: 'economic', 
      icon: TrendingUp, 
      title: 'Economic Development', 
      color: '#f59e0b',
      path: '/practice-areas/economic-development',
      description: 'Enterprise surveys, employment studies, financial inclusion research, and poverty analysis.',
      stats: '40+ Projects'
    },
    { 
      id: 'environment', 
      icon: Globe, 
      title: 'Environment & Climate', 
      color: '#10b981',
      path: '/practice-areas/environment',
      description: 'Climate vulnerability assessments, natural resource monitoring, and community resilience research.',
      stats: '20+ Projects'
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#0a1628] text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {areas.map((area, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full"
              style={{ 
                backgroundColor: area.color,
                left: `${10 + (i * 12)}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl">
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">
              Sector Expertise
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Practice Areas
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Over 25 years of deep expertise across key development sectors in Tanzania and East Africa. 
              Our multi-disciplinary teams bring sector-specific knowledge to every research engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Areas Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areas.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={area.path}
                  className="group block h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Header */}
                  <div 
                    className="h-40 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: area.color + '15' }}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      style={{ 
                        background: `radial-gradient(circle at 30% 30%, ${area.color}40 0%, transparent 50%),
                                    radial-gradient(circle at 70% 70%, ${area.color}30 0%, transparent 40%)`
                      }}
                    />
                    <area.icon className="w-20 h-20 group-hover:scale-110 transition-transform duration-500" style={{ color: area.color }} />
                    <div 
                      className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: area.color }}
                    >
                      {area.stats}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#0a1628] mb-3 group-hover:text-[#e63946] transition-colors">
                      {area.title}
                    </h3>
                    <p className="text-[#64748b] text-sm mb-4">
                      {area.description}
                    </p>
                    <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: area.color }}>
                      Explore Practice Area
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Sector Note */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <Lightbulb className="w-12 h-12 text-[#e63946] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#0a1628] mb-4">Cross-Sector Expertise</h2>
            <p className="text-[#64748b]">
              Many development challenges require integrated approaches. Our teams frequently work across 
              practice areas—combining health and WASH expertise, linking agriculture with nutrition, 
              or connecting education with economic outcomes—to deliver comprehensive research solutions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#e63946] text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need Sector-Specific Research Expertise?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Our practice area teams bring deep sector knowledge combined with rigorous research methodology 
            to help you generate actionable evidence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-white text-[#e63946] px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#0a1628] hover:text-white transition-all"
            >
              Discuss Your Project
            </Link>
            <Link 
              to="/services" 
              className="border-2 border-white text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-white hover:text-[#e63946] transition-all"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PracticeAreasHubPage;
