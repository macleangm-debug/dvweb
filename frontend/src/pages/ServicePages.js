import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, BarChart3, Users, Globe, FileText, 
  Award, Target, TrendingUp, Database, Layers, Shield, 
  BookOpen, Lightbulb, Zap, Clock, MapPin, Building2,
  PieChart, LineChart, Search, Microscope, ClipboardCheck,
  GraduationCap, Presentation, UserCheck, Network, Compass,
  FolderOpen, Smartphone, Map, MessageCircle, PenTool, Workflow,
  ScrollText, Calculator, Share2, Code, Satellite, FileQuestion
} from 'lucide-react';

// ==================== SHARED COMPONENTS ====================

const ServiceHero = ({ tagline, title, description, image }) => (
  <section className="bg-[#0a1628] text-white py-24 lg:py-32 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
    </div>
    <div className="container mx-auto px-6 lg:px-12 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">
            {tagline}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6  leading-tight text-white">
            {title}
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link 
              to="/contact" 
              className="bg-[#e63946] text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#d02835] transition-all hover:-translate-y-1"
            >
              Discuss Your Project
            </Link>
            <Link 
              to="/projects" 
              className="border-2 border-white/30 text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-white/10 transition-all"
            >
              View Case Studies
            </Link>
          </div>
        </div>
        {image && (
          <div className="hidden lg:block">
            <img src={image} alt="" className="rounded-lg shadow-2xl" />
          </div>
        )}
      </div>
    </div>
  </section>
);

const ChallengeSection = ({ title, challenges }) => (
  <section className="py-24 bg-[#f8fafc]">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">The Challenge</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] ">
          {title}
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {challenges.map((challenge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 border-l-4 border-[#e63946]"
          >
            <div className="text-4xl font-bold text-[#e63946]/20 mb-4">0{index + 1}</div>
            <h3 className="text-lg font-bold text-[#0a1628] mb-3">{challenge.title}</h3>
            <p className="text-[#64748b] text-sm leading-relaxed">{challenge.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ApproachSection = ({ title, subtitle, steps }) => (
  <section className="py-24">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="lg:sticky lg:top-32">
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">Our Approach</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628]  mb-6">
            {title}
          </h2>
          <p className="text-[#64748b] text-lg leading-relaxed">
            {subtitle}
          </p>
        </div>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-6 p-6 bg-white border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#2a9d8f] transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[#0a1628] text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0a1628] mb-2">{step.title}</h3>
                <p className="text-[#64748b] text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const DeliverablesSection = ({ deliverables }) => (
  <section className="py-24 bg-[#0a1628] text-white">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="text-center mb-16">
        <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">What We Deliver</p>
        <h2 className="text-3xl md:text-4xl font-bold ">
          Comprehensive Deliverables
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deliverables.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="p-6 border border-white/10 hover:border-[#e63946] transition-all group"
          >
            <item.icon className="w-8 h-8 text-[#2a9d8f] mb-4 group-hover:text-[#e63946] transition-colors" />
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-white/60 text-sm">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const InsightsSection = ({ insights }) => (
  <section className="py-24 bg-gradient-to-br from-[#f8fafc] to-white">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="text-center mb-16">
        <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">Key Insights</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] ">
          Perspectives That Matter
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 border border-[#e2e8f0] hover:shadow-xl transition-all"
          >
            <div className="text-5xl font-bold text-[#e63946] mb-4">{insight.stat}</div>
            <h3 className="text-lg font-bold text-[#0a1628] mb-3">{insight.title}</h3>
            <p className="text-[#64748b] text-sm leading-relaxed">{insight.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const WhyUsSection = ({ points }) => (
  <section className="py-24">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="bg-[#0a1628] p-12 lg:p-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">Why DataVision</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white  mb-6">
              The DataVision Difference
            </h2>
            <p className="text-white/70 leading-relaxed">
              With over 25 years of experience across Africa, we bring unmatched expertise, 
              local knowledge, and rigorous methodology to every engagement.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {points.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#2a9d8f] mt-0.5 flex-shrink-0" />
                <span className="text-white text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ServiceCTA = ({ title, description }) => (
  <section className="py-24 bg-[#e63946] text-white">
    <div className="container mx-auto px-6 lg:px-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 ">
        {title}
      </h2>
      <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
        {description}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link 
          to="/contact" 
          className="bg-white text-[#e63946] px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#0a1628] hover:text-white transition-all"
        >
          Start a Conversation
        </Link>
        <Link 
          to="/contact?type=consultation" 
          className="border-2 border-white text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-white hover:text-[#e63946] transition-all"
        >
          Request Proposal
        </Link>
      </div>
    </div>
  </section>
);

// ==================== SERVICE PAGES ====================

// 1. Research & Statistics Page
export const ResearchStatisticsPage = () => {
  const challenges = [
    {
      title: "Data Quality Gaps",
      description: "Development programs often struggle with inconsistent data quality, leading to unreliable insights and misguided policy decisions that fail to address root causes."
    },
    {
      title: "Methodological Complexity",
      description: "Designing statistically rigorous studies that account for local contexts, cultural nuances, and logistical constraints requires specialized expertise rarely available in-house."
    },
    {
      title: "Scale & Reach",
      description: "Reaching remote populations, hard-to-access areas, and marginalized communities demands extensive local networks and adaptive field operations capabilities."
    },
    {
      title: "Actionable Insights",
      description: "Raw data alone doesn't drive change. Transforming complex datasets into clear, actionable recommendations requires analytical depth and sector expertise."
    },
    {
      title: "Stakeholder Alignment",
      description: "Multiple stakeholders with varying interests need evidence they can trust. Building consensus around findings requires transparent methodology and credible presentation."
    },
    {
      title: "Time & Budget Pressures",
      description: "Tight timelines and limited budgets demand efficient execution without compromising rigor—a balance few organizations can consistently achieve."
    }
  ];

  const approachSteps = [
    {
      title: "Discovery & Scoping",
      description: "We begin with deep immersion into your research questions, program theory, and stakeholder needs. This phase defines success criteria, identifies constraints, and establishes the methodological framework."
    },
    {
      title: "Design & Instrumentation",
      description: "Our statisticians and sector experts collaborate to design sampling strategies, develop survey instruments, and create quality assurance protocols tailored to your specific context and objectives."
    },
    {
      title: "Field Operations",
      description: "Leveraging our network of 500+ trained enumerators across 15+ African countries, we execute data collection with rigorous quality controls, real-time monitoring, and adaptive problem-solving."
    },
    {
      title: "Analysis & Synthesis",
      description: "Beyond descriptive statistics, we employ advanced analytical techniques to uncover patterns, test hypotheses, and generate insights that address your core research questions."
    },
    {
      title: "Reporting & Dissemination",
      description: "We deliver findings in formats designed for impact—from technical reports for specialists to executive summaries for decision-makers and visual presentations for stakeholder engagement."
    }
  ];

  const deliverables = [
    { icon: FileText, title: "Technical Reports", description: "Comprehensive documentation with full methodology" },
    { icon: PieChart, title: "Statistical Analysis", description: "Advanced quantitative analysis and modeling" },
    { icon: Presentation, title: "Executive Summaries", description: "Clear insights for decision-makers" },
    { icon: Database, title: "Clean Datasets", description: "Validated, documented data for further analysis" },
    { icon: Layers, title: "Survey Instruments", description: "Tested questionnaires and data collection tools" },
    { icon: Target, title: "Sampling Frameworks", description: "Rigorous probability-based designs" },
    { icon: Shield, title: "Quality Protocols", description: "Comprehensive QA/QC documentation" },
    { icon: Lightbulb, title: "Policy Briefs", description: "Actionable recommendations for stakeholders" }
  ];

  const insights = [
    {
      stat: "94%",
      title: "Client Satisfaction Rate",
      description: "Our commitment to methodological rigor and clear communication consistently exceeds partner expectations across diverse project contexts."
    },
    {
      stat: "15+",
      title: "Countries Covered",
      description: "Our operational footprint spans East, Southern, and West Africa, with established local partnerships enabling rapid mobilization."
    },
    {
      stat: "1M+",
      title: "Interviews Conducted",
      description: "Decades of field experience have built institutional knowledge that accelerates project delivery and enhances data quality."
    }
  ];

  const whyUsPoints = [
    "25+ years of continuous operation",
    "ISO-aligned quality standards",
    "Multilingual capabilities",
    "Real-time field monitoring",
    "Adaptive methodology expertise",
    "Local context understanding",
    "Transparent pricing models",
    "Long-term partnership approach"
  ];

  return (
    <div className="pt-20">
      <ServiceHero
        tagline="Core Expertise"
        title="Research & Statistics"
        description="Rigorous quantitative and qualitative research that transforms complex questions into actionable evidence. We design, execute, and analyze studies that meet the highest international standards while navigating Africa's unique contexts."
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600"
      />
      <ChallengeSection
        title="Why Research Excellence Matters"
        challenges={challenges}
      />
      <ApproachSection
        title="A Systematic Path to Insight"
        subtitle="Our methodology integrates global best practices with deep local expertise, ensuring every study delivers reliable, relevant findings that drive meaningful action."
        steps={approachSteps}
      />
      <DeliverablesSection deliverables={deliverables} />
      <InsightsSection insights={insights} />
      <WhyUsSection points={whyUsPoints} />
      <ServiceCTA
        title="Ready to Transform Questions into Evidence?"
        description="Whether you're planning a baseline study, conducting an evaluation, or seeking to understand complex social dynamics, our research team is ready to design a solution that meets your needs."
      />
    </div>
  );
};

// 2. Monitoring & Evaluation Page
export const MonitoringEvaluationPage = () => {
  const challenges = [
    {
      title: "Attribution Complexity",
      description: "Distinguishing program impact from external factors requires sophisticated designs and counterfactual analysis that many organizations lack capacity to execute."
    },
    {
      title: "Baseline Gaps",
      description: "Programs launched without robust baselines face fundamental constraints in measuring change, often discovering this limitation too late in the project cycle."
    },
    {
      title: "Theory of Change Weaknesses",
      description: "Poorly articulated causal pathways lead to indicator frameworks that measure activities rather than outcomes, missing the evidence needed to demonstrate impact."
    },
    {
      title: "Learning Integration",
      description: "M&E systems often generate reports that sit unread. Creating feedback loops that actually inform adaptive management remains a persistent challenge."
    },
    {
      title: "Donor Requirements",
      description: "Navigating diverse donor M&E requirements while maintaining coherent internal systems demands strategic framework design and efficient data management."
    },
    {
      title: "Sustainability Questions",
      description: "Understanding whether program effects persist beyond implementation requires longitudinal designs and sustained engagement that exceed typical project timelines."
    }
  ];

  const approachSteps = [
    {
      title: "Theory of Change Development",
      description: "We work with program teams to articulate clear causal pathways, identify assumptions, and define measurable indicators at output, outcome, and impact levels."
    },
    {
      title: "M&E Framework Design",
      description: "Building on your theory of change, we create comprehensive frameworks that balance rigor with practicality, aligning indicator selection with available resources and data systems."
    },
    {
      title: "Baseline Assessment",
      description: "We establish robust pre-intervention benchmarks using mixed-method approaches, creating the foundation for credible impact measurement throughout the program cycle."
    },
    {
      title: "Ongoing Monitoring Support",
      description: "Beyond one-time studies, we help design and implement performance monitoring systems that generate real-time data for adaptive management decisions."
    },
    {
      title: "Evaluation Execution",
      description: "From midterm reviews to final impact evaluations, we employ rigorous designs—including experimental and quasi-experimental approaches—to generate credible evidence of program effects."
    },
    {
      title: "Learning & Adaptation",
      description: "We facilitate sense-making sessions that translate findings into strategic adjustments, ensuring M&E investments drive continuous program improvement."
    }
  ];

  const deliverables = [
    { icon: Compass, title: "Theory of Change", description: "Visual causal pathway documentation" },
    { icon: Target, title: "M&E Frameworks", description: "Comprehensive indicator matrices" },
    { icon: ClipboardCheck, title: "Baseline Reports", description: "Pre-intervention condition assessment" },
    { icon: TrendingUp, title: "Impact Evaluations", description: "Rigorous attribution analysis" },
    { icon: LineChart, title: "Monitoring Dashboards", description: "Real-time performance tracking" },
    { icon: FileText, title: "Midterm Reviews", description: "Course-correction recommendations" },
    { icon: Lightbulb, title: "Learning Products", description: "Actionable insight summaries" },
    { icon: Presentation, title: "Stakeholder Presentations", description: "Findings tailored to audience" }
  ];

  const insights = [
    {
      stat: "3x",
      title: "Impact Documentation",
      description: "Programs with robust M&E frameworks are three times more likely to demonstrate measurable impact to funders and stakeholders."
    },
    {
      stat: "60%",
      title: "Adaptive Improvement",
      description: "Systematic monitoring enables programs to identify and address implementation challenges before they undermine outcomes."
    },
    {
      stat: "25+",
      title: "Years of M&E Excellence",
      description: "Our evaluation portfolio spans sectors and geographies, building institutional knowledge that accelerates every new engagement."
    }
  ];

  const whyUsPoints = [
    "Experimental & quasi-experimental expertise",
    "Mixed-methods evaluation design",
    "Contribution analysis capabilities",
    "Outcome harvesting experience",
    "Real-time monitoring systems",
    "Participatory evaluation approaches",
    "Multi-country evaluation coordination",
    "Donor compliance expertise"
  ];

  return (
    <div className="pt-20">
      <ServiceHero
        tagline="Strategic Advisory"
        title="Monitoring & Evaluation"
        description="Evidence-driven M&E systems that go beyond compliance to generate actionable learning. From theory of change development to rigorous impact evaluations, we help programs demonstrate results and continuously improve."
        image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600"
      />
      <ChallengeSection
        title="The M&E Imperative"
        challenges={challenges}
      />
      <ApproachSection
        title="Building Evidence Systems That Matter"
        subtitle="Our M&E approach integrates accountability requirements with genuine learning objectives, creating systems that satisfy donors while driving program improvement."
        steps={approachSteps}
      />
      <DeliverablesSection deliverables={deliverables} />
      <InsightsSection insights={insights} />
      <WhyUsSection points={whyUsPoints} />
      <ServiceCTA
        title="Ready to Build an Evidence-Driven Program?"
        description="Whether you're designing a new M&E framework, planning an impact evaluation, or seeking to strengthen existing systems, our team brings the expertise to deliver credible, actionable evidence."
      />
    </div>
  );
};

// 3. Data Collection & Field Operations Page
export const DataCollectionPage = () => {
  const challenges = [
    {
      title: "Geographic Accessibility",
      description: "Reaching remote rural communities, conflict-affected areas, and hard-to-access populations requires local knowledge, security expertise, and logistical capabilities."
    },
    {
      title: "Enumerator Quality",
      description: "Data quality depends fundamentally on enumerator competence. Finding, training, and supervising field teams at scale demands significant infrastructure investment."
    },
    {
      title: "Cultural Sensitivity",
      description: "Effective data collection in diverse African contexts requires understanding local customs, languages, and social dynamics that affect respondent engagement."
    },
    {
      title: "Technology Integration",
      description: "Balancing the benefits of digital data collection with connectivity challenges, device management, and data security requires technical expertise and adaptive solutions."
    },
    {
      title: "Quality Assurance",
      description: "Maintaining data quality across large field operations demands systematic protocols for supervision, verification, and real-time monitoring."
    },
    {
      title: "Timeline Pressures",
      description: "Development timelines often require rapid mobilization of large field teams—a capability that takes years to build but clients need immediately."
    }
  ];

  const approachSteps = [
    {
      title: "Operational Planning",
      description: "We develop detailed field operation plans covering logistics, team structures, supervision protocols, and contingency procedures tailored to your specific context."
    },
    {
      title: "Team Recruitment & Training",
      description: "Drawing from our network of experienced enumerators across Africa, we assemble and intensively train teams on instruments, protocols, and quality standards."
    },
    {
      title: "Technology Deployment",
      description: "We configure and deploy appropriate data collection platforms—from tablet-based CAPI systems to SMS surveys—ensuring reliability across connectivity conditions."
    },
    {
      title: "Field Execution",
      description: "Our field coordinators manage day-to-day operations with systematic supervision, daily quality checks, and real-time problem resolution."
    },
    {
      title: "Quality Control",
      description: "Multi-layered quality assurance including back-checks, spot-checks, data validation rules, and high-frequency monitoring dashboards ensure data integrity."
    },
    {
      title: "Data Processing",
      description: "Comprehensive data cleaning, coding, and documentation transforms raw field data into analysis-ready datasets with full audit trails."
    }
  ];

  const deliverables = [
    { icon: Users, title: "Trained Field Teams", description: "Experienced, supervised enumerators" },
    { icon: MapPin, title: "Geographic Coverage", description: "Access to remote and urban areas" },
    { icon: Database, title: "Clean Datasets", description: "Validated, documented data files" },
    { icon: Shield, title: "Quality Reports", description: "Comprehensive QA documentation" },
    { icon: Clock, title: "Real-time Monitoring", description: "Live field progress dashboards" },
    { icon: Zap, title: "Rapid Mobilization", description: "Fast team deployment capability" },
    { icon: Globe, title: "Multi-country Coordination", description: "Consistent cross-border operations" },
    { icon: FileText, title: "Field Documentation", description: "Complete operational records" }
  ];

  const insights = [
    {
      stat: "500+",
      title: "Trained Enumerators",
      description: "Our standing network of experienced field staff enables rapid mobilization for projects of any scale across the continent."
    },
    {
      stat: "129K+",
      title: "Data Points Collected",
      description: "A single project verified 129,949 water points across Tanzania—demonstrating our capacity for large-scale field operations."
    },
    {
      stat: "98%",
      title: "Data Completeness",
      description: "Rigorous supervision and quality protocols consistently deliver datasets that meet the highest international standards."
    }
  ];

  const whyUsPoints = [
    "Standing enumerator networks",
    "Multi-language capabilities",
    "Remote area expertise",
    "Security protocol experience",
    "Device fleet management",
    "Real-time monitoring systems",
    "Rapid scaling capability",
    "COVID-adapted methodologies"
  ];

  return (
    <div className="pt-20">
      <ServiceHero
        tagline="Operational Excellence"
        title="Data Collection & Field Operations"
        description="Large-scale, high-quality data collection across Africa's most challenging environments. Our field infrastructure, trained teams, and proven systems deliver reliable data when and where you need it."
        image="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600"
      />
      <ChallengeSection
        title="Field Operations Realities"
        challenges={challenges}
      />
      <ApproachSection
        title="Systematic Excellence in the Field"
        subtitle="Two decades of continuous field operations have built systems, relationships, and expertise that enable consistent delivery across diverse contexts."
        steps={approachSteps}
      />
      <DeliverablesSection deliverables={deliverables} />
      <InsightsSection insights={insights} />
      <WhyUsSection points={whyUsPoints} />
      <ServiceCTA
        title="Need Data Collection Capacity?"
        description="From household surveys to facility assessments, school evaluations to community studies, our field operations team is ready to mobilize for your project."
      />
    </div>
  );
};

// 4. Data Analytics & Visualization Page
export const DataAnalyticsPage = () => {
  const challenges = [
    {
      title: "Data Overload",
      description: "Organizations collect more data than ever but struggle to extract meaningful insights. Volume without analysis creates confusion rather than clarity."
    },
    {
      title: "Technical Capacity Gaps",
      description: "Advanced analytical methods—from regression analysis to machine learning—require specialized skills that many development organizations lack in-house."
    },
    {
      title: "Communication Barriers",
      description: "Technical findings often fail to reach decision-makers in accessible formats. The gap between analysis and action undermines research investments."
    },
    {
      title: "Integration Challenges",
      description: "Siloed data systems prevent holistic analysis. Combining data sources to generate comprehensive insights requires technical infrastructure and expertise."
    },
    {
      title: "Timeliness Pressures",
      description: "By the time traditional analysis is complete, windows for intervention may have closed. Faster insight generation demands streamlined analytical workflows."
    },
    {
      title: "Sustainability Questions",
      description: "External analysis without capacity building creates dependency. Lasting impact requires building internal analytical capabilities alongside delivering findings."
    }
  ];

  const approachSteps = [
    {
      title: "Data Assessment",
      description: "We begin by understanding your existing data assets, quality levels, and analytical questions to design an approach that maximizes value from available information."
    },
    {
      title: "Analytical Design",
      description: "Based on your questions and data, we develop analytical plans specifying methods, outputs, and timelines—ensuring alignment between technique and objective."
    },
    {
      title: "Data Preparation",
      description: "Rigorous cleaning, transformation, and integration processes create analysis-ready datasets while documenting all preparation steps for reproducibility."
    },
    {
      title: "Statistical Analysis",
      description: "We apply appropriate analytical methods—from descriptive statistics to advanced modeling—selected to answer your specific research questions."
    },
    {
      title: "Visualization Development",
      description: "Findings are translated into compelling visual formats—dashboards, infographics, maps—designed to communicate complex patterns to diverse audiences."
    },
    {
      title: "Insight Translation",
      description: "We work with you to interpret findings, develop recommendations, and create products that drive decisions and actions."
    }
  ];

  const deliverables = [
    { icon: BarChart3, title: "Statistical Analysis", description: "Rigorous quantitative examination" },
    { icon: PieChart, title: "Data Dashboards", description: "Interactive visualization platforms" },
    { icon: LineChart, title: "Trend Analysis", description: "Temporal pattern identification" },
    { icon: Network, title: "Relationship Mapping", description: "Network and correlation analysis" },
    { icon: MapPin, title: "Geospatial Analysis", description: "Location-based insights and mapping" },
    { icon: Search, title: "Predictive Models", description: "Forward-looking analytical tools" },
    { icon: FileText, title: "Analytical Reports", description: "Comprehensive findings documentation" },
    { icon: Presentation, title: "Executive Visualizations", description: "Decision-maker focused outputs" }
  ];

  const insights = [
    {
      stat: "40%",
      title: "Faster Insights",
      description: "Streamlined analytical workflows and experienced teams deliver findings significantly faster than traditional approaches."
    },
    {
      stat: "5x",
      title: "Stakeholder Engagement",
      description: "Well-designed visualizations increase stakeholder engagement with findings by five times compared to traditional reports."
    },
    {
      stat: "100%",
      title: "Reproducibility",
      description: "Documented analytical processes ensure findings can be verified, updated, and built upon as new data becomes available."
    }
  ];

  const whyUsPoints = [
    "Advanced statistical modeling",
    "GIS and spatial analysis",
    "Interactive dashboard development",
    "Machine learning applications",
    "Mixed-methods integration",
    "Sector-specific expertise",
    "Clear communication focus",
    "Capacity building emphasis"
  ];

  return (
    <div className="pt-20">
      <ServiceHero
        tagline="Insight Generation"
        title="Data Analytics & Visualization"
        description="Transform raw data into strategic insight. Our analytical expertise and visualization capabilities help you understand patterns, communicate findings, and drive evidence-based decisions."
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600"
      />
      <ChallengeSection
        title="From Data to Decisions"
        challenges={challenges}
      />
      <ApproachSection
        title="Analytical Excellence, Communicated Clearly"
        subtitle="We combine rigorous analytical methods with clear communication, ensuring findings reach and resonate with the audiences who need them most."
        steps={approachSteps}
      />
      <DeliverablesSection deliverables={deliverables} />
      <InsightsSection insights={insights} />
      <WhyUsSection points={whyUsPoints} />
      <ServiceCTA
        title="Ready to Unlock Your Data's Potential?"
        description="Whether you need advanced statistical analysis, interactive dashboards, or help translating findings into action, our analytics team is ready to help."
      />
    </div>
  );
};

// 5. Capacity Building & Training Page
export const CapacityBuildingPage = () => {
  const challenges = [
    {
      title: "Skills Gaps",
      description: "Growing data demands outpace organizational capacity. Teams need practical skills in research design, data collection, analysis, and evidence use."
    },
    {
      title: "Knowledge Retention",
      description: "One-time trainings often fail to create lasting change. Building sustainable capacity requires ongoing support and institutional embedding."
    },
    {
      title: "Contextual Relevance",
      description: "Generic training programs miss the specific challenges teams face. Effective capacity building must be tailored to organizational contexts and needs."
    },
    {
      title: "Application Barriers",
      description: "Classroom learning doesn't automatically transfer to workplace practice. Bridging the gap requires hands-on application and ongoing mentorship."
    },
    {
      title: "Resource Constraints",
      description: "Intensive training programs compete with operational demands. Efficient, focused capacity building that fits organizational realities is essential."
    },
    {
      title: "Measurement Challenges",
      description: "Demonstrating capacity building impact is difficult. Tracking skill development and application requires thoughtful assessment frameworks."
    }
  ];

  const approachSteps = [
    {
      title: "Needs Assessment",
      description: "We begin by understanding your team's current capabilities, learning objectives, and organizational context to design targeted interventions."
    },
    {
      title: "Curriculum Design",
      description: "Drawing on extensive experience, we develop customized training content that addresses your specific skill gaps and operational needs."
    },
    {
      title: "Interactive Delivery",
      description: "Our training combines conceptual foundations with hands-on practice, using real-world examples and exercises relevant to participants' work."
    },
    {
      title: "Applied Learning",
      description: "Participants apply new skills to actual projects under guidance, cementing learning through practice and receiving feedback on real outputs."
    },
    {
      title: "Ongoing Support",
      description: "Post-training mentorship and technical assistance help teams navigate challenges as they apply new capabilities in their daily work."
    },
    {
      title: "Impact Assessment",
      description: "We track skill development and application over time, providing evidence of capacity building effectiveness and identifying areas for continued growth."
    }
  ];

  const deliverables = [
    { icon: GraduationCap, title: "Custom Curricula", description: "Tailored training content and materials" },
    { icon: Users, title: "Workshop Facilitation", description: "Expert-led interactive sessions" },
    { icon: BookOpen, title: "Training Manuals", description: "Comprehensive reference documentation" },
    { icon: Presentation, title: "Practical Exercises", description: "Hands-on skill-building activities" },
    { icon: UserCheck, title: "Mentorship Programs", description: "Ongoing guidance and support" },
    { icon: Award, title: "Certification", description: "Competency validation and recognition" },
    { icon: ClipboardCheck, title: "Skills Assessments", description: "Pre and post capability evaluation" },
    { icon: Lightbulb, title: "Job Aids", description: "Quick-reference tools for daily use" }
  ];

  const insights = [
    {
      stat: "85%",
      title: "Skill Application Rate",
      description: "Participants in our programs successfully apply learned skills in their work, demonstrating practical capability transfer."
    },
    {
      stat: "2,000+",
      title: "Professionals Trained",
      description: "Our capacity building programs have equipped researchers, M&E officers, and data analysts across Africa."
    },
    {
      stat: "95%",
      title: "Satisfaction Rating",
      description: "Participants consistently rate our training programs as highly relevant and practically applicable to their work."
    }
  ];

  const whyUsPoints = [
    "Practitioner-led instruction",
    "Context-specific customization",
    "Hands-on learning emphasis",
    "Post-training mentorship",
    "Flexible delivery formats",
    "Multilingual capabilities",
    "Organizational integration",
    "Long-term partnership approach"
  ];

  return (
    <div className="pt-20">
      <ServiceHero
        tagline="Knowledge Transfer"
        title="Capacity Building & Training"
        description="Build lasting organizational capability in research, M&E, and data analytics. Our practitioner-led programs combine conceptual foundations with hands-on application, creating skills that stick."
        image="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600"
      />
      <ChallengeSection
        title="The Capacity Challenge"
        challenges={challenges}
      />
      <ApproachSection
        title="Learning That Lasts"
        subtitle="Our capacity building philosophy emphasizes practical application, ongoing support, and organizational integration—creating sustainable capabilities rather than one-time events."
        steps={approachSteps}
      />
      <DeliverablesSection deliverables={deliverables} />
      <InsightsSection insights={insights} />
      <WhyUsSection points={whyUsPoints} />
      <ServiceCTA
        title="Ready to Build Your Team's Capabilities?"
        description="From enumerator training to advanced analytical methods, our capacity building programs create lasting skills that improve organizational performance."
      />
    </div>
  );
};

// 6. Technical Advisory Page
export const TechnicalAdvisoryPage = () => {
  const challenges = [
    {
      title: "Strategic Uncertainty",
      description: "Organizations face complex decisions about research investments, M&E approaches, and evidence strategies without the specialized expertise to navigate trade-offs."
    },
    {
      title: "Methodology Selection",
      description: "Choosing appropriate methods for specific questions requires deep technical knowledge. Misaligned approaches waste resources and generate unreliable findings."
    },
    {
      title: "Quality Assurance Gaps",
      description: "Without expert oversight, research and evaluation projects risk systematic errors that undermine credibility and utility of findings."
    },
    {
      title: "Stakeholder Management",
      description: "Aligning diverse stakeholder expectations around research priorities, methods, and use of findings requires skilled facilitation and communication."
    },
    {
      title: "Evidence Utilization",
      description: "Many organizations generate evidence that fails to influence decisions. Creating evidence-to-action pathways requires strategic planning and facilitation."
    },
    {
      title: "Donor Navigation",
      description: "Different donors have varying requirements for evidence generation and reporting. Strategic advisory helps organizations meet expectations efficiently."
    }
  ];

  const approachSteps = [
    {
      title: "Diagnostic Assessment",
      description: "We begin by understanding your organization's evidence ecosystem—current capabilities, strategic priorities, and key decisions requiring support."
    },
    {
      title: "Strategic Planning",
      description: "Based on assessment findings, we help develop evidence strategies that align research investments with organizational objectives and stakeholder needs."
    },
    {
      title: "Technical Guidance",
      description: "Our experts provide ongoing advisory support on methodology, quality assurance, and interpretation of findings throughout project cycles."
    },
    {
      title: "Quality Review",
      description: "We provide independent technical review of research designs, data collection approaches, analysis plans, and draft deliverables."
    },
    {
      title: "Stakeholder Facilitation",
      description: "We help navigate complex stakeholder dynamics, facilitating alignment around research priorities, methods, and use of findings."
    },
    {
      title: "Evidence Translation",
      description: "We support the translation of research findings into policy recommendations, program adjustments, and strategic decisions."
    }
  ];

  const deliverables = [
    { icon: Compass, title: "Evidence Strategies", description: "Comprehensive research planning" },
    { icon: Microscope, title: "Technical Review", description: "Independent quality assessment" },
    { icon: Target, title: "Methodology Design", description: "Approach selection and refinement" },
    { icon: Users, title: "Stakeholder Facilitation", description: "Alignment and engagement support" },
    { icon: Lightbulb, title: "Policy Briefs", description: "Evidence-to-action translation" },
    { icon: Shield, title: "Quality Protocols", description: "Standards and procedures development" },
    { icon: FileText, title: "Position Papers", description: "Strategic thought leadership" },
    { icon: Presentation, title: "Advisory Sessions", description: "Expert consultation and guidance" }
  ];

  const insights = [
    {
      stat: "30+",
      title: "Advisory Engagements",
      description: "We've provided strategic guidance to governments, NGOs, and international organizations across diverse sectors and geographies."
    },
    {
      stat: "100%",
      title: "Methodology Rigor",
      description: "Our technical advisory ensures research investments generate findings that meet international standards for quality and credibility."
    },
    {
      stat: "50+",
      title: "Partner Organizations",
      description: "Our advisory relationships span the development sector—from bilateral donors to grassroots implementers."
    }
  ];

  const whyUsPoints = [
    "Senior expert engagement",
    "Cross-sector experience",
    "Donor relationship expertise",
    "Policy translation skills",
    "Stakeholder management",
    "Quality assurance frameworks",
    "Strategic communication",
    "Long-term partnership focus"
  ];

  return (
    <div className="pt-20">
      <ServiceHero
        tagline="Strategic Partnership"
        title="Technical Advisory"
        description="Expert guidance for evidence-driven decision making. From strategic planning to quality assurance, our senior advisors help organizations maximize the impact of their research investments."
        image="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600"
      />
      <ChallengeSection
        title="Strategic Complexity"
        challenges={challenges}
      />
      <ApproachSection
        title="Partnership for Impact"
        subtitle="Our advisory approach emphasizes genuine partnership—understanding your context deeply and providing guidance that fits your organizational realities and strategic objectives."
        steps={approachSteps}
      />
      <DeliverablesSection deliverables={deliverables} />
      <InsightsSection insights={insights} />
      <WhyUsSection points={whyUsPoints} />
      <ServiceCTA
        title="Seeking Strategic Research Guidance?"
        description="Whether you need help designing an evidence strategy, reviewing methodology, or translating findings into action, our senior advisors are ready to support your work."
      />
    </div>
  );
};

// Services Overview/Hub Page
export const ServicesHubPage = () => {
  const services = [
    {
      title: "Research & Statistics",
      path: "/services/research-statistics",
      description: "Rigorous quantitative and qualitative research that transforms complex questions into actionable evidence meeting the highest international standards.",
      icon: BarChart3,
      highlights: ["Survey Design & Implementation", "Statistical Analysis", "Mixed-Methods Research", "Policy Research"]
    },
    {
      title: "Monitoring & Evaluation",
      path: "/services/monitoring-evaluation",
      description: "Evidence-driven M&E systems that go beyond compliance to generate actionable learning and demonstrate program impact.",
      icon: Target,
      highlights: ["Theory of Change Development", "Baseline Studies", "Impact Evaluations", "M&E Frameworks"]
    },
    {
      title: "Data Collection & Field Operations",
      path: "/services/data-collection",
      description: "Large-scale, high-quality data collection across Africa's most challenging environments with trained teams and proven systems.",
      icon: Users,
      highlights: ["Household Surveys", "Facility Assessments", "Remote Data Collection", "Quality Assurance"]
    },
    {
      title: "Data Analytics & Visualization",
      path: "/services/data-analytics",
      description: "Transform raw data into strategic insight with advanced analytical methods and compelling visualizations.",
      icon: PieChart,
      highlights: ["Statistical Modeling", "Dashboard Development", "Geospatial Analysis", "Predictive Analytics"]
    },
    {
      title: "Capacity Building & Training",
      path: "/services/capacity-building",
      description: "Build lasting organizational capability in research, M&E, and data analytics with practitioner-led programs.",
      icon: GraduationCap,
      highlights: ["Custom Training Programs", "Enumerator Training", "M&E Skills Development", "Ongoing Mentorship"]
    },
    {
      title: "Technical Advisory",
      path: "/services/technical-advisory",
      description: "Expert guidance for evidence-driven decision making from strategic planning to quality assurance.",
      icon: Compass,
      highlights: ["Evidence Strategies", "Methodology Review", "Stakeholder Facilitation", "Policy Translation"]
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#0a1628] text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl">
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">
              Our Services
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6  text-white">
              Comprehensive Research & Evidence Solutions
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              From initial research design through data collection, analysis, and strategic application—we provide 
              end-to-end support for organizations seeking to understand and improve their impact across Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={service.path}
                  className="block h-full bg-white border border-[#e2e8f0] p-8 hover:border-l-4 hover:border-l-[#e63946] hover:shadow-xl transition-all group"
                >
                  <service.icon className="w-12 h-12 text-[#2a9d8f] mb-6 group-hover:text-[#e63946] transition-colors" />
                  <h3 className="text-xl font-bold text-[#0a1628] mb-3  group-hover:text-[#e63946] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[#64748b] text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[#64748b]">
                        <CheckCircle2 className="w-4 h-4 text-[#2a9d8f]" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-2 text-[#0a1628] font-semibold text-sm group-hover:text-[#e63946] transition-colors">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">How We Work</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] ">
              Our Engagement Approach
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Understand", desc: "Deep dive into your context, questions, and objectives" },
              { num: "02", title: "Design", desc: "Develop tailored approaches aligned with your needs" },
              { num: "03", title: "Execute", desc: "Deliver with rigor, transparency, and continuous communication" },
              { num: "04", title: "Impact", desc: "Translate findings into actionable insights and decisions" }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-[#e63946]/20 mb-4">{step.num}</div>
                <h3 className="text-lg font-bold text-[#0a1628] mb-2">{step.title}</h3>
                <p className="text-[#64748b] text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#e63946] text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 ">
            Ready to Partner with Africa's Leading Research Consultancy?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
            Whether you need a single study or comprehensive research support, our team is ready 
            to help you generate the evidence that drives impact.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-white text-[#e63946] px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#0a1628] hover:text-white transition-all"
            >
              Start a Conversation
            </Link>
            <Link 
              to="/projects" 
              className="border-2 border-white text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-white hover:text-[#e63946] transition-all"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesHubPage;
