import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  ChevronRight, 
  Bot, 
  Sparkles, 
  User, 
  BarChart3, 
  Dumbbell, 
  Gauge, 
  Award, 
  Check, 
  Star, 
  Menu, 
  X,
  Zap,
  Activity,
  Target,
  Flame,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle,
  Play
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

// Brand Social SVGs
const TwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2v3.98h2v8.01z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [trainerTab, setTrainerTab] = useState('all');
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | null

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 8 Specific Program Cards as requested
  const programs = [
    {
      id: "muscle-building",
      title: "Muscle Building",
      category: "Hypertrophy",
      duration: "12 Weeks",
      schedule: "4-5 Days/Wk",
      desc: "Mechanical tension, metabolic fatigue, and high-yield volume to maximize muscular growth and symmetry.",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
      tags: ["Hypertrophy", "Dumbbells", "Barbell"]
    },
    {
      id: "weight-gain",
      title: "Weight Gain",
      category: "Mass Protocol",
      duration: "10 Weeks",
      schedule: "4 Days/Wk",
      desc: "Heavy compound overload paired with structured volume to pack on dense athletic mass safely.",
      image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop",
      tags: ["Compound Lifts", "Mass", "Power"]
    },
    {
      id: "weight-loss",
      title: "Weight Loss",
      category: "Fat Shred",
      duration: "8 Weeks",
      schedule: "4-5 Days/Wk",
      desc: "High-density metabolic conditioning circuits that burn calories while protecting lean muscle mass.",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop",
      tags: ["HIIT", "Metabolic", "Calorie Burn"]
    },
    {
      id: "strength-training",
      title: "Strength Training",
      category: "Powerlifting",
      duration: "12 Weeks",
      schedule: "3-4 Days/Wk",
      desc: "Periodized progression for the squat, bench press, and deadlift to shatter personal strength records.",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
      tags: ["Powerlifting", "Heavy Barbell", "PRs"]
    },
    {
      id: "yoga-flexibility",
      title: "Yoga and Flexibility",
      category: "Mobility & Flow",
      duration: "Ongoing",
      schedule: "Daily Sessions",
      desc: "Full-body kinetic chain decompression, restorative breathwork, and deep joint mobility protocols.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
      tags: ["Mobility", "Fascia", "Recovery"]
    },
    {
      id: "sports-conditioning",
      title: "Sports Conditioning",
      category: "Athletic Performance",
      duration: "10 Weeks",
      schedule: "4 Days/Wk",
      desc: "Rotational power, kinetic agility, reactive plyometrics, and multidirectional sprint acceleration.",
      image: "https://images.unsplash.com/photo-1526506114642-54a0fc0c213c?q=80&w=800&auto=format&fit=crop",
      tags: ["Agility", "Plyometrics", "Speed"]
    },
    {
      id: "home-workouts",
      title: "Home Workouts",
      category: "Zero Equipment",
      duration: "6 Weeks",
      schedule: "3-5 Days/Wk",
      desc: "100% equipment-free calisthenics, core stability routines, and bodyweight progressions anywhere.",
      image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800&auto=format&fit=crop",
      tags: ["Calisthenics", "Core", "No Gear"]
    },
    {
      id: "cardio-endurance",
      title: "Cardio and Endurance",
      category: "Aerobic Capacity",
      duration: "8 Weeks",
      schedule: "3-4 Days/Wk",
      desc: "Cardiovascular VO2 max expansion, lactate threshold pacing, and energetic stamina conditioning.",
      image: "https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=800&auto=format&fit=crop",
      tags: ["VO2 Max", "Endurance", "Stamina"]
    }
  ];

  // Coaches & AI Trainers with gender presentation, specialization, and availability
  const allTrainers = [
    { 
      name: "Brandon Smith", 
      gender: "Male",
      spec: "Crossfit & Olympic Lifts", 
      availability: "Mon - Sat • 6AM - 2PM",
      img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop",
      desc: "Specializes in high-intensity functional training, Olympic lifts, and endurance.",
      isAi: false 
    },
    { 
      name: "Lisa Parker", 
      gender: "Female",
      spec: "Yoga & Athletic Mobility", 
      availability: "Mon - Sun • 8AM - 6PM",
      img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
      desc: "Postural alignment, functional flexibility, breathwork, and athletic recovery.",
      isAi: false 
    },
    { 
      name: "Alex Mercer", 
      gender: "Male",
      spec: "Strength & Powerlifting", 
      availability: "Tue - Sat • 10AM - 8PM",
      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
      desc: "Progressive overload, barbell biomechanics, and competitive powerlifting prep.",
      isAi: false 
    },
    { 
      name: "AURA AI COACH", 
      gender: "AI System",
      spec: "Computer Vision Form Guidance", 
      availability: "Available 24/7 Live",
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
      desc: "24/7 Computer vision guidance analyzing reps, joint angles, and tempo in real time.",
      isAi: true 
    },
    { 
      name: "TITAN AI", 
      gender: "AI System",
      spec: "Hypertrophy Overload Engine", 
      availability: "Available 24/7 Live",
      img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
      desc: "Dynamic resistance intelligence that adapts training volume to your daily neuromuscular fatigue.",
      isAi: true 
    },
    { 
      name: "Marcus Johnson", 
      gender: "Male",
      spec: "Bodybuilding & Symmetry", 
      availability: "Mon - Fri • 12PM - 9PM",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
      desc: "Sculpting muscular symmetry, competition conditioning, and targeted activation.",
      isAi: false 
    }
  ];

  // Why FitFlow clean feature items
  const whyFitFlowFeatures = [
    {
      title: "Personalized Workout Plans",
      desc: "Periodized training programs built directly around your fitness goals, weekly availability, and available equipment.",
      icon: Target,
      link: "/register"
    },
    {
      title: "Exercise Demonstrations",
      desc: "Interactive 3D biomechanical models and muscle-highlighted anatomy diagrams ensure correct joint execution.",
      icon: Play,
      link: "/dashboard/exercises"
    },
    {
      title: "Daily Fitness Tracking",
      desc: "Record daily hydration, step goals, active minutes, and habit streaks with instant metric calculations.",
      icon: Activity,
      link: "/dashboard/routines"
    },
    {
      title: "Workout History",
      desc: "Every completed exercise, set, repetition, and weight is logged to PostgreSQL persistence for lifelong tracking.",
      icon: Calendar,
      link: "/dashboard/workout"
    },
    {
      title: "Progress Tracking",
      desc: "Visualize your transformation through bodyweight charts, BMI metrics, and volume progression analytics.",
      icon: BarChart3,
      link: "/dashboard/account"
    },
    {
      title: "AI Fitness Coaching",
      desc: "24/7 intelligent coach dialogues providing form suggestions, tempo checks, and adaptive recovery advice.",
      icon: Sparkles,
      link: "/trainers"
    }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: "Free Home Pack",
      badge: "Workout From Home Only",
      isFree: true,
      price: "0",
      period: "per month",
      description: "100% Free plan designed exclusively for workout from home users with zero gym gear.",
      features: [
        "100% Zero-Equipment Home Workouts",
        "Bodyweight Calisthenics & Core Routines",
        "Daily Water, Steps & Habit Tracking",
        "Home HIIT & Mobility Video Guides",
        "FitFlow Community Access & Progress Logs"
      ],
      popular: false,
      cta: "Start Free Home Workout"
    },
    {
      name: "Silver Pass",
      price: "29",
      period: "per month",
      description: "Essential gym access and workout tools for consistent daily fitness.",
      features: [
        "Full Gym Equipment Access",
        "Locker & Shower Facility",
        "FitFlow Web & Mobile Tracking",
        "Daily Water & Steps Tracker",
        "Free High-Speed Wi-Fi"
      ],
      popular: false,
      cta: "Choose Silver"
    },
    {
      name: "Gold All-Access",
      price: "49",
      period: "per month",
      description: "Our most popular membership for serious fitness enthusiasts seeking total guidance.",
      features: [
        "Everything in Silver Pass",
        "All Group Fitness & HIIT Classes",
        "24/7 Access to AURA & TITAN AI Coaches",
        "Personalized Routine Builder",
        "1 Free Monthly Trainer Consultation",
        "Nutrition & Protein Target Dashboard"
      ],
      popular: true,
      cta: "Get Gold Access"
    },
    {
      name: "Platinum Elite",
      price: "79",
      period: "per month",
      description: "Comprehensive VIP experience with personal coaching and luxury recovery amenities.",
      features: [
        "Everything in Gold All-Access",
        "Weekly 1-on-1 Certified Master Coach",
        "Cryo & Hydro-Massage Recovery Lounge",
        "Tailored Macro Meal Preparation Guide",
        "Unlimited Guest Passes (2/month)",
        "Priority Booking for Fitness Events"
      ],
      popular: false,
      cta: "Choose Platinum"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-200 font-sans selection:bg-[#ef233c] selection:text-white">
      
      {/* ======================================================== */}
      {/* 1. PUBLIC HEADER AND NAVIGATION (Transparent -> Dark)     */}
      {/* ======================================================== */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-3.5' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex justify-between items-center">
          
          {/* Left: FIT in white and FLOW in bold red */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="flex items-center text-2xl sm:text-3xl font-black font-display tracking-[0.15em] text-white hover:opacity-95 transition-opacity"
          >
            FIT<span className="text-[#ef233c] font-black">FLOW</span>
          </button>

          {/* Center/Right Navigation: HOME, PROGRAMS, TRAINERS, LOGIN */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-xs font-bold tracking-widest uppercase text-gray-300">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="text-white hover:text-[#ef233c] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <button 
              onClick={() => scrollToSection('programs')} 
              className="text-gray-300 hover:text-[#ef233c] transition-colors cursor-pointer"
            >
              PROGRAMS
            </button>
            <button 
              onClick={() => scrollToSection('trainers')} 
              className="text-gray-300 hover:text-[#ef233c] transition-colors cursor-pointer"
            >
              TRAINERS
            </button>
            {currentUser ? (
              <Link 
                to="/dashboard/routines" 
                className="text-[#ef233c] hover:text-white transition-colors"
              >
                DASHBOARD
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-[#ef233c] transition-colors"
              >
                LOGIN
              </Link>
            )}
          </nav>

          {/* Right: Red JOIN NOW button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link 
              to={currentUser ? "/dashboard/routines" : "/register"} 
              className="bg-[#ef233c] hover:bg-[#d90429] text-white px-6 py-2.5 rounded font-bold uppercase tracking-widest text-xs transition-all shadow-[0_4px_16px_rgba(239,35,60,0.35)] hover:-translate-y-0.5 active:scale-95"
            >
              {currentUser ? 'MY DASHBOARD' : 'JOIN NOW'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#ef233c]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#121318]/98 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4 text-xs font-bold uppercase tracking-widest shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="block w-full text-left text-white hover:text-[#ef233c] py-2 border-b border-white/5"
            >
              HOME
            </button>
            <button 
              onClick={() => scrollToSection('programs')} 
              className="block w-full text-left text-gray-300 hover:text-[#ef233c] py-2 border-b border-white/5"
            >
              PROGRAMS
            </button>
            <button 
              onClick={() => scrollToSection('trainers')} 
              className="block w-full text-left text-gray-300 hover:text-[#ef233c] py-2 border-b border-white/5"
            >
              TRAINERS
            </button>
            {currentUser ? (
              <Link 
                to="/dashboard/routines" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block text-[#ef233c] py-2 border-b border-white/5"
              >
                DASHBOARD
              </Link>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block text-gray-300 hover:text-[#ef233c] py-2 border-b border-white/5"
              >
                LOGIN
              </Link>
            )}
            <div className="pt-2">
              <Link 
                to={currentUser ? "/dashboard/routines" : "/register"} 
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-[#ef233c] text-white py-3 rounded uppercase tracking-wider font-bold text-xs shadow-[0_4px_16px_rgba(239,35,60,0.4)]"
              >
                {currentUser ? 'MY DASHBOARD' : 'JOIN NOW'}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION (Matching Screenshot 1)                  */}
      {/* ======================================================== */}
      <section id="hero" className="relative min-h-[96vh] flex items-center overflow-hidden bg-[#0b0c10]">
        
        {/* Cinematic high-resolution gym hero background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/hero-gym-fitness.jpg')" 
          }}
        ></div>

        {/* Dark gradient overlays leaving dark negative space on left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/85 sm:via-[#0b0c10]/55 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-[#0b0c10]/60"></div>

        {/* Content Container (Left-aligned) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-32 sm:pt-36 pb-24 sm:pb-32 w-full">
          <div className="max-w-3xl">
            
            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] xl:text-[6.2rem] font-display font-black uppercase tracking-tight leading-[0.92] mb-6">
              <span className="block text-white">TRAIN SMARTER.</span>
              <span className="block text-[#ef233c]">LIVE STRONGER.</span>
            </h1>

            {/* Supporting Text with Red Accent Bar */}
            <div className="border-l-[3px] border-[#ef233c] pl-4 sm:pl-5 mb-10 max-w-xl">
              <p className="text-xs sm:text-sm md:text-base font-semibold tracking-wider uppercase text-gray-300 leading-relaxed">
                YOUR PERSONALIZED FITNESS JOURNEY FOR<br className="hidden sm:inline" /> GYM AND HOME WORKOUTS.
              </p>
            </div>

            {/* Two Buttons: 1. Solid Red with Right Arrow, 2. Dark with Thin Red Border */}
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/register" 
                className="bg-[#ef233c] hover:bg-[#d90429] text-white font-black uppercase tracking-widest text-xs sm:text-sm px-8 py-4 rounded-full transition-all duration-300 shadow-[0_4px_22px_rgba(239,35,60,0.5)] hover:shadow-[0_6px_28px_rgba(239,35,60,0.7)] flex items-center gap-2 group hover:-translate-y-0.5 active:scale-95"
              >
                <span>START YOUR JOURNEY</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button 
                onClick={() => scrollToSection('programs')} 
                className="bg-[#14151b]/60 hover:bg-[#ef233c]/15 border border-[#ef233c] text-white font-black uppercase tracking-widest text-xs sm:text-sm px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 backdrop-blur-sm cursor-pointer"
              >
                <span>EXPLORE PROGRAMS</span>
              </button>
            </div>

          </div>
        </div>

        {/* Angular red decorative shape at bottom-right */}
        <div 
          className="hidden sm:block absolute -bottom-1 -right-1 w-64 md:w-80 lg:w-[28rem] h-24 md:h-32 lg:h-38 bg-[#ef233c] pointer-events-none" 
          style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)' }}
        ></div>
      </section>

      {/* ======================================================== */}
      {/* 3. PROGRAMS SECTION (#programs)                          */}
      {/* ======================================================== */}
      <section id="programs" className="py-24 sm:py-32 bg-[#121318] border-t border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-3">
              TRAINING PROTOCOLS
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-3">
              EXPLORE OUR PROGRAMS
            </h2>
            <div className="w-16 h-1 bg-[#ef233c] mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Scientifically structured fitness regimens designed for progressive hypertrophy, strength, endurance, and longevity.
            </p>
          </div>

          {/* 8 Program Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((prog) => (
              <div 
                key={prog.id}
                className="group bg-[#181920] border border-white/5 hover:border-[#ef233c]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-lg"
              >
                {/* Photo Header */}
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-[#14151b]">
                    <img 
                      src={prog.image} 
                      alt={prog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181920] via-black/40 to-transparent"></div>
                    
                    {/* Category & Duration Badges */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-200">
                      {prog.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-[#ef233c] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                      {prog.duration}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-display font-bold uppercase tracking-wide text-white group-hover:text-[#ef233c] transition-colors mb-2">
                      {prog.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed mb-4 min-h-[48px]">
                      {prog.desc}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {prog.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[9px] font-bold uppercase tracking-wider bg-[#121318] border border-white/5 px-2 py-0.5 rounded text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="px-5 pb-5 pt-3 border-t border-white/5">
                  <Link 
                    to="/register" 
                    className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-[#ef233c] transition-colors"
                  >
                    <span>Start Program</span>
                    <div className="w-7 h-7 rounded-full bg-[#121318] group-hover:bg-[#ef233c] group-hover:text-white flex items-center justify-center transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Section Footer Link */}
          <div className="mt-14 text-center">
            <Link 
              to="/programs" 
              className="inline-flex items-center gap-2 bg-[#181920] border border-white/10 hover:border-[#ef233c] text-white px-8 py-3.5 rounded-full uppercase tracking-widest font-bold text-xs transition-all hover:bg-[#ef233c]"
            >
              <span>View All Training Protocols</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. WHY FITFLOW SECTION (#why-fitflow)                     */}
      {/* ======================================================== */}
      <section id="why-fitflow" className="py-24 sm:py-32 bg-[#0b0c10] relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-3">
              THE FITFLOW ADVANTAGE
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-3">
              WHY FITFLOW
            </h2>
            <div className="w-16 h-1 bg-[#ef233c] mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every tool you need to build muscle, track daily habits, and surpass physical limits in one high-performance dashboard.
            </p>
          </div>

          {/* 6 Clean Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyFitFlowFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#14151b] border border-white/5 hover:border-[#ef233c]/40 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between shadow-md"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#ef233c]/15 text-[#ef233c] group-hover:bg-[#ef233c] group-hover:text-white flex items-center justify-center mb-5 transition-all shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-display font-bold uppercase tracking-wide text-white mb-2.5 group-hover:text-[#ef233c] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                      {feat.desc}
                    </p>
                  </div>
                  
                  <Link 
                    to={feat.link} 
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#ef233c] transition-colors pt-3 border-t border-white/5"
                  >
                    <span>Learn More</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. SPLIT MOTIVATION BANNER ("GET OUT OF YOUR COMFORT ZONE")*/}
      {/* ======================================================== */}
      <section className="relative min-h-[500px] flex items-center bg-[#0b0c10] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 transition-opacity duration-500 scale-105"
          style={{ 
            backgroundImage: "url('/comfort-zone-banner.jpg')" 
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-[#0b0c10]/70"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-[#0b0c10]/95 via-[#0b0c10]/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-20 relative z-10 w-full flex justify-end">
          <div className="max-w-xl text-right">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display uppercase tracking-tight leading-[0.95] mb-4">
              <span className="block font-black text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">GET OUT OF YOUR</span>
              <span className="block font-black text-[#ef233c] drop-shadow-[0_4px_24px_rgba(239,35,60,0.5)]">COMFORT ZONE</span>
            </h2>
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-8 max-w-lg ml-auto font-medium">
              Push past your perceived limits with high-intensity coaching, intelligent biomechanical tracking, and progressive strength overload.
            </p>
            <div>
              <button 
                onClick={() => scrollToSection('programs')}
                className="bg-[#ef233c] hover:bg-[#d90429] text-white font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded-full transition-all shadow-[0_4px_20px_rgba(239,35,60,0.6)] inline-flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>EXPLORE PROGRAMS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. TRAINERS AND AI COACHES (#trainers)                   */}
      {/* ======================================================== */}
      <section id="trainers" className="py-24 sm:py-32 bg-[#121318] border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-3">
              MEET THE TEAM
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-3">
              OUR TRAINERS & AI COACHES
            </h2>
            <div className="w-16 h-1 bg-[#ef233c] mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Certified master coaches and 24/7 computer vision AI trainers dedicated to your breakthrough. Select your ideal coach to power your workout plan.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            <button 
              type="button"
              onClick={() => setTrainerTab('all')} 
              className={`px-6 py-2.5 rounded-full uppercase font-bold text-xs tracking-widest transition-all cursor-pointer ${
                trainerTab === 'all' 
                  ? 'bg-[#ef233c] text-white shadow-[0_4px_16px_rgba(239,35,60,0.4)]' 
                  : 'bg-[#181920] text-gray-400 border border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              All Trainers
            </button>
            <button 
              type="button"
              onClick={() => setTrainerTab('human')} 
              className={`px-6 py-2.5 rounded-full uppercase font-bold text-xs tracking-widest transition-all cursor-pointer ${
                trainerTab === 'human' 
                  ? 'bg-[#ef233c] text-white shadow-[0_4px_16px_rgba(239,35,60,0.4)]' 
                  : 'bg-[#181920] text-gray-400 border border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              Master Coaches
            </button>
            <button 
              type="button"
              onClick={() => setTrainerTab('ai')} 
              className={`px-6 py-2.5 rounded-full uppercase font-bold text-xs tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
                trainerTab === 'ai' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_4px_20px_rgba(6,182,212,0.5)]' 
                  : 'bg-[#101b2b] text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-300" />
              <span>AI Trainers (24/7)</span>
            </button>
          </div>

          {/* Trainers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTrainers
              .filter(t => {
                if (trainerTab === 'ai') return t.isAi;
                if (trainerTab === 'human') return !t.isAi;
                return true;
              })
              .map((trainer, i) => (
                <div 
                  key={i} 
                  className="bg-[#14151b] border border-white/5 hover:border-[#ef233c]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between shadow-lg"
                >
                  {/* Photo Container */}
                  <div className="w-full aspect-[4/5] overflow-hidden relative bg-[#181920]">
                    <img 
                      src={trainer.img} 
                      alt={trainer.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14151b] via-transparent to-transparent"></div>

                    {/* Top Badges: Type & Gender */}
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                      {trainer.isAi ? (
                        <span className="bg-cyan-950/90 border border-cyan-400/60 text-cyan-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                          <Bot className="w-3.5 h-3.5 text-cyan-400" /> AI Coach • 24/7
                        </span>
                      ) : (
                        <span className="bg-black/80 border border-white/10 text-gray-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                          Master Coach
                        </span>
                      )}
                      <span className="bg-black/60 border border-white/10 text-gray-300 px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase backdrop-blur-sm self-start">
                        {trainer.gender}
                      </span>
                    </div>

                    {/* Availability Tag */}
                    <div className="absolute bottom-3 right-3 bg-black/80 border border-white/10 text-[10px] font-semibold text-gray-300 px-2.5 py-1 rounded-lg backdrop-blur-md">
                      {trainer.availability}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between text-center">
                    <div>
                      <h3 className="text-xl font-display font-bold uppercase tracking-wide text-white flex items-center justify-center gap-1.5">
                        {trainer.name}
                        {trainer.isAi && <Sparkles className="w-4 h-4 text-cyan-400" />}
                      </h3>
                      <div className={`text-xs uppercase tracking-widest mt-1 font-bold ${
                        trainer.isAi ? 'text-cyan-400' : 'text-[#ef233c]'
                      }`}>
                        {trainer.spec}
                      </div>
                      <p className="text-gray-400 text-xs mt-3 leading-relaxed">
                        {trainer.desc}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-500">
                        <TwitterIcon className="w-3.5 h-3.5 hover:text-[#ef233c] cursor-pointer transition-colors" />
                        <FacebookIcon className="w-3.5 h-3.5 hover:text-[#ef233c] cursor-pointer transition-colors" />
                        <InstagramIcon className="w-3.5 h-3.5 hover:text-[#ef233c] cursor-pointer transition-colors" />
                      </div>
                      <Link 
                        to="/trainers" 
                        className={`text-xs uppercase font-bold tracking-wider inline-flex items-center gap-1 transition-colors ${
                          trainer.isAi ? 'text-cyan-400 hover:text-cyan-300' : 'text-[#ef233c] hover:text-white'
                        }`}
                      >
                        <span>View Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
          </div>

          <div className="mt-14 text-center">
            <Link 
              to="/trainers" 
              className="inline-flex items-center gap-2 bg-[#181920] border border-white/10 hover:border-[#ef233c] text-white px-8 py-3.5 rounded-full uppercase tracking-widest font-bold text-xs transition-all hover:bg-[#ef233c]"
            >
              <span>Explore All Coaches & AI</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. PRICING PLANS SECTION                                 */}
      {/* ======================================================== */}
      <section id="pricing" className="py-24 sm:py-32 bg-[#0b0c10] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-3">
              MEMBERSHIP TIERS
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-2">
              PRICING PLANS
            </h2>
            <div className="w-16 h-1 bg-[#ef233c] mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transparent fitness packages with no hidden contracts. Cancel or upgrade anytime.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            {pricingPlans.map((plan, i) => (
              <div 
                key={i} 
                className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular 
                    ? 'bg-[#181920] border-2 border-[#ef233c] shadow-[0_8px_35px_rgba(239,35,60,0.25)] xl:-translate-y-2' 
                    : plan.isFree
                    ? 'bg-[#13181c] border-2 border-emerald-500/60 hover:border-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.15)]'
                    : 'bg-[#14151b] border border-white/5 hover:border-white/20'
                }`}
              >
                {/* Pill Badge */}
                {plan.popular ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#ef233c] text-white text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                    Most Popular
                  </div>
                ) : plan.badge ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md whitespace-nowrap">
                    {plan.badge}
                  </div>
                ) : null}

                <div>
                  <h3 className="text-xl font-display font-bold uppercase tracking-wider text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-xs mb-6 min-h-[36px]">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-white/10">
                    <span className={`text-2xl font-bold ${plan.isFree ? 'text-emerald-400' : 'text-[#ef233c]'}`}>$</span>
                    <span className="text-5xl font-display font-black text-white">{plan.price}</span>
                    <span className="text-xs uppercase tracking-wider text-gray-400 ml-1">/{plan.period}</span>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.isFree 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-[#ef233c]/20 text-[#ef233c]'
                        }`}>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Link 
                    to="/register" 
                    className={`w-full py-3.5 rounded-full uppercase tracking-wider font-bold text-xs text-center transition-all duration-300 block ${
                      plan.popular 
                        ? 'bg-[#ef233c] hover:bg-[#d90429] text-white shadow-[0_4px_20px_rgba(239,35,60,0.4)] hover:-translate-y-0.5' 
                        : plan.isFree
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:-translate-y-0.5'
                        : 'bg-[#1f2029] hover:bg-white hover:text-black text-white border border-white/10'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. STRONG RED-AND-BLACK CALL TO ACTION SECTION           */}
      {/* ======================================================== */}
      <section className="relative py-24 sm:py-28 bg-gradient-to-r from-[#14151b] via-[#1f1013] to-[#0b0c10] border-t border-b border-[#ef233c]/20 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ef233c]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 sm:px-10 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#ef233c]/15 border border-[#ef233c]/40 text-[#ef233c] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>START YOUR TRANSFORMATION</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase tracking-tight text-white mb-6 leading-tight">
            READY TO TRAIN <span className="text-[#ef233c]">SMARTER</span> AND LIVE <span className="text-[#ef233c]">STRONGER?</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Join thousands of dedicated athletes tracking workouts, receiving AI form guidance, and hitting daily milestones with FitFlow.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-[#ef233c] hover:bg-[#d90429] text-white font-black uppercase tracking-widest text-xs sm:text-sm px-10 py-4 rounded-full transition-all duration-300 shadow-[0_4px_25px_rgba(239,35,60,0.6)] hover:shadow-[0_6px_32px_rgba(239,35,60,0.8)] flex items-center gap-2 hover:-translate-y-0.5 active:scale-95"
            >
              <span>JOIN FITFLOW TODAY</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button 
              onClick={() => scrollToSection('programs')} 
              className="bg-[#181920] hover:bg-[#20212a] border border-white/20 text-white font-black uppercase tracking-widest text-xs sm:text-sm px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              EXPLORE PROGRAMS
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. FOOTER SECTION                                        */}
      {/* ======================================================== */}
      <footer className="bg-[#0b0c10] border-t border-white/10 pt-16 pb-12 text-gray-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
            
            {/* Column 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="inline-flex items-center text-3xl font-black font-display tracking-[0.15em] text-white">
                FIT<span className="text-[#ef233c] font-black">FLOW</span>
              </Link>
              <p className="text-gray-400 text-xs sm:text-sm max-w-sm leading-relaxed">
                FitFlow is an advanced fitness management platform engineered for gym and home workouts. Track progressive overload, analyze biomechanics, and achieve peak physical performance.
              </p>
              
              <div className="flex items-center gap-4 pt-2 text-gray-400">
                <a href="#twitter" aria-label="FitFlow on Twitter" className="w-9 h-9 rounded-full bg-[#181920] hover:bg-[#ef233c] hover:text-white flex items-center justify-center transition-colors">
                  <TwitterIcon />
                </a>
                <a href="#facebook" aria-label="FitFlow on Facebook" className="w-9 h-9 rounded-full bg-[#181920] hover:bg-[#ef233c] hover:text-white flex items-center justify-center transition-colors">
                  <FacebookIcon />
                </a>
                <a href="#instagram" aria-label="FitFlow on Instagram" className="w-9 h-9 rounded-full bg-[#181920] hover:bg-[#ef233c] hover:text-white flex items-center justify-center transition-colors">
                  <InstagramIcon />
                </a>
                <a href="#youtube" aria-label="FitFlow on YouTube" className="w-9 h-9 rounded-full bg-[#181920] hover:bg-[#ef233c] hover:text-white flex items-center justify-center transition-colors">
                  <YoutubeIcon />
                </a>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">
                NAVIGATION
              </h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => scrollToSection('hero')} className="hover:text-[#ef233c] transition-colors cursor-pointer">Home</button></li>
                <li><button onClick={() => scrollToSection('programs')} className="hover:text-[#ef233c] transition-colors cursor-pointer">Programs</button></li>
                <li><button onClick={() => scrollToSection('trainers')} className="hover:text-[#ef233c] transition-colors cursor-pointer">Trainers</button></li>
                <li><Link to="/programs" className="hover:text-[#ef233c] transition-colors">All Protocols</Link></li>
                <li><Link to="/login" className="hover:text-[#ef233c] transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-[#ef233c] transition-colors">Join Now</Link></li>
              </ul>
            </div>

            {/* Column 3: Platform Features */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">
                PLATFORM
              </h4>
              <ul className="space-y-2.5">
                <li><Link to="/dashboard/routines" className="hover:text-[#ef233c] transition-colors">Daily Routines</Link></li>
                <li><Link to="/dashboard/exercises" className="hover:text-[#ef233c] transition-colors">Exercise Library</Link></li>
                <li><Link to="/dashboard/workout" className="hover:text-[#ef233c] transition-colors">Workout Tracker</Link></li>
                <li><Link to="/trainers" className="hover:text-[#ef233c] transition-colors">AI Coaches (24/7)</Link></li>
                <li><Link to="/dashboard/recover" className="hover:text-[#ef233c] transition-colors">Recovery & Rest</Link></li>
                <li><Link to="/dashboard/account" className="hover:text-[#ef233c] transition-colors">Athlete Profile</Link></li>
              </ul>
            </div>

            {/* Column 4: Gym & Contact */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">
                FACILITY & CONTACT
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#ef233c] shrink-0 mt-0.5" />
                  <span>1048 Grand Avenue, Metro Athletics District</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#ef233c] shrink-0" />
                  <span>support@fitflowgym.com</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#ef233c] shrink-0" />
                  <span>+1 (800) 555-FLOW</span>
                </div>
                <div className="flex items-start gap-2.5 pt-1">
                  <Clock className="w-4 h-4 text-[#ef233c] shrink-0 mt-0.5" />
                  <span>Members: 24/7 Access<br />Staffed: 6:00 AM – 10:00 PM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-xs">
            <div>
              © 2026 FitFlow Gym Management. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setLegalModal('privacy')} 
                className="hover:text-gray-300 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setLegalModal('terms')} 
                className="hover:text-gray-300 transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <Link to="/trainer/login" className="hover:text-[#ef233c] transition-colors">
                Staff Portal
              </Link>
            </div>
          </div>

        </div>
      </footer>

      {/* ======================================================== */}
      {/* LEGAL MODAL (PRIVACY POLICY & TERMS OF SERVICE)          */}
      {/* ======================================================== */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14151b] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-xl font-display font-bold uppercase text-white">
                {legalModal === 'privacy' ? 'FitFlow Privacy Policy' : 'FitFlow Terms of Service'}
              </h3>
              <button 
                onClick={() => setLegalModal(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {legalModal === 'privacy' ? (
              <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <p><strong>1. Data Collection:</strong> FitFlow collects user-provided fitness metrics, daily hydration logs, workout session records, and account credentials to generate personalized athletic recommendations.</p>
                <p><strong>2. Biometric and AI Processing:</strong> Any form correction, computer vision estimation, or workout calculations processed by AURA AI or TITAN AI are encrypted and used strictly for athletic telemetry.</p>
                <p><strong>3. Data Security:</strong> User records and authentication tokens are secured with industry-standard bcrypt encryption and stored in dedicated PostgreSQL instances.</p>
                <p><strong>4. User Control:</strong> You maintain full control over your workout history and may request data export or account closure through your Account Dashboard.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <p><strong>1. Agreement to Terms:</strong> By accessing FitFlow, you agree to comply with our terms, facility etiquette, and digital coaching guidelines.</p>
                <p><strong>2. Physical Fitness Disclaimer:</strong> Consult with a qualified physician before undertaking strenuous resistance training or dietary changes. FitFlow provides educational exercise guidance.</p>
                <p><strong>3. Memberships & Cancellation:</strong> Memberships are billed monthly and may be cancelled at any time prior to the next billing cycle via the Account dashboard.</p>
                <p><strong>4. Facility Etiquette:</strong> Please re-rack weights, clean equipment after use, and treat fellow athletes and coaches with mutual respect.</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 text-right">
              <button 
                onClick={() => setLegalModal(null)}
                className="bg-[#ef233c] hover:bg-[#d90429] text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
