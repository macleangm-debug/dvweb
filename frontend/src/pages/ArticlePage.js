import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Calendar, Clock, User, Share2, 
  Bookmark, Download, ChevronLeft, ChevronRight, Lightbulb,
  TrendingUp, BarChart3, Target, Globe, GraduationCap, Award,
  MessageSquare, Phone, Mail, CheckCircle2, FileText, BookOpen,
  Layers, PieChart, ExternalLink
} from 'lucide-react';

// Article data
const articlesData = [
  {
    id: 'future-data-collection-2025',
    title: "The Future of Data Collection in East Africa: Trends and Innovations for 2025",
    excerpt: "Exploring how mobile technology, AI-assisted quality assurance, and remote supervision are transforming large-scale data collection across Tanzania and the region.",
    category: "articles",
    author: "DataVision Research Team",
    authorRole: "Lead Researchers",
    date: "January 2025",
    readTime: "12 min read",
    icon: TrendingUp,
    color: "#e63946",
    content: [
      {
        type: "intro",
        text: "The landscape of data collection in East Africa is undergoing a profound transformation. As we enter 2025, technological innovations, changing methodological approaches, and evolving client expectations are reshaping how research organizations like DataVision International conduct large-scale surveys and evaluations."
      },
      {
        type: "section",
        title: "The Rise of Mobile-First Data Collection",
        text: "Mobile data collection has moved from being an innovation to becoming the standard. In Tanzania, smartphone penetration among enumerators has reached near-universal levels, enabling real-time data transmission, GPS verification, and multimedia capture. Our experience shows that mobile-first approaches reduce data entry errors by up to 40% compared to paper-based methods."
      },
      {
        type: "section",
        title: "AI-Assisted Quality Assurance",
        text: "Artificial intelligence is revolutionizing quality assurance in field research. Machine learning algorithms can now detect anomalies in real-time, flag potential fabrication, and identify patterns that would take human reviewers days to discover. At DataVision, we've implemented AI-powered dashboards that provide supervisors with instant insights into data quality across hundreds of enumerators."
      },
      {
        type: "quote",
        text: "The combination of mobile technology and AI has reduced our quality assurance time by 60% while actually improving data accuracy.",
        author: "Field Operations Director, DataVision International"
      },
      {
        type: "section",
        title: "Remote Supervision and Hybrid Models",
        text: "The post-pandemic era has normalized remote supervision. Video check-ins, real-time GPS tracking, and automated performance metrics allow supervisors to manage larger teams across greater distances. This hybrid approach combines the efficiency of remote oversight with strategic in-person quality checks."
      },
      {
        type: "section",
        title: "Implications for Development Partners",
        text: "For organizations commissioning research in East Africa, these innovations mean faster turnaround times, higher data quality, and more cost-effective projects. The ability to monitor data collection in real-time provides unprecedented transparency and enables mid-course corrections that were previously impossible."
      },
      {
        type: "section",
        title: "Looking Ahead",
        text: "As we look to the future, we anticipate continued integration of technology with traditional research methods. The key will be maintaining the human expertise that ensures cultural sensitivity, proper sampling, and meaningful interpretation—while leveraging technology to enhance efficiency and quality."
      }
    ],
    tags: ["Data Collection", "Technology", "Innovation", "East Africa", "Mobile Surveys"],
    relatedServices: ["data-collection", "digital-solutions", "research-statistics"]
  },
  {
    id: 'household-survey-design-tanzania',
    title: "Best Practices for Household Survey Design in Rural Tanzania",
    excerpt: "A comprehensive guide to designing effective household surveys that account for local context, cultural factors, and logistical challenges.",
    category: "guides",
    author: "Dr. Sarah Mkumba",
    authorRole: "Senior Research Advisor",
    date: "December 2024",
    readTime: "15 min read",
    icon: Target,
    color: "#2a9d8f",
    downloadable: true,
    content: [
      {
        type: "intro",
        text: "Designing household surveys for rural Tanzania requires a deep understanding of local contexts, cultural norms, and practical constraints. This guide synthesizes 25 years of DataVision's experience conducting surveys across all regions of Tanzania."
      },
      {
        type: "section",
        title: "Understanding the Tanzanian Context",
        text: "Tanzania's diverse geography, from coastal regions to highland areas, creates unique challenges for survey design. Seasonal variations, agricultural calendars, and local customs must all be considered when planning data collection timing and questionnaire design."
      },
      {
        type: "section",
        title: "Sampling Considerations",
        text: "Proper sampling in rural Tanzania requires up-to-date enumeration area maps, consideration of population mobility patterns, and strategies for reaching remote communities. We recommend multi-stage cluster sampling with appropriate oversampling for hard-to-reach areas."
      },
      {
        type: "section",
        title: "Questionnaire Design Principles",
        text: "Effective questionnaires balance comprehensiveness with respondent burden. In rural Tanzania, surveys should be designed for completion within 45-60 minutes, use locally understood terminology, and include appropriate skip patterns to maintain engagement."
      },
      {
        type: "section",
        title: "Cultural Sensitivity",
        text: "Understanding local customs around hospitality, gender dynamics, and community hierarchies is essential. Enumerator training must include cultural competency components, and questionnaires should be tested for cultural appropriateness."
      }
    ],
    tags: ["Survey Design", "Methodology", "Tanzania", "Rural Research", "Best Practices"],
    relatedServices: ["survey-design", "research-statistics", "data-collection"]
  },
  {
    id: 'impact-evaluation-framework',
    title: "Impact Evaluation Methods: A Practical Framework",
    excerpt: "Understanding when and how to apply different impact evaluation methodologies for development programs.",
    category: "guides",
    author: "M&E Division",
    authorRole: "Evaluation Specialists",
    date: "November 2024",
    readTime: "20 min read",
    icon: BarChart3,
    color: "#8b5cf6",
    downloadable: true,
    content: [
      {
        type: "intro",
        text: "Impact evaluation is essential for understanding whether development programs achieve their intended outcomes. This framework provides practical guidance on selecting and implementing appropriate evaluation methodologies."
      },
      {
        type: "section",
        title: "Choosing the Right Methodology",
        text: "The choice of evaluation methodology depends on program design, available data, ethical considerations, and resource constraints. Randomized controlled trials (RCTs) provide the strongest evidence but aren't always feasible or appropriate."
      },
      {
        type: "section",
        title: "Quasi-Experimental Designs",
        text: "When randomization isn't possible, quasi-experimental methods like difference-in-differences, regression discontinuity, and propensity score matching can provide credible impact estimates. Each method has specific assumptions and data requirements."
      },
      {
        type: "section",
        title: "Mixed Methods Approaches",
        text: "Combining quantitative impact estimates with qualitative insights provides a richer understanding of how and why programs work. Process evaluations and case studies complement statistical analysis."
      }
    ],
    tags: ["Impact Evaluation", "M&E", "Methodology", "Development", "Research"],
    relatedServices: ["monitoring-evaluation", "research-statistics", "program-design"]
  },
  {
    id: 'education-sector-findings-2024',
    title: "Tanzania Education Sector: Key Findings from 2024",
    excerpt: "Summary of major research findings and trends in Tanzania's education sector based on our extensive fieldwork.",
    category: "briefs",
    author: "Education Practice Team",
    authorRole: "Sector Specialists",
    date: "October 2024",
    readTime: "8 min read",
    icon: GraduationCap,
    color: "#f59e0b",
    downloadable: true,
    content: [
      {
        type: "intro",
        text: "2024 has been a pivotal year for Tanzania's education sector. Based on DataVision's extensive research across the country, this brief summarizes key findings and emerging trends."
      },
      {
        type: "section",
        title: "Early Grade Literacy Progress",
        text: "Our assessments show continued improvement in early grade reading outcomes, with 68% of Standard 3 students now able to read at grade level, up from 54% in 2020. However, significant regional disparities persist."
      },
      {
        type: "section",
        title: "Teacher Quality and Training",
        text: "Teacher competency assessments reveal that in-service training programs are having measurable impacts. Schools with teachers who completed recent professional development show 15% higher student achievement scores."
      },
      {
        type: "section",
        title: "Infrastructure and Resources",
        text: "School infrastructure improvements continue, but the student-to-textbook ratio remains a challenge in many districts. Digital learning resources are increasingly available but face connectivity constraints in rural areas."
      }
    ],
    tags: ["Education", "Tanzania", "Research Findings", "Literacy", "2024"],
    relatedServices: ["research-statistics", "monitoring-evaluation", "capacity-building"]
  },
  {
    id: 'remote-data-collection-lessons',
    title: "Remote Data Collection: Lessons from COVID-19 Adaptations",
    excerpt: "How we adapted our data collection methodologies during the pandemic and what we learned for future resilience.",
    category: "articles",
    author: "Operations Team",
    authorRole: "Field Operations",
    date: "September 2024",
    readTime: "10 min read",
    icon: Globe,
    color: "#06b6d4",
    content: [
      {
        type: "intro",
        text: "The COVID-19 pandemic forced research organizations worldwide to rapidly adapt their methodologies. This article shares DataVision's experience transitioning to remote and hybrid data collection approaches."
      },
      {
        type: "section",
        title: "Pivoting to Phone Surveys",
        text: "When face-to-face interviews became impossible, we rapidly scaled our phone survey capabilities. This required new sampling approaches, modified questionnaires, and innovative quality assurance mechanisms."
      },
      {
        type: "section",
        title: "Maintaining Data Quality",
        text: "Remote data collection presented unique quality challenges. We developed new verification protocols, including callback verification, audio recording review, and statistical anomaly detection."
      },
      {
        type: "section",
        title: "Lessons for the Future",
        text: "The pandemic taught us that flexibility and redundancy are essential. Our current approach incorporates remote capabilities as a standard backup, ensuring continuity regardless of external disruptions."
      }
    ],
    tags: ["COVID-19", "Remote Research", "Methodology", "Adaptation", "Resilience"],
    relatedServices: ["data-collection", "digital-solutions", "qualitative-research"]
  }
];

const ArticlePage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  
  const currentArticle = articlesData.find(a => a.id === articleId) || articlesData[0];
  const currentIndex = articlesData.findIndex(a => a.id === articleId);
  const prevArticle = currentIndex > 0 ? articlesData[currentIndex - 1] : null;
  const nextArticle = currentIndex < articlesData.length - 1 ? articlesData[currentIndex + 1] : null;
  
  // Related articles (excluding current)
  const relatedArticles = articlesData
    .filter(a => a.id !== articleId)
    .slice(0, 3);

  // Check if article is saved on load
  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem('datavision_saved_articles') || '[]');
    setIsBookmarked(savedArticles.some(a => a.id === articleId));
  }, [articleId]);

  // Handle save/unsave
  const handleSaveToggle = () => {
    const savedArticles = JSON.parse(localStorage.getItem('datavision_saved_articles') || '[]');
    
    if (isBookmarked) {
      // Remove from saved
      const updatedArticles = savedArticles.filter(a => a.id !== articleId);
      localStorage.setItem('datavision_saved_articles', JSON.stringify(updatedArticles));
      setIsBookmarked(false);
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 2000);
    } else {
      // Add to saved
      const articleToSave = {
        id: currentArticle.id,
        title: currentArticle.title,
        excerpt: currentArticle.excerpt,
        category: currentArticle.category,
        author: currentArticle.author,
        date: currentArticle.date,
        readTime: currentArticle.readTime,
        color: currentArticle.color,
        savedAt: new Date().toISOString()
      };
      savedArticles.push(articleToSave);
      localStorage.setItem('datavision_saved_articles', JSON.stringify(savedArticles));
      setIsBookmarked(true);
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 2000);
    }
  };

  const serviceNames = {
    'data-collection': 'Data Collection',
    'digital-solutions': 'Digital Solutions',
    'research-statistics': 'Research & Statistics',
    'survey-design': 'Survey Design',
    'monitoring-evaluation': 'Monitoring & Evaluation',
    'program-design': 'Program Design',
    'qualitative-research': 'Qualitative Research',
    'capacity-building': 'Capacity Building'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentArticle.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="pt-20 bg-[#f8fafc]">
      {/* Article Header */}
      <section className="relative bg-[#0a1628] text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, ${currentArticle.color} 0%, transparent 40%),
                              radial-gradient(circle at 80% 70%, #2a9d8f 0%, transparent 40%)`
          }} />
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link to="/insights" className="hover:text-white transition-colors">Insights</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{currentArticle.category === 'articles' ? 'Article' : currentArticle.category === 'guides' ? 'Guide' : 'Brief'}</span>
          </div>

          <div className="max-w-4xl">
            {/* Category Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ backgroundColor: currentArticle.color }}
            >
              <currentArticle.icon className="w-4 h-4" />
              {currentArticle.category === 'articles' ? 'Article' : currentArticle.category === 'guides' ? 'Methodology Guide' : 'Sector Brief'}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              {currentArticle.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-white/70 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <div>
                  <span className="text-white font-medium">{currentArticle.author}</span>
                  <span className="text-white/50 text-sm ml-2">{currentArticle.authorRole}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{currentArticle.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{currentArticle.readTime}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              {currentArticle.downloadable && (
                <button className="flex items-center gap-2 bg-white text-[#0a1628] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#e63946] hover:text-white transition-all">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              )}
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-white/20 transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                  isBookmarked ? 'bg-[#e63946] text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Article Content */}
            <div className="lg:col-span-2">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 md:p-12 shadow-sm"
              >
                {currentArticle.content.map((block, index) => (
                  <div key={index} className="mb-8">
                    {block.type === 'intro' && (
                      <p className="text-xl text-[#64748b] leading-relaxed border-l-4 border-[#e63946] pl-6">
                        {block.text}
                      </p>
                    )}
                    {block.type === 'section' && (
                      <>
                        <h2 className="text-2xl font-bold text-[#0a1628] mb-4">{block.title}</h2>
                        <p className="text-[#64748b] leading-relaxed">{block.text}</p>
                      </>
                    )}
                    {block.type === 'quote' && (
                      <blockquote className="bg-[#f8fafc] p-6 rounded-xl border-l-4 border-[#2a9d8f]">
                        <p className="text-lg italic text-[#0a1628] mb-3">"{block.text}"</p>
                        <cite className="text-sm text-[#64748b] not-italic">— {block.author}</cite>
                      </blockquote>
                    )}
                  </div>
                ))}

                {/* Tags */}
                <div className="pt-8 border-t border-[#e2e8f0]">
                  <p className="text-sm font-semibold text-[#0a1628] mb-3">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {currentArticle.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-[#f8fafc] text-[#64748b] rounded-full text-sm hover:bg-[#e63946] hover:text-white cursor-pointer transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>

              {/* Article Navigation */}
              <div className="mt-8 grid md:grid-cols-2 gap-4">
                {prevArticle && (
                  <Link
                    to={`/insights/${prevArticle.id}`}
                    className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#f8fafc] flex items-center justify-center group-hover:bg-[#e63946] transition-colors">
                      <ArrowLeft className="w-5 h-5 text-[#64748b] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Previous</p>
                      <p className="text-[#0a1628] font-semibold line-clamp-2 group-hover:text-[#e63946] transition-colors">
                        {prevArticle.title}
                      </p>
                    </div>
                  </Link>
                )}
                {nextArticle && (
                  <Link
                    to={`/insights/${nextArticle.id}`}
                    className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all flex items-start gap-4 text-right md:col-start-2"
                  >
                    <div className="flex-1">
                      <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Next</p>
                      <p className="text-[#0a1628] font-semibold line-clamp-2 group-hover:text-[#e63946] transition-colors">
                        {nextArticle.title}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#f8fafc] flex items-center justify-center group-hover:bg-[#e63946] transition-colors">
                      <ArrowRight className="w-5 h-5 text-[#64748b] group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* CTA Card - Primary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#0a1628] rounded-2xl p-8 text-white"
              >
                <div className="w-14 h-14 rounded-xl bg-[#e63946] flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Need Similar Research?</h3>
                <p className="text-white/70 mb-6">
                  Our team can design and implement custom research projects tailored to your specific needs.
                </p>
                <Link
                  to="/contact"
                  className="block w-full bg-[#e63946] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#d02835] transition-colors"
                >
                  Request a Consultation
                </Link>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/50 text-sm mb-2">Or reach us directly:</p>
                  <a href="tel:+255754869302" className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-1">
                    <Phone className="w-4 h-4" />
                    +255 754 869 302
                  </a>
                  <a href="mailto:info@datavision.co.tz" className="flex items-center gap-2 text-white/70 hover:text-white text-sm">
                    <Mail className="w-4 h-4" />
                    info@datavision.co.tz
                  </a>
                </div>
              </motion.div>

              {/* Related Services */}
              {currentArticle.relatedServices && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-[#0a1628] mb-4">Related Services</h3>
                  <div className="space-y-3">
                    {currentArticle.relatedServices.map((serviceId, i) => (
                      <Link
                        key={i}
                        to={`/services/${serviceId}`}
                        className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg hover:bg-[#e63946] hover:text-white group transition-all"
                      >
                        <span className="font-medium text-[#0a1628] group-hover:text-white transition-colors">
                          {serviceNames[serviceId]}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#64748b] group-hover:text-white transition-colors" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick Navigation */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-[#0a1628] mb-4">More Insights</h3>
                <div className="space-y-4">
                  {relatedArticles.map((article, i) => (
                    <Link
                      key={i}
                      to={`/insights/${article.id}`}
                      className="group block"
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: article.color + '20' }}
                        >
                          <article.icon className="w-5 h-5" style={{ color: article.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0a1628] group-hover:text-[#e63946] transition-colors line-clamp-2">
                            {article.title}
                          </p>
                          <p className="text-xs text-[#64748b] mt-1">{article.readTime}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/insights"
                  className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-[#e2e8f0] text-[#e63946] font-semibold hover:underline"
                >
                  View All Insights
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-[#e63946] to-[#d02835] text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Ready to Start Your Research Project?
              </h2>
              <p className="text-white/90 max-w-xl">
                Partner with Tanzania's leading research consultancy. 25+ years of experience, 
                500+ trained enumerators, and a track record of excellence.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="bg-white text-[#e63946] px-8 py-4 font-semibold uppercase tracking-wider hover:bg-[#0a1628] hover:text-white transition-all"
              >
                Get Started
              </Link>
              <Link
                to="/services"
                className="border-2 border-white text-white px-8 py-4 font-semibold uppercase tracking-wider hover:bg-white hover:text-[#e63946] transition-all"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-[#0a1628] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4"
        >
          {prevArticle && (
            <button
              onClick={() => navigate(`/insights/${prevArticle.id}`)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              title={prevArticle.title}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Previous</span>
            </button>
          )}
          
          <Link
            to="/insights"
            className="flex items-center gap-2 px-4 py-1 bg-white/10 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <Layers className="w-4 h-4" />
            All Insights
          </Link>
          
          {nextArticle && (
            <button
              onClick={() => navigate(`/insights/${nextArticle.id}`)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              title={nextArticle.title}
            >
              <span className="hidden sm:inline text-sm">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ArticlePage;
