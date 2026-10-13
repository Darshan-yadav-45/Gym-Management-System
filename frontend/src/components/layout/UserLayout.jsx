import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Crown, 
  Clock, 
  MessageSquare, 
  X, 
  Send, 
  ListChecks, 
  Dumbbell, 
  RotateCcw, 
  User as UserIcon,
  Activity,
  Home,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { authService } from '../../services/authService';

export default function UserLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Discount countdown timer (starts around 04:25)
  const [secondsLeft, setSecondsLeft] = useState(265); // 4m 25s

  // AI chat modal state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', text: 'Hi! I am FitAI Coach. How can I help power your workout today?' }
  ]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  // Real countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 265));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAiSend = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput.trim();
    setAiMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setAiInput('');

    setTimeout(() => {
      let reply = "Great question! To maximize your progress, focus on consistent form, 3L daily water hydration, and hitting 140g protein.";
      const lower = userMsg.toLowerCase();
      if (lower.includes('chest') || lower.includes('push')) {
        reply = "For Chest development, focus on full range of motion during Push-ups and Dumbbell Bench Press with 3 sets of 10 reps.";
      } else if (lower.includes('tricep') || lower.includes('dip')) {
        reply = "Diamond Push-ups and Bench Dips target the lateral & long heads of the triceps. Keep your elbows tucked close to your torso.";
      } else if (lower.includes('water')) {
        reply = "Aim for 3,000 ml today! Drink 250ml every 2 hours to keep performance peak.";
      }
      setAiMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    }, 600);
  };

  const handleSignOut = () => {
    authService.logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070A18] text-white flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Active navigation checker
  const pathname = location.pathname;
  const isHome = pathname === '/dashboard';
  const isRoutines = pathname === '/dashboard/routines';
  const isExercises = pathname === '/dashboard/exercises';
  const isWorkout = pathname === '/dashboard/workout';
  const isRecover = pathname === '/dashboard/recover';
  const isAccount = pathname === '/dashboard/account';

  const navLinks = [
    { name: 'Home', path: '/dashboard', icon: Home, active: isHome },
    { name: 'Routines', path: '/dashboard/routines', icon: ListChecks, active: isRoutines },
    { name: 'Exercises', path: '/dashboard/exercises', icon: Activity, active: isExercises },
    { name: 'Workout', path: '/dashboard/workout', icon: Dumbbell, active: isWorkout },
    { name: 'Recover', path: '/dashboard/recover', icon: RotateCcw, active: isRecover },
    { name: 'Account', path: '/dashboard/account', icon: UserIcon, active: isAccount },
  ];

  return (
    <div className="min-h-screen bg-[#060913] text-white font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* ======================================================== */}
      {/* TOP FULL-WIDTH HEADER / NAVBAR                           */}
      {/* ======================================================== */}
      <header className="w-full bg-[#080B1A]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Left: FitAI Branding */}
          <Link to="/dashboard" className="flex items-center gap-2 group cursor-pointer">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white group-hover:opacity-90 transition-opacity">
              Fit<span className="text-[#00A3FF]">AI</span>
            </span>
          </Link>

          {/* Center: Desktop Navigation Bar Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#101429] p-1.5 rounded-2xl border border-white/5 shadow-inner">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    item.active
                      ? 'bg-[#18234D] text-[#00A3FF] shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Timer, Try For Free, User Avatar & Logout */}
          <div className="flex items-center gap-3">
            {/* Desktop Discount Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-[#00D632]/10 border border-[#00D632]/30 text-[#00D632] px-3 py-1.5 rounded-full text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>80% off:</span>
              <span className="font-mono bg-[#00D632] text-black px-1.5 py-0.5 rounded text-[11px] font-black">
                {formatTimer(secondsLeft)}
              </span>
            </div>

            {/* TRY FOR FREE Badge */}
            <button
              onClick={() => alert("You're currently enjoying the FitAI Pro preview!")}
              className="bg-[#00D632] hover:bg-[#00c02c] text-[#071307] font-black text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 tracking-wider uppercase shadow-[0_0_15px_rgba(0,214,50,0.35)] transition-all transform active:scale-95"
            >
              <span className="hidden sm:inline">TRY FOR FREE</span>
              <span className="sm:hidden">PRO</span>
              <Crown className="w-3.5 h-3.5 fill-[#071307] text-[#071307]" />
            </button>

            {/* User Profile Avatar Link */}
            <Link
              to="/dashboard/account"
              className="flex items-center gap-2 pl-2 border-l border-white/10 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00A3FF] to-[#6366F1] flex items-center justify-center text-xs font-black text-white group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden xl:inline text-xs font-bold text-gray-200 group-hover:text-white">
                {user?.name?.split(' ')[0]}
              </span>
            </Link>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="hidden sm:flex p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN FULL-WIDTH CONTENT CONTAINER                        */}
      {/* ======================================================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12">
        {children}
      </main>

      {/* ======================================================== */}
      {/* FLOATING ACTION BUTTONS (COUNTDOWN & AI ASSISTANT)       */}
      {/* ======================================================== */}
      <div className="fixed bottom-24 md:bottom-8 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Mobile-only Discount pill badge */}
        <div className="lg:hidden bg-[#00D632] text-[#071307] px-3.5 py-1.5 rounded-full shadow-[0_4px_20px_rgba(0,214,50,0.45)] flex items-center gap-2 font-black text-xs tracking-tight border border-[#52ff7d] animate-pulse">
          <div className="bg-white rounded-full p-0.5">
            <Clock className="w-3.5 h-3.5 text-[#00D632]" />
          </div>
          <span>80% discount!</span>
          <span className="text-white bg-black/80 px-2 py-0.5 rounded-full text-xs font-mono font-bold tracking-widest">
            {formatTimer(secondsLeft)}
          </span>
        </div>

        {/* Circular AI Assistant FAB */}
        <button
          onClick={() => setIsAiOpen(true)}
          title="Chat with FitAI Coach"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#00A3FF] via-[#6366F1] to-[#C084FC] p-3 shadow-[0_4px_30px_rgba(99,102,241,0.6)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform"
        >
          <Sparkles className="w-7 h-7 fill-white" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (SHOWN ON MOBILE ONLY)       */}
      {/* ======================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-gradient-to-t from-black via-[#080B1A] to-[#080B1A]/95 backdrop-blur-xl border-t border-white/5">
        <div className="w-full flex items-center justify-around py-2 px-2">
          
          {/* 1. Routines */}
          <button
            onClick={() => navigate('/dashboard/routines')}
            className={`flex flex-col items-center justify-center transition-colors min-w-[56px] py-1 ${
              isRoutines ? 'text-[#00A3FF]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className={`p-1.5 rounded-full ${isRoutines ? 'bg-[#18234D] px-4' : ''}`}>
              <ListChecks className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold mt-0.5">Routines</span>
          </button>

          {/* 2. Exercises */}
          <button
            onClick={() => navigate('/dashboard/exercises')}
            className={`flex flex-col items-center justify-center transition-colors min-w-[56px] py-1 ${
              isExercises ? 'text-[#00A3FF]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className={`p-1.5 rounded-full ${isExercises ? 'bg-[#18234D] px-4' : ''}`}>
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold mt-0.5">Exercises</span>
          </button>

          {/* 3. Workout */}
          <button
            onClick={() => navigate('/dashboard/workout')}
            className={`flex flex-col items-center justify-center transition-colors min-w-[56px] py-1 ${
              isWorkout ? 'text-[#00A3FF]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className={`p-1.5 rounded-full ${isWorkout ? 'bg-[#18234D] px-4' : ''}`}>
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold mt-0.5">Workout</span>
          </button>

          {/* 4. Recover */}
          <button
            onClick={() => navigate('/dashboard/recover')}
            className={`flex flex-col items-center justify-center transition-colors min-w-[56px] py-1 ${
              isRecover ? 'text-[#00A3FF]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className={`p-1.5 rounded-full ${isRecover ? 'bg-[#18234D] px-4' : ''}`}>
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold mt-0.5">Recover</span>
          </button>

          {/* 5. Account */}
          <button
            onClick={() => navigate('/dashboard/account')}
            className={`flex flex-col items-center justify-center transition-colors min-w-[56px] py-1 ${
              isAccount ? 'text-[#00A3FF]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className={`p-1.5 rounded-full ${isAccount ? 'bg-[#18234D] px-4' : ''}`}>
              <UserIcon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold mt-0.5">Account</span>
          </button>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* FITAI ASSISTANT DIALOG                                    */}
      {/* ======================================================== */}
      {isAiOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#12162B] border border-blue-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 bg-[#191E3B] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00A3FF] to-[#A855F7] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">FitAI Coach Assistant</h3>
                  <p className="text-[11px] text-green-400">● Online & Ready</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat content */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 min-h-[260px]">
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-[#1D2344] text-gray-200 border border-white/5 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleAiSend} className="p-3 border-t border-white/10 bg-[#151933] flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask FitAI about exercises, form, hydration..."
                className="flex-1 bg-[#0D1022] text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
