import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Calendar, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  FileText, 
  Shield, 
  Search, 
  DollarSign, 
  ArrowLeft,
  X,
  Sparkles,
  Users,
  Target
} from 'lucide-react';
import { careersService } from '../services/careersService';

export default function TrainerCareersPage() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modals
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [applyVacancy, setApplyVacancy] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Application Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentLocation: '',
    desiredPosition: '',
    experienceYears: 1,
    specialization: '',
    educationalQualifications: '',
    fitnessCertifications: '',
    previousExperience: '',
    professionalSummary: '',
    availabilityDate: '',
    portfolioUrl: '',
    consentGiven: true
  });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    loadVacancies();
  }, []);

  const loadVacancies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await careersService.getOpenVacancies();
      setVacancies(data || []);
    } catch (err) {
      setError('Unable to load open career opportunities. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApply = (vacancy) => {
    setSelectedVacancy(null);
    setApplyVacancy(vacancy);
    setSubmitError('');
    setSubmissionSuccess(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      currentLocation: '',
      desiredPosition: vacancy.title,
      experienceYears: vacancy.minExperience || 1,
      specialization: vacancy.specialization || '',
      educationalQualifications: '',
      fitnessCertifications: '',
      previousExperience: '',
      professionalSummary: '',
      availabilityDate: vacancy.expectedJoiningDate || '',
      portfolioUrl: '',
      consentGiven: true
    });
    setResumeFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['pdf', 'doc', 'docx'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      alert('Only PDF, DOC, or DOCX files are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }
    setResumeFile(file);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      setSubmitError('You must provide consent for data processing to submit your application.');
      return;
    }
    if (!applyVacancy) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      if (formData.currentLocation) data.append('currentLocation', formData.currentLocation);
      if (formData.desiredPosition) data.append('desiredPosition', formData.desiredPosition);
      if (formData.experienceYears) data.append('experienceYears', formData.experienceYears);
      if (formData.specialization) data.append('specialization', formData.specialization);
      if (formData.educationalQualifications) data.append('educationalQualifications', formData.educationalQualifications);
      if (formData.fitnessCertifications) data.append('fitnessCertifications', formData.fitnessCertifications);
      if (formData.previousExperience) data.append('previousExperience', formData.previousExperience);
      if (formData.professionalSummary) data.append('professionalSummary', formData.professionalSummary);
      if (formData.availabilityDate) data.append('availabilityDate', formData.availabilityDate);
      if (formData.portfolioUrl) data.append('portfolioUrl', formData.portfolioUrl);
      data.append('consentGiven', formData.consentGiven ? 'true' : 'false');
      if (resumeFile) {
        data.append('resume', resumeFile);
      }

      const res = await careersService.submitApplication(applyVacancy.id, data);
      setSubmissionSuccess(res);
      setApplyVacancy(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Application submission failed. Please verify your details.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVacancies = vacancies.filter(v => {
    const matchesSearch = !searchQuery || 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.department && v.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.specialization && v.specialization.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === 'ALL' || v.employmentType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-200 font-sans selection:bg-[#ef233c] selection:text-white flex flex-col">
      
      {/* ── Navbar ────────────────────────────────────────────── */}
      <header className="bg-[#14151b] border-b border-white/10 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ef233c] to-[#d90429] flex items-center justify-center shadow-lg shadow-[#ef233c]/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-white">FIT<span className="text-[#ef233c]">FLOW</span></span>
              <span className="text-[10px] block font-bold text-gray-400 uppercase tracking-widest -mt-1">Careers & Coaching</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/trainers" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              Current Trainers
            </Link>
            <Link to="/login" className="px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-xs font-bold uppercase tracking-widest text-white transition-colors">
              Member Login
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ──────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#14151b] via-[#0b0c10] to-[#0b0c10] pt-16 pb-20 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ef233c]/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ef233c]/10 border border-[#ef233c]/30 text-[#ef233c] text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Elite Gym Coaching Opportunities
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-none">
            Build Your Coaching Legacy <br />
            <span className="bg-gradient-to-r from-white via-gray-200 to-[#ef233c] bg-clip-text text-transparent">
              At FitFlow Gym
            </span>
          </h1>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Join a cutting-edge fitness ecosystem combining elite training equipment, sports science, and premium memberships. We empower coaches to do their life’s best work.
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-[#14151b]/80 border border-white/5 rounded-2xl p-4">
              <span className="text-2xl font-black text-white">State-of-the-Art</span>
              <p className="text-xs text-gray-400 mt-1">Olympic lifting, turf, recovery</p>
            </div>
            <div className="bg-[#14151b]/80 border border-white/5 rounded-2xl p-4">
              <span className="text-2xl font-black text-emerald-400">Competitive</span>
              <p className="text-xs text-gray-400 mt-1">Attractive compensation plans</p>
            </div>
            <div className="bg-[#14151b]/80 border border-white/5 rounded-2xl p-4">
              <span className="text-2xl font-black text-blue-400">Structured</span>
              <p className="text-xs text-gray-400 mt-1">Predictable shift schedules</p>
            </div>
            <div className="bg-[#14151b]/80 border border-white/5 rounded-2xl p-4">
              <span className="text-2xl font-black text-[#ef233c]">Growth</span>
              <p className="text-xs text-gray-400 mt-1">Certifications & mentoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Opportunities List ──────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#14151b] border border-white/10 rounded-2xl p-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by title, department, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b0c10] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ef233c] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['ALL', 'FULL_TIME', 'PART_TIME', 'CONTRACT'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  typeFilter === type 
                    ? 'bg-[#ef233c] text-white shadow-lg shadow-[#ef233c]/20'
                    : 'bg-[#181920] text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Vacancies Display */}
        {loading ? (
          <div className="text-center py-24">
            <div className="w-10 h-10 border-2 border-[#ef233c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Loading open vacancies...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-md mx-auto">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-sm text-gray-200 font-bold">{error}</p>
            <button 
              onClick={loadVacancies}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredVacancies.length === 0 ? (
          <div className="bg-[#14151b] border border-white/5 rounded-3xl p-16 text-center max-w-lg mx-auto">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">No Open Vacancies Match</h3>
            <p className="text-xs text-gray-400 mt-2">
              There are currently no open positions matching your search criteria. Check back soon or explore our general membership programs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVacancies.map((vacancy) => (
              <div 
                key={vacancy.id}
                className="bg-[#14151b] border border-white/10 hover:border-[#ef233c]/40 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#ef233c]/15 text-[#ef233c] border border-[#ef233c]/30 uppercase tracking-widest">
                      {vacancy.employmentType?.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {vacancy.remainingPositions} {vacancy.remainingPositions === 1 ? 'Position' : 'Positions'} Open
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-[#ef233c] transition-colors leading-snug">
                    {vacancy.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    {vacancy.department || 'Training Operations'}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 my-4 pt-4 border-t border-white/5 text-xs text-gray-300">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-gray-500" />
                      <span>{vacancy.location || 'FitFlow Central Gym'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Award className="w-3.5 h-3.5 text-gray-500" />
                      <span>Min. {vacancy.minExperience} years coaching experience</span>
                    </div>
                    {vacancy.salaryRange && (
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{vacancy.salaryRange}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <span>Apply by: <strong className="text-white">{vacancy.deadlineDate}</strong></span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {vacancy.jobDescription}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedVacancy(vacancy)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-xs font-bold uppercase tracking-wider text-gray-200 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleOpenApply(vacancy)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#ef233c] hover:bg-[#d90429] text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#ef233c]/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Apply Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Modal: View Vacancy Details ──────────────────────── */}
      {selectedVacancy && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#14151b] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setSelectedVacancy(null)}
              className="absolute right-5 top-5 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ef233c]/15 text-[#ef233c] border border-[#ef233c]/30 uppercase tracking-widest">
                {selectedVacancy.employmentType?.replace('_', ' ')}
              </span>
              <h2 className="text-2xl font-black text-white mt-2 uppercase tracking-wide">
                {selectedVacancy.title}
              </h2>
              <p className="text-xs text-gray-400 font-bold mt-1">
                {selectedVacancy.department} • {selectedVacancy.location}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#181920] p-4 rounded-2xl border border-white/5 text-xs">
              <div>
                <span className="text-gray-500 block">Positions</span>
                <strong className="text-white font-bold">{selectedVacancy.remainingPositions} Available</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Experience</span>
                <strong className="text-white font-bold">{selectedVacancy.minExperience}+ Years</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Shift</span>
                <strong className="text-white font-bold truncate block">{selectedVacancy.workingDaysShift || 'General Shift'}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Deadline</span>
                <strong className="text-[#ef233c] font-bold">{selectedVacancy.deadlineDate}</strong>
              </div>
            </div>

            {selectedVacancy.salaryRange && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs flex items-center justify-between">
                <span className="text-emerald-400 font-bold">Estimated Compensation:</span>
                <span className="text-white font-black">{selectedVacancy.salaryRange}</span>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">Role Overview & Responsibilities</h4>
              <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line bg-[#0b0c10] p-4 rounded-xl border border-white/5">
                {selectedVacancy.jobDescription}
              </p>
            </div>

            {selectedVacancy.requiredQualifications && (
              <div>
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">Required Certifications & Qualifications</h4>
                <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line bg-[#0b0c10] p-4 rounded-xl border border-white/5">
                  {selectedVacancy.requiredQualifications}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedVacancy(null)}
                className="px-5 py-2.5 rounded-full border border-white/10 hover:border-white/30 text-xs font-bold uppercase tracking-wider text-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => handleOpenApply(selectedVacancy)}
                className="px-6 py-2.5 rounded-full bg-[#ef233c] hover:bg-[#d90429] text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#ef233c]/30"
              >
                Apply for this Position
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Application Submission Form ────────────────── */}
      {applyVacancy && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#14151b] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setApplyVacancy(null)}
              className="absolute right-5 top-5 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#ef233c]/20 text-[#ef233c] uppercase tracking-widest">
                Career Application
              </span>
              <h2 className="text-2xl font-black text-white mt-2 uppercase tracking-wide">
                Apply: {applyVacancy.title}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Please complete the form below. All fields marked with * are required.
              </p>
            </div>

            {submitError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Email ID *</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="e.g. rahul@example.com"
                    className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Current Location</label>
                  <input 
                    type="text" 
                    value={formData.currentLocation}
                    onChange={(e) => setFormData({...formData, currentLocation: e.target.value})}
                    placeholder="e.g. Bangalore, Karnataka"
                    className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Years of Coaching Experience</label>
                  <input 
                    type="number" 
                    min="0"
                    max="40"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Coaching Specialization</label>
                  <input 
                    type="text" 
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    placeholder="e.g. Strength, Weight Loss, Mobility"
                    className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Fitness Certifications & Licenses</label>
                <input 
                  type="text" 
                  value={formData.fitnessCertifications}
                  onChange={(e) => setFormData({...formData, fitnessCertifications: e.target.value})}
                  placeholder="e.g. ACE-CPT, CSCS, RYT-200, CPR/AED"
                  className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Educational Background</label>
                <input 
                  type="text" 
                  value={formData.educationalQualifications}
                  onChange={(e) => setFormData({...formData, educationalQualifications: e.target.value})}
                  placeholder="e.g. B.Sc Physical Education, Kinesiology"
                  className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Previous Work Experience</label>
                <textarea 
                  rows="2"
                  value={formData.previousExperience}
                  onChange={(e) => setFormData({...formData, previousExperience: e.target.value})}
                  placeholder="Summarize gym or private coaching roles, client achievements, or club positions..."
                  className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Professional Coaching Statement</label>
                <textarea 
                  rows="2"
                  value={formData.professionalSummary}
                  onChange={(e) => setFormData({...formData, professionalSummary: e.target.value})}
                  placeholder="Why do you want to coach at FitFlow? Describe your training philosophy..."
                  className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Earliest Available Joining Date</label>
                  <input 
                    type="date" 
                    value={formData.availabilityDate}
                    onChange={(e) => setFormData({...formData, availabilityDate: e.target.value})}
                    className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Online Portfolio / Instagram / LinkedIn</label>
                  <input 
                    type="url" 
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ef233c]"
                  />
                </div>
              </div>

              {/* Resume File Upload */}
              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Resume / CV (PDF, DOC, DOCX up to 10MB)</label>
                <div className="relative border-2 border-dashed border-white/10 hover:border-[#ef233c]/50 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-[#0b0c10]">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  {resumeFile ? (
                    <div className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)</span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Click to choose or drag & drop your resume file here
                    </p>
                  )}
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="consent"
                  checked={formData.consentGiven}
                  onChange={(e) => setFormData({...formData, consentGiven: e.target.checked})}
                  className="mt-0.5 rounded bg-[#0b0c10] border-white/20 text-[#ef233c] focus:ring-0"
                />
                <label htmlFor="consent" className="text-[11px] text-gray-400 leading-tight">
                  I consent to FitFlow collecting and processing my application credentials for recruitment evaluations.
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setApplyVacancy(null)}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-full border border-white/10 hover:border-white/30 text-xs font-bold uppercase tracking-wider text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-2.5 rounded-full bg-[#ef233c] hover:bg-[#d90429] text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#ef233c]/30 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Submission Success Confirmation ────────────── */}
      {submissionSuccess && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14151b] border border-white/15 rounded-3xl max-w-md w-full p-8 text-center space-y-5 shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">Application Submitted!</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Thank you for applying for <strong className="text-white">{submissionSuccess.vacancyTitle}</strong>. Your candidate file has been recorded.
              </p>
            </div>

            <div className="bg-[#181920] border border-white/10 rounded-2xl p-4 text-xs">
              <span className="text-gray-400 block mb-1">Your Application Reference Number</span>
              <span className="text-lg font-mono font-black text-[#ef233c] tracking-widest">
                {submissionSuccess.referenceNumber}
              </span>
              <p className="text-[10px] text-gray-500 mt-2">
                Initial Status: <strong className="text-yellow-400">{submissionSuccess.status}</strong>. Please preserve this reference code for future communications.
              </p>
            </div>

            <button
              onClick={() => setSubmissionSuccess(null)}
              className="w-full py-3 rounded-full bg-[#ef233c] hover:bg-[#d90429] text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-[#ef233c]/30"
            >
              Done & Return to Opportunities
            </button>
          </div>
        </div>
      )}

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-[#14151b] border-t border-white/5 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} FitFlow Gym Management System • Recruitment & Staff Operations.</p>
        </div>
      </footer>
    </div>
  );
}
