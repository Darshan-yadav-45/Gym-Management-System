import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { coachService } from '../services/coachService';
import { trainerService } from '../services/trainerService';
import { authService } from '../services/authService';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  UserCheck, 
  Flame, 
  Zap, 
  Award, 
  Filter, 
  Check, 
  ArrowRight, 
  Crown, 
  Dumbbell, 
  HeartHandshake, 
  Users,
  Compass,
  AlertCircle
} from 'lucide-react';

export default function Trainers() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' | 'human'
  const [coaches, setCoaches] = useState([]);
  const [humanTrainers, setHumanTrainers] = useState([]);
  const [myCoach, setMyCoach] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Filters
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumModalCoach, setPremiumModalCoach] = useState(null);

  const categories = [
    { key: 'ALL', label: 'All Disciplines' },
    { key: 'WEIGHT_LOSS', label: 'Weight Loss & Fat Burn' },
    { key: 'WEIGHT_GAIN', label: 'Weight Gain & Muscle' },
    { key: 'STRENGTH_TRAINING', label: 'Strength & Power' },
    { key: 'YOGA_FLEXIBILITY', label: 'Yoga & Flexibility' },
    { key: 'SPORTS_CONDITIONING', label: 'Sports Conditioning' },
    { key: 'RECOVERY_STRETCHING', label: 'Recovery & Mobility' },
    { key: 'HOME_WORKOUTS', label: 'Home & Bodyweight' },
    { key: 'CARDIO_ENDURANCE', label: 'Cardio & VO2 Max' },
    { key: 'GENERAL_FITNESS', label: 'General Fitness' }
  ];

  const defaultHumanTrainers = [
    { 
      id: 1, 
      name: 'ARJUN SHARMA', 
      specialization: 'Strength, Muscle Building, Heavy Barbell Technique', 
      experienceYears: 8, 
      profileImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500',
      tags: ['Strength', 'Muscle Building', 'Bodybuilding'],
      bio: 'Former national powerlifter specializing in joint-friendly hypertrophy and peak strength periodization.'
    },
    { 
      id: 2, 
      name: 'PRIYA MENON', 
      specialization: 'Weight Loss, Metabolic Conditioning, Sports Nutrition', 
      experienceYears: 6, 
      profileImageUrl: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=500',
      tags: ['Fat Loss', 'HIIT', 'Nutrition'],
      bio: 'Certified strength and conditioning coach focused on metabolic conditioning and holistic female athletic development.'
    },
    { 
      id: 3, 
      name: 'RAHUL KUMAR', 
      specialization: 'Sports Performance, Plyometrics, Agility & Speed', 
      experienceYears: 7, 
      profileImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500',
      tags: ['Sports', 'Agility', 'Conditioning'],
      bio: 'Prepares collegiate athletes and competitive fighters with sport-specific power and sprint acceleration.'
    }
  ];

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load AI Coaches
        const aiData = await coachService.getAllCoaches();
        setCoaches(aiData || []);

        // Load Human Trainers
        try {
          const humanData = await trainerService.getAllTrainers();
          if (humanData && humanData.length > 0) {
            setHumanTrainers(humanData);
          } else {
            setHumanTrainers(defaultHumanTrainers);
          }
        } catch {
          setHumanTrainers(defaultHumanTrainers);
        }

        // If authenticated, get user's selected coach and subscription
        if (user) {
          try {
            const activeCoach = await coachService.getMyCoach();
            setMyCoach(activeCoach);
          } catch (err) {
            console.warn("No active coach preference yet", err);
          }

          try {
            const sub = await coachService.getMySubscription();
            setSubscription(sub);
          } catch (err) {
            console.warn("Could not fetch subscription", err);
          }
        }
      } catch (error) {
        console.error("Failed to load coaches/trainers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectCoach = async (coach) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (coach.tier === 'PREMIUM' && !subscription?.isPremiumActive) {
      setPremiumModalCoach(coach);
      setShowPremiumModal(true);
      return;
    }

    setIsSelecting(coach.id);
    try {
      const selected = await coachService.selectCoach(coach.id);
      setMyCoach(selected);
      // Update coaches list selected flag
      setCoaches(prev => prev.map(c => ({
        ...c,
        selected: c.id === coach.id
      })));
      showToast(`Coach ${coach.displayName} is now your active AI coach!`);
    } catch (err) {
      console.error("Failed to select coach", err);
      const errMsg = err.response?.data?.message || "Failed to set coach preference.";
      showToast(errMsg);
    } finally {
      setIsSelecting(null);
    }
  };

  // Filter AI Coaches
  const filteredCoaches = coaches.filter(c => {
    // Gender filter
    if (selectedGender !== 'ALL' && c.gender?.toUpperCase() !== selectedGender) {
      return false;
    }
    // Tier filter
    if (selectedTier !== 'ALL' && c.tier?.toUpperCase() !== selectedTier) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'ALL') {
      const matchesPrimary = c.primaryCategory === selectedCategory;
      const matchesSupported = c.supportedCategories?.includes(selectedCategory);
      if (!matchesPrimary && !matchesSupported) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-200 font-sans selection:bg-[#ef233c] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#ef233c] text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center text-2xl sm:text-3xl font-black font-display tracking-[0.15em] text-white">
            FIT<span className="text-[#ef233c] font-black italic">FLOW</span>
          </Link>
          <div className="hidden md:flex gap-9 text-xs font-bold tracking-widest uppercase text-gray-300">
            <Link to="/" className="hover:text-[#ef233c] transition-colors">Home</Link>
            <Link to="/dashboard/routines" className="hover:text-[#ef233c] transition-colors">Dashboard</Link>
            <Link to="/dashboard/exercises" className="hover:text-[#ef233c] transition-colors">Exercises</Link>
            <Link to="/dashboard/workout" className="hover:text-[#ef233c] transition-colors">Workout</Link>
            <Link to="/trainers" className="text-[#ef233c] transition-colors">Coaches & Trainers</Link>
          </div>
          <div className="flex items-center gap-3">
            {currentUser ? (
              <Link 
                to="/dashboard/workout" 
                className="bg-[#ef233c] hover:bg-[#d90429] text-white px-5 py-2 rounded-full font-bold uppercase tracking-wider text-xs transition-all shadow-[0_4px_16px_rgba(239,35,60,0.35)] flex items-center gap-1.5"
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Go to Workout</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="bg-[#ef233c] hover:bg-[#d90429] text-white px-6 py-2.5 rounded font-bold uppercase tracking-widest text-xs transition-all shadow-[0_4px_16px_rgba(239,35,60,0.35)]"
              >
                JOIN NOW
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Full Background Image */}
      <section className="relative pt-16 pb-16 overflow-hidden border-b border-white/5">
        {/* Full Section Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop')" 
          }}
        ></div>

        {/* Ambient gradients for high text contrast while letting the gym background shine through */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/90 to-[#0b0c10]/35"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-[#0b0c10]/80"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ef233c]/10 border border-[#ef233c]/30 text-[#ef233c] text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Adaptive Intelligence & Elite Coaching</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display uppercase tracking-tight leading-[0.95] mb-6 text-white">
              SELECT YOUR<br/>
              <span className="text-[#ef233c]">FITFLOW COACH.</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl mb-6 leading-relaxed">
              Choose from 14 specialized AI Coaches (Male & Female, Free & Premium) engineered for weight loss, hypertrophy, powerlifting, yoga, and athletic conditioning. Your selected coach guides your daily workouts with tailored cues and motivation.
            </p>

            {/* Feature Highlights Pills */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" /> Real-time Biomechanics
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                <Zap className="w-3.5 h-3.5" /> 24/7 Availability
              </span>
            </div>

            {/* Currently Active Coach Banner */}
            {myCoach ? (
              <div className="p-4 rounded-2xl bg-[#14151b]/90 backdrop-blur-md border border-emerald-500/30 flex items-center justify-between gap-4 max-w-lg mb-6 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <div className="flex items-center gap-3">
                  <img 
                    src={myCoach.avatarUrl} 
                    alt={myCoach.displayName} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-black uppercase text-sm tracking-wide">{myCoach.displayName}</span>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        ACTIVE COACH
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">{myCoach.specialization}</p>
                  </div>
                </div>
                <Link 
                  to="/dashboard/workout"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <span>Train</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : currentUser ? (
              <div className="p-4 rounded-2xl bg-[#14151b]/90 backdrop-blur-md border border-[#ef233c]/30 flex items-center gap-3 max-w-lg mb-6">
                <AlertCircle className="w-5 h-5 text-[#ef233c] shrink-0" />
                <p className="text-xs text-gray-300">
                  You haven't selected a coach yet. Choose an AI Coach below to personalize your workout cueing and daily goals!
                </p>
              </div>
            ) : null}

            {/* Mode Tabs: AI Coaches vs Human Trainers */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('ai')}
                className={`px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-all ${
                  activeTab === 'ai'
                    ? 'bg-[#ef233c] text-white shadow-[0_4px_20px_rgba(239,35,60,0.4)]'
                    : 'bg-[#181920] border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>AI Coaches ({coaches.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('human')}
                className={`px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-all ${
                  activeTab === 'human'
                    ? 'bg-[#ef233c] text-white shadow-[0_4px_20px_rgba(239,35,60,0.4)]'
                    : 'bg-[#181920] border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Certified Personal Trainers</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="px-4 sm:px-8 py-12 border-t border-white/5 bg-[#121318]">
        <div className="max-w-7xl mx-auto">

          {/* AI COACHES VIEW */}
          {activeTab === 'ai' && (
            <div>
              {/* Filter Controls Bar */}
              <div className="bg-[#14151b] border border-white/10 rounded-2xl p-6 mb-10 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ef233c]">
                    <Filter className="w-4 h-4" />
                    <span>Filter AI Coaches</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Showing <strong className="text-white">{filteredCoaches.length}</strong> of {coaches.length} coaches
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Gender Filter */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Coach Gender
                    </label>
                    <div className="flex rounded-xl bg-[#181920] p-1 border border-white/5">
                      {['ALL', 'MALE', 'FEMALE'].map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setSelectedGender(g)}
                          className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${
                            selectedGender === g 
                              ? 'bg-[#ef233c] text-white shadow-sm' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {g === 'ALL' ? 'All' : g === 'MALE' ? 'Male' : 'Female'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Access Tier Filter */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Access Tier
                    </label>
                    <div className="flex rounded-xl bg-[#181920] p-1 border border-white/5">
                      {['ALL', 'FREE', 'PREMIUM'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTier(t)}
                          className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${
                            selectedTier === t 
                              ? 'bg-[#ef233c] text-white shadow-sm' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {t === 'ALL' ? 'All' : t === 'FREE' ? 'Free (8)' : 'Pro (6)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Fitness Goal & Discipline
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#ef233c]"
                    >
                      {categories.map(c => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Coaches Grid */}
              {isLoading ? (
                <div className="text-center py-20 text-[#ef233c] font-bold tracking-widest uppercase animate-pulse">
                  Loading AI Coaches...
                </div>
              ) : filteredCoaches.length === 0 ? (
                <div className="text-center py-16 bg-[#14151b] rounded-2xl border border-white/5 p-8">
                  <Bot className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-white font-bold text-sm uppercase">No AI coaches match the selected filters.</p>
                  <button 
                    onClick={() => { setSelectedGender('ALL'); setSelectedTier('ALL'); setSelectedCategory('ALL'); }}
                    className="mt-4 text-xs font-bold text-[#ef233c] hover:underline uppercase"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filteredCoaches.map((coach) => {
                    const isCurrent = myCoach?.id === coach.id || coach.selected;
                    const isPremium = coach.tier === 'PREMIUM';

                    return (
                      <div 
                        key={coach.id}
                        className={`bg-[#14151b] rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden relative group hover:-translate-y-1 ${
                          isCurrent
                            ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.25)]'
                            : isPremium
                            ? 'border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                            : 'border-white/10 hover:border-[#ef233c]/60 hover:shadow-[0_0_20px_rgba(239,35,60,0.15)]'
                        }`}
                      >
                        {/* Coach Avatar Header */}
                        <div className="h-60 w-full overflow-hidden relative bg-[#181920]">
                          <img 
                            src={coach.avatarUrl} 
                            alt={coach.displayName} 
                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#14151b] via-[#14151b]/40 to-transparent"></div>

                          {/* Tier Badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-2">
                            {isPremium ? (
                              <span className="bg-amber-950/90 border border-amber-400/80 text-amber-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg backdrop-blur-md">
                                <Crown className="w-3.5 h-3.5 text-amber-400" /> PRO COACH
                              </span>
                            ) : (
                              <span className="bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg backdrop-blur-md">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> FREE ACCESS
                              </span>
                            )}
                            <span className="bg-black/75 border border-white/10 text-gray-300 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                              {coach.gender}
                            </span>
                          </div>

                          {/* Active Badge */}
                          {isCurrent && (
                            <div className="absolute top-3 right-3 bg-emerald-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xl">
                              <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE COACH
                            </div>
                          )}

                          {/* Coach Name Overlay */}
                          <div className="absolute bottom-3 left-4 right-4">
                            <h3 className="text-2xl font-black font-display uppercase tracking-wide text-white flex items-center gap-2">
                              {coach.displayName}
                              {isPremium && <Sparkles className="w-4 h-4 text-amber-400" />}
                            </h3>
                            <p className="text-xs font-bold text-[#ef233c] uppercase tracking-wider">
                              {coach.specialization}
                            </p>
                          </div>
                        </div>

                        {/* Coach Details Body */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-4">
                            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                              {coach.description}
                            </p>

                            {/* Coaching Style Box */}
                            <div className="bg-[#181920] border border-white/5 rounded-xl p-3">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                                Coaching Philosophy:
                              </span>
                              <p className="text-xs text-gray-300 italic">
                                "{coach.coachingStyle}"
                              </p>
                            </div>

                            {/* Supported Disciplines */}
                            <div className="flex flex-wrap gap-1.5">
                              {coach.supportedCategories?.map(cat => (
                                <span 
                                  key={cat} 
                                  className="text-[10px] uppercase font-bold tracking-wider bg-[#101116] px-2.5 py-1 rounded-md text-gray-400 border border-white/5"
                                >
                                  {cat.replace(/_/g, ' ')}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Selection Button */}
                          <div className="pt-6 border-t border-white/5 mt-4">
                            {isCurrent ? (
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                  <UserCheck className="w-4 h-4" /> Currently Coaching You
                                </span>
                                <Link 
                                  to="/dashboard/workout"
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                                >
                                  <span>Start Session</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={isSelecting === coach.id}
                                onClick={() => handleSelectCoach(coach)}
                                className={`w-full py-3 px-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 ${
                                  isPremium
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-[0_4px_16px_rgba(245,158,11,0.3)]'
                                    : 'bg-[#ef233c] hover:bg-[#d90429] text-white shadow-[0_4px_16px_rgba(239,35,60,0.35)]'
                                }`}
                              >
                                {isSelecting === coach.id ? (
                                  <span>Setting Coach...</span>
                                ) : isPremium ? (
                                  <>
                                    <Crown className="w-4 h-4" />
                                    <span>Select {coach.displayName} (Pro)</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-4 h-4" />
                                    <span>Select {coach.displayName}</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* HUMAN TRAINERS VIEW */}
          {activeTab === 'human' && (
            <div>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-wide text-white mb-2">
                  Certified In-Gym Personal Coaches
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Book 1-on-1 private training sessions at our flagship facilities for hands-on barbell technique, biomechanical assessment, and competition prep.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {humanTrainers.map((trainer) => (
                  <div 
                    key={trainer.id}
                    className="bg-[#14151b] border border-white/5 rounded-2xl overflow-hidden hover:border-[#ef233c]/50 transition-all duration-300 flex flex-col group hover:-translate-y-1"
                  >
                    <div className="h-64 w-full overflow-hidden relative bg-[#181920]">
                      <img 
                        src={trainer.profileImageUrl} 
                        alt={trainer.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#14151b] to-transparent"></div>
                      <div className="absolute top-3 left-3 bg-black/80 border border-white/10 text-gray-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                        Master Personal Coach
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-black font-display uppercase tracking-wide text-white mb-1">
                          {trainer.name}
                        </h3>
                        <p className="text-xs font-bold text-[#ef233c] uppercase tracking-wider mb-3">
                          {trainer.specialization?.split(',')[0]}
                        </p>
                        <p className="text-gray-400 text-xs leading-relaxed mb-4">
                          {trainer.bio || 'Specialized in individualized athletic periodization and progressive overload.'}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {(trainer.tags || trainer.specialization?.split(',')).slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] uppercase font-bold tracking-wider bg-[#181920] px-2.5 py-1 rounded text-gray-400 border border-white/5">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link 
                        to={`/trainers/${trainer.id}`}
                        className="w-full py-3 px-4 rounded-xl font-bold uppercase text-xs tracking-wider border border-white/20 hover:border-[#ef233c] text-white hover:text-[#ef233c] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>View Trainer Profile & Schedule</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Methodology Section */}
      <div className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-2">
            The FitFlow Training System
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white">
            BIOMECHANICAL INTELLIGENCE. REAL RESULTS.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '01', title: 'FORM VERIFICATION', desc: 'Real-time biomechanical analysis compares your joint angles against golden-standard human movement patterns.' },
            { num: '02', title: 'ADAPTIVE VOLUME', desc: 'Weekly sets and reps dynamically increase or deload depending on reported fatigue and completion rate.' },
            { num: '03', title: 'CONTINUOUS CUES', desc: 'Your chosen coach delivers precise breathing tempos and posture reminders during every active workout.' },
            { num: '04', title: 'POSTGRES METRICS', desc: 'Every workout session, rep count, and calorie burn is securely logged to your permanent fitness profile.' }
          ].map(item => (
            <div key={item.num} className="bg-[#14151b] border border-white/5 rounded-2xl p-6 hover:border-[#ef233c]/40 transition-colors">
              <span className="text-[#ef233c] font-black text-2xl font-display block mb-2">{item.num}</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Upgrade Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14151b] border border-amber-500/50 rounded-3xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black font-display uppercase tracking-wide text-white mb-1">
              PRO COACH ACCESS REQUIRED
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              Coach <strong className="text-amber-400">{premiumModalCoach?.displayName}</strong> provides elite-tier training programming ({premiumModalCoach?.specialization}). Pro coaches are available exclusively on the FitFlow Pro Subscription.
            </p>

            <div className="bg-[#181920] border border-white/5 rounded-xl p-4 mb-6 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <span>Current Status:</span>
                <span className="font-bold text-gray-400">
                  {subscription?.status || 'FREE TIER'}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>Free AI Coaches:</span>
                <span className="font-bold text-emerald-400">8 Coaches Available</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>Pro AI Coaches:</span>
                <span className="font-bold text-amber-400">6 Specialized Coaches</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-3 bg-[#181920] hover:bg-white/10 text-gray-300 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors"
              >
                Close
              </button>
              <Link
                to="/dashboard/account"
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-center rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-[0_4px_16px_rgba(245,158,11,0.3)]"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0b0c10] py-12 px-4 sm:px-8 text-center text-xs text-gray-500 uppercase tracking-widest">
        FitFlow Athletic Performance &copy; 2026. All rights reserved.
      </footer>
    </div>
  );
}
