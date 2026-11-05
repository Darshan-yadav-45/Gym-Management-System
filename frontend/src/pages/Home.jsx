import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight,
  ChevronRight, 
  ChevronLeft,
  Bot, 
  Sparkles, 
  BarChart3, 
  Check, 
  Menu, 
  X,
  Zap,
  Activity,
  Target,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  Play,
  Send,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
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

// Curated high-resolution fitness images for the 1-second hero background rotation
const HERO_IMAGES = [
  '/hero/hero-1.jpg',
  '/hero/hero-2.jpg',
  '/hero/hero-3.jpg',
  '/hero/hero-4.jpg',
  '/hero/hero-5.jpg',
  '/hero/hero-6.jpg',
  '/hero/hero-7.jpg',
  '/hero/hero-8.jpg'
];

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | null

  // 1-second hero background slideshow state
  const [heroIndex, setHeroIndex] = useState(0);

  // Explore Our Programs horizontal scroll ref
  const programsScrollRef = useRef(null);

  // Aura AI Coach Interactive Chat Modal state
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { 
      role: 'assistant', 
      text: 'Hello! I am Aura AI Coach, your dedicated 24/7 fitness intelligence assistant. How can I help you optimize your workouts, nutrition, or exercise routines today?' 
    }
  ]);

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

    // Preload hero images to prevent flickering on 1-second rotation
    HERO_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Slideshow interval: 1000ms (1 second), respecting reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer = null;
    if (!prefersReducedMotion) {
      timer = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
      }, 1000);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timer) clearInterval(timer);
    };
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

  const scrollPrograms = (direction) => {
    if (programsScrollRef.current) {
      const scrollAmount = 340;
      programsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleAiSend = (e) => {
    if (e) e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput.trim();
    setAiMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setAiInput('');

    setTimeout(() => {
      let reply = "Great question! Consistent progressive overload, structured recovery, and proper nutrition are essential for long-term athletic success.";
      const lower = userMsg.toLowerCase();
      if (lower.includes('chest') || lower.includes('push') || lower.includes('bench')) {
        reply = "For chest hypertrophy, focus on the Barbell Bench Press (3x8-10 reps) and Incline Dumbbell Press. Keep your scapula retracted and maintain a 2-second controlled eccentric phase.";
      } else if (lower.includes('tricep') || lower.includes('dip') || lower.includes('arm')) {
        reply = "For triceps, Cable Pushdowns and Diamond Push-ups provide intense activation of the lateral and long heads. Keep elbows locked close to your torso.";
      } else if (lower.includes('water') || lower.includes('hydrat')) {
        reply = "Optimal athletic performance requires 3 to 4 liters of water daily. Aim for 500ml upon waking and 250ml every 20 minutes of strenuous training.";
      } else if (lower.includes('strength') || lower.includes('power')) {
        reply = "For maximum strength, prioritize compound movements: Squat, Bench Press, and Deadlift at 80-88% 1RM (3-5 sets of 3-5 reps) with 3-4 minutes rest between sets.";
      } else if (lower.includes('weight loss') || lower.includes('fat') || lower.includes('diet')) {
        reply = "Fat shredding requires a sustained 300-500 kcal deficit while keeping protein high (1.6-2.2g per kg bodyweight) to preserve muscle mass, paired with 3-4 days of resistance training.";
      } else if (lower.includes('routine') || lower.includes('workout') || lower.includes('plan')) {
        reply = "A 4-day Upper/Lower or 3-day Full Body split is ideal for balanced recovery and progressive hypertrophy. You can track full routines directly in your FitFlow Dashboard.";
      }
      setAiMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    }, 400);
  };

  const handleQuickPrompt = (promptText) => {
    setIsAiChatOpen(true);
    setAiMessages((prev) => [...prev, { role: 'user', text: promptText }]);
    setTimeout(() => {
      let reply = "Here is what I recommend for your athletic progress:";
      const lower = promptText.toLowerCase();
      if (lower.includes('chest')) {
        reply = "For chest development, prioritize Barbell Bench Press (3x8-10 reps) and Dumbbell Incline Press with full kinetic stretch and controlled tempo.";
      } else if (lower.includes('water') || lower.includes('hydrat')) {
        reply = "Aim for 3-4L of daily water hydration. Proper hydration improves muscle force output by up to 15% and speeds up waste removal.";
      } else if (lower.includes('routine') || lower.includes('beginner')) {
        reply = "For beginners, start with our 3-day Full Body Protocol: Squats, Push-ups/Dumbbell Press, Dumbbell Rows, and Core Planks (3 sets of 10-12 reps).";
      } else if (lower.includes('progressive overload')) {
        reply = "Progressive overload means gradually increasing weight, reps, or sets over time. Log your numbers each week in the FitFlow Workout Tracker!";
      }
      setAiMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    }, 400);
  };

  // 8 Specific Program Cards with verified high-res images
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
      image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=800&auto=format&fit=crop",
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

  // 4 Master Human Trainers (Displayed in single horizontal row on desktop)
  const humanTrainers = [
    { 
      name: "Brandon Smith", 
      gender: "Male",
      spec: "Crossfit & Olympic Lifts", 
      experience: "8+ Years Coaching",
      availability: "Mon - Sat • 6AM - 2PM",
      img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop",
      desc: "Specializes in high-intensity functional training, Olympic lifts, and athletic endurance.",
      isAi: false 
    },
    { 
      name: "Lisa Parker", 
      gender: "Female",
      spec: "Yoga & Athletic Mobility", 
      experience: "6+ Years Coaching",
      availability: "Mon - Sun • 8AM - 6PM",
      img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
      desc: "Postural alignment, functional flexibility, breathwork, and athletic recovery protocols.",
      isAi: false 
    },
    { 
      name: "Alex Mercer", 
      gender: "Male",
      spec: "Strength & Powerlifting", 
      experience: "7+ Years Coaching",
      availability: "Tue - Sat • 10AM - 8PM",
      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
      desc: "Progressive overload, barbell biomechanics, and competitive powerlifting preparation.",
      isAi: false 
    },
    { 
      name: "Marcus Johnson", 
      gender: "Male",
      spec: "Bodybuilding & Symmetry", 
      experience: "9+ Years Coaching",
      availability: "Mon - Fri • 12PM - 9PM",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
      desc: "Sculpting muscular symmetry, competition conditioning, and targeted muscle activation.",
      isAi: false 
    }
  ];

  // Single Aura AI Coach (Titan removed from home page presentation)
  const auraAiCoach = {
    name: "AURA AI COACH",
    title: "Intelligent Fitness & Form Assistant",
    availability: "Available 24/7 Live",
    version: "v2.5 Neural Engine",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    desc: "Aura is your 24/7 personal digital fitness assistant engineered to help you understand workouts, clarify athletic goals, structure customized exercise routines, and deliver real-time exercise guidance.",
    capabilities: [
      "Real-time Form & Biomechanical Guidance",
      "Dynamic Exercise Routine Generation",
      "Daily Hydration & Macro Guidance",
      "Progressive Overload Recommendations"
    ]
  };

  // Why FitFlow concise feature items
  const whyFitFlowFeatures = [
    {
      title: "Personalized Workout Plans",
      desc: "Periodized training programs tailored to your athletic goals, gear, and weekly availability.",
      icon: Target,
      link: "/register"
    },
    {
      title: "Exercise Demonstrations",
      desc: "Interactive 3D biomechanics and muscle-highlighted anatomy diagrams for flawless form.",
      icon: Play,
      link: "/dashboard/exercises"
    },
    {
      title: "Daily Fitness Tracking",
      desc: "Record daily hydration, step goals, active minutes, and habit streaks with instant calculations.",
      icon: Activity,
      link: "/dashboard/routines"
    },
    {
      title: "Workout History",
      desc: "Every exercise, set, rep, and weight is logged to PostgreSQL persistence for lifelong tracking.",
      icon: Calendar,
      link: "/dashboard/workout"
    },
    {
      title: "Progress Tracking",
      desc: "Visualize bodyweight trends, BMI shifts, and volume progression with analytical charts.",
      icon: BarChart3,
      link: "/dashboard/account"
    },
    {
      title: "AI Fitness Coaching",
      desc: "24/7 intelligent coach dialogues for instant workout guidance and form suggestions.",
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
        "24/7 Access to Aura AI Coach",
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
            className="flex items-center text-2xl sm:text-3xl font-black font-display tracking-[0.15em] text-white hover:opacity-95 transition-opacity cursor-pointer"
          >
            FIT<span className="text-[#ef233c] font-black">FLOW</span>
          </button>

          {/* Center/Right Navigation: HOME, PROGRAMS, WHY FITFLOW, TRAINERS, AI COACH, LOGIN */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-xs font-bold tracking-widest uppercase text-gray-300">
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
              onClick={() => scrollToSection('why-fitflow')} 
              className="text-gray-300 hover:text-[#ef233c] transition-colors cursor-pointer"
            >
              WHY FITFLOW
            </button>
            <button 
              onClick={() => scrollToSection('trainers')} 
              className="text-gray-300 hover:text-[#ef233c] transition-colors cursor-pointer"
            >
              TRAINERS
            </button>
            <button 
              onClick={() => scrollToSection('ai-coach')} 
              className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI COACH</span>
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

          {/* Right: Red JOIN NOW / DASHBOARD button */}
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
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none cursor-pointer"
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
              className="block w-full text-left text-white hover:text-[#ef233c] py-2 border-b border-white/5 cursor-pointer"
            >
              HOME
            </button>
            <button 
              onClick={() => scrollToSection('programs')} 
              className="block w-full text-left text-gray-300 hover:text-[#ef233c] py-2 border-b border-white/5 cursor-pointer"
            >
              PROGRAMS
            </button>
            <button 
              onClick={() => scrollToSection('why-fitflow')} 
              className="block w-full text-left text-gray-300 hover:text-[#ef233c] py-2 border-b border-white/5 cursor-pointer"
            >
              WHY FITFLOW
            </button>
            <button 
              onClick={() => scrollToSection('trainers')} 
              className="block w-full text-left text-gray-300 hover:text-[#ef233c] py-2 border-b border-white/5 cursor-pointer"
            >
              TRAINERS
            </button>
            <button 
              onClick={() => scrollToSection('ai-coach')} 
              className="block w-full text-left text-cyan-400 hover:text-cyan-300 py-2 border-b border-white/5 cursor-pointer"
            >
              AI COACH (AURA)
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
      {/* 2. HERO SECTION (1-Second Smooth Slideshow Background)    */}
      {/* ======================================================== */}
      <section id="hero" className="relative min-h-[96vh] flex items-center overflow-hidden bg-[#0b0c10]">
        
        {/* Automatic crossfade background image slideshow (1000ms rotation) */}
        {HERO_IMAGES.map((imgSrc, idx) => (
          <div 
            key={imgSrc}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out pointer-events-none ${
              idx === heroIndex ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
            }`}
            style={{ 
              backgroundImage: `url('${imgSrc}')` 
            }}
            aria-hidden="true"
          />
        ))}

        {/* Dark gradient overlays leaving dark negative space on left & ensuring high contrast text readability */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/85 sm:via-[#0b0c10]/55 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0b0c10] via-transparent to-[#0b0c10]/60 pointer-events-none"></div>

        {/* Content Container (Left-aligned & stable during background rotation) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-32 sm:pt-36 pb-24 sm:pb-32 w-full">
          <div className="max-w-3xl">
            
            {/* Live slideshow indicator pill */}
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#ef233c] animate-pulse"></span>
              <span>DYNAMIC FITFLOW EXPERIENCE • FRAME {heroIndex + 1}/{HERO_IMAGES.length}</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] xl:text-[6.2rem] font-display font-black uppercase tracking-tight leading-[0.92] mb-6">
              <span className="block text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">TRAIN SMARTER.</span>
              <span className="block text-[#ef233c] drop-shadow-[0_4px_24px_rgba(239,35,60,0.4)]">LIVE STRONGER.</span>
            </h1>

            {/* Supporting Text with Red Accent Bar */}
            <div className="border-l-[3px] border-[#ef233c] pl-4 sm:pl-5 mb-10 max-w-xl">
              <p className="text-xs sm:text-sm md:text-base font-semibold tracking-wider uppercase text-gray-300 leading-relaxed drop-shadow-md">
                YOUR PERSONALIZED FITNESS JOURNEY FOR<br className="hidden sm:inline" /> GYM AND HOME WORKOUTS.
              </p>
            </div>

            {/* Two CTA Buttons */}
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
                className="bg-[#14151b]/70 hover:bg-[#ef233c]/20 border border-[#ef233c] text-white font-black uppercase tracking-widest text-xs sm:text-sm px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 backdrop-blur-sm cursor-pointer"
              >
                <span>EXPLORE PROGRAMS</span>
              </button>
            </div>

          </div>
        </div>

        {/* Angular red decorative shape at bottom-right */}
        <div 
          className="hidden sm:block absolute -bottom-1 -right-1 w-64 md:w-80 lg:w-[28rem] h-24 md:h-32 lg:h-38 bg-[#ef233c] pointer-events-none z-[3]" 
          style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)' }}
        ></div>
      </section>

      {/* ======================================================== */}
      {/* 3. PROGRAMS SECTION (Clean Aligned Horizontal Row)        */}
      {/* ======================================================== */}
      <section id="programs" className="py-24 sm:py-32 bg-[#121318] border-t border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          
          {/* Section Header with Left/Right Carousel Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-3">
                TRAINING PROTOCOLS
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-2">
                EXPLORE OUR PROGRAMS
              </h2>
              <div className="w-16 h-1 bg-[#ef233c] mb-3"></div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                Scientifically structured fitness regimens designed for progressive hypertrophy, strength, endurance, and longevity.
              </p>
            </div>
            
            {/* Desktop Horizontal Scroll Controls */}
            <div className="hidden md:flex items-center gap-3 mt-6 md:mt-0">
              <button 
                type="button"
                onClick={() => scrollPrograms('left')}
                aria-label="Scroll programs left"
                className="w-11 h-11 rounded-full bg-[#181920] border border-white/10 hover:border-[#ef233c] text-white hover:bg-[#ef233c] flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={() => scrollPrograms('right')}
                aria-label="Scroll programs right"
                className="w-11 h-11 rounded-full bg-[#181920] border border-white/10 hover:border-[#ef233c] text-white hover:bg-[#ef233c] flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Clean Horizontal Aligned Row */}
          <div 
            ref={programsScrollRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {programs.map((prog) => (
              <div 
                key={prog.id}
                className="w-[280px] sm:w-[300px] md:w-[320px] shrink-0 snap-start bg-[#181920] border border-white/5 hover:border-[#ef233c]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-lg group"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-[#14151b]">
                    <img 
                      src={prog.image} 
                      alt={prog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/hero/hero-2.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181920] via-black/30 to-transparent"></div>
                    
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-200">
                      {prog.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-[#ef233c] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                      {prog.duration}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-display font-bold uppercase tracking-wide text-white group-hover:text-[#ef233c] transition-colors mb-2 truncate">
                      {prog.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2 min-h-[34px]">
                      {prog.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 min-h-[26px]">
                      {prog.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[9px] font-bold uppercase tracking-wider bg-[#121318] border border-white/5 px-2 py-0.5 rounded text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

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

          {/* Section Footer */}
          <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold md:hidden">
              ← Swipe horizontally to explore protocols →
            </span>
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
      {/* 4. WHY FITFLOW SECTION (Single Horizontal Row on Desktop)  */}
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

          {/* 6 Clean Feature Cards in a Single Horizontal Row on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {whyFitFlowFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#14151b] border border-white/5 hover:border-[#ef233c]/40 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between shadow-md"
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-[#ef233c]/15 text-[#ef233c] group-hover:bg-[#ef233c] group-hover:text-white flex items-center justify-center mb-4 transition-all shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-display font-bold uppercase tracking-wide text-white mb-2 leading-snug group-hover:text-[#ef233c] transition-colors min-h-[36px] flex items-center">
                      {feat.title}
                    </h3>
                    <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed mb-4 min-h-[52px]">
                      {feat.desc}
                    </p>
                  </div>
                  
                  <Link 
                    to={feat.link} 
                    className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#ef233c] transition-colors pt-3 border-t border-white/5"
                  >
                    <span>Learn More</span>
                    <ChevronRight className="w-3 h-3" />
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
      {/* 6. OUR TRAINERS SECTION (4 Master Coaches in Single Row)   */}
      {/* ======================================================== */}
      <section id="trainers" className="py-24 sm:py-32 bg-[#121318] border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-3">
              EXPERT COACHING
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-3">
              OUR TRAINERS
            </h2>
            <div className="w-16 h-1 bg-[#ef233c] mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Certified master coaches dedicated to your physical breakthrough. Select your ideal coach to power your workout plan.
            </p>
          </div>

          {/* 4 Master Trainers in a Single Horizontal Row on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {humanTrainers.map((trainer, i) => (
              <div 
                key={i} 
                className="bg-[#14151b] border border-white/5 hover:border-[#ef233c]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between shadow-lg"
              >
                {/* Photo Container */}
                <div className="w-full aspect-[4/5] overflow-hidden relative bg-[#181920]">
                  <img 
                    src={trainer.img} 
                    alt={trainer.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/hero/hero-5.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14151b] via-transparent to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="bg-black/80 border border-white/10 text-gray-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                      Master Coach
                    </span>
                    <span className="bg-black/60 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase backdrop-blur-sm self-start">
                      {trainer.gender} • {trainer.experience}
                    </span>
                  </div>

                  {/* Availability Tag */}
                  <div className="absolute bottom-3 right-3 bg-black/80 border border-white/10 text-[10px] font-semibold text-gray-300 px-2.5 py-1 rounded-lg backdrop-blur-md">
                    {trainer.availability}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="text-lg font-display font-bold uppercase tracking-wide text-white">
                      {trainer.name}
                    </h3>
                    <div className="text-xs uppercase tracking-wider mt-1 font-bold text-[#ef233c] min-h-[30px] flex items-center justify-center">
                      {trainer.spec}
                    </div>
                    <p className="text-gray-400 text-xs mt-2.5 leading-relaxed min-h-[48px] line-clamp-3">
                      {trainer.desc}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-gray-500">
                      <TwitterIcon className="w-3.5 h-3.5 hover:text-[#ef233c] cursor-pointer transition-colors" />
                      <FacebookIcon className="w-3.5 h-3.5 hover:text-[#ef233c] cursor-pointer transition-colors" />
                      <InstagramIcon className="w-3.5 h-3.5 hover:text-[#ef233c] cursor-pointer transition-colors" />
                    </div>
                    <Link 
                      to="/trainers" 
                      className="text-xs uppercase font-bold tracking-wider inline-flex items-center gap-1 text-[#ef233c] hover:text-white transition-colors"
                    >
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
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
      {/* 7. AI COACHES SECTION (Single Aura AI Coach Presentation)  */}
      {/* ======================================================== */}
      <section id="ai-coach" className="py-24 sm:py-32 bg-[#0b0c10] border-b border-white/5 relative overflow-hidden">
        {/* Ambient glowing accent */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-400/40 text-cyan-400 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-3">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>INTELLIGENT ATHLETIC ASSISTANCE</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-3">
              AI COACHES
            </h2>
            <div className="w-16 h-1 bg-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Meet Aura, your 24/7 intelligent coach providing workout guidance, exercise form insights, and adaptive routines.
            </p>
          </div>

          {/* Unified Single Aura AI Coach Presentation Card on Desktop */}
          <div className="bg-gradient-to-r from-[#14151b] via-[#151c24] to-[#14151b] border border-cyan-500/30 hover:border-cyan-400/60 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_8px_35px_rgba(6,182,212,0.12)] transition-all duration-300">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              
              {/* Left: Avatar & Live Status Badge */}
              <div className="w-full sm:w-72 lg:w-80 shrink-0">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#181920] border border-cyan-500/40 shadow-xl group">
                  <img 
                    src={auraAiCoach.img} 
                    alt={auraAiCoach.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent"></div>
                  
                  {/* Live Status Indicator */}
                  <div className="absolute top-4 left-4 bg-cyan-950/90 border border-cyan-400/60 text-cyan-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>24/7 LIVE AI SYSTEM</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center">
                    <p className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">AURA v2.5</p>
                    <p className="text-[10px] text-gray-400">Intelligent Biomechanical Engine</p>
                  </div>
                </div>
              </div>

              {/* Center: Information, Description & Feature Tags */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>FITFLOW ARTIFICIAL INTELLIGENCE</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-wide text-white mb-2">
                  {auraAiCoach.name}
                </h3>

                <div className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">
                  {auraAiCoach.title}
                </div>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                  {auraAiCoach.desc}
                </p>

                {/* Feature Tags in a clean horizontal flex on desktop */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
                  {auraAiCoach.capabilities.map((cap, cIdx) => (
                    <span 
                      key={cIdx} 
                      className="bg-[#101b2b] border border-cyan-500/30 text-cyan-300 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-cyan-400" />
                      <span>{cap}</span>
                    </span>
                  ))}
                </div>

                {/* Action Row */}
                <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start pt-4 border-t border-white/10">
                  <button 
                    type="button"
                    onClick={() => setIsAiChatOpen(true)}
                    className="bg-gradient-to-r from-[#ef233c] to-[#d90429] hover:from-[#d90429] hover:to-[#b7094c] text-white px-8 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all shadow-[0_4px_20px_rgba(239,35,60,0.5)] flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat with Aura AI</span>
                  </button>

                  <Link 
                    to="/trainers" 
                    className="bg-[#181920] hover:bg-[#20212a] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 px-6 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2"
                  >
                    <span>Explore AI Directory</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Quick Prompts */}
                <div className="mt-5 text-center lg:text-left">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mr-2">Try asking:</span>
                  <div className="inline-flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <button 
                      type="button"
                      onClick={() => handleQuickPrompt("What exercises build chest width?")}
                      className="text-[11px] text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      "Chest exercises?"
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleQuickPrompt("How much water should I drink daily?")}
                      className="text-[11px] text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      "Hydration goals?"
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleQuickPrompt("Suggest a beginner strength routine")}
                      className="text-[11px] text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      "Beginner routine?"
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. PRICING PLANS SECTION                                 */}
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
      {/* 9. STRONG RED-AND-BLACK CALL TO ACTION SECTION           */}
      {/* ======================================================== */}
      <section className="relative py-24 sm:py-28 bg-gradient-to-r from-[#14151b] via-[#1f1013] to-[#0b0c10] border-t border-b border-[#ef233c]/20 overflow-hidden">
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
      {/* 10. FOOTER SECTION                                       */}
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
                <li><button onClick={() => scrollToSection('why-fitflow')} className="hover:text-[#ef233c] transition-colors cursor-pointer">Why FitFlow</button></li>
                <li><button onClick={() => scrollToSection('trainers')} className="hover:text-[#ef233c] transition-colors cursor-pointer">Trainers</button></li>
                <li><button onClick={() => scrollToSection('ai-coach')} className="hover:text-cyan-400 transition-colors cursor-pointer">AI Coach (Aura)</button></li>
                <li><Link to="/programs" className="hover:text-[#ef233c] transition-colors">All Protocols</Link></li>
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
      {/* 11. INTERACTIVE AURA AI COACH DIALOG MODAL                */}
      {/* ======================================================== */}
      {isAiChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#14151b] border border-cyan-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 bg-[#181920] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#181920]"></span>
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display uppercase tracking-wide text-white flex items-center gap-1.5">
                    <span>Aura AI Coach</span>
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  </h3>
                  <p className="text-[11px] text-cyan-400 font-semibold">● 24/7 Intelligent Fitness Assistant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiChatOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat content */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 min-h-[280px]">
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#ef233c] text-white rounded-br-sm shadow-md font-medium'
                        : 'bg-[#181920] text-gray-200 border border-white/5 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAiSend} className="p-3 border-t border-white/5 bg-[#181920] flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask Aura about routines, exercises, chest, hydration..."
                className="flex-1 bg-[#121318] border border-white/10 rounded-full px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 12. LEGAL MODAL (PRIVACY POLICY & TERMS OF SERVICE)       */}
      {/* ======================================================== */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14151b] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-xl font-display font-bold uppercase text-white">
                {legalModal === 'privacy' ? 'FitFlow Privacy Policy' : 'FitFlow Terms of Service'}
              </h3>
              <button 
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {legalModal === 'privacy' ? (
              <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <p><strong>1. Data Collection:</strong> FitFlow collects user-provided fitness metrics, daily hydration logs, workout session records, and account credentials to generate personalized athletic recommendations.</p>
                <p><strong>2. Biometric and AI Processing:</strong> Any form correction, computer vision estimation, or workout calculations processed by Aura AI Coach are encrypted and used strictly for athletic telemetry.</p>
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
                type="button"
                onClick={() => setLegalModal(null)}
                className="bg-[#ef233c] hover:bg-[#d90429] text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
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