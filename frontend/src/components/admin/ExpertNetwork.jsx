import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, UserCheck, Star, Shield, Search, Filter, Plus, MoreVertical,
  ChevronRight, Mail, Phone, MapPin, Award, Briefcase, GraduationCap,
  CheckCircle, XCircle, Clock, Zap, TrendingUp, Target, Brain
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const ExpertNetwork = ({ subSection }) => {
  const [experts, setExperts] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [matchRequests, setMatchRequests] = useState([]);

  useEffect(() => {
    // Mock data
    setExperts([
      {
        id: 1,
        name: 'Dr. Sarah Kimani',
        email: 'sarah.kimani@university.ac.ke',
        phone: '+254 722 123 456',
        location: 'Nairobi, Kenya',
        specialization: 'Health Research',
        skills: ['Epidemiology', 'Biostatistics', 'Clinical Trials', 'Data Analysis'],
        experience: 12,
        education: 'PhD Public Health',
        rating: 4.8,
        projectsCompleted: 28,
        status: 'verified',
        matchScore: 95,
        availability: 'available',
        hourlyRate: 150
      },
      {
        id: 2,
        name: 'Prof. James Ochieng',
        email: 'j.ochieng@research.org',
        phone: '+255 712 345 678',
        location: 'Dar es Salaam, Tanzania',
        specialization: 'Agricultural Economics',
        skills: ['Impact Evaluation', 'Survey Design', 'Econometrics', 'R Programming'],
        experience: 15,
        education: 'PhD Economics',
        rating: 4.9,
        projectsCompleted: 42,
        status: 'verified',
        matchScore: 88,
        availability: 'busy',
        hourlyRate: 175
      },
      {
        id: 3,
        name: 'Maria Santos',
        email: 'maria.santos@consultant.com',
        phone: '+250 788 456 789',
        location: 'Kigali, Rwanda',
        specialization: 'M&E Specialist',
        skills: ['Theory of Change', 'LogFrame', 'Data Visualization', 'SPSS'],
        experience: 8,
        education: 'MSc Development Studies',
        rating: 4.6,
        projectsCompleted: 15,
        status: 'verified',
        matchScore: 82,
        availability: 'available',
        hourlyRate: 120
      },
    ]);

    setPendingVerifications([
      {
        id: 101,
        name: 'John Mwangi',
        email: 'john.mwangi@email.com',
        specialization: 'Data Science',
        skills: ['Python', 'Machine Learning', 'SQL'],
        experience: 5,
        education: 'MSc Computer Science',
        submittedDate: '2024-02-09',
        documents: ['cv', 'certificates', 'references']
      },
      {
        id: 102,
        name: 'Grace Akinyi',
        email: 'grace.a@email.com',
        specialization: 'Social Research',
        skills: ['Qualitative Methods', 'FGDs', 'NVivo'],
        experience: 7,
        education: 'MA Sociology',
        submittedDate: '2024-02-08',
        documents: ['cv', 'certificates']
      },
    ]);

    setMatchRequests([
      {
        id: 1,
        project: 'Agricultural Impact Study - Northern Tanzania',
        client: 'World Bank',
        skills: ['Agricultural Economics', 'Impact Evaluation', 'Survey Design'],
        budget: '$45,000',
        duration: '3 months',
        matchedExperts: [
          { name: 'Prof. James Ochieng', score: 95, available: true },
          { name: 'Dr. Sarah Kimani', score: 78, available: true },
          { name: 'Maria Santos', score: 72, available: false },
        ]
      },
      {
        id: 2,
        project: 'Health Systems Assessment - Kenya',
        client: 'USAID',
        skills: ['Health Research', 'Epidemiology', 'Data Analysis'],
        budget: '$65,000',
        duration: '4 months',
        matchedExperts: [
          { name: 'Dr. Sarah Kimani', score: 98, available: true },
          { name: 'Prof. James Ochieng', score: 65, available: false },
        ]
      },
    ]);
  }, []);

  const calculateAutoScore = (expert, requirements) => {
    // Simulated auto-scoring algorithm
    let score = 0;
    const weights = { skills: 40, experience: 25, rating: 20, availability: 15 };
    
    // Skills match
    const skillMatch = requirements.filter(r => expert.skills.includes(r)).length / requirements.length;
    score += skillMatch * weights.skills;
    
    // Experience (more is better, capped at 15 years)
    score += Math.min(expert.experience / 15, 1) * weights.experience;
    
    // Rating
    score += (expert.rating / 5) * weights.rating;
    
    // Availability
    score += (expert.availability === 'available' ? 1 : 0.5) * weights.availability;
    
    return Math.round(score);
  };

  const renderExpertProfiles = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Expert Profiles</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search experts..." className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg" />
          </div>
          <button className="px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Experts</p>
          <p className="text-2xl font-bold text-slate-900">{experts.length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-600">Verified</p>
          <p className="text-2xl font-bold text-emerald-700">{experts.filter(e => e.status === 'verified').length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-600">Available</p>
          <p className="text-2xl font-bold text-blue-700">{experts.filter(e => e.availability === 'available').length}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-sm text-purple-600">Avg Rating</p>
          <p className="text-2xl font-bold text-purple-700">{(experts.reduce((sum, e) => sum + e.rating, 0) / experts.length).toFixed(1)}</p>
        </div>
      </div>

      {/* Expert Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {experts.map(expert => (
          <div key={expert.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xl font-bold">
                {expert.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{expert.name}</h3>
                    <p className="text-sm text-slate-500">{expert.specialization}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    expert.availability === 'available' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {expert.availability}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {expert.location}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {expert.experience} years</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {expert.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {expert.skills.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">
                      +{expert.skills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-medium">{expert.rating}</span>
                    </div>
                    <span className="text-sm text-slate-500">{expert.projectsCompleted} projects</span>
                    <span className="text-sm font-medium text-slate-900">${expert.hourlyRate}/hr</span>
                  </div>
                  <button className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                    View Profile <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Pending Verifications</h2>
        <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm font-medium">
          {pendingVerifications.length} pending
        </span>
      </div>

      <div className="space-y-4">
        {pendingVerifications.map(expert => (
          <div key={expert.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                  {expert.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{expert.name}</h3>
                  <p className="text-sm text-slate-500">{expert.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span>{expert.specialization}</span>
                    <span>{expert.experience} years experience</span>
                    <span>{expert.education}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {expert.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Submitted {expert.submittedDate}</p>
                <div className="flex items-center gap-2 mt-2">
                  {expert.documents.map((doc, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full capitalize">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
              <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Request More Info
              </button>
              <button className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAutoMatching = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI-Powered Expert Matching</h2>
          <p className="text-slate-500 mt-1">Automatically find the best experts for your projects</p>
        </div>
        <button className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:opacity-90 flex items-center gap-2">
          <Brain className="w-4 h-4" /> New Match Request
        </button>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
        <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" /> How Auto-Matching Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Skills Match', weight: '40%', desc: 'Required skills alignment' },
            { label: 'Experience', weight: '25%', desc: 'Years in relevant field' },
            { label: 'Rating', weight: '20%', desc: 'Past performance score' },
            { label: 'Availability', weight: '15%', desc: 'Current workload status' },
          ].map((factor, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4">
              <p className="font-semibold text-slate-900">{factor.label}</p>
              <p className="text-2xl font-bold text-purple-600">{factor.weight}</p>
              <p className="text-xs text-slate-500 mt-1">{factor.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Match Requests */}
      <div className="space-y-4">
        {matchRequests.map(request => (
          <div key={request.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">{request.project}</h3>
                <p className="text-sm text-slate-500 mt-1">Client: {request.client} • Budget: {request.budget} • Duration: {request.duration}</p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-slate-500">Required Skills:</span>
              {request.skills.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">
                  {skill}
                </span>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" /> Matched Experts (by AI Score)
              </h4>
              <div className="space-y-3">
                {request.matchedExperts.map((expert, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                        idx === 0 ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                        idx === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                        'bg-gradient-to-br from-amber-700 to-amber-800'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{expert.name}</p>
                        <p className={`text-xs ${expert.available ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {expert.available ? 'Available' : 'Currently Busy'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Match Score</p>
                        <p className={`text-xl font-bold ${
                          expert.score >= 90 ? 'text-emerald-600' :
                          expert.score >= 75 ? 'text-blue-600' :
                          'text-amber-600'
                        }`}>
                          {expert.score}%
                        </p>
                      </div>
                      <button className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800">
                        Assign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRatings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Ratings & Reviews</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {experts.map(expert => (
          <div key={expert.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                {expert.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{expert.name}</h3>
                <p className="text-sm text-slate-500">{expert.specialization}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                  <span className="text-2xl font-bold text-slate-900">{expert.rating}</span>
                </div>
                <p className="text-sm text-slate-500">Overall Rating</p>
              </div>
              <div className="flex-1 space-y-2">
                {['Quality', 'Communication', 'Timeliness', 'Expertise'].map((criteria, idx) => (
                  <div key={criteria} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-24">{criteria}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-amber-400"
                        style={{ width: `${[95, 90, 88, 92][idx]}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-600 w-8">{[4.8, 4.5, 4.4, 4.6][idx]}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-500">{expert.projectsCompleted} projects completed</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (subSection) {
      case 'verification':
        return renderVerification();
      case 'matching':
        return renderAutoMatching();
      case 'ratings':
        return renderRatings();
      case 'registrations':
      case 'profiles':
      default:
        return renderExpertProfiles();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Expert Network</h1>
        <p className="text-slate-500 mt-1">Manage experts, verify profiles, and match them to projects</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default ExpertNetwork;
