/**
 * Jobs Tab Component
 * Lists all open positions with search and filter functionality
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Building2, MapPin, Clock, Briefcase, 
  ChevronRight, CheckCircle2, ArrowRight 
} from 'lucide-react';

const JobsTab = ({ 
  jobs, 
  searchTerm, 
  setSearchTerm, 
  selectedDepartment, 
  setSelectedDepartment, 
  expandedJob, 
  setExpandedJob, 
  departments 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Search Header */}
    <section className="bg-[#0a1628] text-white py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Open Positions</h1>
        <p className="text-white/70 mb-8 max-w-2xl">
          Find your next opportunity. We're looking for talented individuals who want to 
          make a difference through data-driven research and analytics.
        </p>
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white text-[#0a1628] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
              data-testid="job-search-input"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-4 bg-white text-[#0a1628] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
            data-testid="department-filter"
          >
            {departments.map(dept => (
              <option key={dept.name} value={dept.name}>
                {dept.name} ({dept.count})
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>

    {/* Job Listings */}
    <section className="py-16 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-6 text-[#64748b]">
          Showing {jobs.length} position{jobs.length !== 1 ? 's' : ''}
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden hover:shadow-lg transition-all"
            >
              <div 
                className="p-6 cursor-pointer"
                onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#0a1628]">{job.title}</h3>
                      {job.featured && (
                        <span className="px-2 py-1 bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-semibold rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[#64748b]">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" /> {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" /> {job.experience}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[#64748b]">{job.posted}</span>
                    <ChevronRight className={`w-5 h-5 text-[#64748b] transition-transform ${expandedJob === job.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedJob === job.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[#e2e8f0]"
                  >
                    <div className="p-6 bg-[#f8fafc]">
                      <p className="text-[#64748b] mb-6">{job.description}</p>
                      
                      <h4 className="font-bold text-[#0a1628] mb-3">Requirements</h4>
                      <ul className="space-y-2 mb-6">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#64748b]">
                            <CheckCircle2 className="w-5 h-5 text-[#2a9d8f] flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 font-semibold hover:bg-[#0a1628] transition-all"
                        data-testid={`apply-btn-${job.id}`}
                      >
                        Apply Now <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <Briefcase className="w-16 h-16 text-[#e2e8f0] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#0a1628] mb-2">No positions found</h3>
            <p className="text-[#64748b]">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </section>
  </motion.div>
);

export default JobsTab;
