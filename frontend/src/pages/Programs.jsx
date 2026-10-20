import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Zap, Flame, Heart, Target, Dumbbell, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Programs() {
  const programs = [
    {
      id: "muscle-building",
      title: "Muscle Building",
      category: "Hypertrophy",
      level: "Intermediate/Advanced",
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
      level: "All Levels",
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
      level: "All Levels",
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
      level: "Intermediate/Advanced",
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
      level: "All Levels",
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
      level: "Advanced",
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
      level: "Beginner Friendly",
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
      level: "All Levels",
      duration: "8 Weeks",
      schedule: "3-4 Days/Wk",
      desc: "Cardiovascular VO2 max expansion, lactate threshold pacing, and energetic stamina conditioning.",
      image: "https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=800&auto=format&fit=crop",
      tags: ["VO2 Max", "Endurance", "Stamina"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-200 font-sans selection:bg-[#ef233c] selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center text-2xl sm:text-3xl font-black font-display tracking-[0.15em] text-white">
            FIT<span className="text-[#ef233c] font-black">FLOW</span>
          </Link>
          <div className="hidden md:flex gap-9 text-xs font-bold tracking-widest uppercase text-gray-300">
            <Link to="/" className="hover:text-[#ef233c] transition-colors">HOME</Link>
            <Link to="/programs" className="text-[#ef233c] transition-colors">PROGRAMS</Link>
            <Link to="/trainers" className="hover:text-[#ef233c] transition-colors">TRAINERS</Link>
            <Link to="/login" className="hover:text-[#ef233c] transition-colors">LOGIN</Link>
          </div>
          <Link 
            to="/register" 
            className="bg-[#ef233c] hover:bg-[#d90429] text-white px-6 py-2.5 rounded font-bold uppercase tracking-widest text-xs transition-all shadow-[0_4px_16px_rgba(239,35,60,0.35)] hover:-translate-y-0.5"
          >
            JOIN NOW
          </Link>
        </div>
      </header>

      {/* Header Section */}
      <div className="relative pt-24 pb-16 px-4 sm:px-8 text-center bg-[#121318] border-b border-white/5">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-3">
            TRAINING PROTOCOLS
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight text-white mb-4">
            ELITE <span className="text-[#ef233c]">PROGRAMS</span>
          </h1>
          <div className="w-16 h-1 bg-[#ef233c] mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Choose from scientifically periodized training programs tailored to your precise athletic goals.
          </p>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((prog) => (
            <div 
              key={prog.id} 
              className="group relative bg-[#14151b] border border-white/5 hover:border-[#ef233c]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Image Section */}
                <div className="h-52 w-full relative overflow-hidden bg-[#181920]">
                  <img 
                    src={prog.image} 
                    alt={prog.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14151b] via-black/40 to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-white">
                    {prog.level}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#ef233c] px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-white shadow-md">
                    {prog.duration}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-lg font-display font-bold uppercase tracking-wide text-white group-hover:text-[#ef233c] transition-colors mb-2">
                    {prog.title}
                  </h3>
                  
                  <p className="text-gray-400 text-xs leading-relaxed mb-4 min-h-[44px]">
                    {prog.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {prog.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold tracking-wider uppercase bg-[#181920] border border-white/5 px-2 py-0.5 rounded text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="px-6 pb-6 pt-3 border-t border-white/5">
                <Link 
                  to="/register" 
                  className="flex items-center justify-between text-xs font-bold tracking-wider uppercase text-white hover:text-[#ef233c] transition-colors"
                >
                  <span>Start Program</span>
                  <div className="w-7 h-7 rounded-full bg-[#181920] group-hover:bg-[#ef233c] group-hover:text-white flex items-center justify-center transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Call to Action Footer Banner */}
      <div className="border-t border-white/5 bg-[#121318] py-20 px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-3">
            NEED GUIDANCE?
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-white mb-4">
            NOT SURE WHERE TO <span className="text-[#ef233c]">START?</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Create an account and our intelligent onboarding system will analyze your baseline metrics and recommend the optimal program.
          </p>
          <Link 
            to="/register" 
            className="bg-[#ef233c] hover:bg-[#d90429] text-white px-10 py-4 rounded-full uppercase tracking-wider font-bold text-xs transition-all shadow-[0_4px_20px_rgba(239,35,60,0.4)] hover:-translate-y-0.5 inline-block"
          >
            Get Your Custom Plan
          </Link>
        </div>
      </div>
    </div>
  );
}
