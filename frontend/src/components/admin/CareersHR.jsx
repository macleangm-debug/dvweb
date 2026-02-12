import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Briefcase, Users, Clock, MapPin, DollarSign, Calendar, Search,
  Filter, Plus, MoreVertical, ChevronRight, Eye, Download, Mail,
  Phone, FileText, CheckCircle, XCircle, Star, Building2
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const CareersHR = ({ subSection }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  useEffect(() => {
    // Mock data
    setJobs([
      { 
        id: 1, 
        title: 'Senior Data Analyst', 
        department: 'Research', 
        location: 'Dar es Salaam', 
        type: 'Full-time',
        salary: '$45,000 - $65,000',
        posted: '2024-02-01',
        applications: 12,
        status: 'active'
      },
      { 
        id: 2, 
        title: 'Software Engineer', 
        department: 'Technology', 
        location: 'Remote', 
        type: 'Full-time',
        salary: '$60,000 - $85,000',
        posted: '2024-02-05',
        applications: 28,
        status: 'active'
      },
      { 
        id: 3, 
        title: 'Field Research Coordinator', 
        department: 'Operations', 
        location: 'Arusha', 
        type: 'Contract',
        salary: '$35,000 - $45,000',
        posted: '2024-01-28',
        applications: 8,
        status: 'active'
      },
      { 
        id: 4, 
        title: 'UX Designer', 
        department: 'Product', 
        location: 'Dar es Salaam', 
        type: 'Full-time',
        salary: '$50,000 - $70,000',
        posted: '2024-01-20',
        applications: 15,
        status: 'closed'
      },
    ]);

    setApplications([
      { 
        id: 1, 
        name: 'John Mwamba', 
        email: 'john.mwamba@email.com',
        phone: '+255 712 345 678',
        job: 'Senior Data Analyst', 
        applied: '2024-02-10',
        experience: '5 years',
        education: 'MSc Statistics',
        status: 'new',
        rating: 0,
        resume: 'john_mwamba_cv.pdf',
        coverLetter: true
      },
      { 
        id: 2, 
        name: 'Sarah Kimani', 
        email: 'sarah.k@email.com',
        phone: '+254 722 123 456',
        job: 'Software Engineer', 
        applied: '2024-02-09',
        experience: '7 years',
        education: 'BSc Computer Science',
        status: 'reviewing',
        rating: 4,
        resume: 'sarah_kimani_cv.pdf',
        coverLetter: true
      },
      { 
        id: 3, 
        name: 'Peter Ochieng', 
        email: 'peter.o@email.com',
        phone: '+254 733 456 789',
        job: 'Software Engineer', 
        applied: '2024-02-08',
        experience: '4 years',
        education: 'BSc Software Engineering',
        status: 'interviewed',
        rating: 5,
        resume: 'peter_ochieng_cv.pdf',
        coverLetter: false
      },
      { 
        id: 4, 
        name: 'Grace Mushi', 
        email: 'grace.m@email.com',
        phone: '+255 754 789 012',
        job: 'Field Research Coordinator', 
        applied: '2024-02-07',
        experience: '6 years',
        education: 'BA Social Sciences',
        status: 'shortlisted',
        rating: 4,
        resume: 'grace_mushi_cv.pdf',
        coverLetter: true
      },
    ]);
  }, []);

  const JobForm = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Create Job Posting</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <XCircle className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
            <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400" placeholder="e.g., Senior Data Analyst" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400">
                <option>Research</option>
                <option>Technology</option>
                <option>Operations</option>
                <option>Product</option>
                <option>Sales</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400" placeholder="e.g., Dar es Salaam" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400" placeholder="e.g., $45,000 - $65,000" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
            <textarea rows={4} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400" placeholder="Describe the role, responsibilities, and requirements..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Requirements</label>
            <textarea rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400" placeholder="List the qualifications and skills required..." />
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800">
            Publish Job
          </button>
        </div>
      </div>
    </div>
  );

  const renderJobPostings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Job Postings</h2>
        <button 
          onClick={() => setShowJobForm(true)}
          className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Job Posting
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Active Jobs</p>
          <p className="text-2xl font-bold text-slate-900">{jobs.filter(j => j.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Applications</p>
          <p className="text-2xl font-bold text-slate-900">{jobs.reduce((sum, j) => sum + j.applications, 0)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Avg Applications/Job</p>
          <p className="text-2xl font-bold text-slate-900">{Math.round(jobs.reduce((sum, j) => sum + j.applications, 0) / jobs.length)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Time to Fill (avg)</p>
          <p className="text-2xl font-bold text-slate-900">21 days</p>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded-lg">All Jobs</button>
            <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Active</button>
            <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Closed</button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search jobs..." className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg" />
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {jobs.map(job => (
            <div key={job.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-slate-900">{job.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      job.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.department}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job.salary}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{job.applications} applications</p>
                    <p className="text-xs text-slate-500">Posted {job.posted}</p>
                  </div>
                  <button className="p-2 hover:bg-slate-100 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showJobForm && <JobForm onClose={() => setShowJobForm(false)} />}
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Applications</h2>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg">
            <option>All Jobs</option>
            {jobs.map(job => <option key={job.id}>{job.title}</option>)}
          </select>
          <button className="px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Application Pipeline */}
      <div className="grid grid-cols-5 gap-4">
        {['new', 'reviewing', 'interviewed', 'shortlisted', 'hired'].map(status => {
          const count = applications.filter(a => a.status === status).length;
          return (
            <div key={status} className={`p-4 rounded-xl text-center ${
              status === 'hired' ? 'bg-emerald-50 border border-emerald-200' :
              status === 'shortlisted' ? 'bg-blue-50 border border-blue-200' :
              'bg-slate-50 border border-slate-200'
            }`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm text-slate-600 capitalize">{status}</p>
            </div>
          );
        })}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Candidate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Applied</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {applications.map(app => (
              <tr key={app.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-medium">
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{app.name}</p>
                      <p className="text-sm text-slate-500">{app.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{app.job}</td>
                <td className="px-6 py-4 text-slate-600">{app.experience}</td>
                <td className="px-6 py-4 text-slate-500">{app.applied}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= app.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    app.status === 'new' ? 'bg-blue-100 text-blue-600' :
                    app.status === 'reviewing' ? 'bg-amber-100 text-amber-600' :
                    app.status === 'interviewed' ? 'bg-purple-100 text-purple-600' :
                    app.status === 'shortlisted' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg" title="View Resume">
                      <FileText className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg" title="Send Email">
                      <Mail className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (subSection) {
      case 'applications':
        return renderApplications();
      case 'tracking':
        return renderApplications(); // Same view with different filters
      case 'jobs':
      default:
        return renderJobPostings();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Careers & HR</h1>
        <p className="text-slate-500 mt-1">Manage job postings and applications</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default CareersHR;
