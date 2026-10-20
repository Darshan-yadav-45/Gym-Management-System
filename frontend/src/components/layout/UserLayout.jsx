import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Sparkles, 
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
  ChevronDown,
  Bot,
  Users,
  ShieldCheck,
  Menu
} from 'lucide-react';
import { authService } from '../../services/authService';

export default function UserLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // AI chat modal state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', text: 'Hi! I am FitFlow AI Coach. How can I help power your workout today?' }
  ]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

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
      <div className="min-h-screen bg-[#0b0c10] text-white flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-4 border-[#ef233c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Active navigation checker
  const pathname = location.pathname;
  const isWebsiteHome = pathname === '/';
  const isRoutines = pathname === '/dashboard/routines' || pathname === '/dashboard';
  const isExercises = pathname === '/dashboard/exercises';
  const isWorkout = pathname === '/dashboard/workout';
  const isTrainers = pathname === '/trainers' || pathname.startsWith('/trainers/');
  const isRecover = pathname === '/dashboard/recover';
  const isAccount = pathname === '/dashboard/account' || pathname === '/profile';

  const navLinks = [
    { name: 'Home', path: '/', icon: Home, active: isWebsiteHome },
    { name: 'Routines', path: '/dashboard/routines', icon: ListChecks, active: isRoutines },
    { name: 'Exercises', path: '/dashboard/exercises', icon: Activity, active: isExercises },
    { name: 'Workout', path: '/dashboard/workout', icon: Dumbbell, active: isWorkout },
    { name: 'Coaches', path: '/trainers', icon: Users, active: isTrainers },
    { name: 'Recover', path: '/dashboard/recover', icon: RotateCcw, active: isRecover },
    { name: 'Account', path: '/dashboard/account', icon: UserIcon, active: isAccount },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-200 font-sans flex flex-col selection:bg-[#ef233c] selection:text-white">
      
      {/* ======================================================== */}
      {/* TOP HEADER / NAVBAR (Matching Screenshot 2)              */}
      {/* ======================================================== */}
      <header className="w-full bg-[#14151b]/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: FitFlow Branding */}
          <Link to="/" className="flex items-center gap-1 group cursor-pointer shrink-0">
            <span className="text-2xl sm:text-3xl font-black font-display tracking-[0.15em] text-white group-hover:opacity-90 transition-opacity">
              FIT<span className="text-[#ef233c] font-black italic">FLOW</span>
            </span>
          </Link>

          {/* Center: Desktop Navigation Bar Links in Rounded Dark Container */}
          <div className="hidden md:flex flex-1 justify-center mx-2 lg:mx-4">
            <nav className="flex items-center gap-1 bg-[#121318] p-1.5 rounded-full border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-3.5 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      item.active
                        ? 'bg-[#ef233c] text-white shadow-[0_0_16px_rgba(239,35,60,0.55)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: User Avatar, Admin Badge & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Admin Console Link for Admins */}
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 text-[#ef233c] hover:bg-red-500/30 border border-[#ef233c]/40 text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(239,35,60,0.3)]"
                title="Open FitFlow Admin Console"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#ef233c]" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* User Profile Avatar Link */}
            <Link
              to="/dashboard/account"
              className="flex items-center gap-2 pl-2 border-l border-white/10 group cursor-pointer"
              title="View Account Profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ef233c] to-[#d90429] flex items-center justify-center text-xs font-black text-white group-hover:scale-105 transition-transform shadow-[0_2px_10px_rgba(239,35,60,0.3)]">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden xl:inline text-xs font-bold text-gray-200 group-hover:text-white">
                {user?.name?.split(' ')[0] || 'Athlete'}
              </span>
            </Link>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 text-gray-400 hover:text-[#ef233c] hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#ef233c]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Header Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#121318]/98 backdrop-blur-xl border-b border-white/10 px-4 py-4 space-y-2 text-xs font-bold uppercase tracking-wider shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    item.active
                      ? 'bg-[#ef233c] text-white shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-gray-400 text-xs">{user?.name}</span>
              <button
                onClick={handleSignOut}
                className="text-[#ef233c] text-xs font-bold uppercase flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ======================================================== */}
      {/* MAIN FULL-WIDTH CONTENT CONTAINER                        */}
      {/* ======================================================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12">
        {children}
      </main>

      {/* ======================================================== */}
      {/* FLOATING ACTION BUTTON (AI ASSISTANT)                    */}
      {/* ======================================================== */}
      <div className="fixed bottom-24 md:bottom-8 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        <button
          onClick={() => setIsAiOpen(true)}
          title="Chat with FitFlow AI Coach"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#ef233c] to-[#b7094c] p-3 shadow-[0_4px_25px_rgba(239,35,60,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform cursor-pointer"
        >
          <Sparkles className="w-7 h-7 fill-white" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (SHOWN ON MOBILE ONLY)       */}
      {/* ======================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-[#14151b]/98 backdrop-blur-xl border-t border-white/10 shadow-2xl">
        <div className="w-full flex items-center justify-around py-1.5 px-1 overflow-x-auto no-scrollbar">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center transition-colors min-w-[44px] py-1 px-1.5 rounded-xl cursor-pointer ${
                  item.active ? 'text-[#ef233c]' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className={`p-1 rounded-full ${item.active ? 'bg-[#ef233c]/15 px-2.5' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold mt-0.5 tracking-tight">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ======================================================== */}
      {/* FITFLOW AI ASSISTANT DIALOG                               */}
      {/* ======================================================== */}
      {isAiOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#14151b] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 bg-[#181920] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ef233c] to-[#b7094c] flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display uppercase tracking-wide text-white">FitFlow AI Coach</h3>
                  <p className="text-[11px] text-emerald-400 font-semibold">● Active & Ready</p>
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
                        ? 'bg-[#ef233c] text-white rounded-br-sm shadow-md font-medium'
                        : 'bg-[#181920] text-gray-200 border border-white/5 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleAiSend} className="p-3 border-t border-white/5 bg-[#181920] flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask FitFlow AI about exercises, form, hydration..."
                className="flex-1 bg-[#101116] text-white text-xs sm:text-sm px-4 py-2.5 rounded-full border border-white/10 focus:outline-none focus:border-[#ef233c]"
              />
              <button
                type="submit"
                className="bg-[#ef233c] hover:bg-[#d90429] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-1 transition-colors shadow-[0_2px_12px_rgba(239,35,60,0.4)] cursor-pointer"
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
