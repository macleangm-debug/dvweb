import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ArrowLeft, CheckCircle2, User, Briefcase, MapPin, 
  GraduationCap, Star, Globe, DollarSign, FileText, Loader2,
  Plus, X, AlertCircle
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Form steps
const STEPS = [
  { id: 'personal', title: 'Personal Information', icon: User },
  { id: 'professional', title: 'Professional Background', icon: Briefcase },
  { id: 'expertise', title: 'Areas of Expertise', icon: Star },
  { id: 'geographic', title: 'Geographic Experience', icon: Globe },
  { id: 'availability', title: 'Availability & Rates', icon: DollarSign },
  { id: 'portfolio', title: 'Portfolio & References', icon: FileText }
];

const ExpertRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    // Personal
    full_name: '',
    email: '',
    phone: '',
    location_country: '',
    location_city: '',
    nationality: '',
    languages: [],
    
    // Professional
    current_title: '',
    current_organization: '',
    years_experience: '',
    education: [],
    certifications: [],
    
    // Expertise
    primary_sectors: [],
    secondary_sectors: [],
    skills: [],
    
    // Geographic
    countries_experience: [],
    regional_expertise: [],
    
    // Availability
    availability: 'available',
    availability_start_date: '',
    engagement_type: [],
    daily_rate_min: '',
    daily_rate_max: '',
    rate_currency: 'USD',
    willing_to_travel: true,
    
    // Portfolio
    cv_url: '',
    linkedin_url: '',
    portfolio_url: '',
    notable_projects: [],
    publications: [],
    references: []
  });

  // Fetch options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/experts/options`);
        if (!res.ok) throw new Error('Failed to fetch options');
        const data = await res.json();
        setOptions(data);
      } catch (err) {
        console.error('Error fetching options:', err);
        setError('Failed to load form options. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', field: '', institution: '', year: '' }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', years_experience: 0, proficiency: 'intermediate' }]
    }));
  };

  const updateSkill = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0: // Personal
        return formData.full_name && formData.email && formData.phone && 
               formData.location_country && formData.nationality;
      case 1: // Professional
        return formData.current_title && formData.years_experience;
      case 2: // Expertise
        return formData.primary_sectors.length > 0;
      case 3: // Geographic
        return formData.countries_experience.length > 0;
      case 4: // Availability
        return formData.availability && formData.engagement_type.length > 0;
      case 5: // Portfolio
        return true; // Optional step
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep() && currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        years_experience: parseInt(formData.years_experience) || 0,
        daily_rate_min: formData.daily_rate_min ? parseFloat(formData.daily_rate_min) : null,
        daily_rate_max: formData.daily_rate_max ? parseFloat(formData.daily_rate_max) : null,
        education: formData.education.map(edu => ({
          ...edu,
          year: parseInt(edu.year) || 0
        })),
        skills: formData.skills.map(skill => ({
          ...skill,
          years_experience: parseInt(skill.years_experience) || 0
        }))
      };

      const res = await fetch(`${API_URL}/api/experts/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Registration failed');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#f59e0b] animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-12 text-center max-w-2xl mx-auto"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-[#0a1628] mb-4">Registration Submitted!</h2>
        <p className="text-[#64748b] mb-8">
          Thank you for registering with the DataVision Expert Network. Our team will review 
          your profile and contact you within 5-7 business days if your expertise matches 
          our current or upcoming project needs.
        </p>
        <div className="bg-[#f8fafc] rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-[#0a1628] mb-2">What happens next?</h3>
          <ul className="text-left text-[#64748b] space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <span>Our team reviews your profile against current project requirements</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <span>You will be added to our expert database for future matching</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <span>We will contact you when a project matches your expertise</span>
            </li>
          </ul>
        </div>
        <Link
          to="/careers?tab=experts"
          className="inline-flex items-center gap-2 text-[#f59e0b] font-semibold hover:gap-3 transition-all"
        >
          Back to Expert Network <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  index < currentStep
                    ? 'bg-[#f59e0b] text-white'
                    : index === currentStep
                    ? 'bg-[#0a1628] text-white'
                    : 'bg-[#e2e8f0] text-[#64748b]'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`hidden md:block w-16 lg:w-24 h-1 mx-2 transition-all ${
                    index < currentStep ? 'bg-[#f59e0b]' : 'bg-[#e2e8f0]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-[#0a1628]">{STEPS[currentStep].title}</h3>
          <p className="text-[#64748b] text-sm">Step {currentStep + 1} of {STEPS.length}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Steps */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e2e8f0]">
        <AnimatePresence mode="wait">
          {/* Step 0: Personal Information */}
          {currentStep === 0 && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => updateFormData('full_name', e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                    placeholder="Dr. John Doe"
                    data-testid="input-full-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                    placeholder="john.doe@example.com"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                    placeholder="+255 XXX XXX XXX"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.nationality}
                    onChange={(e) => updateFormData('nationality', e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                    data-testid="select-nationality"
                  >
                    <option value="">Select nationality</option>
                    {options?.countries?.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">
                    Country of Residence <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.location_country}
                    onChange={(e) => updateFormData('location_country', e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                    data-testid="select-country"
                  >
                    <option value="">Select country</option>
                    {options?.countries?.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">City</label>
                  <input
                    type="text"
                    value={formData.location_city}
                    onChange={(e) => updateFormData('location_city', e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                    placeholder="Dar es Salaam"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">Languages Spoken</label>
                <div className="flex flex-wrap gap-2">
                  {['English', 'Swahili', 'French', 'Portuguese', 'Arabic', 'Other'].map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleArrayItem('languages', lang)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.languages.includes(lang)
                          ? 'bg-[#f59e0b] text-white'
                          : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#f59e0b]/10'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Professional Background */}
          {currentStep === 1 && (
            <motion.div
              key="professional"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">
                    Current Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.current_title}
                    onChange={(e) => updateFormData('current_title', e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                    placeholder="Senior Research Consultant"
                    data-testid="input-title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">Current Organization</label>
                  <input
                    type="text"
                    value={formData.current_organization}
                    onChange={(e) => updateFormData('current_organization', e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                    placeholder="Independent / Company Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Years of Professional Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.years_experience}
                  onChange={(e) => updateFormData('years_experience', e.target.value)}
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                  placeholder="10"
                  min="0"
                  max="50"
                  data-testid="input-experience"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-[#0a1628]">Education</label>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="flex items-center gap-1 text-[#f59e0b] text-sm font-medium hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Add Education
                  </button>
                </div>
                {formData.education.map((edu, index) => (
                  <div key={index} className="bg-[#f8fafc] rounded-xl p-4 mb-4">
                    <div className="flex justify-end mb-2">
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm"
                        placeholder="Degree (e.g., PhD, Masters)"
                      />
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                        className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm"
                        placeholder="Field of Study"
                      />
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm"
                        placeholder="Institution"
                      />
                      <input
                        type="number"
                        value={edu.year}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                        className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm"
                        placeholder="Year"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">Certifications</label>
                <textarea
                  value={formData.certifications.join('\n')}
                  onChange={(e) => updateFormData('certifications', e.target.value.split('\n').filter(c => c.trim()))}
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                  placeholder="Enter certifications, one per line"
                  rows={3}
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Areas of Expertise */}
          {currentStep === 2 && (
            <motion.div
              key="expertise"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Primary Sectors <span className="text-red-500">*</span>
                  <span className="text-[#64748b] font-normal ml-2">(Select your main areas of expertise)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {options?.sectors?.map(sector => (
                    <button
                      key={sector.id}
                      type="button"
                      onClick={() => toggleArrayItem('primary_sectors', sector.id)}
                      className={`p-3 rounded-xl text-left text-sm font-medium transition-all border-2 ${
                        formData.primary_sectors.includes(sector.id)
                          ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-[#0a1628]'
                          : 'border-[#e2e8f0] hover:border-[#f59e0b]'
                      }`}
                      data-testid={`sector-${sector.id}`}
                    >
                      {sector.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Secondary Sectors
                  <span className="text-[#64748b] font-normal ml-2">(Additional areas you can contribute to)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {options?.sectors?.map(sector => (
                    <button
                      key={sector.id}
                      type="button"
                      onClick={() => toggleArrayItem('secondary_sectors', sector.id)}
                      disabled={formData.primary_sectors.includes(sector.id)}
                      className={`p-3 rounded-xl text-left text-sm font-medium transition-all border-2 ${
                        formData.primary_sectors.includes(sector.id)
                          ? 'border-[#e2e8f0] bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed'
                          : formData.secondary_sectors.includes(sector.id)
                          ? 'border-[#2a9d8f] bg-[#2a9d8f]/10 text-[#0a1628]'
                          : 'border-[#e2e8f0] hover:border-[#2a9d8f]'
                      }`}
                    >
                      {sector.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-[#0a1628]">
                    Skills & Competencies
                  </label>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="flex items-center gap-1 text-[#f59e0b] text-sm font-medium hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Add Skill
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {options?.skills?.slice(0, 15).map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        if (!formData.skills.find(s => s.name === skill)) {
                          setFormData(prev => ({
                            ...prev,
                            skills: [...prev.skills, { name: skill, years_experience: 0, proficiency: 'intermediate' }]
                          }));
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        formData.skills.find(s => s.name === skill)
                          ? 'bg-[#f59e0b] text-white'
                          : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#f59e0b]/10'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                {formData.skills.map((skill, index) => (
                  <div key={index} className="bg-[#f8fafc] rounded-xl p-4 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-[#0a1628]">{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-[#64748b]">Years Experience</label>
                        <input
                          type="number"
                          value={skill.years_experience}
                          onChange={(e) => updateSkill(index, 'years_experience', e.target.value)}
                          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#64748b]">Proficiency</label>
                        <select
                          value={skill.proficiency}
                          onChange={(e) => updateSkill(index, 'proficiency', e.target.value)}
                          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm"
                        >
                          {options?.proficiency_levels?.map(level => (
                            <option key={level} value={level}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Geographic Experience */}
          {currentStep === 3 && (
            <motion.div
              key="geographic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Countries Where You Have Work Experience <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {options?.countries?.map(country => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => toggleArrayItem('countries_experience', country)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        formData.countries_experience.includes(country)
                          ? 'bg-[#f59e0b] text-white'
                          : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#f59e0b]/10'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">Regional Expertise</label>
                <div className="flex flex-wrap gap-2">
                  {options?.regions?.map(region => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => toggleArrayItem('regional_expertise', region)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.regional_expertise.includes(region)
                          ? 'bg-[#2a9d8f] text-white'
                          : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#2a9d8f]/10'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Availability & Rates */}
          {currentStep === 4 && (
            <motion.div
              key="availability"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Current Availability <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  {options?.availability_status?.map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateFormData('availability', status)}
                      className={`flex-1 p-4 rounded-xl text-center font-medium transition-all border-2 ${
                        formData.availability === status
                          ? 'border-[#f59e0b] bg-[#f59e0b]/10'
                          : 'border-[#e2e8f0] hover:border-[#f59e0b]'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">Available From</label>
                <input
                  type="date"
                  value={formData.availability_start_date}
                  onChange={(e) => updateFormData('availability_start_date', e.target.value)}
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Preferred Engagement Types <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {options?.engagement_types?.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleArrayItem('engagement_type', type.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.engagement_type.includes(type.id)
                          ? 'bg-[#f59e0b] text-white'
                          : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#f59e0b]/10'
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">Daily Rate (Min)</label>
                  <input
                    type="number"
                    value={formData.daily_rate_min}
                    onChange={(e) => updateFormData('daily_rate_min', e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                    placeholder="250"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">Daily Rate (Max)</label>
                  <input
                    type="number"
                    value={formData.daily_rate_max}
                    onChange={(e) => updateFormData('daily_rate_max', e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">Currency</label>
                  <select
                    value={formData.rate_currency}
                    onChange={(e) => updateFormData('rate_currency', e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="TZS">TZS</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="willing_to_travel"
                  checked={formData.willing_to_travel}
                  onChange={(e) => updateFormData('willing_to_travel', e.target.checked)}
                  className="w-5 h-5 rounded border-[#e2e8f0] text-[#f59e0b] focus:ring-[#f59e0b]"
                />
                <label htmlFor="willing_to_travel" className="text-[#0a1628]">
                  I am willing to travel for project assignments
                </label>
              </div>
            </motion.div>
          )}

          {/* Step 5: Portfolio & References */}
          {currentStep === 5 && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => updateFormData('linkedin_url', e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">CV/Resume URL</label>
                  <input
                    type="url"
                    value={formData.cv_url}
                    onChange={(e) => updateFormData('cv_url', e.target.value)}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">Portfolio/Website URL</label>
                <input
                  type="url"
                  value={formData.portfolio_url}
                  onChange={(e) => updateFormData('portfolio_url', e.target.value)}
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Notable Projects
                  <span className="text-[#64748b] font-normal ml-2">(Brief descriptions, one per line)</span>
                </label>
                <textarea
                  value={formData.notable_projects.join('\n')}
                  onChange={(e) => updateFormData('notable_projects', e.target.value.split('\n').filter(p => p.trim()))}
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                  placeholder="World Bank Agricultural Survey in Tanzania (2023)&#10;USAID Education Impact Evaluation (2022)"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Publications
                  <span className="text-[#64748b] font-normal ml-2">(One per line)</span>
                </label>
                <textarea
                  value={formData.publications.join('\n')}
                  onChange={(e) => updateFormData('publications', e.target.value.split('\n').filter(p => p.trim()))}
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                  placeholder="Publication title and link"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Professional References
                  <span className="text-[#64748b] font-normal ml-2">(Name, Organization, Email - one per line)</span>
                </label>
                <textarea
                  value={formData.references.join('\n')}
                  onChange={(e) => updateFormData('references', e.target.value.split('\n').filter(r => r.trim()))}
                  className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent"
                  placeholder="Dr. Jane Smith, World Bank, jane.smith@worldbank.org"
                  rows={3}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-[#e2e8f0]">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? 'text-[#94a3b8] cursor-not-allowed'
                : 'text-[#0a1628] hover:bg-[#f8fafc]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!validateStep()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                validateStep()
                  ? 'bg-[#f59e0b] text-white hover:bg-[#d97706]'
                  : 'bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed'
              }`}
              data-testid="next-step-btn"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 bg-[#f59e0b] text-white rounded-lg font-semibold hover:bg-[#d97706] transition-all disabled:opacity-50"
              data-testid="submit-btn"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Registration
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertRegistrationForm;
