import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Target, 
  Trophy, 
  Droplets, 
  Footprints, 
  TrendingUp, 
  LogOut, 
  Edit3, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import UserLayout from '../components/layout/UserLayout';
import { authService } from '../services/authService';
import { coachService } from '../services/coachService';
import api from '../services/api';
import { Bot, Crown, ArrowRight } from 'lucide-react';

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [activeCoach, setActiveCoach] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    // Fetch fresh profile data
    api.get('/users/me')
      .then(res => {
        setProfileData(res.data);
      })
      .catch(err => {
        // Fallback to localStorage user
        setProfileData(currentUser);
      })
      .finally(() => setLoading(false));

    // Fetch active coach and subscription
    coachService.getMyCoach()
      .then(c => setActiveCoach(c))
      .catch(() => {});

    coachService.getMySubscription()
      .then(s => setSubscription(s))
      .catch(() => {});
  }, [navigate]);

  const handleSignOut = () => {
    authService.logout();
    navigate('/');
  };

  const displayUser = profileData || user;

  const getSportEmoji = (sport) => {
    const map = {
      'Cricket': '🏏',
      'Football': '⚽',
      'Badminton': '🏸',
      'Basketball': '🏀',
      'Tennis': '🎾',
      'Volleyball': '🏐',
      'Swimming': '🏊',
      'Running': '🏃',
      'Kabaddi': '🤼',
    };
    return map[sport] || '🏅';
  };

  return (
    <UserLayout>
      <div className="space-y-6 pb-12">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-1">
              ATHLETE PROFILE
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black uppercase text-white tracking-tight">Account & Profile</h1>
            <p className="text-xs text-gray-400">Manage your credentials, metrics targets, and athletic profile</p>
          </div>

          <button
            onClick={() => navigate('/profile-setup')}
            className="bg-[#14151b] hover:bg-[#ef233c] hover:border-[#ef233c] border border-white/10 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* User Identity Card */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ef233c] to-[#d90429] flex items-center justify-center text-2xl font-black text-white shadow-[0_4px_20px_rgba(239,35,60,0.35)] border border-white/10">
              {displayUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-display font-bold uppercase text-white">{displayUser?.name || 'Athlete'}</h2>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-gray-500" /> {displayUser?.email}
              </p>
              {displayUser?.phone && (
                <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-gray-500" /> {displayUser?.phone}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/5 text-center">
            <div className="bg-[#181920] border border-white/5 p-3 rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Age</span>
              <span className="text-sm font-black text-white mt-0.5 block">{displayUser?.age || '--'}</span>
            </div>
            <div className="bg-[#181920] border border-white/5 p-3 rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Gender</span>
              <span className="text-sm font-black text-white mt-0.5 block">{displayUser?.gender || '--'}</span>
            </div>
            <div className="bg-[#181920] border border-white/5 p-3 rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Height</span>
              <span className="text-sm font-black text-white mt-0.5 block">{displayUser?.heightCm ? `${displayUser.heightCm}cm` : '--'}</span>
            </div>
            <div className="bg-[#181920] border border-white/5 p-3 rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Weight</span>
              <span className="text-sm font-black text-white mt-0.5 block">{displayUser?.weightKg ? `${displayUser.weightKg}kg` : '--'}</span>
            </div>
          </div>
        </div>

        {/* Active AI Coach & Membership Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Active AI Coach Card */}
          <div className="bg-[#14151b] border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-[#ef233c] uppercase tracking-wider flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" /> Assigned AI Coach
                </span>
                {activeCoach?.tier === 'PREMIUM' && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    Pro Coach
                  </span>
                )}
              </div>

              {activeCoach ? (
                <div className="flex items-center gap-3.5">
                  <img 
                    src={activeCoach.avatarUrl} 
                    alt={activeCoach.displayName} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                  />
                  <div>
                    <h4 className="text-base font-black text-white uppercase tracking-wide">
                      {activeCoach.displayName}
                    </h4>
                    <p className="text-xs text-gray-400">{activeCoach.specialization}</p>
                    <p className="text-[11px] text-emerald-400 mt-0.5 font-medium">
                      Active guidance during workouts
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400 py-2">
                  No AI Coach selected yet. Choose an AI coach to get personalized workout cues and motivation.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => navigate('/trainers')}
                className="w-full bg-[#181920] hover:bg-[#ef233c] text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>{activeCoach ? 'Change AI Coach' : 'Choose AI Coach'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subscription & Membership Status Card */}
          <div className="bg-[#14151b] border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" /> Membership & Tier
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                  subscription?.status === 'ACTIVE' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : subscription?.status === 'EXPIRING_SOON'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-white/5 text-gray-400 border-white/10'
                }`}>
                  {subscription?.status || 'FREE TIER'}
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg font-black text-white uppercase tracking-wide">
                  {subscription?.planName || 'FitFlow Free Plan'}
                </h4>
                <p className="text-xs text-gray-400">
                  {subscription?.isPremiumActive 
                    ? 'Access to all 14 AI coaches, full 3D biomechanical demos, and advanced analytics.' 
                    : 'Access to 8 Free AI coaches, 3D exercise demonstrations, and daily tracking.'}
                </p>
                {subscription?.endDate && (
                  <p className="text-[11px] text-gray-400 pt-1">
                    Valid until: <strong className="text-white">{subscription.endDate}</strong>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-400">
                Auto-renew: <strong className="text-white">{subscription?.autoRenew ? 'Enabled' : 'Disabled'}</strong>
              </span>
              <button
                type="button"
                onClick={() => navigate('/trainers')}
                className="text-[#ef233c] hover:underline font-bold uppercase text-[11px]"
              >
                Explore Pro Coaches
              </button>
            </div>
          </div>

        </div>

        {/* Personal Fitness Targets Card */}
        <div className="bg-[#14151b] border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#ef233c]" />
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
              Personal Daily Fitness Targets
            </h3>
          </div>

          <div className="space-y-3">
            {/* Water Target */}
            <div className="bg-[#181920] p-3.5 rounded-xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Daily Water Target</h4>
                  <p className="text-[10px] text-gray-400">Optimal hydration & cellular volume</p>
                </div>
              </div>
              <span className="text-xs font-mono font-black text-cyan-400">3,000 ml (3L)</span>
            </div>

            {/* Steps Target */}
            <div className="bg-[#181920] p-3.5 rounded-xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ef233c]/15 text-[#ef233c] flex items-center justify-center">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Daily Step Target</h4>
                  <p className="text-[10px] text-gray-400">Active non-exercise physical expenditure</p>
                </div>
              </div>
              <span className="text-xs font-mono font-black text-white">10,000 Steps</span>
            </div>

            {/* Protein Target */}
            <div className="bg-[#181920] p-3.5 rounded-xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Daily Protein Target</h4>
                  <p className="text-[10px] text-gray-400">Muscle recovery & hypertrophy protein synthesis</p>
                </div>
              </div>
              <span className="text-xs font-mono font-black text-emerald-400">140 Grams</span>
            </div>
          </div>
        </div>

        {/* Location & Sports */}
        {(displayUser?.location || displayUser?.designation || (displayUser?.sports && displayUser.sports.length > 0)) && (
          <div className="bg-[#14151b] border border-white/5 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Profile Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {displayUser?.location && (
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#ef233c]" /> Location
                  </span>
                  <span className="text-white font-bold mt-1 block">{displayUser.location}</span>
                </div>
              )}

              {displayUser?.designation && (
                <div className="bg-[#181920] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[#ef233c]" /> Designation
                  </span>
                  <span className="text-white font-bold mt-1 block">{displayUser.designation}</span>
                </div>
              )}
            </div>

            {displayUser?.sports && displayUser.sports.length > 0 && displayUser.sports[0] !== 'NONE' && (
              <div className="pt-2">
                <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-2">Sports Interests</span>
                <div className="flex flex-wrap gap-2">
                  {displayUser.sports.map((sp, i) => (
                    <span key={i} className="bg-[#181920] text-xs font-semibold px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-1.5 text-gray-300">
                      <span>{getSportEmoji(sp)}</span>
                      <span className="capitalize">{sp.toLowerCase()}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sign Out Button */}
        <div className="pt-2">
          <button
            onClick={handleSignOut}
            className="w-full bg-[#ef233c]/10 hover:bg-[#ef233c]/20 text-[#ef233c] border border-[#ef233c]/30 font-bold uppercase tracking-wider py-3.5 rounded-full text-xs transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </UserLayout>
  );
}
