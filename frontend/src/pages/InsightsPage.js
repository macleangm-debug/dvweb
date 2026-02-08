import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, FileText, Download, BookOpen, BarChart3, 
  Calendar, Clock, User, Search, Filter, ChevronRight,
  Lightbulb, TrendingUp, Globe, Target, Layers, Award,
  ExternalLink, BookMarked, GraduationCap, PieChart
} from 'lucide-react';

const InsightsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Insights', icon: Layers },
    { id: 'articles', name: 'Articles', icon: FileText },
    { id: 'publications', name: 'Publications', icon: BookOpen },
    { id: 'guides', name: 'Methodology Guides', icon: BookMarked },
    { id: 'briefs', name: 'Sector Briefs', icon: PieChart },
  ];

  const featuredInsight = {
    title: "The Future of Data Collection in East Africa: Trends and Innovations for 2025",
    excerpt: "Exploring how mobile technology, AI-assisted quality assurance, and remote supervision are transforming large-scale data collection across Tanzania and the region.",
    category: "articles",
    author: "DataVision Research Team",
    date: "January 2025",
    readTime: "12 min read",
    image: null,
    icon: TrendingUp,
    color: "#e63946"
  };

  const insights = [
    {
      id: 1,
      title: "Best Practices for Household Survey Design in Rural Tanzania",
      excerpt: "A comprehensive guide to designing effective household surveys that account for local context, cultural factors, and logistical challenges.",
      category: "guides",
      author: "Dr. Sarah Mkumba",
      date: "December 2024",
      readTime: "15 min read",
      icon: Target,
      color: "#2a9d8f",
      downloadable: true,
      fileType: "PDF"
    },
    {
      id: 2,
      title: "Impact Evaluation Methods: A Practical Framework",
      excerpt: "Understanding when and how to apply different impact evaluation methodologies for development programs.",
      category: "guides",
      author: "M&E Division",
      date: "November 2024",
      readTime: "20 min read",
      icon: BarChart3,
      color: "#8b5cf6",
      downloadable: true,
      fileType: "PDF"
    },
    {
      id: 3,
      title: "Tanzania Education Sector: Key Findings from 2024",
      excerpt: "Summary of major research findings and trends in Tanzania's education sector based on our extensive fieldwork.",
      category: "briefs",
      author: "Education Practice Team",
      date: "October 2024",
      readTime: "8 min read",
      icon: GraduationCap,
      color: "#f59e0b",
      downloadable: true,
      fileType: "PDF"
    },
    {
      id: 4,
      title: "Remote Data Collection: Lessons from COVID-19 Adaptations",
      excerpt: "How we adapted our data collection methodologies during the pandemic and what we learned for future resilience.",
      category: "articles",
      author: "Operations Team",
      date: "September 2024",
      readTime: "10 min read",
      icon: Globe,
      color: "#06b6d4",
      downloadable: false
    },
    {
      id: 5,
      title: "WASH Sector Performance Report: Tanzania 2024",
      excerpt: "Comprehensive analysis of water, sanitation, and hygiene indicators across all regions of Tanzania.",
      category: "publications",
      author: "WASH Practice Team",
      date: "August 2024",
      readTime: "25 min read",
      icon: Layers,
      color: "#0ea5e9",
      downloadable: true,
      fileType: "PDF"
    },
    {
      id: 6,
      title: "Quality Assurance in Large-Scale Surveys: Our Approach",
      excerpt: "A detailed look at our multi-layered quality assurance framework that ensures data integrity across all projects.",
      category: "guides",
      author: "Quality Team",
      date: "July 2024",
      readTime: "12 min read",
      icon: Award,
      color: "#ec4899",
      downloadable: true,
      fileType: "PDF"
    },
    {
      id: 7,
      title: "Agriculture & Food Security: Emerging Patterns in East Africa",
      excerpt: "Analysis of agricultural productivity trends and food security challenges facing smallholder farmers.",
      category: "briefs",
      author: "Agriculture Practice Team",
      date: "June 2024",
      readTime: "10 min read",
      icon: TrendingUp,
      color: "#84cc16",
      downloadable: true,
      fileType: "PDF"
    },
    {
      id: 8,
      title: "Building Local Research Capacity: A Strategic Approach",
      excerpt: "How we work with local institutions to strengthen research and evaluation capabilities across Africa.",
      category: "articles",
      author: "Capacity Building Team",
      date: "May 2024",
      readTime: "8 min read",
      icon: Lightbulb,
      color: "#a855f7",
      downloadable: false
    }
  ];

  const publications = [
    {
      title: "Annual Research Report 2024",
      description: "Comprehensive overview of all research activities, methodologies, and key findings from 2024.",
      pages: "124 pages",
      fileSize: "4.2 MB",
      icon: BookOpen,
      color: "#e63946"
    },
    {
      title: "M&E Framework Toolkit",
      description: "Practical tools and templates for designing and implementing M&E systems.",
      pages: "86 pages",
      fileSize: "2.8 MB",
      icon: Target,
      color: "#2a9d8f"
    },
    {
      title: "Data Collection Field Manual",
      description: "Standard operating procedures for high-quality field data collection.",
      pages: "64 pages",
      fileSize: "1.9 MB",
      icon: FileText,
      color: "#8b5cf6"
    }
  ];

  const filteredInsights = insights.filter(insight => {
    const matchesCategory = activeCategory === 'all' || insight.category === activeCategory;
    const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         insight.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-[#0a1628] text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, #e63946 0%, transparent 40%),
                              radial-gradient(circle at 80% 70%, #2a9d8f 0%, transparent 40%)`
          }} />
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Lightbulb className="w-4 h-4 text-[#e63946]" />
              <span className="text-sm font-medium text-white">Knowledge Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Insights & Resources
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Explore our latest research findings, methodology guides, sector analyses, 
              and thought leadership from 25+ years of work across Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Insight */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1628] to-[#1e293b] text-white"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#e63946] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>
            
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-[#e63946] px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    <TrendingUp className="w-4 h-4" />
                    Featured Insight
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                    {featuredInsight.title}
                  </h2>
                  <p className="text-white/70 mb-6 text-lg">
                    {featuredInsight.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-6">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredInsight.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredInsight.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredInsight.readTime}
                    </span>
                  </div>
                  <button className="inline-flex items-center gap-2 bg-white text-[#0a1628] px-6 py-3 font-semibold hover:bg-[#e63946] hover:text-white transition-all">
                    Read Full Article
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="hidden lg:flex items-center justify-center w-64 h-64 rounded-2xl bg-white/10 backdrop-blur-sm">
                  <featuredInsight.icon className="w-32 h-32 text-[#e63946] opacity-80" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-[#f8fafc] border-b sticky top-20 z-30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
              <input
                type="text"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:border-[#e63946] transition-colors"
              />
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#e63946] text-white'
                      : 'bg-white text-[#64748b] hover:bg-[#0a1628] hover:text-white'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Insights Grid */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInsights.map((insight, index) => (
              <motion.article
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Icon Header */}
                <div 
                  className="h-40 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: insight.color + '10' }}
                >
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `radial-gradient(circle at 80% 20%, ${insight.color}40 0%, transparent 50%)`
                  }} />
                  <insight.icon 
                    className="w-16 h-16 transition-transform group-hover:scale-110" 
                    style={{ color: insight.color }}
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: insight.color }}
                    >
                      {categories.find(c => c.id === insight.category)?.name}
                    </span>
                  </div>
                  
                  {/* Download Badge */}
                  {insight.downloadable && (
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1 px-2 py-1 rounded bg-white/90 text-xs font-medium text-[#0a1628]">
                        <Download className="w-3 h-3" />
                        {insight.fileType}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#0a1628] mb-2 line-clamp-2 group-hover:text-[#e63946] transition-colors">
                    {insight.title}
                  </h3>
                  <p className="text-[#64748b] text-sm mb-4 line-clamp-2">
                    {insight.excerpt}
                  </p>
                  
                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-[#64748b] mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {insight.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {insight.readTime}
                    </span>
                  </div>
                  
                  {/* CTA */}
                  <button className="flex items-center gap-2 text-sm font-semibold text-[#0a1628] group-hover:text-[#e63946] transition-colors">
                    {insight.downloadable ? 'Download' : 'Read More'}
                    {insight.downloadable ? <Download className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
          
          {filteredInsights.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-[#64748b] mx-auto mb-4" />
              <p className="text-[#64748b]">No insights found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Key Publications */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm"
            >
              Download Resources
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-[#0a1628]"
            >
              Key Publications
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {publications.map((pub, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-[#f8fafc] rounded-xl p-8 hover:bg-[#0a1628] transition-all duration-500"
              >
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors"
                  style={{ backgroundColor: pub.color + '20' }}
                >
                  <pub.icon className="w-8 h-8" style={{ color: pub.color }} />
                </div>
                
                <h3 className="text-xl font-bold text-[#0a1628] group-hover:text-white mb-3 transition-colors">
                  {pub.title}
                </h3>
                <p className="text-[#64748b] group-hover:text-white/70 mb-6 transition-colors">
                  {pub.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-[#64748b] group-hover:text-white/60 mb-6 transition-colors">
                  <span>{pub.pages}</span>
                  <span>•</span>
                  <span>{pub.fileSize}</span>
                </div>
                
                <button className="flex items-center gap-2 text-[#e63946] font-semibold group-hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-[#0a1628] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Lightbulb className="w-12 h-12 text-[#e63946] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stay Informed
              </h2>
              <p className="text-white/70 mb-8">
                Subscribe to receive our latest insights, research findings, and sector analyses 
                directly to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                />
                <button className="bg-[#e63946] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#d02835] transition-colors">
                  Subscribe
                </button>
              </div>
              
              <p className="text-white/50 text-sm mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#e63946] text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Custom Research or Analysis?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Our team can develop tailored research, evaluations, and analytical products 
              to meet your specific needs.
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-[#e63946] px-8 py-4 font-semibold uppercase tracking-wider hover:bg-[#0a1628] hover:text-white transition-all"
            >
              Discuss Your Needs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default InsightsPage;
